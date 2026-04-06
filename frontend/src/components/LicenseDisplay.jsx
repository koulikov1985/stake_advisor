import React, { useState } from 'react';

function LicenseDisplay({ licenseKey, plan, expiresAt }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="license-display-clean">
      <div className="success-header">
        <div className="success-icon-large">✓</div>
        <h1>Payment Successful!</h1>
        <p className="success-subtitle">Your license is ready to use</p>
      </div>

      <div className="license-card-clean">
        <label>License Key</label>
        <div className="license-key-row">
          <code>{licenseKey}</code>
          <button onClick={copyToClipboard}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="license-info-grid">
        <div className="info-item">
          <span className="info-label">Plan</span>
          <span className="info-value">{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Expires</span>
          <span className="info-value">{formatDate(expiresAt)}</span>
        </div>
      </div>

      <div className="instructions-clean">
        <h3>Getting Started</h3>
        <div className="steps">
          <div className="step">
            <span className="step-num">1</span>
            <span>Copy your license key</span>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <span>Open Poker AI app</span>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <span>Paste key and activate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LicenseDisplay;
