import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

// Animated Counter Hook
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, end, duration]);

  return { count, ref };
}

function Affiliate() {
  const [referrals, setReferrals] = useState(5);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Animated stats
  const stat1 = useCountUp(15, 1500);
  const stat2 = useCountUp(120, 2000);
  const stat3 = useCountUp(1440, 2000);

  const earnings = [
    { plan: 'Daily', price: 5, commission: 0.75 },
    { plan: 'Weekly', price: 25, commission: 3.75 },
    { plan: 'Monthly', price: 60, commission: 9.00 },
    { plan: 'Yearly', price: 549, commission: 82.35 }
  ];

  // Calculate potential earnings
  const monthlyPerReferral = 9.00; // 15% of $60 monthly
  const monthlyTotal = referrals * monthlyPerReferral;
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="landing ai-theme">
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

      {/* Hero */}
      <section className="hero-ai">
        <div className="hero-bg-effects">
          <div className="ai-grid-bg"></div>
          <div className="ai-glow-orb orb-1"></div>
          <div className="ai-glow-orb orb-2"></div>
          <div className="floating-cards">
            <div className="floating-card card-1">💰</div>
            <div className="floating-card card-2">💵</div>
            <div className="floating-card card-3">🤑</div>
            <div className="floating-card card-4">💎</div>
          </div>
        </div>

        <div className="hero-content-ai">
          <div className="ai-badge">
            <span className="ai-pulse"></span>
            <span className="ai-text">Partner Program</span>
          </div>

          <h1 className="hero-title-ai">
            Turn Your Network Into<br/>
            <span className="gradient-text-ai">Passive Income</span>
          </h1>

          <p className="hero-subtitle-ai">
            Know poker players? Share Poker AI and earn <strong>15% recurring commission</strong> on every subscription —
            for as long as they stay subscribed. No limits. No caps. Pure profit.
          </p>

          <div className="hero-cta-group">
            <Link to="/signup" className="btn-cta-ai">
              <span>Start Earning Today</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#calculator" className="btn-cta-secondary-ai">
              <span>Calculate Earnings</span>
            </a>
          </div>

          <div className="hero-trust-ai">
            <div className="trust-item-ai">
              <span className="trust-icon-ai">💰</span>
              <span>15% Recurring</span>
            </div>
            <div className="trust-item-ai">
              <span className="trust-icon-ai">♾️</span>
              <span>Lifetime Commissions</span>
            </div>
            <div className="trust-item-ai">
              <span className="trust-icon-ai">⚡</span>
              <span>Instant Payouts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-showcase-ai">
        <div className="stats-container-ai">
          <div className="stat-item-ai" ref={stat1.ref}>
            <span className="stat-number-ai">{stat1.count}%</span>
            <span className="stat-unit-ai">Commission</span>
            <span className="stat-desc-ai">On Every Sale</span>
          </div>
          <div className="stat-divider-ai"></div>
          <div className="stat-item-ai" ref={stat2.ref}>
            <span className="stat-number-ai">${stat2.count}</span>
            <span className="stat-unit-ai">Per Year</span>
            <span className="stat-desc-ai">Per Referral</span>
          </div>
          <div className="stat-divider-ai"></div>
          <div className="stat-item-ai" ref={stat3.ref}>
            <span className="stat-number-ai">${stat3.count}</span>
            <span className="stat-unit-ai">Per Year</span>
            <span className="stat-desc-ai">With 10 Referrals</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="affiliate-how-it-works">
        <div className="section-header-ai">
          <span className="section-tag-ai">How It Works</span>
          <h2 className="section-title-ai">
            3 Simple Steps To<br/>
            <span className="gradient-text-ai">Start Earning</span>
          </h2>
        </div>

        <div className="affiliate-steps">
          <div className="affiliate-step">
            <div className="affiliate-step-number">1</div>
            <div className="affiliate-step-icon">🎮</div>
            <h3>Subscribe to Poker AI</h3>
            <p>Get an active subscription to unlock your unique referral link. Try the AI yourself so you can genuinely recommend it.</p>
          </div>

          <div className="affiliate-step-arrow">→</div>

          <div className="affiliate-step">
            <div className="affiliate-step-number">2</div>
            <div className="affiliate-step-icon">📢</div>
            <h3>Share Your Link</h3>
            <p>Share your unique referral link with friends, poker communities, Discord servers, YouTube, Twitter — anywhere poker players hang out.</p>
          </div>

          <div className="affiliate-step-arrow">→</div>

          <div className="affiliate-step">
            <div className="affiliate-step-number">3</div>
            <div className="affiliate-step-icon">💸</div>
            <h3>Earn 15% Forever</h3>
            <p>Every time someone subscribes through your link, you earn 15% of their payment. Not just once — every single month they stay subscribed.</p>
          </div>
        </div>
      </section>

      {/* Commission Table */}
      <section className="affiliate-earnings">
        <div className="section-header-ai">
          <span className="section-tag-ai">Your Earnings</span>
          <h2 className="section-title-ai">
            Commission Per<br/>
            <span className="gradient-text-ai">Subscription</span>
          </h2>
        </div>

        <div className="earnings-table">
          <div className="earnings-header">
            <span>Plan</span>
            <span>Price</span>
            <span>Your Commission (15%)</span>
          </div>
          {earnings.map((item, i) => (
            <div className="earnings-row" key={i}>
              <span className="earnings-plan">{item.plan}</span>
              <span className="earnings-price">${item.price}</span>
              <span className="earnings-commission">${item.commission.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="earnings-highlight">
          <div className="earnings-highlight-icon">🎯</div>
          <div>
            <strong>Best for You: Monthly & Yearly Referrals</strong>
            <p>Most users choose monthly ($9/referral/month) or yearly ($82.35/referral). Focus on getting long-term subscribers for maximum passive income!</p>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="affiliate-calculator" id="calculator">
        <div className="section-header-ai">
          <span className="section-tag-ai">Earnings Calculator</span>
          <h2 className="section-title-ai">
            See Your<br/>
            <span className="gradient-text-ai">Earning Potential</span>
          </h2>
        </div>

        <div className="calculator-card">
          <div className="calculator-input">
            <label>How many people can you refer?</label>
            <div className="calculator-slider-container">
              <input
                type="range"
                min="1"
                max="50"
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="calculator-slider"
              />
              <div className="calculator-value">{referrals} referrals</div>
            </div>
          </div>

          <div className="calculator-results">
            <div className="calculator-result">
              <span className="result-label">Monthly Earnings</span>
              <span className="result-value">${monthlyTotal.toFixed(2)}</span>
              <span className="result-note">Every month, automatically</span>
            </div>
            <div className="calculator-result featured">
              <span className="result-label">Yearly Earnings</span>
              <span className="result-value">${yearlyTotal.toFixed(2)}</span>
              <span className="result-note">Pure passive income</span>
            </div>
          </div>

          <div className="calculator-scenarios">
            <h4>Real Scenarios:</h4>
            <div className="scenario-grid">
              <div className="scenario">
                <span className="scenario-title">Small Streamer</span>
                <span className="scenario-refs">10 referrals</span>
                <span className="scenario-earnings">$1,080/year</span>
              </div>
              <div className="scenario">
                <span className="scenario-title">Poker Influencer</span>
                <span className="scenario-refs">50 referrals</span>
                <span className="scenario-earnings">$5,400/year</span>
              </div>
              <div className="scenario">
                <span className="scenario-title">Discord Community</span>
                <span className="scenario-refs">100 referrals</span>
                <span className="scenario-earnings">$10,800/year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="affiliate-benefits">
        <div className="section-header-ai">
          <span className="section-tag-ai">Why Join</span>
          <h2 className="section-title-ai">
            The Best Affiliate Program<br/>
            <span className="gradient-text-ai">In Poker Software</span>
          </h2>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h3>Recurring Revenue</h3>
            <p>Unlike one-time commissions, you earn 15% every time your referral renews. Monthly subscribers = monthly income for you.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">♾️</div>
            <h3>Lifetime Attribution</h3>
            <p>Once someone signs up with your link, they're yours forever. Even if they cancel and come back years later, you still earn.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>High Conversion</h3>
            <p>Poker AI sells itself. Real automation, real results. Players see the value immediately with 200 free hands to try.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">💳</div>
            <h3>Monthly Payouts</h3>
            <p>Get paid every month via PayPal or crypto. No minimum threshold — if you earned it, you get it.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
            <h3>Real-Time Dashboard</h3>
            <p>Track clicks, signups, and earnings in real-time. See exactly how your referrals are performing.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon">🤝</div>
            <h3>Dedicated Support</h3>
            <p>Need custom landing pages or promotional materials? We'll help you maximize your conversions.</p>
          </div>
        </div>
      </section>

      {/* Who Should Join */}
      <section className="affiliate-audience">
        <div className="section-header-ai">
          <span className="section-tag-ai">Perfect For</span>
          <h2 className="section-title-ai">
            Who Should<br/>
            <span className="gradient-text-ai">Become a Partner?</span>
          </h2>
        </div>

        <div className="audience-grid">
          <div className="audience-card">
            <span className="audience-emoji">🎬</span>
            <h3>Poker Streamers</h3>
            <p>Show your viewers real results with Poker AI. Natural product placement that actually helps your audience win.</p>
          </div>
          <div className="audience-card">
            <span className="audience-emoji">📱</span>
            <h3>Social Media Influencers</h3>
            <p>Poker content on TikTok, YouTube, Twitter? Your followers want to win more — give them the tool.</p>
          </div>
          <div className="audience-card">
            <span className="audience-emoji">💬</span>
            <h3>Discord Server Owners</h3>
            <p>Run a poker community? Share your link and earn from every member who wants to level up their game.</p>
          </div>
          <div className="audience-card">
            <span className="audience-emoji">🎯</span>
            <h3>Poker Coaches</h3>
            <p>Recommend Poker AI to your students. They improve faster, you earn passive income. Win-win.</p>
          </div>
          <div className="audience-card">
            <span className="audience-emoji">🃏</span>
            <h3>Regular Players</h3>
            <p>Just play poker with friends? Share your link at the home game. Even 5 referrals = $540/year.</p>
          </div>
          <div className="audience-card">
            <span className="audience-emoji">📝</span>
            <h3>Bloggers & Writers</h3>
            <p>Write about poker strategy? Include Poker AI in your articles and monetize your traffic.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section-ai">
        <div className="section-header-ai">
          <span className="section-tag-ai">FAQ</span>
          <h2 className="section-title-ai">
            Common<br/>
            <span className="gradient-text-ai">Questions</span>
          </h2>
        </div>

        <div className="faq-accordion">
          {[
            {
              q: "Do I need to be a subscriber to earn commissions?",
              a: "Yes, you need an active Poker AI subscription to access your referral link and dashboard. This ensures you can genuinely recommend the product because you use it yourself."
            },
            {
              q: "How and when do I get paid?",
              a: "Commissions are paid monthly via PayPal or cryptocurrency. There's no minimum threshold — whatever you've earned, you'll receive at the end of each month."
            },
            {
              q: "Is there a limit to how much I can earn?",
              a: "Absolutely not. There's no cap on commissions or referrals. The more people you refer, the more you earn. Some of our top affiliates earn over $1,000/month."
            },
            {
              q: "What if my referral cancels and resubscribes later?",
              a: "They're still your referral! Once someone signs up with your link, they're attributed to you forever. If they come back in 6 months or 2 years, you still earn commission."
            },
            {
              q: "Can I promote Poker AI on multiple platforms?",
              a: "Yes! You can share your referral link anywhere — YouTube, TikTok, Twitter, Discord, forums, your own website, email lists, etc. The more places, the better."
            }
          ].map((faq, i) => (
            <details className="faq-item" key={i}>
              <summary className="faq-question">
                <span>{faq.q}</span>
                <span className="faq-toggle">+</span>
              </summary>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-ai">
        <div className="cta-bg-ai">
          <div className="cta-glow-ai"></div>
        </div>
        <div className="cta-content-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="cta-logo" />
          <h2>Ready to Start Earning?</h2>
          <p>
            Join the Poker AI partner program today and turn your network into passive income.
            Get your referral link in seconds.
          </p>
          <Link to="/signup" className="btn-cta-ai large">
            <span>Get Your Referral Link</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p className="cta-subtext-ai">Subscribe to unlock your unique referral link</p>
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
          <Link to="/affiliate">Earn With Us</Link>
          <a href="https://discord.gg/NHUjvZXzrR" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
        <p className="footer-copy-ai">© 2025 Poker AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Affiliate;
