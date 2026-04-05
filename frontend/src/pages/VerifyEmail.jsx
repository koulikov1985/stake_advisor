import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to verify email');
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
            <div className="loading-spinner" style={{ margin: '0 auto 1.5rem' }}></div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Verifying Email...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              This verification link is invalid or missing.
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
              background: 'rgba(0, 217, 126, 0.15)',
              color: '#00d97e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              margin: '0 auto 1.5rem'
            }}>✓</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Your email has been successfully verified. Redirecting to dashboard...
            </p>
            <Link to="/dashboard" style={{
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
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
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
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Verification Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {error || 'This verification link is invalid or has expired.'}
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
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            Go to Login
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Need a new link? Log in and request a new verification email.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
