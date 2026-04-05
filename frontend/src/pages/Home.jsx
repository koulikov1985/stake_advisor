import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/landing.css';

function Home() {
  const [searchParams] = useSearchParams();
  const [showCanceled, setShowCanceled] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    forceUpdate(n => n + 1);
  }, []);

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true);
      window.history.replaceState({}, '', '/');
    }

    // Capture referral code from URL and store it
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Store referral code in localStorage for 30 days
      const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
      localStorage.setItem('referralCode', refCode.toUpperCase());
      localStorage.setItem('referralCodeExpires', expiresAt.toString());
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <nav className="landing-nav">
          <a href="https://discord.gg/rBCt9yp7" target="_blank" rel="noopener noreferrer" className="nav-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>
                    <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/affiliate">Affiliate</Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost">Login</Link>
              <Link to="/signup" className="nav-btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </header>

      {showCanceled && (
        <div className="canceled-banner">
          <p>Payment was canceled. Feel free to try again when you're ready.</p>
          <button onClick={() => setShowCanceled(false)}>×</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-ultra">
        <div className="hero-bg-effects">
          <div className="hero-glow-main"></div>
          <div className="hero-glow-secondary"></div>
          <div className="hero-grid-overlay"></div>
        </div>

        <div className="hero-content-ultra">
          <div className="hero-badge-pro">
            <span className="badge-pulse"></span>
            <span>Used by 500+ Winning Players</span>
          </div>

          <h1 className="hero-title-ultra">
            Stop Guessing.<br/>
            <span className="gradient-text-ultra">Start Crushing.</span>
          </h1>

          <p className="hero-subtitle-ultra">
            Real-time GTO advice on every hand. Track 6 tables at once.
            See exactly what the pros see — and make +EV decisions every single time.
          </p>

          <div className="hero-cta-group">
            <Link to="/signup" className="btn-cta-primary">
              <span>Get 200 Hands Free</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/features" className="btn-cta-secondary">
              See How It Works
            </Link>
          </div>

          <div className="hero-trust-badges">
            <div className="trust-item">
              <span className="trust-icon">🎁</span>
              <span>200 Free Hands</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>100% Private</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="stats-showcase">
        <div className="stats-container">
          <div className="stat-item-pro">
            <span className="stat-number-pro">+91</span>
            <span className="stat-unit">BB/100</span>
            <span className="stat-desc">Average Win Rate</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-pro">
            <span className="stat-number-pro">6</span>
            <span className="stat-unit">Tables</span>
            <span className="stat-desc">Simultaneous Play</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-pro">
            <span className="stat-number-pro">69%</span>
            <span className="stat-unit">Win Rate</span>
            <span className="stat-desc">All-In Situations</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item-pro">
            <span className="stat-number-pro">&lt;1s</span>
            <span className="stat-unit">Response</span>
            <span className="stat-desc">Real-Time Advice</span>
          </div>
        </div>
      </section>

      {/* Auto-Scrolling Screenshot Showcase */}
      <section className="auto-showcase">
        <div className="showcase-header">
          <span className="section-tag-pro">See It In Action</span>
          <h2 className="section-title-pro">
            Professional-Grade Dashboard<br/>
            <span className="gradient-text-ultra">Built For Winners</span>
          </h2>
        </div>

        <div className="scroll-row large">
          <div className="scroll-track scroll-left">
            <div className="scroll-item large">
              <img src="/images/live-tables.png" alt="Live tables dashboard" />
              <div className="scroll-caption">
                <h4>6 Tables at Once</h4>
                <p>GTO advice on every hand, every table</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/profit-tracker.png" alt="Profit tracker" />
              <div className="scroll-caption">
                <h4>Track Your Profits</h4>
                <p>Beautiful graphs. Real results.</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/calendar.png" alt="P/L Calendar" />
              <div className="scroll-caption">
                <h4>Daily P/L Calendar</h4>
                <p>24 winning days. 1 losing day.</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/hand-replay.png" alt="Hand replay" />
              <div className="scroll-caption">
                <h4>Hand Replay</h4>
                <p>Review every decision street-by-street</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/opponents-board.png" alt="Opponent tracking" />
              <div className="scroll-caption">
                <h4>8,825 Opponents Tracked</h4>
                <p>Know your competition inside out</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/activity-metrics.png" alt="Execution metrics" />
              <div className="scroll-caption">
                <h4>97% Execution Rate</h4>
                <p>Industry-leading accuracy</p>
              </div>
            </div>
            {/* Duplicates for seamless loop */}
            <div className="scroll-item large">
              <img src="/images/live-tables.png" alt="Live tables dashboard" />
              <div className="scroll-caption">
                <h4>6 Tables at Once</h4>
                <p>GTO advice on every hand, every table</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/profit-tracker.png" alt="Profit tracker" />
              <div className="scroll-caption">
                <h4>Track Your Profits</h4>
                <p>Beautiful graphs. Real results.</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/calendar.png" alt="P/L Calendar" />
              <div className="scroll-caption">
                <h4>Daily P/L Calendar</h4>
                <p>24 winning days. 1 losing day.</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/hand-replay.png" alt="Hand replay" />
              <div className="scroll-caption">
                <h4>Hand Replay</h4>
                <p>Review every decision street-by-street</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/opponents-board.png" alt="Opponent tracking" />
              <div className="scroll-caption">
                <h4>8,825 Opponents Tracked</h4>
                <p>Know your competition inside out</p>
              </div>
            </div>
            <div className="scroll-item large">
              <img src="/images/activity-metrics.png" alt="Execution metrics" />
              <div className="scroll-caption">
                <h4>97% Execution Rate</h4>
                <p>Industry-leading accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Feature Pills */}
      <section className="feature-pills-section">
        <div className="pills-container">
          <div className="pill">
            <span className="pill-icon">⚡</span>
            <span className="pill-text">Real-Time GTO</span>
          </div>
          <div className="pill">
            <span className="pill-icon">🎯</span>
            <span className="pill-text">6 Tables</span>
          </div>
          <div className="pill">
            <span className="pill-icon">👥</span>
            <span className="pill-text">8,825+ Opponents</span>
          </div>
          <div className="pill">
            <span className="pill-icon">📊</span>
            <span className="pill-text">P/L Tracking</span>
          </div>
          <div className="pill">
            <span className="pill-icon">🔄</span>
            <span className="pill-text">Hand Replay</span>
          </div>
          <div className="pill gold">
            <span className="pill-icon">🔒</span>
            <span className="pill-text">100% Private</span>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="results-content">
          <div className="results-text">
            <span className="section-tag-pro">Real Results</span>
            <h2 className="section-title-pro">
              Players Are Winning<br/>
              <span className="gradient-text-ultra">More Than Ever</span>
            </h2>
            <p className="results-description">
              Our users report significant improvements in their win rates after just one week
              of using PokerSharkScope. The combination of real-time GTO advice and detailed
              analytics helps identify and fix leaks faster than ever before.
            </p>
            <div className="results-stats">
              <div className="result-stat">
                <span className="result-number">24</span>
                <span className="result-label">Winning Days</span>
              </div>
              <div className="result-stat">
                <span className="result-number">1</span>
                <span className="result-label">Losing Day</span>
              </div>
              <div className="result-stat">
                <span className="result-number">+19K</span>
                <span className="result-label">BB Monthly</span>
              </div>
            </div>
            <Link to="/signup" className="btn-cta-primary" style={{ marginTop: '2rem' }}>
              <span>Start Your Winning Streak</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="results-visual">
            <div className="results-card">
              <div className="results-card-header">March 2026 Results</div>
              <div className="results-big-number">+19,011 BB</div>
              <div className="results-details">
                <div className="results-detail">
                  <span className="detail-label">Best Day</span>
                  <span className="detail-value green">+2,622 BB</span>
                </div>
                <div className="results-detail">
                  <span className="detail-label">Total Hands</span>
                  <span className="detail-value">32,929</span>
                </div>
                <div className="results-detail">
                  <span className="detail-label">Win Rate</span>
                  <span className="detail-value green">96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-ultra">
        <div className="hiw-header">
          <span className="section-tag-pro">Get Started</span>
          <h2 className="section-title-pro">
            Playing Smarter in<br/>
            <span className="gradient-text-ultra">Under 5 Minutes</span>
          </h2>
        </div>

        <div className="hiw-steps">
          <div className="hiw-step">
            <div className="hiw-step-number">1</div>
            <div className="hiw-step-content">
              <h3>Create Account</h3>
              <p>Create your account and choose a plan to get started.</p>
            </div>
            <div className="hiw-step-visual">
              <div className="step-icon">📧</div>
            </div>
          </div>

          <div className="hiw-connector"></div>

          <div className="hiw-step">
            <div className="hiw-step-number">2</div>
            <div className="hiw-step-content">
              <h3>Download App</h3>
              <p>Get the native app for Mac or Windows. Install in under a minute.</p>
            </div>
            <div className="hiw-step-visual">
              <div className="step-icon">⬇️</div>
            </div>
          </div>

          <div className="hiw-connector"></div>

          <div className="hiw-step">
            <div className="hiw-step-number">3</div>
            <div className="hiw-step-content">
              <h3>Start Winning</h3>
              <p>Launch Chrome, open tables, and get real-time GTO advice on every hand.</p>
            </div>
            <div className="hiw-step-visual">
              <div className="step-icon">🏆</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing-preview">
        <div className="pricing-preview-header">
          <span className="section-tag-pro">Simple Pricing</span>
          <h2 className="section-title-pro">
            One Tool. One Price.<br/>
            <span className="gradient-text-ultra">Unlimited Potential.</span>
          </h2>
        </div>

        <div className="pricing-cards-preview">
          <div className="price-card-mini">
            <div className="price-name">Weekly</div>
            <div className="price-amount">$25</div>
            <div className="price-period">per week</div>
            <Link to="/signup" className="price-btn">Get Started</Link>
          </div>

          <div className="price-card-mini featured">
            <div className="price-popular-badge">MOST POPULAR</div>
            <div className="price-name">Monthly</div>
            <div className="price-amount">$85</div>
            <div className="price-period">per month</div>
            <div className="price-savings">Save 15%</div>
            <Link to="/signup" className="price-btn primary">Get Started</Link>
          </div>

          <div className="price-card-mini">
            <div className="price-name">Yearly</div>
            <div className="price-amount">$799</div>
            <div className="price-period">per year</div>
            <div className="price-savings">Best Value - Save 39%</div>
            <Link to="/signup" className="price-btn">Get Started</Link>
          </div>
        </div>

        <p className="pricing-note">
          All plans include full access to every feature. Cancel anytime.
        </p>
      </section>

      {/* Affiliate Section */}
      <section className="affiliate-promo">
        <div className="affiliate-promo-content">
          <div className="affiliate-promo-text">
            <span className="section-tag-pro">Earn Money</span>
            <h2 className="section-title-pro">
              Refer Friends.<br/>
              <span className="gradient-text-ultra">Earn 15% Forever.</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem' }}>
              Know other poker players? Share PokerSharkScope and earn 15% of every payment they make — for as long as they stay subscribed.
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gold)' }}>15%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recurring</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gold)' }}>$12+</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Per Monthly Referral</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gold)' }}>$120</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Per Yearly Referral</div>
              </div>
            </div>
            <Link to="/affiliate" className="btn-cta-secondary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
              Learn About Affiliate Program →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-ultra">
        <div className="final-cta-bg">
          <div className="cta-glow"></div>
        </div>
        <div className="final-cta-content">
          <h2>Ready to Stop Leaving Money on the Table?</h2>
          <p>
            Join hundreds of players who are already using PokerSharkScope
            to make better decisions and win more consistently.
          </p>
          <div className="final-cta-buttons">
            <Link to="/signup" className="btn-cta-primary large">
              <span>Get Started Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <p className="cta-subtext">Instant access • Cancel anytime • Secure payment</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </div>
        <div className="footer-links">
                    <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <a href="https://discord.gg/rBCt9yp7" target="_blank" rel="noopener noreferrer" className="footer-discord">
            Discord
          </a>
        </div>
        <p className="footer-copy">© 2024 PokerSharkScope. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
