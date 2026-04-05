import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const plans = [
  { plan: 'trial', name: 'Free Trial', price: 0, label: '200 Hands Free' },
  { plan: 'day', name: '1 Day', price: 5 },
  { plan: 'week', name: '1 Week', price: 25, savings: '50%' },
  { plan: 'month', name: '1 Month', price: 60, popular: true, savings: '60%' },
  { plan: '6month', name: '6 Months', price: 315, savings: '65%' },
  { plan: 'year', name: '1 Year', price: 549, savings: '70%' }
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [license, setLicense] = useState(null);
  const [devices, setDevices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [affiliateStats, setAffiliateStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [purchasing, setPurchasing] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const userData = await res.json();
      setUser(userData);

      // Fetch license info
      if (userData.license_id) {
        fetchLicense(token, userData.license_id);
      }

      // Fetch devices
      fetchDevices(token);

      // Fetch payment history
      fetchPayments(token);

      // Fetch affiliate stats for all users with active subscription
      fetchAffiliateStats(token);
    } catch {
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchLicense = async (token, licenseId) => {
    try {
      const res = await fetch(`${API_URL}/api/user/license`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLicense(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch license:', err);
    }
  };

  const fetchDevices = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/user/devices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    }
  };

  const fetchPayments = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/user/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  const fetchAffiliateStats = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/user/affiliate/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAffiliateStats(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch affiliate stats:', err);
    }
  };

  const activateAffiliate = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/user/affiliate/activate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAffiliateStats(prev => ({
          ...prev,
          is_affiliate: true,
          affiliate_code: data.affiliate_code,
          referral_link: data.referral_link
        }));
      }
    } catch (err) {
      console.error('Failed to activate affiliate:', err);
    }
  };

  const removeDevice = async (deviceId) => {
    if (!confirm('Remove this device? It will need to be re-activated.')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/user/devices/${deviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDevices(devices.filter(d => d.id !== deviceId));
      }
    } catch (err) {
      console.error('Failed to remove device:', err);
    }
  };

  const handlePurchase = async (planId) => {
    setPurchasing(planId);
    try {
      const res = await fetch(`${API_URL}/api/user/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId, email: user?.email })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setPurchasing(null);
    }
  };

  const openCustomerPortal = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/payment/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Failed to open portal:', err);
    }
  };

  const copyKey = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyReferralLink = () => {
    if (affiliateStats?.referral_link) {
      navigator.clipboard.writeText(affiliateStats.referral_link);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const resendVerification = async () => {
    if (resendingVerification || verificationSent) return;
    setResendingVerification(true);
    try {
      const res = await fetch(`${API_URL}/api/user/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email })
      });
      if (res.ok) {
        setVerificationSent(true);
      }
    } catch (err) {
      console.error('Failed to resend verification:', err);
    } finally {
      setResendingVerification(false);
    }
  };

  const handleDownload = (platform) => {
    const token = localStorage.getItem('token');
    window.location.href = `${API_URL}/api/user/download/${platform}?token=${token}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const getDaysRemaining = () => {
    if (!license?.expires_at) return 0;
    const now = new Date();
    const expires = new Date(license.expires_at);
    const diff = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

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

  // Require email verification
  if (user && !user.email_verified) {
    return (
      <div className="dash">
        <header className="dash-header">
          <Link to="/" className="dash-logo">
            <span className="logo-icon">♠</span>
            <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
          </Link>
          <div className="dash-header-right">
            <div className="dash-user">
              <span className="user-email">{user?.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </header>

        <main className="dash-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '3rem',
            maxWidth: '480px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(212, 175, 55, 0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem'
            }}>
              ✉️
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.75rem' }}>
              Verify Your Email
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              We sent a verification email to <strong style={{ color: 'var(--gold)' }}>{user.email}</strong>.
              Please check your inbox and click the verification link to access your dashboard.
            </p>

            <button
              onClick={resendVerification}
              disabled={resendingVerification || verificationSent}
              style={{
                width: '100%',
                background: verificationSent ? 'rgba(0, 217, 126, 0.15)' : 'var(--gold)',
                color: verificationSent ? '#00d97e' : '#000',
                border: verificationSent ? '1px solid #00d97e' : 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: verificationSent ? 'default' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              {verificationSent ? '✓ Email Sent!' : resendingVerification ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Didn't receive it? Check your spam folder or click above to resend.
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Wrong email address?
              </p>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: 'var(--gold)',
                  border: '1px solid var(--gold)',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Sign up with different email
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasActiveSubscription = license?.status === 'active';

  return (
    <div className="dash">
      {/* Header */}
      <header className="dash-header">
        <Link to="/" className="dash-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <div className="dash-header-right">
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="dash-discord">
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

      {/* Email Verification Banner */}
      {user && !user.email_verified && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ width: '20px', height: '20px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            Please verify your email address to access all features.
          </span>
          <button
            onClick={resendVerification}
            disabled={resendingVerification || verificationSent}
            style={{
              background: verificationSent ? 'transparent' : 'var(--gold)',
              color: verificationSent ? 'var(--gold)' : '#000',
              border: verificationSent ? '1px solid var(--gold)' : 'none',
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: verificationSent ? 'default' : 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {verificationSent ? 'Email Sent!' : resendingVerification ? 'Sending...' : 'Resend Email'}
          </button>
        </div>
      )}

      <main className="dash-main">
        {/* Welcome Section */}
        <div className="dash-welcome">
          <h1>Welcome back!</h1>
          <p>Manage your subscription, devices, and downloads</p>
        </div>

        {/* Section Tabs */}
        {hasActiveSubscription && (
          <div className="dash-tabs">
            <button
              className={`dash-tab ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              Overview
            </button>
            <button
              className={`dash-tab ${activeSection === 'referral' ? 'active' : ''}`}
              onClick={() => setActiveSection('referral')}
              style={activeSection === 'referral' ? {} : { color: '#00d97e' }}
            >
              Referral Program
            </button>
            <button
              className={`dash-tab ${activeSection === 'devices' ? 'active' : ''}`}
              onClick={() => setActiveSection('devices')}
            >
              Devices ({devices.length})
            </button>
            <button
              className={`dash-tab ${activeSection === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveSection('payments')}
            >
              Payment History
            </button>
          </div>
        )}

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <>
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
                          <strong>{license.tier?.toUpperCase()}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Days Left</span>
                          <strong className="gold">{getDaysRemaining()}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Expires</span>
                          <strong>{formatDate(license.expires_at)}</strong>
                        </div>
                      </div>
                      <button
                        onClick={openCustomerPortal}
                        style={{
                          marginTop: '1rem',
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        Manage Subscription
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
                  {license?.license_key ? (
                    <>
                      <div className="license-key-box">
                        <code>{license.license_key}</code>
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
                  <div className="card-icon">
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

              {/* Supported Sites Card */}
              <div className="dash-card full-width" style={{ marginTop: '1rem', overflow: 'hidden' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ width: '28px', height: '28px' }}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem' }}>Supported Poker Sites</h3>
                    <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)' }}>PokerSharkScope works with these platforms</p>

                    {/* Supported Sites */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        color: '#00d97e',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        <span className="pulse-dot" style={{
                          width: '8px',
                          height: '8px',
                          background: '#00d97e',
                          borderRadius: '50%',
                          boxShadow: '0 0 12px rgba(0, 217, 126, 0.6)',
                          animation: 'pulse-glow 2s ease-in-out infinite'
                        }}></span>
                        Live Now
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(0, 217, 126, 0.15) 0%, rgba(0, 217, 126, 0.05) 100%)',
                        border: '1px solid rgba(0, 217, 126, 0.3)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 217, 126, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}>
                          🎰
                        </div>
                        <div>
                          <div style={{
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem'
                          }}>Stake.us</div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#00d97e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '12px', height: '12px' }}>
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Full Support
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coming Soon */}
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        color: 'var(--gold)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          background: 'var(--gold)',
                          borderRadius: '50%',
                          boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)'
                        }}></span>
                        Coming Soon
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                          { name: 'Global Poker', icon: '🌐' },
                          { name: 'ClubGG', icon: '🃏' },
                          { name: 'BetOnline', icon: '💰' },
                          { name: 'Ignition', icon: '🔥' },
                          { name: 'Americas Cardroom', icon: '🇺🇸' }
                        ].map((site, index) => (
                          <div
                            key={site.name}
                            style={{
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              padding: '0.6rem 1rem',
                              color: 'var(--text-muted)',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s ease',
                              cursor: 'default',
                              opacity: 0,
                              animation: `fadeSlideIn 0.4s ease forwards ${index * 0.1}s`
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = 'var(--gold)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = 'var(--border-subtle)';
                              e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                          >
                            <span style={{ fontSize: '1rem' }}>{site.icon}</span>
                            {site.name}
                          </div>
                        ))}
                      </div>
                      <a
                        href="https://discord.gg/NHUjvZXzrR"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'var(--gold)',
                          fontSize: '0.85rem',
                          marginTop: '1.25rem',
                          textDecoration: 'none',
                          padding: '0.5rem 0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <span style={{ fontSize: '1.1rem' }}>💬</span>
                        Request a site on Discord
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                          <path d="M7 17L17 7M17 7H7M17 7V17"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 12px rgba(0, 217, 126, 0.6); }
                  50% { box-shadow: 0 0 20px rgba(0, 217, 126, 0.9); }
                }
                @keyframes fadeSlideIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

            </div>
          </>
        )}

        {/* Referral Program Section */}
        {activeSection === 'referral' && (
          <div className="referral-section">
            {/* Hero Banner */}
            <div className="dash-card" style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 126, 0.15) 0%, rgba(0, 179, 104, 0.05) 100%)',
              border: '1px solid rgba(0, 217, 126, 0.3)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(0, 217, 126, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  💰
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Earn 15% Recurring Commission</h2>
                  <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>
                    Share your link and earn 15% of every payment your referrals make - not just once, but every time they renew!
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Your Commission Rate</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00d97e' }}>{affiliateStats?.commission_rate || 15}%</div>
                </div>
              </div>
            </div>

            {affiliateStats?.is_affiliate ? (
              <>
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div className="dash-card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}>Referrals</div>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      lineHeight: '1',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>{affiliateStats?.total_referrals || 0}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Total signups</div>
                  </div>
                  <div className="dash-card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}>Converted</div>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      lineHeight: '1',
                      color: 'var(--accent-blue)',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>{affiliateStats?.converted_referrals || 0}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Paid customers</div>
                  </div>
                  <div className="dash-card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}>Earned</div>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      lineHeight: '1',
                      color: '#00d97e',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>${(affiliateStats?.total_earned || 0).toFixed(2)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Lifetime total</div>
                  </div>
                  <div className="dash-card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}>Pending</div>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      lineHeight: '1',
                      color: 'var(--gold)',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>${(affiliateStats?.pending_earnings || 0).toFixed(2)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Awaiting approval</div>
                  </div>
                </div>

                {/* Referral Link + Quick Share */}
                <div className="dash-card" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Your Referral Link</h3>
                    <span style={{
                      background: 'rgba(0, 217, 126, 0.15)',
                      color: '#00d97e',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      30-day cookie
                    </span>
                  </div>
                  <div className="license-key-box" style={{ marginBottom: '1rem' }}>
                    <code style={{ fontSize: '0.9rem' }}>{affiliateStats.referral_link}</code>
                    <button className="copy-btn" onClick={copyReferralLink} title="Copy link">
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

                  {/* Quick Share Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Level up your poker game with PokerSharkScope - real-time GTO advice! Use my link:')}&url=${encodeURIComponent(affiliateStats.referral_link)}`, '_blank')}
                      style={{
                        background: '#1DA1F2',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Share on X
                    </button>
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateStats.referral_link)}`, '_blank')}
                      style={{
                        background: '#1877F2',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button
                      onClick={() => window.open(`https://reddit.com/submit?url=${encodeURIComponent(affiliateStats.referral_link)}&title=${encodeURIComponent('PokerSharkScope - Real-time GTO advice for online poker')}`, '_blank')}
                      style={{
                        background: '#FF4500',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                      </svg>
                      Reddit
                    </button>
                    <button
                      onClick={() => window.open(`mailto:?subject=${encodeURIComponent('Check out PokerSharkScope')}&body=${encodeURIComponent(`Hey! I've been using PokerSharkScope for real-time GTO advice in online poker and it's been a game changer. Check it out: ${affiliateStats.referral_link}`)}`, '_blank')}
                      style={{
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      Email
                    </button>
                  </div>
                </div>

                {/* Two Column: Payout + Calculator */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {/* Payout Section */}
                  <div className="dash-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0 }}>Request Payout</h3>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Min: $25</span>
                    </div>
                    <div style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Available Balance</div>
                      <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-green)' }}>
                        ${(affiliateStats?.total_earned || 0).toFixed(2)}
                      </div>
                    </div>
                    <button
                      disabled={(affiliateStats?.total_earned || 0) < 25}
                      style={{
                        width: '100%',
                        background: (affiliateStats?.total_earned || 0) >= 25
                          ? 'linear-gradient(135deg, #00d97e 0%, #00b368 100%)'
                          : 'var(--bg-surface)',
                        color: (affiliateStats?.total_earned || 0) >= 25 ? '#000' : 'var(--text-muted)',
                        border: 'none',
                        padding: '0.875rem 1.5rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: (affiliateStats?.total_earned || 0) >= 25 ? 'pointer' : 'not-allowed',
                        fontSize: '1rem'
                      }}
                      onClick={() => {
                        if ((affiliateStats?.total_earned || 0) >= 25) {
                          window.open('https://discord.gg/NHUjvZXzrR', '_blank');
                        }
                      }}
                    >
                      {(affiliateStats?.total_earned || 0) >= 25 ? 'Request Payout' : `$${(25 - (affiliateStats?.total_earned || 0)).toFixed(2)} more to unlock`}
                    </button>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'center' }}>
                      Payouts via PayPal within 7 days
                    </p>
                  </div>

                  {/* Earnings Calculator */}
                  <div className="dash-card">
                    <h3 style={{ marginBottom: '1rem' }}>Earnings Potential</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      See what you could earn with monthly referrals:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { refs: 5, monthly: 45 },
                        { refs: 10, monthly: 90 },
                        { refs: 25, monthly: 225 },
                        { refs: 50, monthly: 450 }
                      ].map(({ refs, monthly }) => (
                        <div key={refs} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: 'var(--bg-elevated)',
                          borderRadius: '8px'
                        }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{refs} monthly subscribers</span>
                          <span style={{ fontWeight: '700', color: 'var(--accent-green)' }}>${monthly}/mo</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'center' }}>
                      Based on average $60/mo subscription
                    </p>
                  </div>
                </div>

                {/* How It Works */}
                <div className="dash-card" style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1.5rem' }}>How It Works</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'var(--gold)',
                        fontWeight: '700',
                        fontSize: '1.25rem'
                      }}>1</div>
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Share Link</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                        Post on social media or send to friends
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'var(--gold)',
                        fontWeight: '700',
                        fontSize: '1.25rem'
                      }}>2</div>
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>They Sign Up</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                        30-day cookie tracks their visit
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'var(--gold)',
                        fontWeight: '700',
                        fontSize: '1.25rem'
                      }}>3</div>
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>They Subscribe</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                        You earn 15% instantly
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(0, 217, 126, 0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: '#00d97e',
                        fontWeight: '700',
                        fontSize: '1.25rem'
                      }}>∞</div>
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Recurring</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                        Earn on every renewal forever
                      </p>
                    </div>
                  </div>
                </div>

                {/* Program Benefits */}
                <div className="dash-card">
                  <h3 style={{ marginBottom: '1rem' }}>Program Benefits</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.25rem' }}>💵</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>15% Recurring</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Earn on every payment, not just the first</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.25rem' }}>🔄</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>Lifetime Attribution</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Referrals are yours forever</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.25rem' }}>📅</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>30-Day Cookie</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>They don't have to buy immediately</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.25rem' }}>🎯</span>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>No Limits</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Unlimited earning potential</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Not yet an affiliate - show activation */
              <div className="dash-card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(0, 217, 126, 0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2.5rem'
                }}>
                  🚀
                </div>
                <h2 style={{ marginBottom: '1rem' }}>Ready to Start Earning?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                  Join our affiliate program and earn 15% recurring commission on every payment your referrals make.
                  It's free to join and there's no limit to how much you can earn!
                </p>

                {/* Benefits Preview */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  maxWidth: '600px',
                  margin: '0 auto 2rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00d97e' }}>15%</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Commission Rate</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gold)' }}>∞</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Recurring Forever</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-blue)' }}>$25</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Min Payout</div>
                  </div>
                </div>

                <button
                  onClick={activateAffiliate}
                  style={{
                    background: 'linear-gradient(135deg, #00d97e 0%, #00b368 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '1rem 2.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  Activate Affiliate Account
                </button>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.85rem' }}>
                  You'll get your unique referral link instantly
                </p>
              </div>
            )}
          </div>
        )}

        {/* Devices Section */}
        {activeSection === 'devices' && (
          <div className="dash-card devices-card" style={{ display: 'block' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Activated Devices</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              You can activate up to {license?.max_devices || 2} devices. Remove a device to activate on a new one.
            </p>
            <div className="devices-list">
              {devices.length > 0 ? devices.map(device => (
                <div key={device.id} className="device-item">
                  <div className="device-info">
                    <span className="device-icon">
                      {device.platform?.toLowerCase().includes('mac') ? '🍎' :
                       device.platform?.toLowerCase().includes('win') ? '🪟' : '💻'}
                    </span>
                    <div className="device-details">
                      <span className="device-name">{device.device_name || device.platform || 'Unknown Device'}</span>
                      <span className="device-date">Activated {formatDate(device.activated_at)}</span>
                    </div>
                  </div>
                  <button className="device-remove" onClick={() => removeDevice(device.id)}>
                    Remove
                  </button>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No devices activated yet. Download and activate the app to see your devices here.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment History Section */}
        {activeSection === 'payments' && (
          <div className="dash-card history-card" style={{ display: 'block' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Payment History</h3>
            <div className="history-list">
              {payments.length > 0 ? payments.map((payment, idx) => (
                <div key={idx} className="history-item">
                  <div>
                    <span className="history-desc">{payment.description || `${payment.tier} subscription`}</span>
                    <span className="history-date"> - {formatDate(payment.created_at)}</span>
                  </div>
                  <span className="history-amount">${(payment.amount / 100).toFixed(2)}</span>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No payment history yet.
                </p>
              )}
            </div>
          </div>
        )}

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
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="quick-link">
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
