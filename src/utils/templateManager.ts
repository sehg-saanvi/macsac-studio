import { WebsiteTemplate } from '../types';
import { WEBSITE_TEMPLATES } from '../data/templatesData';

const STORAGE_CUSTOM_TEMPLATES = 'macsac_custom_templates_v1';
const STORAGE_HIDDEN_TEMPLATES = 'macsac_hidden_templates_v1';
const STORAGE_FEATURED_TEMPLATES = 'macsac_featured_templates_v1';
const STORAGE_TEMPLATE_OVERRIDES = 'macsac_template_overrides_v1';

export interface AdminTemplateItem {
  template: WebsiteTemplate;
  isCustom: boolean;
  isHidden: boolean;
  isFeatured: boolean;
}

/**
 * Loads custom templates created or uploaded by the admin from localStorage.
 */
export function getCustomTemplates(): WebsiteTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('[TemplateManager] Failed to read custom templates:', err);
  }
  return [];
}

/**
 * Loads list of template IDs hidden by the admin.
 */
export function getHiddenTemplateIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_HIDDEN_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * Loads list of template IDs marked as featured / popular by the admin.
 */
export function getFeaturedTemplateIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_FEATURED_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * Loads custom metadata overrides for existing templates.
 */
export function getTemplateOverrides(): Record<string, Partial<WebsiteTemplate>> {
  try {
    const raw = localStorage.getItem(STORAGE_TEMPLATE_OVERRIDES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return {};
}

/**
 * Returns all active templates available to users (built-in + custom, excluding hidden).
 */
export function getAllActiveTemplates(): WebsiteTemplate[] {
  const custom = getCustomTemplates();
  const hiddenIds = new Set(getHiddenTemplateIds());
  const featuredIds = new Set(getFeaturedTemplateIds());
  const overrides = getTemplateOverrides();

  // Combine built-in and custom templates (custom can override built-in if matching ID)
  const allTemplatesMap = new Map<string, WebsiteTemplate>();

  for (const t of WEBSITE_TEMPLATES) {
    allTemplatesMap.set(t.id, t);
  }

  for (const c of custom) {
    allTemplatesMap.set(c.id, c);
  }

  const result: WebsiteTemplate[] = [];

  for (const [id, template] of allTemplatesMap.entries()) {
    if (hiddenIds.has(id)) continue;

    let modified: WebsiteTemplate = { ...template };

    if (overrides[id]) {
      modified = { ...modified, ...overrides[id] };
    }

    if (featuredIds.has(id)) {
      modified.isPopular = true;
    }

    result.push(modified);
  }

  return result;
}

/**
 * Returns the full inventory of all templates for the Admin Panel.
 */
export function getAdminTemplatesList(): AdminTemplateItem[] {
  const custom = getCustomTemplates();
  const hiddenIds = new Set(getHiddenTemplateIds());
  const featuredIds = new Set(getFeaturedTemplateIds());
  const overrides = getTemplateOverrides();
  const customIds = new Set(custom.map((c) => c.id));

  const allTemplatesMap = new Map<string, WebsiteTemplate>();

  for (const t of WEBSITE_TEMPLATES) {
    allTemplatesMap.set(t.id, t);
  }

  for (const c of custom) {
    allTemplatesMap.set(c.id, c);
  }

  const items: AdminTemplateItem[] = [];

  for (const [id, template] of allTemplatesMap.entries()) {
    let modified: WebsiteTemplate = { ...template };
    if (overrides[id]) {
      modified = { ...modified, ...overrides[id] };
    }

    items.push({
      template: modified,
      isCustom: customIds.has(id),
      isHidden: hiddenIds.has(id),
      isFeatured: featuredIds.has(id) || Boolean(modified.isPopular),
    });
  }

  return items;
}

/**
 * Adds or saves a custom template to localStorage.
 */
export function saveCustomTemplate(template: WebsiteTemplate): { success: boolean; message: string } {
  try {
    if (!template.id || !template.name) {
      return { success: false, message: 'Template must have a unique ID and Name.' };
    }

    if (!template.pages || template.pages.length === 0) {
      return { success: false, message: 'Template must contain at least one page with sections.' };
    }

    const current = getCustomTemplates();
    const existingIndex = current.findIndex((c) => c.id === template.id);

    let updated: WebsiteTemplate[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = template;
    } else {
      updated = [template, ...current];
    }

    localStorage.setItem(STORAGE_CUSTOM_TEMPLATES, JSON.stringify(updated));
    return { success: true, message: `Template "${template.name}" saved successfully!` };
  } catch (err: any) {
    return { success: false, message: `Failed to save template: ${err.message || String(err)}` };
  }
}

/**
 * Deletes a custom template from localStorage.
 */
export function deleteCustomTemplate(templateId: string): boolean {
  try {
    const current = getCustomTemplates();
    const filtered = current.filter((c) => c.id !== templateId);
    localStorage.setItem(STORAGE_CUSTOM_TEMPLATES, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Toggles visibility of a template in the public catalog.
 */
export function toggleTemplateVisibility(templateId: string): boolean {
  try {
    const hidden = new Set(getHiddenTemplateIds());
    const isNowHidden = !hidden.has(templateId);

    if (isNowHidden) {
      hidden.add(templateId);
    } else {
      hidden.delete(templateId);
    }

    localStorage.setItem(STORAGE_HIDDEN_TEMPLATES, JSON.stringify(Array.from(hidden)));
    return isNowHidden;
  } catch {
    return false;
  }
}

/**
 * Toggles whether a template is highlighted as Featured / Popular.
 */
export function toggleTemplateFeatured(templateId: string): boolean {
  try {
    const featured = new Set(getFeaturedTemplateIds());
    const isNowFeatured = !featured.has(templateId);

    if (isNowFeatured) {
      featured.add(templateId);
    } else {
      featured.delete(templateId);
    }

    localStorage.setItem(STORAGE_FEATURED_TEMPLATES, JSON.stringify(Array.from(featured)));
    return isNowFeatured;
  } catch {
    return false;
  }
}

/**
 * Updates metadata (name, description, category, tags, etc.) of any template.
 */
export function updateTemplateMetadata(
  templateId: string,
  updates: Partial<WebsiteTemplate>
): boolean {
  try {
    // Check if it's a custom template first
    const custom = getCustomTemplates();
    const customIdx = custom.findIndex((c) => c.id === templateId);

    if (customIdx >= 0) {
      custom[customIdx] = { ...custom[customIdx], ...updates };
      localStorage.setItem(STORAGE_CUSTOM_TEMPLATES, JSON.stringify(custom));
      return true;
    }

    // Otherwise apply to overrides
    const overrides = getTemplateOverrides();
    overrides[templateId] = { ...(overrides[templateId] || {}), ...updates };
    localStorage.setItem(STORAGE_TEMPLATE_OVERRIDES, JSON.stringify(overrides));
    return true;
  } catch {
    return false;
  }
}

/**
 * Exports all custom templates and admin configuration as a clean JSON package.
 */
export function exportTemplatesPackage(): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    customTemplates: getCustomTemplates(),
    hiddenTemplateIds: getHiddenTemplateIds(),
    featuredTemplateIds: getFeaturedTemplateIds(),
    templateOverrides: getTemplateOverrides(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Imports templates and configuration from an uploaded JSON file.
 */
export function importTemplatesPackage(jsonString: string): {
  success: boolean;
  count: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);

    // Case 1: Single WebsiteTemplate object
    if (parsed.id && parsed.name && Array.isArray(parsed.pages)) {
      saveCustomTemplate(parsed as WebsiteTemplate);
      return { success: true, count: 1 };
    }

    // Case 2: Array of WebsiteTemplate objects
    if (Array.isArray(parsed)) {
      let count = 0;
      for (const item of parsed) {
        if (item.id && item.name && Array.isArray(item.pages)) {
          saveCustomTemplate(item as WebsiteTemplate);
          count++;
        }
      }
      return { success: true, count };
    }

    // Case 3: Complete export package
    if (parsed.customTemplates && Array.isArray(parsed.customTemplates)) {
      let count = 0;
      for (const item of parsed.customTemplates) {
        saveCustomTemplate(item as WebsiteTemplate);
        count++;
      }
      if (Array.isArray(parsed.hiddenTemplateIds)) {
        localStorage.setItem(STORAGE_HIDDEN_TEMPLATES, JSON.stringify(parsed.hiddenTemplateIds));
      }
      if (Array.isArray(parsed.featuredTemplateIds)) {
        localStorage.setItem(STORAGE_FEATURED_TEMPLATES, JSON.stringify(parsed.featuredTemplateIds));
      }
      if (parsed.templateOverrides && typeof parsed.templateOverrides === 'object') {
        localStorage.setItem(STORAGE_TEMPLATE_OVERRIDES, JSON.stringify(parsed.templateOverrides));
      }
      return { success: true, count };
    }

    return { success: false, count: 0, error: 'JSON does not match a valid template or template package schema.' };
  } catch (err: any) {
    return { success: false, count: 0, error: `Invalid JSON syntax: ${err.message || String(err)}` };
  }
}

/**
 * Resets the entire template system back to original factory defaults.
 */
export function resetAllToFactoryDefaults(): void {
  localStorage.removeItem(STORAGE_CUSTOM_TEMPLATES);
  localStorage.removeItem(STORAGE_HIDDEN_TEMPLATES);
  localStorage.removeItem(STORAGE_FEATURED_TEMPLATES);
  localStorage.removeItem(STORAGE_TEMPLATE_OVERRIDES);
}

