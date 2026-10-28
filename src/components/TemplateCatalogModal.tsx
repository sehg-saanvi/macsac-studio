import React, { useEffect, useRef, useCallback } from 'react';
import { X, Layers, RotateCcw } from 'lucide-react';
import {
  FilterState,
  WebsiteTemplate,
  UserWebsiteDetails,
} from '../types';
import { TemplateGallery } from './TemplateGallery';

interface TemplateCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: WebsiteTemplate[];
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onPreview: (template: WebsiteTemplate) => void;
  onCustomize: (template: WebsiteTemplate) => void;
  websiteDetails?: UserWebsiteDetails | null;
  onEditDetails?: () => void;
  /** Scroll position to restore when modal opens (after closing preview) */
  savedScrollY?: number;
  onSaveScroll?: (y: number) => void;
}

export const TemplateCatalogModal: React.FC<TemplateCatalogModalProps> = ({
  isOpen,
  onClose,
  templates,
  filters,
  onFilterChange,
  onResetFilters,
  onPreview,
  onCustomize,
  websiteDetails,
  onEditDetails,
  savedScrollY = 0,
  onSaveScroll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasRestoredScroll = useRef(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Restore scroll position when modal reopens after preview
  useEffect(() => {
    if (isOpen && savedScrollY > 0 && !hasRestoredScroll.current) {
      hasRestoredScroll.current = true;
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedScrollY;
        }
      });
    }
    if (!isOpen) {
      hasRestoredScroll.current = false;
    }
  }, [isOpen, savedScrollY]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Save scroll before preview opens
  const handlePreview = useCallback(
    (template: WebsiteTemplate) => {
      if (onSaveScroll && scrollContainerRef.current) {
        onSaveScroll(scrollContainerRef.current.scrollTop);
      }
      onPreview(template);
    },
    [onPreview, onSaveScroll]
  );

  if (!isOpen) return null;

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.aesthetic !== 'all' ||
    filters.audience !== 'all' ||
    filters.themeMode !== 'all' ||
    filters.pageType !== 'all' ||
    Boolean(filters.searchQuery.trim());

  return (
    /* Full-screen overlay */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(8, 6, 5, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        animation: 'catalogOverlayIn 0.22s ease',
      }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1440px',
          height: '100%',
          maxHeight: 'calc(100vh - 40px)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(177,112,78,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'catalogPanelIn 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Sticky header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 28px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            flexShrink: 0,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Left: title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--copper-glow)',
                border: '1px solid rgba(177,112,78,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--copper-medium)',
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                Template Catalog
              </h2>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                {templates.length} distinct designs — browse, preview &amp; customize
              </p>
            </div>
          </div>

          {/* Right: reset + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            )}
            <button
              onClick={onClose}
              title="Close catalog (Esc)"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable catalog body */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
          }}
        >
          <TemplateGallery
            templates={templates}
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            onPreview={handlePreview}
            onCustomize={onCustomize}
            websiteDetails={websiteDetails}
            onEditDetails={onEditDetails}
          />
        </div>
      </div>

      {/* Inline keyframe animations */}
      <style>{`
        @keyframes catalogOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes catalogPanelIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
};
