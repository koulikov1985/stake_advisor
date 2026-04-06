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
        <div className="floating-card card-1">A♠</div>
        <div className="floating-card card-2">K♥</div>
        <div className="floating-card card-3">Q♦</div>
        <div className="floating-card card-4">J♣</div>
        <div className="floating-card card-5">10♠</div>
        <div className="floating-card card-6">9♥</div>
        <div className="floating-card card-7">A♦</div>
        <div className="floating-card card-8">K♣</div>
        <div className="floating-card card-9">Q♠</div>
        <div className="floating-card card-10">J♥</div>
        <div className="floating-card card-11">A♣</div>
        <div className="floating-card card-12">K♦</div>
        <div className="floating-card card-13">8♠</div>
        <div className="floating-card card-14">7♥</div>
        <div className="floating-card card-15">6♦</div>
        <div className="floating-card card-16">5♣</div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <Link to="/pricing">Pricing</Link>
          <Link to="/affiliate" className="nav-affiliate-glow">Affiliate</Link>
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
            Poker AI combines real-time GTO analysis, opponent tracking,
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
          <p>Sign up today and start winning with AI-powered poker decisions.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Get Started
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
          <Link to="/affiliate">Affiliate</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
        <p className="footer-copy-ai">&copy; 2025 Poker AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Features;
