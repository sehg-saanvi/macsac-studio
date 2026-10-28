import React from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  DownloadCloud,
  Send,
  Check,
} from 'lucide-react';
import { ViewportMode } from '../types';

interface EditorTopBarProps {
  projectName: string;
  onRenameProject: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  viewport: ViewportMode;
  onChangeViewport: (mode: ViewportMode) => void;
  onPreview: () => void;
  onSave: () => void;
  isSaving: boolean;
  onExport: () => void;
  onPublish: () => void;
  onBackToGallery: () => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
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
}) => {
  return (
    <header
      style={{
        height: 60,
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Back & Project Title & Undo/Redo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onBackToGallery}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
          title="Return to Template Gallery"
        >
          <ArrowLeft size={15} /> Templates
        </button>

        {/* Project Name Editable Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onRenameProject(e.target.value)}
            style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: 6,
              padding: '4px 8px',
              maxWidth: 220,
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--copper-medium)';
              e.target.style.background = 'var(--bg-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'transparent';
              e.target.style.background = 'transparent';
            }}
            title="Click to rename project"
          />
        </div>

        {/* Undo and Redo buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              color: canUndo ? 'var(--text-primary)' : 'var(--text-muted)',
              opacity: canUndo ? 1 : 0.4,
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              color: canRedo ? 'var(--text-primary)' : 'var(--text-muted)',
              opacity: canRedo ? 1 : 0.4,
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>
      </div>

      {/* Center: Device Viewport Controls */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          borderRadius: 8,
          padding: 3,
          border: '1px solid var(--border-color)',
        }}
      >
        <button
          onClick={() => onChangeViewport('desktop')}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            background: viewport === 'desktop' ? 'var(--bg-card)' : 'transparent',
            color: viewport === 'desktop' ? 'var(--copper-medium)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: viewport === 'desktop' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
          }}
          title="Desktop Canvas"
        >
          <Monitor size={14} /> Desktop
        </button>
        <button
          onClick={() => onChangeViewport('tablet')}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            background: viewport === 'tablet' ? 'var(--bg-card)' : 'transparent',
            color: viewport === 'tablet' ? 'var(--copper-medium)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: viewport === 'tablet' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
          }}
          title="Tablet Canvas (768px)"
        >
          <Tablet size={14} /> Tablet
        </button>
        <button
          onClick={() => onChangeViewport('mobile')}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            background: viewport === 'mobile' ? 'var(--bg-card)' : 'transparent',
            color: viewport === 'mobile' ? 'var(--copper-medium)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: viewport === 'mobile' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
          }}
          title="Mobile Canvas (390px)"
        >
          <Smartphone size={14} /> Mobile
        </button>
      </div>

      {/* Right: Actions (Preview, Save, Export, Publish) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Fullscreen Preview */}
        <button
          onClick={onPreview}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--text-primary)',
            fontSize: '0.84rem',
            fontWeight: 600,
            padding: '7px 14px',
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
          title="Open interactive preview modal"
        >
          <Eye size={15} /> Preview
        </button>

        {/* Save Project */}
        <button
          onClick={onSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: isSaving ? 'var(--copper-medium)' : 'var(--text-primary)',
            fontSize: '0.84rem',
            fontWeight: 600,
            padding: '7px 14px',
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
          }}
          title="Save project to browser storage"
        >
          {isSaving ? <Check size={15} style={{ color: '#16a34a' }} /> : <Save size={15} />}
          {isSaving ? 'Saved!' : 'Save'}
        </button>

        {/* Export Website Code */}
        <button
          onClick={onExport}
          className="btn-primary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 16px',
            fontSize: '0.84rem',
          }}
          title="Export production-ready HTML, CSS, and JS"
        >
          <DownloadCloud size={15} /> Export Website
        </button>

        {/* Publish Simulator */}
        <button
          onClick={onPublish}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 600,
            padding: '7px 16px',
            borderRadius: 6,
            background: '#047857',
          }}
          title="Publish or simulate live deployment"
        >
          <Send size={14} /> Publish
        </button>
      </div>
    </header>
  );
};
