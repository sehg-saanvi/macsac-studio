/**
 * MACSAC Studio — GrapesJS Core Custom Blocks Collection
 * Free & Open-Source (BSD-3 Compatible)
 * High-conversion responsive blocks tailored to match template styles
 */

export interface GrapesBlockDef {
  id: string;
  label: string;
  category: string;
  content: string;
  media?: string;
  attributes?: Record<string, any>;
}

export const MACSAC_GRAPES_BLOCKS: GrapesBlockDef[] = [
  // ==========================================
  // CATEGORY: SECTIONS
  // ==========================================
  {
    id: 'block-hero-split',
    label: 'Hero Split Screen',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/><path d="M6 8h3"/><path d="M6 12h4"/></svg>`,
    content: `
      <section class="section-hero split pad-normal">
        <div class="container hero-container" style="display:flex;align-items:center;gap:48px;flex-wrap:wrap;">
          <div class="hero-content" style="flex:1;min-width:300px;">
            <span class="badge">MACSAC STUDIO DESIGN</span>
            <h1 class="hero-title" style="font-size:2.8rem;margin:16px 0;line-height:1.2;">Empower Your Digital Presence</h1>
            <p class="hero-desc" style="font-size:1.1rem;margin-bottom:28px;opacity:0.85;">We build timeless digital architectures, high-conversion web platforms, and magnetic brand experiences that dominate modern markets.</p>
            <div class="hero-actions" style="display:flex;gap:14px;flex-wrap:wrap;">
              <a href="#services" class="btn btn-primary">Explore Services</a>
              <a href="#contact" class="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
          <div class="hero-visual" style="flex:1;min-width:300px;">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" alt="Studio Architecture" class="hero-img" style="width:100%;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.15);" />
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-hero-centered',
    label: 'Hero Centered',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8"/><path d="M9 13h6"/><path d="M10 17h4"/></svg>`,
    content: `
      <section class="section-hero centered pad-spacious text-center">
        <div class="container" style="max-width:860px;margin:0 auto;">
          <span class="badge">EXCLUSIVE COLLECTION</span>
          <h1 class="hero-title" style="font-size:3.2rem;margin:20px 0;line-height:1.15;">Crafted for Visionaries Who Refuse Ordinary</h1>
          <p class="hero-desc" style="font-size:1.2rem;margin-bottom:32px;opacity:0.85;line-height:1.6;">Precision engineering meets aesthetic harmony. Construct seamless digital experiences that evoke authority and drive sustained client trust.</p>
          <div class="hero-actions" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
            <a href="#contact" class="btn btn-primary" style="padding:14px 36px;font-size:1.05rem;">Start Your Journey</a>
            <a href="#about" class="btn btn-secondary" style="padding:14px 32px;">Discover More</a>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-about-stats',
    label: 'About with Stats',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M14 9h4"/><path d="M14 13h4"/><path d="M6 16h12"/></svg>`,
    content: `
      <section class="section-about pad-normal">
        <div class="container about-container split" style="display:flex;align-items:center;gap:48px;flex-wrap:wrap;">
          <div class="about-visual" style="flex:1;min-width:300px;">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" alt="Design team meeting" class="rounded-img" style="width:100%;border-radius:16px;" />
          </div>
          <div class="about-content" style="flex:1;min-width:300px;">
            <span class="badge">OUR PHILOSOPHY</span>
            <h2 class="section-title" style="font-size:2.4rem;margin:16px 0;">Built on Precision, Performance & Distinction</h2>
            <p class="section-desc" style="margin-bottom:24px;line-height:1.65;opacity:0.85;">We eliminate digital noise. Every element is deliberately engineered to amplify your brand presence, cultivate client trust, and deliver tangible results.</p>
            <div class="stats-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;margin:28px 0;">
              <div class="stat-card" style="padding:16px;border-radius:12px;border:1px solid var(--border);text-align:center;">
                <span class="stat-number" style="display:block;font-size:1.8rem;font-weight:800;color:var(--primary);">99.8%</span>
                <span class="stat-label" style="font-size:0.82rem;opacity:0.75;">Client Satisfaction</span>
              </div>
              <div class="stat-card" style="padding:16px;border-radius:12px;border:1px solid var(--border);text-align:center;">
                <span class="stat-number" style="display:block;font-size:1.8rem;font-weight:800;color:var(--primary);">&lt;12ms</span>
                <span class="stat-label" style="font-size:0.82rem;opacity:0.75;">Response Time</span>
              </div>
              <div class="stat-card" style="padding:16px;border-radius:12px;border:1px solid var(--border);text-align:center;">
                <span class="stat-number" style="display:block;font-size:1.8rem;font-weight:800;color:var(--primary);">140+</span>
                <span class="stat-label" style="font-size:0.82rem;opacity:0.75;">Projects Delivered</span>
              </div>
            </div>
            <a href="#services" class="btn btn-primary">Learn Our Methodology</a>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-services-grid',
    label: 'Services / Features',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
    content: `
      <section class="section-cards pad-normal">
        <div class="container">
          <div class="section-header text-center" style="max-width:700px;margin:0 auto 48px;">
            <span class="badge">CAPABILITIES</span>
            <h2 class="section-title" style="font-size:2.4rem;margin:14px 0;">Strategic Solutions Tailored For Scale</h2>
            <p class="section-desc" style="opacity:0.85;">From foundational brand identities to complex web platforms, our multidisciplinary team delivers excellence at every touchpoint.</p>
          </div>
          <div class="cards-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;">
            <div class="feature-card" style="padding:32px 24px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);transition:transform 0.2s;">
              <span class="card-tag" style="display:inline-block;font-size:0.72rem;font-weight:700;color:var(--primary);margin-bottom:12px;">STRATEGY</span>
              <h3 class="card-title" style="font-size:1.35rem;margin-bottom:12px;">Brand Architecture</h3>
              <p class="card-desc" style="opacity:0.8;font-size:0.95rem;line-height:1.6;">Comprehensive visual identities, design systems, and positioning strategies that resonate deeply with discerning audiences.</p>
            </div>
            <div class="feature-card" style="padding:32px 24px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);transition:transform 0.2s;">
              <span class="card-tag" style="display:inline-block;font-size:0.72rem;font-weight:700;color:var(--primary);margin-bottom:12px;">ENGINEERING</span>
              <h3 class="card-title" style="font-size:1.35rem;margin-bottom:12px;">Web Development</h3>
              <p class="card-desc" style="opacity:0.8;font-size:0.95rem;line-height:1.6;">Ultra-responsive, accessible, and fast web applications built on modern lightweight architectures for seamless user engagement.</p>
            </div>
            <div class="feature-card" style="padding:32px 24px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);transition:transform 0.2s;">
              <span class="card-tag" style="display:inline-block;font-size:0.72rem;font-weight:700;color:var(--primary);margin-bottom:12px;">GROWTH</span>
              <h3 class="card-title" style="font-size:1.35rem;margin-bottom:12px;">Conversion & SEO</h3>
              <p class="card-desc" style="opacity:0.8;font-size:0.95rem;line-height:1.6;">Optimized search visibility, semantic markup, and data-informed UX adjustments that elevate conversion metrics and client acquisition.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-portfolio-grid',
    label: 'Portfolio Showcase',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
    content: `
      <section class="section-portfolio pad-normal">
        <div class="container">
          <div class="section-header text-center" style="max-width:700px;margin:0 auto 48px;">
            <span class="badge">SELECTED WORKS</span>
            <h2 class="section-title" style="font-size:2.4rem;margin:14px 0;">Signature Projects & Case Studies</h2>
            <p class="section-desc" style="opacity:0.85;">Explore a curated selection of recent client collaborations and bespoke digital platforms.</p>
          </div>
          <div class="portfolio-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:28px;">
            <div class="portfolio-card" style="border-radius:16px;overflow:hidden;border:1px solid var(--border);background:var(--card-bg);">
              <div class="portfolio-img-wrap" style="height:220px;overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" alt="Digital Platform Showcase" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <div class="portfolio-info" style="padding:20px;">
                <span class="portfolio-tag" style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;">FINTECH IDENTITY</span>
                <h3 class="portfolio-title" style="font-size:1.25rem;margin:8px 0;">Apex Global Capital</h3>
                <p class="portfolio-subtitle" style="font-size:0.88rem;opacity:0.8;">Full brand refresh and responsive executive client portal.</p>
              </div>
            </div>
            <div class="portfolio-card" style="border-radius:16px;overflow:hidden;border:1px solid var(--border);background:var(--card-bg);">
              <div class="portfolio-img-wrap" style="height:220px;overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1542744094-3a31727221eb?auto=format&fit=crop&w=800&q=80" alt="Design System Architecture" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <div class="portfolio-info" style="padding:20px;">
                <span class="portfolio-tag" style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;">SAAS PLATFORM</span>
                <h3 class="portfolio-title" style="font-size:1.25rem;margin:8px 0;">Synthetix AI</h3>
                <p class="portfolio-subtitle" style="font-size:0.88rem;opacity:0.8;">High-conversion landing pages and interactive product dashboard.</p>
              </div>
            </div>
            <div class="portfolio-card" style="border-radius:16px;overflow:hidden;border:1px solid var(--border);background:var(--card-bg);">
              <div class="portfolio-img-wrap" style="height:220px;overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80" alt="Luxury Architectural Brand" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <div class="portfolio-info" style="padding:20px;">
                <span class="portfolio-tag" style="font-size:0.75rem;font-weight:700;color:var(--primary);text-transform:uppercase;">ARCHITECTURE</span>
                <h3 class="portfolio-title" style="font-size:1.25rem;margin:8px 0;">Vanguard Pavilion</h3>
                <p class="portfolio-subtitle" style="font-size:0.88rem;opacity:0.8;">Monochromatic editorial portfolio for luxury architectural studio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-testimonials',
    label: 'Testimonials',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    content: `
      <section class="section-testimonials pad-normal">
        <div class="container">
          <div class="section-header text-center" style="max-width:700px;margin:0 auto 48px;">
            <span class="badge">ENDORSEMENTS</span>
            <h2 class="section-title" style="font-size:2.4rem;margin:14px 0;">Trusted By Industry Leaders</h2>
            <p class="section-desc" style="opacity:0.85;">Discover how our templates and tailored digital solutions deliver measurable impact for founders worldwide.</p>
          </div>
          <div class="testimonials-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;">
            <div class="testimonial-card" style="padding:28px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);">
              <div class="stars" style="color:#f59e0b;font-size:1.2rem;margin-bottom:14px;">★★★★★</div>
              <p class="testimonial-quote" style="font-style:italic;line-height:1.6;margin-bottom:20px;opacity:0.9;">"The architectural elegance and speed of our new website completely redefined how prospective enterprise clients perceive our firm."</p>
              <div class="testimonial-author" style="display:flex;align-items:center;gap:12px;">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Elena Vance" class="avatar" style="width:44px;height:44px;border-radius:50%;object-fit:cover;" />
                <div>
                  <h4 class="author-name" style="font-size:0.95rem;font-weight:700;margin:0;">Elena Vance</h4>
                  <p class="author-role" style="font-size:0.8rem;opacity:0.7;margin:0;">Managing Partner, Lumina Ventures</p>
                </div>
              </div>
            </div>
            <div class="testimonial-card" style="padding:28px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);">
              <div class="stars" style="color:#f59e0b;font-size:1.2rem;margin-bottom:14px;">★★★★★</div>
              <p class="testimonial-quote" style="font-style:italic;line-height:1.6;margin-bottom:20px;opacity:0.9;">"Exported clean HTML/CSS that our DevOps team deployed in minutes with sub-15ms page loads. Genuinely exceptional craftsmanship."</p>
              <div class="testimonial-author" style="display:flex;align-items:center;gap:12px;">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Marcus Sterling" class="avatar" style="width:44px;height:44px;border-radius:50%;object-fit:cover;" />
                <div>
                  <h4 class="author-name" style="font-size:0.95rem;font-weight:700;margin:0;">Marcus Sterling</h4>
                  <p class="author-role" style="font-size:0.8rem;opacity:0.7;margin:0;">CTO, Synthetix AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-pricing',
    label: 'Pricing Tier Table',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    content: `
      <section class="section-pricing pad-normal">
        <div class="container">
          <div class="section-header text-center" style="max-width:700px;margin:0 auto 48px;">
            <span class="badge">INVESTMENT TIERS</span>
            <h2 class="section-title" style="font-size:2.4rem;margin:14px 0;">Transparent, Value-Driven Engagements</h2>
            <p class="section-desc" style="opacity:0.85;">Select the tier that aligns with your operational ambitions and growth milestones.</p>
          </div>
          <div class="pricing-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;">
            <div class="pricing-card" style="padding:32px 24px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);display:flex;flex-direction:column;">
              <h3 class="plan-name" style="font-size:1.35rem;margin-bottom:12px;">Foundation</h3>
              <div class="plan-price" style="margin-bottom:16px;">
                <span class="amount" style="font-size:2.4rem;font-weight:800;color:var(--primary);">$1,499</span>
                <span class="period" style="font-size:0.9rem;opacity:0.75;">/ project</span>
              </div>
              <p class="plan-desc" style="opacity:0.8;font-size:0.9rem;line-height:1.6;margin-bottom:24px;flex:1;">Ideal for emerging boutique businesses needing an authoritative digital flagship and clean exportable code.</p>
              <a href="#contact" class="btn btn-secondary" style="width:100%;text-align:center;">Select Foundation</a>
            </div>
            <div class="pricing-card featured" style="padding:32px 24px;border-radius:16px;border:2px solid var(--primary);background:var(--card-bg);position:relative;display:flex;flex-direction:column;box-shadow:0 12px 36px rgba(177,112,78,0.18);">
              <span class="pricing-badge" style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;font-size:0.72rem;font-weight:800;padding:4px 14px;border-radius:9999px;">MOST POPULAR</span>
              <h3 class="plan-name" style="font-size:1.35rem;margin-bottom:12px;">Growth & Scale</h3>
              <div class="plan-price" style="margin-bottom:16px;">
                <span class="amount" style="font-size:2.4rem;font-weight:800;color:var(--primary);">$3,299</span>
                <span class="period" style="font-size:0.9rem;opacity:0.75;">/ project</span>
              </div>
              <p class="plan-desc" style="opacity:0.8;font-size:0.9rem;line-height:1.6;margin-bottom:24px;flex:1;">Comprehensive multipage website architecture, SEO acceleration, custom component styling, and fast deployment.</p>
              <a href="#contact" class="btn btn-primary" style="width:100%;text-align:center;">Select Growth</a>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-contact-form',
    label: 'Contact Section',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    content: `
      <section class="section-contact pad-normal">
        <div class="container contact-container" style="display:flex;gap:48px;flex-wrap:wrap;">
          <div class="contact-info" style="flex:1;min-width:300px;">
            <span class="badge">CONNECT</span>
            <h2 class="section-title" style="font-size:2.4rem;margin:16px 0;">Let's Construct Your Digital Horizon</h2>
            <p class="section-desc" style="opacity:0.85;line-height:1.65;margin-bottom:28px;">Have an upcoming project or seeking strategic digital direction? Initiate a confidential conversation with our studio partners.</p>
            <div class="contact-details" style="display:flex;flex-direction:column;gap:12px;">
              <div class="contact-item" style="font-size:0.95rem;">
                <strong style="color:var(--primary);">Email:</strong> <span>inquiries@macsacmultimedia.com</span>
              </div>
              <div class="contact-item" style="font-size:0.95rem;">
                <strong style="color:var(--primary);">Location:</strong> <span>Global Digital Studio • Worldwide Availability</span>
              </div>
            </div>
          </div>
          <div class="contact-form-wrap" style="flex:1;min-width:300px;">
            <form class="contact-form" style="display:flex;flex-direction:column;gap:16px;background:var(--card-bg);padding:32px;border-radius:16px;border:1px solid var(--border);">
              <div class="form-group" style="display:flex;flex-direction:column;gap:6px;">
                <label for="c-name" style="font-size:0.85rem;font-weight:600;">Full Name</label>
                <input type="text" id="c-name" placeholder="Alex Mercer" style="padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);" />
              </div>
              <div class="form-group" style="display:flex;flex-direction:column;gap:6px;">
                <label for="c-email" style="font-size:0.85rem;font-weight:600;">Email Address</label>
                <input type="email" id="c-email" placeholder="alex@company.com" style="padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);" />
              </div>
              <div class="form-group" style="display:flex;flex-direction:column;gap:6px;">
                <label for="c-msg" style="font-size:0.85rem;font-weight:600;">Project Scope</label>
                <textarea id="c-msg" rows="4" placeholder="Briefly describe your objectives..." style="padding:10px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);"></textarea>
              </div>
              <button type="button" class="btn btn-primary" style="margin-top:8px;">Transmit Message</button>
            </form>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'block-cta-banner',
    label: 'Call To Action Banner',
    category: 'Sections',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    content: `
      <section class="section-cta pad-normal text-center" style="background:var(--card-bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
        <div class="container" style="max-width:760px;margin:0 auto;">
          <span class="badge">NEXT HORIZON</span>
          <h2 class="cta-title" style="font-size:2.4rem;margin:16px 0;">Ready to Elevate Your Digital Brand?</h2>
          <p class="cta-desc" style="opacity:0.85;margin-bottom:28px;line-height:1.6;">Join forward-thinking creators and enterprise teams who build their flagship web experiences with MACSAC Studio.</p>
          <div class="cta-actions" style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
            <a href="#contact" class="btn btn-primary" style="padding:12px 32px;">Commence Partnership</a>
            <a href="#services" class="btn btn-secondary" style="padding:12px 28px;">Explore Portfolio</a>
          </div>
        </div>
      </section>
    `,
  },

  // ==========================================
  // CATEGORY: LAYOUT & COLUMNS
  // ==========================================
  {
    id: 'block-grid-2col',
    label: '2 Columns Grid',
    category: 'Layout',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/></svg>`,
    content: `
      <div class="container pad-compact">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:24px;">
          <div style="padding:24px;border:1px dashed var(--border);border-radius:12px;background:var(--card-bg);">
            <h3 style="margin-bottom:8px;">Column One</h3>
            <p style="opacity:0.8;">Add your custom content or drag components into this column.</p>
          </div>
          <div style="padding:24px;border:1px dashed var(--border);border-radius:12px;background:var(--card-bg);">
            <h3 style="margin-bottom:8px;">Column Two</h3>
            <p style="opacity:0.8;">Add your custom content or drag components into this column.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'block-grid-3col',
    label: '3 Columns Grid',
    category: 'Layout',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="2" y="4" width="5.5" height="16" rx="1"/><rect x="9.25" y="4" width="5.5" height="16" rx="1"/><rect x="16.5" y="4" width="5.5" height="16" rx="1"/></svg>`,
    content: `
      <div class="container pad-compact">
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:20px;">
          <div style="padding:20px;border:1px dashed var(--border);border-radius:12px;background:var(--card-bg);">
            <h4 style="margin-bottom:8px;">Feature One</h4>
            <p style="font-size:0.9rem;opacity:0.8;">Insert description or media here.</p>
          </div>
          <div style="padding:20px;border:1px dashed var(--border);border-radius:12px;background:var(--card-bg);">
            <h4 style="margin-bottom:8px;">Feature Two</h4>
            <p style="font-size:0.9rem;opacity:0.8;">Insert description or media here.</p>
          </div>
          <div style="padding:20px;border:1px dashed var(--border);border-radius:12px;background:var(--card-bg);">
            <h4 style="margin-bottom:8px;">Feature Three</h4>
            <p style="font-size:0.9rem;opacity:0.8;">Insert description or media here.</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'block-card-container',
    label: 'Content Card Box',
    category: 'Layout',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/></svg>`,
    content: `
      <div style="padding:32px;border-radius:16px;border:1px solid var(--border);background:var(--card-bg);box-shadow:0 8px 24px rgba(0,0,0,0.06);margin:24px 0;">
        <h3 style="font-size:1.4rem;margin-bottom:12px;">Card Box Title</h3>
        <p style="opacity:0.85;line-height:1.6;margin-bottom:20px;">This is a flexible container block. You can place any paragraphs, images, or buttons inside.</p>
        <a href="#" class="btn btn-primary">Take Action</a>
      </div>
    `,
  },

  // ==========================================
  // CATEGORY: BASIC ELEMENTS
  // ==========================================
  {
    id: 'block-heading-h1',
    label: 'Headline H1',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 12h8"/><path d="M4 4v16"/><path d="M12 4v16"/><path d="M17 12l3-2v10"/></svg>`,
    content: `<h1 style="font-size:2.8rem;margin:16px 0;line-height:1.2;">Your Compelling Headline</h1>`,
  },
  {
    id: 'block-heading-h2',
    label: 'Heading H2',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 12h8"/><path d="M4 4v16"/><path d="M12 4v16"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-1-2.5-2.5-2.5S16 10.5 16 12"/></svg>`,
    content: `<h2 style="font-size:2rem;margin:14px 0;line-height:1.3;">Section Sub-Heading</h2>`,
  },
  {
    id: 'block-text-paragraph',
    label: 'Paragraph Text',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>`,
    content: `<p style="font-size:1.05rem;line-height:1.65;opacity:0.85;margin-bottom:16px;">Delivering high-caliber digital architecture tailored specifically to the nuanced demands of contemporary brands.</p>`,
  },
  {
    id: 'block-btn-primary',
    label: 'Primary Button',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="7" width="18" height="10" rx="3"/><path d="M8 12h8"/></svg>`,
    content: `<a href="#" class="btn btn-primary">Primary Action</a>`,
  },
  {
    id: 'block-btn-secondary',
    label: 'Secondary Button',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="7" width="18" height="10" rx="3"/><path d="M8 12h8"/></svg>`,
    content: `<a href="#" class="btn btn-secondary">Secondary Action</a>`,
  },
  {
    id: 'block-badge',
    label: 'Pill Badge Tag',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="4" y="8" width="16" height="8" rx="4"/></svg>`,
    content: `<span class="badge">FEATURED COLLECTION</span>`,
  },
  {
    id: 'block-image',
    label: 'Responsive Image',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    content: `<img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" alt="Showcase Visual" style="width:100%;max-width:800px;border-radius:12px;margin:16px 0;display:block;" />`,
  },
  {
    id: 'block-divider',
    label: 'Divider Line',
    category: 'Elements',
    media: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none"><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
    content: `<hr style="border:none;border-top:1px solid var(--border);margin:36px 0;opacity:0.6;" />`,
  },
];
