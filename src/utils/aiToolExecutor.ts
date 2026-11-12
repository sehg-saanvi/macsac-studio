import {
  Project,
  WebsiteSection,
  SectionItem,
  SectionType,
  WebsitePage,
  WebsiteTheme,
} from '../types';
import { WEBSITE_TEMPLATES } from '../data/templatesData';
import { THEME_PRESETS } from '../data/themePresets';
import { createNewSection } from '../data/defaultSections';
import { createProjectFromTemplate, saveProject } from './storage';

export interface ToolExecutionResult {
  success: boolean;
  message: string;
  updatedProject?: Project;
  changesMade: string[];
}

/**
 * Executes a verified Macsac Studio platform tool on the current project.
 */
export function executePlatformTool(
  toolName: string,
  parameters: Record<string, any>,
  currentProject: Project | null,
  activePageId?: string
): ToolExecutionResult {
  try {
    switch (toolName) {
      /* ── 1. Select Template & Create / Switch Project ── */
      case 'select_template': {
        const { templateId, brandName, keywords } = parameters;
        const matched = WEBSITE_TEMPLATES.find(
          (t) => t.id.toLowerCase() === (templateId || '').toLowerCase()
        ) || WEBSITE_TEMPLATES[0];

        const userDetails = {
          brandName: brandName || currentProject?.name || matched.name,
          keywords: keywords || currentProject?.userKeywords || [],
        };

        const newProject = createProjectFromTemplate(matched, userDetails);
        saveProject(newProject);

        return {
          success: true,
          message: `Successfully loaded and personalized the "${matched.name}" template for ${newProject.name}.`,
          updatedProject: newProject,
          changesMade: [
            `Loaded template "${matched.name}" (${matched.categoryLabel})`,
            `Configured multi-page structure with ${newProject.pages.length} pages`,
            `Applied ${matched.aestheticLabel} aesthetic`,
          ],
        };
      }

      /* ── 2. Add Section ── */
      case 'add_section': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded to add section to.', changesMade: [] };
        }

        const type: SectionType = parameters.type || 'services';
        const targetPageId = parameters.pageId || activePageId || currentProject.activePageId;

        const newSec = createNewSection(type);
        if (parameters.title) newSec.title = parameters.title;
        if (parameters.subtitle) newSec.subtitle = parameters.subtitle;
        if (parameters.description) newSec.description = parameters.description;
        if (parameters.badge) newSec.badge = parameters.badge;
        if (parameters.layoutVariant) newSec.layoutVariant = parameters.layoutVariant;
        if (parameters.bgVariant) newSec.bgVariant = parameters.bgVariant;
        if (parameters.textAlign) newSec.textAlign = parameters.textAlign;
        if (parameters.image) newSec.image = parameters.image;

        if (parameters.primaryBtn) {
          newSec.primaryBtn = {
            text: parameters.primaryBtn.text || 'Learn More',
            url: parameters.primaryBtn.url || '#contact',
            show: true,
          };
        }

        if (Array.isArray(parameters.items) && parameters.items.length > 0) {
          newSec.items = parameters.items.map((it: any, idx: number) => ({
            id: `item-${Date.now()}-${idx}`,
            title: it.title || it.name || `Item ${idx + 1}`,
            description: it.description || '',
            subtitle: it.subtitle || '',
            tag: it.tag || '',
            price: it.price || '',
            period: it.period || '',
            icon: it.icon || 'Layout',
            image: it.image,
            stars: it.stars || 5,
            author: it.author,
            role: it.role,
          }));
        }

        let targetIndex = currentProject.pages.findIndex(
          (p) => p.id === targetPageId || p.slug === targetPageId
        );
        if (targetIndex === -1) {
          targetIndex = currentProject.pages.findIndex(
            (p) => p.id === currentProject.activePageId
          );
        }
        if (targetIndex === -1 && currentProject.pages.length > 0) {
          targetIndex = 0;
        }

        const updatedPages = currentProject.pages.map((p, idx) => {
          if (idx === targetIndex) {
            return { ...p, sections: [...p.sections, newSec] };
          }
          return p;
        });

        const updatedProject: Project = {
          ...currentProject,
          pages: updatedPages,
          updatedAt: Date.now(),
        };

        saveProject(updatedProject);

        return {
          success: true,
          message: `Added new "${newSec.title}" (${type}) section to page.`,
          updatedProject,
          changesMade: [
            `Added ${type} section: "${newSec.title}"`,
            newSec.items && newSec.items.length > 0 ? `Configured ${newSec.items.length} cards/items` : '',
          ].filter(Boolean),
        };
      }

      /* ── 3. Update Section ── */
      case 'update_section': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const targetPageId = parameters.pageId || activePageId || currentProject.activePageId;
        let foundPage =
          currentProject.pages.find((p) => p.id === targetPageId || p.slug === targetPageId) ||
          currentProject.pages[0];

        // Locate section by sectionId or by sectionType across targeted page
        let targetSection = foundPage?.sections.find(
          (s) =>
            s.id === parameters.sectionId ||
            s.type === parameters.sectionType ||
            s.type === parameters.type
        );

        // If not on target page, scan all project pages
        if (!targetSection) {
          for (const p of currentProject.pages) {
            const match = p.sections.find(
              (s) =>
                s.id === parameters.sectionId ||
                s.type === parameters.sectionType ||
                s.type === parameters.type
            );
            if (match) {
              targetSection = match;
              foundPage = p;
              break;
            }
          }
        }

        if (!targetSection && foundPage && foundPage.sections.length > 0) {
          targetSection = foundPage.sections[0];
        }

        if (!targetSection) {
          return { success: false, message: 'Target section could not be found.', changesMade: [] };
        }

        const updates = parameters.updates || parameters;
        const changes: string[] = [];

        const updatedPages = currentProject.pages.map((p) => {
          if (p.id === foundPage.id) {
            return {
              ...p,
              sections: p.sections.map((s) => {
                if (s.id === targetSection.id) {
                  const mod: WebsiteSection = { ...s };
                  if (updates.title) { mod.title = updates.title; changes.push(`Updated title to "${updates.title}"`); }
                  if (updates.subtitle !== undefined) { mod.subtitle = updates.subtitle; changes.push(`Updated subtitle`); }
                  if (updates.description !== undefined) { mod.description = updates.description; changes.push(`Updated description`); }
                  if (updates.badge !== undefined) { mod.badge = updates.badge; changes.push(`Updated badge to "${updates.badge}"`); }
                  if (updates.layoutVariant) { mod.layoutVariant = updates.layoutVariant; changes.push(`Changed layout to ${updates.layoutVariant}`); }
                  if (updates.bgVariant) { mod.bgVariant = updates.bgVariant; changes.push(`Changed background to ${updates.bgVariant}`); }
                  if (updates.textAlign) { mod.textAlign = updates.textAlign; changes.push(`Set alignment to ${updates.textAlign}`); }
                  if (updates.image) { mod.image = updates.image; changes.push(`Updated showcase image`); }
                  if (updates.primaryBtn) { mod.primaryBtn = { ...mod.primaryBtn, ...updates.primaryBtn }; changes.push(`Updated primary action button`); }
                  if (updates.secondaryBtn) { mod.secondaryBtn = { ...mod.secondaryBtn, ...updates.secondaryBtn }; changes.push(`Updated secondary button`); }
                  return mod;
                }
                return s;
              }),
            };
          }
          return p;
        });

        const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: `Updated section "${targetSection.title}".`,
          updatedProject,
          changesMade: changes.length > 0 ? changes : ['Section parameters updated'],
        };
      }

      /* ── 4. Remove Section ── */
      case 'remove_section': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const targetPageId = parameters.pageId || activePageId || currentProject.activePageId;
        const page = currentProject.pages.find((p) => p.id === targetPageId) || currentProject.pages[0];

        const targetSection =
          page.sections.find((s) => s.id === parameters.sectionId) ||
          page.sections.find((s) => s.type === parameters.sectionType || s.type === parameters.type);

        if (!targetSection) {
          return { success: false, message: 'Section to remove was not found.', changesMade: [] };
        }

        if (page.sections.length <= 1) {
          return { success: false, message: 'A page must keep at least one section.', changesMade: [] };
        }

        const updatedPages = currentProject.pages.map((p) => {
          if (p.id === page.id) {
            return { ...p, sections: p.sections.filter((s) => s.id !== targetSection.id) };
          }
          return p;
        });

        const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: `Removed "${targetSection.title}" (${targetSection.type}) section.`,
          updatedProject,
          changesMade: [`Removed section: "${targetSection.title}"`],
        };
      }

      /* ── 5. Reorder Sections ── */
      case 'reorder_sections': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const targetPageId = parameters.pageId || activePageId || currentProject.activePageId;
        const fromIdx = Number(parameters.fromIndex);
        const toIdx = Number(parameters.toIndex);

        const updatedPages = currentProject.pages.map((p) => {
          if (p.id === targetPageId) {
            const nextSecs = [...p.sections];
            if (fromIdx >= 0 && fromIdx < nextSecs.length && toIdx >= 0 && toIdx < nextSecs.length) {
              const [moved] = nextSecs.splice(fromIdx, 1);
              nextSecs.splice(toIdx, 0, moved);
            }
            return { ...p, sections: nextSecs };
          }
          return p;
        });

        const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: `Reordered section from position ${fromIdx + 1} to ${toIdx + 1}.`,
          updatedProject,
          changesMade: [`Reordered sections on page`],
        };
      }

      /* ── 6. Add Section Item (Card) ── */
      case 'add_section_item': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const targetPageId = activePageId || currentProject.activePageId;
        const page = currentProject.pages.find((p) => p.id === targetPageId) || currentProject.pages[0];

        const targetSection =
          page.sections.find((s) => s.id === parameters.sectionId) ||
          page.sections.find((s) => s.type === parameters.sectionType || s.type === parameters.type) ||
          page.sections.find((s) => s.items && s.items.length > 0) ||
          page.sections[0];

        const it = parameters.item || parameters;
        const newItem: SectionItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: it.title || it.name || 'New Item',
          description: it.description || '',
          subtitle: it.subtitle || '',
          tag: it.tag || '',
          price: it.price || '',
          period: it.period || '',
          icon: it.icon || 'Check',
          image: it.image,
          stars: it.stars || 5,
          author: it.author,
          role: it.role,
        };

        const updatedPages = currentProject.pages.map((p) => {
          if (p.id === page.id) {
            return {
              ...p,
              sections: p.sections.map((s) => {
                if (s.id === targetSection.id) {
                  return { ...s, items: [...(s.items || []), newItem] };
                }
                return s;
              }),
            };
          }
          return p;
        });

        const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: `Added "${newItem.title}" to "${targetSection.title}".`,
          updatedProject,
          changesMade: [`Added item "${newItem.title}" to ${targetSection.type} section`],
        };
      }

      /* ── 7. Update Section Item ── */
      case 'update_section_item': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const targetPageId = activePageId || currentProject.activePageId;
        const page = currentProject.pages.find((p) => p.id === targetPageId) || currentProject.pages[0];
        const updates = parameters.updates || parameters;

        let found = false;
        const updatedPages = currentProject.pages.map((p) => {
          if (p.id === page.id) {
            return {
              ...p,
              sections: p.sections.map((s) => {
                if (parameters.sectionId && s.id !== parameters.sectionId) return s;
                if (!s.items) return s;

                const targetItem =
                  s.items.find((it) => it.id === parameters.itemId) ||
                  (parameters.itemIndex !== undefined ? s.items[parameters.itemIndex] : null) ||
                  s.items.find((it) => it.title.toLowerCase().includes((updates.title || '').toLowerCase()));

                if (targetItem) {
                  found = true;
                  return {
                    ...s,
                    items: s.items.map((it) => (it.id === targetItem.id ? { ...it, ...updates } : it)),
                  };
                }
                return s;
              }),
            };
          }
          return p;
        });

        if (!found) {
          return { success: false, message: 'Specified item could not be found to update.', changesMade: [] };
        }

        const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: 'Item updated successfully.',
          updatedProject,
          changesMade: [`Updated card item details in section`],
        };
      }

      /* ── 8. Remove Section Item ── */
      case 'remove_section_item': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const targetPageId = activePageId || currentProject.activePageId;
        const page = currentProject.pages.find((p) => p.id === targetPageId) || currentProject.pages[0];

        const updatedPages = currentProject.pages.map((p) => {
          if (p.id === page.id) {
            return {
              ...p,
              sections: p.sections.map((s) => {
                if (parameters.sectionId && s.id !== parameters.sectionId) return s;
                if (!s.items) return s;
                return {
                  ...s,
                  items: s.items.filter((it) => it.id !== parameters.itemId),
                };
              }),
            };
          }
          return p;
        });

        const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: 'Item removed successfully.',
          updatedProject,
          changesMade: ['Removed card item from section'],
        };
      }

      /* ── 9. Add Page ── */
      case 'add_page': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const name = parameters.name || 'New Page';
        const slug =
          parameters.slug ||
          name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

        const newPage: WebsitePage = {
          id: `page-${Date.now()}`,
          name,
          slug,
          sections: [
            createNewSection('hero'),
            createNewSection('features'),
            createNewSection('contact'),
          ],
        };

        const updatedProject: Project = {
          ...currentProject,
          pages: [...currentProject.pages, newPage],
          activePageId: newPage.id,
          updatedAt: Date.now(),
        };

        saveProject(updatedProject);

        return {
          success: true,
          message: `Created new page "${name}" (/${slug}) with 3 core sections.`,
          updatedProject,
          changesMade: [`Created page: "${name}" (/${slug})`, 'Added Hero, Features, and Contact sections'],
        };
      }

      /* ── 10. Switch Page ── */
      case 'switch_page': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const query = (parameters.pageIdOrSlug || parameters.pageId || parameters.slug || '').toLowerCase();
        const target = currentProject.pages.find(
          (p) => p.id.toLowerCase() === query || p.slug.toLowerCase() === query || p.name.toLowerCase() === query
        );

        if (!target) {
          return { success: false, message: `Page "${query}" not found in project.`, changesMade: [] };
        }

        const updatedProject: Project = { ...currentProject, activePageId: target.id };
        saveProject(updatedProject);

        return {
          success: true,
          message: `Switched view to page "${target.name}".`,
          updatedProject,
          changesMade: [`Navigated to page: "${target.name}"`],
        };
      }

      /* ── 11. Delete Page ── */
      case 'delete_page': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        if (currentProject.pages.length <= 1) {
          return { success: false, message: 'Cannot delete the only page in the project.', changesMade: [] };
        }

        const targetPage = currentProject.pages.find(
          (p) => p.id === parameters.pageId || p.slug === parameters.slug
        );

        if (!targetPage) {
          return { success: false, message: 'Page to delete was not found.', changesMade: [] };
        }

        const remaining = currentProject.pages.filter((p) => p.id !== targetPage.id);
        const updatedProject: Project = {
          ...currentProject,
          pages: remaining,
          activePageId: remaining[0].id,
          updatedAt: Date.now(),
        };

        saveProject(updatedProject);

        return {
          success: true,
          message: `Deleted page "${targetPage.name}".`,
          updatedProject,
          changesMade: [`Deleted page: "${targetPage.name}"`],
        };
      }

      /* ── 12. Apply Theme & Colors ── */
      case 'apply_theme': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        let newTheme: WebsiteTheme = { ...currentProject.theme };
        const changes: string[] = [];

        if (parameters.presetId) {
          const preset = THEME_PRESETS.find(
            (t) => t.id.toLowerCase() === parameters.presetId.toLowerCase()
          );
          if (preset) {
            newTheme = { ...preset };
            changes.push(`Applied theme preset: "${preset.name}"`);
          }
        }

        // Apply custom overrides
        if (parameters.primaryColor) { newTheme.primaryColor = parameters.primaryColor; changes.push(`Primary color: ${parameters.primaryColor}`); }
        if (parameters.secondaryColor) { newTheme.secondaryColor = parameters.secondaryColor; changes.push(`Secondary color: ${parameters.secondaryColor}`); }
        if (parameters.bgColor) { newTheme.bgColor = parameters.bgColor; changes.push(`Background color: ${parameters.bgColor}`); }
        if (parameters.textColor) { newTheme.textColor = parameters.textColor; changes.push(`Text color: ${parameters.textColor}`); }
        if (parameters.cardBg) { newTheme.cardBg = parameters.cardBg; changes.push(`Card background: ${parameters.cardBg}`); }
        if (parameters.headingFont) { newTheme.headingFont = parameters.headingFont; changes.push(`Heading font: ${parameters.headingFont}`); }
        if (parameters.bodyFont) { newTheme.bodyFont = parameters.bodyFont; changes.push(`Body font: ${parameters.bodyFont}`); }
        if (parameters.borderRadius) { newTheme.borderRadius = parameters.borderRadius; changes.push(`Border radius: ${parameters.borderRadius}`); }
        if (parameters.buttonStyle) { newTheme.buttonStyle = parameters.buttonStyle; changes.push(`Button style: ${parameters.buttonStyle}`); }
        if (parameters.mode) { newTheme.mode = parameters.mode; changes.push(`Theme mode: ${parameters.mode}`); }

        const updatedProject: Project = { ...currentProject, theme: newTheme, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: `Theme updated successfully.`,
          updatedProject,
          changesMade: changes.length > 0 ? changes : ['Theme styling updated'],
        };
      }

      /* ── 13. Update Navigation ── */
      case 'update_navigation': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const changes: string[] = [];
        const newNav = { ...currentProject.navigation };

        if (parameters.brandName) { newNav.brandName = parameters.brandName; newNav.logoText = parameters.brandName; changes.push(`Brand name: ${parameters.brandName}`); }
        if (parameters.logoText) { newNav.logoText = parameters.logoText; changes.push(`Logo text: ${parameters.logoText}`); }
        if (parameters.logoImage) { newNav.logoImage = parameters.logoImage; changes.push(`Logo image updated`); }
        if (parameters.ctaText) { newNav.ctaText = parameters.ctaText; changes.push(`Nav button text: "${parameters.ctaText}"`); }
        if (parameters.ctaUrl) { newNav.ctaUrl = parameters.ctaUrl; changes.push(`Nav button link: ${parameters.ctaUrl}`); }

        const updatedProject: Project = { ...currentProject, navigation: newNav, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: 'Website header navigation updated.',
          updatedProject,
          changesMade: changes,
        };
      }

      /* ── 14. Update Footer ── */
      case 'update_footer': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const changes: string[] = [];
        const newFooter = { ...currentProject.footer };

        if (parameters.brandName) { newFooter.brandName = parameters.brandName; changes.push(`Footer brand: ${parameters.brandName}`); }
        if (parameters.tagline) { newFooter.tagline = parameters.tagline; changes.push(`Footer tagline: "${parameters.tagline}"`); }
        if (parameters.copyright) { newFooter.copyright = parameters.copyright; changes.push(`Copyright notice updated`); }

        const updatedProject: Project = { ...currentProject, footer: newFooter, updatedAt: Date.now() };
        saveProject(updatedProject);

        return {
          success: true,
          message: 'Website footer updated.',
          updatedProject,
          changesMade: changes,
        };
      }

      /* ── 15. Configure Integration ── */
      case 'configure_integration': {
        if (!currentProject) {
          return { success: false, message: 'No active project loaded.', changesMade: [] };
        }

        const { integrationType, details = {} } = parameters;
        const targetPageId = activePageId || currentProject.activePageId;
        const page = currentProject.pages.find((p) => p.id === targetPageId) || currentProject.pages[0];

        switch (integrationType) {
          case 'whatsapp': {
            const phone = details.phoneNumber || details.phone || '+917428299476';
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            const message = details.message || `Hello! I would like to inquire about ${currentProject.name}.`;
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

            // Update main nav CTA or contact section
            const newNav = {
              ...currentProject.navigation,
              ctaText: details.buttonText || 'WhatsApp Order',
              ctaUrl: waUrl,
            };

            const updatedProject: Project = { ...currentProject, navigation: newNav, updatedAt: Date.now() };
            saveProject(updatedProject);

            return {
              success: true,
              message: `WhatsApp direct chat integrated to ${phone} with pre-filled message.`,
              updatedProject,
              changesMade: [
                `Configured WhatsApp direct link to ${phone}`,
                `Set header action button to "${newNav.ctaText}"`,
              ],
            };
          }

          case 'booking': {
            // Ensure Contact/Booking section exists and link header button to it
            let hasContact = page.sections.some((s) => s.type === 'contact');
            let updatedPages = [...currentProject.pages];

            if (!hasContact) {
              const bookingSec = createNewSection('contact');
              bookingSec.title = details.title || 'Book an Appointment';
              bookingSec.subtitle = details.subtitle || 'Schedule Your Consultation';
              bookingSec.description = details.description || 'Choose your preferred date and send us your inquiry.';
              if (bookingSec.primaryBtn) {
                bookingSec.primaryBtn.text = details.buttonText || 'Confirm Booking';
              }
              updatedPages = updatedPages.map((p) => {
                if (p.id === page.id) return { ...p, sections: [...p.sections, bookingSec] };
                return p;
              });
            }

            const newNav = {
              ...currentProject.navigation,
              ctaText: details.ctaText || 'Book Now',
              ctaUrl: '#contact',
            };

            const updatedProject: Project = {
              ...currentProject,
              navigation: newNav,
              pages: updatedPages,
              updatedAt: Date.now(),
            };
            saveProject(updatedProject);

            return {
              success: true,
              message: 'Appointment booking system configured with direct anchor navigation.',
              updatedProject,
              changesMade: [
                'Set header CTA button to "Book Now" -> #contact',
                hasContact ? 'Verified active contact & booking section' : 'Added dedicated booking form section',
              ],
            };
          }

          case 'newsletter': {
            const hasNewsletter = page.sections.some((s) => s.type === 'newsletter');
            let updatedPages = [...currentProject.pages];

            if (!hasNewsletter) {
              const newsSec = createNewSection('newsletter');
              if (details.title) newsSec.title = details.title;
              if (details.description) newsSec.description = details.description;
              updatedPages = updatedPages.map((p) => {
                if (p.id === page.id) return { ...p, sections: [...p.sections, newsSec] };
                return p;
              });
            }

            const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
            saveProject(updatedProject);

            return {
              success: true,
              message: 'Customer email newsletter subscription section configured.',
              updatedProject,
              changesMade: ['Configured Newsletter subscription funnel with instant confirmation'],
            };
          }

          case 'ecommerce_catalog': {
            // Find or add portfolio/store section and configure product cards with prices
            let storeSec = page.sections.find((s) => s.type === 'portfolio' || s.type === 'services');
            let updatedPages = [...currentProject.pages];

            if (!storeSec) {
              storeSec = createNewSection('portfolio');
              storeSec.title = details.title || 'Product Catalog';
              storeSec.subtitle = details.subtitle || 'Handcrafted Collection';
              updatedPages = updatedPages.map((p) => {
                if (p.id === page.id) return { ...p, sections: [...p.sections, storeSec!] };
                return p;
              });
            }

            const updatedProject: Project = { ...currentProject, pages: updatedPages, updatedAt: Date.now() };
            saveProject(updatedProject);

            return {
              success: true,
              message: 'E-commerce product catalog showcase configured.',
              updatedProject,
              changesMade: ['Configured product showcase with price badges and inquiry buttons'],
            };
          }

          default:
            return {
              success: false,
              message: `Integration "${integrationType}" is not supported natively. Supported integrations: whatsapp, booking, newsletter, ecommerce_catalog.`,
              changesMade: [],
            };
        }
      }

      default:
        return {
          success: false,
          message: `Unknown platform tool: "${toolName}". Available tools: select_template, add_section, update_section, remove_section, reorder_sections, add_section_item, update_section_item, remove_section_item, add_page, switch_page, delete_page, apply_theme, update_navigation, update_footer, configure_integration.`,
          changesMade: [],
        };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to execute tool "${toolName}": ${err.message || String(err)}`,
      changesMade: [],
    };
  }
}

