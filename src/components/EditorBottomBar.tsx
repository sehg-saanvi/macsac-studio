import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Download,
  Send,
  Cloud,
} from 'lucide-react';

import { UserAccount } from '../types';

interface EditorBottomBarProps {
  projectName: string;
  onRenameProject: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onChangeViewport: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onPreview: () => void;
  onSave: () => void;
  isSaving: boolean;
  onExport: () => void;
  onPublish: () => void;
  onBackToGallery: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

const FONT = "'Inter', sans-serif";
const COLOR_TEXT = '#f5f0eb';
const COLOR_MUTED = '#a09080';
const COLOR_COPPER = '#b1704e';
const COLOR_BG = '#1a1614';
const COLOR_BORDER = '#2d2420';
const COLOR_DIVIDER = '#3a3028';

const Divider: React.FC = () => (
  <div
    style={{
      width: 1,
      height: 24,
      backgroundColor: COLOR_DIVIDER,
      flexShrink: 0,
    }}
  />
);

const IconBtn: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ onClick, disabled, title, children, style }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 8px',
      borderRadius: 6,
      border: 'none',
      background: 'transparent',
      color: disabled ? COLOR_MUTED : COLOR_TEXT,
      opacity: disabled ? 0.35 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.15s ease, color 0.15s ease',
      fontFamily: FONT,
      ...style,
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
      }
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
    }}
  >
    {children}
  </button>
);

export const EditorBottomBar: React.FC<EditorBottomBarProps> = ({
  projectName,
  onRenameProject,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewport,
  onChangeViewport,
  onPreview,
  onSave,
  isSaving,
  onExport,
  onPublish,
  onBackToGallery,
  currentUser,
  onOpenAuth,
}) => {
  const [nameInputFocused, setNameInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const deviceOptions: Array<{
    mode: 'desktop' | 'tablet' | 'mobile';
    Icon: React.ElementType;
    label: string;
  }> = [
    { mode: 'desktop', Icon: Monitor, label: 'Desktop' },
    { mode: 'tablet', Icon: Tablet, label: 'Tablet (768px)' },
    { mode: 'mobile', Icon: Smartphone, label: 'Mobile (390px)' },
  ];

  return (
    <div
      id="macsac-editor-bottombar"
      style={{
        height: 48,
        backgroundColor: COLOR_BG,
        borderTop: `1px solid ${COLOR_BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        flexShrink: 0,
        zIndex: 50,
        userSelect: 'none',
      }}
    >
      {/* ── LEFT GROUP ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: '0 0 auto' }}>
        {/* Back button */}
        <button
          onClick={onBackToGallery}
          title="Return to Template Gallery"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: COLOR_MUTED,
            fontSize: '0.78rem',
            fontWeight: 600,
            fontFamily: FONT,
            padding: '5px 10px',
            borderRadius: 6,
            border: `1px solid ${COLOR_DIVIDER}`,
            background: 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = COLOR_TEXT;
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#5a4a40';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = COLOR_MUTED;
            (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR_DIVIDER;
          }}
        >
          <ArrowLeft size={13} />
          <span style={{ fontFamily: FONT, color: 'inherit' }}>Templates</span>
        </button>

        <Divider />

        {/* Project name editable input */}
        <input
          ref={inputRef}
          type="text"
          value={projectName}
          onChange={(e) => onRenameProject(e.target.value)}
          onFocus={() => setNameInputFocused(true)}
          onBlur={() => setNameInputFocused(false)}
          title="Click to rename project"
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: '0.875rem',
            color: COLOR_TEXT,
            background: nameInputFocused ? 'rgba(177,112,78,0.08)' : 'transparent',
            border: nameInputFocused
              ? `1px solid ${COLOR_COPPER}`
              : '1px solid transparent',
            borderRadius: 6,
            padding: '4px 8px',
            maxWidth: 200,
            outline: 'none',
            transition: 'border-color 0.2s ease, background 0.2s ease',
          }}
        />
      </div>

      {/* ── CENTER GROUP ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
        {/* Save status */}
        {!currentUser ? (
          <button
            onClick={onOpenAuth}
            title="Sign in to save your customized website and keep progress"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.76rem',
              fontWeight: 600,
              fontFamily: FONT,
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245, 158, 11, 0.22)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245, 158, 11, 0.12)';
            }}
          >
            <Cloud size={13} />
            <span>Sign in to save</span>
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.78rem',
              fontFamily: FONT,
              color: isSaving ? COLOR_COPPER : '#5a9a70',
              whiteSpace: 'nowrap',
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
                    background: COLOR_COPPER,
                    boxShadow: `0 0 0 2px rgba(177,112,78,0.25)`,
                    animation: 'macsac-pulse 1.2s ease-in-out infinite',
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
                    boxShadow: '0 0 0 2px rgba(74,222,128,0.2)',
                  }}
                />
                <Cloud size={13} />
                <span style={{ fontFamily: FONT }}>
                  Saved to {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'account'}
                </span>
              </>
            )}
          </div>
        )}

        <Divider />

        {/* Undo */}
        <IconBtn onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          <Undo2 size={15} />
        </IconBtn>

        {/* Redo */}
        <IconBtn onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
          <Redo2 size={15} />
        </IconBtn>
      </div>

      {/* ── RIGHT GROUP ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        {/* Device picker pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 22,
            padding: '3px 4px',
            border: `1px solid ${COLOR_DIVIDER}`,
          }}
        >
          {deviceOptions.map(({ mode, Icon, label }) => {
            const isActive = viewport === mode;
            return (
              <button
                key={mode}
                onClick={() => onChangeViewport(mode)}
                title={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 9px',
                  borderRadius: 20,
                  border: 'none',
                  background: isActive ? COLOR_COPPER : 'transparent',
                  color: isActive ? '#ffffff' : COLOR_MUTED,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, color 0.2s ease',
                  fontFamily: FONT,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = COLOR_TEXT;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = COLOR_MUTED;
                  }
                }}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        <Divider />

        {/* Preview */}
        <IconBtn onClick={onPreview} title="Preview website (Fullscreen)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Eye size={14} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'inherit',
              }}
            >
              Preview
            </span>
          </div>
        </IconBtn>

        {/* Export */}
        <button
          onClick={onExport}
          title="Export production-ready HTML/CSS files"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 11px',
            borderRadius: 6,
            border: `1px solid ${COLOR_DIVIDER}`,
            background: 'transparent',
            color: COLOR_TEXT,
            fontFamily: FONT,
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 0.15s ease, background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#5a4a40';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = COLOR_DIVIDER;
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <Download size={13} />
          <span style={{ fontFamily: FONT }}>Export</span>
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          title="Publish / simulate live deployment"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 13px',
            borderRadius: 6,
            border: 'none',
            background: COLOR_COPPER,
            color: '#ffffff',
            fontFamily: FONT,
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = 'none';
          }}
        >
          <Send size={13} />
          <span style={{ fontFamily: FONT }}>Publish</span>
        </button>
      </div>

      {/* Pulse keyframe injected inline */}
      <style>{`
        @keyframes macsac-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
