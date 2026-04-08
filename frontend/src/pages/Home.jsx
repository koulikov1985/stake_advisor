import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/landing.css';

// FAQ Data - SEO Optimized
const faqData = [
  {
    q: "What is Poker AI software?",
    a: "Poker AI is professional poker software that provides real-time GTO solver analysis, hand analysis tools, AI decision support, and HUD statistics. It's designed for serious poker players who want advanced analytical tools."
  },
  {
    q: "How does the GTO solver work?",
    a: "Our GTO solver uses advanced algorithms to analyze poker situations in real-time. It calculates optimal plays based on game theory, provides equity analysis, and evaluates hand ranges with mathematical precision."
  },
  {
    q: "What poker sites does it support?",
    a: "Poker AI currently supports Stake.us with additional poker sites coming soon including Global Poker, ClubGG, BetOnline, and Ignition. Check our compatibility page for the latest updates."
  },
  {
    q: "Can I run multiple tables simultaneously?",
    a: "Yes, Poker AI supports up to 6 tables simultaneously. Each table is analyzed independently with dedicated real-time GTO calculations and decision support."
  },
  {
    q: "What makes Poker AI different from other poker software?",
    a: "Poker AI combines a powerful GTO solver, real-time analysis, AI decision support, opponent tracking, and performance analytics in one platform. Our software uses advanced computer vision and machine learning for superior accuracy."
  },
  {
    q: "How do I get started with Poker AI?",
    a: "Create an account and choose a plan. We offer a free 1-day pass to try the software, plus weekly ($15) and monthly ($45) subscription options. Download for Windows or Mac."
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
            Advanced Poker AI Software<br/>
            <span className="gradient-text-ai">For Serious Players</span>
          </h1>

          <p className="hero-subtitle-ai">
            Professional poker software with real-time <strong>GTO solver</strong>, hand analyzer,
            AI decision support, and advanced HUD statistics. Get optimal play recommendations
            with mathematical precision across 6 tables simultaneously.
          </p>

          <div className="hero-cta-group">
            <Link to="/signup" className="btn-cta-ai">
              <span>Get Started Free</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/how-it-works" className="btn-cta-secondary-ai">
              <span>How It Works</span>
            </Link>
          </div>

          <div className="hero-trust-ai">
            <div className="trust-item-ai">
              <span className="trust-icon-ai">🎯</span>
              <span>GTO Solver</span>
            </div>
            <div className="trust-item-ai">
              <span className="trust-icon-ai">🧠</span>
              <span>AI Decision Support</span>
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
          <span className="section-tag-ai">Why Choose Poker AI Software?</span>
          <h2 className="section-title-ai">
            Advanced Poker Software<br/>
            <span className="gradient-text-ai">Built Different</span>
          </h2>
          <p className="section-subtitle-ai">
            Poker AI combines GTO solver technology, real-time analysis, and AI decision support
            in one powerful platform. Get instant recommendations based on game theory optimal strategy
            with mathematical precision.
          </p>
        </div>

        <div className="comparison-grid">
          <div className="comparison-card old">
            <div className="comparison-header">
              <span className="comparison-icon">📊</span>
              <h3>Basic Poker Tools</h3>
            </div>
            <ul className="comparison-list">
              <li><span className="x-mark">✗</span> Manual input required</li>
              <li><span className="x-mark">✗</span> Limited analysis depth</li>
              <li><span className="x-mark">✗</span> Slow calculations</li>
              <li><span className="x-mark">✗</span> Basic HUD stats only</li>
              <li><span className="x-mark">✗</span> No GTO solver</li>
              <li><span className="x-mark">✗</span> Single table focus</li>
            </ul>
          </div>

          <div className="comparison-card new">
            <div className="comparison-header">
              <span className="comparison-icon">🤖</span>
              <h3>Poker AI</h3>
              <span className="ai-chip">AI-Powered</span>
            </div>
            <ul className="comparison-list">
              <li><span className="check-mark">✓</span> Automatic table recognition</li>
              <li><span className="check-mark">✓</span> Advanced GTO solver</li>
              <li><span className="check-mark">✓</span> Real-time decision support</li>
              <li><span className="check-mark">✓</span> Comprehensive HUD statistics</li>
              <li><span className="check-mark">✓</span> Equity calculator built-in</li>
              <li><span className="check-mark">✓</span> 6 tables simultaneously</li>
            </ul>
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="ai-capabilities">
        <div className="section-header-ai">
          <span className="section-tag-ai">Poker Software Features</span>
          <h2 className="section-title-ai">
            Professional-Grade<br/>
            <span className="gradient-text-ai">Poker Tools</span>
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
            <h3>Real-Time Table Recognition</h3>
            <p>
              Advanced computer vision technology analyzes poker tables in real-time.
              Automatically detects cards, chips, pot sizes, player positions, and actions
              with industry-leading accuracy.
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
            <h3>GTO Solver Engine</h3>
            <p>
              Professional-grade GTO solver with game theory optimal calculations for every decision.
              Analyzes preflop ranges, postflop equity, pot odds, and implied odds with mathematical precision.
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
            <h3>AI Decision Support</h3>
            <p>
              Get instant AI-powered recommendations for every poker decision.
              Optimal fold, call, raise, and all-in suggestions with precise bet sizing
              based on GTO strategy and opponent tendencies.
            </p>
            <div className="capability-stats">
              <span><strong>Real-time</strong> recommendations</span>
              <span><strong>GTO</strong> precision</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>Multi-Table Support</h3>
            <p>
              Analyze up to 6 poker tables simultaneously with independent GTO calculations
              for each table. Perfect for high-volume players who want consistent decision quality
              across multiple games.
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
          <span className="section-tag-ai">How Poker AI Works</span>
          <h2 className="section-title-ai">
            From Analysis to Decision<br/>
            <span className="gradient-text-ai">In Milliseconds</span>
          </h2>
        </div>

        <div className="process-flow">
          <div className="process-step">
            <div className="process-number">01</div>
            <div className="process-content">
              <h3>Table Recognition</h3>
              <p>Advanced computer vision captures poker table data in real-time with 99.9% accuracy</p>
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
              <h3>Data Analysis</h3>
              <p>Software identifies cards, positions, pot size, stack depths, and opponent statistics</p>
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
              <h3>GTO Calculation</h3>
              <p>GTO solver computes optimal strategy with precise equity calculations and bet sizing</p>
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
              <h3>Decision Support</h3>
              <p>AI provides optimal play recommendations — fold, call, raise, or all-in with exact sizing</p>
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
            <div className="price-name">1-Day Pass</div>
            <div className="price-amount">Free</div>
            <div className="price-period">1 day</div>
            <ul className="price-features">
              <li>Full AI automation</li>
              <li>6 tables simultaneous</li>
              <li>All analytics</li>
            </ul>
            <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer" className="price-btn-ai">Join Discord</a>
          </div>

          <div className="price-card-ai">
            <div className="price-name">Weekly</div>
            <div className="price-amount">$15</div>
            <div className="price-period">per week</div>
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
            <div className="price-amount">$45</div>
            <div className="price-period">per month</div>
            <ul className="price-features">
              <li>Full AI automation</li>
              <li>6 tables simultaneous</li>
              <li>All analytics</li>
              <li>Priority support</li>
            </ul>
            <Link to="/signup" className="price-btn-ai primary">Get Started</Link>
          </div>

        </div>

        <p className="pricing-note-ai">
          All plans include full AI capabilities. Cancel anytime.
        </p>
      </section>

      {/* Blog Section */}
      <section className="landing-features" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="section-header-ai">
          <span className="section-tag-ai">Learn Poker Strategy</span>
          <h2 className="section-title-ai">
            Latest from the Blog<br/>
            <span className="gradient-text-ai">Expert Poker Guides</span>
          </h2>
        </div>

        <div className="features-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link to="/blog/what-is-gto-poker" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{
                background: 'var(--accent-cyan)',
                color: 'var(--bg-darker)',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>Strategy</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>8 min read</span>
            </div>
            <h3>What is GTO Poker? Complete Beginner's Guide</h3>
            <p>Learn what Game Theory Optimal poker strategy is, why it matters, and how to implement it in your game to become unexploitable.</p>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
              Read Article →
            </div>
          </Link>

          <Link to="/blog/best-poker-software-2026" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{
                background: 'var(--accent-purple)',
                color: 'var(--bg-darker)',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>Software</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>12 min read</span>
            </div>
            <h3>10 Best Poker Software Tools in 2026</h3>
            <p>Comprehensive comparison of the best poker software including GTO solvers, HUDs, trackers, and AI assistants for serious players.</p>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
              Read Article →
            </div>
          </Link>

          <Link to="/blog/poker-hud-statistics-guide" className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{
                background: 'var(--accent-cyan)',
                color: 'var(--bg-darker)',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>Strategy</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>10 min read</span>
            </div>
            <h3>Poker HUD Statistics Explained: VPIP, PFR & More</h3>
            <p>Complete guide to poker HUD stats. Learn what VPIP, PFR, aggression factor mean and how to exploit different player types.</p>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
              Read Article →
            </div>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/blog" className="btn-cta-ai">
            <span>View All Articles</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-ai">
        <div className="cta-bg-ai">
          <div className="cta-glow-ai"></div>
        </div>
        <div className="cta-content-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI Software Logo" className="cta-logo" />
          <h2>Ready to Elevate Your Poker Game?</h2>
          <p>
            Join hundreds of serious poker players using Poker AI software
            for GTO analysis, decision support, and advanced hand analysis.
          </p>
          <Link to="/signup" className="btn-cta-ai large">
            <span>Get Started Free</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p className="cta-subtext-ai">1-day free trial • Cancel anytime • Windows & Mac</p>
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
          <span>Get Started</span>
        </Link>
      </div>

    </div>
  );
}

export default Home;
