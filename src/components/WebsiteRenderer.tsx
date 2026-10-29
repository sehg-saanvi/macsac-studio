import React, { useState, useRef } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Star,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Server,
  Layout,
  TrendingUp,
  Zap,
  Shield,
  Briefcase,
  DollarSign,
  Coffee,
  Heart,
  Check,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  Calendar,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import { WebsitePage, WebsiteSection, WebsiteTheme, SectionItem, ViewportMode } from '../types';

interface WebsiteRendererProps {
  page: WebsitePage;
  allPages: WebsitePage[];
  activePageId: string;
  onNavigatePage: (slug: string) => void;
  theme: WebsiteTheme;
  navigation: {
    brandName: string;
    logoText: string;
    links: Array<{ id: string; label: string; pageSlug: string }>;
    ctaText: string;
    ctaUrl: string;
    logoImage?: string;
  };
  footer: {
    brandName: string;
    tagline: string;
    copyright: string;
    links: Array<{ label: string; url: string }>;
    socialLinks: Array<{ platform: string; url: string }>;
  };
  projectName: string;
  isEditorMode?: boolean;
  selectedSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
  onMoveSectionUp?: (sectionId: string) => void;
  onMoveSectionDown?: (sectionId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
  onDuplicateSection?: (sectionId: string) => void;
  onUpdateSection?: (sectionId: string, updates: Partial<WebsiteSection>) => void;
  onUpdateItem?: (sectionId: string, itemId: string, updates: Partial<SectionItem>) => void;
  onReorderSections?: (fromIndex: number, toIndex: number) => void;
  onReorderItems?: (sectionId: string, fromIndex: number, toIndex: number) => void;
  isInteractive?: boolean;
  viewport?: ViewportMode;
}

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  icon?: string;
}

