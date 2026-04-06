import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Success() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licenseData, setLicenseData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchLicense = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/payment/session/${sessionId}`);
        const data = await response.json();

        // Check if still processing
        if (data.processing) {
          if (retryCount < 10) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
            }, 2000);
          } else {
            setError('License processing is taking longer than expected. Please check your email or contact support.');
            setLoading(false);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch license');
        }

        // Map snake_case to camelCase for frontend
        setLicenseData({
          licenseKey: data.license_key,
          plan: data.plan,
          expiresAt: data.expires_at,
          email: data.email
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLicense();
  }, [sessionId, retryCount]);

  const copyKey = () => {
    if (licenseData?.licenseKey) {
      navigator.clipboard.writeText(licenseData.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

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
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid var(--border-subtle)',
              borderTopColor: 'var(--gold)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }}></div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Processing your payment...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please wait while we generate your license key.</p>
            {retryCount > 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
                Checking... (attempt {retryCount}/10)
              </p>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
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
            }}>⚠️</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
            <Link to="/" style={{
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
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          maxWidth: '480px'
        }}>
          {/* Success Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'rgba(212, 175, 55, 0.15)',
              color: 'var(--gold)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1.5rem'
            }}>✓</div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              Payment Successful!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your license is ready. Copy it below.
            </p>
          </div>

          {/* License Key */}
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Your License Key
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--bg-card)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <code style={{
                flex: 1,
                fontFamily: 'Monaco, Courier New, monospace',
                fontSize: '0.95rem',
                color: 'var(--gold)',
                wordBreak: 'break-all'
              }}>{licenseData?.licenseKey}</code>
              <button
                onClick={copyKey}
                style={{
                  background: 'var(--gold)',
                  color: '#000',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* License Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Plan</span>
              <span style={{ display: 'block', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {licenseData?.plan}
              </span>
            </div>
            <div style={{
              background: 'var(--bg-primary)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Expires</span>
              <span style={{ display: 'block', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {formatDate(licenseData?.expiresAt)}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Next Steps:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--gold)',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>1</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Download the app for your platform</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--gold)',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>2</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Enter your license key when prompted</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--gold)',
                  color: '#000',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  flexShrink: 0
                }}>3</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Start crushing at the tables!</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              A copy of your license has been sent to <strong style={{ color: 'var(--gold)' }}>{licenseData?.email}</strong>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/download" style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--gold)',
                color: '#000',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Download App
              </Link>
              <Link to="/" style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                textDecoration: 'none'
              }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
