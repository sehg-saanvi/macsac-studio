import React from 'react';
import { MousePointerClick, Palette, DownloadCloud, Check } from 'lucide-react';

interface HowItWorksProps {
  onStartCreating: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartCreating }) => {
  const steps = [
    {
      number: '01',
      title: 'Choose a Website Template',
      description: 'Explore our curated library of responsive website templates designed for modern businesses, creative portfolios, online stores, and hospitality venues.',
      icon: MousePointerClick,
      highlights: ['Realistic full-page previews', 'Desktop, tablet & mobile views', 'Tested typography & layouts'],
    },
    {
      number: '02',
      title: 'Customize Content & Theme',
      description: 'Effortlessly edit headings, text, buttons, and photos. Pick curated luxury color palettes, typography pairings, and modify layout sections without code.',
      icon: Palette,
      highlights: ['Instant live visual feedback', 'One-click brand color themes', 'Drag-and-drop section order'],
    },
    {
      number: '03',
      title: 'Export & Launch Instantly',
      description: 'Download the complete, self-contained HTML, CSS, and JavaScript website package. Host anywhere you choose or deploy with MACSAC Cloud hosting.',
      icon: DownloadCloud,
      highlights: ['100% code ownership', 'Zero vendor lock-in', 'Sub-12ms hosting ready'],
    },
  ];

  return (
    <section id="how-it-works" style={{
      padding: '80px 0',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 60px' }}>
          <div className="badge-copper" style={{ marginBottom: 14 }}>
            Simple 3-Step Process
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: 16 }}>
            How MACSAC Studio Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            We've eliminated technical complexity. From template discovery to website launch, you stay in total creative control without writing a line of code.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '36px 30px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                {/* Step Number Watermark */}
                <span style={{
                  position: 'absolute',
                  top: 20,
                  right: 24,
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--copper-light)',
                  opacity: 0.35,
                }}>
                  {step.number}
                </span>

                {/* Icon Badge */}
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: 'var(--grad-copper)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  boxShadow: 'var(--shadow-copper)',
                }}>
                  <Icon size={24} />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 12 }}>
                  {step.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                  {step.description}
                </p>

                {/* Checklist */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border-color-light)' }}>
                  {step.highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                      <Check size={14} style={{ color: 'var(--copper-medium)', flexShrink: 0 }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div style={{
          marginTop: 56,
          textAlign: 'center',
        }}>
          <button onClick={onStartCreating} className="btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
            Ready to Build? Choose a Template
          </button>
        </div>

      </div>
    </section>
  );
};
