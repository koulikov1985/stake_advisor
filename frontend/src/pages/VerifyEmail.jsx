import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
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
      // Countdown timer
      let count = 3;
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          navigate('/dashboard');
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="landing ai-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Poker Cards */}
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
      </div>
        <header className="landing-header" style={{ position: 'relative' }}>
          <Link to="/" className="landing-logo">
            <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
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
      <div className="landing ai-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Poker Cards */}
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
      </div>
        <header className="landing-header" style={{ position: 'relative' }}>
          <Link to="/" className="landing-logo">
            <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
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
      <div className="landing ai-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Poker Cards */}
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
      </div>
        <header className="landing-header" style={{ position: 'relative' }}>
          <Link to="/" className="landing-logo">
            <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
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
            border: '1px solid rgba(0, 217, 126, 0.3)',
            borderRadius: '16px',
            padding: '3rem 2.5rem',
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, rgba(0, 217, 126, 0.2) 0%, rgba(0, 217, 126, 0.05) 100%)',
              border: '2px solid rgba(0, 217, 126, 0.4)',
              color: '#00d97e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              margin: '0 auto 1.5rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}>✓</div>
            <h2 style={{ color: '#00d97e', marginBottom: '0.75rem', fontSize: '1.75rem' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              Welcome to Poker AI
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              You're all set to start crushing the tables.
            </p>

            {/* Progress bar */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              height: '4px',
              marginBottom: '1rem',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #00d97e, #00b368)',
                height: '100%',
                width: `${((3 - countdown) / 3) * 100}%`,
                transition: 'width 1s linear'
              }}></div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Redirecting in {countdown}...
            </p>

            <Link to="/dashboard" style={{
              display: 'block',
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, var(--gold) 0%, #b8960c 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(212,175,55,0.3)'
            }}>
              Go to Dashboard Now
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  return (
    <div className="landing ai-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Floating Poker Cards */}
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
      </div>
      <header className="landing-header" style={{ position: 'relative' }}>
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
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
