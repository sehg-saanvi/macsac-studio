import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Save,
  Download,
  Layers,
  PlusSquare,
  Palette,
  Image as ImageIcon,
  Sliders,
  Settings2,
  Upload,
  Check,
  FileCode,
  Info,
} from 'lucide-react';
import { Project, ViewportMode, WebsiteTheme, WebsitePage } from '../types';
import { MACSAC_GRAPES_BLOCKS } from '../utils/grapesBlocks';
import { generateStyleCss, renderSectionToHtml } from '../utils/exportGenerator';
import { saveProject } from '../utils/storage';
import { THEME_PRESETS } from '../data/themePresets';
import { CURATED_MEDIA_ASSETS } from '../data/mediaAssets';

function buildNavHtml(project: Project, activePage: WebsitePage): string {
  return `<header class="site-header">
  <div class="nav-container">
    <a href="index.html" class="logo-wrapper" style="display:flex;align-items:center;gap:10px;">
      ${
        project.navigation.logoImage
          ? `<img src="${project.navigation.logoImage}" alt="${project.navigation.logoText || project.name}" style="max-height:36px;max-width:120px;object-fit:contain;">`
          : ''
      }
      <span class="brand-logo-text">${project.navigation.logoText || project.name}</span>
    </a>
    <nav class="nav-desktop">
      <ul class="nav-menu">
        ${project.pages
          .map(
            (p) =>
              `<li class="nav-item ${p.id === activePage.id ? 'active' : ''}"><a href="#">${p.name}</a></li>`
          )
          .join('')}
      </ul>
    </nav>
    <div class="nav-actions">
      ${
        project.navigation.ctaText
          ? `<a href="${project.navigation.ctaUrl || '#contact'}" class="btn btn-primary nav-cta">${project.navigation.ctaText}</a>`
          : ''
      }
    </div>
  </div>
</header>`;
}

function buildFooterHtml(project: Project): string {
  return `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-top">
      <div class="footer-brand">
        <h3 class="footer-title">${project.footer.brandName || project.name}</h3>
        <p class="footer-tagline">${project.footer.tagline || 'Engineered with MACSAC Studio.'}</p>
      </div>
      <div class="footer-links">
        ${project.pages.map((p) => `<a href="#">${p.name}</a>`).join('')}
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copyright">${project.footer.copyright || `© ${new Date().getFullYear()} ${project.name}. All rights reserved.`}</p>
      <p class="footer-credit">Built with <a href="https://macsacmultimedia.com" target="_blank" rel="noopener">MACSAC Multimedia</a></p>
    </div>
  </div>
</footer>`;
}

function buildFullPageHtml(project: Project, page: WebsitePage): string {
  const navHtml = buildNavHtml(project, page);
  const sectionsHtml = page.sections
    .map((s) => renderSectionToHtml(s, project.theme))
    .join('\n\n');
  const footerHtml = buildFooterHtml(project);
  return `${navHtml}\n<main class="page-content">\n${sectionsHtml}\n</main>\n${footerHtml}`;
}

interface GrapesEditorProps {
  initialProject: Project;
  onBackToGallery: () => void;
  onPreview: (project: Project) => void;
  onExport: (project: Project) => void;
}

type LeftSidebarTab = 'blocks' | 'layers' | 'pages' | 'theme' | 'media';
type RightSidebarTab = 'styles' | 'traits';

