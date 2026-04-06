import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function Privacy() {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="landing ai-theme">
      {/* Floating Poker Cards - Page Wide */}
      <div className="floating-cards-global">
        <div className="floating-card card-1">A</div>
        <div className="floating-card card-2">K</div>
        <div className="floating-card card-3">Q</div>
        <div className="floating-card card-4">J</div>
        <div className="floating-card card-5">10</div>
        <div className="floating-card card-6">9</div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <Link to="/pricing">Pricing</Link>
          <Link to="/affiliate" className="nav-affiliate-glow">Affiliate</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Content */}
      <main className="legal-content">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last Updated: {lastUpdated}</p>

          <div className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Poker AI ("Company," "we," "us," or "our") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our software, website, and services (collectively, the "Service").
            </p>
            <p>
              By using the Service, you agree to the collection and use of information in accordance with
              this Privacy Policy. If you do not agree with our policies and practices, do not use the Service.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <p>We collect information that you voluntarily provide to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Email address, name (optional), and password when you create an account</li>
              <li><strong>Payment Information:</strong> Payment card details processed securely through our payment processor (Stripe)</li>
              <li><strong>Communications:</strong> Information you provide when contacting support or participating in surveys</li>
              <li><strong>Poker Username:</strong> Your username on supported poker platforms for identification purposes</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>When you use our Service, we may automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
              <li><strong>Usage Data:</strong> Features used, session duration, license activations</li>
              <li><strong>Log Data:</strong> IP address, browser type, access times, error logs</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and referral tracking</li>
            </ul>

            <h3>2.3 Information Stored Locally</h3>
            <p>
              <strong>Important:</strong> The following information is stored locally on your device and is
              NOT transmitted to our servers:
            </p>
            <ul>
              <li>Hand histories and game data</li>
              <li>Opponent statistics and tracking data</li>
              <li>Session results and performance metrics</li>
              <li>Screenshots or screen capture data</li>
            </ul>
            <p>
              This local-first approach ensures your gaming data remains private and under your control.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service</li>
              <li>Process transactions and manage your subscription</li>
              <li>Validate and manage software licenses</li>
              <li>Send administrative communications (account updates, security alerts)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Track affiliate referrals and commission calculations</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations</li>
              <li>Analyze usage patterns to improve our Service</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>
              <strong>We do not sell your personal information.</strong> We may share your information only
              in the following circumstances:
            </p>

            <h3>4.1 Service Providers</h3>
            <p>
              We share information with third-party service providers who perform services on our behalf:
            </p>
            <ul>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Email Services:</strong> Transactional email delivery</li>
              <li><strong>Cloud Hosting:</strong> Server infrastructure</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to:</p>
            <ul>
              <li>Court orders or legal process</li>
              <li>Government requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>To enforce our Terms and Conditions</li>
            </ul>

            <h3>4.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred
              as part of the transaction. We will notify you of any such change.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information, including:
            </p>
            <ul>
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Secure password hashing</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure cloud infrastructure</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure.
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Data Retention</h2>
            <p>We retain your personal information for as long as:</p>
            <ul>
              <li>Your account remains active</li>
              <li>Necessary to provide the Service</li>
              <li>Required by law or for legitimate business purposes</li>
            </ul>
            <p>
              Upon account deletion, we will delete or anonymize your personal information within 30 days,
              except where retention is required by law.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>

            <h3>7.1 Access and Portability</h3>
            <p>You can request a copy of your personal information that we hold.</p>

            <h3>7.2 Correction</h3>
            <p>You can request correction of inaccurate personal information.</p>

            <h3>7.3 Deletion</h3>
            <p>You can request deletion of your personal information, subject to legal retention requirements.</p>

            <h3>7.4 Opt-Out</h3>
            <p>You can opt out of promotional communications by following the unsubscribe instructions in emails.</p>

            <h3>7.5 Cookie Preferences</h3>
            <p>You can control cookies through your browser settings.</p>

            <p>To exercise any of these rights, please contact us through Discord or email.</p>
          </div>

          <div className="legal-section">
            <h2>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies for:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for authentication and security</li>
              <li><strong>Referral Cookies:</strong> 30-day cookies to track affiliate referrals</li>
              <li><strong>Analytics:</strong> To understand how users interact with our website</li>
            </ul>
            <p>
              You can disable cookies in your browser settings, but this may affect the functionality of
              the Service.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites or services. We are not responsible for
              the privacy practices of these third parties. We encourage you to review their privacy policies
              before providing any personal information.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Children's Privacy</h2>
            <p>
              The Service is not intended for individuals under 18 years of age. We do not knowingly collect
              personal information from children. If we become aware that we have collected information from
              a child, we will delete it immediately.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. These
              countries may have different data protection laws. By using the Service, you consent to such
              transfers.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. California Privacy Rights</h2>
            <p>
              If you are a California resident, you have specific rights under the California Consumer
              Privacy Act (CCPA):
            </p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to request deletion of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>13. European Privacy Rights (GDPR)</h2>
            <p>
              If you are in the European Economic Area (EEA), you have additional rights under the General
              Data Protection Regulation (GDPR):
            </p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p>
              Our legal basis for processing includes: contract performance, legitimate interests, and consent.
            </p>
          </div>

          <div className="legal-section">
            <h2>14. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your
              continued use of the Service after any changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="legal-section">
            <h2>15. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul>
              <li><strong>Discord:</strong> <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer">https://discord.gg/NHUjvZXzrR</a></li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer-ai">
        <div className="footer-brand-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="footer-logo" />
        </div>
        <div className="footer-links-ai">
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/affiliate">Affiliate</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
        <p className="footer-copy-ai">&copy; 2025 Poker AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Privacy;
