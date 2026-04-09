import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const botRisks = [
  {
    title: 'Automation risk',
    description: 'A poker bot acts for the player by making choices and clicks automatically.',
  },
  {
    title: 'Terms-of-service exposure',
    description: 'Major poker rooms commonly prohibit automated play and treat bots as a direct integrity issue.',
  },
  {
    title: 'Account consequences',
    description: 'Players usually search for alternatives because bans, confiscations, and forced closures are expensive.',
  },
  {
    title: 'No real skill growth',
    description: 'A bot can hide leaks instead of teaching ranges, bet sizing, and decision quality.',
  },
];

const alternativeFeatures = [
  {
    title: 'Real-time decision support',
    description: 'Get live recommendations and context while still making the final action yourself.',
    href: '/gto-solver',
    cta: 'See the GTO solver',
  },
  {
    title: 'Post-session hand review',
    description: 'Break down mistakes after the session so you improve instead of outsourcing every spot.',
    href: '/hand-analyzer',
    cta: 'Open hand analyzer',
  },
  {
    title: 'Opponent and table context',
    description: 'Use HUD-style data and reads to understand tendencies across real sessions.',
    href: '/best-poker-hud',
    cta: 'Explore HUD features',
  },
  {
    title: 'Transparent workflow',
    description: 'See how the product reads the table, analyzes the spot, and supports your choice.',
    href: '/how-it-works',
    cta: 'Learn how it works',
  },
];

const comparisonRows = [
  {
    label: 'Who makes the final action?',
    bot: 'Software acts for you',
    ai: 'You make the decision',
    study: 'Study only, outside live play',
  },
  {
    label: 'Primary use case',
    bot: 'Automate play',
    ai: 'Support study and decisions',
    study: 'Deep off-table analysis',
  },
  {
    label: 'Skill development',
    bot: 'Low',
    ai: 'High',
    study: 'High',
  },
  {
    label: 'Hand review and leak finding',
    bot: 'Weak',
    ai: 'Strong',
    study: 'Strong',
  },
  {
    label: 'Multi-table workflow',
    bot: 'Automated',
    ai: 'Player-controlled',
    study: 'Usually post-session',
  },
  {
    label: 'Best fit',
    bot: 'People chasing automation',
    ai: 'Players who want an edge and improvement',
    study: 'Dedicated study sessions',
  },
];

const workflowSteps = [
  {
    title: 'Review the spot in real time',
    description: 'Use live recommendations, ranges, and table context instead of fully automated actions.',
  },
  {
    title: 'Make the decision yourself',
    description: 'Treat the software like a decision-support layer, not an autopilot.',
  },
  {
    title: 'Study the session afterward',
    description: 'Use hand review and range analysis to compound your skill over time.',
  },
];

const faqItems = [
  {
    question: 'What is a poker bot?',
    answer:
      'A poker bot is software that automatically chooses actions and plays hands for the user. That is different from study or decision-support software where the player still controls every move.',
  },
  {
    question: 'Why do players search for a poker bot alternative?',
    answer:
      'Most players want the outcome, not the automation. They want faster decisions, better analysis, hand review, and a more structured way to study difficult spots.',
  },
  {
    question: 'Is Poker AI the same as a poker bot?',
    answer:
      'No. This page positions Poker AI as non-automated support and study software. The value comes from analysis, range work, and guidance while the player remains in control.',
  },
  {
    question: 'What should I look for in the best poker bot alternative?',
    answer:
      'Look for real-time decision support, hand review, opponent statistics, clear study workflows, and dedicated pages that explain how the software works.',
  },
];

const supportingResources = [
  {
    title: 'Poker GTO solver',
    description: 'Analyze preflop ranges, postflop decisions, and bet sizing in real time.',
    href: '/gto-solver',
  },
  {
    title: 'Hand analysis guide',
    description: 'Use a repeatable process to study mistakes and improve after each session.',
    href: '/blog/poker-hand-analysis-guide',
  },
  {
    title: 'Best poker software comparison',
    description: 'See how Poker AI compares with solvers, HUDs, and other tools.',
    href: '/blog/best-poker-software-2026',
  },
  {
    title: 'What is GTO poker?',
    description: 'Learn the strategic foundation behind solver-driven recommendations.',
    href: '/blog/what-is-gto-poker',
  },
];

