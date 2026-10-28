import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  FileCode,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project } from '../types';
import {
  generatePageHtml,
  generateStyleCss,
  generateScriptJs,
  generateReadmeMd,
  downloadProjectZip,
  wrapGrapesHtmlInDocument,
} from '../utils/exportGenerator';

interface ExportModalProps {
  project: Project | null;
  onClose: () => void;
}

type CodeTab = 'html' | 'css' | 'js' | 'readme';

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<CodeTab>('html');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!project) return null;

  const activePage = project.pages.find(p => p.id === project.activePageId) || project.pages[0];

  const htmlCode = project.grapesHtml
    ? (project.grapesHtml.includes('<!DOCTYPE html>') ? project.grapesHtml : wrapGrapesHtmlInDocument(project.grapesHtml, project))
    : generatePageHtml(activePage, project, project.pages);
  const cssCode = project.grapesCss
    ? `${generateStyleCss(project.theme)}\n\n/* GrapesJS Custom Styles */\n${project.grapesCss}`
    : generateStyleCss(project.theme);
  const jsCode = generateScriptJs();
  const readmeCode = generateReadmeMd(project);

  const getCodeContent = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'js': return jsCode;
      case 'readme': return readmeCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadProjectZip(project);
      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b1704e', '#e6bfa7', '#703c21', '#10b981'],
      });
    } catch (err) {
      console.error('Error downloading zip', err);
      alert('Failed to generate ZIP package. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{
          width: '90vw',
          maxWidth: 960,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary)',
          }}
        >
          <div>
            <div className="badge-copper" style={{ marginBottom: 6 }}>
              <Download size={13} /> Production Ready Export
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Export {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 6,
              color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Banner with One-Click Download */}
        <div
          style={{
            padding: '18px 24px',
            background: 'var(--copper-glow)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Download Complete Website Package (.ZIP)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Includes HTML pages, compiled style.css, script.js, and deployment instructions.
            </p>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Download size={16} />
            {isExporting ? 'Generating ZIP...' : 'Download ZIP Bundle'}
          </button>
        </div>

        {/* Code Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 24px',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setActiveTab('html')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeTab === 'html' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'html' ? 'var(--copper-medium)' : 'var(--text-muted)',
                border: activeTab === 'html' ? '1px solid var(--border-color)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileCode size={14} /> index.html
            </button>
            <button
              onClick={() => setActiveTab('css')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeTab === 'css' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'css' ? 'var(--copper-medium)' : 'var(--text-muted)',
                border: activeTab === 'css' ? '1px solid var(--border-color)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileCode size={14} /> style.css
            </button>
            <button
              onClick={() => setActiveTab('js')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeTab === 'js' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'js' ? 'var(--copper-medium)' : 'var(--text-muted)',
                border: activeTab === 'js' ? '1px solid var(--border-color)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileCode size={14} /> script.js
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeTab === 'readme' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'readme' ? 'var(--copper-medium)' : 'var(--text-muted)',
                border: activeTab === 'readme' ? '1px solid var(--border-color)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileText size={14} /> README.md
            </button>
          </div>

          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: copied ? '#16a34a' : 'var(--text-primary)',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard' : 'Copy Code'}
          </button>
        </div>

        {/* Code Content Viewer */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#0d0d0f', padding: '18px 24px' }}>
          <pre
            style={{
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              color: '#f8fafc',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {getCodeContent()}
          </pre>
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} style={{ color: 'var(--copper-medium)' }} />
            <span>Zero build steps required • Direct browser preview</span>
          </div>
          <a
            href="https://macsacmultimedia.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--copper-medium)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            Deploy on MACSAC Cloud Hosting <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
};
