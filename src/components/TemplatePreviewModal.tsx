import React, { useState } from 'react';
import { X, Edit3, Monitor, Tablet, Smartphone, ArrowLeft } from 'lucide-react';
import { ViewportMode, WebsiteTemplate } from '../types';
import { WebsiteRenderer } from './WebsiteRenderer';

interface TemplatePreviewModalProps {
  template: WebsiteTemplate | null;
  onClose: () => void;
  onCustomize: (template: WebsiteTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onCustomize,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [activePageId, setActivePageId] = useState<string>(template?.pages[0]?.id || 'home');

  if (!template) return null;

  const activePage = template.pages.find(p => p.id === activePageId) || template.pages[0];

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return '390px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
    }
  };

  return (
    <div className="modal-overlay" style={{ padding: 0 }}>
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#0d0d0f',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        
        {/* Top Preview Action Bar */}
        <header style={{
          height: 64,
          background: '#161413',
          borderBottom: '1px solid #2d2622',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 20,
        }}>
          {/* Left: Back button & Template Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#dcd2ca',
                fontSize: '0.88rem',
                fontWeight: 600,
                padding: '8px 14px',
                borderRadius: 8,
                background: '#241c18',
                border: '1px solid #3d2f28',
              }}
            >
              <ArrowLeft size={16} /> Back to Gallery
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.98rem' }}>
                {template.name}
              </span>
              <span style={{ color: '#a6988f', fontSize: '0.75rem' }}>
                {template.categoryLabel} • {template.aestheticLabel}
              </span>
            </div>
          </div>

          {/* Center: Device Switcher & Page Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Multi-page Switcher */}
            {template.pages.length > 1 && (
              <div style={{
                display: 'flex',
                background: '#090706',
                borderRadius: 8,
                padding: 3,
                border: '1px solid #332721',
              }}>
                {template.pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActivePageId(page.id)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 6,
                      background: activePageId === page.id ? 'var(--copper-medium)' : 'transparent',
                      color: activePageId === page.id ? '#ffffff' : '#a6988f',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )}

            {/* Device Switcher */}
            <div style={{
              display: 'flex',
              background: '#090706',
              borderRadius: 8,
              padding: 3,
              border: '1px solid #332721',
            }}>
              <button
                onClick={() => setViewport('desktop')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  color: viewport === 'desktop' ? '#ffffff' : '#7d6f66',
                  background: viewport === 'desktop' ? '#2d2622' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
                title="Desktop View (100%)"
              >
                <Monitor size={15} /> Desktop
              </button>
              <button
                onClick={() => setViewport('tablet')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  color: viewport === 'tablet' ? '#ffffff' : '#7d6f66',
                  background: viewport === 'tablet' ? '#2d2622' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
                title="Tablet View (768px)"
              >
                <Tablet size={15} /> Tablet
              </button>
              <button
                onClick={() => setViewport('mobile')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  color: viewport === 'mobile' ? '#ffffff' : '#7d6f66',
                  background: viewport === 'mobile' ? '#2d2622' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
                title="Mobile View (390px)"
              >
                <Smartphone size={15} /> Mobile
              </button>
            </div>
          </div>

          {/* Right: Customize CTA & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => {
                onClose();
                onCustomize(template);
              }}
              className="btn-primary"
              style={{
                padding: '9px 20px',
                fontSize: '0.9rem',
              }}
            >
              <Edit3 size={15} /> Customize Template
            </button>
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#241c18',
                color: '#dcd2ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Viewport Frame */}
        <div style={{
          flex: 1,
          overflowY: viewport === 'desktop' ? 'auto' : 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: viewport === 'desktop' ? 'stretch' : 'center',
          padding: viewport === 'desktop' ? 0 : '24px 16px',
          background: '#090706',
          scrollBehavior: 'smooth',
        }}>
          <div
            style={{
              width: getViewportWidth(),
              maxWidth: '100%',
              height: viewport === 'desktop' ? 'auto' : 'calc(100vh - 120px)',
              maxHeight: viewport === 'desktop' ? 'none' : '840px',
              minHeight: viewport === 'desktop' ? '100%' : '480px',
              background: template.theme.bgColor,
              color: template.theme.textColor,
              borderRadius: viewport === 'mobile' ? 36 : viewport === 'tablet' ? 24 : 0,
              boxShadow: viewport === 'desktop' ? 'none' : '0 25px 60px rgba(0,0,0,0.85), 0 0 0 1px #332721',
              border: viewport === 'mobile' ? '10px solid #241d19' : viewport === 'tablet' ? '12px solid #241d19' : 'none',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Simulated Mobile/Tablet Device Notch / Bar */}
            {viewport !== 'desktop' && (
              <div style={{
                height: 32,
                background: '#161210',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 18px',
                color: '#9c8e84',
                fontSize: '0.72rem',
                borderBottom: '1px solid #2d2622',
                flexShrink: 0,
                userSelect: 'none',
              }}>
                <span style={{ fontWeight: 600 }}>9:41</span>
                {/* Speaker pill notch */}
                <div style={{ width: 44, height: 4, borderRadius: 2, background: '#3d2f28' }} />
                <span>5G 100%</span>
              </div>
            )}

            {/* Scrollable Live Rendered Webpage Container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
              }}
            >
              <WebsiteRenderer
                page={activePage}
                allPages={template.pages}
                activePageId={activePageId}
                onNavigatePage={(slug) => {
                  const target = template.pages.find(p => p.slug === slug);
                  if (target) setActivePageId(target.id);
                }}
                theme={template.theme}
                navigation={template.navigation}
                footer={template.footer}
                projectName={template.name}
                isInteractive={true}
                viewport={viewport}
              />
            </div>

            {/* Simulated Mobile Bottom Home Indicator Bar */}
            {viewport === 'mobile' && (
              <div style={{
                height: 18,
                background: template.theme.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{ width: 100, height: 4, borderRadius: 2, background: 'rgba(120, 100, 90, 0.4)' }} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
