import React from 'react';
import {
  X,
  FolderGit2,
  Clock,
  Copy,
  Trash2,
  Edit3,
  Info,
  Plus,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId?: string;
  onOpenProject: (project: Project) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onNewProject,
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90vw',
          maxWidth: 680,
          maxHeight: '85vh',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--grad-copper)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderGit2 size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>My Saved Websites</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} saved locally
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 6, color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Local Storage Disclaimer Notice */}
        <div
          style={{
            padding: '12px 24px',
            background: 'var(--copper-glow)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Info size={16} style={{ color: 'var(--copper-medium)', flexShrink: 0 }} />
          <span>
            Projects are saved locally in your browser storage. Remember to export your complete HTML/CSS ZIP bundle for permanent backups.
          </span>
        </div>

        {/* Projects List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: isActive ? '2px solid var(--copper-medium)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{proj.name}</h3>
                        {isActive && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: 'var(--copper-medium)',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: 4,
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>Template: {proj.templateName}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {formatDate(proj.updatedAt)}
                        </span>
                        <span>•</span>
                        <span>{proj.pages.length} Pages</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => {
                          onOpenProject(proj);
                          onClose();
                        }}
                        className="btn-primary btn-sm"
                        style={{ padding: '7px 16px' }}
                      >
                        <Edit3 size={14} /> Open
                      </button>
                      <button
                        onClick={() => onDuplicateProject(proj.id)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                        }}
                        title="Duplicate Project"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${proj.name}"? This action cannot be undone.`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        style={{
                          padding: '7px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-primary)',
                          color: '#f87171',
                        }}
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <FolderGit2 size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>No saved projects yet</p>
              <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
                Choose any template from the gallery to start customizing.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => {
              onClose();
              onNewProject();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.85rem',
              color: 'var(--copper-medium)',
              fontWeight: 700,
            }}
          >
            <Plus size={16} /> Choose New Template
          </button>
          <button onClick={onClose} className="btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
