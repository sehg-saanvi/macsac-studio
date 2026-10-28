import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  MousePointerClick,
  Plus,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
} from 'lucide-react';
import { WebsiteSection, SectionItem } from '../types';

interface EditorRightSidebarProps {
  section: WebsiteSection | null;
  onUpdateSection: (updates: Partial<WebsiteSection>) => void;
  onUpdateItem: (itemId: string, updates: Partial<SectionItem>) => void;
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
  onMoveSectionUp?: () => void;
  onMoveSectionDown?: () => void;
  onDuplicateSection?: () => void;
  onDeleteSection?: () => void;
  // For empty state page info
  pageName?: string;
  sectionCount?: number;
}

// ─── Styling helpers ───────────────────────────────────────────
const inter = "'Inter', sans-serif";

const inputStyle: React.CSSProperties = {
  padding: '7px 10px',
  borderRadius: 6,
  border: '1px solid #e0d4c8',
  background: '#f6f2eb',
  color: '#2d2622',
  fontFamily: inter,
  fontSize: '0.84rem',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.74rem',
  fontWeight: 600,
  color: '#7a6a60',
  display: 'block',
  marginBottom: 4,
  fontFamily: inter,
};

const fieldWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 10,
};

// ─── Accordion Panel ──────────────────────────────────────────
interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: '9px 12px',
          background: '#f0ebe3',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: open ? 8 : 1,
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: '0.82rem',
            color: '#3d2e28',
            fontFamily: inter,
          }}
        >
          {title}
        </span>
        {open ? <ChevronUp size={14} color="#7a6a60" /> : <ChevronDown size={14} color="#7a6a60" />}
      </div>
      {open && (
        <div style={{ paddingLeft: 2, paddingRight: 2 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Item Row ─────────────────────────────────────────────────
interface ItemRowProps {
  item: SectionItem;
  index: number;
  sectionType: string;
  onUpdateItem: (id: string, updates: Partial<SectionItem>) => void;
  onDeleteItem: (id: string) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, index, sectionType, onUpdateItem, onDeleteItem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid #e0d4c8',
        borderRadius: 8,
        marginBottom: 6,
        background: '#f9f6f1',
        overflow: 'hidden',
      }}
    >
      {/* Item header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 10px',
          cursor: 'pointer',
          background: open ? '#f0ebe3' : 'transparent',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3d2e28', fontFamily: inter }}>
          {item.title || `Item #${index + 1}`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
            style={{ color: '#ef4444', padding: 2, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
            title="Delete item"
          >
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={13} color="#7a6a60" /> : <ChevronDown size={13} color="#7a6a60" />}
        </div>
      </div>

      {open && (
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => onUpdateItem(item.id, { title: e.target.value })}
              placeholder="Item title"
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea
              rows={2}
              value={item.description || ''}
              onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
              placeholder="Item description"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Subtitle</label>
            <input
              type="text"
              value={item.subtitle || ''}
              onChange={(e) => onUpdateItem(item.id, { subtitle: e.target.value })}
              placeholder="Subtitle"
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Tag</label>
            <input
              type="text"
              value={item.tag || ''}
              onChange={(e) => onUpdateItem(item.id, { tag: e.target.value })}
              placeholder="e.g. NEW"
              style={{ ...inputStyle, fontSize: '0.78rem' }}
            />
          </div>
          {sectionType === 'pricing' && (
            <div style={fieldWrap}>
              <label style={labelStyle}>Price</label>
              <input
                type="text"
                value={item.price || ''}
                onChange={(e) => onUpdateItem(item.id, { price: e.target.value })}
                placeholder="e.g. $99/mo"
                style={inputStyle}
              />
            </div>
          )}
          <div style={fieldWrap}>
            <label style={labelStyle}>Image URL</label>
            <input
              type="url"
              value={item.image || ''}
              onChange={(e) => onUpdateItem(item.id, { image: e.target.value })}
              placeholder="https://..."
              style={inputStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────
export const EditorRightSidebar: React.FC<EditorRightSidebarProps> = ({
  section,
  onUpdateSection,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onMoveSectionUp,
  onMoveSectionDown,
  onDuplicateSection,
  onDeleteSection,
  pageName,
  sectionCount,
}) => {
  const sidebarStyle: React.CSSProperties = {
    width: 288,
    minWidth: 288,
    height: '100%',
    backgroundColor: '#faf9f7',
    borderLeft: '1px solid #e8ddd4',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: inter,
    flexShrink: 0,
  };

  // ── Empty state ──
  if (!section) {
    return (
      <aside style={sidebarStyle}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#f0ebe3',
              color: '#b87333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <MousePointerClick size={24} />
          </div>
          <h4
            style={{
              fontSize: '0.98rem',
              fontWeight: 700,
              color: '#2d2622',
              marginBottom: 8,
              fontFamily: inter,
            }}
          >
            Select a Section
          </h4>
          <p
            style={{
              fontSize: '0.82rem',
              color: '#7a6a60',
              lineHeight: 1.55,
              marginBottom: 20,
              fontFamily: inter,
            }}
          >
            Click any section in the canvas to inspect and customize its content, images, buttons, and items.
          </p>
          {/* Global page info */}
          {pageName && (
            <div
              style={{
                background: '#f0ebe3',
                borderRadius: 8,
                padding: '10px 14px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#7a6a60', fontWeight: 600, marginBottom: 4 }}>
                CURRENT PAGE
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2d2622', marginBottom: 4 }}>
                {pageName}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#9a8a80' }}>
                {sectionCount ?? 0} section{(sectionCount ?? 0) !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Derived helpers
  const hasImage =
    section.image !== undefined ||
    section.type === 'hero' ||
    section.type === 'about';

  const itemSectionTypes = ['services', 'features', 'portfolio', 'testimonials', 'team', 'pricing', 'faq'];
  const hasItems =
    (section.items && section.items.length > 0) ||
    itemSectionTypes.includes(section.type);

  const iconBtn = (handler?: () => void, icon?: React.ReactNode, danger?: boolean, title?: string) => (
    <button
      onClick={handler}
      disabled={!handler}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 8px',
        borderRadius: 5,
        border: '1px solid ' + (danger ? '#fca5a5' : '#e0d4c8'),
        background: danger ? '#fee2e2' : '#f0ebe3',
        color: danger ? '#ef4444' : '#7a6a60',
        cursor: handler ? 'pointer' : 'not-allowed',
        opacity: handler ? 1 : 0.4,
      }}
    >
      {icon}
    </button>
  );

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'auto' as any,
  };

  return (
    <aside style={sidebarStyle}>
      {/* ── Section Controls Bar (pinned, not scrollable) ── */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #e8ddd4',
          background: '#f0ebe3',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#b87333',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontFamily: inter,
          }}
        >
          {section.type}
        </span>
        {iconBtn(onMoveSectionUp, <ChevronUp size={14} />, false, 'Move Up')}
        {iconBtn(onMoveSectionDown, <ChevronDown size={14} />, false, 'Move Down')}
        {iconBtn(onDuplicateSection, <Copy size={14} />, false, 'Duplicate')}
        {iconBtn(onDeleteSection, <Trash2 size={14} />, true, 'Delete Section')}
      </div>

      {/* ── Scrollable content ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 16px',
        }}
      >
        {/* ── Panel 1: Section Info ── */}
        <Accordion title="Section Info" defaultOpen>
          {/* Section type badge */}
          <div style={{ marginBottom: 10 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(184,115,51,0.12)',
                color: '#b87333',
                border: '1px solid rgba(184,115,51,0.3)',
                borderRadius: 999,
                padding: '2px 10px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: inter,
              }}
            >
              {section.type}
            </span>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdateSection({ title: e.target.value })}
              placeholder="Section heading"
              style={{ ...inputStyle, fontWeight: 600, fontSize: '0.88rem' }}
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Subtitle</label>
            <input
              type="text"
              value={section.subtitle || ''}
              onChange={(e) => onUpdateSection({ subtitle: e.target.value })}
              placeholder="Section subtitle"
              style={inputStyle}
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Badge / Eyebrow</label>
            <input
              type="text"
              value={section.badge || ''}
              onChange={(e) => onUpdateSection({ badge: e.target.value })}
              placeholder="e.g. FEATURED"
              style={{ ...inputStyle, fontSize: '0.78rem' }}
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description</label>
            <textarea
              rows={3}
              value={section.description || ''}
              onChange={(e) => onUpdateSection({ description: e.target.value })}
              placeholder="Section description paragraph"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Background Variant</label>
            <select
              value={section.bgVariant || 'default'}
              onChange={(e) =>
                onUpdateSection({
                  bgVariant: e.target.value as WebsiteSection['bgVariant'],
                })
              }
              style={selectStyle}
            >
              <option value="default">Default</option>
              <option value="card">Card</option>
              <option value="muted">Muted</option>
              <option value="accent">Accent</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Padding Y</label>
            <select
              value={section.paddingY || 'normal'}
              onChange={(e) =>
                onUpdateSection({
                  paddingY: e.target.value as WebsiteSection['paddingY'],
                })
              }
              style={selectStyle}
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Text Align</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['left', 'center'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdateSection({ textAlign: align })}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    borderRadius: 6,
                    border:
                      section.textAlign === align
                        ? '1px solid #b87333'
                        : '1px solid #e0d4c8',
                    background:
                      section.textAlign === align
                        ? 'rgba(184,115,51,0.15)'
                        : '#f6f2eb',
                    color: section.textAlign === align ? '#b87333' : '#7a6a60',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    fontFamily: inter,
                    cursor: 'pointer',
                  }}
                >
                  {align === 'left' ? <AlignLeft size={13} /> : <AlignCenter size={13} />}
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Layout Variant</label>
            <select
              value={section.layoutVariant || 'centered'}
              onChange={(e) =>
                onUpdateSection({
                  layoutVariant: e.target.value as WebsiteSection['layoutVariant'],
                })
              }
              style={selectStyle}
            >
              <option value="centered">Centered</option>
              <option value="split">Split</option>
              <option value="grid">Grid</option>
              <option value="cards">Cards</option>
              <option value="minimal">Minimal</option>
              <option value="masonry">Masonry</option>
              <option value="banner">Banner</option>
            </select>
          </div>
        </Accordion>

        {/* ── Panel 2: Primary Button ── */}
        <Accordion title="Primary Button">
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#7a6a60',
                cursor: 'pointer',
                fontFamily: inter,
              }}
            >
              <input
                type="checkbox"
                checked={section.primaryBtn?.show ?? false}
                onChange={(e) =>
                  onUpdateSection({
                    primaryBtn: {
                      text: section.primaryBtn?.text || 'Explore More',
                      url: section.primaryBtn?.url || '#',
                      show: e.target.checked,
                    },
                  })
                }
              />
              Show Primary Action Button
            </label>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Button Text</label>
            <input
              type="text"
              value={section.primaryBtn?.text || ''}
              onChange={(e) =>
                onUpdateSection({
                  primaryBtn: {
                    text: e.target.value,
                    url: section.primaryBtn?.url || '#',
                    show: section.primaryBtn?.show ?? false,
                  },
                })
              }
              placeholder="e.g. Get Started"
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>URL / Destination</label>
            <input
              type="text"
              value={section.primaryBtn?.url || ''}
              onChange={(e) =>
                onUpdateSection({
                  primaryBtn: {
                    text: section.primaryBtn?.text || 'Get Started',
                    url: e.target.value,
                    show: section.primaryBtn?.show ?? false,
                  },
                })
              }
              placeholder="#contact"
              style={inputStyle}
            />
          </div>
        </Accordion>

        {/* ── Panel 3: Secondary Button ── */}
        <Accordion title="Secondary Button">
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#7a6a60',
                cursor: 'pointer',
                fontFamily: inter,
              }}
            >
              <input
                type="checkbox"
                checked={section.secondaryBtn?.show ?? false}
                onChange={(e) =>
                  onUpdateSection({
                    secondaryBtn: {
                      text: section.secondaryBtn?.text || 'Learn More',
                      url: section.secondaryBtn?.url || '#',
                      show: e.target.checked,
                    },
                  })
                }
              />
              Show Secondary Button
            </label>
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Button Text</label>
            <input
              type="text"
              value={section.secondaryBtn?.text || ''}
              onChange={(e) =>
                onUpdateSection({
                  secondaryBtn: {
                    text: e.target.value,
                    url: section.secondaryBtn?.url || '#',
                    show: section.secondaryBtn?.show ?? false,
                  },
                })
              }
              placeholder="e.g. Learn More"
              style={inputStyle}
            />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>URL / Destination</label>
            <input
              type="text"
              value={section.secondaryBtn?.url || ''}
              onChange={(e) =>
                onUpdateSection({
                  secondaryBtn: {
                    text: section.secondaryBtn?.text || 'Learn More',
                    url: e.target.value,
                    show: section.secondaryBtn?.show ?? false,
                  },
                })
              }
              placeholder="#about"
              style={inputStyle}
            />
          </div>
        </Accordion>

        {/* ── Panel 4: Hero Image (conditional) ── */}
        {hasImage && (
          <Accordion title="Hero Image">
            {section.image && (
              <div style={{ marginBottom: 10 }}>
                <img
                  src={section.image}
                  alt={section.imageAlt || 'Section image'}
                  style={{
                    width: 80,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #e0d4c8',
                  }}
                />
              </div>
            )}
            <div style={fieldWrap}>
              <label style={labelStyle}>Image URL</label>
              <input
                type="url"
                value={section.image || ''}
                onChange={(e) => onUpdateSection({ image: e.target.value })}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Alt Text</label>
              <input
                type="text"
                value={section.imageAlt || ''}
                onChange={(e) => onUpdateSection({ imageAlt: e.target.value })}
                placeholder="Describe the image"
                style={inputStyle}
              />
            </div>
            <button
              onClick={() => {
                const url = window.prompt('Enter new image URL:');
                if (url) onUpdateSection({ image: url });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 6,
                border: '1px solid #e0d4c8',
                background: '#f0ebe3',
                color: '#7a6a60',
                fontSize: '0.78rem',
                fontWeight: 600,
                fontFamily: inter,
                cursor: 'pointer',
                marginBottom: 4,
              }}
            >
              <ImageIcon size={13} />
              Replace Image
            </button>
          </Accordion>
        )}

        {/* ── Panel 5: Section Items (conditional) ── */}
        {hasItems && (
          <Accordion title={`Content Items (${section.items?.length ?? 0})`}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 8,
              }}
            >
              <button
                onClick={onAddItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#b87333',
                  background: 'rgba(184,115,51,0.1)',
                  border: '1px solid rgba(184,115,51,0.3)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontFamily: inter,
                }}
              >
                <Plus size={12} />
                Add Item
              </button>
            </div>
            {(section.items || []).map((item, idx) => (
              <ItemRow
                key={item.id}
                item={item}
                index={idx}
                sectionType={section.type}
                onUpdateItem={onUpdateItem}
                onDeleteItem={onDeleteItem}
              />
            ))}
            {(!section.items || section.items.length === 0) && (
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#9a8a80',
                  fontFamily: inter,
                  textAlign: 'center',
                  padding: '8px 0',
                }}
              >
                No items yet. Click "+ Add Item" to add one.
              </p>
            )}
          </Accordion>
        )}
      </div>
    </aside>
  );
};
