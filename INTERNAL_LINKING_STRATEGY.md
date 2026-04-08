# Internal Linking Strategy - Poker AI Website

## 🎯 What is Internal Linking?

Internal links connect pages within your website. They help:
- **SEO**: Distribute page authority across your site
- **User Experience**: Help users discover related content
- **Indexing**: Help Google discover and crawl all your pages
- **Conversion**: Guide users toward signup/purchase pages

---

## 📊 Site Structure (Hub & Spoke Model)

```
Homepage (Main Hub)
    │
    ├─── Features (Sub-Hub)
    │    ├─ GTO Solver
    │    ├─ Hand Analyzer
    │    └─ How It Works
    │
    ├─── Pricing (High Priority)
    │    └─ Signup
    │
    ├─── Blog (Content Hub)
    │    ├─ What is GTO Poker?
    │    ├─ Best Poker Software 2026
    │    ├─ HUD Statistics Guide
    │    ├─ Hand Analysis Guide
    │    └─ How Poker AI Works
    │
    ├─── Download
    │
    └─── Resources
         ├─ FAQ
         ├─ Affiliate
         ├─ Terms
         └─ Privacy
```

---

## 🔗 INTERNAL LINKING RULES

### 1. Homepage Links TO:
**Primary Navigation (Header):**
- Pricing
- Features
- Download
- FAQ
- Blog
- Login/Signup

**In-Content Links:**
- GTO Solver page (from "GTO Analysis" section)
- Hand Analyzer page (from "Hand Analysis" section)
- How It Works (from process section)
- Signup (multiple CTAs)
- Blog posts (from "Learn More" sections)

**Footer Links:**
- All main pages
- Legal pages (Terms, Privacy)
- Social media

### 2. Blog Posts Link TO:
**Within Content:**
- Related blog posts (2-3 per article)
- Feature pages (GTO Solver, Hand Analyzer)
- Homepage (brand mentions)
- Pricing page (when mentioning cost)

**End of Article:**
- "Ready to try?" → Signup
- "Learn more" → Related feature page
- "Read next" → Related blog posts

**Sidebar/Related:**
- 3-5 related articles
- CTA to Signup/Pricing

### 3. Feature Pages Link TO:
**Contextual Links:**
- Homepage (breadcrumb)
- Other feature pages (compare features)
- Related blog posts
- Pricing (when discussing plans)
- Download (for installation)

**CTAs:**
- Signup/Trial (primary)
- Pricing (secondary)

### 4. Pricing Page Links TO:
**Comparison:**
- Features page (feature details)
- FAQ (common questions)
- Blog (value justification)

**CTAs:**
- Signup (primary)
- Download (after purchase)

---

## 📝 IMPLEMENTATION EXAMPLES

### Homepage Internal Links:

```jsx
// In Home.jsx - GTO Capabilities Section
<h3>GTO Solver Engine</h3>
<p>
  Professional-grade <Link to="/gto-solver">GTO solver</Link> with game theory
  optimal calculations for every decision. Learn more about{' '}
  <Link to="/blog/what-is-gto-poker">what GTO poker is</Link>.
</p>

// In Home.jsx - Hand Analyzer Section
<h3>Hand Analysis</h3>
<p>
  Analyze hands with our advanced <Link to="/hand-analyzer">hand analyzer tool</Link>.
  Read our guide on{' '}
  <Link to="/blog/poker-hand-analysis-guide">how to analyze poker hands</Link>.
</p>

// In Home.jsx - CTA Section
<Link to="/signup" className="btn-cta-ai large">
  Get Started Free
</Link>
<Link to="/pricing" className="btn-cta-secondary">
  View Pricing
</Link>
```

### Blog Post Internal Links:

```markdown
<!-- In BLOG_POST_1_GTO_POKER.md -->

Our [GTO solver](/gto-solver) calculates optimal strategy...

For hands you've already played, use our [hand analyzer](/hand-analyzer)...

Learn more about [how Poker AI works](/how-it-works)...

Ready to start? [Try Poker AI free for 1 day](/signup).

**Related Articles:**
- [10 Best Poker Software in 2026](/blog/best-poker-software-2026)
- [How to Analyze Poker Hands](/blog/poker-hand-analysis-guide)
- [Poker HUD Statistics Explained](/blog/poker-hud-statistics-guide)
```

### Feature Page Internal Links:

