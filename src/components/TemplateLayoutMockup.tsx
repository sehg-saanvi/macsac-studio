import React from 'react';
import { WebsiteTemplate } from '../types';

interface TemplateLayoutMockupProps {
  template: WebsiteTemplate;
  height?: number;
}

/**
 * CSS-drawn structural silhouette mockup of a template's layout.
 * Each hero variant produces a visually distinct mockup.
 */
export const TemplateLayoutMockup: React.FC<TemplateLayoutMockupProps> = ({
  template,
  height = 230,
}) => {
  const theme = template.theme;
  const heroSection = template.pages[0]?.sections.find((s) => s.type === 'hero');
  const variant = heroSection?.layoutVariant || 'split';
  const bg = theme.bgColor;
  const primary = theme.primaryColor;
  const card = theme.cardBg;
  const border = theme.borderColor;
  const text = theme.textColor;
  const muted = theme.textMuted;
  const isDark = theme.mode === 'dark';

  const Nav = () => (
    <div style={{ height: 22, background: card, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', paddingLeft: 10, paddingRight: 10, gap: 4, flexShrink: 0 }}>
      <div style={{ width: 20, height: 5, background: primary, borderRadius: 2, opacity: 0.9 }} />
      <div style={{ flex: 1 }} />
      <div style={{ width: 20, height: 4, background: `${muted}44`, borderRadius: 2 }} />
      <div style={{ width: 20, height: 4, background: `${muted}44`, borderRadius: 2 }} />
      <div style={{ width: 20, height: 4, background: `${muted}44`, borderRadius: 2 }} />
      <div style={{ width: 26, height: 13, background: primary, borderRadius: 3, marginLeft: 4 }} />
    </div>
  );

  const renderHero = () => {
    switch (variant) {
      case 'cinema':
        return (
          <div style={{ flex: 1, background: isDark ? '#0c0a09' : '#1c1815', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.65) 100%)' }} />
            <div style={{ position: 'relative', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '10px 14px', textAlign: 'center', width: '52%' }}>
              <div style={{ width: '40%', height: 3, background: `${primary}aa`, borderRadius: 9999, margin: '0 auto 5px' }} />
              <div style={{ width: '85%', height: 6, background: 'rgba(255,255,255,0.8)', borderRadius: 2, margin: '0 auto 4px' }} />
              <div style={{ width: '60%', height: 4, background: 'rgba(255,255,255,0.45)', borderRadius: 2, margin: '0 auto 8px' }} />
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                <div style={{ width: 32, height: 9, background: primary, borderRadius: 3 }} />
                <div style={{ width: 26, height: 9, background: 'rgba(255,255,255,0.15)', borderRadius: 3 }} />
              </div>
            </div>
          </div>
        );
      case 'terminal':
        return (
          <div style={{ flex: 1, background: '#0a0d12', display: 'flex', gap: 8, padding: '10px 12px', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ width: 60, height: 4, background: '#38bdf833', borderRadius: 2 }} />
              <div style={{ width: '85%', height: 6, background: '#f8fafc99', borderRadius: 2 }} />
              <div style={{ width: '70%', height: 4, background: '#94a3b844', borderRadius: 2 }} />
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                <div style={{ width: 36, height: 9, background: primary, borderRadius: 3 }} />
                <div style={{ width: 28, height: 9, background: '#33415566', borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ width: '38%', background: '#0f172a', border: '1px solid #334155', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ background: '#1e293b', padding: '3px 6px', display: 'flex', gap: 3, borderBottom: '1px solid #334155' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ width: '75%', height: 3, background: '#38bdf833', borderRadius: 1 }} />
                <div style={{ width: '90%', height: 3, background: '#e2e8f022', borderRadius: 1 }} />
                <div style={{ width: '60%', height: 3, background: '#22c55e33', borderRadius: 1 }} />
                <div style={{ width: '80%', height: 3, background: '#e2e8f011', borderRadius: 1 }} />
              </div>
            </div>
          </div>
        );
      case 'bento':
        return (
          <div style={{ flex: 1, background: bg, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ textAlign: 'center', marginBottom: 2 }}>
              <div style={{ width: '50%', height: 6, background: `${text}cc`, borderRadius: 2, margin: '0 auto 3px' }} />
              <div style={{ width: '38%', height: 3, background: `${muted}55`, borderRadius: 2, margin: '0 auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 5, flex: 1 }}>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, padding: 6 }}>
                <div style={{ width: '80%', height: 3, background: `${muted}33`, borderRadius: 1, marginBottom: 4 }} />
                <div style={{ flex: 1, height: 45, background: `${primary}18`, borderRadius: 3 }} />
              </div>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, padding: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: 14, height: 14, background: `${primary}1a`, borderRadius: 3, marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 800, color: text }}>99%</div>
                <div style={{ width: '80%', height: 3, background: `${muted}33`, borderRadius: 1, marginTop: 3 }} />
              </div>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, padding: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: 14, height: 14, background: `${primary}1a`, borderRadius: 3, marginBottom: 4 }} />
                <div style={{ width: '80%', height: 4, background: `${text}88`, borderRadius: 1, marginBottom: 3 }} />
                <div style={{ width: '60%', height: 3, background: `${muted}33`, borderRadius: 1 }} />
              </div>
            </div>
          </div>
        );
      case 'asymmetric':
        return (
          <div style={{ flex: 1, background: bg, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ width: '70%', height: 8, background: text, borderRadius: 2 }} />
            <div style={{ width: '55%', height: 5, background: `${text}66`, borderRadius: 2 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 8, flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
                <div style={{ width: '80%', height: 3, background: `${muted}33`, borderRadius: 1 }} />
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div style={{ width: 34, height: 9, background: primary, borderRadius: 3 }} />
                  <div style={{ width: 26, height: 9, background: border, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', background: `${primary}1a`, borderRadius: 4, minHeight: 55 }} />
                <div style={{ position: 'absolute', bottom: -5, left: -7, background: card, border: `1px solid ${border}`, borderRadius: 3, padding: '2px 5px', display: 'flex', gap: 3, alignItems: 'center' }}>
                  <div style={{ width: 5, height: 5, background: primary, borderRadius: '50%' }} />
                  <div style={{ width: 28, height: 3, background: `${muted}55`, borderRadius: 1 }} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'minimal':
        return (
          <div style={{ flex: 1, background: bg, padding: '14px 16px', borderBottom: `2px solid ${border}`, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ width: 36, height: 3, background: primary, borderRadius: 1 }} />
            <div style={{ width: '85%', height: 10, background: text, borderRadius: 2 }} />
            <div style={{ width: '68%', height: 7, background: text, borderRadius: 2, opacity: 0.65 }} />
            <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1, marginTop: 4 }} />
            <div style={{ width: '75%', height: 3, background: `${muted}33`, borderRadius: 1 }} />
            <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
              <div style={{ width: 48, height: 13, background: primary, borderRadius: 4 }} />
              <div style={{ width: 38, height: 13, background: border, borderRadius: 4 }} />
            </div>
          </div>
        );
      case 'neo-brutalist': {
        const nbBg = isDark ? '#0a0a0a' : '#f5f0e8';
        const nbFg = isDark ? '#fff' : '#0a0a0a';
        return (
          <div style={{ flex: 1, background: nbBg, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 5, background: primary }} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '10px 12px', borderRight: `3px solid ${primary}`, display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'center' }}>
                <div style={{ width: 46, height: 4, background: `${primary}cc`, border: `1px solid ${primary}` }} />
                <div style={{ width: '90%', height: 8, background: nbFg }} />
                <div style={{ width: '70%', height: 6, background: nbFg, opacity: 0.65 }} />
                <div style={{ width: '80%', height: 3, background: `${muted}55`, marginTop: 2 }} />
                <div style={{ display: 'flex', marginTop: 5 }}>
                  <div style={{ width: 38, height: 11, background: primary, boxShadow: `2px 2px 0 ${primary}88` }} />
                  <div style={{ width: 30, height: 11, background: 'transparent', border: `2px solid ${nbFg}`, marginLeft: 6 }} />
                </div>
              </div>
              <div style={{ background: `${primary}14`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 2, left: 4, fontSize: 32, fontWeight: 900, color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', lineHeight: 1, userSelect: 'none' }}>01</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: primary }} />
              </div>
            </div>
          </div>
        );
      }
      case 'portrait':
        return (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr' }}>
            <div style={{ background: `linear-gradient(160deg, ${primary}2a, ${primary}0e)`, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '55%', height: 2, background: 'rgba(255,255,255,0.35)', borderRadius: 1 }} />
            </div>
            <div style={{ padding: '10px 12px', background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 2, background: primary }} />
              <div style={{ width: '85%', height: 7, background: text, borderRadius: 2 }} />
              <div style={{ width: '68%', height: 5, background: `${text}66`, borderRadius: 2 }} />
              <div style={{ width: 28, height: 2, background: primary, marginTop: 1 }} />
              <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                <div style={{ width: 34, height: 10, background: primary, borderRadius: 3 }} />
                <div style={{ width: 28, height: 10, background: border, borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', gap: 9, marginTop: 7, paddingTop: 7, borderTop: `1px solid ${border}` }}>
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <div style={{ width: 18, height: 5, background: primary, borderRadius: 1 }} />
                    <div style={{ width: 26, height: 3, background: `${muted}33`, borderRadius: 1, marginTop: 2 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'swiss': {
        const swBg = isDark ? '#0e0e0e' : '#f8f8f6';
        const swFg = isDark ? '#fff' : '#0a0a0a';
        return (
          <div style={{ flex: 1, background: swBg, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 6, borderBottom: `1.5px solid ${isDark ? '#2a2a2a' : '#ddd'}` }}>
              <div style={{ width: 28, height: 3, background: primary, borderRadius: 1 }} />
              <div style={{ flex: 1, height: 1, background: border }} />
              <div style={{ width: 22, height: 3, background: `${muted}44`, borderRadius: 1 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 8, alignItems: 'end', flex: 1 }}>
              <div>
                <div style={{ width: '100%', height: 12, background: swFg, marginBottom: 3 }} />
                <div style={{ width: '80%', height: 8, background: swFg, opacity: 0.65 }} />
              </div>
              <div style={{ paddingLeft: 8, borderLeft: `2px solid ${primary}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
                <div style={{ width: '80%', height: 3, background: `${muted}33`, borderRadius: 1 }} />
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ width: 24, height: 8, background: primary }} />
                  <div style={{ width: 20, height: 8, background: `${swFg}22`, border: `1px solid ${swFg}44` }} />
                </div>
              </div>
            </div>
            <div style={{ height: 28, background: `${primary}14`, marginTop: 2 }} />
          </div>
        );
      }
      case 'typographic': {
        const tyBg = isDark ? '#050505' : '#fff';
        const tyFg = isDark ? '#fff' : '#050505';
        return (
          <div style={{ flex: 1, background: tyBg, padding: '10px 14px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 56, fontWeight: 900, color: 'transparent', WebkitTextStroke: isDark ? '1px rgba(255,255,255,0.05)' : '1px rgba(0,0,0,0.05)', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>DESIGN</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 32, height: 3, background: primary, borderRadius: 1, marginBottom: 7 }} />
              <div style={{ width: '95%', height: 11, background: tyFg, marginBottom: 3 }} />
              <div style={{ width: '80%', height: 8, background: tyFg, opacity: 0.6, marginBottom: 3 }} />
              <div style={{ width: '58%', height: 6, background: tyFg, opacity: 0.4 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 7, borderTop: `1px solid ${isDark ? '#222' : '#eee'}`, position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1, marginBottom: 3 }} />
                <div style={{ width: '80%', height: 3, background: `${muted}33`, borderRadius: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <div style={{ width: 36, height: 11, background: primary, borderRadius: 4 }} />
                <div style={{ width: 28, height: 11, background: border, borderRadius: 4 }} />
              </div>
            </div>
          </div>
        );
      }
      case 'organic':
        return (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
            <div style={{ padding: '11px 13px', background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 2, background: primary }} />
                <div style={{ width: 28, height: 3, background: `${primary}77`, borderRadius: 1 }} />
              </div>
              <div style={{ width: '85%', height: 7, background: text, borderRadius: 2 }} />
              <div style={{ width: '68%', height: 5, background: `${text}66`, borderRadius: 2 }} />
              <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                <div style={{ width: 40, height: 12, background: primary, borderRadius: 9999 }} />
                <div style={{ width: 32, height: 12, background: border, borderRadius: 9999 }} />
              </div>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${primary}2a, ${primary}0d)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: `radial-gradient(circle at 70% 40%, ${primary}55, transparent 60%)` }} />
            </div>
          </div>
        );
      case 'magazine-cover': {
        const mcBg = isDark ? '#0c0c0c' : '#f9f7f4';
        const mcFg = isDark ? '#fff' : '#0a0a0a';
        return (
          <div style={{ flex: 1, background: mcBg, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '4px 10px', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#e0ddd6'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 48, height: 6, background: mcFg, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 5 }}>
                <div style={{ width: 18, height: 4, background: `${muted}44`, borderRadius: 1 }} />
                <div style={{ width: 18, height: 4, background: primary, borderRadius: 1 }} />
              </div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '9px 11px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: 32, height: 3, background: primary, borderRadius: 1, marginBottom: 5 }} />
                  <div style={{ width: '90%', height: 7, background: mcFg, borderRadius: 1, marginBottom: 3 }} />
                  <div style={{ width: '72%', height: 5, background: mcFg, opacity: 0.55, borderRadius: 1, marginBottom: 5 }} />
                  <div style={{ width: '85%', height: 3, background: `${muted}33`, borderRadius: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: 4, paddingTop: 6, borderTop: `1px solid ${isDark ? '#2a2a2a' : '#e0ddd6'}` }}>
                  {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 3, background: `${muted}44`, borderRadius: 1 }} />)}
                </div>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${primary}1a, ${primary}0a)`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 5, right: 5, fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1, userSelect: 'none' }}>12</div>
              </div>
            </div>
          </div>
        );
      }
      case 'architect':
      case 'diagonal': {
        const arcBg = isDark ? '#0d0d0d' : '#f4f3f0';
        const arcFg = isDark ? '#fff' : '#0a0a0a';
        return (
          <div style={{ flex: 1, background: arcBg, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '42%', height: '100%', background: `linear-gradient(135deg, ${primary}28, ${primary}0d)`, clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)' }} />
            <div style={{ position: 'relative', zIndex: 1, padding: '11px 13px', width: '58%', display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 16, height: 2, background: primary }} />
                <div style={{ width: 30, height: 3, background: `${primary}77`, borderRadius: 1 }} />
              </div>
              <div style={{ width: '90%', height: 8, background: arcFg }} />
              <div style={{ width: '73%', height: 6, background: arcFg, opacity: 0.6 }} />
              <div style={{ width: '85%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                <div style={{ width: 40, height: 11, background: primary }} />
                <div style={{ width: 32, height: 11, background: `${arcFg}22` }} />
              </div>
            </div>
          </div>
        );
      }
      case 'luxury-stacked':
        return (
          <div style={{ flex: 1, background: bg, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '52%', background: `linear-gradient(135deg, ${primary}28, ${primary}0d)`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.45) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 5, left: 10 }}>
                <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.45)', borderRadius: 1 }} />
              </div>
            </div>
            <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '65%', height: 6, background: text, borderRadius: 2 }} />
              <div style={{ width: 24, height: 2, background: primary }} />
              <div style={{ width: '55%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                <div style={{ width: 36, height: 11, background: primary, borderRadius: 4 }} />
                <div style={{ width: 28, height: 11, background: border, borderRadius: 4 }} />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ flex: 1, background: bg, padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ width: 36, height: 3, background: `${primary}bb`, borderRadius: 9999 }} />
              <div style={{ width: '85%', height: 7, background: `${text}cc`, borderRadius: 2 }} />
              <div style={{ width: '68%', height: 5, background: `${text}88`, borderRadius: 2 }} />
              <div style={{ width: '90%', height: 3, background: `${muted}44`, borderRadius: 1 }} />
              <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                <div style={{ width: 36, height: 10, background: primary, borderRadius: 4 }} />
                <div style={{ width: 28, height: 10, background: border, borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ height: '80%', background: `${primary}18`, borderRadius: 6, border: `1px solid ${border}` }} />
          </div>
        );
    }
  };

  const SectionStubs = () => {
    const secs = template.pages[0]?.sections.slice(1, 4) || [];
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {secs.map((sec, i) => (
          <div key={sec.id} style={{ height: 20, background: i % 2 === 0 ? bg : card, borderTop: `1px solid ${border}`, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 16, height: 4, background: `${primary}55`, borderRadius: 1 }} />
            <div style={{ width: '35%', height: 3, background: `${muted}2a`, borderRadius: 1 }} />
            <div style={{ flex: 1 }} />
            <div style={{ width: 12, height: 3, background: `${muted}1a`, borderRadius: 1 }} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <Nav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {renderHero()}
      </div>
      <SectionStubs />
    </div>
  );
};

