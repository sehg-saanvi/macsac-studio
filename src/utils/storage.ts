import { Project, WebsiteTemplate, UserWebsiteDetails, UserAccount } from '../types';

const STORAGE_KEY = 'macsac_studio_projects_v1';
const USER_KEY = 'macsac_studio_user_session';
const DETAILS_KEY = 'macsac_studio_onboarding_details';

export function getSavedProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load projects from localStorage', err);
    return [];
  }
}

export function saveProject(project: Project): void {
  try {
    const projects = getSavedProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    const updated = {
      ...project,
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = updated;
    } else {
      projects.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save project to localStorage', err);
  }
}

export function deleteProject(id: string): void {
  try {
    const projects = getSavedProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to delete project', err);
  }
}

export function duplicateProject(id: string): Project | null {
  try {
    const projects = getSavedProjects();
    const target = projects.find(p => p.id === id);
    if (!target) return null;

    const copy: Project = {
      ...target,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${target.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    projects.unshift(copy);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return copy;
  } catch (err) {
    console.error('Failed to duplicate project', err);
    return null;
  }
}

// User Session & Authentication Helpers
export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserSession(user: UserAccount): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logoutUser(): void {
  localStorage.removeItem(USER_KEY);
}

// Onboarding Details Helpers
export function getStoredWebsiteDetails(): UserWebsiteDetails | null {
  try {
    const raw = localStorage.getItem(DETAILS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredWebsiteDetails(details: UserWebsiteDetails): void {
  localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
}

export function clearStoredWebsiteDetails(): void {
  localStorage.removeItem(DETAILS_KEY);
}

// Project Creator with Automatic Personalization
export function createProjectFromTemplate(
  template: WebsiteTemplate,
  userDetails?: UserWebsiteDetails | null
): Project {
  // Deep clone pages to avoid mutating template blueprint
  const pagesCopy = JSON.parse(JSON.stringify(template.pages));

  const brandName = userDetails?.brandName?.trim() || template.navigation.brandName;
  const projectName = userDetails?.brandName?.trim()
    ? `${userDetails.brandName.trim()} Website`
    : `My ${template.name}`;

  // Automatically personalize the template pages and sections
  if (userDetails) {
    pagesCopy.forEach((page: any) => {
      page.sections.forEach((section: any) => {
        // If user provided custom images, assign to hero or about/portfolio
        if (section.type === 'hero' && userDetails.imageUrls && userDetails.imageUrls.length > 0) {
          section.image = userDetails.imageUrls[0];
          section.imageAlt = `${brandName} hero showcase`;
        } else if (
          (section.type === 'about' || section.type === 'portfolio') &&
          userDetails.imageUrls &&
          userDetails.imageUrls.length > 1
        ) {
          section.image = userDetails.imageUrls[1];
        }

        // If user entered brand name, personalize hero title or badge
        if (section.type === 'hero') {
          if (userDetails.brandName?.trim()) {
            // Keep original design and layout while integrating the user's business name
            section.title = `${section.title.split(' at ')[0].split(' for ')[0]} — ${brandName}`;
          }
          if (userDetails.keywords && userDetails.keywords.length > 0) {
            section.badge = `${userDetails.keywords.slice(0, 2).join(' • ').toUpperCase()}`;
          }
        }
      });
    });
  }

  const newNav = JSON.parse(JSON.stringify(template.navigation));
  if (brandName) {
    newNav.brandName = brandName;
    newNav.logoText = brandName;
  }
  if (userDetails?.logoUrl) {
    newNav.logoImage = userDetails.logoUrl;
  }

  const newFooter = JSON.parse(JSON.stringify(template.footer));
  if (brandName) {
    newFooter.brandName = brandName;
    newFooter.copyright = `© ${new Date().getFullYear()} ${brandName}. Powered by MACSAC Studio.`;
  }

  return {
    id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: projectName,
    templateId: template.id,
    templateName: template.name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pages: pagesCopy,
    activePageId: pagesCopy[0]?.id || 'home',
    theme: JSON.parse(JSON.stringify(template.theme)),
    userKeywords: userDetails?.keywords || [],
    navigation: newNav,
    footer: newFooter,
    settings: {
      title: `${brandName} — Official Website`,
      description: userDetails?.keywords && userDetails.keywords.length > 0
        ? `${brandName} — Specialized in ${userDetails.keywords.join(', ')}.`
        : template.description,
    },
  };
}
