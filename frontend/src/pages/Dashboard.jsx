import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const plans = [
  { plan: 'daily', name: '1 Day', price: 5, desc: 'Perfect for trying out' },
  { plan: 'weekly', name: '1 Week', price: 25, desc: 'Great for casual players' },
  { plan: 'monthly', name: '1 Month', price: 75, desc: 'Best for regular grinders', popular: true },
  { plan: 'yearly', name: '1 Year', price: 699, desc: 'Maximum savings', savings: '62%' }
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [purchasing, setPurchasing] = useState(null);
  const [copied, setCopied] = useState(false);
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
      setUser(await res.json());
    } catch {
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planId) => {
    setPurchasing(planId);
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, email: user?.email })
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
    } catch (err) {
      alert('Could not open subscription manager');
      setManagingSubscription(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  if (loading) return <div className="pro-dash"><div className="pro-loading"><div className="spinner"></div></div></div>;

  const hasSubscription = user?.plan && user?.licenseKey;

  return (
    <div className="pro-dash">
      {/* Sidebar */}
      <aside className="pro-sidebar">
        <div className="pro-brand">
          <span className="brand-icon">🦈</span>
          <span className="brand-text">SharkScope Pro</span>
        </div>

        <nav className="pro-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Overview
          </button>
          <button className={activeTab === 'subscription' ? 'active' : ''} onClick={() => setActiveTab('subscription')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><circle cx="18" cy="12" r="2"/></svg>
            Subscription
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            Settings
          </button>
        </nav>

        <div className="pro-sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="user-details">
              <span className="user-email">{user?.email}</span>
              <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Sign out</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pro-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="pro-content">
            <header className="pro-header">
              <div>
                <h1>Welcome back</h1>
                <p>Here's your account overview</p>
              </div>
            </header>

            <div className="pro-cards">
              {/* Status Card */}
              <div className="pro-card status-card">
                <div className="card-header">
                  <span className="card-label">Subscription Status</span>
                  {hasSubscription && (
                    <span className={`status-pill ${user.isActive ? 'active' : 'expired'}`}>
                      {user.isActive ? 'Active' : 'Expired'}
                    </span>
                  )}
                </div>
                {hasSubscription ? (
                  <div className="card-body">
                    <div className="big-stat">{user.daysRemaining || 0}</div>
                    <div className="stat-label">days remaining</div>
                    <div className="stat-meta">
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} plan · Expires {formatDate(user.expiresAt)}
                    </div>
                  </div>
                ) : (
                  <div className="card-body empty">
                    <p>No active subscription</p>
                    <button className="pro-btn primary" onClick={() => setActiveTab('subscription')}>
                      Get Started
                    </button>
                  </div>
                )}
              </div>

              {/* License Card */}
              <div className="pro-card license-card">
                <div className="card-header">
                  <span className="card-label">License Key</span>
                </div>
                {user?.licenseKey ? (
                  <div className="card-body">
                    <div className="license-display">
                      <code>{user.licenseKey}</code>
                      <button className="copy-btn" onClick={copyKey}>
                        {copied ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        )}
                      </button>
                    </div>
                    <p className="license-hint">Use this key to activate SharkScope Pro</p>
                  </div>
                ) : (
                  <div className="card-body empty">
                    <p>Purchase a plan to get your license key</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {hasSubscription && !user.isActive && (
              <div className="pro-alert warning">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <div>
                  <strong>Your subscription has expired</strong>
                  <p>Renew now to continue using Stake Advisor</p>
                </div>
                <button className="pro-btn primary" onClick={() => setActiveTab('subscription')}>Renew</button>
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="pro-content">
            <header className="pro-header">
              <div>
                <h1>Choose your plan</h1>
                <p>Select the perfect plan for your needs</p>
              </div>
            </header>

            <div className="pro-plans">
              {plans.map((p) => (
                <div key={p.plan} className={`pro-plan ${p.popular ? 'featured' : ''}`}>
                  {p.popular && <div className="plan-badge">Most Popular</div>}
                  {p.savings && <div className="plan-savings">Save {p.savings}</div>}
                  <div className="plan-header">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                  </div>
                  <div className="plan-price">
                    <span className="currency">$</span>
                    <span className="amount">{p.price}</span>
                  </div>
                  <ul className="plan-features">
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Real-time hand analysis</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>All stake levels</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>GTO recommendations</li>
                    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Priority support</li>
                  </ul>
                  <button
                    className={`pro-btn ${p.popular ? 'primary' : 'secondary'}`}
                    onClick={() => handlePurchase(p.plan)}
                    disabled={purchasing === p.plan}
                  >
                    {purchasing === p.plan ? 'Processing...' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pro-guarantee">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div>
                <strong>Secure Payment</strong>
                <p>All transactions are encrypted and processed securely via Stripe</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="pro-content">
            <header className="pro-header">
              <div>
                <h1>Account Settings</h1>
                <p>Manage your account preferences</p>
              </div>
            </header>

            <div className="pro-settings">
              <div className="settings-section">
                <h3>Profile</h3>
                <div className="settings-row">
                  <div>
                    <label>Email address</label>
                    <span>{user?.email}</span>
                  </div>
                </div>
                <div className="settings-row">
                  <div>
                    <label>Member since</label>
                    <span>{formatDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Subscription</h3>
                <div className="settings-row">
                  <div>
                    <label>Current plan</label>
                    <span>{user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'None'}</span>
                  </div>
                </div>
                <div className="settings-row">
                  <div>
                    <label>Status</label>
                    <span className={user?.isActive ? 'text-success' : 'text-error'}>
                      {user?.plan ? (user.isActive ? 'Active' : 'Expired') : 'No subscription'}
                    </span>
                  </div>
                </div>
                {user?.expiresAt && (
                  <div className="settings-row">
                    <div>
                      <label>Expires</label>
                      <span>{formatDate(user.expiresAt)}</span>
                    </div>
                  </div>
                )}
                {user?.plan && (
                  <div className="settings-row" style={{ marginTop: '1rem' }}>
                    <button
                      className="pro-btn secondary"
                      onClick={handleManageSubscription}
                      disabled={managingSubscription}
                    >
                      {managingSubscription ? 'Opening...' : 'Manage Subscription'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
