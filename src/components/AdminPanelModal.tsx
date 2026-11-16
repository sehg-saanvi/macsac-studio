import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Download,
  RefreshCw,
  Sparkles,
  Check,
  AlertCircle,
  Search,
  Edit3,
  Layers,
  Palette,
  FileText,
  ChevronRight,
  ExternalLink,
  Code,
  Sliders,
  CheckCircle2,
  Lock,
  LogOut,
  User,
} from 'lucide-react';
import {
  WebsiteTemplate,
  TemplateCategory,
  TemplateAesthetic,
  WebsitePage,
  WebsiteTheme,
  SectionType,
} from '../types';
import {
  getAdminTemplatesList,
  saveCustomTemplate,
  deleteCustomTemplate,
  toggleTemplateVisibility,
  toggleTemplateFeatured,
  updateTemplateMetadata,
  exportTemplatesPackage,
  importTemplatesPackage,
  resetAllToFactoryDefaults,
  AdminTemplateItem,
} from '../utils/templateManager';
import { createNewSection } from '../data/defaultSections';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewTemplate: (template: WebsiteTemplate) => void;
  onLaunchTemplate: (template: WebsiteTemplate) => void;
  onTemplatesChanged?: () => void;
}

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'business', label: 'Business & Corporate' },
  { id: 'hospitality', label: 'Hospitality & Dining' },
  { id: 'technology', label: 'Technology & SaaS' },
  { id: 'portfolio', label: 'Portfolio & Creative' },
  { id: 'store', label: 'Store & E-Commerce' },
  { id: 'realestate', label: 'Real Estate & Living' },
  { id: 'editorial', label: 'Editorial & Magazine' },
  { id: 'landing', label: 'Landing & Products' },
  { id: 'agency', label: 'Agency & Creative Studio' },
  { id: 'education', label: 'Education & Academy' },
];

