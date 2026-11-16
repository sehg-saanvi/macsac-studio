import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/nemotron-3.5-super-vl-120b-a12b';
const FALLBACK_MODEL = 'meta/llama-3.1-70b-instruct';

// Concurrency queue to protect against NVIDIA API burst rate limits (429)
let activeNvidiaRequests = 0;
const MAX_CONCURRENT_REQUESTS = 2;
const requestQueue: Array<() => void> = [];

function acquireQueueSlot(): Promise<void> {
  return new Promise((resolve) => {
    if (activeNvidiaRequests < MAX_CONCURRENT_REQUESTS) {
      activeNvidiaRequests++;
      resolve();
    } else {
      requestQueue.push(() => {
        activeNvidiaRequests++;
        resolve();
      });
    }
  });
}

function releaseQueueSlot(): void {
  activeNvidiaRequests--;
  if (requestQueue.length > 0) {
    const next = requestQueue.shift();
    if (next) next();
  }
}

async function callNvidiaWithRetry(
  apiKey: string,
  modelName: string,
  formattedMessages: any[],
  maxRetries = 3
): Promise<{ ok: boolean; status: number; data?: any; errorText?: string }> {
  let attempt = 0;
  let currentModel = modelName;

  while (attempt < maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65-second timeout protection

    try {
      const response = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel,
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 4096,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return { ok: true, status: response.status, data };
      }

      const errorText = await response.text();
      console.warn(
        `[AI Agent Middleware] Attempt ${attempt}/${maxRetries} failed with status ${response.status} (model: ${currentModel}):`,
        errorText.slice(0, 160)
      );

      // If rate limited (429) or server temporarily overloaded (503, 504)
      if (response.status === 429 || response.status === 503 || response.status === 504) {
        // If this was attempt >= 2 and still hitting rate limits, switch to fast fallback model
        if (attempt >= 2 && currentModel !== FALLBACK_MODEL) {
          console.info(`[AI Agent Middleware] Switching to fallback model: ${FALLBACK_MODEL}`);
          currentModel = FALLBACK_MODEL;
        }

        const retryAfterHeader = response.headers.get('retry-after');
        const waitMs = retryAfterHeader
          ? Math.min(parseInt(retryAfterHeader, 10) * 1000, 6000)
          : Math.min(attempt * 1500, 5000);

        console.info(`[AI Agent Middleware] Backing off for ${waitMs}ms before retry...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      // If client error other than 429 (e.g. 400), return error directly
      return { ok: false, status: response.status, errorText };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isAbort = err.name === 'AbortError';
      console.warn(
        `[AI Agent Middleware] Attempt ${attempt}/${maxRetries} caught exception (${isAbort ? 'Timeout' : err.message})`
      );

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, attempt * 1200));
        continue;
      }
      return {
        ok: false,
        status: 504,
        errorText: isAbort ? 'AI reasoning service timed out after 65 seconds' : err.message,
      };
    }
  }

  return { ok: false, status: 502, errorText: 'All retry attempts exhausted.' };
}

/**
 * Loads NVIDIA API key securely from environment variables or .env file.
 * Kept strictly server-side and never exposed to the client.
 */
function getApiKey(): string {
  if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY.trim()) {
    return process.env.NVIDIA_API_KEY.trim();
  }

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('NVIDIA_API_KEY=')) {
          const val = trimmed.substring('NVIDIA_API_KEY='.length).trim();
          process.env.NVIDIA_API_KEY = val;
          return val;
        }
      }
    }
  } catch (err) {
    console.warn('[AI Agent Middleware] Could not read .env file:', err);
  }

  return '';
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
  });
}

function buildSystemPrompt(currentProject: any, activePageId?: string, agentContext?: any): string {
  let projectSummary = 'No project loaded yet (user is on platform home page).';
  let activePageDetails = '';

  if (currentProject) {
    const activePage =
      currentProject.pages?.find((p: any) => p.id === (activePageId || currentProject.activePageId)) ||
      currentProject.pages?.[0];

    const sectionsList = (activePage?.sections || [])
      .map(
        (s: any, i: number) =>
          `  ${i + 1}. [ID: "${s.id}"] Type: "${s.type}" | Title: "${s.title}" | Items: ${s.items?.length || 0} | Layout: ${s.layoutVariant || 'standard'}`
      )
      .join('\n');

    projectSummary = `
- Project Name: "${currentProject.name}"
- Active Template: "${currentProject.templateName}" (ID: ${currentProject.templateId})
- Brand Name: "${currentProject.navigation?.brandName || 'Untitled'}"
- Theme: "${currentProject.theme?.name}" (${currentProject.theme?.mode || 'light'} mode, primary: ${currentProject.theme?.primaryColor})
- Total Pages: ${currentProject.pages?.length || 1} [${(currentProject.pages || []).map((p: any) => `${p.name} (/${p.slug})`).join(', ')}]
- Active Page: "${activePage?.name || 'Home'}" (Slug: /${activePage?.slug || 'home'})
`;

    activePageDetails = `
Sections currently on active page "${activePage?.name || 'Home'}":
${sectionsList || '  (No sections yet)'}
`;
  }

  let contextMemory = '';
  if (agentContext && Object.keys(agentContext).length > 0) {
    contextMemory = `
Stored Conversation & Business Memory:
- Business Name: ${agentContext.businessName || 'Unknown'}
- Business Type / Industry: ${agentContext.businessType || 'Unknown'}
- Target Audience: ${agentContext.targetAudience || 'Unknown'}
- Previously Recommended Tools: ${JSON.stringify(agentContext.recommendedTools || [])}
- Already Configured Features: ${JSON.stringify(agentContext.configuredFeatures || [])}
- Collected Information: ${JSON.stringify(agentContext.collectedInfo || {})}
`;
  }

  return `You are the Macsac Studio AI Website Setup & Management Agent.
You are an expert web consultant, business advisor, and website architect for the Macsac Studio platform.

ABOUT MACSAC STUDIO PLATFORM:
MACSAC Studio is a visual website builder with 27 curated multi-page templates across Business, Hospitality, Technology, Portfolio, Store, Events, and Education.
The platform operates on real, editable website projects with:
1. Multi-Page Architecture: Every website can have multiple pages (e.g., Home, Menu, About, Services, Contact, Blog).
2. 12 Section Types:
   - "hero": Main showcase with headline, badge, subtitle, CTA buttons, and high-impact imagery.
   - "about": Story, mission, team values, and counter statistics.
   - "services": Capabilities grid or list with custom Lucide icons.
   - "features": Strength cards highlighting unique value propositions.
   - "portfolio": Showcase grid / masonry for projects, gallery items, or products with price tags.
   - "testimonials": Client reviews with 5-star ratings, author photos, and roles.
   - "team": Team member profiles with roles and photos.
   - "pricing": Transparent pricing tiers with feature bullets, badges ("MOST POPULAR"), and action buttons.
   - "faq": Accordion question-and-answer knowledge base.
   - "contact": Inquiry form, direct WhatsApp contact, phone, address, and email details.
   - "newsletter": Lead capture subscription box with instant confirmation.
   - "cta": Bold conversion banner with primary & secondary buttons.
3. 6 Theme Presets & Full Styling:
   - "macsac-copper" (Luxury warm copper & cream, #b1704e)
   - "obsidian-cyber" (Dark neon cyber blue, #38bdf8)
   - "editorial-sand" (Refined serif atelier, #78350f)
   - "nordic-clean" (Minimalist slate & white, #0f172a)
   - "emerald-botanic" (Organic fresh botanical emerald, #059669)
   - "royal-luxury" (Imperial gold & onyx, #d4af37)
4. Real Platform Integrations:
   - "whatsapp": Direct click-to-chat WhatsApp button (https://wa.me/...) with pre-filled message.
   - "booking": Appointment scheduling linked to inquiry form or anchor.
   - "newsletter": Email subscription funnel.
   - "ecommerce_catalog": Product showcase with price badges and inquiry buttons.
   - "code_export": 100% clean HTML5/CSS3/JS ZIP export.

CURRENT LIVE WEBSITE CONTEXT:
${projectSummary}
${activePageDetails}
${contextMemory}

AVAILABLE PLATFORM TOOLS FOR EXECUTION:
1. select_template(templateId, brandName, keywords)
2. add_section(type, title, subtitle, description, badge, layoutVariant, items)
3. update_section(sectionId, updates)
4. remove_section(sectionId)
5. reorder_sections(fromIndex, toIndex)
6. add_section_item(sectionId, item: { title, description, subtitle, tag, price, period, icon, image, stars, author, role })
7. update_section_item(sectionId, itemId, updates)
8. remove_section_item(sectionId, itemId)
9. add_page(name, slug)
10. switch_page(pageIdOrSlug)
11. delete_page(pageId)
12. apply_theme(presetId, primaryColor, secondaryColor, bgColor, textColor, headingFont, bodyFont, mode)
13. update_navigation(brandName, logoText, logoImage, ctaText, ctaUrl)
14. update_footer(brandName, tagline, copyright)
15. configure_integration(integrationType: "whatsapp" | "booking" | "newsletter" | "ecommerce_catalog", details)

BEHAVIORAL GUIDELINES:
1. Act as a thoughtful, professional website consultant.
2. CONSULTATIVE WORKFLOW:
   - When the user shares a new business concept without asking to execute immediately, offer consultative analysis with 2-3 recommendations and ask for permission to configure.
3. IMMEDIATE EXECUTION & MULTI-TASKING:
   - When the user asks you to create, set up, modify, or change features (e.g. "set it up", "add testimonials and an FAQ", "change the theme to dark and add WhatsApp ordering"), you MUST EXECUTE THEM IMMEDIATELY via \`proposed_actions\`.
   - IMPORTANT: If the user requests MULTIPLE tasks or changes in a single message, YOU MUST PROVIDE AN ACTION FOR EACH TASK IN \`proposed_actions\`! Do NOT stop at only one action.
   - For example, if user asks: "Add testimonials, add FAQ, and change theme to obsidian", your \`proposed_actions\` array MUST contain 3 actions: [add_section(testimonials), add_section(faq), apply_theme(obsidian-cyber)].
4. COPYWRITING QUALITY:
   - Always write customized, realistic, high-grade copywriting tailored directly to the user's specific business. Never use generic placeholder text like "Lorem ipsum" or "Section Title".
5. CONTINUOUS CONTEXT & EFFICIENCY:
   - Build upon previous actions. If you already created a page or section in an earlier prompt, reference its ID or type.
   - Keep actions focused and direct. Do not ask redundant questions if information was already provided or is known in the project context.
6. SAFETY:
   - Set \`requiresConfirmation: true\` ONLY for destructive actions (deleting an entire page or removing a section).
   - Set \`requiresConfirmation: false\` for adding sections, updating styles, changing themes, and configuring integrations so they apply smoothly.

RESPONSE FORMAT:
You MUST respond with a valid JSON object matching this schema:
{
  "message": "Conversational explanation to the user in a friendly, consultative tone...",
  "recommendations": [
    {
      "id": "rec-1",
      "title": "Feature / Section Name",
      "description": "Short summary of what will be added",
      "reason": "Why this is critical for the user's business",
      "tool": "tool_name",
      "parameters": { ... }
    }
  ],
  "proposed_actions": [
    {
      "id": "act-1",
      "tool": "add_section",
      "name": "Add Section Name",
      "description": "Description of modification",
      "parameters": { ... },
      "requiresConfirmation": false
    }
  ],
  "updatedContext": {
    "businessName": "Extracted or updated business name",
    "businessType": "Extracted or updated business type",
    "targetAudience": "Extracted or updated audience"
  }
}

Do not wrap in anything other than the JSON object or standard markdown \`\`\`json { ... } \`\`\`.
`;
}

/**
 * Resilient JSON parser that handles markdown fences, think tokens, trailing commas,
 * and truncated LLM output without throwing syntax errors.
 */
function parseLlmOutput(rawText: string): any {
  if (!rawText || !rawText.trim()) {
    return {
      message: 'I have analyzed your request and updated the website.',
      recommendations: [],
      proposed_actions: [],
    };
  }

  // 1. Remove thinking tokens e.g. <think>...</think>
  let clean = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // 2. Try direct JSON parse
  try {
    return JSON.parse(clean);
  } catch {}

  // 3. Extract JSON from markdown code block ```json ... ```
  const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      clean = codeBlockMatch[1].trim();
    }
  }

  // 4. Find first { and last }
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    let candidate = clean.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Strip trailing commas before } or ]
      candidate = candidate.replace(/,\s*([}\]])/g, '$1');
      try {
        return JSON.parse(candidate);
      } catch {}
    }
  }

  // 5. Incomplete / truncated JSON repair (in case max tokens was reached mid-stream)
  if (firstBrace !== -1) {
    let partial = clean.substring(firstBrace);
    partial = partial.replace(/,\s*([}\]])/g, '$1').replace(/,\s*$/, '');

    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < partial.length; i++) {
      const c = partial[i];
      if (c === '\\' && inString) {
        escape = !escape;
        continue;
      }
      if (c === '"' && !escape) {
        inString = !inString;
      }
      if (!inString) {
        if (c === '{') openBraces++;
        else if (c === '}') openBraces--;
        else if (c === '[') openBrackets++;
        else if (c === ']') openBrackets--;
      }
      escape = false;
    }

    if (inString) partial += '"';
    while (openBrackets > 0) {
      partial += ']';
      openBrackets--;
    }
    while (openBraces > 0) {
      partial += '}';
      openBraces--;
    }

    try {
      return JSON.parse(partial);
    } catch {}
  }

  // 6. Fallback clean response
  return {
    message: clean.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim(),
    recommendations: [],
    proposed_actions: [],
  };
}

