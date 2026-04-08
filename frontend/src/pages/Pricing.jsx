import React from 'react';
import { Link } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import '../styles/landing.css';

const plans = [
  {
    plan: 'trial',
    name: '1-Day Free Trial',
    price: '0',
    duration: 'day',
    features: [
      'Real-time GTO solver analysis',
      'AI decision support',
      'Multi-table support (6 tables)',
      'Opponent HUD statistics',
      'Hand analyzer & equity calculator',
      'Performance analytics'
    ],
    popular: false
  },
  {
    plan: 'weekly',
    name: 'Weekly Plan',
    price: '15',
    duration: 'week',
    features: [
      'Real-time GTO solver analysis',
      'AI decision support',
      'Multi-table support (6 tables)',
      'Opponent HUD statistics',
      'Hand analyzer & equity calculator',
      'Performance analytics',
      'Full hand history database'
    ],
    popular: false
  },
  {
    plan: 'monthly',
    name: 'Monthly Plan',
    price: '45',
    duration: 'month',
    features: [
      'Real-time GTO solver analysis',
      'AI decision support',
      'Multi-table support (6 tables)',
      'Opponent HUD statistics',
      'Hand analyzer & equity calculator',
      'Performance analytics',
      'Full hand history database',
      'Priority email support',
      'Early access to new features'
    ],
    popular: true
  }
];

function Pricing() {
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
          <p>Try the free 1-Day Pass and see the difference.</p>
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

export default Pricing;
