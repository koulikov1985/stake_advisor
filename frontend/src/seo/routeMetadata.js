export const SITE_NAME = 'Poker AI';
export const SITE_URL = 'https://sharkpokerclub.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/poker-ai-logo.png`;
export const DEFAULT_OG_IMAGE_ALT = 'Poker AI logo';
export const DEFAULT_LASTMOD = '2026-04-08';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  sameAs: ['https://discord.gg/NHUjvZXzrR'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Windows, macOS',
  offers: [
    {
      '@type': 'Offer',
      price: '15',
      priceCurrency: 'USD',
      name: 'Weekly Plan',
    },
    {
      '@type': 'Offer',
      price: '45',
      priceCurrency: 'USD',
      name: 'Monthly Plan',
    },
  ],
  url: SITE_URL,
};

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Poker AI software?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Poker AI is desktop poker software with real-time GTO analysis, hand review, decision support, and HUD statistics for serious online players.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the GTO solver work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The GTO solver analyzes poker situations in real time and estimates balanced decisions, equity, and range interactions for each spot.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I run multiple tables simultaneously?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Poker AI is built for multi-table play and supports up to six tables at once.',
      },
    },
    {
      '@type': 'Question',
      name: 'What platforms does Poker AI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Poker AI is available as a native desktop application for macOS and Windows.',
      },
    },
  ],
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I install Poker AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Download the app for macOS or Windows, extract the archive, and follow the setup steps included with the app.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get my license key?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After purchase, your license key is shown immediately and is also available in your account dashboard.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many tables can I play at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Poker AI supports up to six tables simultaneously.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I try Poker AI before buying?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. New users can start with a free trial allocation and review pricing options before subscribing.',
      },
    },
  ],
};

