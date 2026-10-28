import React from 'react';
import { Search, ArrowRight, CheckCircle2, ShieldCheck, Zap, Download, FileEdit } from 'lucide-react';
import { UserWebsiteDetails } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExploreTemplates: () => void;
  onStartCreating: () => void;
  websiteDetails?: UserWebsiteDetails | null;
  onEditDetails?: () => void;
}

const EXAMPLE_SEARCHES = [
  'A portfolio for a photographer',
  'A modern website for a bakery',
  'A website for a technology startup',
  'A personal portfolio for a student',
  'An elegant wedding website',
  'A website for a nonprofit organization',
  'A fashion brand\'s online store',
  'A website for a creative agency',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onExploreTemplates,
  onStartCreating,
  websiteDetails,
  onEditDetails,
}) => {
  return (
    <section className="hero-studio" style={{
      padding: '80px 0 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(177, 112, 78, 0.15) 0%, rgba(230, 191, 167, 0.05) 50%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        
        {/* Brand Tag / Active Personalization indicator */}
        <div style={{ display: 'inline-flex', marginBottom: 20 }}>
          {websiteDetails?.brandName ? (
            <button
              onClick={onEditDetails}
              className="badge-copper"
              style={{ cursor: 'pointer', border: '1px solid var(--copper-medium)' }}
            >
              <FileEdit size={13} />
              Personalizing for: <strong>{websiteDetails.brandName}</strong> (Click to edit)
            </button>
          ) : (
            <span className="badge-copper">
              MACSAC Studio • Free Website Template Customization
            </span>
          )}
        </div>

        {/* Mandatory Headline */}
        <h1 style={{
          fontSize: 'clamp(2.6rem, 6vw, 4.4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: 20,
          maxWidth: 900,
          margin: '0 auto 20px',
        }}>
          Your website <span className="text-gradient">starts here.</span>
        </h1>

        {/* Mandatory Supporting Text */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
          color: 'var(--text-secondary)',
          maxWidth: 720,
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}>
          Explore beautiful website templates, make them your own, and bring your ideas online. No coding required.
        </p>

        {/* Prominent Search Bar */}
        <div style={{
          maxWidth: 720,
          margin: '0 auto 28px',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '8px 12px 8px 20px',
            boxShadow: 'var(--shadow-md)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}>
            <Search size={22} style={{ color: 'var(--copper-medium)', marginRight: 12, flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Describe the website you want to create..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  padding: '4px 8px',
                  marginRight: 8,
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={onExploreTemplates}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.9rem', flexShrink: 0 }}
            >
              Search
            </button>
          </div>

          {/* Example searches chips */}
          <div style={{
            marginTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: 4 }}>
              Try searching:
            </span>
            {EXAMPLE_SEARCHES.map((example) => (
              <button
                key={example}
                onClick={() => onSearchChange(example)}
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: searchQuery === example ? 'var(--copper-medium)' : 'var(--bg-card)',
                  color: searchQuery === example ? '#ffffff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Calls to Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginTop: 32,
          flexWrap: 'wrap',
        }}>
          <button onClick={onExploreTemplates} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Explore Templates
            <ArrowRight size={18} />
          </button>
          <button onClick={onStartCreating} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            {websiteDetails?.brandName ? 'Update Website Details' : 'Start Creating'}
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 36,
          marginTop: 48,
          paddingTop: 32,
          borderTop: '1px solid var(--border-color-light)',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--copper-medium)' }} />
            <span>Exclusively Website Templates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <Download size={18} style={{ color: 'var(--copper-medium)' }} />
            <span>100% Free HTML & CSS Code Export</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <Zap size={18} style={{ color: 'var(--copper-medium)' }} />
            <span>Sub-12ms Cloud Ready</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--copper-medium)' }} />
            <span>No Code Knowledge Needed</span>
          </div>
        </div>

      </div>
    </section>
  );
};
