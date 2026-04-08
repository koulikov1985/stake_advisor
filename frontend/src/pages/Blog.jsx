import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/landing.css';

const blogPosts = [
  {
    slug: 'what-is-gto-poker',
    title: 'What is GTO Poker? Complete Beginner\'s Guide to Game Theory Optimal Strategy',
    excerpt: 'Learn what GTO (Game Theory Optimal) poker strategy is, why it matters, and how to implement it in your game. Complete guide for beginners.',
    date: '2026-04-08',
    category: 'Strategy',
    readTime: '8 min read'
  },
  {
    slug: 'best-poker-software-2026',
    title: '10 Best Poker Software Tools in 2026 - Complete Comparison',
    excerpt: 'Comprehensive review of the best poker software in 2026 including GTO solvers, HUDs, trackers, and AI assistants. Find the right tool for your game.',
    date: '2026-04-08',
    category: 'Software',
    readTime: '12 min read'
  },
  {
    slug: 'poker-hud-statistics-guide',
    title: 'Poker HUD Statistics Explained: VPIP, PFR, 3-Bet & More',
    excerpt: 'Complete guide to poker HUD stats. Learn what VPIP, PFR, aggression factor, and other stats mean and how to use them to exploit opponents.',
    date: '2026-04-08',
    category: 'Strategy',
    readTime: '10 min read'
  },
  {
    slug: 'poker-hand-analysis-guide',
    title: 'How to Analyze Poker Hands: Complete Hand Review Guide',
    excerpt: 'Learn how to properly analyze poker hands to find leaks and improve your game. Step-by-step hand analysis process used by professionals.',
    date: '2026-04-08',
    category: 'Learning',
    readTime: '9 min read'
  },
  {
    slug: 'how-poker-ai-works',
    title: 'How Poker AI Software Works: Technology Behind AI Decision Support',
    excerpt: 'Deep dive into how poker AI software works, including computer vision, GTO algorithms, and machine learning for real-time poker analysis.',
    date: '2026-04-08',
    category: 'Technology',
    readTime: '7 min read'
  }
];

function Blog() {
  return (
    <>
      <Helmet>
        <title>Poker AI Blog - Strategy Guides & Software Tutorials</title>
        <meta name="description" content="Learn poker strategy, GTO concepts, and software guides. Expert articles on improving your poker game with AI and analytics." />
        <meta name="keywords" content="poker blog, poker strategy, GTO strategy, poker guides, poker tutorials" />
        <link rel="canonical" href="https://sharkpokerclub.com/blog" />
        <meta property="og:title" content="Poker AI Blog - Strategy & Software Guides" />
        <meta property="og:description" content="Expert poker strategy articles and software tutorials." />
        <meta property="og:url" content="https://sharkpokerclub.com/blog" />
      </Helmet>

      {/* CollectionPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Poker AI Blog - Strategy Guides & Software Tutorials",
          "description": "Expert poker strategy articles, GTO guides, and software tutorials to improve your poker game.",
          "url": "https://sharkpokerclub.com/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Poker AI",
            "logo": {
              "@type": "ImageObject",
              "url": "https://sharkpokerclub.com/images/poker-ai-logo.png"
            }
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": blogPosts.map((post, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://sharkpokerclub.com/blog/${post.slug}`,
              "name": post.title
            }))
          }
        })}
      </script>
      <div className="landing ai-theme">
      {/* Floating Poker Cards */}
      <div className="floating-cards-global">
        <div className="floating-card card-1">A♠</div>
        <div className="floating-card card-2">K♥</div>
        <div className="floating-card card-3">Q♦</div>
        <div className="floating-card card-4">J♣</div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          <img src="/images/poker-ai-logo.png" alt="Poker AI" className="logo-image" />
        </Link>
        <nav className="landing-nav">
          <Link to="/pricing">Pricing</Link>
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
          <h1>
            Poker AI Blog<br />
            <span className="gradient-text">Poker Strategy & Software Guides</span>
          </h1>
          <p className="hero-desc">
            Learn poker strategy, GTO concepts, software guides, and advanced techniques
            to improve your game.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="landing-features">
        <div className="features-grid">
          {blogPosts.map((post, index) => (
            <Link
              to={`/blog/${post.slug}`}
              key={index}
              className="feature-card"
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  background: 'var(--accent-cyan)',
                  color: 'var(--bg-darker)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {post.readTime}
                </span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div style={{
                marginTop: '1rem',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                fontWeight: '600'
              }}>
                Read Article →
              </div>
            </Link>
          ))}
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
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p className="footer-copy-ai">&copy; 2026 Poker AI. All rights reserved.</p>
      </footer>
      </div>
    </>
  );
}

export default Blog;
