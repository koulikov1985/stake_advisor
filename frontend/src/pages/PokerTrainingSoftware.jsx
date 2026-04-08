import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function PokerTrainingSoftware() {
  return (
    <>
      <Helmet>
        <title>Poker Training Software - AI-Powered Learning Tools 2026</title>
        <meta name="description" content="Professional poker training software with GTO solver, hand analyzer, and AI coaching. Improve your game faster with advanced training tools." />
        <meta name="keywords" content="poker training software, poker training tools, poker learning software, GTO training" />
        <link rel="canonical" href="https://www.sharkpokerclub.com/poker-training-software" />
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
            <Link to="/faq">FAQ</Link>
            <Link to="/login" className="nav-btn-ghost">Login</Link>
            <Link to="/signup" className="nav-btn-primary">Get Started</Link>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="hero-glow"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">📚</span>
              <span>Training Software</span>
            </div>
            <h1>
              Poker Training Software<br />
              <span className="gradient-text">AI-Powered Learning Tools</span>
            </h1>
            <p className="hero-desc">
              Professional poker training software with GTO solver, hand analyzer, AI decision support, and comprehensive
              learning tools. Train smarter, improve faster, and master poker strategy with advanced AI technology.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Start Training Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/pricing" className="btn-hero-secondary">View Pricing</Link>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <span className="section-tag">Training Features</span>
            <h2>Complete Poker Training Suite</h2>
            <p>Everything you need to master poker strategy</p>
          </div>
          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-icon"><span>🎯</span></div>
              <h3>GTO Solver Training</h3>
              <p>Learn game theory optimal strategy with real-time GTO calculations. Practice against optimal play and understand the math behind every decision.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>📊</span></div>
              <h3>Hand Analysis Tools</h3>
              <p>Review every hand you play with equity calculator, range analysis, and GTO comparison. Identify leaks and fix mistakes systematically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>🤖</span></div>
              <h3>AI Coaching System</h3>
              <p>AI-powered decision support that teaches you optimal strategy in real-time. Learn by doing with instant feedback on every decision.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>📈</span></div>
              <h3>Progress Tracking</h3>
              <p>Comprehensive statistics and performance analytics. Track your improvement over time and focus on areas that need work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>🎓</span></div>
              <h3>Strategy Library</h3>
              <p>Access preflop ranges, postflop strategies, and optimal bet sizing for every situation. Build your poker knowledge systematically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>💡</span></div>
              <h3>Leak Detection</h3>
              <p>Automatically identify patterns in your mistakes. AI analyzes thousands of hands to find your biggest leaks and suggest fixes.</p>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <span className="section-tag">Why Choose Poker AI</span>
            <h2>The Most Comprehensive Training Software</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="feature-card">
              <h3>Real-Time Learning</h3>
              <p>Train while you play. Get instant feedback and learn optimal strategy in real poker situations.</p>
            </div>
            <div className="feature-card">
              <h3>GTO Foundation</h3>
              <p>Build a solid baseline with game theory optimal strategy before adding exploitative adjustments.</p>
            </div>
            <div className="feature-card">
              <h3>Faster Improvement</h3>
              <p>Learn 10x faster with AI-powered analysis. Months of improvement compressed into weeks.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-card">
            <h2>Start Training Like a Pro</h2>
            <p>Join thousands of players improving their game with Poker AI training software.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-hero-primary">
                Try Free for 1 Day
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/pricing" className="btn-hero-secondary">View Pricing</Link>
            </div>
          </div>
        </section>

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

export default PokerTrainingSoftware;
