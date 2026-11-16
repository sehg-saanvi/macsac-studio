import React, { useState } from 'react';
import {
  Sun,
  Moon,
  FolderGit2,
  Compass,
  HelpCircle,
  User,
  LogOut,
  FileEdit,
  XCircle,
  Sparkles,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { UserAccount, UserWebsiteDetails } from '../types';

interface NavbarProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  savedProjectsCount: number;
  onOpenProjects: () => void;
  onExploreTemplates: () => void;
  onOpenHowItWorks: () => void;
  onStartCreating: () => void;
  onOpenAiAgent?: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  websiteDetails: UserWebsiteDetails | null;
  onEditDetails: () => void;
  onClearDetails?: () => void;
  onGoHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onToggleTheme,
  savedProjectsCount,
  onOpenProjects,
  onExploreTemplates,
  onOpenHowItWorks,
  onStartCreating,
  onOpenAiAgent,
  currentUser,
  onOpenAuth,
  onLogout,
  websiteDetails,
  onEditDetails,
  onClearDetails,
  onGoHome,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header className="studio-nav">
      <div className="container nav-wrapper">
        {/* Zone 1: Left Brand Logo */}
        <div className="nav-zone nav-zone-left">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onGoHome) {
                onGoHome();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="brand-link"
            title="MACSAC Studio — Home"
          >
            <img
              src="/m-logo.png"
              alt="MACSAC Logo"
              className="brand-logo-img"
            />
            <div className="brand-text-block">
              <span className="brand-title">
                MACSAC <span className="studio-pill">STUDIO</span>
              </span>
              <span className="brand-sub">By MACSAC Multimedia</span>
            </div>
          </a>
        </div>

        {/* Zone 2: Center Navigation Capsule (Distinct Island, No Overlap) */}
        <div className="nav-zone nav-zone-center">
          <nav className="nav-links">
            <button
              onClick={() => handleLinkClick(onExploreTemplates)}
              className="nav-link"
            >
              <Compass size={16} />
              <span>Explore Templates</span>
            </button>

            {/* Website Details indicator / button */}
            <div className="nav-brand-group">
              <button
                onClick={() => handleLinkClick(onEditDetails)}
                className={`nav-link ${websiteDetails?.brandName ? 'nav-link-active-brand' : ''}`}
                title="Edit your website details and keywords"
              >
                <FileEdit size={16} />
                {websiteDetails?.brandName ? (
                  <span className="nav-brand-text">
                    Brand: <strong>{websiteDetails.brandName}</strong>
                  </span>
                ) : (
                  <span>Enter Details</span>
                )}
              </button>

              {websiteDetails?.brandName && onClearDetails && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearDetails();
                  }}
                  className="nav-clear-btn"
                  title="Clear website details & start fresh"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => handleLinkClick(onOpenHowItWorks)}
              className="nav-link"
            >
              <HelpCircle size={16} />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => handleLinkClick(onOpenProjects)}
              className="nav-link"
            >
              <FolderGit2 size={16} />
              <span>My Websites</span>
              {savedProjectsCount > 0 && (
                <span className="nav-projects-badge">
                  {savedProjectsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Zone 3: Right Action Controls */}
        <div className="nav-zone nav-zone-right">
          <div className="nav-controls">
            {/* AI Consultant Trigger */}
            {onOpenAiAgent && (
              <button
                onClick={onOpenAiAgent}
                className="btn-ai-nav"
                title="Open AI Website Setup & Management Agent"
              >
                <Sparkles size={14} color="var(--copper-light)" />
                <span>AI Agent</span>
              </button>
            )}

            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="user-profile-group">
                <div className="user-badge-nav">
                  <div className="user-avatar-initial">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text">{currentUser.fullName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="btn-logout-nav"
                  title="Log Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn-auth-nav"
              >
                Sign In
              </button>
            )}

            {/* Start Creating CTA */}
            <button
              onClick={onStartCreating}
              className="btn-primary btn-sm nav-cta-btn"
            >
              <span>Start Creating</span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-toggle"
              aria-label="Toggle Navigation Menu"
              title="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer">
          <div className="nav-mobile-links">
            <button
              onClick={() => handleLinkClick(onExploreTemplates)}
              className="nav-mobile-link"
            >
              <Compass size={18} />
              <span>Explore Templates</span>
            </button>

            <button
              onClick={() => handleLinkClick(onEditDetails)}
              className="nav-mobile-link"
            >
              <FileEdit size={18} />
              <span>
                {websiteDetails?.brandName
                  ? `Brand: ${websiteDetails.brandName}`
                  : 'Enter Website Details'}
              </span>
            </button>

            <button
              onClick={() => handleLinkClick(onOpenHowItWorks)}
              className="nav-mobile-link"
            >
              <HelpCircle size={18} />
              <span>How It Works</span>
            </button>

            <button
              onClick={() => handleLinkClick(onOpenProjects)}
              className="nav-mobile-link"
            >
              <FolderGit2 size={18} />
              <span>My Websites</span>
              {savedProjectsCount > 0 && (
                <span className="nav-projects-badge">
                  {savedProjectsCount}
                </span>
              )}
            </button>

            {onOpenAiAgent && (
              <button
                onClick={() => handleLinkClick(onOpenAiAgent)}
                className="nav-mobile-link nav-mobile-ai"
              >
                <Sparkles size={18} color="var(--copper-light)" />
                <span>AI Website Consultant</span>
              </button>
            )}

            <button
              onClick={() => handleLinkClick(onStartCreating)}
              className="btn-primary"
              style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            >
              Start Creating
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
