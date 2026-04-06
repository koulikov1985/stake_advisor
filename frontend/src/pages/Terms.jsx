import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

function Terms() {
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
          <h1>Terms and Conditions</h1>
          <p className="legal-updated">Last Updated: {lastUpdated}</p>

          <div className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using Poker AI software, website, and services (collectively, the "Service"),
              you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these
              Terms, you must not access or use the Service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you ("User," "you," or "your") and
              Poker AI ("Company," "we," "us," or "our"). By using our Service, you represent that you are
              at least 18 years old and have the legal capacity to enter into this agreement.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Description of Service</h2>
            <p>
              Poker AI provides automated poker assistance software that uses artificial intelligence and
              computer vision technology to analyze poker game situations and execute actions on behalf of
              the user. The Service includes:
            </p>
            <ul>
              <li>Desktop application software for macOS and Windows</li>
              <li>Real-time game analysis and decision-making algorithms</li>
              <li>Automated action execution capabilities</li>
              <li>Opponent tracking and statistical analysis</li>
              <li>Performance analytics and reporting</li>
              <li>Account management and subscription services</li>
            </ul>
            <p>
              <strong>IMPORTANT:</strong> The Service is designed for use with sweepstakes, social, and
              free-to-play poker platforms only. The Service is NOT intended for use with real-money
              gambling platforms where automated assistance may be prohibited.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. User Responsibilities and Acceptable Use</h2>
            <h3>3.1 Compliance with Third-Party Terms</h3>
            <p>
              You are solely responsible for ensuring that your use of our Service complies with the terms
              of service, rules, and policies of any third-party poker platform you use. We do not guarantee
              that our Service is permitted on any particular platform. Before using our Service, you must:
            </p>
            <ul>
              <li>Review and understand the terms of service of your poker platform</li>
              <li>Determine whether automated assistance tools are permitted</li>
              <li>Accept full responsibility for any consequences of using our Service</li>
            </ul>

            <h3>3.2 Prohibited Uses</h3>
            <p>You agree NOT to use the Service to:</p>
            <ul>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Engage in real-money gambling where such activity is illegal in your jurisdiction</li>
              <li>Use on platforms that explicitly prohibit automated assistance software</li>
              <li>Circumvent any security measures or access controls</li>
              <li>Reverse engineer, decompile, or disassemble the software</li>
              <li>Share, distribute, or resell your license to third parties</li>
              <li>Use the Service for any fraudulent or deceptive purposes</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>

            <h3>3.3 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              license key. You agree to notify us immediately of any unauthorized access or use of your
              account. We are not liable for any loss or damage arising from your failure to protect
              your account information.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Disclaimer of Warranties</h2>
            <p>
              <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED.</strong>
            </p>
            <p>To the fullest extent permitted by law, we disclaim all warranties, including but not limited to:</p>
            <ul>
              <li>Implied warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties of non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of the Service</li>
              <li>Warranties that the Service will meet your requirements or expectations</li>
            </ul>

            <h3>4.1 No Guarantee of Results</h3>
            <p>
              <strong>WE DO NOT GUARANTEE ANY SPECIFIC RESULTS, WINNINGS, OR OUTCOMES FROM USING OUR SERVICE.</strong>
              Poker involves elements of chance and skill, and past performance does not guarantee future results.
              Any statistics, win rates, or performance metrics displayed are for informational purposes only and
              should not be construed as guarantees.
            </p>

            <h3>4.2 No Financial Advice</h3>
            <p>
              The Service does not constitute financial, investment, or gambling advice. You should not rely
              solely on our Service for making financial decisions. We are not responsible for any financial
              losses you may incur while using the Service.
            </p>

            <h3>4.3 Third-Party Platform Risks</h3>
            <p>
              We are not affiliated with any poker platform and have no control over their operations, terms,
              or enforcement actions. We do not guarantee that our Service will function correctly with any
              specific platform, and we are not responsible for any actions taken by third-party platforms
              against your account, including but not limited to account suspension, termination, or
              confiscation of funds.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Limitation of Liability</h2>
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL POKER AI, ITS
              DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:</strong>
            </p>
            <ul>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or goodwill</li>
              <li>Financial losses from poker play or gambling activities</li>
              <li>Account suspension or termination by third-party platforms</li>
              <li>Confiscation of funds by poker platforms</li>
              <li>Any damages arising from your use or inability to use the Service</li>
              <li>Any damages arising from unauthorized access to your account</li>
              <li>Any damages arising from errors, bugs, or inaccuracies in the Service</li>
            </ul>
            <p>
              <strong>OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE
              SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</strong>
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of
              the above limitations may not apply to you. In such cases, our liability will be limited to
              the fullest extent permitted by applicable law.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Poker AI and its officers, directors,
              employees, agents, licensors, and suppliers from and against any and all claims, liabilities,
              damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from or
              related to:
            </p>
            <ul>
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights, including poker platform terms of service</li>
              <li>Your violation of any applicable laws or regulations</li>
              <li>Any content you submit, post, or transmit through the Service</li>
              <li>Any activity conducted through your account</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Intellectual Property Rights</h2>
            <h3>7.1 Our Intellectual Property</h3>
            <p>
              The Service, including all software, algorithms, designs, graphics, text, and other content,
              is owned by Poker AI and is protected by copyright, trademark, patent, and other intellectual
              property laws. You may not copy, modify, distribute, sell, or lease any part of the Service
              without our prior written consent.
            </p>

            <h3>7.2 License Grant</h3>
            <p>
              Subject to your compliance with these Terms and payment of applicable fees, we grant you a
              limited, non-exclusive, non-transferable, revocable license to use the Service for your
              personal, non-commercial purposes during your subscription period.
            </p>

            <h3>7.3 Restrictions</h3>
            <p>You may not:</p>
            <ul>
              <li>Copy, modify, or create derivative works of the Service</li>
              <li>Reverse engineer, decompile, or disassemble the software</li>
              <li>Remove any proprietary notices or labels</li>
              <li>Use the Service to develop competing products</li>
              <li>Share or transfer your license to any third party</li>
              <li>Use automated means to access or interact with our systems (except as provided by the Service)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Subscription and Payment Terms</h2>
            <h3>8.1 Subscription Plans</h3>
            <p>
              We offer various subscription plans with different durations and pricing. By subscribing,
              you agree to pay the applicable fees for your chosen plan. All fees are quoted in US dollars
              unless otherwise specified.
            </p>

            <h3>8.2 Billing</h3>
            <p>
              Payment is due at the time of subscription. For recurring subscriptions, you authorize us to
              charge your payment method automatically at the beginning of each billing cycle. You are
              responsible for keeping your payment information up to date.
            </p>

            <h3>8.3 Refund Policy</h3>
            <p>
              <strong>All sales are final.</strong> Due to the nature of digital software products and the
              immediate access provided upon purchase, we generally do not offer refunds. However, we may
              consider refund requests on a case-by-case basis at our sole discretion. To request a refund,
              contact our support team within 24 hours of purchase.
            </p>

            <h3>8.4 Price Changes</h3>
            <p>
              We reserve the right to modify our pricing at any time. Price changes will not affect
              existing subscriptions but will apply to renewals and new subscriptions. We will provide
              reasonable notice of any price increases.
            </p>

            <h3>8.5 Free Trial</h3>
            <p>
              We may offer a free trial period. At the end of the trial, you must purchase a subscription
              to continue using the Service. We reserve the right to modify or discontinue free trials at
              any time.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Termination</h2>
            <h3>9.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by discontinuing use of the Service and contacting
              us to request account deletion. Termination does not entitle you to a refund of any fees paid.
            </p>

            <h3>9.2 Termination by Us</h3>
            <p>
              We may suspend or terminate your access to the Service immediately, without prior notice or
              liability, for any reason, including but not limited to:
            </p>
            <ul>
              <li>Breach of these Terms</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Upon request by law enforcement or government agencies</li>
              <li>Unexpected technical or security issues</li>
              <li>Discontinuation of the Service</li>
            </ul>

            <h3>9.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to use the Service will immediately cease. All provisions of
              these Terms that by their nature should survive termination shall survive, including
              intellectual property provisions, warranty disclaimers, limitation of liability, and
              indemnification.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Privacy and Data Protection</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy, which is incorporated into
              these Terms by reference. By using the Service, you consent to the collection, use, and
              sharing of your information as described in the Privacy Policy.
            </p>
            <p>Key points regarding your data:</p>
            <ul>
              <li>Game data and statistics are primarily stored locally on your device</li>
              <li>We collect minimal data necessary for license validation and account management</li>
              <li>We do not sell your personal information to third parties</li>
              <li>We implement reasonable security measures to protect your data</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>11. Modifications to Service and Terms</h2>
            <h3>11.1 Service Modifications</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time
              without prior notice. We will not be liable to you or any third party for any modification,
              suspension, or discontinuation of the Service.
            </p>

            <h3>11.2 Terms Modifications</h3>
            <p>
              We may revise these Terms at any time by posting the updated version on our website. The
              "Last Updated" date at the top indicates when the Terms were last revised. Your continued
              use of the Service after any changes constitutes acceptance of the new Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Dispute Resolution</h2>
            <h3>12.1 Informal Resolution</h3>
            <p>
              Before initiating any formal dispute resolution proceeding, you agree to first contact us
              and attempt to resolve the dispute informally. Most disputes can be resolved quickly and
              amicably through direct communication.
            </p>

            <h3>12.2 Arbitration Agreement</h3>
            <p>
              <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</strong>
            </p>
            <p>
              Any dispute, claim, or controversy arising from or relating to these Terms or the Service
              shall be resolved by binding arbitration, rather than in court, except that you may assert
              claims in small claims court if your claims qualify.
            </p>

            <h3>12.3 Class Action Waiver</h3>
            <p>
              <strong>YOU AND POKER AI AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR
              OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS
              OR REPRESENTATIVE ACTION.</strong>
            </p>
          </div>

          <div className="legal-section">
            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of
              Delaware, United States, without regard to its conflict of law principles. Any legal action
              or proceeding arising from these Terms shall be brought exclusively in the state or federal
              courts located in Delaware.
            </p>
          </div>

          <div className="legal-section">
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid by a court of
              competent jurisdiction, that provision shall be limited or eliminated to the minimum extent
              necessary so that these Terms shall otherwise remain in full force and effect.
            </p>
          </div>

          <div className="legal-section">
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with the Privacy Policy and any other legal notices published by us,
              constitute the entire agreement between you and Poker AI concerning the Service and supersede
              all prior agreements, understandings, and representations.
            </p>
          </div>

          <div className="legal-section">
            <h2>16. Waiver</h2>
            <p>
              Our failure to enforce any right or provision of these Terms shall not be deemed a waiver
              of such right or provision. Any waiver of any provision of these Terms will be effective
              only if in writing and signed by us.
            </p>
          </div>

          <div className="legal-section">
            <h2>17. Assignment</h2>
            <p>
              You may not assign or transfer these Terms or your rights under them without our prior
              written consent. We may assign our rights and obligations under these Terms without
              restriction.
            </p>
          </div>

          <div className="legal-section">
            <h2>18. Force Majeure</h2>
            <p>
              We shall not be liable for any failure or delay in performing our obligations under these
              Terms due to circumstances beyond our reasonable control, including but not limited to
              natural disasters, war, terrorism, riots, government actions, or internet service failures.
            </p>
          </div>

          <div className="legal-section">
            <h2>19. Contact Information</h2>
            <p>
              If you have any questions about these Terms or the Service, please contact us:
            </p>
            <ul>
              <li><strong>Discord:</strong> <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer">https://discord.gg/NHUjvZXzrR</a></li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>20. Acknowledgment</h2>
            <p>
              BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS,
              UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS,
              YOU ARE NOT AUTHORIZED TO USE THE SERVICE.
            </p>
            <p>
              You further acknowledge that:
            </p>
            <ul>
              <li>You are solely responsible for compliance with third-party platform terms</li>
              <li>We make no guarantees about winnings or results</li>
              <li>You accept all risks associated with using automated poker software</li>
              <li>You will not hold us liable for any account actions taken by poker platforms</li>
              <li>You are of legal age to enter into this agreement in your jurisdiction</li>
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

export default Terms;
