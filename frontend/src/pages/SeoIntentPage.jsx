import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSeoIntentPage } from '../content/seoIntentPages.js';
import '../styles/landing.css';

function InternalLink({ href, className, children }) {
  if (!href) return null;
  if (href.startsWith('#')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

function SeoIntentPage({ pageKey }) {
  const [openFaq, setOpenFaq] = useState(0);
  const page = getSeoIntentPage(pageKey);

  if (!page) {
    return null;
  }

  const cta = page.cta || {};
  const comparisonColumns = page.comparison?.columns || [];

  return (
    <div className="landing ai-theme">
      <div className="floating-cards-global">
        <div className="floating-card card-1">A♠</div>
        <div className="floating-card card-2">K♥</div>
        <div className="floating-card card-3">Q♦</div>
        <div className="floating-card card-4">J♣</div>
        <div className="floating-card card-5">10♠</div>
        <div className="floating-card card-6">9♥</div>
        <div className="floating-card card-7">8♦</div>
        <div className="floating-card card-8">7♣</div>
      </div>

      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <Link to="/poker-software">Software</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      <main>
        <section className="landing-hero" style={{ paddingBottom: '3rem' }}>
          <div className="hero-glow"></div>
          <div className="hero-content seo-hero-content">
            <div className="seo-badge-row">
              {page.badges?.map((badge) => (
                <span key={badge} className="seo-badge-pill">
                  {badge}
                </span>
              ))}
            </div>

            <h1>
              {page.heroTitle}
              <br />
              <span className="gradient-text">{page.heroAccent}</span>
            </h1>

            <p className="hero-desc seo-hero-desc">{page.heroDescription}</p>

            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Start Free Trial
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <InternalLink
                href={page.secondaryCta?.href || '/pricing'}
                className="btn-hero-secondary"
              >
                {page.secondaryCta?.label || 'View Pricing'}
              </InternalLink>
            </div>

            {page.heroSignals?.length > 0 && (
              <div className="seo-signal-row">
                {page.heroSignals.map((signal) => (
                  <div key={signal} className="seo-signal-card">
                    {signal}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="seo-copy-block">
            <span className="section-tag">Why This Page Exists</span>
            <h2>{page.introHeading}</h2>
            {page.introParagraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {page.featureSection && (
          <section className="landing-features">
            <div className="features-header">
              <span className="section-tag">{page.featureSection.tag}</span>
              <h2>{page.featureSection.title}</h2>
              <p>{page.featureSection.description}</p>
            </div>
            <div className="features-grid">
              {page.featureSection.items.map((item, index) => (
                <div
                  key={item.title}
                  className={`feature-card ${index === 0 ? 'featured' : ''}`}
                >
                  <div className="feature-icon seo-feature-icon">
                    <span>{item.icon}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {page.proofSection && (
          <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
            <div className="features-header">
              <span className="section-tag">{page.proofSection.tag}</span>
              <h2>{page.proofSection.title}</h2>
              <p>{page.proofSection.description}</p>
            </div>
            <div className="features-grid seo-proof-grid">
              {page.proofSection.items.map((item) => (
                <div key={item.title} className="feature-card seo-proof-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {page.comparison && (
          <section className="landing-features">
            <div className="features-header">
              <span className="section-tag">{page.comparison.tag}</span>
              <h2>{page.comparison.title}</h2>
              <p>{page.comparison.description}</p>
            </div>
            <div className="seo-comparison-wrap">
              <table className="seo-comparison-table">
                <thead>
                  <tr>
                    {comparisonColumns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.comparison.rows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {row.values.map((value) => (
                        <td key={`${row.label}-${value}`}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page.stepsSection && (
          <section className="landing-steps">
            <div className="steps-header">
              <span className="section-tag">{page.stepsSection.tag}</span>
              <h2>{page.stepsSection.title}</h2>
            </div>
            <div className="steps-row seo-steps-row">
              {page.stepsSection.items.map((step, index) => (
                <React.Fragment key={step.title}>
                  <div className="step-item">
                    <div className="step-num">{index + 1}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  {index < page.stepsSection.items.length - 1 && (
                    <div className="step-connector"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

        {page.resources?.length > 0 && (
          <section className="landing-features">
            <div className="features-header">
              <span className="section-tag">Related Pages</span>
              <h2>Keep the topic cluster connected</h2>
              <p>Each page should branch into the next useful intent instead of trapping the user in one static article.</p>
            </div>
            <div className="seo-resource-grid">
              {page.resources.map((resource) => (
                <Link key={resource.href} to={resource.href} className="seo-resource-card">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="seo-resource-link">Open page</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {page.faqItems?.length > 0 && (
          <section className="faq-section-ai">
            <div className="features-header">
              <span className="section-tag">FAQ</span>
              <h2>Questions this page should answer clearly</h2>
            </div>
            <div className="faq-accordion">
              {page.faqItems.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={item.question}
                    className={`faq-item ${isOpen ? 'open' : ''}`}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setOpenFaq(isOpen ? -1 : index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="faq-question">
                      <span>{item.question}</span>
                      <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                    </div>
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="landing-cta">
          <div className="cta-card">
            <h2>{cta.title}</h2>
            <p>{cta.description}</p>
            <div className="cta-buttons">
              <InternalLink href={cta.primaryHref || '/signup'} className="btn-hero-primary">
                {cta.primaryLabel || 'Start Free Trial'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </InternalLink>
              <InternalLink
                href={cta.secondaryHref || '/pricing'}
                className="btn-hero-secondary"
              >
                {cta.secondaryLabel || 'View Pricing'}
              </InternalLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer-ai">
        <div className="footer-brand-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="footer-logo" />
        </div>
        <div className="footer-links-ai">
          <Link to="/poker-software">Software</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SeoIntentPage;
