import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="landing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="landing-header" style={{ position: 'relative' }}>
          <Link to="/" className="landing-logo">
            <span className="logo-icon">♠</span>
            <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
          </Link>
        </header>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--error)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              margin: '0 auto 1.5rem'
            }}>!</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Invalid Link</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" style={{
              display: 'block',
              width: '100%',
              padding: '1rem',
              background: 'var(--gold)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="landing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="landing-header" style={{ position: 'relative' }}>
          <Link to="/" className="landing-logo">
            <span className="logo-icon">♠</span>
            <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
          </Link>
        </header>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(212, 175, 55, 0.15)',
              color: 'var(--gold)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              margin: '0 auto 1.5rem'
            }}>✓</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Password Reset!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link to="/login" style={{
              display: 'block',
              width: '100%',
              padding: '1rem',
              background: 'var(--gold)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="landing-header" style={{ position: 'relative' }}>
        <Link to="/" className="landing-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <nav className="landing-nav">
          <Link to="/login" className="nav-btn-ghost">Login</Link>
        </nav>
      </header>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>Reset Password</h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}>Enter your new password</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <p style={{
                color: 'var(--error)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--gold)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
