import React from 'react';
import { Link } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import '../styles/landing.css';

const plans = [
  {
    plan: 'trial',
    name: 'Free Trial',
    price: '0',
    label: '200 Hands Free',
    duration: 'trial',
    features: [
      'Full real-time GTO advisor',
      'Up to 2 tables',
      '200 hands included',
      'No credit card required'
    ],
    popular: false
  },
  {
    plan: 'daily',
    name: '1-Day Pass',
    price: '5',
    duration: 'day',
    features: [
      'Full real-time GTO advisor',
      'Up to 6 tables',
      'Opponent tracking',
      'P/L tracking'
    ],
    popular: false
  },
  {
    plan: 'weekly',
    name: 'Weekly',
    price: '25',
    duration: 'week',
    features: [
      'Full real-time GTO advisor',
      'Up to 6 tables',
      'Opponent tracking',
      'P/L tracking'
    ],
    popular: false
  },
  {
    plan: 'monthly',
    name: 'Monthly',
    price: '60',
    duration: 'month',
    features: [
      'Full real-time GTO advisor',
      'Up to 6 tables',
      'Opponent tracking',
      'P/L tracking',
      'Priority support'
    ],
    popular: true
  },
  {
    plan: '6month',
    name: '6 Months',
    price: '315',
    duration: '6 months',
    features: [
      'Full real-time GTO advisor',
      'Up to 6 tables',
      'Opponent tracking',
      'P/L tracking',
      'Priority support',
      'Save 25%'
    ],
    popular: false
  },
  {
    plan: 'yearly',
    name: 'Yearly',
    price: '549',
    duration: 'year',
    features: [
      'Full real-time GTO advisor',
      'Up to 6 tables',
      'Opponent tracking',
      'P/L tracking',
      'Priority support',
      'Best value - Save 39%'
    ],
    popular: false
  }
];

function Pricing() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <nav className="landing-nav">
          <a href="https://discord.gg/pokersharkscope" target="_blank" rel="noopener noreferrer" className="nav-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/affiliate">Affiliate</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">💰</span>
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1>
            Choose Your Plan<br />
            <span className="gradient-text">Start Winning Today</span>
          </h1>
          <p className="hero-desc">
            No hidden fees. Cancel anytime. Instant license key delivery.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="landing-features" style={{ paddingTop: '2rem' }}>
        <div className="pricing-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {plans.map((plan) => (
            <PricingCard key={plan.plan} {...plan} />
          ))}
        </div>

        {/* Security Badge */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(212, 175, 55, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          maxWidth: '500px',
          margin: '3rem auto 0'
        }}>
          <h3 style={{ color: '#d4af37', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            🔒 Secure Payment via Stripe
          </h3>
          <p style={{ color: '#a3a3a3', fontSize: '0.95rem', margin: 0 }}>
            All transactions are encrypted and processed securely. Your payment info is never stored on our servers.
          </p>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)', margin: '0 -100vw', padding: '5rem calc(50vw - 400px)' }}>
        <div className="features-header">
          <span className="section-tag">Questions?</span>
          <h2>Common Questions</h2>
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Can I switch plans?</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              Yes, you can upgrade or downgrade at any time. Your remaining time will be applied to the new plan.
            </p>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>How many devices can I use?</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              Your license works on any device, but only one active session at a time.
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/faq" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: '500' }}>
              View all FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Ready to Start?</h2>
          <p>Try the 1-Day Pass for just $5 and see the difference.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Create Account
            </Link>
            <Link to="/features" className="btn-hero-secondary">
              Learn More
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
                    <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <a href="https://discord.gg/pokersharkscope" target="_blank" rel="noopener noreferrer" className="footer-discord">Discord</a>
        </div>
        <p className="footer-copy">© 2024 PokerSharkScope. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Pricing;
