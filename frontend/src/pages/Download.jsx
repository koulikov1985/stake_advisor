import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Download() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [downloading, setDownloading] = useState(null);
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
      navigate('/login?redirect=/download');
      return;
    }
    if (!hasLicense) {
      navigate('/pricing');
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
        // Get the final URL after redirect and open it
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
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">⬇</span>
            <span>Download PokerSharkScope</span>
          </div>
          <h1>
            Get The Desktop App<br />
            <span className="gradient-text">For Mac & Windows</span>
          </h1>
          <p className="hero-desc">
            Download the native app for real-time GTO analysis and opponent tracking.
          </p>
        </div>
      </section>

      {/* Download Cards */}
      <section className="landing-features" style={{ paddingTop: '2rem' }}>
        <div className="platforms-grid" style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* macOS Card */}
          <div className="platform-card" style={{ padding: '2.5rem' }}>
            <div className="platform-icon">🍎</div>
            <h3>macOS</h3>
            <p style={{ color: '#d4af37', fontWeight: '600', marginBottom: '0.25rem' }}>Version 1.0.0</p>
            <p style={{ marginBottom: '0.25rem' }}>macOS 10.15 Catalina or later</p>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>~108 MB</p>
            <button
              onClick={() => handleDownload('mac')}
              className="btn-hero-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={downloading === 'mac'}
            >
              {downloading === 'mac' ? 'Preparing...' : 'Download for Mac'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </button>
          </div>

          {/* Windows Card */}
          <div className="platform-card" style={{ padding: '2.5rem' }}>
            <div className="platform-icon">🪟</div>
            <h3>Windows</h3>
            <p style={{ color: '#d4af37', fontWeight: '600', marginBottom: '0.25rem' }}>Version 1.0.0</p>
            <p style={{ marginBottom: '0.25rem' }}>Windows 10 or later</p>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>~95 MB</p>
            <button
              onClick={() => handleDownload('windows')}
              className="btn-hero-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={downloading === 'windows'}
            >
              {downloading === 'windows' ? 'Preparing...' : 'Download for Windows'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Login/License Notice */}
        {!isLoggedIn && (
          <div style={{
            textAlign: 'center',
            padding: '1.25rem 2rem',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            maxWidth: '500px',
            margin: '2rem auto 0'
          }}>
            <p style={{ color: '#d4af37', margin: 0 }}>
              Please <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>log in</Link> or{' '}
              <Link to="/signup" style={{ color: '#fff', textDecoration: 'underline' }}>sign up</Link> to download.
            </p>
          </div>
        )}

        {isLoggedIn && !hasLicense && (
          <div style={{
            textAlign: 'center',
            padding: '1.25rem 2rem',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            maxWidth: '500px',
            margin: '2rem auto 0'
          }}>
            <p style={{ color: '#d4af37', margin: 0 }}>
              You need an active subscription to download.{' '}
              <Link to="/pricing" style={{ color: '#fff', textDecoration: 'underline' }}>View pricing</Link>
            </p>
          </div>
        )}
      </section>

      {/* Installation Instructions */}
      <section className="landing-features" style={{ background: 'var(--bg-surface)', margin: '4rem -100vw 0', padding: '5rem calc(50vw - 500px)' }}>
        <div className="features-header">
          <span className="section-tag">Setup</span>
          <h2>Installation Instructions</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {/* macOS Instructions */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🍎 macOS
            </h3>
            <ol style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '2' }}>
              <li>Download and extract the ZIP file</li>
              <li>Drag PokerSharkScope to Applications</li>
              <li>Double-click "Launch Chrome" script</li>
              <li>Open PokerSharkScope app</li>
              <li>Enter your license key when prompted</li>
              <li>Set your Stake.us username in Settings</li>
            </ol>
          </div>

          {/* Windows Instructions */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🪟 Windows
            </h3>
            <ol style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '2' }}>
              <li>Download and extract the ZIP file</li>
              <li>Run "Launch Chrome.bat" first</li>
              <li>Open PokerSharkScope.exe</li>
              <li>Click "More info" then "Run anyway" if blocked</li>
              <li>Enter your license key when prompted</li>
              <li>Set your Stake.us username in Settings</li>
            </ol>
          </div>
        </div>

        {/* Important Note */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '600px',
          margin: '2rem auto 0',
          textAlign: 'center'
        }}>
          <p style={{ color: '#d4af37', fontWeight: '600', marginBottom: '0.5rem' }}>
            Important: Launch Chrome First!
          </p>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            Always use the included "Launch Chrome" script before starting PokerSharkScope.
            This enables the connection between the app and your browser.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Need Help Getting Started?</h2>
          <p>Check our FAQ or contact support if you run into any issues.</p>
          <div className="cta-buttons">
            <Link to="/faq" className="btn-hero-primary">
              View FAQ
            </Link>
            <Link to="/features" className="btn-hero-secondary">
              See Features
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

export default Download;
