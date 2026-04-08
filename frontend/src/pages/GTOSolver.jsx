import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import '../styles/landing.css';

function GTOSolver() {
  return (
    <>
      <Helmet>
        <title>GTO Solver for Poker - Game Theory Optimal Analysis</title>
        <meta name="description" content="Professional GTO solver for poker with real-time calculations, preflop ranges, and postflop equity analysis. 100K+ simulations per second." />
        <meta name="keywords" content="GTO solver, poker GTO, game theory optimal, poker solver, equity calculator" />
        <link rel="canonical" href="https://www.sharkpokerclub.com/gto-solver" />
        <meta property="og:title" content="GTO Solver for Poker - Professional GTO Analysis" />
        <meta property="og:description" content="Professional GTO solver with real-time calculations and optimal strategy recommendations." />
        <meta property="og:url" content="https://www.sharkpokerclub.com/gto-solver" />
      </Helmet>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.sharkpokerclub.com/" },
        { name: "GTO Solver", url: "https://www.sharkpokerclub.com/gto-solver" }
      ]} />
      <div className="landing ai-theme">
      {/* Floating Poker Cards */}
      <div className="floating-cards-global">
        <div className="floating-card card-1">A♠</div>
        <div className="floating-card card-2">K♥</div>
        <div className="floating-card card-3">Q♦</div>
        <div className="floating-card card-4">J♣</div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎯</span>
            <span>Professional GTO Solver</span>
          </div>
          <h1>
            Advanced GTO Poker Solver<br />
            <span className="gradient-text">Game Theory Optimal Analysis</span>
          </h1>
          <p className="hero-desc">
            Professional-grade GTO solver for poker. Real-time game theory optimal calculations,
            preflop range analysis, postflop equity, and mathematically perfect strategy recommendations.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn-hero-primary">
              Try GTO Solver Free
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/pricing" className="btn-hero-secondary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* What is GTO Section */}
      <section className="landing-features" style={{ background: 'var(--bg-darker)' }}>
        <div className="features-header">
          <span className="section-tag">Game Theory Optimal</span>
          <h2>What is a GTO Solver for Poker?</h2>
          <p>
            A GTO (Game Theory Optimal) solver calculates mathematically balanced poker strategy
            that cannot be exploited. Our GTO solver analyzes every poker situation and provides
            optimal play recommendations based on advanced game theory algorithms.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">GTO Solver Features</span>
          <h2>Professional GTO Analysis Tools</h2>
          <p>Everything you need for advanced poker strategy analysis</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span>📊</span>
            </div>
            <h3>Preflop Range Analysis</h3>
            <p>
              Comprehensive preflop GTO ranges for all positions. Calculate optimal opening ranges,
              3-bet frequencies, and calling ranges based on game theory optimal strategy.
            </p>
          </div>

          <div className="feature-card featured">
            <div className="feature-icon">
              <span>⚡</span>
            </div>
            <h3>Real-Time GTO Calculations</h3>
            <p>
              Get instant GTO solutions in under 50 milliseconds. Our solver runs 100,000+
              simulations per second for accurate strategy recommendations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>🎯</span>
            </div>
            <h3>Postflop Equity Analysis</h3>
            <p>
              Advanced postflop equity calculations for all board textures. Analyze turn and river
              scenarios with precise GTO recommendations for every decision point.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>💡</span>
            </div>
            <h3>Bet Sizing Optimization</h3>
            <p>
              GTO-optimal bet sizing for every situation. Calculate the mathematically correct
              bet sizes for value bets, bluffs, and balanced ranges.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>📈</span>
            </div>
            <h3>EV Calculations</h3>
            <p>
              Expected value (EV) analysis for every decision. See the exact EV difference
              between fold, call, and raise options based on GTO strategy.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>🔄</span>
            </div>
            <h3>Multi-Street Analysis</h3>
            <p>
              Analyze complete hand scenarios across multiple streets. GTO solver calculates
              optimal strategy from preflop through river for complex decision trees.
            </p>
          </div>
        </div>
      </section>

      {/* Why GTO Section */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
        <div className="features-header">
          <span className="section-tag">Why Use GTO?</span>
          <h2>Benefits of GTO Poker Strategy</h2>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="feature-card">
            <h3>Unexploitable Play</h3>
            <p>GTO strategy cannot be exploited by opponents. Play a balanced, mathematically sound game.</p>
          </div>
          <div className="feature-card">
            <h3>Strong Foundation</h3>
            <p>Build a solid baseline strategy that works against any opponent at any stakes.</p>
          </div>
          <div className="feature-card">
            <h3>Find Leaks</h3>
            <p>Compare your play to GTO to identify and fix leaks in your poker game.</p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Comparison</span>
          <h2>Poker AI GTO Solver vs Competitors</h2>
        </div>
        <div className="comparison-table" style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--bg-surface)', borderRadius: '16px', padding: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Feature</th>
                <th style={{ padding: '1rem' }}>Poker AI</th>
                <th style={{ padding: '1rem' }}>PioSOLVER</th>
                <th style={{ padding: '1rem' }}>GTO+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '1rem' }}>Real-time analysis</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>✅</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
              </tr>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1rem' }}>Multi-table support</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>✅</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem' }}>Speed (&lt;50ms)</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>✅</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
              </tr>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '1rem' }}>Price</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>$15/week</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>$249+</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>$75/mo</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem' }}>Beginner friendly</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>✅</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>❌</td>
                <td style={{ textAlign: 'center', padding: '1rem' }}>⚠️</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Start Using Professional GTO Solver</h2>
          <p>Get instant access to advanced GTO analysis tools. Free 1-day trial available.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Try Free for 1 Day
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/pricing" className="btn-hero-secondary">
              View All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer-ai">
        <div className="footer-brand-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="footer-logo" />
        </div>
        <div className="footer-links-ai">
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
      </footer>
      </div>
    </>
  );
}

export default GTOSolver;
