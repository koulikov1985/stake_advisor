import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function HandAnalyzer() {
  return (
    <>
      <Helmet>
        <title>Poker Hand Analyzer - Equity Calculator & Range Analysis</title>
        <meta name="description" content="Advanced poker hand analyzer with equity calculator, range analysis, and hand history review. Find leaks and improve your game." />
        <meta name="keywords" content="hand analyzer, poker hand analysis, equity calculator, range analysis, hand history" />
        <link rel="canonical" href="https://sharkpokerclub.com/hand-analyzer" />
        <meta property="og:title" content="Poker Hand Analyzer - Equity Calculator Tool" />
        <meta property="og:description" content="Analyze poker hands with equity calculator and range analysis tools." />
        <meta property="og:url" content="https://sharkpokerclub.com/hand-analyzer" />
      </Helmet>
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
            <span className="badge-icon">📊</span>
            <span>Hand Analysis Tool</span>
          </div>
          <h1>
            Poker Hand Analyzer<br />
            <span className="gradient-text">Advanced Hand Analysis Software</span>
          </h1>
          <p className="hero-desc">
            Professional poker hand analyzer with equity calculations, range analysis, and decision review.
            Analyze every street, review past hands, and identify leaks in your game with AI-powered insights.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="btn-hero-primary">
              Start Analyzing Hands
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

      {/* Features */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Analysis Features</span>
          <h2>Comprehensive Hand Analysis Tools</h2>
          <p>Everything you need to analyze poker hands like a pro</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span>🎯</span>
            </div>
            <h3>Equity Calculator</h3>
            <p>
              Calculate hand equity against opponent ranges. Real-time equity percentages
              for preflop, flop, turn, and river scenarios with mathematical precision.
            </p>
          </div>

          <div className="feature-card featured">
            <div className="feature-icon">
              <span>📈</span>
            </div>
            <h3>Range Analysis</h3>
            <p>
              Analyze opponent hand ranges street by street. Visualize range distributions,
              equity vs range, and optimal counter-strategies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>🔄</span>
            </div>
            <h3>Hand History Review</h3>
            <p>
              Review complete hand histories with street-by-street breakdowns. See pot odds,
              equity, and GTO recommendations for every decision point.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>💡</span>
            </div>
            <h3>Decision Analysis</h3>
            <p>
              Evaluate the quality of your poker decisions. Compare your actions to GTO
              strategy and see expected value (EV) for each option.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>🔍</span>
            </div>
            <h3>Leak Detection</h3>
            <p>
              Automatically identify leaks in your game. Find patterns in mistakes,
              overfolding, overcalling, and bet sizing errors.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>📊</span>
            </div>
            <h3>Statistical Analysis</h3>
            <p>
              Comprehensive statistics across all your hands. VPIP, PFR, aggression,
              showdown percentages, and win rate by position.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
        <div className="features-header">
          <span className="section-tag">How It Works</span>
          <h2>Analyze Any Poker Hand in 3 Steps</h2>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>1</span>
            </div>
            <h3>Input Hand Details</h3>
            <p>Enter your cards, board, actions, and pot size. Or let our software automatically capture hand data.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>2</span>
            </div>
            <h3>AI Analysis</h3>
            <p>Our analyzer calculates equity, evaluates ranges, and compares your play to GTO strategy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</span>
            </div>
            <h3>Get Insights</h3>
            <p>Receive detailed analysis with recommendations on how to improve your poker game.</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Use Cases</span>
          <h2>When to Use Hand Analyzer</h2>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="feature-card">
            <h3>Post-Session Review</h3>
            <p>
              Review your poker sessions to identify mistakes and learning opportunities.
              Analyze key hands and understand what you could have done differently.
            </p>
          </div>
          <div className="feature-card">
            <h3>Spot Analysis</h3>
            <p>
              Deep dive into specific scenarios. Analyze difficult spots like river bluff catches,
              thin value bets, and complex multi-way situations.
            </p>
          </div>
          <div className="feature-card">
            <h3>Range Study</h3>
            <p>
              Study optimal ranges for different positions and scenarios. Understand how hand
              ranges interact with board textures and opponent tendencies.
            </p>
          </div>
          <div className="feature-card">
            <h3>Leak Finding</h3>
            <p>
              Systematically find and fix leaks in your poker game. Identify patterns in
              your mistakes and work on specific areas for improvement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Start Analyzing Your Poker Hands</h2>
          <p>Get instant access to professional hand analysis tools. 1-day free trial.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Try Free Today
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

export default HandAnalyzer;
