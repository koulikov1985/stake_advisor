import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const downloadGuides = [
  {
    href: '/poker-software-for-mac',
    title: 'Poker software for Mac',
    description: 'A dedicated page for macOS buyers comparing poker software options.',
  },
  {
    href: '/poker-software-for-windows',
    title: 'Poker software for Windows',
    description: 'The matching Windows page for desktop-focused commercial traffic.',
  },
  {
    href: '/poker-software',
    title: 'Poker software',
    description: 'The broad software hub if you want the full product overview before downloading.',
  },
  {
    href: '/poker-decision-support-software',
    title: 'Poker decision support software',
    description: 'Useful if you are evaluating the product from a workflow and positioning angle.',
  },
];

function Download() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetch(`${API_URL}/api/user/license`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.license_key && data.status === 'active') {
            setHasLicense(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleDownload = async (platform) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!hasLicense) {
      setShowLicenseModal(true);
      return;
    }

    const token = localStorage.getItem('token');
    setDownloading(platform);

    try {
      const res = await fetch(`${API_URL}/api/user/download/${platform}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        redirect: 'follow'
      });

      if (res.ok) {
        window.location.href = res.url;
      } else {
        const data = await res.json();
        alert(data.detail || 'Download failed. Please try again.');
      }
    } catch (err) {
      alert('Download failed. Please try again.');
    }
    setDownloading(null);
  };

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

      {/* Auth Required Modal */}
      {showAuthModal && (
        <div className="download-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="download-modal" onClick={(e) => e.stopPropagation()}>
            <button className="download-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            <div className="download-modal-icon">🔐</div>
            <h3>Authentication Required</h3>
            <p>Please log in or create an account to download Poker AI.</p>
            <div className="download-modal-buttons">
              <Link to="/login?redirect=/download" className="download-modal-btn primary">
                Log In
              </Link>
              <Link to="/signup" className="download-modal-btn secondary">
                Create Account
              </Link>
            </div>
            <p className="download-modal-note">
              New users get <strong>200 free hands</strong> to try the AI!
            </p>
          </div>
        </div>
      )}

      {/* License Required Modal */}
      {showLicenseModal && (
        <div className="download-modal-overlay" onClick={() => setShowLicenseModal(false)}>
          <div className="download-modal" onClick={(e) => e.stopPropagation()}>
            <button className="download-modal-close" onClick={() => setShowLicenseModal(false)}>×</button>
            <div className="download-modal-icon">🎫</div>
            <h3>Subscription Required</h3>
            <p>You need an active subscription to download the Poker AI software.</p>
            <div className="download-modal-buttons">
              <Link to="/dashboard" className="download-modal-btn primary">
                Get Subscription
              </Link>
              <button onClick={() => setShowLicenseModal(false)} className="download-modal-btn secondary">
                Maybe Later
              </button>
            </div>
            <p className="download-modal-note">
              Try our <strong>free 1-Day Pass</strong> or subscribe from <strong>$15/week</strong>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="nav-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>
          <Link to="/poker-software">Software</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/affiliate" className="nav-affiliate-glow">Affiliate</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost">Login</Link>
              <Link to="/signup" className="nav-btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-ai" style={{ minHeight: 'auto', paddingTop: '10rem', paddingBottom: '4rem' }}>
        <div className="hero-bg-effects">
          <div className="ai-grid-bg"></div>
          <div className="ai-glow-orb orb-1"></div>
        </div>
        <div className="hero-content-ai">
          <div className="ai-badge">
            <span className="ai-pulse"></span>
            <span className="ai-text">Download</span>
          </div>
          <h1 className="hero-title-ai">
            Get The Desktop App<br />
            <span className="gradient-text-ai">For Mac & Windows</span>
          </h1>
          <p className="hero-subtitle-ai">
            Download the native Poker AI app for fully automated play with real-time GTO decisions.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className="download-section">
        <div className="download-cards">
          {/* macOS Card */}
          <div className="download-card">
            <div className="download-card-icon">🍎</div>
            <h3>macOS</h3>
            <div className="download-card-version">Version 1.0.0</div>
            <p className="download-card-req">macOS 10.15 Catalina or later</p>
            <p className="download-card-size">~108 MB</p>
            <button
              onClick={() => handleDownload('mac')}
              className="download-card-btn"
              disabled={downloading === 'mac'}
            >
              {downloading === 'mac' ? (
                <>
                  <span className="download-spinner"></span>
                  Preparing...
                </>
              ) : (
                <>
                  Download for Mac
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Windows Card */}
          <div className="download-card">
            <div className="download-card-icon">🪟</div>
            <h3>Windows</h3>
            <div className="download-card-version">Version 1.0.0</div>
            <p className="download-card-req">Windows 10 or later</p>
            <p className="download-card-size">~95 MB</p>
            <button
              onClick={() => handleDownload('windows')}
              className="download-card-btn"
              disabled={downloading === 'windows'}
            >
              {downloading === 'windows' ? (
                <>
                  <span className="download-spinner"></span>
                  Preparing...
                </>
              ) : (
                <>
                  Download for Windows
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Badge */}
        {isLoggedIn && hasLicense && (
          <div className="download-status success">
            <span>✓</span> You have an active subscription. Ready to download!
          </div>
        )}
      </section>

      {/* Installation Instructions */}
      <section className="install-section">
        <div className="section-header-ai">
          <span className="section-tag-ai">Setup Guide</span>
          <h2 className="section-title-ai">
            Installation<br/>
            <span className="gradient-text-ai">Instructions</span>
          </h2>
        </div>

        <div className="install-grid">
          {/* macOS Instructions */}
          <div className="install-card">
            <h3><span>🍎</span> macOS</h3>
            <ol>
              <li>Download and extract the ZIP file</li>
              <li>Drag Poker AI to Applications</li>
              <li>Double-click "Launch Chrome" script</li>
              <li>Open Poker AI app</li>
              <li>Enter your license key when prompted</li>
              <li>Set your Stake.us username in Settings</li>
            </ol>
          </div>

          {/* Windows Instructions */}
          <div className="install-card">
            <h3><span>🪟</span> Windows</h3>
            <ol>
              <li>Download and extract the ZIP file</li>
              <li>Run "Launch Chrome.bat" first</li>
              <li>Open PokerAI.exe</li>
              <li>Click "More info" → "Run anyway" if blocked</li>
              <li>Enter your license key when prompted</li>
              <li>Set your Stake.us username in Settings</li>
            </ol>
          </div>
        </div>

        {/* Important Note */}
        <div className="install-note">
          <div className="install-note-icon">⚠️</div>
          <div>
            <strong>Important: Launch Chrome First!</strong>
            <p>Always use the included "Launch Chrome" script before starting Poker AI. This enables the connection between the app and your browser.</p>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="features-header">
          <span className="section-tag">Related Pages</span>
          <h2>Choose the right software page before you install</h2>
          <p>These pages answer the most common Mac, Windows, and product-fit questions around download intent.</p>
        </div>
        <div className="seo-resource-grid">
          {downloadGuides.map((page) => (
            <Link key={page.href} to={page.href} className="seo-resource-card">
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <span className="seo-resource-link">Open page</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta-ai">
        <div className="cta-bg-ai">
          <div className="cta-glow-ai"></div>
        </div>
        <div className="cta-content-ai">
          <h2>Need Help Getting Started?</h2>
          <p>Check our FAQ or join Discord if you run into any issues.</p>
          <div className="hero-cta-group">
            <Link to="/faq" className="btn-cta-ai">
              <span>View FAQ</span>
            </Link>
            <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="btn-cta-secondary-ai">
              <span>Join Discord</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer-ai">
        <div className="footer-brand-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="footer-logo" />
        </div>
        <div className="footer-links-ai">
          <Link to="/poker-software">Software</Link>
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

export default Download;
