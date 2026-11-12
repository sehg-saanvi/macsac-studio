import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2,
  Wand2,
  Bot,
  User as UserIcon,
  Layers,
  Palette,
  PhoneCall,
  Calendar,
  ShoppingBag,
  HelpCircle,
  FileCode,
  Check,
} from 'lucide-react';
import { Project, UserWebsiteDetails } from '../types';
import {
  AgentMessage,
  AgentContext,
  AgentRecommendation,
  ProposedAction,
} from '../types/agent';
import { executePlatformTool } from '../utils/aiToolExecutor';

interface AiAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  currentProject: Project | null;
  activePageId?: string;
  onUpdateProject?: (updated: Project) => void;
  onLaunchProject?: (newProject: Project) => void;
  websiteDetails?: UserWebsiteDetails | null;
  onNavigatePage?: (slug: string) => void;
}

const STORAGE_CHAT_KEY = 'macsac_studio_ai_agent_chat_v2';
const STORAGE_CONTEXT_KEY = 'macsac_studio_ai_agent_context_v2';

const FONT_TITLE = "'Outfit', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const COLOR_COPPER = '#b1704e';
const COLOR_COPPER_DARK = '#703c21';
const COLOR_COPPER_LIGHT = '#e6bfa7';
const COLOR_BG_PANEL = '#ffffff';
const COLOR_BORDER = '#e8ded2';
const COLOR_TEXT = '#2d2622';
const COLOR_MUTED = '#7d6f66';

const INITIAL_GREETING: AgentMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  content: `Hello! I'm your **MACSAC Studio AI Website Consultant & Setup Agent**.

I can understand your business objectives, recommend the ideal multi-page architecture, tools, and integrations, and directly configure or modify your website live.

What type of website would you like to create or enhance today?`,
  timestamp: Date.now(),
  recommendations: [],
  proposedActions: [],
};

const QUICK_PROMPTS = [
  'I want an artisan bakery website with sourdough bread & WhatsApp ordering',
  'I need a luxury portfolio website for an interior architecture studio',
  'Add an appointment booking system for client consultations',
  'Add client testimonials and an FAQ section to build trust',
  'Change the theme to Obsidian Dark with neon cyan accents',
];

function renderFormattedMessage(content: string, isUser: boolean) {
  if (isUser) {
    return content;
  }

  const lines = content.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
    const bulletText = isBullet ? trimmed.slice(2) : line;

    // Parse bold markdown **bold**
    const parts = bulletText.split(/(\*\*[^*]+\*\*)/g);
    const parsedLine = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} style={{ fontWeight: 700, color: '#1a1614' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 7,
            marginTop: 3,
            marginBottom: 3,
            paddingLeft: 2,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: COLOR_COPPER,
              marginTop: 7,
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1 }}>{parsedLine}</span>
        </div>
      );
    }

    if (!trimmed) {
      return <div key={idx} style={{ height: 6 }} />;
    }

    return (
      <div key={idx} style={{ marginBottom: 2 }}>
        {parsedLine}
      </div>
    );
  });
}

