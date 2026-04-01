import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Download() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Check if user has active license
    if (token) {
      fetch('/api/user/license', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.license && data.license.active) {
            setHasLicense(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleDownload = (platform) => {
    if (!isLoggedIn) {
      window.location.href = '/login?redirect=/download';
      return;
    }
    if (!hasLicense) {
      window.location.href = '/pricing';
      return;
    }

    // Trigger download
    if (platform === 'mac') {
      window.location.href = '/api/download/mac';
    } else if (platform === 'windows') {
      window.location.href = '/api/download/windows';
    }
  };

  return (
    <div className="download-page">
      <div className="download-container">
        <h1>Download SharkScope Pro</h1>
        <p className="download-subtitle">
          Get the desktop app for real-time poker analytics
        </p>

        <div className="download-cards">
          {/* macOS Card */}
          <div className="download-card">
            <div className="download-icon">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h2>macOS</h2>
            <p className="download-version">Version 1.0.0</p>
            <p className="download-requirements">Requires macOS 15.0 or later</p>
            <p className="download-size">108 MB</p>
            <button
              className="download-btn available"
              onClick={() => handleDownload('mac')}
            >
              Download for Mac
            </button>
          </div>

          {/* Windows Card */}
          <div className="download-card">
            <div className="download-icon">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z"/>
              </svg>
            </div>
            <h2>Windows</h2>
            <p className="download-version">Coming Soon</p>
            <p className="download-requirements">Will require Windows 10 or later</p>
            <p className="download-size">—</p>
            <button
              className="download-btn coming-soon"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="download-notice">
            <p>Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to download.</p>
          </div>
        )}

        {isLoggedIn && !hasLicense && (
          <div className="download-notice">
            <p>You need an active subscription to download. <Link to="/pricing">View pricing</Link></p>
          </div>
        )}

        <div className="download-instructions">
          <h3>Installation Instructions</h3>
          <div className="instructions-grid">
            <div className="instruction-block">
              <h4>macOS</h4>
              <ol>
                <li>Download the ZIP file</li>
                <li>Extract the ZIP file</li>
                <li>Drag SharkScope Pro to Applications</li>
                <li>Right-click and select "Open" the first time</li>
                <li>Enter your license key when prompted</li>
              </ol>
            </div>
            <div className="instruction-block">
              <h4>Windows</h4>
              <ol>
                <li>Download the ZIP file</li>
                <li>Extract to a folder</li>
                <li>Run SharkScope Pro.exe</li>
                <li>Allow through Windows Defender if prompted</li>
                <li>Enter your license key when prompted</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .download-page {
          min-height: 100vh;
          padding: 80px 20px 40px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .download-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .download-page h1 {
          text-align: center;
          font-size: 2.5rem;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .download-subtitle {
          text-align: center;
          color: #8892b0;
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .download-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .download-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s, border-color 0.3s;
        }

        .download-card:hover {
          transform: translateY(-5px);
          border-color: rgba(100, 255, 218, 0.3);
        }

        .download-icon {
          color: #64ffda;
          margin-bottom: 1rem;
        }

        .download-card h2 {
          color: #fff;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .download-version {
          color: #64ffda;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .download-requirements {
          color: #8892b0;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .download-size {
          color: #8892b0;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .download-btn {
          width: 100%;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .download-btn.available {
          background: linear-gradient(135deg, #64ffda 0%, #00bfa5 100%);
          color: #1a1a2e;
        }

        .download-btn.available:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(100, 255, 218, 0.3);
        }

        .download-btn.coming-soon {
          background: rgba(255, 255, 255, 0.1);
          color: #8892b0;
          cursor: not-allowed;
        }

        .download-notice {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .download-notice p {
          color: #ffc107;
          margin: 0;
        }

        .download-notice a {
          color: #64ffda;
          text-decoration: underline;
        }

        .download-instructions {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .download-instructions h3 {
          color: #fff;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .instructions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .instruction-block h4 {
          color: #64ffda;
          margin-bottom: 1rem;
        }

        .instruction-block ol {
          color: #ccd6f6;
          padding-left: 1.5rem;
        }

        .instruction-block li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .download-page h1 {
            font-size: 1.8rem;
          }

          .download-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Download;
