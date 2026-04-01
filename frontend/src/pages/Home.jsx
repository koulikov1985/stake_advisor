import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function Home() {
  const [searchParams] = useSearchParams();
  const [showCanceled, setShowCanceled] = useState(false);
  const [, forceUpdate] = useState(0);

  // Force re-render on mount to check login status
  useEffect(() => {
    forceUpdate(n => n + 1);
  }, []);

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true);
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  // Check directly - no state caching
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <div className="landing">
      {/* Landing Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span>🦈</span>
          <span>SharkScope Pro</span>
        </Link>
        <nav className="landing-nav">
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost">Login</Link>
              <Link to="/signup" className="nav-btn-primary">Sign Up</Link>
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
      <section className="landing-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge-pro">
            <span className="badge-icon">🦈</span>
            <span>Real-Time Poker Intelligence</span>
          </div>
          <h1>
            Play Every Hand<br />
            <span className="gradient-text">Like a Pro</span>
          </h1>
          <p className="hero-desc">
            SharkScope Pro analyzes your poker hands in real-time using GTO strategies.
            Get instant recommendations and dominate cash games at any stake.
          </p>
          <div className="hero-buttons">
            <Link to="/pricing" className="btn-hero-primary">
              Get Started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/features" className="btn-hero-secondary">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Features</span>
          <h2>Everything You Need to Win</h2>
          <p>Professional-grade tools used by winning players</p>
        </div>
        <div className="features-grid-pro">
          <div className="feature-card-pro">
            <div className="feature-icon-wrap">
              <span>⚡</span>
            </div>
            <h3>Real-Time Analysis</h3>
            <p>Instant hand analysis as you play. No delays, no waiting.</p>
          </div>
          <div className="feature-card-pro">
            <div className="feature-icon-wrap">
              <span>🎯</span>
            </div>
            <h3>GTO Strategy</h3>
            <p>Game theory optimal recommendations from advanced algorithms.</p>
          </div>
          <div className="feature-card-pro">
            <div className="feature-icon-wrap">
              <span>💰</span>
            </div>
            <h3>All Stakes</h3>
            <p>Works from micro stakes to high roller tables.</p>
          </div>
          <div className="feature-card-pro">
            <div className="feature-icon-wrap">
              <span>🌐</span>
            </div>
            <h3>Browser-Based</h3>
            <p>No downloads. Works instantly in your browser.</p>
          </div>
          <div className="feature-card-pro">
            <div className="feature-icon-wrap">
              <span>📊</span>
            </div>
            <h3>Range Analysis</h3>
            <p>See opponent ranges and equity calculations live.</p>
          </div>
          <div className="feature-card-pro">
            <div className="feature-icon-wrap">
              <span>🔒</span>
            </div>
            <h3>Secure & Private</h3>
            <p>Your data stays on your device. Always.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-steps">
        <div className="steps-header">
          <span className="section-tag">How It Works</span>
          <h2>Start Winning in Minutes</h2>
        </div>
        <div className="steps-row">
          <div className="step-item">
            <div className="step-num">1</div>
            <h3>Get Your License</h3>
            <p>Choose a plan and receive your license key instantly</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-num">2</div>
            <h3>Activate</h3>
            <p>Enter your key in the SharkScope Pro extension</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-num">3</div>
            <h3>Play & Win</h3>
            <p>Get real-time advice on every hand you play</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Ready to Dominate the Tables?</h2>
          <p>Join SharkScope Pro and start making better decisions today.</p>
          <Link to="/pricing" className="btn-hero-primary">
            View Pricing
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span>🦈</span>
          <span>SharkScope Pro</span>
        </div>
        <div className="footer-links">
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <p className="footer-copy">© 2024 SharkScope Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