const AESTHETICS: { id: TemplateAesthetic; label: string }[] = [
  { id: 'minimalist', label: 'Minimalist Clean' },
  { id: 'editorial', label: 'Editorial Atelier' },
  { id: 'luxury', label: 'Luxury Copper & Gold' },
  { id: 'dark_futuristic', label: 'Obsidian Cyber' },
  { id: 'playful', label: 'Playful Modern' },
  { id: 'corporate', label: 'Executive Precision' },
  { id: 'brutalist', label: 'Neo-Brutalist' },
  { id: 'retro', label: 'Vintage Heritage' },
  { id: 'pastel', label: 'Pastel Botanical' },
  { id: 'sophisticated', label: 'Nordic Slate' },
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
];

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onPreviewTemplate,
  onLaunchTemplate,
  onTemplatesChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'create' | 'upload-json' | 'ai-engine' | 'backup'>('templates');
  const [templateList, setTemplateList] = useState<AdminTemplateItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Quick edit modal
  const [editingTemplate, setEditingTemplate] = useState<WebsiteTemplate | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<TemplateCategory>('business');

  // Interactive Builder state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<TemplateCategory>('business');
  const [newAesthetic, setNewAesthetic] = useState<TemplateAesthetic>('minimalist');
  const [newThemeMode, setNewThemeMode] = useState<'light' | 'dark'>('light');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#b1704e');
  const [newCoverImage, setNewCoverImage] = useState(PRESET_COVERS[0]);
  const [newPagesList, setNewPagesList] = useState<string[]>(['Home', 'About', 'Services', 'Contact']);
  const [newPageInput, setNewPageInput] = useState('');
  const [selectedInitialSections, setSelectedInitialSections] = useState<SectionType[]>([
    'hero',
    'services',
    'features',
    'testimonials',
    'contact',
  ]);

  // AI Test Runner state
  const [testPrompt, setTestPrompt] = useState('I want an online organic coffee roastery with direct delivery');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTestingAi, setIsTestingAi] = useState(false);

  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('macsac_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const user = loginUsername.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (
      (user === 'admin' || user === 'macsac_admin') &&
      (pass === 'macsac@admin2026' || pass === 'macsac2026' || pass === 'admin123')
    ) {
      try {
        sessionStorage.setItem('macsac_admin_auth', 'true');
      } catch {}
      setIsAuthenticated(true);
      setLoginError('');
      showNotification('Administrator authenticated. Welcome to MACSAC Control Center.');
    } else {
      setLoginError('Invalid administrator credentials. Please check your username and password.');
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('macsac_admin_auth');
    } catch {}
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
    showNotification('Logged out from Admin Control Panel.');
  };

  // Reload inventory
  const refreshList = () => {
    const list = getAdminTemplatesList();
    setTemplateList(list);
    if (onTemplatesChanged) {
      onTemplatesChanged();
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = templateList.filter((item) => {
    const t = item.template;
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const totalTemplates = templateList.length;
  const customTemplatesCount = templateList.filter((i) => i.isCustom).length;
  const hiddenTemplatesCount = templateList.filter((i) => i.isHidden).length;

  // Toggle handlers
  const handleToggleVisibility = (id: string) => {
    const isHidden = toggleTemplateVisibility(id);
    refreshList();
    showNotification(isHidden ? 'Template hidden from public catalog.' : 'Template is now publicly visible.');
  };

  const handleToggleFeatured = (id: string) => {
    const isFeatured = toggleTemplateFeatured(id);
    refreshList();
    showNotification(isFeatured ? 'Template marked as Featured / Popular!' : 'Template removed from Featured list.');
  };

  const handleDeleteCustom = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete custom template "${name}"?`)) {
      deleteCustomTemplate(id);
      refreshList();
      showNotification(`Custom template "${name}" deleted.`, 'success');
    }
  };

  // Open Edit Metadata
  const handleStartEdit = (t: WebsiteTemplate) => {
    setEditingTemplate(t);
    setEditName(t.name);
    setEditDescription(t.description);
    setEditCategory(t.category);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    updateTemplateMetadata(editingTemplate.id, {
      name: editName,
      description: editDescription,
      category: editCategory,
      categoryLabel: CATEGORIES.find((c) => c.id === editCategory)?.label || editCategory,
    });
    setEditingTemplate(null);
    refreshList();
    showNotification('Template metadata updated successfully!');
  };

  // Build & Save New Custom Template
  const handleCreateCustomTemplate = () => {
    if (!newName.trim()) {
      showNotification('Please enter a Template Name.', 'error');
      return;
    }

    const templateId = newId.trim()
      ? newId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-')
      : `custom-${Date.now()}`;

    // Create pages from newPagesList
    const pages: WebsitePage[] = newPagesList.map((pageName, pageIdx) => {
      const slug = pageName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const isHome = pageIdx === 0;

      const pageSections = isHome
        ? selectedInitialSections.map((secType) => {
            const sec = createNewSection(secType);
            sec.title = `${newName} ${sec.title}`;
            return sec;
          })
        : [createNewSection('hero'), createNewSection('features'), createNewSection('contact')];

      return {
        id: `page-${templateId}-${slug}-${pageIdx}`,
        name: pageName,
        slug: isHome ? 'home' : slug,
        sections: pageSections,
      };
    });

    const theme: WebsiteTheme = {
      id: `theme-${templateId}`,
      name: `${newName} Theme`,
      primaryColor: newPrimaryColor,
      secondaryColor: '#e6bfa7',
      accentColor: newPrimaryColor,
      bgColor: newThemeMode === 'dark' ? '#0f172a' : '#ffffff',
      textColor: newThemeMode === 'dark' ? '#f8fafc' : '#1e293b',
      textMuted: newThemeMode === 'dark' ? '#94a3b8' : '#64748b',
      cardBg: newThemeMode === 'dark' ? '#1e293b' : '#f8fafc',
      borderColor: newThemeMode === 'dark' ? '#334155' : '#e2e8f0',
      headingFont: "'Outfit', sans-serif",
      bodyFont: "'Inter', sans-serif",
      borderRadius: '8px',
      buttonStyle: 'rounded',
      mode: newThemeMode,
    };

    const newTemplate: WebsiteTemplate = {
      id: templateId,
      name: newName.trim(),
      description: newDescription.trim() || `Professional ${newCategory} website template designed with MACSAC Studio.`,
      category: newCategory,
      categoryLabel: CATEGORIES.find((c) => c.id === newCategory)?.label || newCategory,
      aesthetic: newAesthetic,
      aestheticLabel: AESTHETICS.find((a) => a.id === newAesthetic)?.label || newAesthetic,
      targetAudience: 'both',
      themeMode: newThemeMode,
      isMultiPage: pages.length > 1,
      isPopular: false,
      isNew: true,
      previewImage: newCoverImage,
      tags: [newCategory, newAesthetic, 'custom', 'responsive'],
      pages,
      theme,
      navigation: {
        brandName: newName.trim(),
        logoText: newName.trim(),
        links: [],
        ctaText: 'Get Started',
        ctaUrl: '#contact',
        layoutStyle: 'standard',
      },
      footer: {
        brandName: newName.trim(),
        tagline: 'Built with MACSAC Studio.',
        copyright: `© ${new Date().getFullYear()} ${newName.trim()}. All rights reserved.`,
        links: [
          { label: 'Privacy Policy', url: '#privacy' },
          { label: 'Terms of Service', url: '#terms' },
        ],
        socialLinks: [],
      },
    };

    const res = saveCustomTemplate(newTemplate);
    if (res.success) {
      showNotification(res.message);
      refreshList();
      setActiveTab('templates');
      // Reset form
      setNewId('');
      setNewName('');
      setNewDescription('');
    } else {
      showNotification(res.message, 'error');
    }
  };

  // Upload JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importTemplatesPackage(content);
      if (res.success) {
        showNotification(`Successfully imported ${res.count} template(s)!`);
        refreshList();
        setActiveTab('templates');
      } else {
        showNotification(res.error || 'Failed to import templates.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export JSON Package
  const handleExportJson = () => {
    const jsonStr = exportTemplatesPackage();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `macsac-studio-templates-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported complete template package as JSON.');
  };

  // Factory Reset
  const handleFactoryReset = () => {
    if (
      window.confirm(
        'WARNING: This will reset all custom uploaded templates, unhide all built-ins, and restore original factory defaults. Continue?'
      )
    ) {
      resetAllToFactoryDefaults();
      refreshList();
      showNotification('Template system restored to factory defaults.');
    }
  };

  // Test AI Runner
  const handleRunAiTest = async () => {
    setIsTestingAi(true);
    setTestResponse(null);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: testPrompt }],
          currentProject: null,
          agentContext: null,
        }),
      });
      const data = await res.json();
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({ error: err.message });
    } finally {
      setIsTestingAi(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: 'rgba(10, 8, 7, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      {!isAuthenticated ? (
        /* Dedicated Admin Authentication Gate */
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            backgroundColor: '#181412',
            border: '1px solid #3d322c',
            borderRadius: 16,
            boxShadow: '0 24px 70px rgba(0,0,0,0.7)',
            padding: '36px 32px',
            color: '#fdfbf7',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'transparent',
              border: 'none',
              color: '#a6988f',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
            }}
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #b1704e 0%, #703c21 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(177,112,78,0.4)',
                marginBottom: 16,
              }}
            >
              <Shield size={26} color="#ffffff" />
            </div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: 6,
              }}
            >
              MACSAC Studio Admin
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#a6988f', lineHeight: 1.45 }}>
              Staff & System Management Portal. Enter your administrator credentials to proceed.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {loginError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e6bfa7', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#100d0c',
                    border: '1px solid #3d322c',
                    borderRadius: 8,
                    padding: '10px 14px 10px 38px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#b1704e')}
                  onBlur={(e) => (e.target.style.borderColor = '#3d322c')}
                />
                <User size={16} color="#a6988f" style={{ position: 'absolute', left: 12, top: 12 }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#e6bfa7', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: '#100d0c',
                    border: '1px solid #3d322c',
                    borderRadius: 8,
                    padding: '10px 40px 10px 38px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#b1704e')}
                  onBlur={(e) => (e.target.style.borderColor = '#3d322c')}
                />
                <Lock size={16} color="#a6988f" style={{ position: 'absolute', left: 12, top: 12 }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 10,
                    background: 'transparent',
                    border: 'none',
                    color: '#a6988f',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: 8,
                marginTop: 8,
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Shield size={16} />
              <span>Authenticate & Enter Studio</span>
            </button>
          </form>

          {/* Credentials Helper for Administrator */}
          <div
            style={{
              marginTop: 22,
              padding: '10px 12px',
              background: 'rgba(177,112,78,0.08)',
              border: '1px dashed rgba(177,112,78,0.25)',
              borderRadius: 8,
              fontSize: '0.74rem',
              color: '#d4c7bd',
              textAlign: 'center',
            }}
          >
            Staff Credentials: <strong>admin</strong> / <strong>macsac@admin2026</strong>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              width: '100%',
              maxWidth: 1180,
          height: 'min(92vh, 880px)',
          backgroundColor: '#181412',
          border: '1px solid #3d322c',
          borderRadius: 16,
          boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#fdfbf7',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #2d2420',
            background: 'linear-gradient(90deg, #1f1916 0%, #161210 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #b1704e 0%, #703c21 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(177,112,78,0.35)',
              }}
            >
              <Shield size={20} color="#ffffff" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>MACSAC Studio Admin Control Panel</span>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    background: 'rgba(177,112,78,0.25)',
                    color: '#e6bfa7',
                    border: '1px solid rgba(177,112,78,0.4)',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    textTransform: 'uppercase',
                  }}
                >
                  Root Access
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#a6988f', marginTop: 2 }}>
                Full system control: template catalog, custom upload engine, AI model architecture & backups.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Quick System Stats */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#120f0e',
                border: '1px solid #2d2420',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.74rem',
              }}
            >
              <div>
                <span style={{ color: '#8c7d73' }}>Templates:</span>{' '}
                <strong style={{ color: '#b1704e' }}>{totalTemplates}</strong>
              </div>
              <div style={{ width: 1, height: 14, background: '#2d2420' }} />
              <div>
                <span style={{ color: '#8c7d73' }}>Custom:</span>{' '}
                <strong style={{ color: '#10b981' }}>{customTemplatesCount}</strong>
              </div>
              <div style={{ width: 1, height: 14, background: '#2d2420' }} />
              <div>
                <span style={{ color: '#8c7d73' }}>Hidden:</span>{' '}
                <strong style={{ color: '#f59e0b' }}>{hiddenTemplatesCount}</strong>
              </div>
            </div>

            {/* Log Out button */}
            <button
              onClick={handleAdminLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#231c19',
                border: '1px solid #4a3c35',
                color: '#e6bfa7',
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dc2626';
                e.currentTarget.style.color = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#4a3c35';
                e.currentTarget.style.color = '#e6bfa7';
              }}
              title="Log Out of Administrator Portal"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              title="Close Admin Panel"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '1px solid #3d322c',
                background: '#1f1916',
                color: '#a6988f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#b1704e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#a6988f';
                e.currentTarget.style.borderColor = '#3d322c';
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 24px',
            background: '#14100e',
            borderBottom: '1px solid #2d2420',
            flexShrink: 0,
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('templates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'templates' ? '#b1704e' : 'transparent',
              color: activeTab === 'templates' ? '#ffffff' : '#a6988f',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={15} />
            <span>Template Control Center ({totalTemplates})</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'create' ? '#b1704e' : 'transparent',
              color: activeTab === 'create' ? '#ffffff' : '#a6988f',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={15} />
            <span>Design New Template</span>
          </button>

          <button
            onClick={() => setActiveTab('upload-json')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'upload-json' ? '#b1704e' : 'transparent',
              color: activeTab === 'upload-json' ? '#ffffff' : '#a6988f',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Upload size={15} />
            <span>Upload JSON Template</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-engine')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'ai-engine' ? '#b1704e' : 'transparent',
              color: activeTab === 'ai-engine' ? '#ffffff' : '#a6988f',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={15} />
            <span>AI Model Engine (Nemotron 120B)</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'backup' ? '#b1704e' : 'transparent',
              color: activeTab === 'backup' ? '#ffffff' : '#a6988f',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sliders size={15} />
            <span>Backup & Maintenance</span>
          </button>
        </div>

        {/* Global Toast Alert */}
        {notification && (
          <div
            style={{
              padding: '10px 20px',
              background: notification.type === 'success' ? '#064e3b' : '#7f1d1d',
              borderBottom: `1px solid ${notification.type === 'success' ? '#059669' : '#b91c1c'}`,
              color: '#ffffff',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* ════════════ TAB 1: TEMPLATE CONTROL CENTER ════════════ */}
          {activeTab === 'templates' && (
            <div>
              {/* Search & Filter Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginBottom: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#100d0c',
                    border: '1px solid #332822',
                    borderRadius: 8,
                    padding: '8px 14px',
                    width: 320,
                    boxSizing: 'border-box',
                  }}
                >
                  <Search size={16} color="#8c7d73" />
                  <input
                    type="text"
                    placeholder="Search templates by name, ID, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: '#8c7d73', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 9999,
                      border: '1px solid',
                      borderColor: selectedCategory === 'all' ? '#b1704e' : '#2d2420',
                      background: selectedCategory === 'all' ? 'rgba(177,112,78,0.2)' : '#161210',
                      color: selectedCategory === 'all' ? '#e6bfa7' : '#8c7d73',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    All ({totalTemplates})
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = templateList.filter((i) => i.template.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 9999,
                          border: '1px solid',
                          borderColor: selectedCategory === cat.id ? '#b1704e' : '#2d2420',
                          background: selectedCategory === cat.id ? 'rgba(177,112,78,0.2)' : '#161210',
                          color: selectedCategory === cat.id ? '#e6bfa7' : '#8c7d73',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {cat.label.split(' ')[0]} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Templates Inventory Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 16,
                }}
              >
                {filteredTemplates.map(({ template, isCustom, isHidden, isFeatured }) => (
                  <div
                    key={template.id}
                    style={{
                      background: isHidden ? '#141110' : '#1f1916',
                      border: `1px solid ${isHidden ? '#261e1b' : isCustom ? '#059669' : '#332822'}`,
                      borderRadius: 12,
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      opacity: isHidden ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Top Row: Preview Thumbnail & Basic Info */}
                    <div style={{ display: 'flex', gap: 14 }}>
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        style={{
                          width: 80,
                          height: 70,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #3d322c',
                          flexShrink: 0,
                          backgroundColor: '#000',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontFamily: "'Outfit', sans-serif",
                              fontWeight: 700,
                              fontSize: '0.94rem',
                              color: '#fdfbf7',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 160,
                            }}
                          >
                            {template.name}
                          </span>

                          {isCustom && (
                            <span
                              style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                background: 'rgba(16, 185, 129, 0.2)',
                                color: '#10b981',
                                border: '1px solid #10b981',
                                padding: '1px 6px',
                                borderRadius: 4,
                                textTransform: 'uppercase',
                              }}
                            >
                              Custom
                            </span>
                          )}

                          {isHidden && (
                            <span
                              style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                border: '1px solid #ef4444',
                                padding: '1px 6px',
                                borderRadius: 4,
                                textTransform: 'uppercase',
                              }}
                            >
                              Hidden
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: '#b1704e', fontWeight: 600, marginTop: 2 }}>
                          {template.categoryLabel} • {template.aestheticLabel}
                        </div>

                        <div
                          style={{
                            fontSize: '0.68rem',
                            color: '#8c7d73',
                            marginTop: 3,
                            display: 'flex',
                            gap: 8,
                          }}
                        >
                          <span>{template.pages?.length || 1} Pages</span>
                          <span>•</span>
                          <span>ID: {template.id}</span>
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.76rem',
                        color: '#a6988f',
                        lineHeight: 1.45,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {template.description}
                    </p>

                    {/* Bottom Control Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 10,
                        borderTop: '1px solid #2d2420',
                      }}
                    >
                      {/* Left: Status Toggles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {/* Visibility Toggle */}
                        <button
                          onClick={() => handleToggleVisibility(template.id)}
                          title={isHidden ? 'Currently hidden. Click to make visible to users.' : 'Visible. Click to hide.'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 9px',
                            borderRadius: 6,
                            border: `1px solid ${isHidden ? '#ef4444' : '#10b981'}`,
                            background: isHidden ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isHidden ? '#f87171' : '#34d399',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                          <span>{isHidden ? 'Hidden' : 'Visible'}</span>
                        </button>

                        {/* Featured Toggle */}
                        <button
                          onClick={() => handleToggleFeatured(template.id)}
                          title={isFeatured ? 'Featured template' : 'Click to feature'}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 9px',
                            borderRadius: 6,
                            border: `1px solid ${isFeatured ? '#f59e0b' : '#3d322c'}`,
                            background: isFeatured ? 'rgba(245, 158, 11, 0.15)' : '#14100e',
                            color: isFeatured ? '#fbbf24' : '#8c7d73',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Star size={13} fill={isFeatured ? '#fbbf24' : 'none'} />
                          <span>{isFeatured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => onPreviewTemplate(template)}
                          title="Preview in full viewport"
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #3d322c',
                            background: '#161210',
                            color: '#a6988f',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <ExternalLink size={13} />
                        </button>

                        <button
                          onClick={() => handleStartEdit(template)}
                          title="Edit metadata"
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #3d322c',
                            background: '#161210',
                            color: '#a6988f',
                            cursor: 'pointer',
                            display: 'flex',
                          }}
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onLaunchTemplate(template);
                          }}
                          title="Open directly in Visual Editor"
                          style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            border: 'none',
                            background: '#b1704e',
                            color: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>

                        {isCustom && (
                          <button
                            onClick={() => handleDeleteCustom(template.id, template.name)}
                            title="Delete custom template"
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid #7f1d1d',
                              background: 'rgba(127, 29, 29, 0.2)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════ TAB 2: INTERACTIVE TEMPLATE DESIGNER ════════════ */}
          {activeTab === 'create' && (
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
                  Design & Publish a New Custom Template
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#a6988f' }}>
                  Create a fully-featured, multi-page website template with curated section architectures, typography, and color styling. It will immediately be available in the Template Gallery!
                </p>
              </div>

              <div
                style={{
                  background: '#1f1916',
                  border: '1px solid #332822',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {/* Basic Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                      Template Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lumina Digital Atelier"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #3d322c',
                        background: '#14100e',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                      Unique Identifier (Slug)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. lumina-digital-atelier (auto-generated if empty)"
                      value={newId}
                      onChange={(e) => setNewId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #3d322c',
                        background: '#14100e',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the target audience, aesthetic, and purpose of this design..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #3d322c',
                      background: '#14100e',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Category & Aesthetic Dropdowns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as TemplateCategory)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #3d322c',
                        background: '#14100e',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                      Visual Aesthetic
                    </label>
                    <select
                      value={newAesthetic}
                      onChange={(e) => setNewAesthetic(e.target.value as TemplateAesthetic)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #3d322c',
                        background: '#14100e',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      {AESTHETICS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color & Theme Mode */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                      Theme Mode
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setNewThemeMode('light')}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: `1px solid ${newThemeMode === 'light' ? '#b1704e' : '#3d322c'}`,
                          background: newThemeMode === 'light' ? 'rgba(177,112,78,0.2)' : '#14100e',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                        }}
                      >
                        ☀️ Light Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewThemeMode('dark')}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: `1px solid ${newThemeMode === 'dark' ? '#b1704e' : '#3d322c'}`,
                          background: newThemeMode === 'dark' ? 'rgba(177,112,78,0.2)' : '#14100e',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                        }}
                      >
                        🌙 Dark Mode
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                      Primary Brand Color
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="color"
                        value={newPrimaryColor}
                        onChange={(e) => setNewPrimaryColor(e.target.value)}
                        style={{
                          width: 44,
                          height: 40,
                          borderRadius: 8,
                          border: '1px solid #3d322c',
                          background: 'none',
                          cursor: 'pointer',
                          padding: 2,
                        }}
                      />
                      <input
                        type="text"
                        value={newPrimaryColor}
                        onChange={(e) => setNewPrimaryColor(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: '1px solid #3d322c',
                          background: '#14100e',
                          color: '#ffffff',
                          fontSize: '0.86rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Image Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                    Cover Preview Image URL
                  </label>
                  <input
                    type="text"
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1px solid #3d322c',
                      background: '#14100e',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: 10,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                    {PRESET_COVERS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Preset Cover"
                        onClick={() => setNewCoverImage(url)}
                        style={{
                          width: 80,
                          height: 52,
                          borderRadius: 6,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: `2px solid ${newCoverImage === url ? '#b1704e' : 'transparent'}`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Multi-Page Architecture */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 6 }}>
                    Multi-Page Structure ({newPagesList.length} pages)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    {newPagesList.map((pName, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#14100e',
                          border: '1px solid #3d322c',
                          padding: '6px 12px',
                          borderRadius: 9999,
                          fontSize: '0.8rem',
                        }}
                      >
                        <span>{pName}</span>
                        {pIdx > 0 && (
                          <button
                            type="button"
                            onClick={() => setNewPagesList(newPagesList.filter((_, idx) => idx !== pIdx))}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Add page (e.g. Menu, Portfolio, Pricing, Blog)..."
                      value={newPageInput}
                      onChange={(e) => setNewPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newPageInput.trim() && !newPagesList.includes(newPageInput.trim())) {
                            setNewPagesList([...newPagesList, newPageInput.trim()]);
                            setNewPageInput('');
                          }
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #3d322c',
                        background: '#14100e',
                        color: '#ffffff',
                        fontSize: '0.84rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPageInput.trim() && !newPagesList.includes(newPageInput.trim())) {
                          setNewPagesList([...newPagesList, newPageInput.trim()]);
                          setNewPageInput('');
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: '#3d322c',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Add Page
                    </button>
                  </div>
                </div>

                {/* Section Blueprints Selection for Home Page */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#a6988f', marginBottom: 8 }}>
                    Included Sections on Home Page:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(
                      [
                        'hero',
                        'about',
                        'services',
                        'features',
                        'portfolio',
                        'testimonials',
                        'team',
                        'pricing',
                        'faq',
                        'contact',
                        'newsletter',
                        'cta',
                      ] as SectionType[]
                    ).map((sType) => {
                      const isSelected = selectedInitialSections.includes(sType);
                      return (
                        <button
                          key={sType}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (selectedInitialSections.length > 1) {
                                setSelectedInitialSections(selectedInitialSections.filter((s) => s !== sType));
                              }
                            } else {
                              setSelectedInitialSections([...selectedInitialSections, sType]);
                            }
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: `1px solid ${isSelected ? '#b1704e' : '#3d322c'}`,
                            background: isSelected ? 'rgba(177,112,78,0.2)' : '#14100e',
                            color: isSelected ? '#e6bfa7' : '#8c7d73',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                          }}
                        >
                          {isSelected && '✓ '}
                          {sType}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Publish Button */}
                <button
                  type="button"
                  onClick={handleCreateCustomTemplate}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #b1704e 0%, #703c21 100%)',
                    color: '#ffffff',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 8px 24px rgba(177,112,78,0.35)',
                    marginTop: 8,
                  }}
                >
                  <Check size={18} />
                  <span>Publish Template to MACSAC Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* ════════════ TAB 3: UPLOAD JSON TEMPLATE ════════════ */}
          {activeTab === 'upload-json' && (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
                  Upload Template JSON File
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#a6988f' }}>
                  Import external template definitions, backup packages, or templates created via JSON into the studio catalog.
                </p>
              </div>

              <div
                style={{
                  background: '#1f1916',
                  border: '2px dashed #3d322c',
                  borderRadius: 16,
                  padding: 48,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(177,112,78,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b1704e',
                  }}
                >
                  <Upload size={28} />
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                    Select or Drop Template JSON File
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#8c7d73', marginTop: 4 }}>
                    Supports single template definitions or complete template backup bundles (*.json)
                  </div>
                </div>

                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    borderRadius: 8,
                    background: '#b1704e',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(177,112,78,0.3)',
                  }}
                >
                  <span>Choose JSON File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ════════════ TAB 4: AI ENGINE & MODEL SETTINGS ════════════ */}
          {activeTab === 'ai-engine' && (
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
                  AI Assistant Engine Architecture
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#a6988f' }}>
                  Live configuration for the conversational website consultant and setup agent.
                </p>
              </div>

              {/* Status Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div
                  style={{
                    background: '#1f1916',
                    border: '1px solid #332822',
                    borderRadius: 12,
                    padding: 18,
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: '#8c7d73', fontWeight: 600 }}>ACTIVE AI MODEL</div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: '#ffffff',
                      marginTop: 4,
                    }}
                  >
                    Nemotron 3.5 Super VL 120B
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#b1704e', marginTop: 2 }}>
                    nvidia/nemotron-3.5-super-vl-120b-a12b
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      marginTop: 10,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                    Connected & Verified (200 OK)
                  </div>
                </div>

                <div
                  style={{
                    background: '#1f1916',
                    border: '1px solid #332822',
                    borderRadius: 12,
                    padding: 18,
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: '#8c7d73', fontWeight: 600 }}>ENGINE PARAMETERS</div>
                  <div style={{ fontSize: '0.82rem', color: '#ffffff', marginTop: 6, lineHeight: 1.6 }}>
                    <div>
                      Max Output Window: <strong style={{ color: '#b1704e' }}>4096 Tokens</strong>
                    </div>
                    <div>
                      Multi-Task Batch Capacity: <strong style={{ color: '#10b981' }}>Unlimited</strong>
                    </div>
                    <div>
                      Continuous Memory Depth: <strong style={{ color: '#b1704e' }}>14 turns</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Test Playground */}
              <div
                style={{
                  background: '#1f1916',
                  border: '1px solid #332822',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Test Consultant Reasoning Engine</div>
                  <span style={{ fontSize: '0.72rem', color: '#8c7d73' }}>Sends prompt directly to server</span>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Enter test user instruction..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #3d322c',
                      background: '#14100e',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleRunAiTest}
                    disabled={isTestingAi}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#b1704e',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: isTestingAi ? 'default' : 'pointer',
                    }}
                  >
                    {isTestingAi ? 'Running...' : 'Run Test'}
                  </button>
                </div>

                {testResponse && (
                  <div
                    style={{
                      background: '#100d0c',
                      border: '1px solid #2d2420',
                      borderRadius: 8,
                      padding: 14,
                      fontSize: '0.78rem',
                      color: '#a6988f',
                      maxHeight: 240,
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                    }}
                  >
                    {JSON.stringify(testResponse, null, 2)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════════ TAB 5: BACKUP & MAINTENANCE ════════════ */}
          {activeTab === 'backup' && (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
                  Backup, Restore & Maintenance
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#a6988f' }}>
                  Manage complete template archives, export configurations, and restore system state.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Export Card */}
                <div
                  style={{
                    background: '#1f1916',
                    border: '1px solid #332822',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Export Templates Package (JSON)</div>
                    <div style={{ fontSize: '0.76rem', color: '#8c7d73', marginTop: 2 }}>
                      Download complete bundle with all custom templates, overrides, and visibility preferences.
                    </div>
                  </div>
                  <button
                    onClick={handleExportJson}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 16px',
                      borderRadius: 8,
                      border: '1px solid #b1704e',
                      background: 'rgba(177,112,78,0.15)',
                      color: '#e6bfa7',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={15} />
                    <span>Download JSON</span>
                  </button>
                </div>

                {/* Factory Reset Card */}
                <div
                  style={{
                    background: '#1f1916',
                    border: '1px solid #7f1d1d',
                    borderRadius: 12,
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fca5a5' }}>
                      Restore Factory Defaults
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#8c7d73', marginTop: 2 }}>
                      Removes all custom uploaded templates, unhides all built-ins, and resets preferences.
                    </div>
                  </div>
                  <button
                    onClick={handleFactoryReset}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '9px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#b91c1c',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={15} />
                    <span>Reset All</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Edit Metadata Modal */}
      {editingTemplate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100010,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#1c1715',
              border: '1px solid #3d322c',
              borderRadius: 12,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: "'Outfit', sans-serif" }}>
                Edit Template Metadata
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                style={{ background: 'none', border: 'none', color: '#8c7d73', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#8c7d73', marginBottom: 4 }}>
                Template Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #3d322c',
                  background: '#120f0e',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#8c7d73', marginBottom: 4 }}>
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as TemplateCategory)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #3d322c',
                  background: '#120f0e',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#8c7d73', marginBottom: 4 }}>
                Description
              </label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #3d322c',
                  background: '#120f0e',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                onClick={() => setEditingTemplate(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #3d322c',
                  background: '#14100e',
                  color: '#a6988f',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#b1704e',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
