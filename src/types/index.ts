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
  | 'footer'
  | 'menu'
  | 'properties'
  | 'blog'
  | 'specs'
  | 'stats'
  | 'timeline';

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
  badge?: string;
  specs?: Record<string, string | number>;
  metrics?: Array<{ label: string; value: string }>;
}

export interface WebsiteSection {
  id: string;
  type: SectionType;
  layoutVariant:
    | 'centered'
    | 'split'
    | 'grid'
    | 'cards'
    | 'minimal'
    | 'masonry'
    | 'banner'
    | 'editorial'
    | 'cinema'
    | 'terminal'
    | 'asymmetric'
    | 'bento'
    | 'lookbook'
    | 'showcase'
    | 'specs'
    | 'menu'
    | 'properties'
    | 'timeline'
    | 'magazine'
    | 'neo-brutalist'
    | 'portrait'
    | 'diagonal'
    | 'typographic'
    | 'organic'
    | 'luxury-stacked'
    | 'architect'
    | 'magazine-cover'
    | 'swiss';
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
  customCodeSnippet?: string;
  properties?: Array<{
    id: string;
    title: string;
    location: string;
    price: string;
    beds: number;
    baths: number;
    sqft: number;
    image: string;
    tag?: string;
    description?: string;
  }>;
  articles?: Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    readTime: string;
    category: string;
    image: string;
  }>;
  specItems?: Array<{ label: string; value: string }>;
  timelineSteps?: Array<{ step: string; title: string; description: string }>;
  stats?: Array<{ value: string; label: string }>;
  services?: Array<{ id: string; title: string; description: string; icon?: string }>;
  features?: Array<{ id: string; title: string; description: string; icon?: string }>;
  tiers?: Array<{
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    highlighted?: boolean;
  }>;
  email?: string;
  phone?: string;
  address?: string;
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
  borderRadius: string; // '4px' | '8px' | '12px' | '16px' | '24px' | '9999px'
  buttonStyle: 'rounded' | 'pill' | 'sharp' | 'outline' | 'copperGlow';
  mode: 'light' | 'dark';
}

export type TemplateCategory =
  | 'business'
  | 'portfolio'
  | 'store'
  | 'technology'
  | 'hospitality'
  | 'education'
  | 'editorial'
  | 'realestate'
  | 'agency'
  | 'landing'
  | 'events';

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
    tagline?: string;
    layoutStyle?:
      | 'standard'
      | 'centered'
      | 'floating'
      | 'cinema'
      | 'minimal'
      | 'masthead'
      | 'terminal'
      | 'luxury-split'
      | 'editorial'
      | 'two-tier'
      | 'brutalist';
    announcement?: string;
    secondaryInfo?: string;
    statusBadge?: string;
    metaText?: string;
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
    tagline?: string;
    layoutStyle?:
      | 'standard'
      | 'centered'
      | 'floating'
      | 'cinema'
      | 'minimal'
      | 'masthead'
      | 'terminal'
      | 'luxury-split'
      | 'editorial'
      | 'two-tier'
      | 'brutalist';
    announcement?: string;
    secondaryInfo?: string;
    statusBadge?: string;
    metaText?: string;
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
