import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Monitor, Tablet, Smartphone, Layers, Heart } from 'lucide-react';
import { WebsiteTemplate } from '../types';
import { TemplateLayoutMockup } from './TemplateLayoutMockup';

interface TemplateCardProps {
  template: WebsiteTemplate;
  onPreview: (template: WebsiteTemplate) => void;
  onCustomize: (template: WebsiteTemplate) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onCustomize,
  isFavorited = false,
  onToggleFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [fav, setFav] = useState(isFavorited);

  useEffect(() => {
    setFav(isFavorited);
  }, [isFavorited]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    if (onToggleFavorite) {
      onToggleFavorite(template.id);
    } else {
      try {
        const raw = localStorage.getItem('macsac_studio_favorites') || '[]';
        const list: string[] = JSON.parse(raw);
        const updated = next ? [...list, template.id] : list.filter((id) => id !== template.id);
        localStorage.setItem('macsac_studio_favorites', JSON.stringify(updated));
        window.dispatchEvent(new Event('macsac_favorites_changed'));
      } catch {
        // ignore
      }
    }
  };

  // Determine key hero structural feature
  const heroSection = template.pages[0]?.sections.find((s) => s.type === 'hero');
  const heroVariantLabel =
    heroSection?.layoutVariant === 'cinema'
      ? 'Cinema Mode'
      : heroSection?.layoutVariant === 'terminal'
      ? 'CLI Terminal'
      : heroSection?.layoutVariant === 'asymmetric'
      ? 'Asymmetric Art'
      : heroSection?.layoutVariant === 'bento'
      ? 'Bento Grid'
      : heroSection?.layoutVariant === 'minimal'
      ? 'Minimal Stark'
      : heroSection?.layoutVariant === 'centered'
      ? 'Centered Showcase'
      : heroSection?.layoutVariant === 'neo-brutalist'
      ? 'Neo-Brutalist'
      : heroSection?.layoutVariant === 'portrait'
      ? 'Portrait Layout'
      : heroSection?.layoutVariant === 'swiss'
      ? 'Swiss Editorial'
      : heroSection?.layoutVariant === 'typographic'
      ? 'Typographic'
      : heroSection?.layoutVariant === 'organic'
      ? 'Organic Flow'
      : heroSection?.layoutVariant === 'magazine-cover'
      ? 'Magazine Cover'
      : heroSection?.layoutVariant === 'architect' || heroSection?.layoutVariant === 'diagonal'
      ? 'Diagonal Cut'
      : heroSection?.layoutVariant === 'luxury-stacked'
      ? 'Luxury Stacked'
      : heroSection?.layoutVariant === 'lookbook'
      ? 'Lookbook'
      : heroSection?.layoutVariant === 'magazine'
      ? 'Magazine'
      : 'Split Layout';

  return (
    <div
      className="template-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Top Browser Chrome simulation */}
      <div
        style={{
          background: 'var(--bg-tertiary)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <span
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            background: 'var(--bg-card)',
            padding: '2px 10px',
            borderRadius: 4,
            maxWidth: 180,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {template.id}.macsac.live
        </span>
        <div style={{ display: 'flex', gap: 4, color: 'var(--text-muted)' }}>
          <Monitor size={12} />
          <Tablet size={12} />
          <Smartphone size={12} />
        </div>
      </div>

      {/* Website Preview Container — CSS Layout Mockup */}
      <div style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
        <div
          style={{
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            transformOrigin: 'top center',
            height: '100%',
          }}
        >
          <TemplateLayoutMockup template={template} height={230} />
        </div>

        {/* Badge Overlays (Left) */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {template.isPopular && (
            <span
              style={{
                background: 'var(--copper-medium)',
                color: 'white',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              Popular
            </span>
          )}
          {template.isNew && (
            <span
              style={{
                background: '#059669',
                color: 'white',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              New
            </span>
          )}
          <span
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: '#38bdf8',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {heroVariantLabel}
          </span>
        </div>

        {/* Favorite & Page Count Badges (Right) */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={handleFavoriteClick}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: fav ? '#f43f5e' : 'rgba(0,0,0,0.65)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
            }}
            title={fav ? 'Remove from favorites' : 'Add to favorite templates'}
          >
            <Heart size={14} fill={fav ? '#ffffff' : 'none'} />
          </button>

          <span
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              fontSize: '0.68rem',
              padding: '3px 8px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Layers size={11} /> {template.pages.length} {template.pages.length > 1 ? 'Pages' : 'Page'}
          </span>
        </div>

        {/* Hover Overlay with Preview & Customize Actions */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(28, 24, 21, 0.74)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
            transition: 'opacity 0.25s ease',
            padding: 20,
          }}
        >
          <button
            onClick={() => onPreview(template)}
            style={{
              width: '88%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'white',
              color: '#1c1815',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.86rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
            }}
          >
            <Eye size={15} /> Preview Website
          </button>
          <button
            onClick={() => onCustomize(template)}
            style={{
              width: '88%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'var(--copper-medium)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.86rem',
              boxShadow: '0 4px 12px rgba(177, 112, 78, 0.4)',
              cursor: 'pointer',
            }}
          >
            <Edit3 size={15} /> Use Template
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category & Aesthetic Tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--copper-medium)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {template.categoryLabel}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              background: 'var(--bg-tertiary)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {template.aestheticLabel}
          </span>
        </div>

        {/* Template Name */}
        <h3
          style={{
            fontSize: '1.12rem',
            fontWeight: 800,
            marginBottom: 6,
            color: 'var(--text-primary)',
          }}
        >
          {template.name}
        </h3>

        {/* Short description */}
        <p
          style={{
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: 12,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {template.description}
        </p>

        {/* Included Pages Pills */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
          {template.pages.map((p) => (
            <span
              key={p.id}
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {p.name}
            </span>
          ))}
        </div>

        {/* Bottom Metadata & Static Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {/* Responsive design indicators */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.74rem' }}
            title="Desktop, Tablet & Mobile Responsive"
          >
            <Monitor size={14} />
            <Tablet size={14} />
            <Smartphone size={14} />
            <span style={{ marginLeft: 2, fontWeight: 600 }}>Adaptive</span>
          </div>

          {/* Quick buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => onPreview(template)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <Eye size={12} /> Preview
            </button>
            <button
              onClick={() => onCustomize(template)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'white',
                background: 'var(--copper-medium)',
                border: 'none',
                padding: '5px 12px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={12} /> Use
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
