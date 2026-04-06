import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/landing.css';

// FAQ Data
const faqData = [
  {
    q: "Is this legal to use?",
    a: "Poker AI is designed for sweepstakes and social poker sites where real-time assistance tools are permitted. Always check the terms of service of your specific poker site."
  },
  {
    q: "How does the AI read my poker table?",
    a: "Our AI uses advanced computer vision to capture and analyze your screen in real-time. It detects cards, chips, pot sizes, and player actions with 99.9% accuracy in under 50 milliseconds."
  },
  {
    q: "Will I get detected or banned?",
    a: "Poker AI operates externally and doesn't modify any game files or inject code. It simply reads your screen like a human would. We've had zero reported bans from our users."
  },
  {
    q: "Can I run multiple tables?",
    a: "Yes! Poker AI can manage up to 6 tables simultaneously, each running independently with its own AI decision engine. Perfect for maximizing volume and profits."
  },
  {
    q: "What's the difference between this and other poker tools?",
    a: "Traditional tools give you advice - you still have to make decisions and click buttons. Poker AI is fully autonomous. It reads, decides, and executes automatically. You just watch it win."
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Every new account gets 200 free hands to test the AI. No credit card required to start."
  }
];

function Home() {
  const [searchParams] = useSearchParams();
  const [showCanceled, setShowCanceled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animated stats

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);

    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true);
      window.history.replaceState({}, '', '/');
    }

    // Capture referral code from URL
    const refCode = searchParams.get('ref');
    if (refCode) {
      const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
      localStorage.setItem('referralCode', refCode.toUpperCase());
      localStorage.setItem('referralCodeExpires', expiresAt.toString());
      window.history.replaceState({}, '', '/');
    }

  }, [searchParams]);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" />
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`landing ai-theme ${darkMode ? 'dark' : 'light'}`}>
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

      {/* Dark/Light Mode Toggle */}
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="nav-discord">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/affiliate" className="nav-affiliate-glow">Affiliate</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          {isLoggedIn ? (
            <Link to="/dashboard" className="nav-btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="nav-btn-ghost">Login</Link>
              <Link to="/signup" className="nav-btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </header>

      {showCanceled && (
        <div className="canceled-banner">
          <p>Payment was canceled. Feel free to try again when you're ready.</p>
          <button onClick={() => setShowCanceled(false)}>×</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-ai">
        <div className="hero-bg-effects">
          <div className="ai-grid-bg"></div>
          <div className="ai-glow-orb orb-1"></div>
          <div className="ai-glow-orb orb-2"></div>
        </div>

        <div className="hero-content-ai">
          <div className="hero-logo-large">
            <img src="/images/poker-ai-logo.png" alt="Poker AI" />
          </div>

          <div className="ai-badge">
            <span className="ai-pulse"></span>
            <span className="ai-text">Powered by Advanced AI</span>
          </div>

          <h1 className="hero-title-ai">
            The Future of Poker<br/>
            <span className="gradient-text-ai">Is Here.</span>
          </h1>

          <p className="hero-subtitle-ai">
            Not just another poker tool. <strong>Poker AI</strong> is a fully autonomous artificial intelligence
            that reads your tables, analyzes every situation in real-time, and executes
            mathematically perfect GTO decisions — automatically.
          </p>

          <div className="hero-cta-group">
            <Link to="/signup" className="btn-cta-ai">
              <span>Start Playing with AI</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/faq" className="btn-cta-secondary-ai">
              <span>How It Works</span>
            </Link>
          </div>

          <div className="hero-trust-ai">
            <div className="trust-item-ai">
              <span className="trust-icon-ai">🤖</span>
              <span>Fully Automated</span>
            </div>
            <div className="trust-item-ai">
              <span className="trust-icon-ai">🧠</span>
              <span>AI Decision Engine</span>
            </div>
            <div className="trust-item-ai">
              <span className="trust-icon-ai">⚡</span>
              <span>Real-Time Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="ai-difference">
        <div className="section-header-ai">
          <span className="section-tag-ai">Why Poker AI?</span>
          <h2 className="section-title-ai">
            This Isn't a Poker <em>Tool</em>.<br/>
            <span className="gradient-text-ai">It's a Poker AI.</span>
          </h2>
          <p className="section-subtitle-ai">
            Other products give you suggestions. Poker AI takes action.
            Our advanced AI reads your screen, calculates optimal plays,
            and executes them — all in milliseconds.
          </p>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card old">
            <div className="comparison-header">
              <span className="comparison-icon">📊</span>
              <h3>Traditional Tools</h3>
            </div>
            <ul className="comparison-list">
              <li><span className="x-mark">✗</span> Manual input required</li>
              <li><span className="x-mark">✗</span> You interpret the data</li>
              <li><span className="x-mark">✗</span> You click the buttons</li>
              <li><span className="x-mark">✗</span> Slow decision making</li>
              <li><span className="x-mark">✗</span> Human error</li>
              <li><span className="x-mark">✗</span> One table at a time</li>
            </ul>
          </div>

          <div className="comparison-card new">
            <div className="comparison-header">
              <span className="comparison-icon">🤖</span>
              <h3>Poker AI</h3>
              <span className="ai-chip">AI-Powered</span>
            </div>
            <ul className="comparison-list">
              <li><span className="check-mark">✓</span> Reads screen automatically</li>
              <li><span className="check-mark">✓</span> AI analyzes every situation</li>
              <li><span className="check-mark">✓</span> Executes actions for you</li>
              <li><span className="check-mark">✓</span> Sub-second decisions</li>
              <li><span className="check-mark">✓</span> Mathematical precision</li>
              <li><span className="check-mark">✓</span> 6 tables simultaneously</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="ai-capabilities">
        <div className="section-header-ai">
          <span className="section-tag-ai">AI Capabilities</span>
          <h2 className="section-title-ai">
            What The AI<br/>
            <span className="gradient-text-ai">Actually Does</span>
          </h2>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3>Computer Vision</h3>
            <p>
              AI reads your poker table in real-time. Detects cards, chips,
              pot sizes, player positions, and actions — all automatically.
            </p>
            <div className="capability-stats">
              <span><strong>99.9%</strong> accuracy</span>
              <span><strong>&lt;50ms</strong> detection</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z"/>
                <path d="M16 15H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4Z"/>
                <circle cx="12" cy="10" r="1"/>
              </svg>
            </div>
            <h3>Opponent Profiling</h3>
            <p>
              AI tracks every opponent across sessions. Builds detailed profiles
              with VPIP, PFR, aggression factors, and exploitable tendencies.
            </p>
            <div className="capability-stats">
              <span><strong>8,000+</strong> players tracked</span>
              <span><strong>20+</strong> stats per player</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </div>
            <h3>GTO Engine</h3>
            <p>
              Advanced game theory optimal calculations for every decision.
              Preflop ranges, postflop equity, pot odds, implied odds — all computed instantly.
            </p>
            <div className="capability-stats">
              <span><strong>100K+</strong> simulations/sec</span>
              <span><strong>GTO</strong> + exploitative</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3>Auto-Execution</h3>
            <p>
              AI doesn't just advise — it acts. Automatically clicks fold, call,
              raise, or all-in with precise bet sizing. You watch, it wins.
            </p>
            <div className="capability-stats">
              <span><strong>100%</strong> automated</span>
              <span><strong>0</strong> misclicks</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>Multi-Table AI</h3>
            <p>
              Run up to 6 tables simultaneously. AI manages all of them
              independently with zero performance loss. Maximum volume, maximum profit.
            </p>
            <div className="capability-stats">
              <span><strong>6</strong> tables</span>
              <span><strong>1000+</strong> hands/hour</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
            </div>
            <h3>Performance Analytics</h3>
            <p>
              Track every session with detailed analytics. Win rates, BB/100,
              hand histories, P/L calendars, and leak detection.
            </p>
            <div className="capability-stats">
              <span><strong>Real-time</strong> stats</span>
              <span><strong>Full</strong> hand history</span>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="ai-process">
        <div className="section-header-ai">
          <span className="section-tag-ai">The AI Process</span>
          <h2 className="section-title-ai">
            From Screen to Action<br/>
            <span className="gradient-text-ai">In Milliseconds</span>
          </h2>
        </div>

        <div className="process-flow">
          <div className="process-step">
            <div className="process-number">01</div>
            <div className="process-content">
              <h3>Capture</h3>
              <p>AI captures your poker table screen in real-time using advanced computer vision</p>
            </div>
            <div className="process-visual">
              <div className="visual-icon">👁️</div>
            </div>
          </div>

          <div className="process-connector">
            <svg viewBox="0 0 100 20">
              <path d="M0 10 H90 L80 5 M90 10 L80 15" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div className="process-step">
            <div className="process-number">02</div>
            <div className="process-content">
              <h3>Analyze</h3>
              <p>AI identifies cards, positions, pot size, stack depths, and opponent tendencies</p>
            </div>
            <div className="process-visual">
              <div className="visual-icon">🧠</div>
            </div>
          </div>

          <div className="process-connector">
            <svg viewBox="0 0 100 20">
              <path d="M0 10 H90 L80 5 M90 10 L80 15" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div className="process-step">
            <div className="process-number">03</div>
            <div className="process-content">
              <h3>Calculate</h3>
              <p>GTO engine computes optimal action with precise bet sizing using game theory</p>
            </div>
            <div className="process-visual">
              <div className="visual-icon">⚡</div>
            </div>
          </div>

          <div className="process-connector">
            <svg viewBox="0 0 100 20">
              <path d="M0 10 H90 L80 5 M90 10 L80 15" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          <div className="process-step">
            <div className="process-number">04</div>
            <div className="process-content">
              <h3>Execute</h3>
              <p>AI clicks the action automatically — fold, call, raise, or all-in</p>
            </div>
            <div className="process-visual">
              <div className="visual-icon">🎯</div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots with Device Frames */}
      <section className="auto-showcase">
        <div className="showcase-header">
          <span className="section-tag-ai">See It In Action</span>
          <h2 className="section-title-ai">
            Professional-Grade<br/>
            <span className="gradient-text-ai">AI Dashboard</span>
          </h2>
        </div>

        <div className="scroll-row large">
          <div className="scroll-track scroll-left">
            {[
              { img: 'live-tables.png', title: '6 Tables at Once', desc: 'AI plays every table simultaneously' },
              { img: 'profit-tracker.png', title: 'Profit Tracking', desc: 'Watch your bankroll grow' },
              { img: 'calendar.png', title: 'P/L Calendar', desc: '24 winning days. 1 losing day.' },
              { img: 'hand-replay.png', title: 'Hand Replay', desc: 'Review AI decisions street-by-street' },
              { img: 'opponents-board.png', title: 'Opponent Database', desc: '8,000+ players profiled' },
              { img: 'activity-metrics.png', title: 'AI Metrics', desc: '97% execution accuracy' },
            ].map((item, i) => (
              <div className="scroll-item large device-frame" key={i}>
                <div className="device-mockup">
                  <div className="device-notch"></div>
                  <img src={`/images/${item.img}`} alt={item.title} />
                </div>
                <div className="scroll-caption">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              { img: 'live-tables.png', title: '6 Tables at Once', desc: 'AI plays every table simultaneously' },
              { img: 'profit-tracker.png', title: 'Profit Tracking', desc: 'Watch your bankroll grow' },
              { img: 'calendar.png', title: 'P/L Calendar', desc: '24 winning days. 1 losing day.' },
              { img: 'hand-replay.png', title: 'Hand Replay', desc: 'Review AI decisions street-by-street' },
              { img: 'opponents-board.png', title: 'Opponent Database', desc: '8,000+ players profiled' },
              { img: 'activity-metrics.png', title: 'AI Metrics', desc: '97% execution accuracy' },
            ].map((item, i) => (
              <div className="scroll-item large device-frame" key={`dup-${i}`}>
                <div className="device-mockup">
                  <div className="device-notch"></div>
                  <img src={`/images/${item.img}`} alt={item.title} />
                </div>
                <div className="scroll-caption">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section-ai">
        <div className="section-header-ai">
          <span className="section-tag-ai">FAQ</span>
          <h2 className="section-title-ai">
            Common<br/>
            <span className="gradient-text-ai">Questions</span>
          </h2>
        </div>

        <div className="faq-accordion">
          {faqData.map((faq, index) => (
            <div
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              key={index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-toggle">{openFaq === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Sites */}
      <section className="supported-sites-ai">
        <div className="section-header-ai">
          <span className="section-tag-ai">Compatibility</span>
          <h2 className="section-title-ai">
            Supported<br/>
            <span className="gradient-text-ai">Poker Sites</span>
          </h2>
        </div>

        <div className="sites-grid">
          <div className="site-card-ai live">
            <div className="site-status live">
              <span className="pulse-dot"></span>
              LIVE NOW
            </div>
            <div className="site-icon">🎰</div>
            <h3>Stake.us</h3>
            <p>Full AI support for all cash game tables</p>
            <div className="site-tags">
              <span>Cash Games</span>
              <span>All Stakes</span>
              <span>6 Tables</span>
            </div>
          </div>

          <div className="coming-soon-sites">
            <h4>Coming Soon</h4>
            <div className="coming-soon-list">
              {['Global Poker', 'ClubGG', 'BetOnline', 'Ignition', 'ACR'].map(site => (
                <div className="coming-soon-item" key={site}>
                  <span className="coming-icon">🔜</span>
                  <span>{site}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-ai">
        <div className="section-header-ai">
          <span className="section-tag-ai">Pricing</span>
          <h2 className="section-title-ai">
            Simple, Transparent<br/>
            <span className="gradient-text-ai">AI Pricing</span>
          </h2>
        </div>

        <div className="pricing-cards-ai">
          <div className="price-card-ai">
            <div className="price-name">Daily</div>
            <div className="price-amount">$5</div>
            <div className="price-period">per day</div>
            <ul className="price-features">
              <li>Full AI automation</li>
              <li>6 tables simultaneous</li>
              <li>All analytics</li>
            </ul>
            <Link to="/signup" className="price-btn-ai">Get Started</Link>
          </div>

          <div className="price-card-ai">
            <div className="price-name">Weekly</div>
            <div className="price-amount">$25</div>
            <div className="price-period">per week</div>
            <div className="price-savings">Save 50%</div>
            <ul className="price-features">
              <li>Full AI automation</li>
              <li>6 tables simultaneous</li>
              <li>All analytics</li>
            </ul>
            <Link to="/signup" className="price-btn-ai">Get Started</Link>
          </div>

          <div className="price-card-ai featured">
            <div className="price-badge">MOST POPULAR</div>
            <div className="price-name">Monthly</div>
            <div className="price-amount">$60</div>
            <div className="price-period">per month</div>
            <div className="price-savings">Save 60%</div>
            <ul className="price-features">
              <li>Full AI automation</li>
              <li>6 tables simultaneous</li>
              <li>All analytics</li>
              <li>Priority support</li>
            </ul>
            <Link to="/signup" className="price-btn-ai primary">Get Started</Link>
          </div>

          <div className="price-card-ai">
            <div className="price-name">Yearly</div>
            <div className="price-amount">$549</div>
            <div className="price-period">per year</div>
            <div className="price-savings">Best Value - Save 70%</div>
            <ul className="price-features">
              <li>Full AI automation</li>
              <li>6 tables simultaneous</li>
              <li>All analytics</li>
              <li>Priority support</li>
            </ul>
            <Link to="/signup" className="price-btn-ai">Get Started</Link>
          </div>
        </div>

        <p className="pricing-note-ai">
          All plans include full AI capabilities. Cancel anytime. 200 free hands to start.
        </p>
      </section>

      {/* Final CTA */}
      <section className="final-cta-ai">
        <div className="cta-bg-ai">
          <div className="cta-glow-ai"></div>
        </div>
        <div className="cta-content-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="cta-logo" />
          <h2>Ready to Let AI Play for You?</h2>
          <p>
            Join hundreds of players who are already using Poker AI
            to automate their game and maximize their profits.
          </p>
          <Link to="/signup" className="btn-cta-ai large">
            <span>Start Playing with AI</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p className="cta-subtext-ai">Instant access • Cancel anytime • 200 free hands</p>
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

      {/* Sticky Mobile CTA */}
      <div className="sticky-cta-mobile">
        <Link to="/signup" className="sticky-cta-btn">
          <span>Start Free Trial</span>
          <span className="sticky-cta-badge">200 Free Hands</span>
        </Link>
      </div>

    </div>
  );
}

export default Home;
