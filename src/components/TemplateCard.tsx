import React, { useState } from 'react';
import { Eye, Edit3, Monitor, Tablet, Smartphone, Layers } from 'lucide-react';
import { WebsiteTemplate } from '../types';

interface TemplateCardProps {
  template: WebsiteTemplate;
  onPreview: (template: WebsiteTemplate) => void;
  onCustomize: (template: WebsiteTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onCustomize,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
      }}
    >
      {/* Top Browser Chrome simulation */}
      <div style={{
        background: 'var(--bg-tertiary)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <span style={{
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
        }}>
          {template.id}.macsac.live
        </span>
        <div style={{ display: 'flex', gap: 4, color: 'var(--text-muted)' }}>
          <Monitor size={12} />
          <Smartphone size={12} />
        </div>
      </div>

      {/* Website Preview Container */}
      <div style={{ position: 'relative', height: 230, overflow: 'hidden', background: '#1c1815' }}>
        <img
          src={template.previewImage}
          alt={`${template.name} website preview`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Badge Overlays */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {template.isPopular && (
            <span style={{
              background: 'var(--copper-medium)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              Popular
            </span>
          )}
          {template.isNew && (
            <span style={{
              background: '#059669',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              New
            </span>
          )}
        </div>

        {/* Page Count Badge */}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <span style={{
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            fontSize: '0.7rem',
            padding: '3px 8px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <Layers size={11} /> {template.pages.length} {template.pages.length > 1 ? 'Pages' : 'Page'}
          </span>
        </div>

        {/* Hover Overlay with Preview & Customize Actions */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(28, 24, 21, 0.72)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
            transition: 'opacity 0.25s ease',
            padding: 20,
          }}
        >
          <button
            onClick={() => onPreview(template)}
            style={{
              width: '85%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'white',
              color: '#1c1815',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease',
            }}
          >
            <Eye size={16} /> Preview Website
          </button>
          <button
            onClick={() => onCustomize(template)}
            style={{
              width: '85%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'var(--copper-medium)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
              boxShadow: '0 4px 12px rgba(177, 112, 78, 0.4)',
              transition: 'transform 0.2s ease',
            }}
          >
            <Edit3 size={16} /> Customize Template
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Category & Aesthetic Tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--copper-medium)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {template.categoryLabel}
          </span>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-tertiary)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {template.aestheticLabel}
          </span>
        </div>

        {/* Template Name */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          marginBottom: 8,
          color: 'var(--text-primary)',
        }}>
          {template.name}
        </h3>

        {/* Short description */}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 16,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {template.description}
        </p>

        {/* Bottom Metadata & Static Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--border-color)',
        }}>
          {/* Responsive design indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.75rem' }} title="Full Responsive Design">
            <Monitor size={15} />
            <Tablet size={15} />
            <Smartphone size={15} />
            <span style={{ marginLeft: 2 }}>Fluid</span>
          </div>

          {/* Quick buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onPreview(template)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Eye size={13} /> Preview
            </button>
            <button
              onClick={() => onCustomize(template)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'white',
                background: 'var(--copper-medium)',
                padding: '6px 12px',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Edit3 size={13} /> Customize
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
