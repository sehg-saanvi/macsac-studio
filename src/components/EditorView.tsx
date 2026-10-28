import React, { useState, useEffect } from 'react';
import {
  Project,
  WebsitePage,
  WebsiteSection,
  WebsiteTheme,
  ViewportMode,
  SectionType,
  SectionItem,
  UserAccount,
} from '../types';
import { EditorLeftSidebar } from './EditorLeftSidebar';
import { EditorRightSidebar } from './EditorRightSidebar';
import { EditorBottomBar } from './EditorBottomBar';
import { WebsiteRenderer } from './WebsiteRenderer';
import { createNewSection } from '../data/defaultSections';
import { saveProject } from '../utils/storage';
import { Check } from 'lucide-react';

interface EditorViewProps {
  initialProject: Project;
  onBackToGallery: () => void;
  onPreview: (project: Project) => void;
  onExport: (project: Project) => void;
  currentUser?: UserAccount | null;
  onOpenAuth: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  initialProject,
  onBackToGallery,
  onPreview,
  onExport,
  currentUser,
  onOpenAuth,
}) => {
  // Main Project State
  const [project, setProject] = useState<Project>(initialProject);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(
    initialProject.pages[0]?.sections[0]?.id
  );
  const [isSaving, setIsSaving] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // Undo & Redo History Stacks
  const [history, setHistory] = useState<Project[]>([initialProject]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushState = (newProject: Project) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newProject);
    if (updatedHistory.length > 30) updatedHistory.shift();
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setProject(newProject);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
    }
  };

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Active Page resolution
  const activePage = project.pages.find((p) => p.id === project.activePageId) || project.pages[0];

  // Selected Section resolution
  const selectedSection =
    activePage?.sections.find((s) => s.id === selectedSectionId) ||
    activePage?.sections[0] ||
    null;

  // Project Rename
  const handleRenameProject = (name: string) => {
    const updated = { ...project, name, updatedAt: Date.now() };
    pushState(updated);
  };

  // Page Operations
  const handleSelectPage = (pageId: string) => {
    const targetPage = project.pages.find((p) => p.id === pageId);
    setProject((prev) => ({ ...prev, activePageId: pageId }));
    if (targetPage && targetPage.sections.length > 0) {
      setSelectedSectionId(targetPage.sections[0].id);
    }
  };

  const handleAddPage = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newPage: WebsitePage = {
      id: `page-${Date.now()}`,
      name,
      slug,
      sections: [createNewSection('hero'), createNewSection('features'), createNewSection('contact')],
    };
    const updated = {
      ...project,
      pages: [...project.pages, newPage],
      activePageId: newPage.id,
      updatedAt: Date.now(),
    };
    pushState(updated);
    setSelectedSectionId(newPage.sections[0]?.id);
  };

  const handleDeletePage = (pageId: string) => {
    if (project.pages.length <= 1) return;
    const remaining = project.pages.filter((p) => p.id !== pageId);
    const updated = {
      ...project,
      pages: remaining,
      activePageId: remaining[0].id,
      updatedAt: Date.now(),
    };
    pushState(updated);
    setSelectedSectionId(remaining[0].sections[0]?.id);
  };

  // Section Operations
  const handleAddSection = (type: SectionType) => {
    const newSec = createNewSection(type);
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return { ...p, sections: [...p.sections, newSec] };
      }
      return p;
    });
    const updated = { ...project, pages: updatedPages, updatedAt: Date.now() };
    pushState(updated);
    setSelectedSectionId(newSec.id);
  };

  const handleUpdateSection = (updates: Partial<WebsiteSection>) => {
    if (!selectedSectionId) return;
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) =>
            s.id === selectedSectionId ? { ...s, ...updates } : s
          ),
        };
      }
      return p;
    });
    const updated = { ...project, pages: updatedPages, updatedAt: Date.now() };
    pushState(updated);
  };

  const handleMoveSectionUp = (secId: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        const idx = p.sections.findIndex((s) => s.id === secId);
        if (idx > 0) {
          const nextSecs = [...p.sections];
          const temp = nextSecs[idx - 1];
          nextSecs[idx - 1] = nextSecs[idx];
          nextSecs[idx] = temp;
          return { ...p, sections: nextSecs };
        }
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  const handleMoveSectionDown = (secId: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        const idx = p.sections.findIndex((s) => s.id === secId);
        if (idx < p.sections.length - 1) {
          const nextSecs = [...p.sections];
          const temp = nextSecs[idx + 1];
          nextSecs[idx + 1] = nextSecs[idx];
          nextSecs[idx] = temp;
          return { ...p, sections: nextSecs };
        }
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  const handleDeleteSection = (secId: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        if (p.sections.length <= 1) return p; // guard: keep at least 1
        return { ...p, sections: p.sections.filter((s) => s.id !== secId) };
      }
      return p;
    });
    const remainingSections =
      updatedPages.find((p) => p.id === project.activePageId)?.sections || [];
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
    setSelectedSectionId(remainingSections[0]?.id);
  };

  const handleDuplicateSection = (secId: string) => {
    const target = activePage.sections.find((s) => s.id === secId);
    if (!target) return;
    const copy: WebsiteSection = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${target.title} (Copy)`,
    };
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        const idx = p.sections.findIndex((s) => s.id === secId);
        const nextSecs = [...p.sections];
        nextSecs.splice(idx + 1, 0, copy);
        return { ...p, sections: nextSecs };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
    setSelectedSectionId(copy.id);
  };

  const handleReorderSections = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        const nextSecs = [...p.sections];
        const [moved] = nextSecs.splice(fromIndex, 1);
        nextSecs.splice(toIndex, 0, moved);
        return { ...p, sections: nextSecs };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  // Section Items management
  const handleUpdateItem = (itemId: string, updates: Partial<SectionItem>) => {
    if (!selectedSectionId) return;
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) => {
            if (s.id === selectedSectionId && s.items) {
              return {
                ...s,
                items: s.items.map((it) =>
                  it.id === itemId ? { ...it, ...updates } : it
                ),
              };
            }
            return s;
          }),
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  const handleAddItem = () => {
    if (!selectedSectionId) return;
    const newItem: SectionItem = {
      id: `item-${Date.now()}`,
      title: 'New Highlight Item',
      description: 'Custom description for this service or card item.',
      tag: 'NEW',
    };
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) => {
            if (s.id === selectedSectionId) {
              return { ...s, items: [...(s.items || []), newItem] };
            }
            return s;
          }),
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedSectionId) return;
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) => {
            if (s.id === selectedSectionId && s.items) {
              return { ...s, items: s.items.filter((it) => it.id !== itemId) };
            }
            return s;
          }),
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  // Theme Updates
  const handleUpdateTheme = (themeUpdates: Partial<WebsiteTheme>) => {
    pushState({
      ...project,
      theme: { ...project.theme, ...themeUpdates },
      updatedAt: Date.now(),
    });
  };

  const handleApplyThemePreset = (preset: WebsiteTheme) => {
    pushState({ ...project, theme: { ...preset }, updatedAt: Date.now() });
  };

  // Navigation Updates
  const handleUpdateNavigation = (navUpdates: Partial<Project['navigation']>) => {
    pushState({
      ...project,
      navigation: { ...project.navigation, ...navUpdates },
      updatedAt: Date.now(),
    });
  };

  // Settings Updates
  const handleUpdateSettings = (settingsUpdates: Partial<Project['settings']>) => {
    pushState({
      ...project,
      settings: { ...project.settings, ...settingsUpdates },
      updatedAt: Date.now(),
    });
  };

  // Direct in-canvas section text/property updates
  const handleDirectSectionUpdate = (sectionId: string, updates: Partial<WebsiteSection>) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId ? { ...s, ...updates } : s
          ),
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  // Direct in-canvas item updates
  const handleDirectItemUpdate = (
    sectionId: string,
    itemId: string,
    updates: Partial<SectionItem>
  ) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === project.activePageId) {
        return {
          ...p,
          sections: p.sections.map((s) => {
            if (s.id === sectionId && s.items) {
              return {
                ...s,
                items: s.items.map((it) =>
                  it.id === itemId ? { ...it, ...updates } : it
                ),
              };
            }
            return s;
          }),
        };
      }
      return p;
    });
    pushState({ ...project, pages: updatedPages, updatedAt: Date.now() });
  };

  // Quick Image Selector for active section
  const handleSelectImageForSection = (imageUrl: string) => {
    if (selectedSection) {
      handleUpdateSection({ image: imageUrl });
    }
  };

  // Save Project Action — enforces login to persist changes
  const handleSave = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setIsSaving(true);
    saveProject(project);
    setTimeout(() => setIsSaving(false), 800);
  };

  // Canvas width helpers
  const getCanvasWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 390;
      case 'tablet':
        return 768;
      default:
        return null; // desktop = fill
    }
  };

  const canvasWidth = getCanvasWidth();
  const isConstrained = viewport !== 'desktop';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Row: Left | Canvas | Right ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <EditorLeftSidebar
          project={project}
          activePageId={project.activePageId}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onRenamePage={(id, name) => {
            const updated = {
              ...project,
              pages: project.pages.map((p) => (p.id === id ? { ...p, name } : p)),
            };
            pushState(updated);
          }}
          onDeletePage={handleDeletePage}
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
          onAddSection={handleAddSection}
          onUpdateTheme={handleUpdateTheme}
          onApplyThemePreset={handleApplyThemePreset}
          onUpdateNavigation={handleUpdateNavigation}
          onUpdateSettings={handleUpdateSettings}
          onSelectImageForSection={handleSelectImageForSection}
          onMoveSectionUp={handleMoveSectionUp}
          onMoveSectionDown={handleMoveSectionDown}
          onDeleteSection={handleDeleteSection}
          onDuplicateSection={handleDuplicateSection}
          isSaving={isSaving}
          onSave={handleSave}
          onPreview={() => onPreview(project)}
          onExport={() => onExport(project)}
          onPublish={() => setPublishModalOpen(true)}
          onBackToGallery={onBackToGallery}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
        />

        {/* Center Canvas */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            background: '#e8e0d8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isConstrained ? 'center' : 'stretch',
            justifyContent: 'flex-start',
            padding: isConstrained ? '32px 16px 120px' : '0 0 120px',
            position: 'relative',
          }}
        >
          {/* Device canvas wrapper */}
          <div
            style={{
              width: isConstrained ? canvasWidth! : '100%',
              minHeight: '100%',
              flexShrink: 0,
              backgroundColor: project.theme.bgColor,
              borderRadius: viewport === 'mobile' ? 24 : viewport === 'tablet' ? 16 : 0,
              boxShadow: isConstrained ? '0 20px 50px rgba(0,0,0,0.25)' : 'none',
              overflow: isConstrained ? 'hidden' : 'visible',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Device chrome bar */}
            {isConstrained && (
              <div
                style={{
                  height: 24,
                  background: '#1a1614',
                  color: '#a09080',
                  fontSize: '0.68rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.06em',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {viewport === 'tablet' ? 'TABLET 768px' : 'MOBILE 390px'}
              </div>
            )}

            {/* CSS-isolated website canvas */}
            <div
              id="macsac-website-canvas"
              style={{
                fontFamily: 'inherit',
                isolation: 'isolate',
                flex: 1,
              }}
            >
              <WebsiteRenderer
                page={activePage}
                allPages={project.pages}
                activePageId={project.activePageId}
                onNavigatePage={handleSelectPage}
                theme={project.theme}
                navigation={project.navigation}
                footer={project.footer}
                projectName={project.name}
                isEditorMode={true}
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onMoveSectionUp={handleMoveSectionUp}
                onMoveSectionDown={handleMoveSectionDown}
                onDeleteSection={handleDeleteSection}
                onDuplicateSection={handleDuplicateSection}
                onUpdateSection={handleDirectSectionUpdate}
                onUpdateItem={handleDirectItemUpdate}
                onReorderSections={handleReorderSections}
                viewport={viewport}
              />
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <EditorRightSidebar
          section={selectedSection}
          onUpdateSection={handleUpdateSection}
          onUpdateItem={handleUpdateItem}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onMoveSectionUp={selectedSectionId ? () => handleMoveSectionUp(selectedSectionId) : undefined}
          onMoveSectionDown={selectedSectionId ? () => handleMoveSectionDown(selectedSectionId) : undefined}
          onDuplicateSection={selectedSectionId ? () => handleDuplicateSection(selectedSectionId) : undefined}
          onDeleteSection={selectedSectionId ? () => handleDeleteSection(selectedSectionId) : undefined}
          pageName={activePage?.name}
          sectionCount={activePage?.sections.length}
        />
      </div>

      {/* ── Bottom Bar ── */}
      <EditorBottomBar
        projectName={project.name}
        onRenameProject={handleRenameProject}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        viewport={viewport}
        onChangeViewport={setViewport}
        onPreview={() => onPreview(project)}
        onSave={handleSave}
        isSaving={isSaving}
        onExport={() => onExport(project)}
        onPublish={() => setPublishModalOpen(true)}
        onBackToGallery={onBackToGallery}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
      />

      {/* Publish Simulation Modal */}
      {publishModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: 480, padding: 24, textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#047857',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Check size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>
              Website Publishing &amp; Cloud Hosting
            </h3>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              Your customized website <strong>"{project.name}"</strong> is ready for global
              high-speed deployment!
            </p>
            <div
              style={{
                background: 'var(--bg-primary)',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                color: 'var(--copper-medium)',
                marginBottom: 20,
              }}
            >
              https://{project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.macsac.site
            </div>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginBottom: 24,
              }}
            >
              To deploy live on MACSAC NVMe cloud infrastructure with sub-12ms response and
              automated SSL, contact our team or download your files via "Export Website".
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setPublishModalOpen(false);
                  onExport(project);
                }}
                className="btn-primary btn-sm"
              >
                Export HTML/CSS Files
              </button>
              <button
                onClick={() => setPublishModalOpen(false)}
                className="btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
