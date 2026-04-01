import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-grid">
        {/* Subscription Card */}
        <div className="dashboard-card">
          <h3>Subscription Status</h3>
          {user?.plan ? (
            <>
              <div className={`status-badge ${user.isActive ? 'active' : 'expired'}`}>
                {user.isActive ? 'Active' : 'Expired'}
              </div>
              <div className="subscription-details">
                <div className="detail-row">
                  <span>Plan:</span>
                  <span>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
                </div>
                <div className="detail-row">
                  <span>Expires:</span>
                  <span>{formatDate(user.expiresAt)}</span>
                </div>
                {user.daysRemaining && (
                  <div className="detail-row">
                    <span>Days Remaining:</span>
                    <span className={user.daysRemaining <= 3 ? 'warning' : ''}>
                      {user.daysRemaining} days
                    </span>
                  </div>
                )}
              </div>
              {!user.isActive && (
                <Link to="/#pricing" className="btn btn-primary btn-full">
                  Renew Subscription
                </Link>
              )}
              {user.isActive && user.daysRemaining <= 7 && (
                <Link to="/#pricing" className="btn btn-primary btn-full">
                  Extend Subscription
                </Link>
              )}
            </>
          ) : (
            <div className="no-subscription">
              <p>You don't have an active subscription yet.</p>
              <Link to="/#pricing" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* License Key Card */}
        <div className="dashboard-card">
          <h3>License Key</h3>
          {user?.licenseKey ? (
            <>
              <div className="license-key-box">
                <code>{user.licenseKey}</code>
                <button onClick={copyLicenseKey} className="copy-btn">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="license-note">
                Use this key to activate Stake Advisor in your browser.
              </p>
            </>
          ) : (
            <p className="no-license">
              Your license key will appear here after you purchase a subscription.
            </p>
          )}
        </div>

        {/* Account Card */}
        <div className="dashboard-card">
          <h3>Account</h3>
          <div className="account-details">
            <div className="detail-row">
              <span>Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="detail-row">
              <span>Member Since:</span>
              <span>{formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
