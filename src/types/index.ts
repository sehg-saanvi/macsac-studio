export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'portfolio'
  | 'testimonials'
  | 'team'
  | 'pricing'
  | 'faq'
  | 'contact'
  | 'newsletter'
  | 'cta'
  | 'footer';

export interface SectionItem {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  image?: string;
  icon?: string;
  tag?: string;
  price?: string;
  period?: string;
  url?: string;
  stars?: number;
  author?: string;
  role?: string;
}

export interface WebsiteSection {
  id: string;
  type: SectionType;
  layoutVariant: 'centered' | 'split' | 'grid' | 'cards' | 'minimal' | 'masonry' | 'banner';
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  primaryBtn?: { text: string; url: string; show: boolean };
  secondaryBtn?: { text: string; url: string; show: boolean };
  image?: string;
  imageAlt?: string;
  bgVariant?: 'default' | 'card' | 'muted' | 'accent' | 'dark';
  items?: SectionItem[];
  paddingY?: 'compact' | 'normal' | 'spacious';
  textAlign?: 'left' | 'center';
}

export interface WebsitePage {
  id: string;
  name: string;
  slug: string;
  isHome?: boolean;
  sections: WebsiteSection[];
  grapesHtml?: string;
  grapesData?: Record<string, any>;
}

export interface WebsiteTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  textMuted: string;
  cardBg: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string; // '4px' | '8px' | '16px' | '24px' | '9999px'
  buttonStyle: 'rounded' | 'pill' | 'sharp' | 'outline' | 'copperGlow';
  mode: 'light' | 'dark';
}

export type TemplateCategory =
  | 'business'
  | 'portfolio'
  | 'store'
  | 'education'
  | 'hospitality'
  | 'events'
  | 'technology';

export type TemplateAesthetic =
  | 'minimalist'
  | 'editorial'
  | 'luxury'
  | 'playful'
  | 'corporate'
  | 'brutalist'
  | 'retro'
  | 'pastel'
  | 'dark_futuristic'
  | 'sophisticated'
  | 'organic'
  | 'bold'
  | 'typography';

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  categoryLabel: string;
  aesthetic: TemplateAesthetic;
  aestheticLabel: string;
  targetAudience: 'business' | 'personal' | 'both';
  themeMode: 'light' | 'dark';
  isMultiPage: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  previewImage: string;
  tags: string[];
  pages: WebsitePage[];
  theme: WebsiteTheme;
  navigation: {
    brandName: string;
    logoText: string;
    logoImage?: string;
    links: Array<{ id: string; label: string; pageSlug: string }>;
    ctaText: string;
    ctaUrl: string;
  };
  footer: {
    brandName: string;
    tagline: string;
    copyright: string;
    links: Array<{ label: string; url: string }>;
    socialLinks: Array<{ platform: string; url: string }>;
  };
}

export interface Project {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  createdAt: number;
  updatedAt: number;
  pages: WebsitePage[];
  activePageId: string;
  theme: WebsiteTheme;
  userKeywords?: string[];
  navigation: {
    brandName: string;
    logoText: string;
    logoImage?: string;
    links: Array<{ id: string; label: string; pageSlug: string }>;
    ctaText: string;
    ctaUrl: string;
  };
  footer: {
    brandName: string;
    tagline: string;
    copyright: string;
    links: Array<{ label: string; url: string }>;
    socialLinks: Array<{ platform: string; url: string }>;
  };
  settings: {
    title: string;
    description: string;
    favicon?: string;
  };
  grapesData?: Record<string, any>;
  grapesHtml?: string;
  grapesCss?: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface FilterState {
  searchQuery: string;
  category: string;
  aesthetic: string;
  audience: string;
  themeMode: string;
  pageType: string;
  onlyFree: boolean;
  sortBy: 'popular' | 'newest' | 'name';
}

export interface UserWebsiteDetails {
  brandName: string;
  keywords: string[];
  logoUrl?: string;
  imageUrls?: string[];
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  createdAt: number;
}
