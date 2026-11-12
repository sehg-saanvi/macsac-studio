import { Project, WebsiteSection, SectionItem, WebsiteTheme, SectionType } from './index';

export type AgentRole = 'user' | 'assistant' | 'system';

export interface AgentRecommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  tool: string;
  parameters: Record<string, any>;
  category?: 'section' | 'integration' | 'theme' | 'navigation' | 'page';
  configured?: boolean;
}

export interface ProposedAction {
  id: string;
  tool: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  requiresConfirmation?: boolean;
  status?: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';
  resultMessage?: string;
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: number;
  recommendations?: AgentRecommendation[];
  proposedActions?: ProposedAction[];
  isThinking?: boolean;
  error?: string;
}

export interface AgentContext {
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  keyObjectives?: string[];
  recommendedTools?: string[];
  configuredFeatures?: string[];
  collectedInfo?: Record<string, any>;
  pendingTasks?: string[];
  lastModifiedSectionId?: string;
}

export interface AgentChatPayload {
  messages: Array<{ role: AgentRole; content: string }>;
  currentProject: Project | null;
  activePageId?: string;
  agentContext?: AgentContext;
  actionConfirmation?: {
    actionId: string;
    confirmed: boolean;
  };
}

export interface AgentChatResponse {
  message: string;
  recommendations?: AgentRecommendation[];
  proposedActions?: ProposedAction[];
  updatedContext?: Partial<AgentContext>;
  error?: string;
}

