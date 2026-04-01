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
    <div className="license-display">
      <div className="license-header">
        <span className="success-icon">✓</span>
        <h2>Your License Key</h2>
      </div>

      <div className="license-key-box">
        <code className="license-key">{licenseKey}</code>
        <button
          className="copy-btn"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      <div className="license-details">
        <div className="detail-row">
          <span className="detail-label">Plan:</span>
          <span className="detail-value">{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Expires:</span>
          <span className="detail-value">{formatDate(expiresAt)}</span>
        </div>
      </div>

      <div className="license-instructions">
        <h4>How to use your license:</h4>
        <ol>
          <li>Copy the license key above</li>
          <li>Open the SharkScope Pro extension</li>
          <li>Paste your license key in the activation field</li>
          <li>Click Activate and start playing</li>
        </ol>
      </div>
    </div>
  );
}

export default LicenseDisplay;
