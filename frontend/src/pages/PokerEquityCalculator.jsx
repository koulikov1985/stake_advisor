import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function PokerEquityCalculator() {
  return (
    <>
      <Helmet>
        <title>Poker Equity Calculator - Free Online Equity Analysis Tool</title>
        <meta name="description" content="Free poker equity calculator with range vs range analysis. Calculate hand equity, pot odds, and win percentages instantly." />
        <meta name="keywords" content="poker equity calculator, equity calculator online, poker odds calculator, hand equity" />
        <link rel="canonical" href="https://sharkpokerclub.com/poker-equity-calculator" />
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
            <Link to="/download">Download</Link>
            <Link to="/hand-analyzer">Hand Analyzer</Link>
            <Link to="/login" className="nav-btn-ghost">Login</Link>
            <Link to="/signup" className="nav-btn-primary">Get Started</Link>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="hero-glow"></div>
          <div className="hero-content">
            <h1>
              Poker Equity Calculator<br />
              <span className="gradient-text">Free Online Equity Analysis</span>
            </h1>
            <p className="hero-desc">
              Professional poker equity calculator with hand vs hand, hand vs range, and range vs range analysis.
              Calculate equity, pot odds, and win percentages instantly.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Try Free Calculator
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <span className="section-tag">Calculator Features</span>
            <h2>Advanced Equity Calculations</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card featured">
              <h3>Hand vs Hand Equity</h3>
              <p>Calculate exact equity for your hand against opponent's specific hand. See win, tie, and loss percentages.</p>
            </div>
            <div className="feature-card">
              <h3>Hand vs Range</h3>
              <p>Analyze your hand against an opponent's range. Essential for making correct decisions at the tables.</p>
            </div>
            <div className="feature-card">
              <h3>Range vs Range</h3>
              <p>Advanced range analysis for studying optimal strategy. Compare entire ranges to understand equity distributions.</p>
            </div>
            <div className="feature-card">
              <h3>Monte Carlo Simulations</h3>
              <p>Run 100,000+ simulations for accurate equity calculations across all possible runouts.</p>
            </div>
            <div className="feature-card">
              <h3>Pot Odds Calculator</h3>
              <p>Automatically calculate pot odds and compare to hand equity. Know instantly if a call is profitable.</p>
            </div>
            <div className="feature-card">
              <h3>Multi-Street Analysis</h3>
              <p>Calculate equity on flop, turn, and river. See how your equity changes on each street.</p>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <h2>How to Use Poker Equity Calculator</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
            <h3>Example: Should You Call?</h3>
            <div style={{ background: 'var(--bg-darker)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                <strong>Situation:</strong><br/>
                You have A♥K♣ on a flop of K♠9♦4♣<br/>
                Opponent bets $10 into a $30 pot<br/>
                <strong>You need to call $10 to win $40 total</strong>
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
                <strong>Step 1:</strong> Calculate pot odds<br/>
                Pot odds = $10 / ($30 + $10 + $10) = 20%<br/>
                You need at least 20% equity to call profitably
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
                <strong>Step 2:</strong> Calculate your equity<br/>
                vs QQ-JJ: 72% equity ✅<br/>
                vs sets (99,44): 8% equity ❌<br/>
                vs all reasonable hands: ~45% equity ✅
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem', color: 'var(--accent-cyan)' }}>
                <strong>Decision: CALL</strong> - You have 45% equity, need only 20%
              </p>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <h2>Why Use Our Equity Calculator?</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="feature-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-cyan)' }}>100K+</h3>
              <p>Simulations per second</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-cyan)' }}>99.9%</h3>
              <p>Calculation accuracy</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-cyan)' }}>&lt;50ms</h3>
              <p>Calculation speed</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-cyan)' }}>Free</h3>
              <p>No credit card required</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-card">
            <h2>Start Calculating Poker Equity</h2>
            <p>Get instant equity analysis with our professional poker calculator.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-hero-primary">
                Use Free Calculator
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
            <Link to="/hand-analyzer">Hand Analyzer</Link>
            <Link to="/gto-solver">GTO Solver</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
          <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default PokerEquityCalculator;
