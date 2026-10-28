import React, { useState } from 'react';
import {
  X,
  Upload,
  Tag,
  ArrowRight,
  Image as ImageIcon,
  Check,
  Trash2,
  RefreshCcw,
} from 'lucide-react';
import { UserWebsiteDetails } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: UserWebsiteDetails) => void;
  initialDetails?: UserWebsiteDetails | null;
  /** Called when user wants to wipe all details and start fresh */
  onClear?: () => void;
}

const POPULAR_KEYWORD_SUGGESTIONS = [
  'Creative Agency',
  'Artisan Bakery',
  'AI Startup',
  'Photography',
  'Fine Jewelry',
  'Architecture',
  'Corporate Advisory',
  'Boutique Hotel',
  'Destination Wedding',
  'Specialty Coffee',
  'Clean Beauty',
  'Nonprofit Foundation',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialDetails,
  onClear,
}) => {
  const [brandName, setBrandName] = useState(initialDetails?.brandName || '');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialDetails?.keywords || []);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialDetails?.logoUrl);
  const [imageUrls, setImageUrls] = useState<string[]>(initialDetails?.imageUrls || []);

  if (!isOpen) return null;

  // Handle adding keywords from input
  const handleAddKeyword = (val: string) => {
    const trimmed = val.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

    // Support comma separated split
    const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
    const updated = Array.from(new Set([...keywords, ...parts]));
    setKeywords(updated);
    setKeywordInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddKeyword(keywordInput);
    }
  };

  const handleRemoveKeyword = (tagToRemove: string) => {
    setKeywords(keywords.filter((t) => t !== tagToRemove));
  };

  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle images file upload
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywordInput.trim()) {
      handleAddKeyword(keywordInput);
    }
    onSubmit({
      brandName: brandName.trim(),
      keywords: keywords,
      logoUrl: logoUrl,
      imageUrls: imageUrls,
    });
  };

  const handleSkip = () => {
    onSubmit({
      brandName: brandName.trim(),
      keywords: keywords,
      logoUrl: logoUrl,
      imageUrls: imageUrls,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '92vw',
          maxWidth: 620,
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
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
              Step 1 • Website Personalization
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Enter Your Website Details
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Tell us your brand name and focus so we can personalize your template.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: 6, color: 'var(--text-muted)', borderRadius: 6 }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          
          {/* 1. Business / Brand / Organization Name */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>
              Business / Brand / Organization Name <span style={{ color: 'var(--copper-medium)' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Lumina Studio, Artisan Bakehouse, Novatech AI"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--copper-medium)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              This will automatically be placed into your template's logo, hero section, and navigation.
            </span>
          </div>

          {/* 2. Website Keywords */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>
              Website Keywords
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-primary)',
              padding: '6px 12px',
              gap: 8,
              flexWrap: 'wrap',
            }}>
              <Tag size={16} style={{ color: 'var(--copper-medium)', flexShrink: 0 }} />
              
              {/* Existing keyword tags */}
              {keywords.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--copper-glow)',
                    color: 'var(--copper-dark)',
                    border: '1px solid rgba(177, 112, 78, 0.3)',
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(tag)}
                    style={{ color: 'inherit', padding: 1, display: 'flex' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (keywordInput.trim()) handleAddKeyword(keywordInput);
                }}
                placeholder={keywords.length === 0 ? "Type keywords separated by commas or press Enter..." : "Add more..."}
                style={{
                  flex: 1,
                  minWidth: 160,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  padding: '4px 0',
                }}
              />
            </div>

            {/* Quick Suggestion Chips */}
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Suggestions:</span>
              {POPULAR_KEYWORD_SUGGESTIONS.slice(0, 6).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleAddKeyword(sug)}
                  style={{
                    fontSize: '0.74rem',
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Logo Upload (Optional) */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>
              Brand Logo <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            {logoUrl ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img src={logoUrl} alt="Uploaded logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={14} /> Logo Uploaded
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Will be applied to website navigation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoUrl(undefined)}
                  style={{ color: '#f87171', padding: 6 }}
                  title="Remove Logo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--border-color)',
                  background: 'var(--bg-primary)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <Upload size={18} style={{ color: 'var(--copper-medium)' }} />
                <span>Click or drag to upload logo (PNG, SVG, JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* 4. Website Images Upload (Optional) */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>
              Website Images <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </label>
            
            {imageUrls.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                {imageUrls.map((url, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      width: 70,
                      height: 55,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <img src={url} alt={`Upload ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-color)',
                background: 'var(--bg-primary)',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.86rem',
              }}
            >
              <ImageIcon size={18} style={{ color: 'var(--copper-medium)' }} />
              <span>Upload hero or section photos (or choose from stock later)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border-color)', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={handleSkip}
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                Skip optional fields &amp; browse
              </button>

              {/* Clear all details — only shown when editing existing details */}
              {onClear && initialDetails?.brandName && (
                <button
                  type="button"
                  onClick={() => { onClear(); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.82rem',
                    color: '#f87171',
                    fontWeight: 600,
                    background: 'none',
                    border: '1px solid rgba(248,113,113,0.3)',
                    borderRadius: 6,
                    padding: '5px 10px',
                    cursor: 'pointer',
                  }}
                  title="Remove all saved details and personalization"
                >
                  <RefreshCcw size={13} /> Clear &amp; Start Fresh
                </button>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              Explore Templates
              <ArrowRight size={16} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
