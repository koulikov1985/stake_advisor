import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How Poker AI Works - Computer Vision & GTO Algorithms</title>
        <meta name="description" content="Learn how Poker AI uses computer vision, GTO algorithms, and AI to provide real-time poker analysis with 99.9% accuracy in under 50ms." />
        <meta name="keywords" content="poker AI, how it works, computer vision, GTO algorithms, poker technology" />
        <link rel="canonical" href="https://www.sharkpokerclub.com/how-it-works" />
        <meta property="og:title" content="How Poker AI Works - Technology Explained" />
        <meta property="og:description" content="Deep dive into Poker AI technology: computer vision, GTO solvers, and real-time analysis." />
        <meta property="og:url" content="https://www.sharkpokerclub.com/how-it-works" />
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
            <span className="badge-icon">⚡</span>
            <span>How It Works</span>
          </div>
          <h1>
            How Poker AI Software<br />
            <span className="gradient-text">Works Behind The Scenes</span>
          </h1>
          <p className="hero-desc">
            Learn how our advanced poker software uses computer vision, GTO algorithms,
            and AI decision support to provide professional-grade poker analysis.
          </p>
        </div>
      </section>

      {/* The Process */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">The Process</span>
          <h2>From Table to Decision in Milliseconds</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2.5rem' }}>👁️</span>
            </div>
            <h3>Step 1: Table Recognition</h3>
            <p>
              Advanced computer vision technology captures your poker table screen in real-time.
              The software identifies cards, chips, pot sizes, player positions, and actions
              with 99.9% accuracy in under 50 milliseconds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2.5rem' }}>🧠</span>
            </div>
            <h3>Step 2: Data Processing</h3>
            <p>
              Once captured, the software processes all game state data: your hole cards,
              community cards, stack sizes, pot size, and betting history. This creates
              a complete snapshot of the current poker situation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2.5rem' }}>⚡</span>
            </div>
            <h3>Step 3: GTO Calculation</h3>
            <p>
              Our GTO solver engine analyzes the situation using advanced algorithms.
              It runs 100,000+ simulations per second, calculating equity, pot odds,
              optimal bet sizing, and game theory optimal strategy.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2.5rem' }}>👥</span>
            </div>
            <h3>Step 4: Opponent Analysis</h3>
            <p>
              The software references its opponent database, pulling statistics like VPIP,
              PFR, aggression factor, and tendencies. This data helps adjust recommendations
              from pure GTO to exploitative strategies when advantageous.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2.5rem' }}>🎯</span>
            </div>
            <h3>Step 5: Decision Support</h3>
            <p>
              Based on GTO calculations and opponent data, the AI provides optimal play
              recommendations: fold, call, or raise with specific bet sizing. Each recommendation
              includes equity percentages and expected value (EV) calculations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span style={{ fontSize: '2.5rem' }}>📊</span>
            </div>
            <h3>Step 6: Analytics Tracking</h3>
            <p>
              Every hand is automatically saved to your database for later review.
              The software tracks your performance, identifies leaks, and generates
              detailed statistics to help you improve your poker game over time.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
        <div className="features-header">
          <span className="section-tag">Technology</span>
          <h2>Poker AI Technology Stack</h2>
          <p>Enterprise-grade technology powering professional poker software</p>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="feature-card">
            <h3>Computer Vision</h3>
            <p>Advanced OCR and image recognition to read poker tables with 99.9% accuracy.</p>
          </div>
          <div className="feature-card">
            <h3>GTO Algorithms</h3>
            <p>Game theory optimal solver using Nash equilibrium calculations and Monte Carlo simulations.</p>
          </div>
          <div className="feature-card">
            <h3>Machine Learning</h3>
            <p>AI models trained on millions of poker hands to identify patterns and optimal strategies.</p>
          </div>
          <div className="feature-card">
            <h3>Database Engine</h3>
            <p>High-performance database for storing hand histories and opponent statistics.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Processing</h3>
            <p>Optimized algorithms for sub-50ms analysis and decision recommendations.</p>
          </div>
          <div className="feature-card">
            <h3>Multi-Threading</h3>
            <p>Parallel processing to handle 6 tables simultaneously without performance loss.</p>
          </div>
        </div>
      </section>

      {/* Accuracy */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Accuracy</span>
          <h2>Industry-Leading Precision</h2>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', margin: '0' }}>99.9%</h3>
            <p style={{ margin: '0.5rem 0 0 0' }}>Table Recognition Accuracy</p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', margin: '0' }}>&lt;50ms</h3>
            <p style={{ margin: '0.5rem 0 0 0' }}>Analysis Speed</p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', margin: '0' }}>100K+</h3>
            <p style={{ margin: '0.5rem 0 0 0' }}>Simulations Per Second</p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', margin: '0' }}>6</h3>
            <p style={{ margin: '0.5rem 0 0 0' }}>Tables Simultaneously</p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
        <div className="features-header">
          <span className="section-tag">Getting Started</span>
          <h2>Start Using Poker AI in 3 Easy Steps</h2>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="feature-card">
            <div className="feature-icon">
              <span>1️⃣</span>
            </div>
            <h3>Sign Up & Download</h3>
            <p>
              Create your account and download Poker AI for Windows or Mac.
              Installation takes less than 2 minutes.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>2️⃣</span>
            </div>
            <h3>Configure Settings</h3>
            <p>
              Open your poker site and configure Poker AI to recognize your tables.
              Our setup wizard makes this quick and easy.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span>3️⃣</span>
            </div>
            <h3>Start Playing</h3>
            <p>
              Poker AI automatically detects your tables and begins providing
              real-time GTO analysis and decision support.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Ready to Experience Professional Poker Software?</h2>
          <p>Try Poker AI free for 1 day. No credit card required.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Get Started Free
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

export default HowItWorks;
