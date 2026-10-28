import React, { useState } from 'react';
import {
  LayoutGrid,
  FileText,
  Layers,
  Image,
  Palette,
  Navigation,
  Settings,
  FolderGit2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Check,
  Eye,
  Save,
  Download,
  Send,
  ArrowLeft,
  Cloud,
  Star,
  MessageSquare,
  Users,
  HelpCircle,
  Mail,
  Megaphone,
  Briefcase,
  LayoutTemplate,
  Info,
  Cpu,
  Images,
  BadgeDollarSign,
} from 'lucide-react';
import {
  Project,
  WebsitePage,
  WebsiteSection,
  WebsiteTheme,
  SectionType,
  UserAccount,
} from '../types';
import { THEME_PRESETS } from '../data/themePresets';
import { SECTION_BLUEPRINTS } from '../data/defaultSections';
import { CURATED_MEDIA_ASSETS } from '../data/mediaAssets';

interface EditorLeftSidebarProps {
  project: Project;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: (name: string) => void;
  onRenamePage: (pageId: string, name: string) => void;
  onDeletePage: (pageId: string) => void;
  selectedSectionId?: string;
  onSelectSection: (sectionId: string) => void;
  onAddSection: (type: SectionType) => void;
  onUpdateTheme: (themeUpdates: Partial<WebsiteTheme>) => void;
  onApplyThemePreset: (preset: WebsiteTheme) => void;
  onUpdateNavigation: (navUpdates: Partial<Project['navigation']>) => void;
  onUpdateSettings: (settingsUpdates: Partial<Project['settings']>) => void;
  onSelectImageForSection: (imageUrl: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  isSaving: boolean;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onPublish: () => void;
  onBackToGallery: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

type TabKey =
  | 'sections'
  | 'pages'
  | 'layers'
  | 'assets'
  | 'theme'
  | 'navbar'
  | 'settings'
  | 'project';

// ─── Design tokens ───────────────────────────────────────────────────────────
const FONT = "'Inter', sans-serif";
const C_BG = '#faf9f7';
const C_RAIL = '#f2ede6';
const C_BORDER = '#e8ddd4';
const C_TEXT = '#2d2622';
const C_MUTED = '#9a8a80';
const C_COPPER = '#b1704e';
const C_COPPER_BG = 'rgba(177,112,78,0.10)';
const C_INPUT_BG = '#f6f2eb';
const C_PANEL_BG = '#faf9f7';

// All sections that can be added (exclude footer from add-section catalog)
const ADDABLE_SECTION_TYPES: SectionType[] = [
  'hero', 'about', 'services', 'features', 'portfolio',
  'testimonials', 'team', 'pricing', 'faq', 'contact',
  'newsletter', 'cta',
];

const SECTION_TYPE_ICONS: Record<string, React.ElementType> = {
  hero: LayoutTemplate,
  about: Info,
  services: Briefcase,
  features: Cpu,
  portfolio: Images,
  testimonials: MessageSquare,
  team: Users,
  pricing: BadgeDollarSign,
  faq: HelpCircle,
  contact: Mail,
  newsletter: Megaphone,
  cta: Star,
  footer: FileText,
};

const HEADING_FONT_OPTIONS = [
  'Outfit, sans-serif',
  'Inter, sans-serif',
  'Playfair Display, serif',
  'Space Grotesk, sans-serif',
  'Plus Jakarta Sans, sans-serif',
  'Cinzel, serif',
  'Lora, serif',
];

// ─── Shared sub-components ────────────────────────────────────────────────────

const SectionDivider: React.FC<{ label?: string }> = ({ label }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '14px 0 10px',
    }}
  >
    {label && (
      <span
        style={{
          fontFamily: FONT,
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: C_MUTED,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    )}
    <div style={{ flex: 1, height: 1, backgroundColor: C_BORDER }} />
  </div>
);

const PanelLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: '0.72rem',
      fontWeight: 600,
      color: C_MUTED,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      marginBottom: 5,
    }}
  >
    {children}
  </div>
);

const PanelInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
> = ({ label, style, ...rest }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <PanelLabel>{label}</PanelLabel>}
    <input
      {...rest}
      style={{
        width: '100%',
        padding: '7px 10px',
        borderRadius: 7,
        border: `1px solid ${C_BORDER}`,
        backgroundColor: C_INPUT_BG,
        color: C_TEXT,
        fontFamily: FONT,
        fontSize: '0.82rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        ...style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = C_COPPER; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = C_BORDER; }}
    />
  </div>
);

const PanelTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
> = ({ label, style, ...rest }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <PanelLabel>{label}</PanelLabel>}
    <textarea
      {...rest}
      style={{
        width: '100%',
        padding: '7px 10px',
        borderRadius: 7,
        border: `1px solid ${C_BORDER}`,
        backgroundColor: C_INPUT_BG,
        color: C_TEXT,
        fontFamily: FONT,
        fontSize: '0.82rem',
        outline: 'none',
        resize: 'vertical',
        minHeight: 70,
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        ...style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = C_COPPER; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = C_BORDER; }}
    />
  </div>
);

const PanelSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
> = ({ label, children, style, ...rest }) => (
  <div style={{ marginBottom: 12 }}>
    {label && <PanelLabel>{label}</PanelLabel>}
    <select
      {...rest}
      style={{
        width: '100%',
        padding: '7px 10px',
        borderRadius: 7,
        border: `1px solid ${C_BORDER}`,
        backgroundColor: C_INPUT_BG,
        color: C_TEXT,
        fontFamily: FONT,
        fontSize: '0.82rem',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </select>
  </div>
);

// ─── TAB PANEL CONTENTS ──────────────────────────────────────────────────────

// Tab 1: Sections
const SectionsPanel: React.FC<{
  activePage: WebsitePage | undefined;
  selectedSectionId?: string;
  onSelectSection: (id: string) => void;
  onAddSection: (type: SectionType) => void;
}> = ({ activePage, selectedSectionId, onSelectSection, onAddSection }) => (
  <div>
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.92rem',
          fontWeight: 800,
          color: C_TEXT,
          marginBottom: 2,
        }}
      >
        Page Sections
      </div>
      <div style={{ fontFamily: FONT, fontSize: '0.74rem', color: C_MUTED }}>
        On "{activePage?.name ?? ''}"
      </div>
    </div>

    {/* Section list */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
      {(activePage?.sections ?? []).map((sec, idx) => {
        const isSelected = selectedSectionId === sec.id;
        return (
          <div
            key={sec.id}
            onClick={() => onSelectSection(sec.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 11px',
              borderRadius: 8,
              background: isSelected ? C_COPPER_BG : '#ffffff',
              border: isSelected
                ? `1px solid ${C_COPPER}`
                : `1px solid ${C_BORDER}`,
              borderLeft: isSelected
                ? `3px solid ${C_COPPER}`
                : `1px solid ${C_BORDER}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: '0.68rem',
                  color: C_MUTED,
                  width: 14,
                  textAlign: 'right',
                }}
              >
                {idx + 1}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: isSelected ? C_COPPER : C_TEXT,
                    textTransform: 'capitalize',
                  }}
                >
                  {sec.type}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '0.7rem',
                    color: C_MUTED,
                    maxWidth: 140,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {sec.title}
                </div>
              </div>
            </div>
            <ChevronRight
              size={13}
              style={{ color: isSelected ? C_COPPER : C_MUTED }}
            />
          </div>
        );
      })}
    </div>

    {/* Add Section catalog */}
    <SectionDivider label="Add Section" />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 6,
      }}
    >
      {ADDABLE_SECTION_TYPES.map((type) => {
        const IconComp = SECTION_TYPE_ICONS[type];
        return (
          <button
            key={type}
            onClick={() => onAddSection(type)}
            title={`Add ${type} section`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 10px',
              borderRadius: 7,
              border: `1px solid ${C_BORDER}`,
              background: '#ffffff',
              color: C_TEXT,
              fontFamily: FONT,
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              textTransform: 'capitalize',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C_COPPER;
              (e.currentTarget as HTMLButtonElement).style.background = C_COPPER_BG;
              (e.currentTarget as HTMLButtonElement).style.color = C_COPPER;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C_BORDER;
              (e.currentTarget as HTMLButtonElement).style.background = '#ffffff';
              (e.currentTarget as HTMLButtonElement).style.color = C_TEXT;
            }}
          >
            {IconComp && (
              <IconComp
                size={14}
                style={{ flexShrink: 0, color: C_COPPER, opacity: 0.85 }}
              />
            )}
            <span
              style={{
                fontFamily: FONT,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {type}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

// Tab 2: Pages
const PagesPanel: React.FC<{
  project: Project;
  activePageId: string;
  onSelectPage: (pageId: string) => void;
  onAddPage: (name: string) => void;
  onDeletePage: (pageId: string) => void;
}> = ({ project, activePageId, onSelectPage, onAddPage, onDeletePage }) => {
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageName.trim()) {
      onAddPage(newPageName.trim());
      setNewPageName('');
      setIsAddingPage(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: '0.92rem',
            fontWeight: 800,
            color: C_TEXT,
          }}
        >
          Website Pages
        </div>
        <button
          onClick={() => setIsAddingPage(!isAddingPage)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 9px',
            borderRadius: 6,
            border: `1px solid ${C_COPPER}`,
            background: C_COPPER_BG,
            color: C_COPPER,
            fontFamily: FONT,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={12} /> Add Page
        </button>
      </div>

      {/* Add page form */}
      {isAddingPage && (
        <form
          onSubmit={handleCreate}
          style={{
            padding: 12,
            borderRadius: 8,
            background: C_INPUT_BG,
            border: `1px solid ${C_BORDER}`,
            marginBottom: 12,
          }}
        >
          <PanelLabel>New page name</PanelLabel>
          <input
            autoFocus
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="e.g. About Us"
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 7,
              border: `1px solid ${C_BORDER}`,
              backgroundColor: '#ffffff',
              color: C_TEXT,
              fontFamily: FONT,
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 8,
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 6,
                border: 'none',
                background: C_COPPER,
                color: '#ffffff',
                fontFamily: FONT,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsAddingPage(false)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 6,
                border: `1px solid ${C_BORDER}`,
                background: '#ffffff',
                color: C_MUTED,
                fontFamily: FONT,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Pages list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {project.pages.map((page) => {
          const isActive = page.id === activePageId;
          const isHome = !!page.isHome;
          const pendingDelete = deleteConfirm === page.id;
          return (
            <div
              key={page.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 11px',
                borderRadius: 8,
                background: isActive ? C_COPPER_BG : '#ffffff',
                border: `1px solid ${isActive ? C_COPPER : C_BORDER}`,
                cursor: 'pointer',
              }}
              onClick={() => onSelectPage(page.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <FileText
                  size={13}
                  style={{ color: isActive ? C_COPPER : C_MUTED }}
                />
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: isActive ? C_COPPER : C_TEXT,
                    maxWidth: 110,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {page.name}
                </span>
                {isHome && (
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 10,
                      background: '#e6f4ea',
                      color: '#256d35',
                    }}
                  >
                    Home
                  </span>
                )}
              </div>
              {!isHome && !pendingDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(page.id);
                  }}
                  title="Delete page"
                  style={{
                    padding: 4,
                    borderRadius: 5,
                    border: 'none',
                    background: 'transparent',
                    color: C_MUTED,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              )}
              {pendingDelete && (
                <div
                  style={{ display: 'flex', gap: 4 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                      setDeleteConfirm(null);
                    }}
                    style={{
                      padding: '2px 6px',
                      borderRadius: 5,
                      border: 'none',
                      background: '#dc2626',
                      color: '#fff',
                      fontFamily: FONT,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(null);
                    }}
                    style={{
                      padding: '2px 6px',
                      borderRadius: 5,
                      border: `1px solid ${C_BORDER}`,
                      background: '#ffffff',
                      color: C_MUTED,
                      fontFamily: FONT,
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tab 3: Layers
const LayersPanel: React.FC<{
  activePage: WebsitePage | undefined;
  selectedSectionId?: string;
  onSelectSection: (id: string) => void;
  onMoveSectionUp: (id: string) => void;
  onMoveSectionDown: (id: string) => void;
}> = ({
  activePage,
  selectedSectionId,
  onSelectSection,
  onMoveSectionUp,
  onMoveSectionDown,
}) => {
  const sections = [...(activePage?.sections ?? [])].reverse();
  return (
    <div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.92rem',
          fontWeight: 800,
          color: C_TEXT,
          marginBottom: 14,
        }}
      >
        Layer Stack
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {sections.map((sec) => {
          const isSelected = selectedSectionId === sec.id;
          return (
            <div
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 8,
                background: isSelected ? C_COPPER_BG : '#ffffff',
                border: `1px solid ${isSelected ? C_COPPER : C_BORDER}`,
                cursor: 'pointer',
              }}
            >
              {/* Up/Down reorder */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSectionUp(sec.id);
                  }}
                  title="Move up"
                  style={{
                    padding: '1px 3px',
                    border: 'none',
                    background: 'transparent',
                    color: C_MUTED,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  <ChevronUp size={11} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSectionDown(sec.id);
                  }}
                  title="Move down"
                  style={{
                    padding: '1px 3px',
                    border: 'none',
                    background: 'transparent',
                    color: C_MUTED,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  <ChevronDown size={11} />
                </button>
              </div>

              {/* Eye toggle placeholder */}
              <Eye size={12} style={{ color: C_MUTED, flexShrink: 0 }} />

              {/* Section info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: isSelected ? C_COPPER : C_TEXT,
                    textTransform: 'capitalize',
                  }}
                >
                  {sec.type}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: '0.68rem',
                    color: C_MUTED,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sec.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tab 4: Assets
const AssetsPanel: React.FC<{
  onSelectImageForSection: (url: string) => void;
}> = ({ onSelectImageForSection }) => {
  const [customUrl, setCustomUrl] = useState('');
  return (
    <div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.92rem',
          fontWeight: 800,
          color: C_TEXT,
          marginBottom: 14,
        }}
      >
        Media Library
      </div>

      {/* Custom URL input */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <input
          type="url"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Paste image URL…"
          style={{
            flex: 1,
            padding: '7px 10px',
            borderRadius: 7,
            border: `1px solid ${C_BORDER}`,
            backgroundColor: C_INPUT_BG,
            color: C_TEXT,
            fontFamily: FONT,
            fontSize: '0.78rem',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = C_COPPER; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = C_BORDER; }}
        />
        <button
          onClick={() => {
            if (customUrl.trim()) {
              onSelectImageForSection(customUrl.trim());
              setCustomUrl('');
            }
          }}
          style={{
            padding: '7px 11px',
            borderRadius: 7,
            border: 'none',
            background: C_COPPER,
            color: '#ffffff',
            fontFamily: FONT,
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Use
        </button>
      </div>

      {/* Curated grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 7,
        }}
      >
        {CURATED_MEDIA_ASSETS.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onSelectImageForSection(asset.url)}
            title={asset.title}
            style={{
              aspectRatio: '4/3',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
              border: `1px solid ${C_BORDER}`,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 14px rgba(0,0,0,0.12)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            <img
              src={asset.thumbnail}
              alt={asset.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Tab 5: Theme
const ThemePanel: React.FC<{
  project: Project;
  onUpdateTheme: (updates: Partial<WebsiteTheme>) => void;
  onApplyThemePreset: (preset: WebsiteTheme) => void;
}> = ({ project, onUpdateTheme, onApplyThemePreset }) => {
  const { theme } = project;
  return (
    <div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.92rem',
          fontWeight: 800,
          color: C_TEXT,
          marginBottom: 14,
        }}
      >
        Global Theme
      </div>

      {/* Preset list */}
      <SectionDivider label="Presets" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 4 }}>
        {THEME_PRESETS.map((preset) => {
          const isActive = theme.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onApplyThemePreset(preset)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 11px',
                borderRadius: 8,
                border: `1px solid ${isActive ? C_COPPER : C_BORDER}`,
                background: isActive ? C_COPPER_BG : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: preset.primaryColor,
                  flexShrink: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}
              />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: isActive ? C_COPPER : C_TEXT,
                  flex: 1,
                }}
              >
                {preset.name}
              </span>
              {isActive && <Check size={13} style={{ color: C_COPPER }} />}
            </button>
          );
        })}
      </div>

      {/* Custom brand colors */}
      <SectionDivider label="Custom Colors" />
      {(
        [
          { key: 'primaryColor', label: 'Primary Accent' },
          { key: 'bgColor', label: 'Background' },
          { key: 'textColor', label: 'Text Color' },
        ] as const
      ).map(({ key, label }) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 9,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: C_TEXT,
            }}
          >
            {label}
          </span>
          <input
            type="color"
            value={theme[key]}
            onChange={(e) => onUpdateTheme({ [key]: e.target.value })}
            style={{
              width: 32,
              height: 26,
              border: `1px solid ${C_BORDER}`,
              borderRadius: 5,
              padding: 2,
              cursor: 'pointer',
              background: '#fff',
            }}
          />
        </div>
      ))}

      {/* Heading Font */}
      <SectionDivider label="Typography" />
      <PanelSelect
        label="Heading Font"
        value={theme.headingFont}
        onChange={(e) => onUpdateTheme({ headingFont: e.target.value })}
      >
        {HEADING_FONT_OPTIONS.map((f) => (
          <option key={f} value={f}>
            {f.split(',')[0]}
          </option>
        ))}
      </PanelSelect>

      {/* Button Style */}
      <SectionDivider label="Buttons & Shape" />
      <PanelLabel>Button Style</PanelLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          marginBottom: 12,
        }}
      >
        {(['rounded', 'pill', 'sharp', 'copperGlow'] as const).map((style) => {
          const isActive = theme.buttonStyle === style;
          return (
            <button
              key={style}
              onClick={() => onUpdateTheme({ buttonStyle: style })}
              style={{
                padding: '6px 0',
                borderRadius: 7,
                border: `1px solid ${isActive ? C_COPPER : C_BORDER}`,
                background: isActive ? C_COPPER_BG : '#ffffff',
                color: isActive ? C_COPPER : C_TEXT,
                fontFamily: FONT,
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {style}
            </button>
          );
        })}
      </div>

      {/* Border Radius */}
      <PanelLabel>Border Radius</PanelLabel>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 5,
        }}
      >
        {(
          [
            { label: 'SM', value: '4px' },
            { label: 'MD', value: '8px' },
            { label: 'LG', value: '16px' },
            { label: 'XL', value: '24px' },
          ] as const
        ).map(({ label, value }) => {
          const isActive = theme.borderRadius === value;
          return (
            <button
              key={value}
              onClick={() => onUpdateTheme({ borderRadius: value })}
              style={{
                padding: '5px 0',
                borderRadius: parseInt(value) > 12 ? 16 : 6,
                border: `1px solid ${isActive ? C_COPPER : C_BORDER}`,
                background: isActive ? C_COPPER_BG : '#ffffff',
                color: isActive ? C_COPPER : C_TEXT,
                fontFamily: FONT,
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Tab 6: Navbar
const NavbarPanel: React.FC<{
  project: Project;
  onUpdateNavigation: (updates: Partial<Project['navigation']>) => void;
}> = ({ project, onUpdateNavigation }) => (
  <div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: '0.92rem',
        fontWeight: 800,
        color: C_TEXT,
        marginBottom: 14,
      }}
    >
      Navbar Settings
    </div>
    <PanelInput
      label="Logo Text"
      type="text"
      value={project.navigation.logoText}
      onChange={(e) => onUpdateNavigation({ logoText: e.target.value })}
      placeholder="Your Brand"
    />
    <PanelInput
      label="Header CTA Text"
      type="text"
      value={project.navigation.ctaText}
      onChange={(e) => onUpdateNavigation({ ctaText: e.target.value })}
      placeholder="Get Started"
    />
    <PanelInput
      label="CTA URL"
      type="text"
      value={project.navigation.ctaUrl}
      onChange={(e) => onUpdateNavigation({ ctaUrl: e.target.value })}
      placeholder="#contact"
    />
  </div>
);

// Tab 7: Site Settings
const SiteSettingsPanel: React.FC<{
  project: Project;
  onUpdateSettings: (updates: Partial<Project['settings']>) => void;
}> = ({ project, onUpdateSettings }) => (
  <div>
    <div
      style={{
        fontFamily: FONT,
        fontSize: '0.92rem',
        fontWeight: 800,
        color: C_TEXT,
        marginBottom: 14,
      }}
    >
      Site Settings
    </div>
    <PanelInput
      label="Browser Title"
      type="text"
      value={project.settings.title}
      onChange={(e) => onUpdateSettings({ title: e.target.value })}
      placeholder="My Awesome Website"
    />
    <PanelTextarea
      label="Meta Description"
      value={project.settings.description}
      onChange={(e) => onUpdateSettings({ description: e.target.value })}
      placeholder="A brief description for search engines…"
      rows={3}
    />
    {/* Hosting info card */}
    <div
      style={{
        marginTop: 16,
        padding: '12px 14px',
        borderRadius: 10,
        background: 'linear-gradient(135deg, #f7f4ef 0%, #ede8df 100%)',
        border: `1px solid ${C_BORDER}`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.78rem',
          fontWeight: 800,
          color: C_COPPER,
          marginBottom: 4,
        }}
      >
        ☁️ MACSAC Hosting Ready
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.73rem',
          color: C_TEXT,
          lineHeight: 1.5,
        }}
      >
        Your site is ready for deployment on MACSAC NVMe cloud infrastructure
        with sub-12ms latency & automatic SSL. Export or Publish to go live.
      </div>
    </div>
  </div>
);

// Tab 8: Project
const ProjectPanel: React.FC<{
  project: Project;
  isSaving: boolean;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onPublish: () => void;
  onBackToGallery: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}> = ({ project, isSaving, onSave, onPreview, onExport, onPublish, onBackToGallery, currentUser, onOpenAuth }) => {
  const lastSaved = project.updatedAt
    ? (() => {
        const diff = Date.now() - project.updatedAt;
        if (diff < 60000) return 'just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return new Date(project.updatedAt).toLocaleDateString();
      })()
    : 'never';

  return (
    <div>
      {/* Project name (large) */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: '1.1rem',
          fontWeight: 900,
          color: C_TEXT,
          marginBottom: 4,
          wordBreak: 'break-word',
        }}
      >
        {project.name}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: '0.73rem',
          color: C_MUTED,
          marginBottom: 14,
        }}
      >
        Last saved: {lastSaved}
      </div>

      {/* User authentication account card */}
      {!currentUser ? (
        <div
          style={{
            background: 'rgba(177,112,78,0.08)',
            border: '1px solid rgba(177,112,78,0.25)',
            borderRadius: 8,
            padding: '12px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: '0.78rem', fontWeight: 700, color: C_TEXT, marginBottom: 4 }}>
            Sign In to Save Work
          </div>
          <div style={{ fontFamily: FONT, fontSize: '0.72rem', color: C_MUTED, lineHeight: 1.4, marginBottom: 10 }}>
            Sign in to preserve your customized website, export clean code, and access your projects anytime.
          </div>
          <button
            onClick={onOpenAuth}
            style={{
              width: '100%',
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: C_COPPER,
              color: '#ffffff',
              fontFamily: FONT,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Sign In / Register
          </button>
        </div>
      ) : (
        <div
          style={{
            background: '#f8f4ee',
            border: `1px solid ${C_BORDER}`,
            borderRadius: 8,
            padding: '10px 12px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: '0.78rem', fontWeight: 700, color: C_TEXT }}>
            {currentUser.fullName}
          </div>
          <div style={{ fontFamily: FONT, fontSize: '0.72rem', color: C_MUTED, marginTop: 2 }}>
            {currentUser.email}
          </div>
        </div>
      )}

      {/* Save status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          fontFamily: FONT,
          fontSize: '0.78rem',
          color: isSaving ? C_COPPER : '#2e7d32',
        }}
      >
        {isSaving ? (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C_COPPER,
                animation: 'macsac-pulse 1.2s infinite',
              }}
            />
            <Cloud size={13} />
            <span style={{ fontFamily: FONT }}>Saving…</span>
          </>
        ) : (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#4ade80',
              }}
            />
            <Cloud size={13} />
            <span style={{ fontFamily: FONT }}>All changes saved</span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: C_COPPER,
            color: '#ffffff',
            fontFamily: FONT,
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Save size={15} /> Save Project
        </button>

        <button
          onClick={onPreview}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 16px',
            borderRadius: 8,
            border: `1px solid ${C_BORDER}`,
            background: '#ffffff',
            color: C_TEXT,
            fontFamily: FONT,
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Eye size={15} /> Preview Site
        </button>

        <button
          onClick={onExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 16px',
            borderRadius: 8,
            border: `1px solid ${C_BORDER}`,
            background: '#ffffff',
            color: C_TEXT,
            fontFamily: FONT,
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={15} /> Export HTML
        </button>

        <button
          onClick={onPublish}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 16px',
            borderRadius: 8,
            border: `1px solid ${C_BORDER}`,
            background: '#ffffff',
            color: C_TEXT,
            fontFamily: FONT,
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Send size={15} /> Publish
        </button>

        <button
          onClick={onBackToGallery}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 16px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: C_MUTED,
            fontFamily: FONT,
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          <ArrowLeft size={13} /> Back to Templates
        </button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export const EditorLeftSidebar: React.FC<EditorLeftSidebarProps> = ({
  project,
  activePageId,
  onSelectPage,
  onAddPage,
  onRenamePage,
  onDeletePage,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onUpdateTheme,
  onApplyThemePreset,
  onUpdateNavigation,
  onUpdateSettings,
  onSelectImageForSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onDeleteSection,
  onDuplicateSection,
  isSaving,
  onSave,
  onPreview,
  onExport,
  onPublish,
  onBackToGallery,
  currentUser,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('sections');
  const [panelOpen, setPanelOpen] = useState(true);

  const activePage =
    project.pages.find((p) => p.id === activePageId) || project.pages[0];

  const navTabs: Array<{
    key: TabKey;
    label: string;
    Icon: React.ElementType;
  }> = [
    { key: 'sections', label: 'Sections', Icon: LayoutGrid },
    { key: 'pages', label: 'Pages', Icon: FileText },
    { key: 'layers', label: 'Layers', Icon: Layers },
    { key: 'assets', label: 'Assets', Icon: Image },
    { key: 'theme', label: 'Theme', Icon: Palette },
    { key: 'navbar', label: 'Navbar', Icon: Navigation },
    { key: 'settings', label: 'Site Settings', Icon: Settings },
    { key: 'project', label: 'Project', Icon: FolderGit2 },
  ];

  const handleTabClick = (key: TabKey) => {
    if (activeTab === key && panelOpen) {
      setPanelOpen(false);
    } else {
      setActiveTab(key);
      setPanelOpen(true);
    }
  };

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'sections':
        return (
          <SectionsPanel
            activePage={activePage}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
            onAddSection={onAddSection}
          />
        );
      case 'pages':
        return (
          <PagesPanel
            project={project}
            activePageId={activePageId}
            onSelectPage={onSelectPage}
            onAddPage={onAddPage}
            onDeletePage={onDeletePage}
          />
        );
      case 'layers':
        return (
          <LayersPanel
            activePage={activePage}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
            onMoveSectionUp={onMoveSectionUp}
            onMoveSectionDown={onMoveSectionDown}
          />
        );
      case 'assets':
        return (
          <AssetsPanel onSelectImageForSection={onSelectImageForSection} />
        );
      case 'theme':
        return (
          <ThemePanel
            project={project}
            onUpdateTheme={onUpdateTheme}
            onApplyThemePreset={onApplyThemePreset}
          />
        );
      case 'navbar':
        return (
          <NavbarPanel
            project={project}
            onUpdateNavigation={onUpdateNavigation}
          />
        );
      case 'settings':
        return (
          <SiteSettingsPanel
            project={project}
            onUpdateSettings={onUpdateSettings}
          />
        );
      case 'project':
        return (
          <ProjectPanel
            project={project}
            isSaving={isSaving}
            onSave={onSave}
            onPreview={onPreview}
            onExport={onExport}
            onPublish={onPublish}
            onBackToGallery={onBackToGallery}
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <aside
      style={{
        width: panelOpen ? 300 : 48,
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        backgroundColor: C_BG,
        borderRight: `1px solid ${C_BORDER}`,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.22s cubic-bezier(0.16,1,0.3,1)',
        zIndex: 20,
      }}
    >
      {/* ── Icon Rail (always visible 48px) ── */}
      <div
        style={{
          width: 48,
          flexShrink: 0,
          backgroundColor: C_RAIL,
          borderRight: panelOpen ? `1px solid ${C_BORDER}` : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10,
          gap: 4,
        }}
      >
        {navTabs.map(({ key, label, Icon }) => {
          const isActive = activeTab === key && panelOpen;
          return (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              title={label}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? C_COPPER_BG : 'transparent',
                color: isActive ? C_COPPER : C_MUTED,
                cursor: 'pointer',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#5a4a40';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.color = C_MUTED;
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              <Icon size={17} />
            </button>
          );
        })}
      </div>

      {/* ── Panel Area (252px) ── */}
      {panelOpen && (
        <div
          style={{
            width: 252,
            flexShrink: 0,
            height: '100%',
            overflowY: 'auto',
            padding: '16px 14px',
            backgroundColor: C_PANEL_BG,
            boxSizing: 'border-box',
          }}
        >
          {renderPanelContent()}
        </div>
      )}
    </aside>
  );
};