```jsx
// In GTOSolver.jsx
<p>
  Our <Link to="/">GTO solver</Link> is part of the comprehensive{' '}
  <Link to="/features">Poker AI suite</Link>. Combine it with our{' '}
  <Link to="/hand-analyzer">hand analyzer</Link> for complete analysis.
</p>

<p>
  New to GTO? Read our{' '}
  <Link to="/blog/what-is-gto-poker">beginner's guide to GTO poker</Link>.
</p>

<Link to="/pricing">View pricing plans</Link> starting at just $15/week.
```

---

## 🎯 ANCHOR TEXT BEST PRACTICES

### ✅ Good Anchor Text:

**Exact Match (Use Sparingly):**
- "poker software"
- "GTO solver"
- "hand analyzer"

**Partial Match (Use Often):**
- "advanced GTO solver"
- "our poker software"
- "hand analysis tool"

**Branded (Safe):**
- "Poker AI"
- "our platform"
- "this software"

**Descriptive (Best for UX):**
- "learn more about GTO strategy"
- "try our free trial"
- "read the complete guide"

### ❌ Bad Anchor Text:

- "click here" (no context)
- "this page" (not descriptive)
- "read more" (vague)
- Over-optimized: "best poker software GTO solver analyzer" (keyword stuffing)

---

## 📍 WHERE TO ADD INTERNAL LINKS

### Header Navigation (Every Page):
```jsx
<nav>
  <Link to="/">Home</Link>
  <Link to="/features">Features</Link>
  <Link to="/pricing">Pricing</Link>
  <Link to="/blog">Blog</Link>
  <Link to="/download">Download</Link>
  <Link to="/faq">FAQ</Link>
</nav>
```

### Breadcrumbs (All Non-Homepage Pages):
```jsx
<div className="breadcrumbs">
  <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / What is GTO Poker?
</div>
```

### Contextual Links (Within Content):
- Link relevant keywords to feature pages
- Link to blog posts when mentioning topics
- Link to pricing when discussing plans
- 3-5 contextual links per page

### Related Content Sections:
```jsx
<section className="related-posts">
  <h3>Related Articles</h3>
  <ul>
    <li><Link to="/blog/gto-guide">What is GTO Poker?</Link></li>
    <li><Link to="/blog/best-software">Best Poker Software 2026</Link></li>
    <li><Link to="/blog/hud-stats">HUD Statistics Guide</Link></li>
  </ul>
</section>
```

### CTAs (Call-to-Actions):
```jsx
<Link to="/signup" className="cta-button">
  Start Free Trial
</Link>
<Link to="/pricing">
  View All Plans
</Link>
```

### Footer (Every Page):
```jsx
<footer>
  <div className="footer-links">
    <Link to="/features">Features</Link>
    <Link to="/pricing">Pricing</Link>
    <Link to="/blog">Blog</Link>
    <Link to="/download">Download</Link>
    <Link to="/faq">FAQ</Link>
    <Link to="/affiliate">Affiliate Program</Link>
    <Link to="/terms">Terms</Link>
    <Link to="/privacy">Privacy</Link>
  </div>
</footer>
```

---

## 🔄 INTERNAL LINKING MATRIX

| From Page | To Pages | Priority | Anchor Text Examples |
|-----------|----------|----------|---------------------|
| **Homepage** | GTO Solver | High | "GTO solver", "game theory optimal analysis" |
| | Hand Analyzer | High | "hand analyzer", "analyze your hands" |
| | Pricing | High | "view pricing", "see plans", "$15/week" |
| | Blog | Medium | "learn more", "poker strategy guides" |
| | Signup | High | "get started", "try free", "start trial" |
| **Blog Posts** | Related Posts | High | Descriptive titles |
| | Feature Pages | High | Feature names with context |
| | Signup | High | "try Poker AI", "get started free" |
| | Pricing | Medium | "plans starting at $15" |
| **GTO Solver** | Homepage | Medium | "Poker AI", "home" |
| | Hand Analyzer | Medium | "hand analyzer tool" |
| | Blog: GTO Guide | High | "what is GTO poker" |
| | Pricing | High | "view pricing", "see plans" |
| **Hand Analyzer** | Homepage | Medium | "Poker AI", "main page" |
| | GTO Solver | Medium | "GTO solver" |
| | Blog: Hand Analysis | High | "how to analyze hands" |
| | Signup | High | "start analyzing hands" |
| **Pricing** | Features | High | "see all features" |
| | FAQ | Medium | "common questions" |
| | Blog: Software Comparison | High | "compare poker software" |
| | Signup | High | "get started", "choose plan" |

---

## 📈 INTERNAL LINKING METRICS TO TRACK