export const routeMetadata = {
  '/': {
    title: 'Poker AI Software | GTO Solver, Hand Analyzer & Poker HUD',
    description:
      'Poker AI is desktop poker software with real-time GTO analysis, hand review, range insights, and HUD statistics for serious online players.',
    changefreq: 'weekly',
    priority: '1.0',
    prerender: true,
    scripts: [organizationSchema, websiteSchema, softwareApplicationSchema, homeFaqSchema],
  },
  '/pricing': {
    title: 'Poker AI Pricing | Plans for GTO Solver and Poker HUD Software',
    description:
      'Compare Poker AI plans, free trial access, and subscription pricing for real-time GTO analysis, hand review, and HUD tools.',
    changefreq: 'weekly',
    priority: '0.9',
    prerender: true,
  },
  '/features': {
    title: 'Poker AI Features | Real-Time GTO Advice, HUD Stats and Hand Replay',
    description:
      'Explore Poker AI features including real-time GTO advice, multi-table support, opponent tracking, hand replay, and performance analytics.',
    changefreq: 'weekly',
    priority: '0.9',
    prerender: true,
  },
  '/faq': {
    title: 'Poker AI FAQ | Setup, Billing, Supported Sites and Troubleshooting',
    description:
      'Read answers about Poker AI setup, downloads, billing, supported platforms, licenses, and common troubleshooting steps.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
    scripts: [faqPageSchema],
  },
  '/download': {
    title: 'Download Poker AI for Mac and Windows',
    description:
      'Download the Poker AI desktop app for macOS and Windows to access real-time GTO decisions, hand analysis, and HUD features.',
    changefreq: 'monthly',
    priority: '0.9',
    prerender: true,
  },
  '/affiliate': {
    title: 'Poker AI Affiliate Program | Earn Recurring Poker Software Commission',
    description:
      'Join the Poker AI affiliate program and earn recurring commission by referring poker players to our desktop GTO software.',
    changefreq: 'monthly',
    priority: '0.6',
    prerender: true,
  },
  '/terms': {
    title: 'Poker AI Terms and Conditions',
    description:
      'Review the Poker AI terms and conditions covering account usage, licensing, subscriptions, limitations, and service rules.',
    changefreq: 'yearly',
    priority: '0.3',
    prerender: true,
  },
  '/privacy': {
    title: 'Poker AI Privacy Policy',
    description:
      'Read the Poker AI privacy policy to understand what information we collect, how we use it, and how we protect your data.',
    changefreq: 'yearly',
    priority: '0.3',
    prerender: true,
  },
  '/gto-solver': {
    title: 'Poker GTO Solver | Real-Time Game Theory Optimal Analysis',
    description:
      'Use Poker AI’s GTO solver to analyze preflop ranges, postflop decisions, bet sizing, and EV in real time.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/hand-analyzer': {
    title: 'Poker Hand Analyzer | Review Hands, Equity and Range Decisions',
    description:
      'Analyze poker hands with equity estimates, range review, and street-by-street decision support using Poker AI.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/how-it-works': {
    title: 'How Poker AI Works | Real-Time Analysis and Decision Support',
    description:
      'Learn how Poker AI combines computer vision, range analysis, and real-time decision support for online poker players.',
    changefreq: 'monthly',
    priority: '0.7',
    prerender: true,
  },
  '/poker-training-software': {
    title: 'Poker Training Software | Study GTO, Ranges and Hand Review',
    description:
      'Train with poker software built for GTO study, hand review, range work, and decision analysis across real sessions.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/best-poker-hud': {
    title: 'Best Poker HUD Software | Stats, Reads and Opponent Tracking',
    description:
      'Discover poker HUD software with real-time opponent stats, VPIP and PFR tracking, and actionable reads for online games.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/poker-bot-alternative': {
    title: 'Poker Bot Alternative | Decision Support and Poker Study Software',
    description:
      'Compare Poker AI as an alternative to poker bots with real-time decision support, GTO analysis, and post-session study tools.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/poker-equity-calculator': {
    title: 'Poker Equity Calculator | Estimate Hand Equity and Range Strength',
    description:
      'Estimate poker hand equity, compare ranges, and evaluate decisions with Poker AI’s real-time analysis tools.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/poker-range-analyzer': {
    title: 'Poker Range Analyzer | Build and Compare Preflop and Postflop Ranges',
    description:
      'Analyze poker ranges, compare combos, and understand balanced decisions with Poker AI’s range analysis tools.',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/blog': {
    title: 'Poker AI Blog | Poker Strategy, GTO Guides and Software Tutorials',
    description:
      'Read poker strategy guides, GTO explainers, HUD tutorials, and software comparisons for serious online poker players.',
    changefreq: 'weekly',
    priority: '0.7',
    prerender: true,
  },
  '/blog/what-is-gto-poker': {
    title: "What is GTO Poker? Beginner's Guide to Game Theory Optimal Strategy",
    description:
      'Learn what GTO poker means, why it matters, and how to use game theory optimal concepts to improve your decisions.',
    type: 'article',
    section: 'Strategy',
    tags: ['GTO', 'Poker Strategy'],
    publishedTime: '2026-04-08T00:00:00Z',
    modifiedTime: '2026-04-08T00:00:00Z',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/blog/best-poker-software-2026': {
    title: 'Best Poker Software in 2026 | Tools, HUDs, Solvers and AI Compared',
    description:
      'Compare the best poker software in 2026 including GTO solvers, HUDs, trackers, and AI tools for serious players.',
    type: 'article',
    section: 'Software',
    tags: ['Poker Software', 'GTO Solver', 'HUD'],
    publishedTime: '2026-04-08T00:00:00Z',
    modifiedTime: '2026-04-08T00:00:00Z',
    changefreq: 'monthly',
    priority: '0.8',
    prerender: true,
  },
  '/blog/poker-hud-statistics-guide': {
    title: 'Poker HUD Statistics Explained | VPIP, PFR, 3-Bet and More',
    description:
      'Learn what core poker HUD statistics mean, how to interpret them, and how to use them to make better decisions.',
    type: 'article',
    section: 'Strategy',
    tags: ['HUD', 'VPIP', 'PFR'],
    publishedTime: '2026-04-08T00:00:00Z',
    modifiedTime: '2026-04-08T00:00:00Z',
    changefreq: 'monthly',
    priority: '0.7',
    prerender: true,
  },
  '/blog/poker-hand-analysis-guide': {
    title: 'How to Analyze Poker Hands | A Complete Hand Review Guide',
    description:
      'Learn a practical hand review process to find leaks, study decisions, and improve your poker game over time.',
    type: 'article',
    section: 'Learning',
    tags: ['Hand Analysis', 'Poker Study'],
    publishedTime: '2026-04-08T00:00:00Z',
    modifiedTime: '2026-04-08T00:00:00Z',
    changefreq: 'monthly',
    priority: '0.7',
    prerender: true,
  },
  '/blog/how-poker-ai-works': {
    title: 'How Poker AI Works | Technology Behind Real-Time Poker Decisions',
    description:
      'See how poker AI software uses real-time analysis, GTO logic, and table data to support better poker decisions.',
    type: 'article',
    section: 'Technology',
    tags: ['Poker AI', 'Computer Vision', 'GTO'],
    publishedTime: '2026-04-08T00:00:00Z',
    modifiedTime: '2026-04-08T00:00:00Z',
    changefreq: 'monthly',
    priority: '0.7',
    prerender: true,
  },
  '/success': {
    title: 'Purchase Success | Poker AI',
    description: 'Purchase confirmation for Poker AI.',
    index: false,
  },
  '/login': {
    title: 'Login | Poker AI',
    description: 'Log in to your Poker AI account.',
    index: false,
  },
  '/signup': {
    title: 'Sign Up | Poker AI',
    description: 'Create your Poker AI account.',
    index: false,
  },
  '/forgot-password': {
    title: 'Forgot Password | Poker AI',
    description: 'Reset your Poker AI password.',
    index: false,
  },
  '/reset-password': {
    title: 'Reset Password | Poker AI',
    description: 'Choose a new Poker AI password.',
    index: false,
  },
  '/verify-email': {
    title: 'Verify Email | Poker AI',
    description: 'Verify your Poker AI email address.',
    index: false,
  },
  '/dashboard': {
    title: 'Dashboard | Poker AI',
    description: 'Manage your Poker AI account and subscription.',
    index: false,
    disallowInRobots: true,
  },
};

export function normalizePath(pathname = '/') {
  if (!pathname) return '/';
  const cleanPath = pathname.split('?')[0].split('#')[0];
  if (cleanPath === '/') return '/';
  return cleanPath.replace(/\/+$/, '');
}

export function getRouteMetadata(pathname = '/') {
  const normalizedPath = normalizePath(pathname);
  return routeMetadata[normalizedPath] || routeMetadata['/'];
}

export function getPrerenderRoutes() {
  return Object.entries(routeMetadata)
    .filter(([, metadata]) => metadata.prerender)
    .map(([path, metadata]) => ({ path, ...metadata }));
}

export function getSitemapRoutes() {
  return Object.entries(routeMetadata)
    .filter(([, metadata]) => metadata.index !== false)
    .map(([path, metadata]) => ({
      path,
      lastmod: metadata.lastmod || DEFAULT_LASTMOD,
      changefreq: metadata.changefreq || 'monthly',
      priority: metadata.priority || '0.5',
    }));
}

export function getRobotsDisallowPaths() {
  return Object.entries(routeMetadata)
    .filter(([, metadata]) => metadata.index === false && metadata.disallowInRobots !== false)
    .map(([path]) => path);
}
