import React, { useMemo, useState, useEffect } from 'react';
import {
  RotateCcw,
  Search,
  Layers,
  FileEdit,
  Tag,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { FilterState, WebsiteTemplate, UserWebsiteDetails } from '../types';
import { TemplateCard } from './TemplateCard';

interface TemplateGalleryProps {
  templates: WebsiteTemplate[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onPreview: (template: WebsiteTemplate) => void;
  onCustomize: (template: WebsiteTemplate) => void;
  websiteDetails?: UserWebsiteDetails | null;
  onEditDetails?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'favorites', label: 'Saved Favorites' },
  { id: 'agency', label: 'Creative Agency' },
  { id: 'portfolio', label: 'Portfolios' },
  { id: 'business', label: 'Corporate & Consulting' },
  { id: 'technology', label: 'SaaS & Tech' },
  { id: 'store', label: 'Online Stores' },
  { id: 'realestate', label: 'Real Estate & Living' },
  { id: 'hospitality', label: 'Food & Dining' },
  { id: 'editorial', label: 'Magazines & Editorial' },
  { id: 'landing', label: 'App Launch & Landing' },
  { id: 'education', label: 'Education & Non-Profit' },
  { id: 'events', label: 'Events & Conferences' },
];

const AESTHETICS = [
  { id: 'all', label: 'All Aesthetics' },
  { id: 'luxury', label: 'Copper & Luxury' },
  { id: 'editorial', label: 'Modern & Editorial' },
  { id: 'organic', label: 'Organic & Nature' },
  { id: 'dark_futuristic', label: 'Dark & Futuristic' },
  { id: 'sophisticated', label: 'Sophisticated Gold' },
  { id: 'corporate', label: 'Corporate & Clean' },
  { id: 'playful', label: 'Playful & Colorful' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'typography', label: 'Clean Typography' },
  { id: 'pastel', label: 'Soft Pastel' },
  { id: 'bold', label: 'Bold & High-Energy' },
  { id: 'retro', label: 'Rustic & Retro' },
];

// Direct Search Intent Mappings for Prompts & Common Queries
const INTENT_MAPPINGS = [
  {
    regex: /photograph|photo|camera|lens|editorial\s*noir/i,
    tags: ['photographer', 'photography', 'portfolio', 'gallery', 'artist', 'editorial'],
  },
  {
    regex: /baker|bakehouse|sourdough|bread|pastry|cafe|coffee|food|restaurant|dine/i,
    tags: ['bakery', 'cafe', 'food', 'sourdough', 'pastry', 'hospitality', 'restaurant', 'coffee'],
  },
  {
    regex: /tech|startup|saas|software|ai|cloud|neural|robotics|fintech|developer/i,
    tags: ['technology', 'tech', 'startup', 'saas', 'software', 'ai', 'cloud', 'developer', 'robotics', 'fintech'],
  },
  {
    regex: /student|scholar|academic|junior|resume|cv|university|college|internship|intern/i,
    tags: ['student', 'portfolio', 'personal portfolio', 'resume', 'academic', 'projects', 'education'],
  },
  {
    regex: /wedding|bride|groom|marriage|atelier\s*wedding|ceremony|nuptial/i,
    tags: ['wedding', 'weddings', 'events', 'love', 'atelier'],
  },
  {
    regex: /nonprofit|non-profit|charity|foundation|ngo|volunteer|earth|green|conservation|community/i,
    tags: ['nonprofit', 'charity', 'foundation', 'education', 'earth', 'community'],
  },
  {
    regex: /fashion|clothing|apparel|store|streetwear|boutique|shop|wardrobe|jewelry|ecommerce|couture/i,
    tags: ['fashion', 'store', 'apparel', 'clothing', 'streetwear', 'lookbook', 'boutique', 'shop', 'luxury', 'ecommerce'],
  },
  {
    regex: /agency|studio|creative\s*agency|branding|design\s*agency|multimedia|advisory/i,
    tags: ['agency', 'studio', 'creative', 'design', 'branding', 'business'],
  },
  {
    regex: /real\s*estate|property|properties|villa|penthouse|estate|residence|architect|architecture/i,
    tags: ['real estate', 'luxury', 'penthouses', 'villas', 'estates', 'architecture', 'property', 'monolith'],
  },
  {
    regex: /magazine|editorial|journal|blog|publication|essay|article|critique/i,
    tags: ['magazine', 'editorial', 'blog', 'journal', 'publishing', 'articles'],
  },
  {
    regex: /landing|app|mobile\s*app|waitlist|wearable|product\s*launch/i,
    tags: ['landing page', 'mobile app', 'waitlist', 'product launch', 'saas', 'biometrics'],
  },
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'of', 'in', 'on', 'at', 'to', 'is', 'and', 'with', 'from',
  'website', 'web', 'site', 'page', 'online', 'modern', 'brand', "brand's", 'personal',
  'create', 'make', 'want', 'need', 'look', 'looking', 'best', 'top', 'new', 'our', 'an'
]);

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  filters,
  onFilterChange,
  onResetFilters,
  onPreview,
  onCustomize,
  websiteDetails,
  onEditDetails,
}) => {
  const [savedFavorites, setSavedFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('macsac_studio_favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleFavChange = () => {
      try {
        setSavedFavorites(JSON.parse(localStorage.getItem('macsac_studio_favorites') || '[]'));
      } catch {
        // ignore
      }
    };
    window.addEventListener('macsac_favorites_changed', handleFavChange);
    window.addEventListener('storage', handleFavChange);
    return () => {
      window.removeEventListener('macsac_favorites_changed', handleFavChange);
      window.removeEventListener('storage', handleFavChange);
    };
  }, []);

  // Intelligent Search and Filter logic with zero dead-ends
  const { filteredTemplates, isFallback } = useMemo(() => {
    const userKws = (websiteDetails?.keywords || []).map((k) => k.toLowerCase().trim());
    const rawQuery = filters.searchQuery.toLowerCase().trim();

    // 1. Identify matched intent tags from query
    const intentTags: string[] = [];
    if (rawQuery) {
      for (const m of INTENT_MAPPINGS) {
        if (m.regex.test(rawQuery)) {
          intentTags.push(...m.tags);
        }
      }
    }

    // 2. Extract clean individual keywords (excluding stop words)
    const queryTokens = rawQuery
      ? rawQuery
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
      : [];

    // Filter templates
    const directMatches = templates
      .map((t) => {
        let score = 0;
        const nameLower = t.name.toLowerCase();
        const descLower = t.description.toLowerCase();
        const catLower = t.category.toLowerCase();
        const catLabelLower = t.categoryLabel.toLowerCase();
        const aesLower = t.aesthetic.toLowerCase();
        const aesLabelLower = t.aestheticLabel.toLowerCase();
        const tagsLower = t.tags.map((tg) => tg.toLowerCase());

        // Category filter
        if (filters.category === 'favorites') {
          if (!savedFavorites.includes(t.id)) {
            return { template: t, score: -1 };
          }
        } else if (filters.category !== 'all' && t.category !== filters.category) {
          return { template: t, score: -1 };
        }

        // Aesthetic filter
        if (filters.aesthetic !== 'all' && t.aesthetic !== filters.aesthetic) {
          return { template: t, score: -1 };
        }

        // Audience filter
        if (filters.audience !== 'all' && t.targetAudience !== 'both' && t.targetAudience !== filters.audience) {
          return { template: t, score: -1 };
        }

        // Theme mode filter
        if (filters.themeMode !== 'all' && t.themeMode !== filters.themeMode) {
          return { template: t, score: -1 };
        }

        // Multi-page vs Single-page
        if (filters.pageType === 'multi' && !t.isMultiPage) return { template: t, score: -1 };
        if (filters.pageType === 'single' && t.isMultiPage) return { template: t, score: -1 };

        // If no search query, base score 10
        if (!rawQuery) {
          return { template: t, score: 10 };
        }

        // Exact raw phrase match
        if (nameLower.includes(rawQuery)) score += 60;
        if (descLower.includes(rawQuery)) score += 35;
        if (tagsLower.some((tg) => tg.includes(rawQuery) || rawQuery.includes(tg))) score += 45;

        // Intent tags match
        if (intentTags.length > 0) {
          for (const itag of intentTags) {
            if (tagsLower.includes(itag)) score += 30;
            if (catLower.includes(itag) || catLabelLower.includes(itag)) score += 25;
            if (nameLower.includes(itag)) score += 20;
            if (descLower.includes(itag)) score += 12;
          }
        }

        // Token keywords match
        for (const token of queryTokens) {
          if (nameLower.includes(token)) score += 25;
          if (tagsLower.some((tg) => tg.includes(token) || token.includes(tg))) score += 20;
          if (catLower.includes(token) || catLabelLower.includes(token)) score += 18;
          if (aesLower.includes(token) || aesLabelLower.includes(token)) score += 12;
          if (descLower.includes(token)) score += 10;
          if (t.pages.some((p) => p.name.toLowerCase().includes(token))) score += 8;
        }

        return { template: t, score };
      })
      .filter((item) => item.score > 0);

    // If matches found
    if (directMatches.length > 0) {
      const sorted = directMatches
        .sort((a, b) => {
          // If search query is active, sort by relevance score first
          if (rawQuery && b.score !== a.score) {
            return b.score - a.score;
          }

          // User onboarding keywords boosting
          if (userKws.length > 0) {
            const matchA = a.template.tags.some((tg) => userKws.some((k) => tg.toLowerCase().includes(k) || k.includes(tg.toLowerCase())));
            const matchB = b.template.tags.some((tg) => userKws.some((k) => tg.toLowerCase().includes(k) || k.includes(tg.toLowerCase())));
            if (matchA && !matchB) return -1;
            if (!matchA && matchB) return 1;
          }

          if (filters.sortBy === 'popular') {
            return (b.template.isPopular ? 1 : 0) - (a.template.isPopular ? 1 : 0);
          }
          if (filters.sortBy === 'newest') {
            return (b.template.isNew ? 1 : 0) - (a.template.isNew ? 1 : 0);
          }
          if (filters.sortBy === 'name') {
            return a.template.name.localeCompare(b.template.name);
          }
          return 0;
        })
        .map((item) => item.template);

      return { filteredTemplates: sorted, isFallback: false };
    }

    // Fallback: If query had no exact tokens, show top recommended popular templates so user NEVER sees "No templates found"
    const fallbackList = templates
      .filter((t) => {
        if (filters.themeMode !== 'all' && t.themeMode !== filters.themeMode) return false;
        return true;
      })
      .slice(0, 8);

    return { filteredTemplates: fallbackList, isFallback: true };
  }, [templates, filters, websiteDetails, savedFavorites]);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.aesthetic !== 'all' ||
    filters.audience !== 'all' ||
    filters.themeMode !== 'all' ||
    filters.pageType !== 'all' ||
    Boolean(filters.searchQuery.trim());

  return (
    <section id="template-gallery" style={{ padding: '40px 0 100px' }}>
      <div className="container">
        
        {/* Personalization Banner when details are submitted */}
        {websiteDetails?.brandName && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--copper-glow)',
              border: '1px solid var(--border-color)',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--copper-medium)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Personalized For: <span style={{ color: 'var(--copper-dark)' }}>{websiteDetails.brandName}</span>
                </span>
                {websiteDetails.keywords && websiteDetails.keywords.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Focus Keywords:</span>
                    {websiteDetails.keywords.map((kw) => (
                      <span key={kw} style={{ fontSize: '0.72rem', background: 'var(--bg-card)', padding: '1px 8px', borderRadius: 4, fontWeight: 600 }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {onEditDetails && (
              <button
                onClick={onEditDetails}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--copper-medium)',
                  background: 'var(--bg-card)',
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                <FileEdit size={14} /> Edit Details
              </button>
            )}
          </div>
        )}

        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <div className="badge-copper" style={{ marginBottom: 10 }}>
              <Layers size={13} />
              Website Template Library ({templates.length} Distinct Designs)
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
              Curated Website Designs for Every Industry
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: 4 }}>
              Choose a design, preview full-page, and personalize with your business details and brand style.
            </p>
          </div>

          {/* Result Count and Clear Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredTemplates.length}</strong> of {templates.length} templates
            </span>
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.82rem',
                  color: 'var(--copper-medium)',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                }}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 12,
          marginBottom: 24,
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              style={{
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                background: filters.category === cat.id ? 'var(--copper-medium)' : 'var(--bg-card)',
                color: filters.category === cat.id ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: filters.category === cat.id ? 'var(--shadow-copper)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {cat.id === 'favorites' && (
                <Heart size={13} fill={filters.category === 'favorites' ? '#ffffff' : '#e11d48'} color={filters.category === 'favorites' ? '#ffffff' : '#e11d48'} />
              )}
              {cat.label}
              {cat.id === 'favorites' && savedFavorites.length > 0 && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '1px 6px',
                  borderRadius: 9999,
                  background: filters.category === 'favorites' ? 'rgba(255,255,255,0.25)' : 'var(--copper-glow)',
                  color: filters.category === 'favorites' ? '#ffffff' : 'var(--copper-dark)',
                  fontWeight: 700,
                }}>
                  {savedFavorites.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls Bar */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            
            {/* Visual Aesthetic Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Aesthetic:</span>
              <select
                value={filters.aesthetic}
                onChange={(e) => onFilterChange({ aesthetic: e.target.value })}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                {AESTHETICS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            {/* Target Audience: Business or Personal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Audience:</span>
              <select
                value={filters.audience}
                onChange={(e) => onFilterChange({ audience: e.target.value })}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="all">All Audiences</option>
                <option value="business">Business & Commercial</option>
                <option value="personal">Personal & Portfolio</option>
              </select>
            </div>

            {/* Light / Dark Mode filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Theme:</span>
              <select
                value={filters.themeMode}
                onChange={(e) => onFilterChange({ themeMode: e.target.value })}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="all">Any Theme</option>
                <option value="light">Light Aesthetic</option>
                <option value="dark">Dark Aesthetic</option>
              </select>
            </div>

            {/* Page Count: Multi-page vs Single */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pages:</span>
              <select
                value={filters.pageType}
                onChange={(e) => onFilterChange({ pageType: e.target.value })}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="all">All Formats</option>
                <option value="multi">Multi-Page Website</option>
                <option value="single">Single-Page Landing</option>
              </select>
            </div>

          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Added</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Fallback Banner if query had no exact match */}
        {isFallback && filters.searchQuery && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(177, 112, 78, 0.12), rgba(230, 191, 167, 0.08))',
            border: '1px solid var(--copper-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 22px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Showing top recommended templates for: <span style={{ color: 'var(--copper-light)' }}>"{filters.searchQuery}"</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Explore these customizable designs or clear your search to browse all categories.
              </div>
            </div>
            <button
              onClick={onResetFilters}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Templates Grid */}
        {filters.category === 'favorites' && filteredTemplates.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            <Heart size={44} color="#e11d48" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>No Saved Templates Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 20 }}>
              Click the heart icon on any template card while browsing to bookmark your favorite designs here for quick access and comparison.
            </p>
            <button
              onClick={() => onFilterChange({ category: 'all' })}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              Browse All Templates
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 28,
          }}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={onPreview}
                onCustomize={onCustomize}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