export const GrapesEditor: React.FC<GrapesEditorProps> = ({
  initialProject,
  onBackToGallery,
  onPreview,
  onExport,
}) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [leftTab, setLeftTab] = useState<LeftSidebarTab>('blocks');
  const [rightTab, setRightTab] = useState<RightSidebarTab>('styles');
  const [selectedElementTag, setSelectedElementTag] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // References
  const editorRef = useRef<Editor | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const blocksContainerRef = useRef<HTMLDivElement>(null);
  const stylesContainerRef = useRef<HTMLDivElement>(null);
  const layersContainerRef = useRef<HTMLDivElement>(null);
  const traitsContainerRef = useRef<HTMLDivElement>(null);

  // Initialize GrapesJS Core
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    // Build initial HTML and CSS
    const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];
    const fullInitialHtml = activePage.grapesHtml || project.grapesHtml || buildFullPageHtml(project, activePage);
    const fullInitialCss = project.grapesCss || generateStyleCss(project.theme);

    // Initialize GrapesJS Core Editor instance
    const editor = grapesjs.init({
      container: canvasContainerRef.current,
      fromElement: false,
      height: '100%',
      width: 'auto',
      storageManager: false, // We control persistence through React state and localStorage
      panels: { defaults: [] }, // Custom MACSAC Studio UI controls
      blockManager: {
        appendTo: blocksContainerRef.current || undefined,
        blocks: [],
      },
      styleManager: {
        appendTo: stylesContainerRef.current || undefined,
        sectors: [
          {
            name: 'Typography',
            open: true,
            buildProps: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'line-height',
              'text-align',
              'text-decoration',
            ],
          },
          {
            name: 'Dimensions & Spacing',
            open: true,
            buildProps: [
              'width',
              'max-width',
              'min-height',
              'margin',
              'margin-top',
              'margin-bottom',
              'padding',
              'padding-top',
              'padding-bottom',
            ],
          },
          {
            name: 'Colors & Backgrounds',
            open: false,
            buildProps: ['background-color', 'background-image', 'opacity'],
          },
          {
            name: 'Borders & Shadows',
            open: false,
            buildProps: [
              'border',
              'border-radius',
              'box-shadow',
            ],
          },
          {
            name: 'Layout & Flexbox',
            open: false,
            buildProps: [
              'display',
              'flex-direction',
              'justify-content',
              'align-items',
              'gap',
            ],
          },
        ],
      },
      layerManager: {
        appendTo: layersContainerRef.current || undefined,
      },
      traitManager: {
        appendTo: traitsContainerRef.current || undefined,
      },
      deviceManager: {
        devices: [
          { id: 'desktop', name: 'Desktop', width: '' },
          { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
          { id: 'mobile', name: 'Mobile', width: '375px', widthMedia: '480px' },
        ],
      },
      assetManager: {
        upload: false,
        embedAsBase64: true,
        assets: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542744094-3a31727221eb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        ],
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@600;700;800&display=swap',
        ],
      },
    });

    // Register all custom MACSAC Studio blocks
    MACSAC_GRAPES_BLOCKS.forEach((block) => {
      editor.Blocks.add(block.id, {
        label: block.label,
        category: block.category,
        content: block.content,
        media: block.media,
      });
    });

    // Load project data or initial HTML/CSS
    if (project.grapesData) {
      editor.loadProjectData(project.grapesData);
    } else {
      editor.setComponents(fullInitialHtml);
      editor.setStyle(fullInitialCss);
    }

    // Attach listeners for element selection, undo/redo state
    const updateUndoRedo = () => {
      setCanUndo(editor.UndoManager.hasUndo());
      setCanRedo(editor.UndoManager.hasRedo());
    };

    editor.on('update', updateUndoRedo);
    editor.on('component:selected', (model) => {
      if (model) {
        setSelectedElementTag(model.get('tagName')?.toUpperCase() || 'ELEMENT');
      } else {
        setSelectedElementTag(null);
      }
    });

    editor.on('component:deselected', () => {
      setSelectedElementTag(null);
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Update canvas device viewport
  const handleChangeViewport = (mode: ViewportMode) => {
    setViewport(mode);
    if (editorRef.current) {
      editorRef.current.setDevice(mode);
    }
  };

  // Undo and Redo actions
  const handleUndo = () => {
    if (editorRef.current && editorRef.current.UndoManager.hasUndo()) {
      editorRef.current.UndoManager.undo();
      setCanUndo(editorRef.current.UndoManager.hasUndo());
      setCanRedo(editorRef.current.UndoManager.hasRedo());
    }
  };

  const handleRedo = () => {
    if (editorRef.current && editorRef.current.UndoManager.hasRedo()) {
      editorRef.current.UndoManager.redo();
      setCanUndo(editorRef.current.UndoManager.hasUndo());
      setCanRedo(editorRef.current.UndoManager.hasRedo());
    }
  };

  // Save Project to local storage
  const handleSave = () => {
    if (!editorRef.current) return;
    setIsSaving(true);

    const grapesData = editorRef.current.getProjectData();
    const grapesHtml = editorRef.current.getHtml();
    const grapesCss = editorRef.current.getCss();

    const isHome =
      project.activePageId === project.pages[0]?.id ||
      Boolean(project.pages.find((p) => p.id === project.activePageId)?.isHome);

    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return { ...p, grapesHtml, grapesData };
      }
      return p;
    });

    const updated: Project = {
      ...project,
      pages: updatedPages,
      grapesData: isHome ? grapesData : project.grapesData,
      grapesHtml: isHome ? grapesHtml : project.grapesHtml,
      grapesCss,
      updatedAt: Date.now(),
    };

    setProject(updated);
    saveProject(updated);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 400);
  };

  // Trigger Export
  const handleTriggerExport = () => {
    if (!editorRef.current) {
      onExport(project);
      return;
    }

    const grapesData = editorRef.current.getProjectData();
    const grapesHtml = editorRef.current.getHtml();
    const grapesCss = editorRef.current.getCss();

    const isHome =
      project.activePageId === project.pages[0]?.id ||
      Boolean(project.pages.find((p) => p.id === project.activePageId)?.isHome);

    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return { ...p, grapesHtml, grapesData };
      }
      return p;
    });

    const updated: Project = {
      ...project,
      pages: updatedPages,
      grapesData: isHome ? grapesData : project.grapesData,
      grapesHtml: isHome ? grapesHtml : project.grapesHtml,
      grapesCss,
      updatedAt: Date.now(),
    };

    setProject(updated);
    saveProject(updated);
    onExport(updated);
  };

  // Local Image Upload Handler via FileReader
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (editorRef.current) {
        editorRef.current.AssetManager.add({
          src: dataUrl,
          name: file.name,
        });

        // If an image is currently selected, replace its source
        const selected = editorRef.current.getSelected();
        if (selected && selected.is('image')) {
          selected.set('src', dataUrl);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Insert or Replace Selected Image
  const handleSelectMediaAsset = (url: string) => {
    if (!editorRef.current) return;
    const selected = editorRef.current.getSelected();
    if (selected && selected.is('image')) {
      selected.set('src', url);
    } else {
      // Add to asset manager and append to active wrapper
      editorRef.current.AssetManager.add(url);
      editorRef.current.addComponents(
        `<img src="${url}" alt="Selected visual asset" style="width:100%;max-width:800px;border-radius:12px;margin:16px 0;" />`
      );
    }
  };

  // Apply Theme Preset
  const handleApplyThemePreset = (preset: WebsiteTheme) => {
    if (!editorRef.current) return;
    const updatedTheme = { ...preset };
    const updatedProject = { ...project, theme: updatedTheme };
    setProject(updatedProject);

    // Generate updated CSS and apply to GrapesJS
    const newCss = generateStyleCss(updatedTheme);
    editorRef.current.setStyle(newCss);
  };

  // Page switching with full persistence per page
  const handleSelectPage = (pageId: string) => {
    if (!editorRef.current || pageId === project.activePageId) return;

    // 1. Capture current editor state for currently active page
    const currentHtml = editorRef.current.getHtml();
    const currentData = editorRef.current.getProjectData();
    const isCurrentlyHome =
      project.activePageId === project.pages[0]?.id ||
      Boolean(project.pages.find((p) => p.id === project.activePageId)?.isHome);

    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return { ...p, grapesHtml: currentHtml, grapesData: currentData };
      }
      return p;
    });

    const targetPage = updatedPages.find((p) => p.id === pageId);
    if (!targetPage) return;

    const isTargetHome =
      targetPage.isHome || targetPage.slug === 'home' || targetPage.id === project.pages[0]?.id;

    // Load target page content into GrapesJS
    if (targetPage.grapesData) {
      editorRef.current.loadProjectData(targetPage.grapesData);
    } else if (targetPage.grapesHtml) {
      editorRef.current.setComponents(targetPage.grapesHtml);
    } else {
      const pageHtml = buildFullPageHtml(project, targetPage);
      editorRef.current.setComponents(pageHtml);
    }

    const updatedProject: Project = {
      ...project,
      pages: updatedPages,
      activePageId: pageId,
      grapesHtml: isCurrentlyHome ? currentHtml : project.grapesHtml,
      grapesData: isCurrentlyHome ? currentData : project.grapesData,
    };

    setProject(updatedProject);
    saveProject(updatedProject);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* 1. TOP BAR */}
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
        {/* Left: Back & Title & Undo/Redo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBackToGallery}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              cursor: 'pointer',
            }}
            title="Return to Main Studio & Templates"
          >
            <ArrowLeft size={15} />
            <img src="/m-logo.png" alt="MACSAC" style={{ height: 18, width: 'auto', objectFit: 'contain' }} />
            Templates
          </button>

          <input
            type="text"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
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
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--copper-medium)';
              e.target.style.background = 'var(--bg-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'transparent';
              e.target.style.background = 'transparent';
              saveProject(project);
            }}
            title="Click to rename project"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                color: canUndo ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: canUndo ? 1 : 0.4,
                cursor: canUndo ? 'pointer' : 'not-allowed',
                background: 'transparent',
                border: 'none',
              }}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              style={{
                padding: '6px 8px',
                borderRadius: 6,
                color: canRedo ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: canRedo ? 1 : 0.4,
                cursor: canRedo ? 'pointer' : 'not-allowed',
                background: 'transparent',
                border: 'none',
              }}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
          </div>
        </div>

        {/* Center: Viewport Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: 3,
            borderRadius: 8,
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => handleChangeViewport('desktop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewport === 'desktop' ? 'var(--copper-medium)' : 'transparent',
              color: viewport === 'desktop' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Monitor size={14} /> Desktop
          </button>
          <button
            onClick={() => handleChangeViewport('tablet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewport === 'tablet' ? 'var(--copper-medium)' : 'transparent',
              color: viewport === 'tablet' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Tablet size={14} /> Tablet
          </button>
          <button
            onClick={() => handleChangeViewport('mobile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewport === 'mobile' ? 'var(--copper-medium)' : 'transparent',
              color: viewport === 'mobile' ? '#ffffff' : 'var(--text-secondary)',
            }}
          >
            <Smartphone size={14} /> Mobile
          </button>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => onPreview(project)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <Eye size={15} /> Preview
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              background: saveSuccess ? '#047857' : 'var(--bg-card)',
              color: saveSuccess ? '#ffffff' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            {saveSuccess ? <Check size={15} /> : <Save size={15} />}
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
          </button>

          <button
            onClick={handleTriggerExport}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              borderRadius: 6,
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Download size={15} /> Export Website
          </button>
        </div>
      </header>

      {/* 2. THREE COLUMN WORKSPACE */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* LEFT SIDEBAR */}
        <aside
          style={{
            width: 320,
            borderRight: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              overflowX: 'auto',
            }}
          >
            <button
              onClick={() => setLeftTab('blocks')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: leftTab === 'blocks' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: leftTab === 'blocks' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <PlusSquare size={16} /> Blocks
            </button>
            <button
              onClick={() => setLeftTab('layers')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: leftTab === 'layers' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: leftTab === 'layers' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Layers size={16} /> Layers
            </button>
            <button
              onClick={() => setLeftTab('pages')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: leftTab === 'pages' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: leftTab === 'pages' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <FileCode size={16} /> Pages
            </button>
            <button
              onClick={() => setLeftTab('theme')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: leftTab === 'theme' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: leftTab === 'theme' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Palette size={16} /> Theme
            </button>
            <button
              onClick={() => setLeftTab('media')}
              style={{
                flex: 1,
                padding: '12px 6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: leftTab === 'media' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: leftTab === 'media' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ImageIcon size={16} /> Media
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {/* 1. BLOCKS TAB */}
            <div style={{ display: leftTab === 'blocks' ? 'block' : 'none' }}>
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Add Sections & Elements
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Drag and drop any block directly onto your website canvas.
                </p>
              </div>
              <div ref={blocksContainerRef} id="gjs-blocks" />
            </div>

            {/* 2. LAYERS TAB */}
            <div style={{ display: leftTab === 'layers' ? 'block' : 'none' }}>
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Page Structure (DOM Layers)
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Select, reorder, or toggle visibility of elements.
                </p>
              </div>
              <div ref={layersContainerRef} id="gjs-layers" />
            </div>

            {/* 3. PAGES TAB */}
            {leftTab === 'pages' && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Website Pages ({project.pages.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {project.pages.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPage(p.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: p.id === project.activePageId ? '2px solid var(--copper-medium)' : '1px solid var(--border-color)',
                        background: p.id === project.activePageId ? 'rgba(177,112,78,0.1)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.sections.length} sections</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. THEME TAB */}
            {leftTab === 'theme' && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  MACSAC Luxury Theme Presets
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {THEME_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyThemePreset(preset)}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        border: project.theme.id === preset.id ? '2px solid var(--copper-medium)' : '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            backgroundColor: preset.primaryColor,
                            border: '1px solid var(--border-color)',
                          }}
                        />
                        <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{preset.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ height: 6, flex: 1, borderRadius: 3, backgroundColor: preset.primaryColor }} />
                        <div style={{ height: 6, flex: 1, borderRadius: 3, backgroundColor: preset.secondaryColor }} />
                        <div style={{ height: 6, flex: 1, borderRadius: 3, backgroundColor: preset.accentColor }} />
                        <div style={{ height: 6, flex: 1, borderRadius: 3, backgroundColor: preset.bgColor, border: '1px solid #ccc' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MEDIA ASSETS TAB */}
            {leftTab === 'media' && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Visual Media & Local Uploads
                </h4>
                
                {/* Local Upload Button */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px dashed var(--copper-medium)',
                    background: 'rgba(177,112,78,0.06)',
                    color: 'var(--copper-medium)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: 16,
                  }}
                >
                  <Upload size={16} /> Upload Local Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Click any royalty-free asset to insert or swap into the selected image:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {CURATED_MEDIA_ASSETS.slice(0, 10).map((media) => (
                    <div
                      key={media.id}
                      onClick={() => handleSelectMediaAsset(media.url)}
                      style={{
                        height: 70,
                        borderRadius: 6,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid var(--border-color)',
                      }}
                      title={media.title}
                    >
                      <img src={media.thumbnail} alt={media.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER CANVASES */}
        <main
          style={{
            flex: 1,
            height: 'calc(100vh - 60px)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Viewport Frame Container */}
          <div
            style={{
              width: viewport === 'mobile' ? 375 : viewport === 'tablet' ? 768 : '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: viewport === 'desktop' ? 'none' : '0 16px 40px rgba(0,0,0,0.35)',
              transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {viewport !== 'desktop' && (
              <div
                style={{
                  height: 24,
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <span>{viewport.toUpperCase()} MODE ({viewport === 'mobile' ? '375px' : '768px'})</span>
              </div>
            )}

            {/* GrapesJS Canvas Mount Point */}
            <div
              ref={canvasContainerRef}
              id="gjs-canvas"
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            />
          </div>
        </main>

        {/* RIGHT SIDEBAR (INSPECTOR) */}
        <aside
          style={{
            width: 300,
            borderLeft: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header & Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <button
              onClick={() => setRightTab('styles')}
              style={{
                flex: 1,
                padding: '12px 8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: rightTab === 'styles' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: rightTab === 'styles' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Sliders size={15} /> Styles
            </button>
            <button
              onClick={() => setRightTab('traits')}
              style={{
                flex: 1,
                padding: '12px 8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: rightTab === 'traits' ? 'var(--copper-medium)' : 'var(--text-secondary)',
                borderBottom: rightTab === 'traits' ? '2px solid var(--copper-medium)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Settings2 size={15} /> Attributes
            </button>
          </div>

          {/* Selected Tag Info Badge */}
          <div
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--bg-primary)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>SELECTED ELEMENT:</span>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: selectedElementTag ? 'var(--copper-medium)' : 'var(--text-muted)',
                background: 'var(--bg-card)',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid var(--border-color)',
              }}
            >
              {selectedElementTag || 'NONE (CLICK CANVAS)'}
            </span>
          </div>

          {/* Content Containers */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            <div style={{ display: rightTab === 'styles' ? 'block' : 'none' }}>
              <div ref={stylesContainerRef} id="gjs-styles" />
            </div>

            <div style={{ display: rightTab === 'traits' ? 'block' : 'none' }}>
              <div ref={traitsContainerRef} id="gjs-traits" />
            </div>

            {!selectedElementTag && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 10,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
              >
                <Info size={24} style={{ color: 'var(--copper-medium)', margin: '0 auto 8px' }} />
                <h5 style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: 6 }}>
                  Visual Inspector Ready
                </h5>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Click any element on the canvas to inspect its typography, colors, margins, and attributes.
                  Double-click text to edit immediately.
                </p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};
