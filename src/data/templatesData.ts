import { WebsiteTemplate } from '../types';
import { businessTemplates } from './templates/businessTemplates';
import { hospitalityTemplates } from './templates/hospitalityTemplates';
import { technologyTemplates } from './templates/technologyTemplates';
import { portfolioTemplates } from './templates/portfolioTemplates';
import { storeTemplates } from './templates/storeTemplates';
import { eventTemplates } from './templates/eventTemplates';
import { educationTemplates } from './templates/educationTemplates';

/**
 * MACSAC STUDIO — Complete Redesigned Multi-Page Website Templates
 * 27 Distinct, Professional Multi-Page Templates
 * Each template features 4 complete, uniquely designed, responsive pages.
 */
export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  ...businessTemplates,
  ...hospitalityTemplates,
  ...technologyTemplates,
  ...portfolioTemplates,
  ...storeTemplates,
  ...eventTemplates,
  ...educationTemplates,
];

export const templates = WEBSITE_TEMPLATES;
export default WEBSITE_TEMPLATES;
