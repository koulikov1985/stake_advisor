import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function BestPokerHUD() {
  return (
    <>
      <Helmet>
        <title>Best Poker HUD 2026 - Real-Time Statistics & Opponent Tracking</title>
        <meta name="description" content="The best poker HUD software in 2026 with real-time stats, opponent tracking, and comprehensive analytics. Track VPIP, PFR, 3-bet and more." />
        <meta name="keywords" content="best poker HUD, poker HUD software, poker statistics, VPIP PFR, opponent tracking" />
        <link rel="canonical" href="https://www.sharkpokerclub.com/best-poker-hud" />
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
            <Link to="/blog">Blog</Link>
            <Link to="/login" className="nav-btn-ghost">Login</Link>
            <Link to="/signup" className="nav-btn-primary">Get Started</Link>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="hero-glow"></div>
          <div className="hero-content">
            <h1>
              Best Poker HUD 2026<br />
              <span className="gradient-text">Real-Time Opponent Statistics</span>
            </h1>
            <p className="hero-desc">
              Professional-grade poker HUD with comprehensive opponent stats, real-time analysis, and advanced tracking.
              Monitor VPIP, PFR, 3-bet percentage, aggression factor, and 50+ other statistics.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Try HUD Free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <h2>Comprehensive HUD Statistics</h2>
            <p>Track every stat that matters</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>VPIP & PFR</h3>
              <p>Monitor how often opponents play hands and raise preflop. Identify tight and loose players instantly.</p>
            </div>
            <div className="feature-card featured">
              <h3>3-Bet & 4-Bet Stats</h3>
              <p>Track aggression levels by position. Know which opponents are bluffing and which have monsters.</p>
            </div>
            <div className="feature-card">
              <h3>Positional Stats</h3>
              <p>See how opponents play from each position. Exploit positional weaknesses for maximum profit.</p>
            </div>
            <div className="feature-card">
              <h3>Aggression Factor</h3>
              <p>Measure opponent aggression (bet/raise vs call ratio). Adjust your strategy accordingly.</p>
            </div>
            <div className="feature-card">
              <h3>C-Bet Frequencies</h3>
              <p>Track continuation bet patterns on flop, turn, and river. Know when to float and when to fold.</p>
            </div>
            <div className="feature-card">
              <h3>Showdown Stats</h3>
              <p>Monitor WTSD and W$SD to identify calling stations and fit-or-fold players.</p>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <h2>Why Poker AI Has the Best HUD</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="feature-card">
              <h3>Automatic Tracking</h3>
              <p>No manual data entry. Computer vision automatically captures all stats from your poker tables.</p>
            </div>
            <div className="feature-card">
              <h3>Multi-Table Support</h3>
              <p>Track stats across 6 tables simultaneously. Perfect for serious multi-tablers.</p>
            </div>
            <div className="feature-card">
              <h3>Color Coding</h3>
              <p>Instant visual identification of player types. Green = tight, red = fish, yellow = aggressive.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-card">
            <h2>Get the #1 Poker HUD</h2>
            <p>Track opponent statistics and gain an edge at the tables.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-hero-primary">
                Start Free Trial
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
            <Link to="/download">Download</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
          <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default BestPokerHUD;