export const AiAgentDrawer: React.FC<AiAgentDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  currentProject,
  activePageId,
  onUpdateProject,
  onLaunchProject,
  websiteDetails,
  onNavigatePage,
}) => {
  const [messages, setMessages] = useState<AgentMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [INITIAL_GREETING];
  });

  const [agentContext, setAgentContext] = useState<AgentContext>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONTEXT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      businessName: websiteDetails?.brandName || '',
      keyObjectives: websiteDetails?.keywords || [],
      recommendedTools: [],
      configuredFeatures: [],
      collectedInfo: {},
    };
  });

  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSeconds, setThinkingSeconds] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const currentProjectRef = useRef<Project | null>(currentProject);

  useEffect(() => {
    currentProjectRef.current = currentProject;
  }, [currentProject]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CONTEXT_KEY, JSON.stringify(agentContext));
    } catch {}
  }, [agentContext]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen, isMinimized]);

  // Timer for thinking state
  useEffect(() => {
    let interval: any;
    if (isThinking) {
      setThinkingSeconds(0);
      interval = setInterval(() => {
        setThinkingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => textareaRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  const handleResetChat = () => {
    if (window.confirm('Reset conversation history with the AI Assistant?')) {
      setMessages([INITIAL_GREETING]);
      setAgentContext({});
      localStorage.removeItem(STORAGE_CHAT_KEY);
      localStorage.removeItem(STORAGE_CONTEXT_KEY);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isThinking) return;

    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          currentProject,
          activePageId: activePageId || currentProject?.activePageId,
          agentContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: AgentMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.message || 'I have analyzed your request.',
        timestamp: Date.now(),
        recommendations: data.recommendations || [],
        proposedActions: (data.proposed_actions || []).map((a: any, i: number) => ({
          ...a,
          id: a.id || `act-${Date.now()}-${i}`,
          status: 'pending',
        })),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.updatedContext) {
        setAgentContext((prev) => ({
          ...prev,
          ...data.updatedContext,
          recommendedTools: [
            ...(prev.recommendedTools || []),
            ...(data.recommendations || []).map((r: any) => r.title),
          ],
        }));
      }

      // If proposed actions don't require confirmation, execute them automatically
      if (
        assistantMessage.proposedActions &&
        assistantMessage.proposedActions.length > 0
      ) {
        for (const action of assistantMessage.proposedActions) {
          if (!action.requiresConfirmation) {
            await handleExecuteAction(assistantMessage.id, action);
          }
        }
      }
    } catch (err: any) {
      console.error('[AI Agent Drawer Error]:', err);
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content:
          "I'm sorry, I encountered a temporary issue connecting to the AI setup service. Please ensure the dev server is running and try again.",
        timestamp: Date.now(),
        error: err.message,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleExecuteAction = async (messageId: string, action: ProposedAction) => {
    setExecutingActionId(action.id);

    // Update action status to executing
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId && m.proposedActions) {
          return {
            ...m,
            proposedActions: m.proposedActions.map((a) =>
              a.id === action.id ? { ...a, status: 'executing' } : a
            ),
          };
        }
        return m;
      })
    );

    await new Promise((r) => setTimeout(r, 450)); // smooth visual feedback

    const targetProject = currentProjectRef.current || currentProject;
    const result = executePlatformTool(
      action.tool,
      action.parameters,
      targetProject,
      activePageId
    );

    // Update action status to completed or failed
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId && m.proposedActions) {
          return {
            ...m,
            proposedActions: m.proposedActions.map((a) =>
              a.id === action.id
                ? {
                    ...a,
                    status: result.success ? 'completed' : 'failed',
                    resultMessage: result.message,
                  }
                : a
            ),
          };
        }
        return m;
      })
    );

    setExecutingActionId(null);

    if (result.success && result.updatedProject) {
      currentProjectRef.current = result.updatedProject;
      // If we are currently in Editor, apply project updates live
      if (onUpdateProject) {
        onUpdateProject(result.updatedProject);
      }
      // If action was template selection and we are in Home view, launch into editor
      if (action.tool === 'select_template' && onLaunchProject) {
        onLaunchProject(result.updatedProject);
      }

      // Update agent context memory
      setAgentContext((prev) => ({
        ...prev,
        configuredFeatures: Array.from(
          new Set([...(prev.configuredFeatures || []), action.name || action.tool])
        ),
      }));
    }
  };

  const handleExecuteRecommendation = async (rec: AgentRecommendation) => {
    const action: ProposedAction = {
      id: `act-rec-${Date.now()}`,
      tool: rec.tool,
      name: rec.title,
      description: rec.description,
      parameters: rec.parameters,
      status: 'pending',
    };

    // Add conversational confirmation message
    const confirmMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `I'm configuring **${rec.title}** for you now based on your approval.`,
      timestamp: Date.now(),
      proposedActions: [action],
    };

    setMessages((prev) => [...prev, confirmMsg]);
    await handleExecuteAction(confirmMsg.id, action);
  };

  const getActionIcon = (toolName: string) => {
    switch (toolName) {
      case 'select_template':
        return <Layers size={16} color={COLOR_COPPER} />;
      case 'apply_theme':
        return <Palette size={16} color={COLOR_COPPER} />;
      case 'configure_integration':
        return <PhoneCall size={16} color={COLOR_COPPER} />;
      case 'add_page':
      case 'switch_page':
        return <ExternalLink size={16} color={COLOR_COPPER} />;
      case 'add_section':
      case 'update_section':
        return <Wand2 size={16} color={COLOR_COPPER} />;
      default:
        return <CheckCircle2 size={16} color={COLOR_COPPER} />;
    }
  };

  return (
    <>
      {/* ── Floating Action Trigger (When Drawer is Closed) ── */}
      {!isOpen && (
        <button
          onClick={onOpen}
          title="Open AI Website Setup & Management Agent"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, #1a1614 0%, #2d2420 100%)',
            color: '#fdfbf7',
            padding: '12px 20px',
            borderRadius: 9999,
            border: `1.5px solid ${COLOR_COPPER}`,
            boxShadow: '0 10px 30px rgba(177,112,78,0.35)',
            cursor: 'pointer',
            fontFamily: FONT_TITLE,
            fontSize: '0.92rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 14px 40px rgba(177,112,78,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(177,112,78,0.35)';
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLOR_COPPER} 0%, ${COLOR_COPPER_DARK} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <span>AI Website Agent</span>
        </button>
      )}

      {/* ── Slide-in AI Assistant Drawer ── */}
      {isOpen && (
        <div
          id="macsac-ai-agent-drawer"
          style={{
            position: 'fixed',
            bottom: isMinimized ? 20 : 0,
            right: isMinimized ? 20 : 0,
            top: isMinimized ? 'auto' : 0,
            width: isMinimized ? 340 : 'min(460px, 100vw)',
            height: isMinimized ? 64 : '100vh',
            zIndex: 10000,
            backgroundColor: COLOR_BG_PANEL,
            borderLeft: isMinimized ? 'none' : `1px solid ${COLOR_BORDER}`,
            borderRadius: isMinimized ? 16 : 0,
            boxShadow: '0 20px 60px rgba(26,22,20,0.35)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: FONT_BODY,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: '#1a1614',
              color: '#fdfbf7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid rgba(255,255,255,0.08)`,
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${COLOR_COPPER} 0%, ${COLOR_COPPER_DARK} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={17} color="#ffffff" />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: FONT_TITLE,
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>MACSAC AI Agent</span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      background: 'rgba(177,112,78,0.35)',
                      color: COLOR_COPPER_LIGHT,
                      padding: '2px 6px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    Active
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#a09080',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 220,
                  }}
                >
                  {currentProject
                    ? `Project: ${currentProject.name}`
                    : 'Consultant Mode: Ready'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={handleResetChat}
                title="Reset Conversation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a09080',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a09080',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>

              <button
                onClick={onClose}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a09080',
                  padding: 6,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body & Messages (hidden if minimized) */}
          {!isMinimized && (
            <>
              {/* Context Pill Indicator */}
              <div
                style={{
                  background: '#f7f4ef',
                  borderBottom: `1px solid ${COLOR_BORDER}`,
                  padding: '8px 16px',
                  fontSize: '0.74rem',
                  color: COLOR_MUTED,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#10b981',
                    }}
                  />
                  <span>
                    {currentProject
                      ? `Connected to "${currentProject.name}"`
                      : 'Consultant Mode (Home)'}
                  </span>
                </div>
                {agentContext.businessName && (
                  <span
                    style={{
                      fontWeight: 600,
                      color: COLOR_COPPER_DARK,
                      background: 'rgba(177,112,78,0.12)',
                      padding: '2px 8px',
                      borderRadius: 9999,
                    }}
                  >
                    {agentContext.businessName}
                  </span>
                )}
              </div>

              {/* Chat Feed */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: '#fcfbf9',
                }}
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        gap: 6,
                      }}
                    >
                      {/* Avatar & Label */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.68rem',
                          color: COLOR_MUTED,
                          paddingLeft: isUser ? 0 : 4,
                          paddingRight: isUser ? 4 : 0,
                        }}
                      >
                        {isUser ? (
                          <>
                            <span>You</span>
                            <UserIcon size={12} />
                          </>
                        ) : (
                          <>
                            <Bot size={12} color={COLOR_COPPER} />
                            <span>MACSAC AI Consultant</span>
                          </>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        style={{
                          maxWidth: '92%',
                          padding: '12px 16px',
                          borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          backgroundColor: isUser ? '#1a1614' : '#ffffff',
                          color: isUser ? '#fdfbf7' : COLOR_TEXT,
                          border: isUser ? 'none' : `1px solid ${COLOR_BORDER}`,
                          boxShadow: isUser
                            ? '0 4px 14px rgba(26,22,20,0.15)'
                            : '0 2px 10px rgba(0,0,0,0.04)',
                          fontSize: '0.86rem',
                          lineHeight: 1.55,
                          wordBreak: 'break-word',
                        }}
                      >
                        {renderFormattedMessage(msg.content, isUser)}
                      </div>

                      {/* Structured Recommendations Card */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            marginTop: 4,
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: COLOR_COPPER_DARK,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <Sparkles size={12} />
                            <span>Recommended Solutions</span>
                          </div>

                          {msg.recommendations.map((rec) => (
                            <div
                              key={rec.id}
                              style={{
                                background: '#ffffff',
                                border: `1px solid ${COLOR_BORDER}`,
                                borderRadius: 10,
                                padding: '12px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: FONT_TITLE,
                                    fontWeight: 700,
                                    fontSize: '0.88rem',
                                    color: COLOR_TEXT,
                                  }}
                                >
                                  {rec.title}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.64rem',
                                    fontWeight: 700,
                                    color: COLOR_COPPER,
                                    background: 'rgba(177,112,78,0.12)',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {rec.tool.replace(/_/g, ' ')}
                                </span>
                              </div>

                              <p style={{ margin: 0, fontSize: '0.78rem', color: COLOR_MUTED, lineHeight: 1.45 }}>
                                {rec.description}
                              </p>

                              {rec.reason && (
                                <div
                                  style={{
                                    background: '#fbf8f5',
                                    borderLeft: `3px solid ${COLOR_COPPER}`,
                                    padding: '6px 10px',
                                    borderRadius: '0 6px 6px 0',
                                    fontSize: '0.73rem',
                                    color: '#5c4d44',
                                  }}
                                >
                                  <strong>Why it benefits you:</strong> {rec.reason}
                                </div>
                              )}

                              <button
                                onClick={() => handleExecuteRecommendation(rec)}
                                disabled={Boolean(executingActionId)}
                                style={{
                                  alignSelf: 'flex-start',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: COLOR_COPPER,
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '7px 14px',
                                  borderRadius: 6,
                                  fontSize: '0.76rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease',
                                  marginTop: 2,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = COLOR_COPPER_DARK)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = COLOR_COPPER)}
                              >
                                <span>Configure This Feature</span>
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Proposed Action Execution Cards */}
                      {msg.proposedActions && msg.proposedActions.length > 0 && (
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            marginTop: 4,
                          }}
                        >
                          {msg.proposedActions.map((act) => {
                            const isExecuting = act.status === 'executing';
                            const isCompleted = act.status === 'completed';
                            const isFailed = act.status === 'failed';

                            return (
                              <div
                                key={act.id}
                                style={{
                                  background: isCompleted ? '#f0fdf4' : '#ffffff',
                                  border: `1px solid ${
                                    isCompleted ? '#bbf7d0' : isFailed ? '#fecaca' : COLOR_BORDER
                                  }`,
                                  borderRadius: 10,
                                  padding: '12px 14px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 6,
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                    {getActionIcon(act.tool)}
                                    <span
                                      style={{
                                        fontFamily: FONT_TITLE,
                                        fontWeight: 700,
                                        fontSize: '0.86rem',
                                        color: COLOR_TEXT,
                                      }}
                                    >
                                      {act.name || act.tool.replace(/_/g, ' ')}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {isExecuting && (
                                      <span
                                        style={{
                                          fontSize: '0.7rem',
                                          color: COLOR_COPPER,
                                          fontWeight: 600,
                                        }}
                                      >
                                        Executing...
                                      </span>
                                    )}
                                    {isCompleted && (
                                      <span
                                        style={{
                                          fontSize: '0.68rem',
                                          fontWeight: 700,
                                          color: '#15803d',
                                          background: '#dcfce7',
                                          padding: '2px 8px',
                                          borderRadius: 9999,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 4,
                                        }}
                                      >
                                        <Check size={12} /> Configured
                                      </span>
                                    )}
                                    {isFailed && (
                                      <span
                                        style={{
                                          fontSize: '0.68rem',
                                          fontWeight: 700,
                                          color: '#b91c1c',
                                          background: '#fee2e2',
                                          padding: '2px 8px',
                                          borderRadius: 9999,
                                        }}
                                      >
                                        Failed
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p style={{ margin: 0, fontSize: '0.76rem', color: COLOR_MUTED }}>
                                  {act.description}
                                </p>

                                {act.resultMessage && (
                                  <div
                                    style={{
                                      fontSize: '0.72rem',
                                      color: isCompleted ? '#166534' : '#991b1b',
                                      marginTop: 2,
                                    }}
                                  >
                                    {act.resultMessage}
                                  </div>
                                )}

                                {/* Manual trigger button if pending & requires confirmation */}
                                {act.status === 'pending' && act.requiresConfirmation && (
                                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                    <button
                                      onClick={() => handleExecuteAction(msg.id, act)}
                                      disabled={Boolean(executingActionId)}
                                      style={{
                                        background: COLOR_COPPER,
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: 6,
                                        fontSize: '0.74rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Confirm & Apply Changes
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Thinking / Reasoning state */}
                {isThinking && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: `1px solid ${COLOR_BORDER}`,
                        borderRadius: '16px 16px 16px 2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Sparkles size={16} color={COLOR_COPPER} className="ai-spin" />
                      <div style={{ fontSize: '0.8rem', color: COLOR_MUTED }}>
                        Consulting AI reasoning engine ({thinkingSeconds}s)...
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Starter Pills (Show if chat is fresh) */}
              {messages.length <= 2 && (
                <div
                  style={{
                    padding: '8px 14px',
                    background: '#f7f4ef',
                    borderTop: `1px solid ${COLOR_BORDER}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: COLOR_MUTED }}>
                    Quick Consultations:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        style={{
                          background: '#ffffff',
                          border: `1px solid ${COLOR_BORDER}`,
                          borderRadius: 9999,
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          color: COLOR_TEXT,
                          cursor: 'pointer',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                          transition: 'border-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLOR_COPPER)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLOR_BORDER)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#ffffff',
                  borderTop: `1px solid ${COLOR_BORDER}`,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Describe your business, feature request, or change..."
                  rows={2}
                  style={{
                    flex: 1,
                    resize: 'none',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${COLOR_BORDER}`,
                    fontFamily: FONT_BODY,
                    fontSize: '0.84rem',
                    color: COLOR_TEXT,
                    outline: 'none',
                    backgroundColor: '#faf8f5',
                    boxSizing: 'border-box',
                    lineHeight: 1.4,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = COLOR_COPPER)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = COLOR_BORDER)}
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isThinking}
                  title="Send message"
                  style={{
                    background: inputValue.trim() && !isThinking ? COLOR_COPPER : '#dcd4cb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputValue.trim() && !isThinking ? 'pointer' : 'default',
                    transition: 'background 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

