import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/nemotron-3.5-bolt-e4b';

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
          `  ${i + 1}. [ID: "${s.id}"] Type: "${s.type}" | Title: "${s.title}" | Items: ${s.items?.length || 0} | Layout: ${s.layoutVariant}`
      )
      .join('\n');

    projectSummary = `
- Project Name: "${currentProject.name}"
- Active Template: "${currentProject.templateName}" (ID: ${currentProject.templateId})
- Brand Name: "${currentProject.navigation?.brandName || 'Untitled'}"
- Theme: "${currentProject.theme?.name}" (${currentProject.theme?.mode || 'light'} mode, primary: ${currentProject.theme?.primaryColor})
- Total Pages: ${currentProject.pages?.length || 1} [${(currentProject.pages || []).map((p: any) => p.name).join(', ')}]
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
1. Act as a thoughtful, professional website consultant. Never give lazy, generic chatbot answers.
2. When the user shares their business idea or requirements (e.g. "I want a site for my clothing brand" or "I need a booking system"):
   - First acknowledge and reflect their specific business context.
   - Identify their key goals and recommend 2-4 specific features/tools available in Macsac Studio.
   - Explain briefly WHY each tool benefits their business.
   - Ask for permission to set them up: "Would you like me to configure these for you?"
3. When the user confirms or requests an action (e.g., "Yes, set it up", "Add the booking section", "Change the theme to Dark", "Update the hero title to..."):
   - EXECUTE the actual tool by providing the \`proposed_actions\` array.
   - Include realistic, high-quality, professional copywriting in the parameters tailored to the user's business!
   - Do NOT ask questions about information already known in the project or context.
4. If an action is destructive (like deleting an entire page or removing a section), set \`requiresConfirmation: true\`.
5. If the user asks for a capability outside Macsac Studio (e.g. server-side SQL database or Stripe raw webhook handler), explain that Macsac Studio supports front-end product showcases with direct WhatsApp ordering or external payment links, and suggest configuring that instead.

RESPONSE FORMAT:
You MUST respond with a valid JSON object matching this schema:
{
  "message": "Conversational explanation to the user in friendly, consultative tone...",
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
      "name": "Add Bakery Showcase",
      "description": "Adding a curated product section with sourdough breads and croissants",
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

Do not wrap in anything other than the JSON object, or format as standard markdown code block \`\`\`json { ... } \`\`\`.
`;
}

function parseLlmOutput(rawText: string): any {
  if (!rawText || !rawText.trim()) {
    return {
      message: 'I understand your request. Let me assist you with setting up your website.',
      recommendations: [],
      proposed_actions: [],
    };
  }

  try {
    return JSON.parse(rawText.trim());
  } catch {
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {}
    }

    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const potentialJson = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(potentialJson);
      } catch {}
    }

    return {
      message: rawText.replace(/```(?:json)?/g, '').replace(/```/g, '').trim(),
      recommendations: [],
      proposed_actions: [],
    };
  }
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

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10).map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content || '',
      })),
    ];

    const modelName = process.env.AI_MODEL || DEFAULT_MODEL;

    const apiResponse = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: formattedMessages,
        temperature: 0.4,
        max_tokens: 1200,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('[AI Agent Middleware] NVIDIA API Error:', apiResponse.status, errorText);
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: `NVIDIA NIM API responded with status ${apiResponse.status}`,
          message:
            'I encountered a temporary connection issue while contacting the AI reasoning engine. Please try your request again in a moment.',
        })
      );
      return;
    }

    const apiData = (await apiResponse.json()) as any;
    const rawOutput = apiData.choices?.[0]?.message?.content || '';

    const parsedOutput = parseLlmOutput(rawOutput);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: parsedOutput.message || 'I have analyzed your request.',
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