function PokerBotAlternative() {
  return (
    <div className="landing ai-theme">
      <div className="floating-cards-global">
        <div className="floating-card card-1">A♠</div>
        <div className="floating-card card-2">K♥</div>
        <div className="floating-card card-3">Q♦</div>
        <div className="floating-card card-4">J♣</div>
      </div>

      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <Link to="/blog">Blog</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/login" className="nav-btn-ghost">Login</Link>
          <Link to="/signup" className="nav-btn-primary">Get Started</Link>
        </nav>
      </header>

      <main>
        <section className="landing-hero" style={{ paddingBottom: '3rem' }}>
          <div className="hero-glow"></div>
          <div className="hero-content" style={{ maxWidth: '860px' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span style={{ background: 'var(--accent-cyan)', color: 'var(--bg-darker)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700' }}>
                Poker Bot Alternative
              </span>
              <span style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                Updated April 8, 2026
              </span>
              <span style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                Real-time study and review
              </span>
            </div>
            <h1>
              Poker Bot Alternative:<br />
              <span className="gradient-text">Non-Automated Poker AI for Study and Review</span>
            </h1>
            <p className="hero-desc">
              Searching for a poker bot usually means you want better decisions, faster analysis, and a stronger process at the table.
              Poker AI is built for that intent without turning your workflow into pure automation. Use it to study GTO concepts,
              review hands, understand ranges, and support your decisions while you stay in control.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">
                Try Poker AI
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="#comparison" className="btn-hero-secondary">
                Compare options
              </a>
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1rem' }}>
            <article style={{ fontSize: '1.08rem', lineHeight: '1.85', color: 'var(--text-primary)' }}>
              <h2>What players usually mean when they search for a poker bot</h2>
              <p>
                Most searchers are not looking for theory alone. They want help making better poker decisions, seeing more information,
                and finding leaks faster than they can on their own. The problem is that the phrase <strong>poker bot</strong> usually
                points toward software that automates play rather than software that improves the player.
              </p>
              <p>
                A strong <strong>poker bot alternative</strong> should match the real underlying intent: faster analysis, clearer ranges,
                better review, and a repeatable learning system. That is where Poker AI fits. It combines decision support, hand analysis,
                GTO study, and table context so the player can improve instead of outsourcing the entire game.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <span className="section-tag">Why Alternatives Matter</span>
            <h2>Why automated poker bots are a bad long-term solution</h2>
            <p>Players usually move toward alternatives when they want less risk and more real skill development.</p>
          </div>
          <div className="features-grid">
            {botRisks.map((item) => (
              <div key={item.title} className="feature-card">
                <div className="feature-icon"><span>!</span></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="comparison" className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <span className="section-tag">Comparison</span>
            <h2>Poker bot vs Poker AI vs traditional study tools</h2>
            <p>These categories solve different problems. The best page for this keyword needs to explain the difference clearly.</p>
          </div>
          <div style={{ maxWidth: '1100px', margin: '0 auto', overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '18px', padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Question</th>
                  <th style={{ padding: '1rem' }}>Poker bot</th>
                  <th style={{ padding: '1rem' }}>Poker AI</th>
                  <th style={{ padding: '1rem' }}>Solver / HUD tools</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={row.label} style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{row.label}</td>
                    <td style={{ padding: '1rem', color: '#ff6b6b' }}>{row.bot}</td>
                    <td style={{ padding: '1rem', color: 'var(--accent-cyan)' }}>{row.ai}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.study}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="landing-features">
          <div className="features-header">
            <span className="section-tag">Core Product Fit</span>
            <h2>Why Poker AI is the better poker bot alternative</h2>
            <p>It targets the benefit players want without reducing everything to automation.</p>
          </div>
          <div className="features-grid">
            {alternativeFeatures.map((feature) => (
              <div key={feature.title} className="feature-card featured">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.href} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '700' }}>
                  {feature.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="features-header">
              <span className="section-tag">Workflow</span>
              <h2>How to replace a poker bot workflow with a real study system</h2>
              <p>The best alternative should help you play better now and become stronger later.</p>
            </div>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
              {workflowSteps.map((step, index) => (
                <div key={step.title} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: '1rem', alignItems: 'start', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(0, 212, 255, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '700' }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '0.5rem' }}>{step.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.75' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="features-header">
              <span className="section-tag">FAQ</span>
              <h2>Common questions about poker bot alternatives</h2>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {faqItems.map((item) => (
                <div key={item.question} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.75rem' }}>{item.question}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.75' }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-features" style={{ background: 'var(--bg-surface)' }}>
          <div className="features-header">
            <span className="section-tag">Related Guides</span>
            <h2>Keep building the topic cluster</h2>
            <p>This page ranks better when it is supported by deeper strategy and product content.</p>
          </div>
          <div className="features-grid">
            {supportingResources.map((resource) => (
              <div key={resource.href} className="feature-card">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <Link to={resource.href} style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '700' }}>
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <div className="cta-card">
            <h2>Choose the poker bot alternative that actually improves your game</h2>
            <p>Use Poker AI for decision support, hand review, GTO study, and a stronger long-term process.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn-hero-primary">
                Start free trial
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/pricing" className="btn-hero-secondary">View pricing</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer-ai">
        <div className="footer-brand-ai">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="footer-logo" />
        </div>
        <div className="footer-links-ai">
          <Link to="/blog">Blog</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/download">Download</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PokerBotAlternative;