export async function aiAgentMiddleware(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const payload = JSON.parse(rawBody || '{}');

    const { messages = [], currentProject = null, activePageId, agentContext = {} } = payload;

    const apiKey = getApiKey();
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'NVIDIA API key not configured on server. Please add NVIDIA_API_KEY to your .env file.',
          message:
            'The AI Assistant requires the NVIDIA API key to be configured in .env. Please check server settings.',
        })
      );
      return;
    }

    const systemPrompt = buildSystemPrompt(currentProject, activePageId, agentContext);

    // Keep up to the last 14 messages to support extended continuous conversations
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-14).map((m: any) => {
        let content = m.content || '';
        // If content is excessively long, truncate slightly to protect token limits
        if (content.length > 2500) {
          content = content.substring(0, 2500) + '...';
        }
        return {
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content,
        };
      }),
    ];

    const modelName = process.env.AI_MODEL || DEFAULT_MODEL;

    // Acquire concurrency queue slot to prevent 429 burst rate limits
    await acquireQueueSlot();

    let result;
    try {
      result = await callNvidiaWithRetry(apiKey, modelName, formattedMessages, 3);
    } finally {
      releaseQueueSlot();
    }

    if (!result.ok || !result.data) {
      console.error('[AI Agent Middleware] Final Failure:', result.status, result.errorText);
      res.statusCode = result.status >= 400 && result.status < 600 ? result.status : 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: `AI Engine responded with status ${result.status}`,
          message:
            'I encountered a temporary connection issue while contacting the AI reasoning engine. Please try your request again in a moment.',
        })
      );
      return;
    }

    const apiData = result.data as any;
    const rawOutput = apiData.choices?.[0]?.message?.content || '';

    const parsedOutput = parseLlmOutput(rawOutput);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: parsedOutput.message || 'I have analyzed your request and updated the website.',
        recommendations: parsedOutput.recommendations || [],
        proposed_actions: parsedOutput.proposed_actions || parsedOutput.proposedActions || [],
        updatedContext: parsedOutput.updatedContext || {},
      })
    );
  } catch (err: any) {
    console.error('[AI Agent Middleware] Internal Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: err.message || 'Internal Server Error',
        message: 'An error occurred while processing your website request. Please try again.',
      })
    );
  }
}
