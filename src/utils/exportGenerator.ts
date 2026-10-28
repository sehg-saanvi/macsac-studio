import JSZip from 'jszip';
import { Project, WebsitePage, WebsiteSection, WebsiteTheme } from '../types';

export function generatePageHtml(
  page: WebsitePage,
  project: Project,
  allPages: WebsitePage[]
): string {
  const theme = project.theme;
  const pageTitle = `${page.name} | ${project.name}`;

  const navLinksHtml = allPages
    .map(p => {
      const href = p.isHome || p.slug === 'home' ? 'index.html' : `${p.slug}.html`;
      const isActive = p.id === page.id ? 'active' : '';
      return `<li class="nav-item ${isActive}"><a href="${href}">${p.name}</a></li>`;
    })
    .join('\n            ');

  const sectionsHtml = page.sections
    .map(sec => renderSectionToHtml(sec, theme))
    .join('\n\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(project.settings.description || 'Crafted with MACSAC Studio.')}">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body data-theme="${theme.mode}">

  <!-- MACSAC Studio Navigation -->
  <header class="site-header">
    <div class="nav-container">
      <a href="index.html" class="logo-wrapper" style="display:flex;align-items:center;gap:10px;">
        ${project.navigation.logoImage ? `<img src="${project.navigation.logoImage}" alt="${escapeHtml(project.navigation.logoText || project.name)}" style="max-height:36px;max-width:120px;object-fit:contain;">` : ''}
        <span class="brand-logo-text">${escapeHtml(project.navigation.logoText || project.name)}</span>
      </a>
      
      <nav class="nav-desktop">
        <ul class="nav-menu">
          ${navLinksHtml}
        </ul>
      </nav>

      <div class="nav-actions">
        ${
          project.navigation.ctaText
            ? `<a href="${project.navigation.ctaUrl || '#contact'}" class="btn btn-primary nav-cta">${escapeHtml(project.navigation.ctaText)}</a>`
            : ''
        }
        <button id="mobile-menu-toggle" class="mobile-toggle-btn" aria-label="Toggle navigation menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-nav-drawer" class="mobile-drawer">
      <ul class="mobile-menu">
        ${navLinksHtml}
      </ul>
      ${
        project.navigation.ctaText
          ? `<a href="${project.navigation.ctaUrl || '#contact'}" class="btn btn-primary mobile-cta">${escapeHtml(project.navigation.ctaText)}</a>`
          : ''
      }
    </div>
  </header>

  <main>
    ${sectionsHtml}
  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <h3 class="footer-title">${escapeHtml(project.footer.brandName || project.name)}</h3>
          <p class="footer-tagline">${escapeHtml(project.footer.tagline || 'Engineered with MACSAC Studio.')}</p>
        </div>
        <div class="footer-links">
          ${allPages
            .map(p => {
              const href = p.isHome || p.slug === 'home' ? 'index.html' : `${p.slug}.html`;
              return `<a href="${href}">${p.name}</a>`;
            })
            .join('\n          ')}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copyright">${escapeHtml(project.footer.copyright || `© ${new Date().getFullYear()} ${project.name}. All rights reserved.`)}</p>
        <p class="footer-credit">Built with <a href="https://macsacmultimedia.com" target="_blank" rel="noopener">MACSAC Multimedia</a></p>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
}

export function renderSectionToHtml(sec: WebsiteSection, _theme: WebsiteTheme): string {
  const alignClass = sec.textAlign === 'center' ? 'text-center' : '';
  const paddingClass = `pad-${sec.paddingY || 'normal'}`;

  switch (sec.type) {
    case 'hero':
      return `
    <section id="${sec.id}" class="section-hero ${sec.layoutVariant} ${paddingClass} ${alignClass}">
      <div class="container hero-container">
        <div class="hero-content">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h1 class="hero-title">${escapeHtml(sec.title)}</h1>
          ${sec.description ? `<p class="hero-desc">${escapeHtml(sec.description)}</p>` : ''}
          <div class="hero-actions">
            ${sec.primaryBtn?.show ? `<a href="${sec.primaryBtn.url}" class="btn btn-primary">${escapeHtml(sec.primaryBtn.text)}</a>` : ''}
            ${sec.secondaryBtn?.show ? `<a href="${sec.secondaryBtn.url}" class="btn btn-secondary">${escapeHtml(sec.secondaryBtn.text)}</a>` : ''}
          </div>
        </div>
        ${sec.image ? `
        <div class="hero-visual">
          <img src="${sec.image}" alt="${escapeHtml(sec.imageAlt || sec.title)}" class="hero-img" loading="eager">
        </div>` : ''}
      </div>
    </section>`;

    case 'about':
      return `
    <section id="${sec.id}" class="section-about ${paddingClass} ${alignClass}">
      <div class="container about-container ${sec.layoutVariant}">
        ${sec.image ? `
        <div class="about-visual">
          <img src="${sec.image}" alt="${escapeHtml(sec.imageAlt || sec.title)}" class="rounded-img" loading="lazy">
        </div>` : ''}
        <div class="about-content">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(sec.title)}</h2>
          ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
          ${sec.items && sec.items.length > 0 ? `
          <div class="stats-grid">
            ${sec.items.map(it => `
              <div class="stat-card">
                <span class="stat-number">${escapeHtml(it.title)}</span>
                <span class="stat-label">${escapeHtml(it.subtitle || '')}</span>
              </div>
            `).join('')}
          </div>` : ''}
          ${sec.primaryBtn?.show ? `<div style="margin-top:24px;"><a href="${sec.primaryBtn.url}" class="btn btn-primary">${escapeHtml(sec.primaryBtn.text)}</a></div>` : ''}
        </div>
      </div>
    </section>`;

    case 'services':
    case 'features':
      return `
    <section id="${sec.id}" class="section-cards ${paddingClass} ${alignClass}">
      <div class="container">
        <div class="section-header">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(sec.title)}</h2>
          ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
        </div>
        <div class="cards-grid">
          ${(sec.items || []).map(it => `
            <div class="feature-card">
              ${it.tag ? `<span class="card-tag">${escapeHtml(it.tag)}</span>` : ''}
              <h3 class="card-title">${escapeHtml(it.title)}</h3>
              ${it.description ? `<p class="card-desc">${escapeHtml(it.description)}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;

    case 'portfolio':
      return `
    <section id="${sec.id}" class="section-portfolio ${paddingClass} ${alignClass}">
      <div class="container">
        <div class="section-header">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(sec.title)}</h2>
          ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
        </div>
        <div class="portfolio-grid">
          ${(sec.items || []).map(it => `
            <div class="portfolio-card">
              ${it.image ? `<div class="portfolio-img-wrap"><img src="${it.image}" alt="${escapeHtml(it.title)}" loading="lazy"></div>` : ''}
              <div class="portfolio-info">
                ${it.tag ? `<span class="portfolio-tag">${escapeHtml(it.tag)}</span>` : ''}
                <h3 class="portfolio-title">${escapeHtml(it.title)}</h3>
                ${it.subtitle ? `<p class="portfolio-subtitle">${escapeHtml(it.subtitle)}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;

    case 'testimonials':
      return `
    <section id="${sec.id}" class="section-testimonials ${paddingClass} ${alignClass}">
      <div class="container">
        <div class="section-header">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(sec.title)}</h2>
          ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
        </div>
        <div class="testimonials-grid">
          ${(sec.items || []).map(it => `
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <p class="testimonial-quote">"${escapeHtml(it.description || '')}"</p>
              <div class="testimonial-author">
                ${it.image ? `<img src="${it.image}" alt="${escapeHtml(it.author || '')}" class="avatar">` : ''}
                <div>
                  <h4 class="author-name">${escapeHtml(it.author || it.title)}</h4>
                  <p class="author-role">${escapeHtml(it.role || it.subtitle || '')}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;

    case 'pricing':
      return `
    <section id="${sec.id}" class="section-pricing ${paddingClass} ${alignClass}">
      <div class="container">
        <div class="section-header">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(sec.title)}</h2>
          ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
        </div>
        <div class="pricing-grid">
          ${(sec.items || []).map(it => `
            <div class="pricing-card ${it.tag === 'RECOMMENDED' || it.tag === 'MOST POPULAR' ? 'featured' : ''}">
              ${it.tag ? `<span class="pricing-badge">${escapeHtml(it.tag)}</span>` : ''}
              <h3 class="plan-name">${escapeHtml(it.title)}</h3>
              <div class="plan-price">
                <span class="amount">${escapeHtml(it.price || '')}</span>
                ${it.period ? `<span class="period">/${escapeHtml(it.period)}</span>` : ''}
              </div>
              ${it.description ? `<p class="plan-desc">${escapeHtml(it.description)}</p>` : ''}
              <a href="#contact" class="btn btn-primary plan-btn">Select Tier</a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;

    case 'contact':
      return `
    <section id="${sec.id}" class="section-contact ${paddingClass} ${alignClass}">
      <div class="container contact-container">
        <div class="contact-info">
          ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
          <h2 class="section-title">${escapeHtml(sec.title)}</h2>
          ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
          <div class="contact-details">
            ${(sec.items || []).map(it => `
              <div class="contact-item">
                <strong class="contact-label">${escapeHtml(it.title)}:</strong>
                <span class="contact-value">${escapeHtml(it.subtitle || '')}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="contact-form-wrap">
          <form class="contact-form" onsubmit="event.preventDefault(); alert('Thank you for reaching out! Your message has been received.');">
            <div class="form-group">
              <label for="form-name">Your Name</label>
              <input type="text" id="form-name" required placeholder="Alex Mercer">
            </div>
            <div class="form-group">
              <label for="form-email">Your Email</label>
              <input type="email" id="form-email" required placeholder="alex@example.com">
            </div>
            <div class="form-group">
              <label for="form-message">Message</label>
              <textarea id="form-message" rows="4" required placeholder="Tell us about your project..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </section>`;

    case 'cta':
      return `
    <section id="${sec.id}" class="section-cta ${paddingClass} text-center">
      <div class="container cta-container">
        ${sec.badge ? `<span class="badge badge-light">${escapeHtml(sec.badge)}</span>` : ''}
        <h2 class="cta-title">${escapeHtml(sec.title)}</h2>
        ${sec.description ? `<p class="cta-desc">${escapeHtml(sec.description)}</p>` : ''}
        <div class="cta-actions">
          ${sec.primaryBtn?.show ? `<a href="${sec.primaryBtn.url}" class="btn btn-primary">${escapeHtml(sec.primaryBtn.text)}</a>` : ''}
          ${sec.secondaryBtn?.show ? `<a href="${sec.secondaryBtn.url}" class="btn btn-secondary">${escapeHtml(sec.secondaryBtn.text)}</a>` : ''}
        </div>
      </div>
    </section>`;

    default:
      return `
    <section id="${sec.id}" class="section-generic ${paddingClass} ${alignClass}">
      <div class="container">
        ${sec.badge ? `<span class="badge">${escapeHtml(sec.badge)}</span>` : ''}
        <h2 class="section-title">${escapeHtml(sec.title)}</h2>
        ${sec.description ? `<p class="section-desc">${escapeHtml(sec.description)}</p>` : ''}
      </div>
    </section>`;
  }
}

export function generateStyleCss(theme: WebsiteTheme): string {
  return `/* 
   MACSAC Studio Generated Stylesheet
   Theme: ${theme.name}
*/

:root {
  --primary: ${theme.primaryColor};
  --secondary: ${theme.secondaryColor};
  --accent: ${theme.accentColor};
  --bg: ${theme.bgColor};
  --text: ${theme.textColor};
  --text-muted: ${theme.textMuted};
  --card-bg: ${theme.cardBg};
  --border: ${theme.borderColor};
  --radius: ${theme.borderRadius};
  --font-heading: ${theme.headingFont};
  --font-body: ${theme.bodyFont};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
  font-weight: 700;
  color: var(--text);
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Spacing */
.pad-compact { padding: 48px 0; }
.pad-normal { padding: 80px 0; }
.pad-spacious { padding: 120px 0; }

.text-center { text-align: center; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  opacity: 0.92;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}

.btn-secondary:hover {
  background: var(--card-bg);
  border-color: var(--primary);
}

/* Badge */
.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(177, 112, 78, 0.12);
  color: var(--primary);
  margin-bottom: 16px;
  border: 1px solid rgba(177, 112, 78, 0.2);
}

/* Navigation */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 0.04em;
  color: var(--text);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 28px;
}

.nav-item a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.nav-item a:hover,
.nav-item.active a {
  color: var(--primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-toggle-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.mobile-toggle-btn span {
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
}

.mobile-drawer {
  display: none;
  padding: 24px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.mobile-drawer.open {
  display: block;
}

.mobile-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

/* Hero Section */
.hero-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 48px;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  margin-bottom: 20px;
}

.hero-desc {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-bottom: 32px;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-img {
  width: 100%;
  border-radius: var(--radius);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  object-fit: cover;
  max-height: 480px;
}

/* Grids & Cards */
.section-header {
  margin-bottom: 48px;
}

.section-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin-bottom: 16px;
}

.section-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.cards-grid,
.portfolio-grid,
.testimonials-grid,
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.feature-card,
.testimonial-card,
.pricing-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover,
.testimonial-card:hover,
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
}

.card-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
  display: inline-block;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 12px;
}

.card-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Portfolio Cards */
.portfolio-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.25s ease;
}

.portfolio-card:hover {
  transform: translateY(-4px);
}

.portfolio-img-wrap img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.portfolio-info {
  padding: 20px;
}

.portfolio-tag {
  font-size: 0.7rem;
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
}

.portfolio-title {
  font-size: 1.15rem;
  margin: 6px 0;
}

.portfolio-subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Pricing Cards */
.pricing-card.featured {
  border-color: var(--primary);
  box-shadow: 0 8px 30px rgba(177, 112, 78, 0.15);
  position: relative;
}

.pricing-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
}

.plan-price {
  margin: 16px 0;
}

.plan-price .amount {
  font-size: 2.2rem;
  font-weight: 800;
  font-family: var(--font-heading);
}

.plan-price .period {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.plan-btn {
  width: 100%;
  margin-top: 24px;
}

/* Contact */
.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.contact-details {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-form-wrap {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 36px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.submit-btn {
  width: 100%;
}

/* Footer */
.site-footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border);
  padding: 64px 0 32px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 32px;
}

.footer-title {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.footer-tagline {
  color: var(--text-muted);
  font-size: 0.95rem;
  max-width: 380px;
}

.footer-links {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.85rem;
  flex-wrap: wrap;
  gap: 12px;
}

/* Responsive Media Queries */
@media (max-width: 900px) {
  .hero-container,
  .contact-container {
    grid-template-columns: 1fr;
  }
  
  .nav-desktop {
    display: none;
  }
  
  .mobile-toggle-btn {
    display: flex;
  }
}
`;
}

export function generateScriptJs(): string {
  return `// MACSAC Studio Interactive JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer navigation toggle
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
  }

  // Smooth scroll anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          if (drawer && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
          }
        }
      }
    });
  });

  console.log('Website initialized. Created with MACSAC Studio.');
});
`;
}

export function generateReadmeMd(project: Project): string {
  return `# ${project.name}

Exported from **MACSAC Studio** — Powered by [MACSAC Multimedia](https://macsacmultimedia.com/).

This is a complete, self-contained, and production-ready website with clean semantic HTML, modular CSS, responsive layouts, and interactive JavaScript.

---

## 🚀 Quick Start (Local Preview)

No build tools or compilers are required!

1. **Option A (Instant):** Double-click \`index.html\` to open it directly in any modern web browser.
2. **Option B (Local Dev Server):**
   \`\`\`bash
   # Using npx (Node.js)
   npx serve .
   
   # Or using Python
   python -m http.server 8000
   \`\`\`
   Then visit \`http://localhost:8000\` in your browser.

---

## 🌐 Deploying to the Web (Free Hosting)

You can launch this website online for free in under 2 minutes:

### 1. Netlify (Drag & Drop)
- Go to [Netlify Drop](https://app.netlify.com/drop)
- Drag this entire unzipped folder into the browser window.
- Your website is live with an instant SSL certificate!

### 2. Vercel
- Install Vercel CLI (\`npm i -g vercel\`) or link your GitHub repo.
- Run \`vercel\` in this folder and press Enter.

### 3. MACSAC Multimedia Cloud Hosting
- Need ultra-fast NVMe hosting, sub-12ms response times, and automated backups?
- Visit [https://macsacmultimedia.com/](https://macsacmultimedia.com/) to host with 99.99% SLA uptime.

---

## 📁 File Structure

\`\`\`
├── index.html        # Main landing page
${project.pages.filter(p => !p.isHome && p.slug !== 'home').map(p => `├── ${p.slug}.html       # ${p.name} page`).join('\n')}
├── style.css         # Customized design system, typography, colors & mobile rules
├── script.js        # Mobile drawer toggle and interactive smooth scrolling
└── README.md         # Deployment guide & documentation
\`\`\`

---

## 🎨 Theme & Typography
- **Theme Preset:** ${project.theme.name}
- **Primary Color:** \`${project.theme.primaryColor}\`
- **Heading Font:** \`${project.theme.headingFont}\`
- **Body Font:** \`${project.theme.bodyFont}\`

---

*Crafted with precision using MACSAC Studio.*
`;
}

export function wrapGrapesHtmlInDocument(bodyHtml: string, project: Project): string {
  const theme = project.theme;
  const pageTitle = `${project.name} | Official Website`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(project.settings?.description || 'Crafted with MACSAC Studio.')}">
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body data-theme="${theme.mode}">
  ${bodyHtml}
  <script src="script.js"></script>
</body>
</html>`;
}

export async function downloadProjectZip(
  project: Project,
  overrideHtml?: string,
  overrideCss?: string
): Promise<void> {
  const zip = new JSZip();

  const customHtml = overrideHtml || project.grapesHtml;
  const customCss = overrideCss || project.grapesCss;

  if (customHtml) {
    const fullHtml = customHtml.includes('<!DOCTYPE html>')
      ? customHtml
      : wrapGrapesHtmlInDocument(customHtml, project);
    zip.file('index.html', fullHtml);

    // Multi-page export if secondary pages exist
    for (const page of project.pages) {
      if (!page.isHome && page.slug !== 'home') {
        const pageHtml = page.grapesHtml
          ? (page.grapesHtml.includes('<!DOCTYPE html>') ? page.grapesHtml : wrapGrapesHtmlInDocument(page.grapesHtml, project))
          : generatePageHtml(page, project, project.pages);
        zip.file(`${page.slug}.html`, pageHtml);
      }
    }
  } else {
    // Add all HTML pages
    for (const page of project.pages) {
      const filename = page.isHome || page.slug === 'home' ? 'index.html' : `${page.slug}.html`;
      const htmlContent = generatePageHtml(page, project, project.pages);
      zip.file(filename, htmlContent);
    }
  }

  // Add CSS
  const baseCss = generateStyleCss(project.theme);
  const finalCss = customCss ? `${baseCss}\n\n/* GrapesJS Visual Customizations */\n${customCss}` : baseCss;
  zip.file('style.css', finalCss);

  // Add JS
  const jsContent = generateScriptJs();
  zip.file('script.js', jsContent);

  // Add README
  const readmeContent = generateReadmeMd(project);
  zip.file('README.md', readmeContent);

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const safeName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  a.download = `${safeName}-macsac-website.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
