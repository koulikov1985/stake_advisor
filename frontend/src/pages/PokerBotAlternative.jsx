import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

function PokerBotAlternative() {
  return (
    <>
      <Helmet>
        <title>Poker Bot Alternative - Legal AI Training Software 2026</title>
        <meta name="description" content="Legal alternative to poker bots. AI-powered training software for learning and improving your game without automation or terms of service violations." />
        <meta name="keywords" content="poker bot alternative, legal poker software, poker training tool, poker AI assistant" />
        <link rel="canonical" href="https://www.sharkpokerclub.com/poker-bot-alternative" />
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
            <h1>
              Legal Poker Bot Alternative<br />
              <span className="gradient-text">AI Training Software</span>
            </h1>
            <p className="hero-desc">
              Looking for poker bot alternatives? Poker AI is legal training software that teaches optimal strategy without automation.
              Learn GTO poker, analyze hands, and improve your game the right way.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Try Legal Alternative
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <h2>Why Poker Bots Are Prohibited</h2>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
            <h3>Poker Bots Violate Terms of Service</h3>
            <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <li><strong>Automation:</strong> Bots automatically make decisions and click buttons</li>
              <li><strong>Against rules:</strong> All major poker sites prohibit automated play</li>
              <li><strong>Account bans:</strong> Using bots results in permanent account closure</li>
              <li><strong>Legal issues:</strong> Can result in legal action and fund seizure</li>
            </ul>
            <h3 style={{ marginTop: '2rem' }}>The Legal Alternative</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <strong>Poker AI is training software</strong> that provides strategy recommendations while YOU make the final decision.
              This is the key difference that makes it legal and compliant.
            </p>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <span className="section-tag">Legal Features</span>
            <h2>What You Get with Poker AI</h2>
            <p>All the benefits without the risks</p>
          </div>
          <div className="features-grid">
            <div className="feature-card featured">
              <div className="feature-icon"><span>✅</span></div>
              <h3>Legal Training Tool</h3>
              <p>Designed for learning and study. No automation, no button clicking, no terms of service violations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>🎯</span></div>
              <h3>GTO Strategy Learning</h3>
              <p>Learn optimal poker strategy with real-time GTO calculations and hand analysis.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>📊</span></div>
              <h3>Hand Analysis & Review</h3>
              <p>Review your hands after sessions to identify mistakes and improve your game.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>💡</span></div>
              <h3>Decision Support</h3>
              <p>AI provides recommendations, but YOU make the final decision. This keeps it legal.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>📈</span></div>
              <h3>Performance Tracking</h3>
              <p>Track your progress and improvement over time with comprehensive analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><span>🛡️</span></div>
              <h3>No Account Risk</h3>
              <p>100% legal software. No risk of account bans or fund seizure.</p>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <h2>Poker AI vs Poker Bots</h2>
          </div>
          <div className="comparison-table" style={{ maxWidth: '900px', margin: '0 auto', background: 'var(--bg-darker)', borderRadius: '16px', padding: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Feature</th>
                  <th style={{ padding: '1rem' }}>Poker AI</th>
                  <th style={{ padding: '1rem' }}>Poker Bots</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem' }}>Legal to use</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: 'var(--accent-cyan)' }}>✅ Yes</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: '#ff4444' }}>❌ No</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem' }}>Automation</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: 'var(--accent-cyan)' }}>❌ No automation</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: '#ff4444' }}>✅ Fully automated</td>
                </tr>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem' }}>Human makes decisions</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: 'var(--accent-cyan)' }}>✅ Yes</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: '#ff4444' }}>❌ No</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem' }}>Risk of account ban</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: 'var(--accent-cyan)' }}>❌ No risk</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: '#ff4444' }}>✅ High risk</td>
                </tr>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem' }}>Improves your skills</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: 'var(--accent-cyan)' }}>✅ Yes</td>
                  <td style={{ textAlign: 'center', padding: '1rem', color: '#ff4444' }}>❌ No learning</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-card">
            <h2>Choose the Legal Alternative</h2>
            <p>Improve your poker game without risking your account or breaking rules.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-hero-primary">
                Start Training Legally
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

export default PokerBotAlternative;
