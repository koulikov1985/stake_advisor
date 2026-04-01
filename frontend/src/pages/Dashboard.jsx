import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const plans = [
  { plan: 'daily', name: '1-Day Pass', price: 5, duration: '24 hours' },
  { plan: 'weekly', name: 'Weekly', price: 25, duration: '7 days' },
  { plan: 'monthly', name: 'Monthly', price: 75, duration: '30 days', popular: true },
  { plan: 'yearly', name: 'Yearly', price: 699, duration: '365 days' }
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    // Set default tab based on subscription status
    if (user) {
      if (user.plan && user.licenseKey) {
        setActiveTab('license');
      } else {
        setActiveTab('plans');
      }
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/user/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePurchase = async (planId) => {
    setPurchasing(planId);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, email: user?.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setPurchasing(null);
    }
  };

  const copyLicenseKey = async () => {
    if (user?.licenseKey) {
      await navigator.clipboard.writeText(user.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dash">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* Top Bar */}
      <div className="dash-topbar">
        <span className="dash-logo">♠️ Stake Advisor</span>
        <div className="dash-user">
          <span>{user?.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dash-tabs">
        <button
          className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Plans
        </button>
        <button
          className={`tab ${activeTab === 'license' ? 'active' : ''}`}
          onClick={() => setActiveTab('license')}
        >
          License
        </button>
        <button
          className={`tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
      </div>

      {/* Tab Content */}
      <div className="dash-content">
        {error && <p className="error-message">{error}</p>}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="tab-panel">
            <h2>Choose a Plan</h2>
            <p className="tab-desc">Select a subscription to activate Stake Advisor</p>

            <div className="plans-list">
              {plans.map((p) => (
                <div key={p.plan} className={`plan-row ${p.popular ? 'popular' : ''}`}>
                  {p.popular && <span className="pop-badge">Popular</span>}
                  <div className="plan-details">
                    <strong>{p.name}</strong>
                    <span>{p.duration}</span>
                  </div>
                  <div className="plan-action">
                    <span className="plan-cost">${p.price}</span>
                    <button
                      onClick={() => handlePurchase(p.plan)}
                      disabled={purchasing === p.plan}
                    >
                      {purchasing === p.plan ? '...' : 'Buy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* License Tab */}
        {activeTab === 'license' && (
          <div className="tab-panel">
            <h2>Your License</h2>

            {user?.licenseKey ? (
              <>
                <div className={`status-bar ${user.isActive ? 'active' : 'expired'}`}>
                  <span className="dot"></span>
                  {user.isActive ? 'Active' : 'Expired'}
                  <span className="plan-type">{user.plan}</span>
                  {user.isActive && <span className="days-left">{user.daysRemaining} days left</span>}
                </div>

                <div className="license-card">
                  <label>License Key</label>
                  <div className="key-box">
                    <code>{user.licenseKey}</code>
                    <button onClick={copyLicenseKey}>
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p className="help-text">
                  Use this key to activate the Stake Advisor browser extension.
                </p>
              </>
            ) : (
              <div className="no-license">
                <p>You don't have a license yet.</p>
                <button onClick={() => setActiveTab('plans')}>
                  Get a Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="tab-panel">
            <h2>Account</h2>

            <div className="account-info">
              <div className="info-row">
                <label>Email</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-row">
                <label>Member Since</label>
                <span>{formatDate(user?.createdAt)}</span>
              </div>
              <div className="info-row">
                <label>Subscription</label>
                <span>{user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'None'}</span>
              </div>
              <div className="info-row">
                <label>Status</label>
                <span className={user?.isActive ? 'text-green' : 'text-red'}>
                  {user?.plan ? (user.isActive ? 'Active' : 'Expired') : 'No subscription'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
