import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const plans = [
  { plan: 'daily', name: '1 Day', price: 5 },
  { plan: 'weekly', name: '1 Week', price: 25 },
  { plan: 'monthly', name: '1 Month', price: 75, popular: true },
  { plan: 'yearly', name: '1 Year', price: 699, savings: '62%' }
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [purchasing, setPurchasing] = useState(null);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const userData = await res.json();
      setUser(userData);

      // Fetch affiliate stats if user has active subscription
      if (userData.isActive) {
        fetchAffiliateStats(token);
      }
    } catch {
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliateStats = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/affiliate/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAffiliateStats(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch affiliate stats:', err);
    }
  };

  const generateReferralCode = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/affiliate/code`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAffiliateStats(prev => ({
          ...prev,
          referralCode: data.referralCode,
          referralLink: data.referralLink
        }));
        return data.referralLink;
      }
    } catch (err) {
      console.error('Failed to generate referral code:', err);
    }
    return null;
  };

  const handlePurchase = async (planId) => {
    setPurchasing(planId);
    try {
      // Get referral code from localStorage if valid
      let referralCode = null;
      const storedCode = localStorage.getItem('referralCode');
      const expiresAt = localStorage.getItem('referralCodeExpires');
      if (storedCode && expiresAt && Date.now() < parseInt(expiresAt)) {
        referralCode = storedCode;
      }

      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, email: user?.email, referralCode })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setPurchasing(null);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(user?.licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyReferralLink = async () => {
    let link = affiliateStats?.referralLink;
    if (!link) {
      link = await generateReferralCode();
    }
    if (link) {
      navigator.clipboard.writeText(link);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const getReferralLink = () => {
    return affiliateStats?.referralLink || 'Click to generate your referral link';
  };

  const handleManageSubscription = async () => {
    setManagingSubscription(true);
    try {
      const res = await fetch(`${API_URL}/api/create-portal-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setManagingSubscription(false);
    }
  };

  const handleDownload = (platform) => {
    const token = localStorage.getItem('token');
    // Create a temporary link with auth
    const link = document.createElement('a');
    link.href = `${API_URL}/api/download/${platform}`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  if (loading) {
    return (
      <div className="dash">
        <div className="dash-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = user?.isActive && user?.licenseKey;

  return (
    <div className="dash">
      {/* Header */}
      <header className="dash-header">
        <Link to="/" className="dash-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <div className="dash-header-right">
          <a href="https://discord.gg/pokersharkscope" target="_blank" rel="noopener noreferrer" className="dash-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </a>
          <div className="dash-user">
            <span className="user-email">{user?.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Welcome Section */}
        <div className="dash-welcome">
          <h1>Welcome back!</h1>
          <p>Manage your subscription and download the app</p>
        </div>

        {/* Main Grid */}
        <div className="dash-grid">
          {/* Subscription Status Card */}
          <div className="dash-card status-card">
            <div className="card-icon">
              {hasActiveSubscription ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
            </div>
            <div className="card-content">
              <h3>Subscription</h3>
              {hasActiveSubscription ? (
                <>
                  <div className="status-active">
                    <span className="status-dot"></span>
                    Active
                  </div>
                  <div className="status-details">
                    <div className="detail-row">
                      <span>Plan</span>
                      <strong>{user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1)}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Days Left</span>
                      <strong className="gold">{user.daysRemaining || 0}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Expires</span>
                      <strong>{formatDate(user.expiresAt)}</strong>
                    </div>
                  </div>
                  <button
                    className="manage-btn"
                    onClick={handleManageSubscription}
                    disabled={managingSubscription}
                  >
                    {managingSubscription ? 'Opening...' : 'Manage Subscription'}
                  </button>
                </>
              ) : (
                <>
                  <div className="status-inactive">No Active Plan</div>
                  <p className="status-hint">Choose a plan below to get started</p>
                </>
              )}
            </div>
          </div>

          {/* License Key Card */}
          <div className="dash-card license-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>License Key</h3>
              {user?.licenseKey ? (
                <>
                  <div className="license-key-box">
                    <code>{user.licenseKey}</code>
                    <button className="copy-btn" onClick={copyKey}>
                      {copied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="license-hint">Enter this key when you open the app</p>
                </>
              ) : (
                <p className="no-license">Purchase a plan to get your license key</p>
              )}
            </div>
          </div>

          {/* Download Card - Only show if active subscription */}
          {hasActiveSubscription && (
            <div className="dash-card download-card full-width">
              <div className="card-icon download-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>Download App</h3>
                <p>Get PokerSharkScope for your platform</p>
                <div className="download-buttons">
                  <button className="download-btn mac" onClick={() => handleDownload('mac')}>
                    <span className="platform-icon">🍎</span>
                    <span className="platform-info">
                      <strong>macOS</strong>
                      <small>10.15 or later</small>
                    </span>
                  </button>
                  <button className="download-btn windows" onClick={() => handleDownload('windows')}>
                    <span className="platform-icon">🪟</span>
                    <span className="platform-info">
                      <strong>Windows</strong>
                      <small>Windows 10+</small>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Affiliate Card - Only show if active subscription */}
          {hasActiveSubscription && (
            <div className="dash-card affiliate-card full-width">
              <div className="card-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ stroke: '#22c55e' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>Refer & Earn 15%</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  Share your link and earn 15% of every payment your referrals make
                </p>
                <div className="license-key-box">
                  <code style={{ fontSize: '0.8rem' }}>{getReferralLink()}</code>
                  <button className="copy-btn" onClick={copyReferralLink}>
                    {copiedRef ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Referrals</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{affiliateStats?.totalReferrals || 0}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Earnings</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--gold)' }}>
                      ${(affiliateStats?.totalEarned || 0).toFixed(2)}
                    </div>
                  </div>
                  <Link to="/affiliate" style={{
                    marginLeft: 'auto',
                    color: 'var(--gold)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Learn more →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Section - Show if no active subscription */}
        {!hasActiveSubscription && (
          <div className="dash-pricing">
            <h2>Choose Your Plan</h2>
            <p>Start crushing the tables today</p>
            <div className="pricing-grid">
              {plans.map((p) => (
                <div key={p.plan} className={`pricing-card ${p.popular ? 'popular' : ''}`}>
                  {p.popular && <div className="popular-badge">Best Value</div>}
                  {p.savings && <div className="savings-badge">Save {p.savings}</div>}
                  <h3>{p.name}</h3>
                  <div className="price">
                    <span className="currency">$</span>
                    <span className="amount">{p.price}</span>
                  </div>
                  <ul>
                    <li>Real-time GTO advice</li>
                    <li>6 tables simultaneously</li>
                    <li>Opponent tracking</li>
                    <li>Hand replay</li>
                  </ul>
                  <button
                    className={`buy-btn ${p.popular ? 'primary' : ''}`}
                    onClick={() => handlePurchase(p.plan)}
                    disabled={purchasing === p.plan}
                  >
                    {purchasing === p.plan ? 'Processing...' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="dash-links">
          <Link to="/faq" className="quick-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            FAQ
          </Link>
          <a href="https://discord.gg/pokersharkscope" target="_blank" rel="noopener noreferrer" className="quick-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36-.698.772-1.362 1.225-1.993a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Discord
          </a>
          <Link to="/download" className="quick-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Setup Guide
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
