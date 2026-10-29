import { WebsiteTemplate } from '../types';
import { businessTemplates } from './templates/businessTemplates';
import { hospitalityTemplates } from './templates/hospitalityTemplates';
import { technologyTemplates } from './templates/technologyTemplates';
import { portfolioTemplates } from './templates/portfolioTemplates';
import { storeTemplates } from './templates/storeTemplates';
import { eventTemplates } from './templates/eventTemplates';
import { educationTemplates } from './templates/educationTemplates';
import { realEstateTemplates } from './templates/realEstateTemplates';
import { editorialTemplates } from './templates/editorialTemplates';
import { landingTemplates } from './templates/landingTemplates';

/**
 * MACSAC STUDIO — Complete Redesigned Multi-Page Website Templates
 * 32 Distinct, Professional Multi-Page Templates
 * Each template features 4 complete, uniquely designed, responsive pages
 * with diverse layout architectures (Cinema, Terminal, Bento Grid, Asymmetric, Lookbook, Menu, Properties, Specs, Timeline, Minimal).
 */
export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  ...businessTemplates,
  ...hospitalityTemplates,
  ...technologyTemplates,
  ...portfolioTemplates,
  ...storeTemplates,
  ...realEstateTemplates,
  ...editorialTemplates,
  ...landingTemplates,
  ...eventTemplates,
  ...educationTemplates,
];

export const templates = WEBSITE_TEMPLATES;
export default WEBSITE_TEMPLATES;

