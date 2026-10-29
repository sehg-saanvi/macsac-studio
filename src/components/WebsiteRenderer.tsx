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

  const getContrastTextColor = (hexColor: string): string => {
    if (!hexColor) return '#ffffff';
    let hex = hexColor.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum > 0.55 ? '#0a0a0c' : '#ffffff';
    }
    return '#ffffff';
  };

  const getButtonStyles = (isPrimary: boolean): React.CSSProperties => {
    if (isPrimary) {
      const textColor = getContrastTextColor(theme.primaryColor);
      const styles: React.CSSProperties = {
        background: theme.primaryColor,
        color: textColor,
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
            padding: isMobile ? '10px 16px' : isTablet ? '10px 18px' : '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            minHeight: isTablet ? 54 : 56,
            gap: isTablet ? 12 : 24,
          }}
        >
          {/* Site Logo */}
          <div
            onClick={() => onNavigatePage('home')}
            style={{
              fontFamily: theme.headingFont,
              fontWeight: 800,
              fontSize: isMobile ? '1.02rem' : isTablet ? '1.08rem' : '1.3rem',
              letterSpacing: '-0.02em',
              cursor: 'pointer',
              color: theme.textColor,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              maxWidth: isTablet ? 180 : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {navigation.logoImage && (
              <img
                src={navigation.logoImage}
                alt={navigation.logoText || projectName}
                style={{ maxHeight: isMobile ? 24 : isTablet ? 26 : 34, maxWidth: 100, objectFit: 'contain', flexShrink: 0 }}
              />
            )}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {navigation.logoText || projectName}
            </span>
          </div>

          {/* Desktop Nav Links (full) & Tablet Nav Links (sleek compact pills) */}
          <nav
            style={{
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: isTablet ? 6 : 28,
              justifyContent: 'center',
              flexWrap: 'nowrap',
              flex: 1,
              maxWidth: isTablet ? 420 : 680,
              overflow: 'hidden',
            }}
          >
            {(isTablet && allPages.length > 2 ? allPages.slice(0, 2) : allPages).map((p) => {
              const isActive = p.id === activePageId;
              return (
                <button
                  key={p.id}
                  onClick={() => onNavigatePage(p.slug)}
                  style={{
                    fontSize: isTablet ? '0.78rem' : '0.94rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? theme.primaryColor : theme.textMuted,
                    backgroundColor: isTablet && isActive ? `${theme.primaryColor}14` : 'transparent',
                    borderBottom: !isTablet && isActive ? `2px solid ${theme.primaryColor}` : '2px solid transparent',
                    borderRadius: isTablet ? 6 : 0,
                    padding: isTablet ? '5px 8px' : '4px 2px',
                    transition: 'all 0.15s ease',
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

            {/* Tablet "+ More" pill button if many pages */}
            {isTablet && allPages.length > 2 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: theme.primaryColor,
                  background: `${theme.primaryColor}14`,
                  border: `1px solid ${theme.primaryColor}33`,
                  borderRadius: 6,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                +{allPages.length - 2} more
              </button>
            )}
          </nav>

          {/* Right Action & Tablet/Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 8 : 12, flexShrink: 0 }}>
            {navigation.ctaText && !isMobile && (
              <button
                onClick={() => handleActionClick(navigation.ctaUrl, navigation.ctaText)}
                style={{
                  ...getButtonStyles(true),
                  padding: isTablet ? '6px 13px' : '10px 22px',
                  fontSize: isTablet ? '0.78rem' : '0.9rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {navigation.ctaText}
              </button>
            )}

            {/* Hamburger Toggle Button for Mobile and congested Tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: isMobile || (isTablet && allPages.length > 4) ? 'flex' : 'none',
                color: theme.textColor,
                padding: isTablet ? '6px 8px' : '8px 10px',
                background: theme.cardBg,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: theme.borderRadius,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile & Tablet Drawer */}
        {mobileMenuOpen && (isMobile || isTablet) && (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: theme.cardBg,
              borderBottom: `1px solid ${theme.borderColor}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              maxHeight: '65vh',
              overflowY: 'auto',
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
                    fontSize: '0.94rem',
                    fontWeight: isActive ? 700 : 500,
                    padding: '11px 14px',
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
                  padding: '12px',
                  fontSize: '0.92rem',
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
    const computedStyle: React.CSSProperties = {
      color: theme.textColor,
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      ...style,
    };
    if (!isEditorMode || !onUpdateSection) {
      return <Tag style={computedStyle}>{val}</Tag>;
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
          ...computedStyle,
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
    const computedStyle: React.CSSProperties = {
      color: theme.textColor,
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      ...style,
    };
    if (!isEditorMode || !onUpdateItem) {
      return <Tag style={computedStyle}>{val}</Tag>;
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
          ...computedStyle,
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
    /* -------------------------------- HERO -------------------------------- */
    case 'hero': {
      /* 1. CINEMA / IMMERSIVE HERO (Photography, Fine Dining, Luxury Boutique) */
      if (section.layoutVariant === 'cinema') {
        return (
          <section
            style={{
              position: 'relative',
              padding: isMobile ? '80px 18px 70px' : isTablet ? '110px 28px 90px' : '150px 32px 130px',
              backgroundColor: '#0c0a09',
              color: '#ffffff',
              overflow: 'hidden',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Image with Dark Vignette Overlay */}
            {section.image && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  backgroundImage: `url(${section.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.38) saturate(1.15)',
                  transform: 'scale(1.02)',
                }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                background:
                  'radial-gradient(circle at center, rgba(12,10,9,0.4) 0%, rgba(12,10,9,0.85) 75%, #0c0a09 100%)',
              }}
            />

            {/* Floating Glassmorphism Center Panel */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: 880,
                margin: '0 auto',
                textAlign: 'center',
                padding: isMobile ? '28px 18px' : isTablet ? '40px 32px' : '52px 48px',
                borderRadius: '16px',
                background: 'rgba(24, 20, 18, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              {section.badge && (
                <div style={{ marginBottom: 14 }}>
                  {et('span', 'badge', section.badge, {
                    display: 'inline-block',
                    fontSize: isMobile ? '0.72rem' : '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    backgroundColor: `${theme.primaryColor}33`,
                    color: '#f5ece5',
                    border: `1px solid ${theme.primaryColor}66`,
                  })}
                </div>
              )}

              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(2rem, 8vw, 2.7rem)'
                  : isTablet
                  ? 'clamp(2.5rem, 5vw, 3.4rem)'
                  : 'clamp(3rem, 5.5vw, 4.4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 18,
                letterSpacing: '-0.025em',
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              })}

              {section.description &&
                et('p', 'description', section.description, {
                  fontSize: isMobile ? '0.98rem' : isTablet ? '1.08rem' : '1.2rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 680,
                  margin: '0 auto 28px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                })}

              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {ebtn(section.primaryBtn, true, 'primaryBtn', {
                  padding: isMobile ? '12px 24px' : '14px 34px',
                  fontSize: isMobile ? '0.92rem' : '0.98rem',
                  boxShadow: `0 8px 24px ${theme.primaryColor}66`,
                })}
                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: isMobile ? '12px 22px' : '14px 28px',
                  fontSize: isMobile ? '0.92rem' : '0.98rem',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.08)',
                })}
              </div>
            </div>
          </section>
        );
      }

      /* 2. DEVELOPER / TERMINAL HERO (Dev Tools, API & Tech Portfolio) */
      if (section.layoutVariant === 'terminal') {
        return (
          <section
            style={{
              padding: `${paddingY} ${paddingX}`,
              backgroundColor: '#0a0d12',
              color: '#e2e8f0',
              boxSizing: 'border-box',
              borderBottom: '1px solid #1e293b',
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: '0 auto',
                display: isMobile ? 'flex' : 'grid',
                flexDirection: isMobile ? 'column' : undefined,
                gridTemplateColumns: isMobile ? undefined : isTablet ? '1fr 1fr' : '1.15fr 1fr',
                alignItems: 'center',
                gap: isMobile ? 32 : isTablet ? 32 : 48,
              }}
            >
              {/* Left Column: Tech Copy */}
              <div>
                {section.badge && (
                  <div style={{ marginBottom: 14 }}>
                    {et('span', 'badge', section.badge, {
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      padding: '4px 12px',
                      borderRadius: 6,
                      display: 'inline-block',
                    })}
                  </div>
                )}

                {et('h1', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile
                    ? 'clamp(2rem, 7.5vw, 2.6rem)'
                    : isTablet
                    ? 'clamp(2.2rem, 4.2vw, 2.9rem)'
                    : 'clamp(2.6rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.14,
                  marginBottom: 18,
                  letterSpacing: '-0.025em',
                  color: '#f8fafc',
                })}

                {section.description &&
                  et('p', 'description', section.description, {
                    fontSize: isMobile ? '0.96rem' : '1.08rem',
                    color: '#94a3b8',
                    lineHeight: 1.65,
                    marginBottom: 28,
                  })}

                {/* Primary & Secondary Action */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
                  {ebtn(section.primaryBtn, true, 'primaryBtn', {
                    padding: isMobile ? '12px 24px' : '13px 30px',
                    fontSize: '0.94rem',
                    backgroundColor: theme.primaryColor,
                    borderRadius: 6,
                  })}
                  {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                    padding: isMobile ? '12px 20px' : '13px 24px',
                    fontSize: '0.94rem',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    borderRadius: 6,
                  })}
                </div>

                {/* Tech Stack Pills */}
                {section.items && section.items.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600, fontFamily: 'monospace' }}>
                      STACK:
                    </span>
                    {section.items.map((it) => (
                      <span
                        key={it.id}
                        style={{
                          fontSize: '0.74rem',
                          fontFamily: 'monospace',
                          background: '#1e293b',
                          color: '#cbd5e1',
                          padding: '3px 8px',
                          borderRadius: 4,
                          border: '1px solid #334155',
                        }}
                      >
                        {it.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Code Window Console */}
              <div
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                }}
              >
                {/* Window Chrome */}
                <div
                  style={{
                    background: '#1e293b',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #334155',
                  }}
                >
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontFamily: 'monospace',
                        color: '#38bdf8',
                        background: '#0f172a',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      index.ts
                    </span>
                    <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#64748b' }}>
                      schema.sql
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                    macsac-cli v2.4
                  </span>
                </div>

                {/* Code Body */}
                <div
                  style={{
                    padding: isMobile ? '16px 14px' : '20px 22px',
                    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                    fontSize: isMobile ? '0.76rem' : '0.86rem',
                    lineHeight: 1.7,
                    color: '#e2e8f0',
                    overflowX: 'auto',
                  }}
                >
                  <div style={{ color: '#64748b' }}>// Initialize runtime instance</div>
                  <div>
                    <span style={{ color: '#f43f5e' }}>import</span> {'{'} client, deploy {'}'}{' '}
                    <span style={{ color: '#f43f5e' }}>from</span>{' '}
                    <span style={{ color: '#38bdf8' }}>'@macsac/studio'</span>;
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: '#f43f5e' }}>const</span> app ={' '}
                    <span style={{ color: '#38bdf8' }}>client</span>({'{'}
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    target: <span style={{ color: '#22c55e' }}>'production'</span>,
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    region: <span style={{ color: '#22c55e' }}>'global-edge'</span>,
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    latency: <span style={{ color: '#eab308' }}>'8ms'</span>,
                  </div>
                  <div>{'}'});</div>
                  <div style={{ marginTop: 12, color: '#64748b' }}>// One-click automated deployment</div>
                  <div>
                    <span style={{ color: '#f43f5e' }}>await</span> app.
                    <span style={{ color: '#38bdf8' }}>optimize</span>({'{'} responsive: <span style={{ color: '#f43f5e' }}>true</span> {'}'});
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      padding: '8px 12px',
                      background: '#1e293b',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #334155',
                    }}
                  >
                    <span style={{ color: '#22c55e' }}>$ npm i @macsac/core --save</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>READY</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      /* 3. ASYMMETRIC / EDITORIAL HERO (Fashion, Creative Agency, Magazine) */
      if (section.layoutVariant === 'asymmetric') {
        return (
          <section
            style={{
              padding: `${paddingY} ${paddingX}`,
              backgroundColor: section.bgVariant === 'card' ? theme.cardBg : 'transparent',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              {/* Large Top Headline Banner */}
              <div style={{ marginBottom: isMobile ? 24 : 40, maxWidth: 960 }}>
                {section.badge && (
                  <div style={{ marginBottom: 12 }}>
                    {et('span', 'badge', section.badge, {
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: theme.primaryColor,
                      borderBottom: `2px solid ${theme.primaryColor}`,
                      paddingBottom: 4,
                      display: 'inline-block',
                    })}
                  </div>
                )}

                {et('h1', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile
                    ? 'clamp(2.2rem, 8vw, 2.9rem)'
                    : isTablet
                    ? 'clamp(2.8rem, 5.5vw, 3.8rem)'
                    : 'clamp(3.4rem, 6vw, 4.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: theme.textColor,
                  wordBreak: 'break-word',
                })}
              </div>

              {/* Staggered Two-Column Layout */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1.35fr',
                  gap: isMobile ? 28 : isTablet ? 32 : 48,
                  alignItems: 'center',
                }}
              >
                <div>
                  {section.description &&
                    et('p', 'description', section.description, {
                      fontSize: isMobile ? '1rem' : '1.14rem',
                      color: theme.textMuted,
                      lineHeight: 1.7,
                      marginBottom: 28,
                    })}

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {ebtn(section.primaryBtn, true, 'primaryBtn', {
                      padding: isMobile ? '12px 24px' : '14px 32px',
                      fontSize: '0.94rem',
                    })}
                    {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                      padding: isMobile ? '12px 20px' : '14px 28px',
                      fontSize: '0.94rem',
                    })}
                  </div>
                </div>

                {/* Asymmetric Imagery */}
                {section.image && (
                  <div style={{ position: 'relative', width: '100%', marginBottom: isMobile ? 24 : 0 }}>
                    {eimg(section.image, section.imageAlt || section.title, {
                      width: '100%',
                      height: isMobile ? 280 : isTablet ? 360 : 440,
                      objectFit: 'cover',
                      borderRadius: theme.borderRadius,
                      boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                    })}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -16,
                        left: isMobile ? 12 : -20,
                        background: theme.cardBg,
                        border: `1px solid ${theme.borderColor}`,
                        padding: '12px 18px',
                        borderRadius: theme.borderRadius,
                        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Sparkles size={18} color={theme.primaryColor} />
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: theme.textColor }}>
                        Featured Work 2026
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      }

      /* 4. BENTO HERO (AI Platform, SaaS Product, Modern App) */
      if (section.layoutVariant === 'bento') {
        return (
          <section
            style={{
              padding: `${paddingY} ${paddingX}`,
              backgroundColor: section.bgVariant === 'card' ? theme.cardBg : 'transparent',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 36px' }}>
                {section.badge && (
                  <div style={{ marginBottom: 12 }}>
                    {et('span', 'badge', section.badge, {
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '5px 14px',
                      borderRadius: 9999,
                      background: `${theme.primaryColor}16`,
                      color: theme.primaryColor,
                      border: `1px solid ${theme.primaryColor}33`,
                    })}
                  </div>
                )}

                {et('h1', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile
                    ? 'clamp(2.1rem, 7.5vw, 2.7rem)'
                    : isTablet
                    ? 'clamp(2.4rem, 4.8vw, 3.2rem)'
                    : 'clamp(2.8rem, 5vw, 4.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.12,
                  marginBottom: 16,
                  color: theme.textColor,
                })}

                {section.description &&
                  et('p', 'description', section.description, {
                    fontSize: isMobile ? '0.98rem' : '1.12rem',
                    color: theme.textMuted,
                    lineHeight: 1.6,
                    marginBottom: 24,
                  })}

                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {ebtn(section.primaryBtn, true, 'primaryBtn', {
                    padding: '13px 30px',
                    fontSize: '0.95rem',
                  })}
                  {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                    padding: '13px 26px',
                    fontSize: '0.95rem',
                  })}
                </div>
              </div>

              {/* Bento Feature Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.6fr 1fr 1fr',
                  gap: 18,
                }}
              >
                {/* Large Preview Bento Box */}
                {section.image && (
                  <div
                    style={{
                      gridColumn: isTablet ? 'span 2' : undefined,
                      background: theme.cardBg,
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: theme.primaryColor }}>
                        LIVE PREVIEW
                      </span>
                      <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>Synced with Engine</span>
                    </div>
                    {eimg(section.image, section.imageAlt || section.title, {
                      width: '100%',
                      maxHeight: isMobile ? 220 : 260,
                      objectFit: 'cover',
                      borderRadius: 8,
                    })}
                  </div>
                )}

                {/* Metric Bento Box */}
                <div
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: theme.borderRadius,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: `${theme.primaryColor}16`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.primaryColor,
                      marginBottom: 16,
                    }}
                  >
                    <Zap size={22} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: theme.textColor, letterSpacing: '-0.02em' }}>
                    99.98%
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: theme.textColor, marginTop: 4 }}>
                    Performance Reliability
                  </div>
                  <div style={{ fontSize: '0.82rem', color: theme.textMuted, marginTop: 6, lineHeight: 1.5 }}>
                    Sub-millisecond global execution powered by real-time distribution.
                  </div>
                </div>

                {/* Security / Badge Bento Box */}
                <div
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: theme.borderRadius,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: `${theme.primaryColor}16`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.primaryColor,
                      marginBottom: 16,
                    }}
                  >
                    <Shield size={22} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: theme.textColor, letterSpacing: '-0.02em' }}>
                    Enterprise
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 700, color: theme.textColor, marginTop: 4 }}>
                    End-to-End Encryption
                  </div>
                  <div style={{ fontSize: '0.82rem', color: theme.textMuted, marginTop: 6, lineHeight: 1.5 }}>
                    Zero-trust architecture with certified SOC2 & GDPR compliance.
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      /* 5. NEO-BRUTALIST HERO (Bold, high-contrast, raw typography) */
      if (section.layoutVariant === 'neo-brutalist') {
        const bruteBg = theme.mode === 'dark' ? '#0a0a0a' : '#f5f0e8';
        const bruteAccent = theme.primaryColor;
        const bruteText = theme.mode === 'dark' ? '#ffffff' : '#0a0a0a';
        const bruteMuted = theme.mode === 'dark' ? '#d4d4d8' : '#3f3f46';
        return (
          <section
            style={{
              backgroundColor: bruteBg,
              color: bruteText,
              boxSizing: 'border-box',
              overflow: 'hidden',
              position: 'relative',
              minHeight: isMobile || isTablet ? 'auto' : '85vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Thick top accent bar */}
            <div style={{ height: 8, backgroundColor: bruteAccent, width: '100%' }} />

            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
                minHeight: isMobile || isTablet ? 'auto' : 'calc(85vh - 8px)',
              }}
            >
              {/* Left: Raw Typography Block */}
              <div
                style={{
                  padding: isMobile ? '36px 18px' : isTablet ? '48px 32px' : '80px 56px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRight: isMobile || isTablet ? 'none' : `4px solid ${bruteAccent}`,
                  borderBottom: isMobile || isTablet ? `4px solid ${bruteAccent}` : 'none',
                }}
              >
                {section.badge && (
                  <div
                    style={{
                      display: 'inline-block',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: bruteAccent,
                      border: `2px solid ${bruteAccent}`,
                      padding: '4px 12px',
                      marginBottom: 20,
                      width: 'fit-content',
                    }}
                  >
                    {section.badge}
                  </div>
                )}
                {et('h1', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile
                    ? 'clamp(2.3rem, 8.5vw, 3rem)'
                    : isTablet
                    ? 'clamp(2.8rem, 5.5vw, 3.8rem)'
                    : 'clamp(3.8rem, 6.5vw, 5.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.04em',
                  color: bruteText,
                  textTransform: 'uppercase',
                  marginBottom: 24,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                })}
                {section.description &&
                  et('p', 'description', section.description, {
                    fontSize: isMobile ? '0.98rem' : '1.15rem',
                    color: bruteMuted,
                    lineHeight: 1.6,
                    marginBottom: 32,
                    maxWidth: 480,
                    fontFamily: 'monospace',
                  })}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {ebtn(section.primaryBtn, true, 'primaryBtn', {
                    padding: isMobile ? '13px 26px' : '16px 40px',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderRadius: '0px',
                    boxShadow: `4px 4px 0 ${bruteAccent}`,
                  })}
                  {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                    padding: isMobile ? '13px 22px' : '16px 32px',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderRadius: '0px',
                    border: `2px solid ${bruteText}`,
                    color: bruteText,
                    background: 'transparent',
                  })}
                </div>
              </div>

              {/* Right: Bold Image with number accent */}
              {section.image && (
                <div style={{ position: 'relative', minHeight: isMobile ? 260 : isTablet ? 360 : 'auto', overflow: 'hidden' }}>
                  {eimg(section.image, section.imageAlt || section.title, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  })}
                  {/* Bold "01" accent overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      fontSize: 'clamp(5rem, 12vw, 10rem)',
                      fontWeight: 900,
                      fontFamily: theme.headingFont,
                      color: 'rgba(255,255,255,0.12)',
                      lineHeight: 1,
                      userSelect: 'none',
                      pointerEvents: 'none',
                      padding: '0 20px 0',
                    }}
                  >
                    01
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 8,
                      backgroundColor: bruteAccent,
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        );
      }

      /* 6. PORTRAIT HERO (Luxury fashion, photography — full-height portrait image left) */
      if (section.layoutVariant === 'portrait') {
        return (
          <section
            style={{
              boxSizing: 'border-box',
              overflow: 'hidden',
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1.2fr' : '1fr 1.4fr',
              minHeight: isMobile ? 'auto' : '92vh',
            }}
          >
            {/* Left: Tall Portrait Image */}
            <div
              style={{
                position: 'relative',
                minHeight: isMobile ? 340 : 'auto',
                overflow: 'hidden',
                order: isMobile ? 1 : 0,
              }}
            >
              {section.image && (
                <>
                  {eimg(section.image, section.imageAlt || section.title, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  })}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to right, rgba(0,0,0,0) 70%, rgba(0,0,0,0.15) 100%)',
                    }}
                  />
                </>
              )}
              {/* Sideways text label */}
              {!isMobile && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 40,
                    left: -24,
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {section.badge || 'PORTFOLIO 2026'}
                </div>
              )}
            </div>

            {/* Right: Typography block */}
            <div
              style={{
                padding: isMobile ? '40px 24px' : isTablet ? '60px 40px' : '80px 64px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: theme.bgColor,
                order: isMobile ? 0 : 1,
              }}
            >
              {section.badge && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: theme.primaryColor,
                    marginBottom: 16,
                  }}
                >
                  {section.badge}
                </div>
              )}
              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(2.1rem, 7.5vw, 2.8rem)'
                  : isTablet
                  ? 'clamp(2.6rem, 4.8vw, 3.4rem)'
                  : 'clamp(3rem, 5vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: theme.textColor,
                marginBottom: 20,
              })}
              <div
                style={{
                  width: 48,
                  height: 3,
                  backgroundColor: theme.primaryColor,
                  marginBottom: 24,
                }}
              />
              {section.description &&
                et('p', 'description', section.description, {
                  fontSize: isMobile ? '0.98rem' : '1.1rem',
                  color: theme.textMuted,
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 420,
                })}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {ebtn(section.primaryBtn, true, 'primaryBtn', {
                  padding: isMobile ? '12px 26px' : '14px 34px',
                  fontSize: '0.94rem',
                })}
                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: isMobile ? '12px 22px' : '14px 28px',
                  fontSize: '0.94rem',
                })}
              </div>

              {/* Stats row at bottom */}
              {section.items && section.items.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: isMobile ? 20 : 32,
                    marginTop: isMobile ? 24 : 48,
                    paddingTop: isMobile ? 20 : 32,
                    borderTop: `1px solid ${theme.borderColor}`,
                    flexWrap: 'wrap',
                  }}
                >
                  {section.items.slice(0, 3).map((stat) => (
                    <div key={stat.id}>
                      <div
                        style={{
                          fontFamily: theme.headingFont,
                          fontSize: '1.6rem',
                          fontWeight: 800,
                          color: theme.primaryColor,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {stat.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: theme.textMuted, fontWeight: 600, marginTop: 2 }}>
                        {stat.subtitle}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      }

      /* 7. SWISS / EDITORIAL GRID HERO (grid-based, structured, type-led) */
      if (section.layoutVariant === 'swiss') {
        const isDark = theme.mode === 'dark';
        return (
          <section
            style={{
              padding: isMobile ? '48px 20px 40px' : isTablet ? '64px 32px 52px' : '80px 48px 72px',
              backgroundColor: isDark ? '#0e0e0e' : '#f8f8f6',
              boxSizing: 'border-box',
              borderBottom: `1px solid ${theme.borderColor}`,
            }}
          >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              {/* Top rule + badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: isMobile ? 32 : 52,
                  paddingBottom: 18,
                  borderBottom: `2px solid ${isDark ? '#2a2a2a' : '#e0e0e0'}`,
                }}
              >
                {section.badge && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      color: theme.primaryColor,
                      fontFamily: 'monospace',
                    }}
                  >
                    {section.badge}
                  </span>
                )}
                <div style={{ flex: 1, height: 1, backgroundColor: theme.borderColor }} />
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: theme.textMuted,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  }}
                >
                  VOL. 01 // 2026
                </span>
              </div>

              {/* Main grid: huge left title + right content */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '5fr 3fr',
                  gap: isMobile ? 32 : 60,
                  alignItems: 'end',
                }}
              >
                <div>
                  {et('h1', 'title', section.title, {
                    fontFamily: theme.headingFont,
                    fontSize: isMobile
                      ? 'clamp(2.6rem, 10vw, 3.5rem)'
                      : isTablet
                      ? 'clamp(3.5rem, 7vw, 5rem)'
                      : 'clamp(4rem, 7.5vw, 7.5rem)',
                    fontWeight: 900,
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    color: isDark ? '#ffffff' : '#0a0a0a',
                    textTransform: 'uppercase',
                    wordBreak: 'break-word',
                    marginBottom: 0,
                  })}
                </div>

                <div
                  style={{
                    paddingLeft: isMobile ? 0 : 32,
                    borderLeft: isMobile ? 'none' : `2px solid ${theme.primaryColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    gap: 20,
                  }}
                >
                  {section.description &&
                    et('p', 'description', section.description, {
                      fontSize: isMobile ? '0.96rem' : '1.04rem',
                      color: isDark ? '#d4d4d8' : '#3f3f46',
                      lineHeight: 1.7,
                    })}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {ebtn(section.primaryBtn, true, 'primaryBtn', {
                      padding: '12px 28px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderRadius: '0px',
                    })}
                    {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderRadius: '0px',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}`,
                      color: isDark ? '#ffffff' : '#0a0a0a',
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom horizontal image strip */}
              {section.image && (
                <div
                  style={{
                    marginTop: isMobile ? 36 : 56,
                    height: isMobile ? 200 : isTablet ? 280 : 360,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {eimg(section.image, section.imageAlt || section.title, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: isDark ? 'brightness(0.7) saturate(0.9)' : 'none',
                  })}
                </div>
              )}
            </div>
          </section>
        );
      }

      /* 8. TYPOGRAPHIC STATEMENT HERO (pure type, no image, oversized text) */
      if (section.layoutVariant === 'typographic') {
        const isDark = theme.mode === 'dark';
        const bg = isDark ? '#050505' : '#ffffff';
        const fg = isDark ? '#ffffff' : '#050505';
        return (
          <section
            style={{
              padding: isMobile ? '60px 20px 50px' : isTablet ? '80px 40px' : '100px 64px 90px',
              backgroundColor: bg,
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background typographic watermark */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 'clamp(8rem, 25vw, 20rem)',
                fontWeight: 900,
                fontFamily: theme.headingFont,
                color: 'transparent',
                WebkitTextStroke: isDark ? '1px rgba(255,255,255,0.04)' : '1px rgba(0,0,0,0.05)',
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 0,
              }}
            >
              {section.badge?.split(' ')[0] || 'DESIGN'}
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              {section.badge && (
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    color: theme.primaryColor,
                    marginBottom: 32,
                    fontFamily: 'monospace',
                  }}
                >
                  {section.badge}
                </div>
              )}

              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(3rem, 10vw, 4rem)'
                  : isTablet
                  ? 'clamp(4rem, 8vw, 5.5rem)'
                  : 'clamp(4.5rem, 8vw, 8rem)',
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: fg,
                marginBottom: 36,
                wordBreak: 'break-word',
              })}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? 24 : 56,
                  paddingTop: 32,
                  borderTop: `1px solid ${isDark ? '#222' : '#e0e0e0'}`,
                }}
              >
                {section.description &&
                  et('p', 'description', section.description, {
                    fontSize: isMobile ? '0.98rem' : '1.14rem',
                    color: isDark ? '#d4d4d8' : '#4b5563',
                    lineHeight: 1.7,
                  })}
                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'flex-start' : 'flex-end',
                  }}
                >
                  {ebtn(section.primaryBtn, true, 'primaryBtn', {
                    padding: '14px 36px',
                    fontSize: '0.94rem',
                    fontWeight: 700,
                  })}
                  {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                    padding: '14px 28px',
                    fontSize: '0.94rem',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}`,
                    color: fg,
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      }

      /* 9. ORGANIC HERO (natural, earthy, flowing — for wellness, food, nature brands) */
      if (section.layoutVariant === 'organic') {
        return (
          <section
            style={{
              padding: isMobile ? '0' : '0',
              backgroundColor: theme.bgColor,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile || isTablet ? '1fr' : '1.2fr 1fr',
                minHeight: isMobile || isTablet ? 'auto' : '88vh',
              }}
            >
              {/* Left: Warm content area */}
              <div
                style={{
                  padding: isMobile ? '56px 24px 48px' : isTablet ? '56px 36px 44px' : '100px 72px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: theme.bgColor,
                }}
              >
                {section.badge && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 24,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 2,
                        backgroundColor: theme.primaryColor,
                        display: 'inline-block',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: theme.primaryColor,
                      }}
                    >
                      {section.badge}
                    </span>
                  </div>
                )}
                {et('h1', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile
                    ? 'clamp(2.2rem, 8vw, 3rem)'
                    : isTablet
                    ? 'clamp(2.4rem, 4.8vw, 3.2rem)'
                    : 'clamp(3rem, 5.5vw, 4.5rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  color: theme.textColor,
                  marginBottom: 20,
                })}
                {section.description &&
                  et('p', 'description', section.description, {
                    fontSize: isMobile ? '1rem' : '1.12rem',
                    color: theme.textMuted,
                    lineHeight: 1.75,
                    marginBottom: 36,
                    maxWidth: isMobile || isTablet ? '100%' : 440,
                  })}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {ebtn(section.primaryBtn, true, 'primaryBtn', {
                    padding: isMobile ? '13px 28px' : '15px 36px',
                    fontSize: '0.96rem',
                    borderRadius: '9999px',
                  })}
                  {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                    padding: isMobile ? '13px 22px' : '15px 28px',
                    fontSize: '0.96rem',
                    borderRadius: '9999px',
                  })}
                </div>
              </div>

              {/* Right: Rich full-bleed image */}
              {section.image && (
                <div
                  style={{
                    position: 'relative',
                    minHeight: isMobile ? 320 : isTablet ? 380 : 'auto',
                    overflow: 'hidden',
                  }}
                >
                  {eimg(section.image, section.imageAlt || section.title, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  })}
                  {/* Organic shape overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: -1,
                      width: isMobile || isTablet ? '100%' : '80px',
                      height: isMobile || isTablet ? '40px' : '100%',
                      background: isMobile || isTablet
                        ? theme.bgColor
                        : 'none',
                      zIndex: 1,
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        );
      }

      /* 10. MAGAZINE COVER HERO (editorial, horizontal rule layout, large issue number) */
      if (section.layoutVariant === 'magazine-cover') {
        const isDark = theme.mode === 'dark';
        return (
          <section
            style={{
              backgroundColor: isDark ? '#0c0c0c' : '#f9f7f4',
              boxSizing: 'border-box',
              overflow: 'hidden',
              position: 'relative',
              minHeight: isMobile ? 'auto' : '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Magazine masthead bar */}
            <div
              style={{
                padding: isMobile ? '12px 20px' : '14px 48px',
                borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#e0ddd6'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: theme.headingFont,
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: isDark ? '#ffffff' : '#0a0a0a',
                  textTransform: 'uppercase',
                }}
              >
                {section.badge?.split('//')[0]?.trim() || 'THE JOURNAL'}
              </span>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: theme.textMuted,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  }}
                >
                  EST. 2024
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: theme.primaryColor,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                  }}
                >
                  ISSUE 12
                </span>
              </div>
            </div>

            {/* Main cover layout */}
            <div
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
                position: 'relative',
              }}
            >
              {/* Left: Cover story text */}
              <div
                style={{
                  padding: isMobile ? '36px 18px 40px' : isTablet ? '48px 32px' : '72px 64px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  zIndex: 1,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color: theme.primaryColor,
                      marginBottom: 16,
                      fontFamily: 'monospace',
                    }}
                  >
                    COVER STORY
                  </div>
                  {et('h1', 'title', section.title, {
                    fontFamily: theme.headingFont,
                    fontSize: isMobile
                      ? 'clamp(2.2rem, 8vw, 3rem)'
                      : isTablet
                      ? 'clamp(2.8rem, 5.5vw, 3.8rem)'
                      : 'clamp(3rem, 5.5vw, 4.8rem)',
                    fontWeight: 900,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    color: isDark ? '#ffffff' : '#0a0a0a',
                    marginBottom: 20,
                    wordBreak: 'break-word',
                  })}
                  {section.description &&
                    et('p', 'description', section.description, {
                      fontSize: isMobile ? '0.98rem' : '1.05rem',
                      color: isDark ? '#d4d4d8' : '#3f3f46',
                      lineHeight: 1.7,
                      marginBottom: 32,
                      maxWidth: 480,
                    })}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {ebtn(section.primaryBtn, true, 'primaryBtn', {
                      padding: '13px 30px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                    })}
                    {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                      padding: '13px 24px',
                      fontSize: '0.92rem',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}`,
                      color: isDark ? '#ffffff' : '#0a0a0a',
                    })}
                  </div>
                </div>

                {/* Issue meta row at bottom */}
                <div
                  style={{
                    display: 'flex',
                    gap: 24,
                    alignItems: 'center',
                    paddingTop: 32,
                    marginTop: 40,
                    borderTop: `1px solid ${isDark ? '#2a2a2a' : '#e0ddd6'}`,
                    flexWrap: 'wrap',
                  }}
                >
                  {['LONGFORM', 'INTERVIEWS', 'ESSAYS', 'CULTURE'].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: theme.textMuted,
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Cover image */}
              {section.image && (
                <div style={{ position: 'relative', minHeight: isMobile ? 320 : 'auto', overflow: 'hidden' }}>
                  {eimg(section.image, section.imageAlt || section.title, {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: isDark ? 'brightness(0.8)' : 'none',
                  })}
                  {/* Issue number watermark */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontFamily: theme.headingFont,
                      fontSize: 'clamp(4rem, 10vw, 7rem)',
                      fontWeight: 900,
                      color: 'rgba(255,255,255,0.12)',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    12
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      }

      /* 11. ARCHITECT / DIAGONAL HERO (Angular sections, strong geometry) */
      if (section.layoutVariant === 'architect' || section.layoutVariant === 'diagonal') {
        const isDark = theme.mode === 'dark';
        const archBg = isDark ? '#0d0d0d' : '#f4f3f0';
        return (
          <section
            style={{
              backgroundColor: archBg,
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
              minHeight: isMobile ? 'auto' : '88vh',
            }}
          >
            {/* Diagonal background accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: isMobile ? '60%' : '45%',
                height: '100%',
                backgroundColor: theme.primaryColor,
                clipPath: isMobile
                  ? 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)'
                  : 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
                zIndex: 0,
                opacity: 0.08,
              }}
            />
            {/* Strong right panel */}
            {section.image && !isMobile && !isTablet && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '42%',
                  height: '100%',
                  overflow: 'hidden',
                  zIndex: 0,
                  clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
                }}
              >
                <img
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(0.9)' }}
                />
              </div>
            )}

            <div
              style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: 1200,
                margin: '0 auto',
                padding: isMobile ? '48px 18px 40px' : isTablet ? '60px 32px 48px' : '110px 64px',
                width: isMobile || isTablet ? '100%' : '58%',
                boxSizing: 'border-box',
              }}
            >
              {section.badge && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ width: 36, height: 2, backgroundColor: theme.primaryColor }} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color: theme.primaryColor,
                    }}
                  >
                    {section.badge}
                  </span>
                </div>
              )}

              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(2.1rem, 7.5vw, 2.8rem)'
                  : isTablet
                  ? 'clamp(2.6rem, 5vw, 3.4rem)'
                  : 'clamp(3.5rem, 6.5vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: isDark ? '#ffffff' : '#0a0a0a',
                marginBottom: 20,
                wordBreak: 'break-word',
              })}

              {section.description &&
                et('p', 'description', section.description, {
                  fontSize: isMobile ? '0.98rem' : '1.08rem',
                  color: isDark ? '#d4d4d8' : '#3f3f46',
                  lineHeight: 1.7,
                  marginBottom: 32,
                  maxWidth: 500,
                })}

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {ebtn(section.primaryBtn, true, 'primaryBtn', {
                  padding: '14px 34px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                })}
                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: '14px 28px',
                  fontSize: '0.94rem',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}`,
                  color: isDark ? '#ffffff' : '#0a0a0a',
                })}
              </div>

              {/* Mobile/Tablet image below */}
              {(isMobile || isTablet) && section.image && (
                <div style={{ marginTop: 32, borderRadius: theme.borderRadius, overflow: 'hidden', height: isMobile ? 260 : 360 }}>
                  <img
                    src={section.image}
                    alt={section.imageAlt || section.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </section>
        );
      }

      /* 12. LUXURY STACKED HERO (centered, stacked, high-end serif typography) */
      if (section.layoutVariant === 'luxury-stacked') {
        return (
          <section
            style={{
              padding: 0,
              backgroundColor: theme.bgColor,
              boxSizing: 'border-box',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Full background image with gradient */}
            {section.image && (
              <div
                style={{
                  position: 'relative',
                  height: isMobile ? 360 : isTablet ? 480 : 600,
                  overflow: 'hidden',
                }}
              >
                {eimg(section.image, section.imageAlt || section.title, {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                })}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: isMobile ? '32px 20px' : '52px 64px',
                  }}
                >
                  {section.badge && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: 'rgba(255,255,255,0.75)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {section.badge}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stacked content below image */}
            <div
              style={{
                padding: isMobile ? '40px 20px 52px' : isTablet ? '52px 48px 64px' : '64px 80px 80px',
                maxWidth: 880,
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(2.2rem, 8vw, 3rem)'
                  : isTablet
                  ? 'clamp(2.8rem, 5vw, 3.8rem)'
                  : 'clamp(3.2rem, 5.5vw, 5rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                color: theme.textColor,
                marginBottom: 16,
              })}
              <div
                style={{
                  width: 60,
                  height: 2,
                  backgroundColor: theme.primaryColor,
                  margin: '0 auto 24px',
                }}
              />
              {section.description &&
                et('p', 'description', section.description, {
                  fontSize: isMobile ? '1rem' : '1.15rem',
                  color: theme.textMuted,
                  lineHeight: 1.75,
                  marginBottom: 36,
                })}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                {ebtn(section.primaryBtn, true, 'primaryBtn', {
                  padding: isMobile ? '14px 30px' : '16px 42px',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                })}
                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: isMobile ? '14px 26px' : '16px 36px',
                  fontSize: '0.96rem',
                })}
              </div>
            </div>
          </section>
        );
      }

      /* 5. MINIMAL / BRUTALIST HERO (Personal Branding, Indie Creator) */
      if (section.layoutVariant === 'minimal') {
        return (
          <section
            style={{
              padding: `${paddingY} ${paddingX}`,
              backgroundColor: section.bgVariant === 'card' ? theme.cardBg : 'transparent',
              boxSizing: 'border-box',
              borderBottom: `2px solid ${theme.borderColor}`,
            }}
          >
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              {section.badge && (
                <div style={{ marginBottom: 14 }}>
                  {et('span', 'badge', section.badge, {
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: theme.primaryColor,
                    letterSpacing: '0.1em',
                  })}
                </div>
              )}

              {et('h1', 'title', section.title, {
                fontFamily: theme.headingFont,
                fontSize: isMobile
                  ? 'clamp(2.3rem, 9vw, 3.2rem)'
                  : isTablet
                  ? 'clamp(3rem, 6vw, 4.2rem)'
                  : 'clamp(3.6rem, 6.5vw, 5.2rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-0.035em',
                marginBottom: 24,
                color: theme.textColor,
              })}

              {section.description &&
                et('p', 'description', section.description, {
                  fontSize: isMobile ? '1.05rem' : '1.25rem',
                  color: theme.textMuted,
                  lineHeight: 1.6,
                  marginBottom: 32,
                  maxWidth: 720,
                })}

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {ebtn(section.primaryBtn, true, 'primaryBtn', {
                  padding: isMobile ? '13px 26px' : '15px 36px',
                  fontSize: '0.98rem',
                })}
                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: isMobile ? '13px 24px' : '15px 32px',
                  fontSize: '0.98rem',
                })}
              </div>
            </div>
          </section>
        );
      }

      /* 6. STANDARD CENTERED / SPLIT HERO (Default Fallback) */
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
                  ? '1fr 1fr'
                  : 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: isMobile ? 24 : isTablet ? 32 : 48,
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
                  ? 'clamp(2.2rem, 4.2vw, 2.85rem)'
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
                  fontSize: isMobile ? '0.98rem' : isTablet ? '1.04rem' : '1.18rem',
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
                  padding: isMobile ? '12px 24px' : isTablet ? '13px 28px' : '14px 32px',
                  fontSize: isMobile ? '0.92rem' : '0.96rem',
                  width: isMobile ? '100%' : 'auto',
                })}

                {ebtn(section.secondaryBtn, false, 'secondaryBtn', {
                  padding: isMobile ? '12px 22px' : isTablet ? '13px 24px' : '14px 28px',
                  fontSize: isMobile ? '0.92rem' : '0.96rem',
                  width: isMobile ? '100%' : 'auto',
                })}
              </div>
            </div>

            {section.image && (section.layoutVariant !== 'centered' || isMobile) && (
              <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                {eimg(section.image, section.imageAlt || section.title, {
                  width: '100%',
                  maxHeight: isMobile ? 280 : isTablet ? 360 : 500,
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
    }

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
    case 'features': {
      /* 1. BENTO GRID SERVICES */
      if (section.layoutVariant === 'bento') {
        const items = section.items || [];
        const leadItem = items[0];
        const sideItems = items.slice(1);

        return (
          <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: 740, margin: `0 auto ${isMobile ? 28 : 44}px` }}>
                {section.badge &&
                  et('span', 'badge', section.badge, {
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: theme.primaryColor,
                    letterSpacing: '0.08em',
                  })}
                {et('h2', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile ? '1.85rem' : 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: 800,
                  margin: '8px 0 12px',
                  color: theme.textColor,
                })}
                {section.description &&
                  et('p', 'description', section.description, {
                    color: theme.textMuted,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  })}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.35fr 1fr 1fr',
                  gap: 20,
                }}
              >
                {/* Lead Bento Feature */}
                {leadItem && (
                  <div
                    style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: isMobile ? '24px 20px' : '36px 30px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: `${theme.primaryColor}18`,
                          color: theme.primaryColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20,
                        }}
                      >
                        {renderIcon(leadItem.icon)}
                      </div>
                      {leadItem.tag && (
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: theme.primaryColor, textTransform: 'uppercase' }}>
                          {leadItem.tag}
                        </span>
                      )}
                      <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 12px', color: theme.textColor }}>
                        {leadItem.title}
                      </h3>
                      <p style={{ color: theme.textMuted, fontSize: '0.96rem', lineHeight: 1.65 }}>
                        {leadItem.description}
                      </p>
                    </div>

                    {leadItem.image && (
                      <div style={{ marginTop: 24, borderRadius: 8, overflow: 'hidden' }}>
                        <img src={leadItem.image} alt={leadItem.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Secondary Bento Boxes */}
                {sideItems.map((it, idx) => (
                  <div
                    key={it.id || idx}
                    style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: theme.borderRadius,
                      padding: isMobile ? '22px 18px' : '30px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 10px 26px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${theme.primaryColor}14`,
                        color: theme.primaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                      }}
                    >
                      {renderIcon(it.icon)}
                    </div>
                    {it.tag && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.primaryColor, textTransform: 'uppercase', marginBottom: 4 }}>
                        {it.tag}
                      </span>
                    )}
                    <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.2rem', fontWeight: 700, marginBottom: 8, color: theme.textColor }}>
                      {it.title}
                    </h3>
                    <p style={{ color: theme.textMuted, fontSize: '0.9rem', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
                      {it.description}
                    </p>
                    {it.price && (
                      <div style={{ fontWeight: 800, color: theme.primaryColor, fontSize: '1rem', marginTop: 'auto' }}>
                        {it.price}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      /* 2. MINIMAL / EDITORIAL NUMBERED LIST SERVICES */
      if (section.layoutVariant === 'minimal' || section.layoutVariant === 'editorial') {
        return (
          <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ marginBottom: isMobile ? 32 : 48, maxWidth: 680 }}>
                {section.badge && (
                  <div style={{ marginBottom: 10 }}>
                    {et('span', 'badge', section.badge, {
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: theme.primaryColor,
                    })}
                  </div>
                )}
                {et('h2', 'title', section.title, {
                  fontFamily: theme.headingFont,
                  fontSize: isMobile ? '1.9rem' : 'clamp(2.1rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: theme.textColor,
                  marginBottom: 12,
                })}
                {section.description &&
                  et('p', 'description', section.description, {
                    color: theme.textMuted,
                    fontSize: '1.04rem',
                    lineHeight: 1.6,
                  })}
              </div>

              {/* Numbered Row Items */}
              <div style={{ borderTop: `1px solid ${theme.borderColor}` }}>
                {(section.items || []).map((it, itemIdx) => (
                  <div
                    key={it.id}
                    onClick={() => onSelectItem && onSelectItem(it)}
                    style={{
                      padding: isMobile ? '20px 0' : '28px 12px',
                      borderBottom: `1px solid ${theme.borderColor}`,
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '50px 1.2fr 1.8fr auto' : '80px 1.2fr 2fr auto',
                      gap: isMobile ? 8 : isTablet ? 16 : 24,
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span style={{ fontFamily: theme.headingFont, fontSize: '1.15rem', fontWeight: 800, color: theme.primaryColor }}>
                      {String(itemIdx + 1).padStart(2, '0')}
                    </span>
                    <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.22rem', fontWeight: 700, color: theme.textColor }}>
                      {it.title}
                    </h3>
                    <p style={{ color: theme.textMuted, fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                      {it.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                      {it.price && (
                        <span style={{ fontWeight: 700, color: theme.primaryColor, fontSize: '0.94rem' }}>
                          {it.price}
                        </span>
                      )}
                      <ArrowRight size={18} color={theme.primaryColor} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      /* 3. DEFAULT GRID CARDS */
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
    }

    /* -------------------------------- PORTFOLIO, SHOP & GALLERY -------------------------------- */
    case 'portfolio': {
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

      /* Lookbook / Masonry Layout (Photography, Fashion) */
      if (section.layoutVariant === 'lookbook' || section.layoutVariant === 'masonry') {
        return (
          <section style={{ padding: `${paddingY} ${paddingX}`, backgroundColor: theme.cardBg, boxSizing: 'border-box' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', maxWidth: 740, margin: `0 auto ${isMobile ? 24 : 36}px` }}>
                {section.badge && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.primaryColor, textTransform: 'uppercase' }}>
                    {section.badge}
                  </span>
                )}
                <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? '1.8rem' : '2.6rem', fontWeight: 800, margin: '8px 0 12px', color: theme.textColor }}>
                  {section.title}
                </h2>
                {section.description && <p style={{ color: theme.textMuted, fontSize: '0.98rem' }}>{section.description}</p>}
              </div>

              {/* Staggered Editorial Lookbook Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: 20,
                }}
              >
                {filteredItems.map((it, idx) => (
                  <div
                    key={it.id || idx}
                    onClick={() => onSelectItem && onSelectItem(it)}
                    style={{
                      position: 'relative',
                      borderRadius: theme.borderRadius,
                      overflow: 'hidden',
                      height: idx % 3 === 0 ? (isMobile ? 260 : 380) : isMobile ? 240 : 310,
                      cursor: 'pointer',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={it.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'}
                      alt={it.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '20px',
                        color: '#ffffff',
                      }}
                    >
                      {it.tag && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.primaryColor, textTransform: 'uppercase' }}>
                          {it.tag}
                        </span>
                      )}
                      <h4 style={{ fontFamily: theme.headingFont, fontSize: '1.18rem', fontWeight: 700, margin: '4px 0 6px' }}>
                        {it.title}
                      </h4>
                      {it.price && <span style={{ fontSize: '0.94rem', fontWeight: 800 }}>{it.price}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      /* Default Grid Portfolio */
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

    /* -------------------------------- RESTAURANT & CAFÉ MENU -------------------------------- */
    case 'menu': {
      const menuCategories = Array.from(
        new Set((section.items || []).map((it) => it.tag).filter(Boolean))
      );
      const activeMenuCat = activeFilter === 'All' && menuCategories[0] ? menuCategories[0] : activeFilter;
      const displayItems = (section.items || []).filter((it) => {
        if (!activeMenuCat || activeMenuCat === 'All') return true;
        return it.tag === activeMenuCat;
      });

      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, backgroundColor: theme.cardBg, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 44 }}>
              {section.badge && (
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: theme.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {section.badge}
                </span>
              )}
              <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: 800, margin: '8px 0 12px', color: theme.textColor }}>
                {section.title}
              </h2>
              {section.description && <p style={{ color: theme.textMuted, fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>{section.description}</p>}
            </div>

            {/* Menu Category Switcher Tabs */}
            {menuCategories.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
                {menuCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectFilter(cat as string)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: theme.buttonStyle === 'pill' ? 9999 : theme.borderRadius,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: `1px solid ${activeMenuCat === cat ? theme.primaryColor : theme.borderColor}`,
                      background: activeMenuCat === cat ? theme.primaryColor : theme.bgColor,
                      color: activeMenuCat === cat ? '#ffffff' : theme.textColor,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Menu Course List */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr', gap: isMobile ? 20 : 32 }}>
              {displayItems.map((dish) => (
                <div
                  key={dish.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    paddingBottom: 18,
                    borderBottom: `1px dashed ${theme.borderColor}`,
                  }}
                >
                  {dish.image && (
                    <img
                      src={dish.image}
                      alt={dish.title}
                      style={{ width: 68, height: 68, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <h4 style={{ fontFamily: theme.headingFont, fontSize: '1.14rem', fontWeight: 700, color: theme.textColor }}>
                        {dish.title}
                      </h4>
                      <span style={{ fontWeight: 800, color: theme.primaryColor, fontSize: '1.1rem', marginLeft: 12 }}>
                        {dish.price}
                      </span>
                    </div>
                    <p style={{ color: theme.textMuted, fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                      {dish.description}
                    </p>
                    {dish.subtitle && (
                      <span style={{ display: 'inline-block', marginTop: 4, fontSize: '0.74rem', color: theme.primaryColor, fontWeight: 600 }}>
                        {dish.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* -------------------------------- REAL ESTATE PROPERTIES -------------------------------- */
    case 'properties':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, backgroundColor: section.bgVariant === 'card' ? theme.cardBg : 'transparent', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 740, margin: `0 auto ${isMobile ? 24 : 40}px` }}>
              {section.badge && (
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: theme.primaryColor, textTransform: 'uppercase' }}>
                  {section.badge}
                </span>
              )}
              <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? '1.85rem' : '2.7rem', fontWeight: 800, margin: '8px 0 12px', color: theme.textColor }}>
                {section.title}
              </h2>
              {section.description && <p style={{ color: theme.textMuted, fontSize: '1rem' }}>{section.description}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 24 }}>
              {(section.items || []).map((prop) => (
                <div
                  key={prop.id}
                  style={{
                    background: theme.cardBg,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: theme.borderRadius,
                    overflow: 'hidden',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: 230 }}>
                    <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        background: 'rgba(0,0,0,0.78)',
                        color: '#ffffff',
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontWeight: 800,
                        fontSize: '1rem',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {prop.price}
                    </span>
                    {prop.tag && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: theme.primaryColor,
                          color: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {prop.tag}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.textMuted, fontSize: '0.8rem', marginBottom: 6 }}>
                      <MapPin size={14} color={theme.primaryColor} />
                      <span>{prop.subtitle || 'Prime Location'}</span>
                    </div>
                    <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.2rem', fontWeight: 800, color: theme.textColor, marginBottom: 8 }}>
                      {prop.title}
                    </h3>
                    <p style={{ color: theme.textMuted, fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 16 }}>
                      {prop.description}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `1px solid ${theme.borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textMuted }}>
                        Virtual Tour Available
                      </span>
                      <button
                        onClick={() => handleActionClick('contact', `Tour: ${prop.title}`)}
                        style={{
                          background: `${theme.primaryColor}18`,
                          color: theme.primaryColor,
                          border: `1px solid ${theme.primaryColor}44`,
                          padding: '6px 14px',
                          borderRadius: 6,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Schedule Tour
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- EDITORIAL / BLOG MAGAZINE -------------------------------- */
    case 'blog':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, backgroundColor: theme.cardBg, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: isMobile ? 24 : 36, flexWrap: 'wrap', gap: 12 }}>
              <div>
                {section.badge && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {section.badge}
                  </span>
                )}
                <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? '1.85rem' : '2.6rem', fontWeight: 800, margin: '6px 0', color: theme.textColor }}>
                  {section.title}
                </h2>
                {section.description && <p style={{ color: theme.textMuted, fontSize: '0.96rem' }}>{section.description}</p>}
              </div>
              <button
                onClick={() => handleActionClick('blog', 'Explore Full Editorial Archive')}
                style={{ fontSize: '0.86rem', color: theme.primaryColor, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View all articles →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 24 }}>
              {(section.items || []).map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectItem && onSelectItem(art)}
                  style={{
                    background: theme.bgColor,
                    borderRadius: theme.borderRadius,
                    overflow: 'hidden',
                    border: `1px solid ${theme.borderColor}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {art.image && (
                    <div style={{ height: 210, overflow: 'hidden' }}>
                      <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.primaryColor, textTransform: 'uppercase' }}>
                        {art.tag || 'EDITORIAL'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: theme.textMuted }}>{art.period || '5 min read'}</span>
                    </div>
                    <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.22rem', fontWeight: 800, color: theme.textColor, marginBottom: 8, lineHeight: 1.3 }}>
                      {art.title}
                    </h3>
                    <p style={{ color: theme.textMuted, fontSize: '0.88rem', lineHeight: 1.55, flex: 1, marginBottom: 16 }}>
                      {art.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${theme.borderColor}` }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textColor }}>
                        By {art.author || 'MACSAC Editorial'}
                      </span>
                      <ArrowRight size={15} color={theme.primaryColor} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- TECHNICAL SPECS MATRIX -------------------------------- */
    case 'specs':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, backgroundColor: theme.cardBg, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 700, margin: `0 auto ${isMobile ? 24 : 36}px` }}>
              {section.badge && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.primaryColor, textTransform: 'uppercase' }}>
                  {section.badge}
                </span>
              )}
              <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 800, margin: '8px 0', color: theme.textColor }}>
                {section.title}
              </h2>
              {section.description && <p style={{ color: theme.textMuted, fontSize: '0.96rem' }}>{section.description}</p>}
            </div>

            <div style={{ background: theme.bgColor, border: `1px solid ${theme.borderColor}`, borderRadius: theme.borderRadius, overflow: 'hidden' }}>
              {(section.items || []).map((spec, idx) => (
                <div
                  key={spec.id || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '260px 1fr',
                    padding: isMobile ? '12px 16px' : '16px 24px',
                    borderBottom: idx !== (section.items?.length || 0) - 1 ? `1px solid ${theme.borderColor}` : 'none',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? 4 : 16,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.94rem', color: theme.textColor }}>
                    {spec.title}
                  </span>
                  <span style={{ color: theme.textMuted, fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {spec.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    /* -------------------------------- TIMELINE & ROADMAP -------------------------------- */
    case 'timeline':
      return (
        <section style={{ padding: `${paddingY} ${paddingX}`, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>
              {section.badge && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.primaryColor, textTransform: 'uppercase' }}>
                  {section.badge}
                </span>
              )}
              <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? '1.85rem' : '2.6rem', fontWeight: 800, margin: '8px 0', color: theme.textColor }}>
                {section.title}
              </h2>
              {section.description && <p style={{ color: theme.textMuted, fontSize: '0.96rem' }}>{section.description}</p>}
            </div>

            <div style={{ position: 'relative', borderLeft: `2px solid ${theme.primaryColor}55`, marginLeft: isMobile ? 12 : 24, paddingLeft: isMobile ? 20 : 32 }}>
              {(section.items || []).map((step, idx) => (
                <div key={step.id || idx} style={{ marginBottom: 32, position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: isMobile ? -27 : -39,
                      top: 4,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: theme.primaryColor,
                      boxShadow: `0 0 10px ${theme.primaryColor}88`,
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: theme.primaryColor, textTransform: 'uppercase' }}>
                    {step.tag || `STEP 0${idx + 1}`}
                  </span>
                  <h3 style={{ fontFamily: theme.headingFont, fontSize: '1.28rem', fontWeight: 700, color: theme.textColor, margin: '4px 0 8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: theme.textMuted, fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

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
