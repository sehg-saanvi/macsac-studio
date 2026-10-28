import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserAccount, WebsiteTemplate, UserWebsiteDetails } from '../types';
import { saveUserSession } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: WebsiteTemplate | null;
  userDetails: UserWebsiteDetails | null;
  onAuthenticated: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  userDetails,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Authenticate and create user session
    const user: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim() || email.split('@')[0],
      email: email.trim(),
      createdAt: Date.now(),
    };

    saveUserSession(user);
    onAuthenticated(user);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92vw',
          maxWidth: 480,
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary)',
          }}
        >
          <div>
            <div className="badge-copper" style={{ marginBottom: 6 }}>
              <Lock size={12} />
              Step 3 • Sign In to Personalize
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {mode === 'signup' ? 'Create Your Free Account' : 'Welcome Back'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, color: 'var(--text-muted)', borderRadius: 6 }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Context Summary Banner */}
        <div
          style={{
            padding: '12px 24px',
            background: 'var(--copper-glow)',
            borderBottom: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span>Selected: <strong>{selectedTemplate?.name}</strong></span>
            {userDetails?.brandName && (
              <span style={{ display: 'block', color: 'var(--copper-dark)', fontWeight: 600 }}>
                Personalizing for "{userDetails.brandName}"
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.72rem', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, color: 'var(--copper-medium)' }}>
            100% Free
          </span>
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: mode === 'signup' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'signup' ? 'var(--copper-medium)' : 'var(--text-muted)',
              borderBottom: mode === 'signup' ? '2px solid var(--copper-medium)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: mode === 'login' ? 'var(--bg-secondary)' : 'transparent',
              color: mode === 'login' ? 'var(--copper-medium)' : 'var(--text-muted)',
              borderBottom: mode === 'login' ? '2px solid var(--copper-medium)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          
          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                background: '#fef2f2',
                color: '#b91c1c',
                fontSize: '0.82rem',
                marginBottom: 16,
                border: '1px solid #fecaca',
              }}
            >
              {errorMsg}
            </div>
          )}

          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 6 }}>
                Full Name
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
                <User size={16} style={{ color: 'var(--text-muted)', marginRight: 10 }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 6 }}>
              Email Address
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)', marginRight: 10 }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: 6 }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
              <Lock size={16} style={{ color: 'var(--text-muted)', marginRight: 10 }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.96rem' }}
          >
            {mode === 'signup' ? 'Create Account & Open Editor' : 'Log In & Open Editor'}
            <ArrowRight size={16} />
          </button>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: 'var(--copper-medium)' }} />
            Zero credit card required • Preserves your template and keywords
          </div>

        </form>
      </div>
    </div>
  );
};
