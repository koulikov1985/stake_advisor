import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PricingCard from '../components/PricingCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const plans = [
  {
    plan: 'daily',
    name: '1-Day Pass',
    price: '5',
    duration: 'day',
    features: ['Full real-time advisor', 'All stakes supported', 'Unlimited sessions'],
    popular: false
  },
  {
    plan: 'weekly',
    name: 'Weekly',
    price: '25',
    duration: 'week',
    features: ['Full real-time advisor', 'All stakes supported', 'Priority support', 'Save 29%'],
    popular: false
  },
  {
    plan: 'monthly',
    name: 'Monthly',
    price: '75',
    duration: 'month',
    features: ['Full real-time advisor', 'All stakes supported', 'Priority support', 'Save 50%'],
    popular: true
  },
  {
    plan: 'yearly',
    name: 'Yearly',
    price: '699',
    duration: 'year',
    features: ['Full real-time advisor', 'All stakes supported', 'Priority support', 'Best value - Save 62%'],
    popular: false
  }
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

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
      <div className="dashboard-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // User has no subscription - show purchase options
  if (!user?.plan) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.email?.split('@')[0]}</h1>
            <p className="welcome-subtitle">Choose a plan to get started</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        <div className="purchase-section">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <PricingCard key={plan.plan} {...plan} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // User has subscription - show dashboard
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.email?.split('@')[0]}</h1>
          <p className="welcome-subtitle">Manage your subscription and license</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-content">
        {/* Status Banner */}
        <div className={`status-banner ${user.isActive ? 'active' : 'expired'}`}>
          <div className="status-info">
            <span className="status-icon">{user.isActive ? '✓' : '!'}</span>
            <div>
              <strong>{user.isActive ? 'Subscription Active' : 'Subscription Expired'}</strong>
              <p>
                {user.isActive
                  ? `${user.daysRemaining} days remaining (expires ${formatDate(user.expiresAt)})`
                  : `Expired on ${formatDate(user.expiresAt)}`
                }
              </p>
            </div>
          </div>
          <div className="status-plan">
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
          </div>
        </div>

        {/* License Key Section */}
        {user?.licenseKey && (
          <div className="license-section">
            <h3>Your License Key</h3>
            <div className="license-key-display">
              <code>{user.licenseKey}</code>
              <button onClick={copyLicenseKey} className="copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="license-instructions">
              Use this key to activate Stake Advisor in your browser extension.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          {!user.isActive && (
            <div className="action-card renew">
              <h4>Renew Your Subscription</h4>
              <p>Your access has expired. Renew now to continue using Stake Advisor.</p>
              <div className="action-buttons">
                {plans.slice(0, 3).map((plan) => (
                  <PricingCard key={plan.plan} {...plan} compact />
                ))}
              </div>
            </div>
          )}

          {user.isActive && user.daysRemaining <= 7 && (
            <div className="action-card extend">
              <h4>Extend Your Subscription</h4>
              <p>Your subscription expires soon. Extend now to avoid interruption.</p>
              <div className="mini-pricing">
                {plans.map((plan) => (
                  <PricingCard key={plan.plan} {...plan} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="account-section">
          <h3>Account Information</h3>
          <div className="account-grid">
            <div className="account-item">
              <span className="label">Email</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="account-item">
              <span className="label">Member Since</span>
              <span className="value">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="account-item">
              <span className="label">Current Plan</span>
              <span className="value">{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
            </div>
            <div className="account-item">
              <span className="label">Status</span>
              <span className={`value status-text ${user.isActive ? 'active' : 'expired'}`}>
                {user.isActive ? 'Active' : 'Expired'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
