import React from 'react';
import { ExternalLink, Heart, Shield, MessageSquare } from 'lucide-react';

interface FooterProps {
  onExploreTemplates: () => void;
  onOpenHowItWorks: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onExploreTemplates, onOpenHowItWorks }) => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '70px 0 32px',
      }}
    >
      <div className="container">
        
        {/* Top 4-column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            marginBottom: 50,
          }}
        >
          {/* Brand info */}
          <div style={{ maxWidth: 300 }}>
            <a
              href="https://macsacmultimedia.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginBottom: 16,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
              title="Visit MACSAC Multimedia Website (macsacmultimedia.com)"
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.85';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <img
                src="/macsac-logo.png"
                alt="MACSAC Multimedia"
                style={{
                  height: 38,
                  width: 'auto',
                  maxWidth: 240,
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </a>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              A free website template customization platform engineered by MACSAC Multimedia. Choose a design, make it yours, and export production code without writing a single line.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              Studio Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <li>
                <button onClick={onExploreTemplates} style={{ color: 'inherit' }}>
                  Explore All Templates
                </button>
              </li>
              <li>
                <button onClick={onOpenHowItWorks} style={{ color: 'inherit' }}>
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* MACSAC Ecosystem */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              MACSAC Multimedia
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <li>
                <a
                  href="https://macsacmultimedia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'inherit' }}
                >
                  Official Agency Site <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://macsacmultimedia.com/#page-hosting" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                  High-Speed Cloud Hosting
                </a>
              </li>
              <li>
                <a href="https://macsacmultimedia.com/#page-smm" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                  Social Media (SMM) & Video
                </a>
              </li>
              <li>
                <a href="https://macsacmultimedia.com/#faq" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                  Knowledge Base & SLAs
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Agency Connect */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              Direct Connect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              <a
                href="https://wa.me/917428299476?text=Hi%20MACSAC%2C%20I%20am%20using%20MACSAC%20Studio%20and%20would%20like%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#10b981',
                  fontWeight: 600,
                }}
              >
                <MessageSquare size={16} /> WhatsApp: +91 74282 99476
              </a>
              <a
                href="https://instagram.com/macsacmultimedia"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit' }}
              >
                Instagram: @macsacmultimedia
              </a>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Email: macsacmultimedia@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: 24,
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.84rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p>© {new Date().getFullYear()} MACSAC Studio • An initiative by MACSAC Multimedia. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Crafted for creators & businesses</span>
            <span>•</span>
            <span style={{ color: 'var(--copper-medium)', fontWeight: 600 }}>100% Free Website Code</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
