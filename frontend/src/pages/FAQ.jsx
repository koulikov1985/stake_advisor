import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I install PokerSharkScope?',
        answer: 'Download the app for your platform (Mac or Windows), extract the ZIP file, and follow the setup wizard. Make sure to use the included "Launch Chrome" script before starting the app.'
      },
      {
        question: 'How do I get my license key?',
        answer: 'After purchasing a subscription, your license key is displayed immediately and sent to your email. You can also find it in your dashboard under the License tab.'
      },
      {
        question: 'Why do I need to launch Chrome separately?',
        answer: 'PokerSharkScope connects to Chrome via a debug port to read poker table data. The "Launch Chrome" script starts Chrome with the correct settings enabled.'
      }
    ]
  },
  {
    category: 'Features & Usage',
    questions: [
      {
        question: 'How many tables can I play at once?',
        answer: 'PokerSharkScope supports up to 6 tables simultaneously. The app will track all active tables and provide advice on the one you\'re currently viewing.'
      },
      {
        question: 'Which poker sites are supported?',
        answer: 'Currently, PokerSharkScope works with Stake.us poker. Support for additional sites may be added in future updates.'
      },
      {
        question: 'Is my data private?',
        answer: 'Yes, 100%. All your hand history, stats, and personal data are stored locally on your computer. Nothing is sent to our servers except license validation requests.'
      },
      {
        question: 'Will using this get me banned?',
        answer: 'PokerSharkScope runs as a separate application and does not inject code into the poker site. However, always review the terms of service of your poker room.'
      }
    ]
  },
  {
    category: 'Subscription & Billing',
    questions: [
      {
        question: 'Can I use my license on multiple devices?',
        answer: 'Your license key works on any device, but only one active session at a time. You can easily switch devices by logging out on one and activating on another.'
      },
      {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan at any time from your dashboard. Your remaining time will be applied to the new plan.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and popular payment methods through our secure Stripe payment processor.'
      },
      {
        question: 'Can I try it before buying?',
        answer: 'Yes! Sign up and get 200 hands free to try out the software. You can also get the 1-Day Pass for just $5 to test all features.'
      }
    ]
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        question: 'App says "Chrome Not Detected"?',
        answer: 'Make sure you started Chrome using the included "Launch Chrome" script, not from your regular Chrome shortcut. Close all Chrome windows first, then run the script.'
      },
      {
        question: 'Tables not being detected?',
        answer: 'Ensure Chrome was launched with the script, you\'re on a Stake.us poker table, and you\'ve entered your poker username correctly in Settings.'
      },
      {
        question: 'License activation failed?',
        answer: 'Check your internet connection and try again. If the problem persists, make sure you\'re using the correct license key from your dashboard.'
      },
      {
        question: 'Windows blocks the app?',
        answer: 'Windows SmartScreen may block unsigned apps. Click "More info" then "Run anyway" - the app is safe to use.'
      }
    ]
  }
];

function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenFaq(openFaq === key ? null : key);
  };

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </Link>
        <nav className="landing-nav">
          <a href="https://discord.gg/pokersharkscope" target="_blank" rel="noopener noreferrer" className="nav-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>
                    <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/affiliate">Affiliate</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">❓</span>
            <span>Frequently Asked Questions</span>
          </div>
          <h1>
            Got Questions?<br />
            <span className="gradient-text">We've Got Answers</span>
          </h1>
          <p className="hero-desc">
            Everything you need to know about PokerSharkScope.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="landing-features" style={{ paddingTop: '1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: '3rem' }}>
              <h2 style={{
                color: '#d4af37',
                fontSize: '1.25rem',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                {category.category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openFaq === key;
                  return (
                    <div
                      key={questionIndex}
                      style={{
                        background: 'var(--bg-card)',
                        border: isOpen ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                      }}
                      onClick={() => toggleFaq(categoryIndex, questionIndex)}
                    >
                      <div style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                          {faq.question}
                        </span>
                        <span style={{
                          color: '#d4af37',
                          fontSize: '1.5rem',
                          fontWeight: '300',
                          transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(45deg)' : 'none'
                        }}>
                          +
                        </span>
                      </div>
                      {isOpen && (
                        <div style={{
                          padding: '0 1.5rem 1.25rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.7'
                        }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card">
          <h2>Still Have Questions?</h2>
          <p>Our support team is here to help you get started.</p>
          <div className="cta-buttons">
            <Link to="/pricing" className="btn-hero-primary">
              View Pricing
            </Link>
            <Link to="/download" className="btn-hero-secondary">
              Download App
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-brand">
          <span className="logo-icon">♠</span>
          <span className="logo-text">Poker<span className="gold">SharkScope</span></span>
        </div>
        <div className="footer-links">
                    <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <a href="https://discord.gg/pokersharkscope" target="_blank" rel="noopener noreferrer" className="footer-discord">Discord</a>
        </div>
        <p className="footer-copy">© 2024 PokerSharkScope. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FAQ;