export const WebsiteRenderer: React.FC<WebsiteRendererProps> = ({
  page,
  allPages,
  activePageId,
  onNavigatePage,
  theme,
  navigation,
  footer,
  projectName,
  isEditorMode = false,
  selectedSectionId,
  onSelectSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDeleteSection,
  onDuplicateSection,
  onUpdateSection,
  onUpdateItem,
  onReorderSections,
  onReorderItems,
  viewport = 'desktop',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedItemModal, setSelectedItemModal] = useState<SectionItem | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState<Record<string, boolean>>({});
  const [newsletterSubmitted, setNewsletterSubmitted] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  // Section drag-to-reorder state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Item/Element drag-to-reorder state
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [draggedItemInfo, setDraggedItemInfo] = useState<{ sectionId: string; index: number } | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  const showToast = (title: string, message?: string, icon?: string) => {
    const id = Math.random().toString();
    setToast({ id, title, message, icon });
    setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 3500);
  };

  const handleActionClick = (url?: string, defaultActionText?: string) => {
    if (!url) {
      if (defaultActionText) {
        showToast(defaultActionText, 'Action processed successfully.');
      }
      return;
    }

    const cleanUrl = url.trim();

    // Check if it's an internal page slug
    const normalized = cleanUrl.replace(/^\//, '').toLowerCase();
    const matchedPage = allPages.find(
      (p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized
    );

    if (matchedPage) {
      onNavigatePage(matchedPage.slug);
      return;
    }

    // Check if it's an anchor link
    if (cleanUrl.startsWith('#')) {
      const anchor = cleanUrl.slice(1);
      const targetEl = document.getElementById(anchor);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      // If anchor matches a page slug like #services -> navigate to services page if exists
      const pageByAnchor = allPages.find((p) => p.slug.toLowerCase() === anchor.toLowerCase());
      if (pageByAnchor) {
        onNavigatePage(pageByAnchor.slug);
        return;
      }
    }

    // Fallback interactive toast
    showToast(
      defaultActionText || 'Action Triggered',
      cleanUrl.startsWith('http') ? `Navigating to ${cleanUrl}` : `Confirmed: ${cleanUrl}`
    );
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Layout': return <Layout size={20} />;
      case 'Server': return <Server size={20} />;
      case 'TrendingUp': return <TrendingUp size={20} />;
      case 'Zap': return <Zap size={20} />;
      case 'Shield': return <Shield size={20} />;
      case 'Briefcase': return <Briefcase size={20} />;
      case 'DollarSign': return <DollarSign size={20} />;
      case 'Coffee': return <Coffee size={20} />;
      case 'Heart': return <Heart size={20} />;
      case 'Mail': return <Mail size={20} />;
      case 'Phone': return <Phone size={20} />;
      case 'MapPin': return <MapPin size={20} />;
      case 'Clock': return <Clock size={20} />;
      case 'Calendar': return <Calendar size={20} />;
      case 'Sparkles': return <Sparkles size={20} />;
      case 'ShoppingBag': return <ShoppingBag size={20} />;
      default: return <Check size={20} />;
    }
  };

  const getButtonStyles = (isPrimary: boolean): React.CSSProperties => {
    if (isPrimary) {
      const styles: React.CSSProperties = {
        background: theme.primaryColor,
        color: '#ffffff',
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      };
      if (theme.buttonStyle === 'pill') styles.borderRadius = '9999px';
      else if (theme.buttonStyle === 'sharp') styles.borderRadius = '0px';
      else if (theme.buttonStyle === 'copperGlow') {
        styles.borderRadius = theme.borderRadius;
        styles.boxShadow = `0 6px 20px ${theme.primaryColor}55`;
      } else {
        styles.borderRadius = theme.borderRadius;
      }
      return styles;
    } else {
      return {
        background: 'transparent',
        color: theme.textColor,
        border: `1px solid ${theme.borderColor}`,
        borderRadius: theme.buttonStyle === 'pill' ? '9999px' : theme.borderRadius,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      };
    }
  };

  const paddingY = (variant?: 'compact' | 'normal' | 'spacious') => {
    if (isMobile) {
      return variant === 'compact' ? '36px' : variant === 'spacious' ? '60px' : '48px';
    }
    if (isTablet) {
      return variant === 'compact' ? '44px' : variant === 'spacious' ? '76px' : '60px';
    }
    return variant === 'compact' ? '52px' : variant === 'spacious' ? '104px' : '76px';
  };

  const paddingX = isMobile ? '18px' : isTablet ? '28px' : '32px';

  return (
    <div
      className="website-canvas-root"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        fontFamily: theme.bodyFont,
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Website Header Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: theme.bgColor,
          borderBottom: `1px solid ${theme.borderColor}`,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: isMobile ? '12px 18px' : isTablet ? '12px 24px' : '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            minHeight: isTablet ? 60 : 56,
          }}
        >
          {/* Site Logo */}
          <div
            onClick={() => onNavigatePage('home')}
            style={{
              fontFamily: theme.headingFont,
              fontWeight: 800,
              fontSize: isMobile ? '1.05rem' : isTablet ? '1.15rem' : '1.3rem',
              letterSpacing: '-0.02em',
              cursor: 'pointer',
              color: theme.textColor,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {navigation.logoImage && (
              <img
                src={navigation.logoImage}
                alt={navigation.logoText || projectName}
                style={{ maxHeight: isMobile ? 26 : isTablet ? 30 : 34, maxWidth: 110, objectFit: 'contain', flexShrink: 0 }}
              />
            )}
            <span style={{ whiteSpace: 'nowrap' }}>
              {navigation.logoText || projectName}
            </span>
          </div>

          {/* Desktop & Tablet Nav Links */}
          <nav
            style={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: isTablet ? 14 : 28,
              justifyContent: 'center',
              flexWrap: 'nowrap',
            }}
          >
            {allPages.map((p) => {
              const isActive = p.id === activePageId;
              return (
                <button
                  key={p.id}
                  onClick={() => onNavigatePage(p.slug)}
                  style={{
                    fontSize: isTablet ? '0.84rem' : '0.94rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? theme.primaryColor : theme.textMuted,
                    borderBottom: isActive ? `2px solid ${theme.primaryColor}` : '2px solid transparent',
                    paddingBottom: 4,
                    paddingLeft: 2,
                    paddingRight: 2,
                    transition: 'all 0.15s ease',
                    background: 'none',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action / Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {navigation.ctaText && !isMobile && (
              <button
                onClick={() => handleActionClick(navigation.ctaUrl, navigation.ctaText)}
                style={{
                  ...getButtonStyles(true),
                  padding: isTablet ? '8px 16px' : '10px 22px',
                  fontSize: isTablet ? '0.82rem' : '0.9rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {navigation.ctaText}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: isMobile ? 'flex' : 'none',
                color: theme.textColor,
                padding: '8px 10px',
                background: theme.cardBg,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: theme.borderRadius,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && isMobile && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: theme.cardBg,
              borderBottom: `1px solid ${theme.borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            }}
          >
            {allPages.map((p) => {
              const isActive = p.id === activePageId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onNavigatePage(p.slug);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.96rem',
                    fontWeight: isActive ? 700 : 500,
                    padding: '12px 14px',
                    borderRadius: theme.borderRadius,
                    backgroundColor: isActive ? `${theme.primaryColor}18` : 'transparent',
                    color: isActive ? theme.primaryColor : theme.textColor,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{p.name}</span>
                  {isActive ? (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.primaryColor,
                      }}
                    />
                  ) : (
                    <ChevronRight size={16} color={theme.textMuted} />
                  )}
                </button>
              );
            })}

            {navigation.ctaText && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleActionClick(navigation.ctaUrl, navigation.ctaText);
                }}
                style={{
                  ...getButtonStyles(true),
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.94rem',
                  marginTop: 10,
                }}
              >
                {navigation.ctaText}
              </button>
            )}
          </div>
        )}
      </header>

      {/* 2. Main Page Content */}
      <main style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        {page.sections.map((section, index) => {
          const isSelected = isEditorMode && selectedSectionId === section.id;
          const isHovered = isEditorMode && hoveredSectionId === section.id;
          const isDragTarget = isEditorMode && dragOverIndex === index;
          const sectionPadY = paddingY(section.paddingY);

          return (
            <div
              key={section.id}
              id={section.id}
              draggable={isEditorMode}
              onDragStart={(e) => {
                if (!isEditorMode) return;
                dragIndexRef.current = index;
                e.dataTransfer.effectAllowed = 'move';
                // make drag ghost semi-transparent
                const ghost = e.currentTarget.cloneNode(true) as HTMLElement;
                ghost.style.opacity = '0.4';
                ghost.style.position = 'fixed';
                ghost.style.top = '-9999px';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 60, 20);
                setTimeout(() => document.body.removeChild(ghost), 0);
              }}
              onDragOver={(e) => {
                if (!isEditorMode) return;
                if (dragIndexRef.current === null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                setDragOverIndex(index);
              }}
              onDragLeave={() => {
                if (dragIndexRef.current !== null) {
                  setDragOverIndex(null);
                }
              }}
              onDrop={(e) => {
                if (dragIndexRef.current === null) return;
                e.preventDefault();
                if (dragIndexRef.current !== index) {
                  if (onReorderSections) {
                    onReorderSections(dragIndexRef.current, index);
                  } else if (onMoveSectionUp && onMoveSectionDown) {
                    // Fallback: step-by-step via up/down
                    const from = dragIndexRef.current;
                    const to = index;
                    if (from > to) {
                      for (let i = from; i > to; i--) onMoveSectionUp(section.id);
                    } else {
                      for (let i = from; i < to; i++) onMoveSectionDown(section.id);
                    }
                  }
                }
                dragIndexRef.current = null;
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                dragIndexRef.current = null;
                setDragOverIndex(null);
              }}
              onMouseEnter={() => isEditorMode && setHoveredSectionId(section.id)}
              onMouseLeave={() => setHoveredSectionId(null)}
              onClick={() => isEditorMode && onSelectSection && onSelectSection(section.id)}
              style={{
                position: 'relative',
                outline: isSelected
                  ? `2px solid ${theme.primaryColor}`
                  : isDragTarget
                  ? `2px dashed ${theme.primaryColor}88`
                  : isHovered
                  ? `1px solid ${theme.primaryColor}55`
                  : 'none',
                outlineOffset: isSelected ? -2 : 0,
                cursor: isEditorMode ? 'pointer' : 'default',
                width: '100%',
                boxSizing: 'border-box',
                opacity: dragIndexRef.current === index ? 0.5 : 1,
                transition: 'outline 0.12s ease',
              }}
            >
              {/* Hover Drag Handle (left side, always visible on hover in editor) */}
              {isEditorMode && (isHovered || isSelected) && (
                <div
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    dragIndexRef.current = index;
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  title="Drag and drop to reorder this section"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 35,
                    width: 26,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'grab',
                    background: theme.primaryColor || '#b1704e',
                    borderRadius: '0 8px 8px 0',
                    boxShadow: '2px 0 12px rgba(0,0,0,0.22)',
                    userSelect: 'none',
                    transition: 'transform 0.15s ease, background 0.15s ease',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical size={16} color="#ffffff" />
                </div>
              )}

              {/* Section type label on hover */}
              {isEditorMode && isHovered && !isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 32,
                    zIndex: 30,
                    background: 'rgba(45,38,34,0.85)',
                    color: '#f5ece5',
                    borderRadius: 5,
                    padding: '3px 10px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <GripVertical size={12} color="#b1704e" />
                  <span>{section.type}</span>
                </div>
              )}

              {/* Floating Editor Controls (selected state) */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 14,
                    zIndex: 30,
                    background: '#2d2622',
                    color: 'white',
                    borderRadius: 8,
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.stopPropagation();
                      dragIndexRef.current = index;
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    title="Drag to reorder section"
                    style={{
                      cursor: 'grab',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginRight: 4,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.12)',
                    }}
                  >
                    <GripVertical size={13} color="#ffffff" />
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {section.type}
                    </span>
                  </div>
                  {index > 0 && onMoveSectionUp && (
                    <button
                      onClick={() => onMoveSectionUp(section.id)}
                      title="Move section up"
                      style={{ color: 'white', padding: 3, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <ChevronUp size={14} />
                    </button>
                  )}
                  {index < page.sections.length - 1 && onMoveSectionDown && (
                    <button
                      onClick={() => onMoveSectionDown(section.id)}
                      title="Move section down"
                      style={{ color: 'white', padding: 3, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <ChevronDown size={14} />
                    </button>
                  )}
                  {onDuplicateSection && (
                    <button
                      onClick={() => onDuplicateSection(section.id)}
                      title="Duplicate section"
                      style={{ color: 'white', padding: 3, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Copy size={13} />
                    </button>
                  )}
                  {page.sections.length > 1 && onDeleteSection && (
                    <button
                      onClick={() => onDeleteSection(section.id)}
                      title="Delete section"
                      style={{ color: '#f87171', padding: 3, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              )}

              {/* Drop indicator line */}
              {isDragTarget && dragIndexRef.current !== index && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: theme.primaryColor,
                    zIndex: 40,
                    borderRadius: 2,
                    boxShadow: `0 0 8px ${theme.primaryColor}88`,
                  }}
                />
              )}

              {/* RENDER SECTION ACCORDING TO TYPE */}
              {renderSectionContent({
                section,
                theme,
                getButtonStyles,
                renderIcon,
                viewport,
                isMobile,
                isTablet,
                paddingY: sectionPadY,
                paddingX,
                handleActionClick,
                activeFilter: activeFilters[section.id] || 'All',
                onSelectFilter: (tag) =>
                  setActiveFilters((prev) => ({ ...prev, [section.id]: tag })),
                expandedFaqId,
                onToggleFaq: (id) =>
                  setExpandedFaqId((prev) => (prev === id ? null : id)),
                onSelectItem: (item) => setSelectedItemModal(item),
                isContactSubmitted: contactSubmitted[section.id] || false,
                onSubmitContact: () => {
                  setContactSubmitted((prev) => ({ ...prev, [section.id]: true }));
                  showToast('Message Received', 'We will respond to your inquiry shortly.', 'CheckCircle2');
                },
                onResetContact: () =>
                  setContactSubmitted((prev) => ({ ...prev, [section.id]: false })),
                isNewsletterSubmitted: newsletterSubmitted[section.id] || false,
                onSubmitNewsletter: () => {
                  setNewsletterSubmitted((prev) => ({ ...prev, [section.id]: true }));
                  showToast('Subscribed!', 'Welcome to our exclusive newsletter.', 'Sparkles');
                },
                isEditorMode,
                onUpdateSection,
                onUpdateItem,
                onSelectSection,
                onReorderItems,
                hoveredItemId,
                setHoveredItemId,
                draggedItemInfo,
                setDraggedItemInfo,
                dragOverItemId,
                setDragOverItemId,
              })}
            </div>
          );
        })}
      </main>

      {/* 3. Website Footer */}
      <footer
        style={{
          backgroundColor: theme.cardBg,
          borderTop: `1px solid ${theme.borderColor}`,
          padding: isMobile ? '40px 18px 24px' : isTablet ? '56px 28px 32px' : '68px 32px 36px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: isMobile ? 24 : 36,
              marginBottom: isMobile ? 32 : 48,
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: theme.headingFont,
                  fontSize: isMobile ? '1.25rem' : '1.45rem',
                  fontWeight: 800,
                  marginBottom: 8,
                  color: theme.textColor,
                }}
              >
                {footer.brandName || projectName}
              </h3>
              <p style={{ color: theme.textMuted, fontSize: isMobile ? '0.9rem' : '0.95rem', maxWidth: 380, lineHeight: 1.5 }}>
                {footer.tagline || 'Crafted with precision using MACSAC Studio.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: isMobile ? 14 : 24, flexWrap: 'wrap', alignItems: 'center' }}>
              {allPages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onNavigatePage(p.slug)}
                  style={{
                    color: theme.textMuted,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'color 0.2s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: 20,
              borderTop: `1px solid ${theme.borderColor}`,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexWrap: 'wrap',
              gap: 12,
              fontSize: '0.84rem',
              color: theme.textMuted,
            }}
          >
            <p>{footer.copyright || `© 2026 ${projectName}. All rights reserved.`}</p>
            <p>
              Designed on{' '}
              <span style={{ color: theme.primaryColor, fontWeight: 700 }}>MACSAC Studio</span>
            </p>
          </div>
        </div>
      </footer>

      {/* 4. Interactive Item Details Modal */}
      {selectedItemModal && (
        <div
          onClick={() => setSelectedItemModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme.cardBg,
              color: theme.textColor,
              borderRadius: theme.borderRadius,
              border: `1px solid ${theme.borderColor}`,
              maxWidth: 580,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedItemModal(null)}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close"
            >
              <X size={18} />
            </button>

            {selectedItemModal.image && (
              <div style={{ width: '100%', height: isMobile ? 220 : 280, overflow: 'hidden' }}>
                <img
                  src={selectedItemModal.image}
                  alt={selectedItemModal.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ padding: isMobile ? 20 : 28 }}>
              {selectedItemModal.tag && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: theme.primaryColor,
                    backgroundColor: `${theme.primaryColor}1a`,
                    padding: '3px 10px',
                    borderRadius: 9999,
                    marginBottom: 10,
                  }}
                >
                  {selectedItemModal.tag}
                </span>
              )}

              <h3
                style={{
                  fontFamily: theme.headingFont,
                  fontSize: isMobile ? '1.4rem' : '1.75rem',
                  fontWeight: 800,
                  marginBottom: 6,
                }}
              >
                {selectedItemModal.title}
              </h3>

              {selectedItemModal.price && (
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: theme.primaryColor, marginBottom: 12 }}>
                  {selectedItemModal.price}
                  {selectedItemModal.period && (
                    <span style={{ fontSize: '0.85rem', color: theme.textMuted }}>/{selectedItemModal.period}</span>
                  )}
                </div>
              )}

              {selectedItemModal.subtitle && (
                <p style={{ color: theme.textMuted, fontSize: '0.94rem', fontWeight: 600, marginBottom: 12 }}>
                  {selectedItemModal.subtitle}
                </p>
              )}

              {selectedItemModal.description && (
                <p style={{ color: theme.textColor, opacity: 0.9, lineHeight: 1.6, fontSize: '0.92rem', marginBottom: 24 }}>
                  {selectedItemModal.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const itemName = selectedItemModal.title;
                    setSelectedItemModal(null);
                    showToast(
                      `Selected: ${itemName}`,
                      selectedItemModal.price ? `Added to demo bag • ${selectedItemModal.price}` : 'Inquiry registered'
                    );
                  }}
                  style={{
                    ...getButtonStyles(true),
                    flex: 1,
                    padding: '12px 20px',
                    fontSize: '0.92rem',
                  }}
                >
                  {selectedItemModal.price ? (
                    <>
                      <ShoppingBag size={16} /> Add to Cart
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Inquire Now
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedItemModal(null)}
                  style={{
                    ...getButtonStyles(false),
                    padding: '12px 20px',
                    fontSize: '0.92rem',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Interactive Feedback Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 110,
            background: '#181513',
            color: '#f7f4ef',
            border: `1px solid ${theme.primaryColor}88`,
            borderRadius: 12,
            padding: '14px 20px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            maxWidth: 380,
            animation: 'fadeInUp 0.25s ease forwards',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: `${theme.primaryColor}26`,
              color: theme.primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{toast.title}</div>
            {toast.message && <div style={{ fontSize: '0.8rem', color: '#a6988f', marginTop: 2 }}>{toast.message}</div>}
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#a6988f', cursor: 'pointer', padding: 2 }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// Section renderer supporting all section types
interface SectionRendererParams {
  section: WebsiteSection;
  theme: WebsiteTheme;
  getButtonStyles: (isPrimary: boolean) => React.CSSProperties;
  renderIcon: (name?: string) => React.ReactNode;
  viewport: ViewportMode;
  isMobile: boolean;
  isTablet: boolean;
  paddingY: string;
  paddingX: string;
  handleActionClick: (url?: string, defaultText?: string) => void;
  activeFilter: string;
  onSelectFilter: (tag: string) => void;
  expandedFaqId: string | null;
  onToggleFaq: (id: string) => void;
  onSelectItem: (item: SectionItem) => void;
  isContactSubmitted: boolean;
  onSubmitContact: () => void;
  onResetContact: () => void;
  isNewsletterSubmitted: boolean;
  onSubmitNewsletter: () => void;
  isEditorMode?: boolean;
  onUpdateSection?: (sectionId: string, updates: Partial<WebsiteSection>) => void;
  onUpdateItem?: (sectionId: string, itemId: string, updates: Partial<SectionItem>) => void;
  onSelectSection?: (sectionId: string) => void;
  onReorderItems?: (sectionId: string, fromIndex: number, toIndex: number) => void;
  hoveredItemId?: string | null;
  setHoveredItemId?: (id: string | null) => void;
  draggedItemInfo?: { sectionId: string; index: number } | null;
  setDraggedItemInfo?: (info: { sectionId: string; index: number } | null) => void;
  dragOverItemId?: string | null;
  setDragOverItemId?: (id: string | null) => void;
}

function renderSectionContent(p: SectionRendererParams) {
  const {
    section,
    theme,
    getButtonStyles,
    renderIcon,
    isMobile,
    isTablet,
    paddingY,
    paddingX,
    handleActionClick,
    activeFilter,
    onSelectFilter,
    expandedFaqId,
    onToggleFaq,
    onSelectItem,
    isContactSubmitted,
    onSubmitContact,
    onResetContact,
    isNewsletterSubmitted,
    onSubmitNewsletter,
    isEditorMode = false,
    onUpdateSection,
    onUpdateItem,
    onSelectSection,
    onReorderItems,
    hoveredItemId,
    setHoveredItemId,
    draggedItemInfo,
    setDraggedItemInfo,
    dragOverItemId,
    setDragOverItemId,
  } = p;

  // Helper for rendering an element with hover dragger handle and drag-to-reorder support
  const getItemDragProps = (it: SectionItem, itemIdx: number) => {
    if (!isEditorMode) {
      return {
        onClick: () => onSelectItem(it),
        isItemHovered: false,
        isItemDragTarget: false,
        isCurrentlyDragged: false,
      };
    }
    const isItemHovered = hoveredItemId === it.id;
    const isItemDragTarget = dragOverItemId === it.id;
    const isCurrentlyDragged =
      draggedItemInfo?.sectionId === section.id && draggedItemInfo?.index === itemIdx;

    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        e.stopPropagation();
        if (setDraggedItemInfo) {
          setDraggedItemInfo({ sectionId: section.id, index: itemIdx });
        }
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', it.id);
        } catch {
          // fallback
        }
      },
      onDragOver: (e: React.DragEvent) => {
        if (draggedItemInfo && draggedItemInfo.sectionId === section.id) {
          e.preventDefault();
          // Do not call e.stopPropagation() so global window/main listener catches dragover for smooth canvas auto-scrolling!
          e.dataTransfer.dropEffect = 'move';
          if (setDragOverItemId && dragOverItemId !== it.id) {
            setDragOverItemId(it.id);
          }
        }
      },
      onDragLeave: () => {
        if (dragOverItemId === it.id && setDragOverItemId) {
          setDragOverItemId(null);
        }
      },
      onDrop: (e: React.DragEvent) => {
        if (draggedItemInfo && draggedItemInfo.sectionId === section.id) {
          e.preventDefault();
          e.stopPropagation();
          if (onReorderItems && draggedItemInfo.index !== itemIdx) {
            onReorderItems(section.id, draggedItemInfo.index, itemIdx);
          }
          if (setDraggedItemInfo) setDraggedItemInfo(null);
          if (setDragOverItemId) setDragOverItemId(null);
        }
      },
      onDragEnd: () => {
        if (setDraggedItemInfo) setDraggedItemInfo(null);
        if (setDragOverItemId) setDragOverItemId(null);
      },
      onMouseEnter: () => setHoveredItemId && setHoveredItemId(it.id),
      onMouseLeave: () => setHoveredItemId && setHoveredItemId(null),
      onClick: () => {
        if (onSelectSection) onSelectSection(section.id);
      },
      isItemHovered,
      isItemDragTarget,
      isCurrentlyDragged,
    };
  };

  const renderItemDraggerBadge = (it: SectionItem) => {
    if (!isEditorMode || hoveredItemId !== it.id) return null;
    return (
      <div
        title="Drag element to reorder"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 15,
          background: 'rgba(45,38,34,0.92)',
          color: '#ffffff',
          borderRadius: 6,
          padding: '3px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: '0.66rem',
          fontWeight: 700,
          cursor: 'grab',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          userSelect: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={13} color="#b1704e" />
        <span>DRAG</span>
      </div>
    );
  };

  // Helper for inline editable text in editor mode
  const et = (
    Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span',
    field: 'title' | 'subtitle' | 'description' | 'badge',
    val?: string,
    style?: React.CSSProperties
  ) => {
    if (!val) return null;
    if (!isEditorMode || !onUpdateSection) {
      return <Tag style={style}>{val}</Tag>;
    }
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onBlur={(e) => {
          const t = e.currentTarget.innerText.trim();
          if (t && t !== val) {
            onUpdateSection(section.id, { [field]: t });
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectSection) onSelectSection(section.id);
        }}
        style={{
          ...style,
          cursor: 'text',
          outline: '1px dashed rgba(177,112,78,0.4)',
          outlineOffset: '2px',
          borderRadius: 2,
        }}
        title="Click to edit text directly"
      >
        {val}
      </Tag>
    );
  };

  // Helper for inline editable item text in editor mode
  const eit = (
    itemId: string,
    field: 'title' | 'description' | 'subtitle' | 'price' | 'tag',
    val?: string,
    Tag: 'h3' | 'h4' | 'p' | 'span' | 'div' = 'p',
    style?: React.CSSProperties
  ) => {
    if (!val) return null;
    if (!isEditorMode || !onUpdateItem) {
      return <Tag style={style}>{val}</Tag>;
    }
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onBlur={(e) => {
          const t = e.currentTarget.innerText.trim();
          if (t && t !== val) {
            onUpdateItem(section.id, itemId, { [field]: t });
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectSection) onSelectSection(section.id);
        }}
        style={{
          ...style,
          cursor: 'text',
          outline: '1px dashed rgba(177,112,78,0.4)',
          outlineOffset: '2px',
          borderRadius: 2,
        }}
        title="Click to edit item directly"
      >
        {val}
      </Tag>
    );
  };

  // Helper for inline editable image in editor mode
  const eimg = (
    src: string,
    alt: string,
    imgStyle?: React.CSSProperties,
    onCustomReplace?: (newUrl: string) => void
  ) => {
    if (!isEditorMode || (!onUpdateSection && !onCustomReplace)) {
      return <img src={src} alt={alt} style={imgStyle} />;
    }
    return (
      <div
        style={{ position: 'relative', width: imgStyle?.width || '100%', cursor: 'pointer', display: 'inline-block' }}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectSection) onSelectSection(section.id);
          const newUrl = window.prompt('Enter new image URL:', src);
          if (newUrl && newUrl.trim()) {
            if (onCustomReplace) {
              onCustomReplace(newUrl.trim());
            } else if (onUpdateSection) {
              onUpdateSection(section.id, { image: newUrl.trim() });
            }
          }
        }}
        title="Click to replace image"
      >
        <img src={src} alt={alt} style={imgStyle} />
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: 'rgba(26,22,20,0.88)',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          📷 Replace Image
        </div>
      </div>
    );
  };

  // Helper for action buttons in editor mode
  const ebtn = (
    btn?: { text: string; url: string; show: boolean },
    isPrimary: boolean = true,
    btnField: 'primaryBtn' | 'secondaryBtn' = 'primaryBtn',
    customStyle?: React.CSSProperties
  ) => {
    if (!btn?.show) return null;
    const baseStyle = { ...getButtonStyles(isPrimary), ...customStyle };
    if (!isEditorMode) {
      return (
        <button onClick={() => handleActionClick(btn.url, btn.text)} style={baseStyle}>
          <span>{btn.text}</span>
          {isPrimary && <ArrowRight size={16} />}
        </button>
      );
    }
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectSection) onSelectSection(section.id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          const newText = window.prompt('Enter button text:', btn.text);
          if (newText && newText.trim() && onUpdateSection) {
            onUpdateSection(section.id, { [btnField]: { ...btn, text: newText.trim() } });
          }
        }}
        style={{
          ...baseStyle,
          outline: '1px dashed rgba(255,255,255,0.6)',
          cursor: 'pointer',
        }}
        title="Double-click to change button text, or edit in Right Sidebar"
      >
        <span>{btn.text}</span>
        {isPrimary && <ArrowRight size={16} />}
      </button>
    );
  };

  const textAlign = isMobile
    ? 'center'
    : section.textAlign || (section.layoutVariant === 'centered' ? 'center' : 'left');

  switch (section.type) {
    /* -------------------------------- HERO -------------------------------- */
    case 'hero':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            textAlign,
            backgroundColor: section.bgVariant === 'card' ? theme.cardBg : 'transparent',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: section.layoutVariant === 'centered' || isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns:
                isMobile || section.layoutVariant === 'centered'
                  ? undefined
                  : isTablet
                  ? 'repeat(auto-fit, minmax(280px, 1fr))'
                  : 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: isMobile ? 24 : isTablet ? 36 : 48,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                maxWidth: section.layoutVariant === 'centered' ? 820 : 'none',
                margin: section.layoutVariant === 'centered' || isMobile ? '0 auto' : '0',
                textAlign: isMobile ? 'center' : undefined,
              }}
            >
              {section.badge &&
                et('span', 'badge', section.badge, {
                  display: 'inline-block',
                  fontSize: isMobile ? '0.72rem' : '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: isMobile ? '5px 12px' : '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: `${theme.primaryColor}1a`,
                  color: theme.primaryColor,
                  marginBottom: isMobile ? 12 : 18,
                  border: `1px solid ${theme.primaryColor}33`,
                })}

              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(1.9rem, 7vw, 2.45rem)'
                  : isTablet
                  ? 'clamp(2.3rem, 4.5vw, 3rem)'
                  : 'clamp(2.7rem, 5.5vw, 4.1rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                marginBottom: isMobile ? 14 : 20,
                letterSpacing: '-0.025em',
                wordBreak: 'break-word',
                color: theme.textColor,
              })}

              {section.description &&
                et('p', 'description', section.description, {
                  fontSize: isMobile ? '0.98rem' : isTablet ? '1.08rem' : '1.18rem',
                  color: theme.textMuted,
                  lineHeight: 1.6,
                  marginBottom: isMobile ? 24 : 32,
                  maxWidth: 620,
                  margin:
                    section.layoutVariant === 'centered' || isMobile ? '0 auto 24px' : '0 0 32px',
                })}

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  justifyContent:
                    section.layoutVariant === 'centered' || isMobile ? 'center' : 'flex-start',
                }}
              >
                {ebtn(section.primaryBtn, true, 'primaryBtn', {
                  padding: isMobile ? '12px 24px' : '14px 32px',
                  fontSize: isMobile ? '0.92rem' : '0.96rem',
                  width: isMobile ? '100%' : 'auto',
                })}

                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: isMobile ? '12px 22px' : '14px 28px',
                  fontSize: isMobile ? '0.92rem' : '0.96rem',
                  width: isMobile ? '100%' : 'auto',
                })}
              </div>
            </div>

            {section.image && (section.layoutVariant !== 'centered' || isMobile) && (
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                {eimg(section.image, section.imageAlt || section.title, {
                  width: '100%',
                  maxHeight: isMobile ? 280 : isTablet ? 380 : 500,
                  objectFit: 'cover',
                  borderRadius: theme.borderRadius,
                  boxShadow: '0 20px 48px rgba(0,0,0,0.14)',
                  border: `1px solid ${theme.borderColor}`,
                })}
              </div>
            )}
          </div>
        </section>
      );

    /* -------------------------------- ABOUT -------------------------------- */
    case 'about':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            backgroundColor: theme.cardBg,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns: isMobile
                ? undefined
                : isTablet
                ? 'repeat(auto-fit, minmax(280px, 1fr))'
                : 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: isMobile ? 24 : isTablet ? 36 : 48,
              boxSizing: 'border-box',
            }}
          >
            {section.image && (
              <div style={{ width: '100%', boxSizing: 'border-box' }}>
                {eimg(section.image, section.imageAlt || section.title, {
                  width: '100%',
                  maxHeight: isMobile ? 260 : isTablet ? 360 : 460,
                  objectFit: 'cover',
                  borderRadius: theme.borderRadius,
                  boxShadow: '0 16px 36px rgba(0,0,0,0.1)',
                  border: `1px solid ${theme.borderColor}`,
                })}
              </div>
            )}

            <div>
              {section.badge &&
                et('span', 'badge', section.badge, {
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                  marginBottom: 12,
                  letterSpacing: '0.06em',
                })}

              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 4vw, 2.7rem)',
                fontWeight: 800,
                marginBottom: 16,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                wordBreak: 'break-word',
                color: theme.textColor,
              })}

              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  fontSize: isMobile ? '0.96rem' : '1.05rem',
                  lineHeight: 1.65,
                  marginBottom: 24,
                })}

              {/* Stats or Key Metrics */}
              {section.items && section.items.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: isMobile ? 12 : 20,
                    marginTop: 20,
                  }}
                >
                  {section.items.map((stat) => (
                    <div
                      key={stat.id}
                      style={{
                        padding: isMobile ? '14px 12px' : '18px 16px',
                        background: theme.bgColor,
                        borderRadius: theme.borderRadius,
                        border: `1px solid ${theme.borderColor}`,
                        textAlign: isMobile ? 'center' : 'left',
                      }}
                    >
                      {eit(stat.id, 'title', stat.title, 'div', {
                        fontFamily: theme.headingFont,
                        fontSize: isMobile ? '1.45rem' : '1.85rem',
                        fontWeight: 800,
                        color: theme.primaryColor,
                        letterSpacing: '-0.02em',
                      })}
                      {eit(stat.id, 'subtitle', stat.subtitle || stat.description || '', 'div', {
                        color: theme.textMuted,
                        fontSize: '0.82rem',
                        marginTop: 4,
                        fontWeight: 500,
                      })}
                    </div>
                  ))}
                </div>
              )}

              {section.primaryBtn?.show && (
                <div style={{ marginTop: 28 }}>
                  {ebtn(section.primaryBtn, true, 'primaryBtn', {
                    padding: '12px 24px',
                    fontSize: '0.92rem',
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- SERVICES & FEATURES -------------------------------- */
    case 'services':
    case 'features':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
              style={{
                textAlign: 'center',
                maxWidth: 720,
                margin: `0 auto ${isMobile ? 28 : 48}px`,
              }}
            >
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                  letterSpacing: '0.06em',
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0 12px',
                letterSpacing: '-0.02em',
                color: theme.textColor,
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  fontSize: isMobile ? '0.94rem' : '1.04rem',
                  lineHeight: 1.6,
                })}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: isMobile ? 18 : isTablet ? 22 : 28,
              }}
            >
              {(section.items || []).map((it, itemIdx) => {
                const dragProps = getItemDragProps(it, itemIdx);
                return (
                  <div
                    key={it.id}
                    {...dragProps}
                    style={{
                      position: 'relative',
                      background: theme.cardBg,
                      border: dragProps.isItemDragTarget
                        ? `2px dashed ${theme.primaryColor}`
                        : dragProps.isItemHovered
                        ? `1px solid ${theme.primaryColor}88`
                        : `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: isMobile ? '22px 18px' : '32px 26px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: isEditorMode ? 'grab' : 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                      opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                    }}
                  >
                    {renderItemDraggerBadge(it)}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${theme.primaryColor}18`,
                        color: theme.primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        flexShrink: 0,
                      }}
                    >
                      {renderIcon(it.icon)}
                    </div>

                  {it.tag &&
                    eit(it.id, 'tag', it.tag, 'span', {
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: theme.primaryColor,
                      marginBottom: 6,
                      textTransform: 'uppercase',
                    })}

                  {eit(it.id, 'title', it.title, 'h3', {
                    fontFamily: theme.headingFont,
                    fontSize: '1.24rem',
                    fontWeight: 700,
                    marginBottom: 8,
                    color: theme.textColor,
                  })}

                  {it.description &&
                    eit(it.id, 'description', it.description, 'p', {
                      color: theme.textMuted,
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      flex: 1,
                      marginBottom: 14,
                    })}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: 10,
                    }}
                  >
                    {it.price ? (
                      <span style={{ fontWeight: 800, color: theme.primaryColor, fontSize: '1.05rem' }}>
                        {it.price}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.84rem', color: theme.primaryColor, fontWeight: 600 }}>
                        Learn More
                      </span>
                    )}
                    <ChevronRight size={16} color={theme.primaryColor} />
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- PORTFOLIO, SHOP & GALLERY -------------------------------- */
    case 'portfolio': {
      // Collect tags for live filtering
      const tags = Array.from(
        new Set(
          (section.items || [])
            .map((i) => i.tag)
            .filter((t): t is string => Boolean(t && t.trim()))
        )
      );

      const filteredItems = (section.items || []).filter((item) => {
        if (activeFilter === 'All') return true;
        return item.tag === activeFilter;
      });

      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            backgroundColor: theme.cardBg,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
              style={{
                textAlign: 'center',
                maxWidth: 720,
                margin: `0 auto ${isMobile ? 24 : 36}px`,
              }}
            >
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                  letterSpacing: '0.06em',
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0 12px',
                letterSpacing: '-0.02em',
                color: theme.textColor,
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  fontSize: isMobile ? '0.94rem' : '1.04rem',
                  lineHeight: 1.6,
                })}
            </div>

            {/* Filter Pills */}
            {tags.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: isMobile ? 24 : 36,
                }}
              >
                <button
                  onClick={() => onSelectFilter('All')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 9999,
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    border: `1px solid ${activeFilter === 'All' ? theme.primaryColor : theme.borderColor}`,
                    background: activeFilter === 'All' ? theme.primaryColor : theme.bgColor,
                    color: activeFilter === 'All' ? '#ffffff' : theme.textColor,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  All Works
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onSelectFilter(tag)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 9999,
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      border: `1px solid ${activeFilter === tag ? theme.primaryColor : theme.borderColor}`,
                      background: activeFilter === tag ? theme.primaryColor : theme.bgColor,
                      color: activeFilter === tag ? '#ffffff' : theme.textColor,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: isMobile ? 20 : 28,
              }}
            >
              {filteredItems.map((it, itemIdx) => {
                const dragProps = getItemDragProps(it, itemIdx);
                return (
                  <div
                    key={it.id}
                    {...dragProps}
                    style={{
                      position: 'relative',
                      background: theme.bgColor,
                      borderRadius: theme.borderRadius,
                      overflow: 'hidden',
                      border: dragProps.isItemDragTarget
                        ? `2px dashed ${theme.primaryColor}`
                        : dragProps.isItemHovered
                        ? `1px solid ${theme.primaryColor}88`
                        : `1px solid ${theme.borderColor}`,
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: isEditorMode ? 'grab' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                    }}
                  >
                    {renderItemDraggerBadge(it)}
                    {it.image && (
                    <div style={{ height: isMobile ? 220 : 250, overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={it.image}
                        alt={it.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {it.price &&
                        eit(it.id, 'price', it.price, 'div', {
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(0, 0, 0, 0.75)',
                          color: '#ffffff',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)',
                        })}
                    </div>
                  )}

                  <div style={{ padding: isMobile ? '18px' : '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {it.tag &&
                      eit(it.id, 'tag', it.tag, 'span', {
                        fontSize: '0.72rem',
                        color: theme.primaryColor,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: 4,
                      })}

                    {eit(it.id, 'title', it.title, 'h3', {
                      fontFamily: theme.headingFont,
                      fontSize: '1.24rem',
                      fontWeight: 700,
                      margin: '4px 0 6px',
                      color: theme.textColor,
                    })}

                    {it.subtitle &&
                      eit(it.id, 'subtitle', it.subtitle, 'p', {
                        color: theme.textMuted,
                        fontSize: '0.9rem',
                        marginBottom: 12,
                      })}

                    {it.description &&
                      eit(it.id, 'description', it.description, 'p', {
                        color: theme.textMuted,
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        marginBottom: 16,
                        flex: 1,
                      })}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: 10,
                        borderTop: `1px solid ${theme.borderColor}`,
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', color: theme.primaryColor, fontWeight: 700 }}>
                        {it.price ? 'View & Order' : 'View Details'}
                      </span>
                      <ArrowRight size={15} color={theme.primaryColor} />
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>
      );
    }

    /* -------------------------------- TESTIMONIALS -------------------------------- */
    case 'testimonials':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
              style={{
                textAlign: 'center',
                maxWidth: 700,
                margin: `0 auto ${isMobile ? 28 : 48}px`,
              }}
            >
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0',
                color: theme.textColor,
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  marginTop: 8,
                  fontSize: isMobile ? '0.94rem' : '1.04rem',
                })}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: isMobile ? 18 : 28,
              }}
            >
              {(section.items || []).map((it, itemIdx) => {
                const dragProps = getItemDragProps(it, itemIdx);
                return (
                  <div
                    key={it.id}
                    {...dragProps}
                    style={{
                      position: 'relative',
                      background: theme.cardBg,
                      border: dragProps.isItemDragTarget
                        ? `2px dashed ${theme.primaryColor}`
                        : dragProps.isItemHovered
                        ? `1px solid ${theme.primaryColor}88`
                        : `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: isMobile ? '22px 18px' : '32px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: isEditorMode ? 'grab' : 'default',
                      opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                    }}
                  >
                    {renderItemDraggerBadge(it)}
                  <div>
                    <div style={{ color: '#eab308', display: 'flex', gap: 3, marginBottom: 14 }}>
                      {[...Array(it.stars || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="#eab308" />
                      ))}
                    </div>
                    {eit(it.id, 'description', it.description || it.subtitle || '', 'p', {
                      fontStyle: 'italic',
                      color: theme.textColor,
                      lineHeight: 1.6,
                      marginBottom: 20,
                      fontSize: isMobile ? '0.94rem' : '1rem',
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {it.image &&
                      eimg(
                        it.image,
                        it.author || it.title,
                        {
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `1px solid ${theme.borderColor}`,
                        },
                        (newUrl) => onUpdateItem && onUpdateItem(section.id, it.id, { image: newUrl })
                      )}
                    <div>
                      {eit(it.id, 'author' as any, it.author || it.title, 'h4', {
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: theme.textColor,
                      })}
                      {eit(it.id, 'role' as any, it.role || it.subtitle || '', 'p', {
                        color: theme.textMuted,
                        fontSize: '0.82rem',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- TEAM -------------------------------- */
    case 'team':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            backgroundColor: theme.cardBg,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
              style={{
                textAlign: 'center',
                maxWidth: 700,
                margin: `0 auto ${isMobile ? 28 : 48}px`,
              }}
            >
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0',
                color: theme.textColor,
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  marginTop: 8,
                  fontSize: isMobile ? '0.94rem' : '1.04rem',
                })}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: isMobile ? 18 : 28,
              }}
            >
              {(section.items || []).map((it, itemIdx) => {
                const dragProps = getItemDragProps(it, itemIdx);
                return (
                  <div
                    key={it.id}
                    {...dragProps}
                    style={{
                      position: 'relative',
                      background: theme.bgColor,
                      borderRadius: theme.borderRadius,
                      border: dragProps.isItemDragTarget
                        ? `2px dashed ${theme.primaryColor}`
                        : dragProps.isItemHovered
                        ? `1px solid ${theme.primaryColor}88`
                        : `1px solid ${theme.borderColor}`,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: isEditorMode ? 'grab' : 'pointer',
                      opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                    }}
                  >
                    {renderItemDraggerBadge(it)}
                  {it.image && (
                    <div style={{ height: isMobile ? 240 : 260, overflow: 'hidden' }}>
                      <img
                        src={it.image}
                        alt={it.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: isMobile ? '16px' : '20px' }}>
                    {eit(it.id, 'title', it.title, 'h3', {
                      fontFamily: theme.headingFont,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: theme.textColor,
                    })}
                    {eit(it.id, 'role' as any, it.role || it.subtitle || '', 'p', {
                      color: theme.primaryColor,
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      marginTop: 2,
                    })}
                    {it.description &&
                      eit(it.id, 'description', it.description, 'p', {
                        color: theme.textMuted,
                        fontSize: '0.88rem',
                        marginTop: 8,
                        lineHeight: 1.5,
                      })}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- PRICING -------------------------------- */
    case 'pricing':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            backgroundColor: theme.cardBg,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div
              style={{
                textAlign: 'center',
                maxWidth: 700,
                margin: `0 auto ${isMobile ? 28 : 48}px`,
              }}
            >
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0',
                color: theme.textColor,
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  marginTop: 8,
                  fontSize: isMobile ? '0.94rem' : '1.04rem',
                })}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: isMobile ? 18 : 28,
              }}
            >
              {(section.items || []).map((it, itemIdx) => {
                const isFeatured =
                  it.tag === 'RECOMMENDED' ||
                  it.tag === 'POPULAR' ||
                  it.tag === 'BEST VALUE' ||
                  it.tag === 'MOST POPULAR';
                const dragProps = getItemDragProps(it, itemIdx);

                return (
                  <div
                    key={it.id}
                    {...dragProps}
                    style={{
                      background: theme.bgColor,
                      border: dragProps.isItemDragTarget
                        ? `2px dashed ${theme.primaryColor}`
                        : isFeatured
                        ? `2px solid ${theme.primaryColor}`
                        : dragProps.isItemHovered
                        ? `1px solid ${theme.primaryColor}88`
                        : `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: isMobile ? '24px 20px' : '36px 28px',
                      boxShadow: isFeatured ? `0 14px 40px ${theme.primaryColor}26` : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      cursor: isEditorMode ? 'grab' : 'default',
                      opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                    }}
                  >
                    {renderItemDraggerBadge(it)}
                    {it.tag &&
                      eit(it.id, 'tag', it.tag, 'span', {
                        display: 'inline-block',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: isFeatured ? '#ffffff' : theme.primaryColor,
                        backgroundColor: isFeatured ? theme.primaryColor : `${theme.primaryColor}1a`,
                        padding: '4px 10px',
                        borderRadius: 9999,
                        alignSelf: 'flex-start',
                        marginBottom: 14,
                      })}

                    {eit(it.id, 'title', it.title, 'h3', {
                      fontFamily: theme.headingFont,
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: theme.textColor,
                    })}

                    <div style={{ margin: '16px 0 12px' }}>
                      {eit(it.id, 'price', it.price || '$0', 'span', {
                        fontFamily: theme.headingFont,
                        fontSize: isMobile ? '2.1rem' : '2.5rem',
                        fontWeight: 800,
                        color: theme.textColor,
                      })}
                      {it.period && (
                        <span style={{ color: theme.textMuted, fontSize: '0.9rem', marginLeft: 4 }}>
                          /{it.period}
                        </span>
                      )}
                    </div>

                    {it.description &&
                      eit(it.id, 'description', it.description, 'p', {
                        color: theme.textMuted,
                        fontSize: '0.9rem',
                        lineHeight: 1.55,
                        marginBottom: 24,
                        flex: 1,
                      })}

                    <button
                      onClick={() => handleActionClick(it.url || '#contact', `Selected: ${it.title} Tier`)}
                      style={{
                        ...getButtonStyles(isFeatured),
                        width: '100%',
                        padding: '13px',
                        fontWeight: 600,
                      }}
                    >
                      <span>Select {it.title}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- FAQ ACCORDION -------------------------------- */
    case 'faq':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 44 }}>
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0',
                color: theme.textColor,
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  marginTop: 8,
                  fontSize: isMobile ? '0.94rem' : '1.04rem',
                })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(section.items || []).map((faq, itemIdx) => {
                const isOpen = isEditorMode ? true : expandedFaqId === faq.id;
                const dragProps = getItemDragProps(faq, itemIdx);
                return (
                  <div
                    key={faq.id}
                    {...dragProps}
                    onClick={() => {
                      if (isEditorMode) {
                        if (onSelectSection) onSelectSection(section.id);
                      } else {
                        onToggleFaq(faq.id);
                      }
                    }}
                    style={{
                      position: 'relative',
                      background: theme.cardBg,
                      border: dragProps.isItemDragTarget
                        ? `2px dashed ${theme.primaryColor}`
                        : isOpen
                        ? `1px solid ${theme.primaryColor}`
                        : dragProps.isItemHovered
                        ? `1px solid ${theme.primaryColor}88`
                        : `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: isMobile ? '16px 18px' : '20px 24px',
                      cursor: isEditorMode ? 'grab' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                    }}
                  >
                    {renderItemDraggerBadge(faq)}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      {eit(faq.id, 'title', faq.title, 'h4', {
                        fontFamily: theme.headingFont,
                        fontSize: isMobile ? '1.02rem' : '1.14rem',
                        fontWeight: 700,
                        color: isOpen ? theme.primaryColor : theme.textColor,
                        margin: 0,
                        flex: 1,
                      })}
                      {!isEditorMode && (
                        <div
                          style={{
                            color: isOpen ? theme.primaryColor : theme.textMuted,
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            flexShrink: 0,
                          }}
                        >
                          <ChevronDown size={20} />
                        </div>
                      )}
                    </div>

                    {(isOpen || isEditorMode) && faq.description && (
                      <div
                        style={{
                          borderTop: `1px solid ${theme.borderColor}`,
                          paddingTop: 12,
                          marginTop: 14,
                        }}
                      >
                        {eit(faq.id, 'description', faq.description, 'p', {
                          color: theme.textMuted,
                          fontSize: '0.94rem',
                          lineHeight: 1.65,
                          margin: 0,
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- CONTACT & BOOKING -------------------------------- */
    case 'contact':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            backgroundColor: section.bgVariant === 'card' ? theme.cardBg : 'transparent',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              display: isMobile ? 'flex' : 'grid',
              flexDirection: isMobile ? 'column' : undefined,
              gridTemplateColumns: isMobile
                ? undefined
                : isTablet
                ? 'repeat(auto-fit, minmax(280px, 1fr))'
                : 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: isMobile ? 28 : isTablet ? 36 : 48,
              boxSizing: 'border-box',
            }}
          >
            <div>
              {section.badge &&
                et('span', 'badge', section.badge, {
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: theme.primaryColor,
                  letterSpacing: '0.06em',
                })}
              {et('h2', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 3.8vw, 2.7rem)',
                fontWeight: 800,
                margin: '8px 0 16px',
                color: theme.textColor,
                letterSpacing: '-0.02em',
              })}
              {section.description &&
                et('p', 'description', section.description, {
                  color: theme.textMuted,
                  fontSize: isMobile ? '0.96rem' : '1.05rem',
                  lineHeight: 1.65,
                  marginBottom: 28,
                })}

              {/* Contact Details List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {(section.items || []).map((it, itemIdx) => {
                  const dragProps = getItemDragProps(it, itemIdx);
                  return (
                    <div
                      key={it.id}
                      {...dragProps}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        padding: '12px 14px',
                        background: theme.cardBg,
                        borderRadius: theme.borderRadius,
                        border: dragProps.isItemDragTarget
                          ? `2px dashed ${theme.primaryColor}`
                          : dragProps.isItemHovered
                          ? `1px solid ${theme.primaryColor}88`
                          : `1px solid ${theme.borderColor}`,
                        cursor: isEditorMode ? 'grab' : 'default',
                        opacity: dragProps.isCurrentlyDragged ? 0.4 : 1,
                      }}
                    >
                      {renderItemDraggerBadge(it)}
                    <div
                      style={{
                        color: theme.primaryColor,
                        padding: 6,
                        background: `${theme.primaryColor}14`,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {renderIcon(it.icon)}
                    </div>
                    <div style={{ flex: 1 }}>
                      {eit(it.id, 'title', it.title, 'span', {
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: theme.textColor,
                        display: 'block',
                      })}
                      {eit(it.id, 'subtitle', it.subtitle || it.description || '', 'span', {
                        color: theme.textMuted,
                        fontSize: '0.88rem',
                        marginTop: 2,
                        display: 'block',
                      })}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Interactive Form */}
            <div
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: theme.borderRadius,
                padding: isMobile ? '22px 18px' : '36px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
              }}
            >
              {isContactSubmitted ? (
                <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: `${theme.primaryColor}18`,
                      color: theme.primaryColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
                    Message Sent Successfully!
                  </h3>
                  <p style={{ color: theme.textMuted, fontSize: '0.94rem', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 24px' }}>
                    Thank you for reaching out. A representative will review your message and reply within 24 hours.
                  </p>
                  <button
                    onClick={onResetContact}
                    style={{
                      ...getButtonStyles(false),
                      padding: '10px 20px',
                      fontSize: '0.88rem',
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitContact();
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Vance"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        borderRadius: theme.borderRadius,
                        border: `1px solid ${theme.borderColor}`,
                        background: theme.bgColor,
                        color: theme.textColor,
                        fontSize: '0.94rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. contact@domain.com"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        borderRadius: theme.borderRadius,
                        border: `1px solid ${theme.borderColor}`,
                        background: theme.bgColor,
                        color: theme.textColor,
                        fontSize: '0.94rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                      Subject / Service Needed
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Project Inquiry or Booking Request"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        borderRadius: theme.borderRadius,
                        border: `1px solid ${theme.borderColor}`,
                        background: theme.bgColor,
                        color: theme.textColor,
                        fontSize: '0.94rem',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
                      Message or Inquiry *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your inquiry, project scope, or requested dates..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        borderRadius: theme.borderRadius,
                        border: `1px solid ${theme.borderColor}`,
                        background: theme.bgColor,
                        color: theme.textColor,
                        fontSize: '0.94rem',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      ...getButtonStyles(true),
                      width: '100%',
                      padding: '13px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>Send Inquiry</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- NEWSLETTER -------------------------------- */
    case 'newsletter':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            backgroundColor: `${theme.primaryColor}12`,
            borderTop: `1px solid ${theme.borderColor}`,
            borderBottom: `1px solid ${theme.borderColor}`,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            {section.badge &&
              et('span', 'badge', section.badge, {
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: theme.primaryColor,
              })}
            {et('h2', 'title', section.title, {
              fontFamily: theme.headingFont,
              fontSize: isMobile ? '1.8rem' : 'clamp(1.9rem, 4vw, 2.7rem)',
              fontWeight: 800,
              margin: '10px 0 14px',
              color: theme.textColor,
            })}
            {section.description &&
              et('p', 'description', section.description, {
                color: theme.textMuted,
                fontSize: isMobile ? '0.96rem' : '1.05rem',
                lineHeight: 1.6,
                marginBottom: 24,
              })}

            {isNewsletterSubmitted ? (
              <div
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.primaryColor}`,
                  borderRadius: theme.borderRadius,
                  padding: '18px 24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  color: theme.textColor,
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 color={theme.primaryColor} size={22} />
                <span>You are subscribed! Check your inbox for upcoming editions.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitNewsletter();
                }}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 10,
                  maxWidth: 520,
                  margin: '0 auto',
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  style={{
                    flex: 1,
                    padding: '13px 16px',
                    borderRadius: theme.buttonStyle === 'pill' ? 9999 : theme.borderRadius,
                    border: `1px solid ${theme.borderColor}`,
                    background: theme.cardBg,
                    color: theme.textColor,
                    fontSize: '0.94rem',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    ...getButtonStyles(true),
                    padding: '13px 28px',
                    fontSize: '0.94rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      );

    /* -------------------------------- CTA -------------------------------- */
    case 'cta':
      return (
        <section
          style={{
            padding: `${paddingY} ${paddingX}`,
            textAlign: 'center',
            backgroundColor: `${theme.primaryColor}16`,
            borderTop: `1px solid ${theme.borderColor}`,
            borderBottom: `1px solid ${theme.borderColor}`,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {section.badge &&
              et('span', 'badge', section.badge, {
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: theme.primaryColor,
                letterSpacing: '0.06em',
              })}
            {et('h2', 'title', section.title, {
              fontFamily: theme.headingFont,
              fontSize: isMobile ? '1.85rem' : 'clamp(2.1rem, 4.2vw, 3.2rem)',
              fontWeight: 800,
              margin: '12px 0 16px',
              color: theme.textColor,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
            })}
            {section.description &&
              et('p', 'description', section.description, {
                color: theme.textMuted,
                fontSize: isMobile ? '0.98rem' : '1.14rem',
                lineHeight: 1.6,
                marginBottom: 28,
                maxWidth: 620,
                margin: '0 auto 28px',
              })}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              {ebtn(section.primaryBtn, true, 'primaryBtn', {
                padding: isMobile ? '13px 26px' : '15px 36px',
                fontSize: '0.96rem',
                width: isMobile ? '100%' : 'auto',
              })}
              {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                padding: isMobile ? '13px 24px' : '15px 32px',
                fontSize: '0.96rem',
                width: isMobile ? '100%' : 'auto',
              })}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- DEFAULT -------------------------------- */
    default:
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontFamily: theme.headingFont, fontSize: '1.8rem', fontWeight: 800, color: theme.textColor }}>
              {section.title}
            </h2>
            {section.description && (
              <p style={{ color: theme.textMuted, marginTop: 8 }}>{section.description}</p>
            )}
          </div>
        </section>
      );
  }
}
