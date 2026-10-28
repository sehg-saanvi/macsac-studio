import React from 'react';
import { Sun, Moon, FolderGit2, Compass, HelpCircle, User, LogOut, FileEdit, XCircle } from 'lucide-react';
import { UserAccount, UserWebsiteDetails } from '../types';

interface NavbarProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  savedProjectsCount: number;
  onOpenProjects: () => void;
  onExploreTemplates: () => void;
  onOpenHowItWorks: () => void;
  onStartCreating: () => void;
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
  currentUser,
  onOpenAuth,
  onLogout,
  websiteDetails,
  onEditDetails,
  onClearDetails,
  onGoHome,
}) => {
  return (
    <header className="studio-nav">
      <div className="container nav-wrapper">
        {/* Brand Logo */}
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
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
          title="MACSAC Studio — Home"
        >
          <img
            src="/m-logo.png"
            alt="MACSAC Logo"
            style={{
              height: 38,
              width: 'auto',
              maxHeight: 38,
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))',
            }}
          />
          <div className="brand-text-block">
            <span className="brand-title">
              MACSAC <span className="studio-pill">STUDIO</span>
            </span>
            <span className="brand-sub">By MACSAC Multimedia</span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="nav-links" style={{ display: 'flex' }}>
          <button onClick={onExploreTemplates} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Compass size={16} />
            Explore Templates
          </button>
          
          {/* Website Details indicator / button */}
          <button
            onClick={onEditDetails}
            className="nav-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: websiteDetails?.brandName ? 'var(--copper-medium)' : 'var(--text-secondary)',
              fontWeight: websiteDetails?.brandName ? 700 : 500,
            }}
            title="Edit your website details and keywords"
          >
            <FileEdit size={16} />
            {websiteDetails?.brandName ? (
              <span>Brand: <strong>{websiteDetails.brandName}</strong></span>
            ) : (
              <span>Enter Details</span>
            )}
          </button>

          {/* Clear details button — only visible when details exist */}
          {websiteDetails?.brandName && onClearDetails && (
            <button
              onClick={onClearDetails}
              className="nav-link"
              title="Clear website details & start fresh"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                padding: '4px 8px',
              }}
            >
              <XCircle size={14} />
              Clear
            </button>
          )}

          <button onClick={onOpenHowItWorks} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HelpCircle size={16} />
            How It Works
          </button>

          <button 
            onClick={onOpenProjects} 
            className="nav-link" 
            style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}
          >
            <FolderGit2 size={16} />
            My Websites
            {savedProjectsCount > 0 && (
              <span style={{
                background: 'var(--copper-medium)',
                color: 'white',
                borderRadius: '999px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}>
                {savedProjectsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Nav Actions */}
        <div className="nav-controls">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--copper-medium)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span>{currentUser.fullName}</span>
              </div>
              <button
                onClick={onLogout}
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                }}
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
              }}
            >
              Sign In
            </button>
          )}

          {/* Start Creating CTA */}
          <button onClick={onStartCreating} className="btn-primary btn-sm">
            Start Creating
          </button>
        </div>
      </div>
    </header>
  );
};
