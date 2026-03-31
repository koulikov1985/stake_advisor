import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import LicenseDisplay from '../components/LicenseDisplay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Success() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licenseData, setLicenseData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchLicense = async () => {
      try {
        const response = await fetch(`${API_URL}/api/session/${sessionId}`);
        const data = await response.json();

        if (response.status === 202) {
          // License is still being processed, retry
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
          throw new Error(data.error || 'Failed to fetch license');
        }

        setLicenseData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLicense();
  }, [sessionId, retryCount]);

  if (loading) {
    return (
      <div className="success-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Processing your payment...</h2>
          <p>Please wait while we generate your license key.</p>
          {retryCount > 0 && (
            <p className="retry-info">Checking... (attempt {retryCount}/10)</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <LicenseDisplay
          licenseKey={licenseData.licenseKey}
          plan={licenseData.plan}
          expiresAt={licenseData.expiresAt}
        />
        <div className="success-footer">
          <p>A copy of your license has been sent to <strong>{licenseData.email}</strong></p>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Success;
