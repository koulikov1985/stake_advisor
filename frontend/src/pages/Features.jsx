import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const features = [
  {
    icon: '⚡',
    title: 'Real-Time GTO Advice',
    description: 'Get instant recommendations for every decision - preflop and postflop. Our engine analyzes your exact situation and delivers GTO-optimal plays in milliseconds.'
  },
  {
    icon: '🎯',
    title: 'Multi-Table Support',
    description: 'Track and receive advice on up to 6 tables simultaneously. Maximize your volume without sacrificing decision quality.'
  },
  {
    icon: '👥',
    title: 'Opponent Tracking',
    description: 'Automatic HUD stats on every opponent - VPIP, PFR, 3-Bet, Aggression Factor, and more. Know your competition inside and out.'
  },
  {
    icon: '📊',
    title: 'P/L Tracker',
    description: 'Track your results with detailed session stats, daily calendar view, and profit graphs. See your progress over time.'
  },
  {
    icon: '🔄',
    title: 'Hand Replay',
    description: 'Review any hand from your database. Analyze your play street-by-street and find leaks in your game.'
  },
  {
    icon: '🔒',
    title: '100% Private',
    description: 'All data stays on your computer. Your hands, stats, and information never leave your machine.'
  }
];

const technicalFeatures = [
  {
    icon: '🖥️',
    title: 'Mac & Windows',
    description: 'Native desktop app that runs smoothly on both macOS and Windows with minimal resource usage.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Get advice in milliseconds. No lag, no delay - just instant GTO decisions when you need them.'
  },
  {
    icon: '🔒',
    title: 'Complete Privacy',
    description: 'All your data stays on your computer. Nothing is sent to external servers except license validation.'
  },
  {
    icon: '📱',
    title: 'Use Anywhere',
    description: 'One license works on any device. Log in on your desktop, laptop, or both - seamlessly.'
  }
];

function Features() {
  return (
    <div className="landing ai-theme">
      {/* Floating Poker Cards - Page Wide */}
      <div className="floating-cards-global">
        <div className="floating-card card-1">🂡</div>
        <div className="floating-card card-2">🂮</div>
        <div className="floating-card card-3">🃁</div>
        <div className="floating-card card-4">🃎</div>
        <div className="floating-card card-5">🂱</div>
        <div className="floating-card card-6">🃑</div>
        <div className="floating-card card-7">🂢</div>
        <div className="floating-card card-8">🃞</div>
        <div className="floating-card card-9">🂫</div>
        <div className="floating-card card-10">🃋</div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <nav className="landing-nav">
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="nav-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/affiliate">Affiliate</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero" style={{ paddingBottom: '3rem' }}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⚡</span>
            <span>Professional-Grade Tools</span>
          </div>
          <h1>
            Every Feature You Need<br />
            <span className="gradient-text">To Crush The Tables</span>
          </h1>
          <p className="hero-desc">
            PokerSharkScope combines real-time GTO analysis, opponent tracking,
            and session management into one powerful desktop application.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Core Features</span>
          <h2>Built for Serious Players</h2>
          <p>Everything you need to make +EV decisions every hand</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className={`feature-card ${index === 1 ? 'featured' : ''}`} key={index}>
              <div className="feature-icon">
                <span>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)', margin: '0 -100vw', padding: '6rem calc(50vw - 600px)' }}>
        <div className="features-header">
          <span className="section-tag">Platform</span>
          <h2>Designed for Performance</h2>
          <p>A seamless experience on any device</p>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {technicalFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <span>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Ready to Level Up Your Game?</h2>
          <p>Sign up and get 200 hands free to see the difference for yourself.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Get 200 Hands Free
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
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </div>
        <div className="footer-links">
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="footer-discord">Discord</a>
        </div>
        <p className="footer-copy">© 2024 PokerSharkScope. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Features;
