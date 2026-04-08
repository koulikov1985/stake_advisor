import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function PokerRangeAnalyzer() {
  return (
    <>
      <Helmet>
        <title>Poker Range Analyzer - GTO Range Analysis Tool 2026</title>
        <meta name="description" content="Professional poker range analyzer with GTO range charts, equity analysis, and range construction tools. Master preflop and postflop ranges." />
        <meta name="keywords" content="poker range analyzer, range analysis, GTO ranges, preflop ranges, poker ranges" />
        <link rel="canonical" href="https://www.sharkpokerclub.com/poker-range-analyzer" />
      </Helmet>

      <div className="landing ai-theme">
        <div className="floating-cards-global">
          <div className="floating-card card-1">A♠</div>
          <div className="floating-card card-2">K♥</div>
          <div className="floating-card card-3">Q♦</div>
          <div className="floating-card card-4">J♣</div>
        </div>

        <header className="landing-header">
          <Link to="/" className="landing-logo">
            <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
          </Link>
          <nav className="landing-nav">
            <Link to="/pricing">Pricing</Link>
            <Link to="/gto-solver">GTO Solver</Link>
            <Link to="/hand-analyzer">Hand Analyzer</Link>
            <Link to="/login" className="nav-btn-ghost">Login</Link>
            <Link to="/signup" className="nav-btn-primary">Get Started</Link>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="hero-glow"></div>
          <div className="hero-content">
            <h1>
              Poker Range Analyzer<br />
              <span className="gradient-text">GTO Range Analysis Tool</span>
            </h1>
            <p className="hero-desc">
              Professional poker range analyzer with GTO range charts, equity vs range analysis, and advanced range construction tools.
              Master optimal preflop and postflop ranges for every position.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Analyze Ranges Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <span className="section-tag">Analysis Features</span>
            <h2>Complete Range Analysis Tools</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-icon"><span>📊</span></div>
              <h3>GTO Preflop Ranges</h3>
              <p>Access optimal opening, 3-bet, and calling ranges for every position. Built-in GTO charts for all scenarios.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>🎯</span></div>
              <h3>Equity vs Range</h3>
              <p>Calculate your hand's equity against any opponent range. Essential for making profitable decisions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>📈</span></div>
              <h3>Range Construction</h3>
              <p>Build balanced ranges for value betting and bluffing. Ensure your strategy is unexploitable.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>💡</span></div>
              <h3>Postflop Range Analysis</h3>
              <p>Analyze how ranges interact with different board textures. Optimize your c-betting and check-raising strategy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>🔍</span></div>
              <h3>Range Visualization</h3>
              <p>Visual heat maps showing range strength by hand type. Instantly understand range distributions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>⚡</span></div>
              <h3>Real-Time Updates</h3>
              <p>Dynamic range analysis as the hand progresses. See how ranges change on each street.</p>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <h2>Why Range Analysis Matters</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
            <h3>Think in Ranges, Not Hands</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              Professional poker players don't try to guess opponents' exact hands. They think in terms of ranges—all possible hands
              an opponent could have in a given situation.
            </p>
            <h3 style={{ marginTop: '2rem' }}>Example: Button vs Big Blind</h3>
            <div style={{ background: 'var(--bg-darker)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                <strong>Scenario:</strong> You open from Button, BB calls<br/>
                <strong>Flop:</strong> A♠9♣4♦
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
                <strong>Your range:</strong> All pairs, Broadway cards, suited connectors (60% of hands)<br/>
                <strong>BB's range:</strong> Pairs, suited Aces, Broadway (40% of hands)
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
                <strong>Range advantage:</strong> You have MORE Aces in your range<br/>
                <strong>GTO says:</strong> C-bet frequently (65-75%) with balanced bluffs and value
              </p>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <h2>Key Range Analysis Concepts</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="feature-card">
              <h3>Polarized Ranges</h3>
              <p>Contains very strong hands and bluffs, nothing in between. Used for big river bets.</p>
            </div>
            <div className="feature-card">
              <h3>Condensed Ranges</h3>
              <p>Contains medium-strength hands. Common in 3-bet pots and after calling raises.</p>
            </div>
            <div className="feature-card">
              <h3>Merged Ranges</h3>
              <p>Contains hands of all strengths. Used for smaller bet sizes and c-betting.</p>
            </div>
            <div className="feature-card">
              <h3>Range Advantage</h3>
              <p>When your range is stronger overall than opponent's. Allows aggressive c-betting.</p>
            </div>
            <div className="feature-card">
              <h3>Nut Advantage</h3>
              <p>When you have more nutted hands than opponent. Important for large bets.</p>
            </div>
            <div className="feature-card">
              <h3>Equity Realization</h3>
              <p>How much of your range's equity you can actually realize. Affected by position and skill.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-card">
            <h2>Master Poker Range Analysis</h2>
            <p>Get access to professional range analyzer and GTO range charts.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-hero-primary">
                Start Analyzing Ranges
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <footer className="landing-footer-ai">
          <div className="footer-brand-ai">
            <img src="/images/poker-ai-logo.png" alt="Poker AI" className="footer-logo" />
          </div>
          <div className="footer-links-ai">
            <Link to="/pricing">Pricing</Link>
            <Link to="/gto-solver">GTO Solver</Link>
            <Link to="/hand-analyzer">Hand Analyzer</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
          <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default PokerRangeAnalyzer;
