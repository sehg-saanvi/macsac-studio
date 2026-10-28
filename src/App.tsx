import React, { useState, useEffect } from 'react';
import {
  WebsiteTemplate,
  Project,
  FilterState,
  UserWebsiteDetails,
  UserAccount,
} from './types';
import { WEBSITE_TEMPLATES } from './data/templatesData';
import {
  getSavedProjects,
  saveProject,
  duplicateProject,
  deleteProject,
  createProjectFromTemplate,
  getCurrentUser,
  logoutUser,
  getStoredWebsiteDetails,
  saveStoredWebsiteDetails,
  clearStoredWebsiteDetails,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TemplateCatalogModal } from './components/TemplateCatalogModal';
import { CuratedSections } from './components/CuratedSections';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { TemplatePreviewModal } from './components/TemplatePreviewModal';
import { EditorView } from './components/EditorView';
import { ExportModal } from './components/ExportModal';
import { ProjectsDrawer } from './components/ProjectsDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';

export function App() {
  // Theme state: defaults to light (synced to body data-theme)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Navigation mode: 'home' | 'editor'
  const [viewMode, setViewMode] = useState<'home' | 'editor'>('home');

  // Active loaded project in editor
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Authenticated user session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // User submitted website details & keywords (Step 1)
  const [websiteDetails, setWebsiteDetails] = useState<UserWebsiteDetails | null>(null);

  // Modals state
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingCustomizeTemplate, setPendingCustomizeTemplate] = useState<WebsiteTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);
  const [exportProject, setExportProject] = useState<Project | null>(null);
  const [projectsDrawerOpen, setProjectsDrawerOpen] = useState(false);

  // Template catalog popup
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  // Preserved catalog scroll so returning from preview lands in the same spot
  const [catalogScrollY, setCatalogScrollY] = useState(0);
  // Track whether the catalog was open when a preview was launched
  const [previewFromCatalog, setPreviewFromCatalog] = useState(false);

  // Saved projects from localStorage
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);

  // Search & Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    aesthetic: 'all',
    audience: 'all',
    themeMode: 'all',
    pageType: 'all',
    onlyFree: false,
    sortBy: 'popular',
  });

  // Sync theme with body data-theme attribute
  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Load saved state on mount (user session, onboarding details, projects)
  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrentUser(user);

    const storedDetails = getStoredWebsiteDetails();
    if (storedDetails) setWebsiteDetails(storedDetails);

    setSavedProjects(getSavedProjects());
  }, []);

  const refreshSavedProjects = () => {
    setSavedProjects(getSavedProjects());
  };

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // STEP 1: Handle User submitting basic website details
  const handleSaveWebsiteDetails = (details: UserWebsiteDetails) => {
    setWebsiteDetails(details);
    saveStoredWebsiteDetails(details);
    setOnboardingModalOpen(false);
    // After saving details open the catalog popup so user can immediately browse
    setCatalogScrollY(0);
    setCatalogModalOpen(true);
  };

  // Clear / reset all stored website details
  const handleClearWebsiteDetails = () => {
    setWebsiteDetails(null);
    clearStoredWebsiteDetails();
    handleResetFilters();
  };

  // STEP 3: User clicks "Customize" on a template
  const handleRequestCustomize = (template: WebsiteTemplate) => {
    // If not authenticated, prompt sign-up or login while preserving template & details
    if (!currentUser) {
      setPendingCustomizeTemplate(template);
      setAuthModalOpen(true);
    } else {
      // Already authenticated, proceed directly to opening personalized editor
      launchPersonalizedEditor(template);
    }
  };

  // STEP 4: After successful sign-up/login, open automatically personalized template
  const handleAuthenticated = (user: UserAccount) => {
    setCurrentUser(user);
    setAuthModalOpen(false);

    if (pendingCustomizeTemplate) {
      launchPersonalizedEditor(pendingCustomizeTemplate);
      setPendingCustomizeTemplate(null);
    }
  };

  const launchPersonalizedEditor = (template: WebsiteTemplate) => {
    const personalizedProject = createProjectFromTemplate(template, websiteDetails);
    saveProject(personalizedProject);
    refreshSavedProjects();
    setCurrentProject(personalizedProject);
    setViewMode('editor');
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Open existing project from drawer
  const handleOpenProject = (project: Project) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentProject(project);
    setViewMode('editor');
    window.scrollTo(0, 0);
  };

  const handleDuplicate = (projectId: string) => {
    const copy = duplicateProject(projectId);
    if (copy) refreshSavedProjects();
  };

  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
    refreshSavedProjects();
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setViewMode('home');
    }
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    const galleryEl = document.getElementById('template-gallery');
    if (galleryEl && query.trim()) {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      aesthetic: 'all',
      audience: 'all',
      themeMode: 'all',
      pageType: 'all',
      onlyFree: false,
      sortBy: 'popular',
    });
  };

  // "Explore Templates" now opens the catalog popup instead of scrolling
  const handleScrollToGallery = () => {
    setCatalogScrollY(0);
    setCatalogModalOpen(true);
  };

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // "Start Creating" CTA triggers Step 1: Enter basic details first
  const handleStartCreating = () => {
    setOnboardingModalOpen(true);
  };

  return (
    <div className="macsac-studio-app">
      {viewMode === 'home' ? (
        <>
          {/* Main Studio Navbar */}
          <Navbar
            currentTheme={themeMode}
            onToggleTheme={handleToggleTheme}
            savedProjectsCount={savedProjects.length}
            onOpenProjects={() => setProjectsDrawerOpen(true)}
            onExploreTemplates={handleScrollToGallery}
            onOpenHowItWorks={handleScrollToHowItWorks}
            onStartCreating={handleStartCreating}
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onLogout={handleLogout}
            websiteDetails={websiteDetails}
            onEditDetails={() => setOnboardingModalOpen(true)}
            onClearDetails={handleClearWebsiteDetails}
            onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          <main>
            {/* Hero Section */}
            <Hero
              searchQuery={filters.searchQuery}
              onSearchChange={handleSearchChange}
              onExploreTemplates={handleScrollToGallery}
              onStartCreating={handleStartCreating}
              websiteDetails={websiteDetails}
              onEditDetails={() => setOnboardingModalOpen(true)}
            />

            {/* Curated Showcases (Popular, Business, Portfolio, Categories) */}
            <CuratedSections
              templates={WEBSITE_TEMPLATES}
              onPreview={(t) => {
                setPreviewFromCatalog(false);
                setPreviewTemplate(t);
              }}
              onCustomize={handleRequestCustomize}
              onSelectCategory={(cat) => {
                setFilters((prev) => ({ ...prev, category: cat }));
                setCatalogScrollY(0);
                setCatalogModalOpen(true);
              }}
              onSelectAesthetic={(aes) => {
                setFilters((prev) => ({ ...prev, aesthetic: aes }));
                setCatalogScrollY(0);
                setCatalogModalOpen(true);
              }}
            />

            {/* How It Works 3-Step Section */}
            <HowItWorks onStartCreating={handleStartCreating} />
          </main>

          {/* Platform Footer */}
          <Footer
            onExploreTemplates={handleScrollToGallery}
            onOpenHowItWorks={handleScrollToHowItWorks}
          />
        </>
      ) : (
        /* STEP 5: Full-Screen Visual Customization Editor */
        currentProject && (
          <EditorView
            initialProject={currentProject}
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onBackToGallery={() => {
              refreshSavedProjects();
              setViewMode('home');
            }}
            onPreview={(project) => {
              // Convert project to temporary template format for preview modal
              setPreviewTemplate({
                id: project.id,
                name: project.name,
                description: project.settings.description,
                category: 'business',
                categoryLabel: 'Customized Project',
                aesthetic: 'luxury',
                aestheticLabel: project.theme.name,
                targetAudience: 'business',
                themeMode: project.theme.mode,
                isMultiPage: project.pages.length > 1,
                previewImage: project.pages[0]?.sections[0]?.image || '',
                tags: [],
                pages: project.pages,
                theme: project.theme,
                navigation: project.navigation,
                footer: project.footer,
              });
            }}
            onExport={(project) => setExportProject(project)}
          />
        )
      )}

      {/* STEP 1: Enter Basic Website Details Modal */}
      <OnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onSubmit={handleSaveWebsiteDetails}
        initialDetails={websiteDetails}
        onClear={handleClearWebsiteDetails}
      />

      {/* STEP 3: Sign Up / Log In Modal before opening Editor */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingCustomizeTemplate(null);
        }}
        selectedTemplate={pendingCustomizeTemplate}
        userDetails={websiteDetails}
        onAuthenticated={handleAuthenticated}
      />

      {/* Template Catalog Popup */}
      <TemplateCatalogModal
        isOpen={catalogModalOpen}
        onClose={() => setCatalogModalOpen(false)}
        templates={WEBSITE_TEMPLATES}
        filters={filters}
        onFilterChange={handleFilterUpdate}
        onResetFilters={handleResetFilters}
        onPreview={(template) => {
          // Save scroll position before opening preview
          setPreviewFromCatalog(true);
          setPreviewTemplate(template);
          setCatalogModalOpen(false);
        }}
        onCustomize={(template) => {
          setCatalogModalOpen(false);
          handleRequestCustomize(template);
        }}
        websiteDetails={websiteDetails}
        onEditDetails={() => {
          setCatalogModalOpen(false);
          setOnboardingModalOpen(true);
        }}
        savedScrollY={catalogScrollY}
        onSaveScroll={setCatalogScrollY}
      />

      {/* Full-Page Website Preview Modal (Does not require sign-up) */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => {
            setPreviewTemplate(null);
            // If preview was launched from catalog, re-open catalog at saved scroll
            if (previewFromCatalog) {
              setCatalogModalOpen(true);
            }
          }}
          onCustomize={(template) => {
            setPreviewTemplate(null);
            setPreviewFromCatalog(false);
            handleRequestCustomize(template);
          }}
        />
      )}

      {/* Standalone Code Export Modal */}
      {exportProject && (
        <ExportModal
          project={exportProject}
          onClose={() => setExportProject(null)}
        />
      )}

      {/* My Saved Websites Drawer */}
      <ProjectsDrawer
        isOpen={projectsDrawerOpen}
        onClose={() => setProjectsDrawerOpen(false)}
        projects={savedProjects}
        activeProjectId={currentProject?.id}
        onOpenProject={handleOpenProject}
        onDuplicateProject={handleDuplicate}
        onDeleteProject={handleDelete}
        onNewProject={() => {
          setProjectsDrawerOpen(false);
          handleStartCreating();
        }}
      />
    </div>
  );
}

export default App;
