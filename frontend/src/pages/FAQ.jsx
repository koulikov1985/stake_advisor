import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I install Poker AI?',
        answer: 'Download the app for your platform (Mac or Windows), extract the ZIP file, and follow the setup wizard. Make sure to use the included "Launch Chrome" script before starting the app.'
      },
      {
        question: 'How do I get my license key?',
        answer: 'After purchasing a subscription, your license key is displayed immediately and sent to your email. You can also find it in your dashboard under the License tab.'
      },
      {
        question: 'Why do I need to launch Chrome separately?',
        answer: 'Poker AI connects to Chrome via a debug port to read poker table data. The "Launch Chrome" script starts Chrome with the correct settings enabled.'
      }
    ]
  },
  {
    category: 'Features & Usage',
    questions: [
      {
        question: 'How many tables can I play at once?',
        answer: 'Poker AI supports up to 6 tables simultaneously. The app will track all active tables and provide advice on the one you\'re currently viewing.'
      },
      {
        question: 'Which poker sites are supported?',
        answer: 'Currently, Poker AI works with Stake.us poker. Support for additional sites may be added in future updates.'
      },
      {
        question: 'Is my data private?',
        answer: 'Yes, 100%. All your hand history, stats, and personal data are stored locally on your computer. Nothing is sent to our servers except license validation requests.'
      },
      {
        question: 'Will using this get me banned?',
        answer: 'Poker AI runs as a separate application and does not inject code into the poker site. However, always review the terms of service of your poker room.'
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
    <div className="landing ai-theme">
      {/* Floating Poker Cards - Page Wide */}
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
        <div className="floating-card card-13">8♠</div>
        <div className="floating-card card-14">7♥</div>
        <div className="floating-card card-15">6♦</div>
        <div className="floating-card card-16">5♣</div>
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
            Everything you need to know about Poker AI.
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

export default FAQ;