### In Google Search Console:
- **Internal Links Report**: See which pages have most internal links
- **Top Linked Pages**: Identify important pages
- **Orphan Pages**: Find pages with no internal links

### Using Screaming Frog (SEO Spider):
- Crawl your site
- Check "Internal" tab for link distribution
- Find pages with 0 inlinks
- Identify broken internal links

### Goals:
- **Homepage**: 50+ internal links pointing to it
- **Key Landing Pages**: 20+ internal links each
- **Blog Posts**: 10+ internal links each
- **Every Page**: At least 3 inlinks (no orphans)

---

## 🛠️ IMPLEMENTATION CHECKLIST

### Phase 1: Navigation & Structure
- [ ] Add proper header navigation to all pages
- [ ] Add footer with links to all main pages
- [ ] Implement breadcrumbs on all non-homepage pages
- [ ] Ensure every page links back to homepage

### Phase 2: Contextual Links
- [ ] Add 3-5 contextual links in homepage content
- [ ] Link from features section to feature pages
- [ ] Add blog post links from homepage
- [ ] Link to signup from all CTAs

### Phase 3: Blog Internal Linking
- [ ] Add "Related Articles" section to each blog post
- [ ] Link to feature pages from relevant blog content
- [ ] Add CTAs linking to signup/pricing
- [ ] Cross-link between related blog posts

### Phase 4: Feature Pages
- [ ] Link between feature pages (GTO ↔ Hand Analyzer)
- [ ] Add links to relevant blog posts
- [ ] Include breadcrumb navigation
- [ ] Link to pricing and signup

### Phase 5: Optimization
- [ ] Audit all internal links (check for 404s)
- [ ] Vary anchor text (avoid repetition)
- [ ] Add "nofollow" to login/dashboard links
- [ ] Create HTML sitemap page (for users)

---

## 📝 CODE SNIPPETS

### Breadcrumb Component:

Create `/frontend/src/components/Breadcrumbs.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, index) => (
        <span key={index}>
          {' '}/{' '}
          {item.link ? (
            <Link to={item.link}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
```

**Usage:**
```jsx
import Breadcrumbs from '../components/Breadcrumbs';

<Breadcrumbs items={[
  { label: 'Blog', link: '/blog' },
  { label: 'What is GTO Poker?' }
]} />
```

### Related Posts Component:

Create `/frontend/src/components/RelatedPosts.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function RelatedPosts({ posts }) {
  return (
    <section className="related-posts">
      <h3>Related Articles</h3>
      <div className="related-posts-grid">
        {posts.map((post, index) => (
          <Link
            to={post.url}
            key={index}
            className="related-post-card"
          >
            <h4>{post.title}</h4>
            <p>{post.excerpt}</p>
            <span className="read-more">Read More →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedPosts;
```

**Usage:**
```jsx
<RelatedPosts posts={[
  {
    title: "Best Poker Software 2026",
    excerpt: "Compare top poker tools...",
    url: "/blog/best-poker-software-2026"
  },
  {
    title: "HUD Statistics Explained",
    excerpt: "Learn VPIP, PFR, and more...",
    url: "/blog/poker-hud-statistics-guide"
  }
]} />
```

---

## ✅ QUICK WINS

### Add These Links Right Now:

1. **Homepage → GTO Solver Page**
   ```jsx
   <Link to="/gto-solver">Learn about our GTO solver</Link>
   ```

2. **Homepage → Blog**
   ```jsx
   <Link to="/blog">Read our poker strategy guides</Link>
   ```

3. **All Blog Posts → Signup**
   ```jsx
   <Link to="/signup">Try Poker AI Free for 1 Day</Link>
   ```

4. **Feature Pages → Pricing**
   ```jsx
   <Link to="/pricing">View pricing plans</Link>
   ```

5. **Every Page → Homepage (in logo)**
   ```jsx
   <Link to="/" className="logo">
     <img src="/images/logo.png" alt="Poker AI" />
   </Link>
   ```

---

## 🎯 INTERNAL LINKING GOALS

### Month 1:
- 100+ total internal links across site
- Every page has 3+ inlinks
- Header/footer navigation complete
- Blog posts cross-linked

### Month 3:
- 300+ total internal links
- Rich contextual linking
- Related content widgets
- Breadcrumbs on all pages

### Month 6:
- 500+ total internal links
- Comprehensive link structure
- Automated related content
- Perfect link distribution

---

**Remember:** Internal links are free SEO. Use them strategically to guide users and search engines through your most important content!

---

*Last Updated: April 8, 2026*
