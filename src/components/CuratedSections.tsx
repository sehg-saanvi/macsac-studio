import React from 'react';
import { TrendingUp, Briefcase, Camera, Compass, Building, Sparkles } from 'lucide-react';
import { WebsiteTemplate } from '../types';
import { TemplateCard } from './TemplateCard';

interface CuratedSectionsProps {
  templates: WebsiteTemplate[];
  onPreview: (template: WebsiteTemplate) => void;
  onCustomize: (template: WebsiteTemplate) => void;
  onSelectCategory: (category: string) => void;
  onSelectAesthetic: (aesthetic: string) => void;
}

export const CuratedSections: React.FC<CuratedSectionsProps> = ({
  templates,
  onPreview,
  onCustomize,
  onSelectCategory,
  onSelectAesthetic,
}) => {
  const popularTemplates = templates.filter(t => t.isPopular).slice(0, 3);
  const businessTemplates = templates.filter(t => t.category === 'business').slice(0, 3);
  const portfolioTemplates = templates.filter(t => t.category === 'portfolio').slice(0, 3);
  const realEstateTemplates = templates.filter(t => t.category === 'realestate').slice(0, 3);

  const purposeList = [
    { id: 'agency', label: 'Creative Agencies', desc: 'Design ateliers, branding & media studios' },
    { id: 'business', label: 'Corporate & Consulting', desc: 'Strategic advisory, capital & legal practices' },
    { id: 'realestate', label: 'Real Estate & Living', desc: 'Prime penthouses, villas & architecture' },
    { id: 'portfolio', label: 'Portfolios & Art', desc: 'Designers, creative coders & photographers' },
    { id: 'technology', label: 'SaaS & Deep Tech', desc: 'AI runtimes, edge cloud & robotics' },
    { id: 'store', label: 'Online Stores', desc: 'Haute couture, fine jewelry & ceramics' },
    { id: 'hospitality', label: 'Dining & Hospitality', desc: 'Artisan bakeries, trattorias & luxury resorts' },
    { id: 'editorial', label: 'Magazines & Editorial', desc: 'Design critiques, tech journals & publications' },
    { id: 'landing', label: 'App Launch & Waitlist', desc: 'Next-gen mobile apps & consumer wearables' },
    { id: 'education', label: 'Education & Non-Profit', desc: 'Conservation foundations & academies' },
    { id: 'events', label: 'Conferences & Events', desc: 'Global tech summits & ateliers' },
  ];

  const aestheticList = [
    { id: 'luxury', label: 'Copper Luxury', desc: 'MACSAC signature bronze & off-white aesthetic' },
    { id: 'dark_futuristic', label: 'Dark Futuristic', desc: 'Obsidian blacks, neon accents & monospace code' },
    { id: 'editorial', label: 'Modern & Editorial', desc: 'High-contrast fashion serif & spacious galleries' },
    { id: 'organic', label: 'Organic & Nature', desc: 'Warm stone, terracotta & emerald botanicals' },
    { id: 'playful', label: 'Playful & Colorful', desc: 'Punchy tangerine, pill buttons & lively dynamics' },
    { id: 'corporate', label: 'Corporate & Clean', desc: 'Navy authority, crisp slate & quantitative clarity' },
  ];

  return (
    <div className="curated-sections" style={{ padding: '40px 0' }}>
      
      {/* 1. Popular Website Templates */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="badge-copper" style={{ marginBottom: 8 }}>
                <TrendingUp size={13} /> Highly Rated
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Popular Website Templates</h2>
            </div>
            <button
              onClick={() => onSelectCategory('all')}
              style={{ fontSize: '0.88rem', color: 'var(--copper-medium)', fontWeight: 600 }}
            >
              View all templates →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {popularTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} onPreview={onPreview} onCustomize={onCustomize} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Websites for Businesses */}
      <section style={{ padding: '40px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="badge-copper" style={{ marginBottom: 8 }}>
                <Briefcase size={13} /> Commercial Authority
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Websites for Modern Businesses</h2>
            </div>
            <button
              onClick={() => onSelectCategory('business')}
              style={{ fontSize: '0.88rem', color: 'var(--copper-medium)', fontWeight: 600 }}
            >
              All Business Templates →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {businessTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} onPreview={onPreview} onCustomize={onCustomize} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Creative Portfolios */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="badge-copper" style={{ marginBottom: 8 }}>
                <Camera size={13} /> Showcase & Art
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Creative Portfolios</h2>
            </div>
            <button
              onClick={() => onSelectCategory('portfolio')}
              style={{ fontSize: '0.88rem', color: 'var(--copper-medium)', fontWeight: 600 }}
            >
              All Portfolios →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {portfolioTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} onPreview={onPreview} onCustomize={onCustomize} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury Real Estate & Architecture */}
      {realEstateTemplates.length > 0 && (
        <section style={{ padding: '40px 0', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div className="badge-copper" style={{ marginBottom: 8 }}>
                  <Building size={13} /> Architectural Pedigree
                </div>
                <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Real Estate & Architectural Living</h2>
              </div>
              <button
                onClick={() => onSelectCategory('realestate')}
                style={{ fontSize: '0.88rem', color: 'var(--copper-medium)', fontWeight: 600 }}
              >
                All Real Estate Templates →
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24,
            }}>
              {realEstateTemplates.map((t) => (
                <TemplateCard key={t.id} template={t} onPreview={onPreview} onCustomize={onCustomize} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Templates Organized by Purpose & Aesthetic */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 48px' }}>
            <div className="badge-copper" style={{ marginBottom: 10 }}>
              <Compass size={13} /> Fast Navigation
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore by Purpose & Aesthetic</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.96rem' }}>
              Jump straight to the category or visual design language that matches your brand vision.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {purposeList.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectCategory(p.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--copper-medium)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.label}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--copper-medium)', fontWeight: 700 }}>Explore →</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Aesthetic tags row */}
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Browse by Aesthetic Language:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {aestheticList.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onSelectAesthetic(a.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--copper-medium)';
                    e.currentTarget.style.color = 'var(--copper-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  ✦ {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
