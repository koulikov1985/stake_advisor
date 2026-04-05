import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function Affiliate() {
  const earnings = [
    { plan: '1 Day', price: 5, commission: 0.75 },
    { plan: '1 Week', price: 25, commission: 3.75 },
    { plan: '1 Month', price: 85, commission: 12.75 },
    { plan: '1 Year', price: 799, commission: 119.85 }
  ];

  return (
    <div className="landing">
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
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/affiliate">Affiliate</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero" style={{ paddingBottom: '3rem' }}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">💰</span>
            <span>Affiliate Program</span>
          </div>
          <h1>
            Earn <span className="gradient-text">15% Recurring</span><br />
            On Every Referral
          </h1>
          <p className="hero-desc">
            Share PokerSharkScope with your friends, followers, or community.<br />
            Earn commission for as long as they stay subscribed.
          </p>
          <div className="hero-cta-group" style={{ marginTop: '2rem' }}>
            <Link to="/dashboard" className="btn-cta-primary">
              <span>Go to Dashboard</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Active subscribers can access their referral link in the dashboard
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)', padding: '5rem 2rem' }}>
        <div className="features-header">
          <span className="section-tag">How It Works</span>
          <h2>3 Simple Steps</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          maxWidth: '900px',
          margin: '3rem auto 0'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>
              1
            </div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.75rem' }}>Subscribe</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Get an active subscription and unlock your unique referral link in your dashboard
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>
              2
            </div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.75rem' }}>Share</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Share your link with friends, on social media, or in your poker community
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem'
            }}>
              3
            </div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.75rem' }}>Earn</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Earn 15% of every payment your referrals make, for as long as they subscribe
            </p>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="landing-features" style={{ padding: '5rem 2rem' }}>
        <div className="features-header">
          <span className="section-tag">Your Earnings</span>
          <h2>See What You Could Make</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            15% commission on every subscription, every time they pay
          </p>
        </div>

        <div style={{ maxWidth: '700px', margin: '3rem auto 0' }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              padding: '1rem 1.5rem',
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              <span>Plan</span>
              <span style={{ textAlign: 'center' }}>Price</span>
              <span style={{ textAlign: 'right' }}>You Earn</span>
            </div>
            {earnings.map((item, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '1.25rem 1.5rem',
                borderBottom: idx < earnings.length - 1 ? '1px solid var(--border-subtle)' : 'none'
              }}>
                <span style={{ fontWeight: '500' }}>{item.plan}</span>
                <span style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>${item.price}</span>
                <span style={{ textAlign: 'right', color: 'var(--gold)', fontWeight: '600' }}>
                  ${item.commission.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Example Earnings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                5 Monthly Referrals
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '1.75rem', fontWeight: '700' }}>
                $56/mo
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, var(--bg-card) 100%)',
              border: '1px solid var(--gold)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                10 Monthly Referrals
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '1.75rem', fontWeight: '700' }}>
                $112/mo
              </div>
            </div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                25 Monthly Referrals
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '1.75rem', fontWeight: '700' }}>
                $281/mo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)', padding: '5rem 2rem' }}>
        <div className="features-header">
          <span className="section-tag">Program Details</span>
          <h2>Everything You Need to Know</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '3rem auto 0'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💵</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>15% Recurring Commission</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Earn 15% of every payment your referrals make. Not just once — every single time they renew or pay.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔄</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Lifetime Attribution</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Once someone signs up with your link, they're your referral forever. You earn on all their future purchases.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>30-Day Cookie</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              When someone clicks your link, you get credit for their purchase within 30 days — even if they don't buy immediately.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>$25 Minimum Payout</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Request a payout anytime your balance reaches $25. We pay via PayPal within 7 business days.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Real-Time Dashboard</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Track your clicks, signups, and earnings in real-time. See exactly how your referrals are performing.
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>No Limits</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              There's no cap on how much you can earn. Refer 10 people or 1,000 — you get paid for every single one.
            </p>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="landing-features" style={{ padding: '5rem 2rem' }}>
        <div className="features-header">
          <span className="section-tag">Perfect For</span>
          <h2>Who Should Join?</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '3rem auto 0'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎥</div>
            <h3 style={{ marginBottom: '0.75rem' }}>Content Creators</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Poker streamers, YouTubers, and coaches
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ marginBottom: '0.75rem' }}>Community Leaders</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Discord mods, forum admins, study group leaders
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🃏</div>
            <h3 style={{ marginBottom: '0.75rem' }}>Poker Players</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Anyone who knows other players looking to improve
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Ready to Start Earning?</h2>
          <p>Subscribe to PokerSharkScope and unlock your referral link.</p>
          <div className="cta-buttons">
            <Link to="/pricing" className="btn-hero-primary">
              View Plans
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/dashboard" className="btn-hero-secondary">
              Go to Dashboard
            </Link>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Active subscribers get instant access to the affiliate program
          </p>
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
          <Link to="/affiliate">Affiliates</Link>
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
        <p className="footer-copy">© 2024 PokerSharkScope. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Affiliate;
