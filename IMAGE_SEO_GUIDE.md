# Image SEO Optimization Guide - Poker AI Website

## 🎯 Overview

Images are crucial for SEO. Properly optimized images improve:
- **Page load speed** (faster site = better rankings)
- **Image search visibility** (Google Images traffic)
- **Accessibility** (alt text for screen readers)
- **User experience** (properly sized, fast-loading images)

---

## 📋 IMAGE OPTIMIZATION CHECKLIST

### For Every Image on Your Site:

1. ✅ **Descriptive filename** (not IMG_1234.png)
2. ✅ **Alt text with keywords** (describe what's in the image)
3. ✅ **Compressed file size** (use TinyPNG, ImageOptim)
4. ✅ **Proper dimensions** (don't load 4K when you display 800px)
5. ✅ **Modern format** (WebP preferred, fallback to JPG/PNG)
6. ✅ **Lazy loading** (load images as user scrolls)
7. ✅ **Width & height attributes** (prevent layout shift)

---

## 🔧 IMPLEMENTATION EXAMPLES

### ❌ Bad Example:
```jsx
<img src="/images/img1.png" />
```

**Problems:**
- No alt text
- Generic filename
- No optimization
- No dimensions
- No lazy loading

### ✅ Good Example:
```jsx
<img
  src="/images/poker-ai-gto-solver-interface.webp"
  alt="Poker AI GTO solver analyzing pocket aces preflop decision with equity percentages"
  width="800"
  height="600"
  loading="lazy"
  className="screenshot"
/>
```

**Why it's good:**
- Descriptive filename with keywords
- Detailed alt text
- WebP format (smaller file size)
- Specified dimensions
- Lazy loading enabled

---

## 📝 ALT TEXT GUIDELINES

### Formula for Great Alt Text:
**[What it is] + [What it shows] + [Context/Keywords]**

### Examples:

**Logo:**
```jsx
<img
  src="/images/poker-ai-logo.png"
  alt="Poker AI logo - Advanced poker software and GTO solver"
/>
```

**Screenshot:**
```jsx
<img
  src="/images/dashboard-screenshot.webp"
  alt="Poker AI dashboard showing 6 poker tables with real-time GTO recommendations and HUD statistics"
/>
```

**Feature Icon:**
```jsx
<img
  src="/images/gto-solver-icon.png"
  alt="GTO solver icon representing game theory optimal poker analysis"
/>
```

**Chart/Graph:**
```jsx
<img
  src="/images/profit-graph.png"
  alt="Poker profit graph showing $5,000 win over 30 days using Poker AI GTO solver"
/>
```

**Comparison Table (as image):**
```jsx
<img
  src="/images/poker-software-comparison.png"
  alt="Comparison table of poker software features: Poker AI vs PioSOLVER vs GTO Plus showing pricing and features"
/>
```

### Alt Text Best Practices:

✅ **DO:**
- Describe the image content
- Include relevant keywords naturally
- Keep it under 125 characters
- Be specific and descriptive
- Think about what a blind user would want to know

❌ **DON'T:**
- Start with "Image of..." or "Picture of..."
- Keyword stuff
- Use same alt text for multiple images
- Leave it empty (unless decorative)
- Be vague ("screenshot" is not enough)

---

## 🖼️ FILE NAMING CONVENTIONS

### Before Uploading, Rename Your Images:

**Bad Names:**
- `IMG_1234.jpg`
- `screenshot.png`
- `image1.webp`
- `download.png`
- `photo.jpg`

**Good Names:**
- `poker-ai-gto-solver-dashboard.webp`
- `real-time-poker-analysis-screenshot.png`
- `hand-analyzer-equity-calculator.jpg`
- `poker-hud-statistics-vpip-pfr.webp`
- `multi-table-poker-software.png`

### Naming Formula:
**[product/topic]-[feature]-[description].extension**

Examples:
- `poker-ai-hero-image.webp`
- `gto-solver-preflop-ranges.png`
- `hand-analyzer-interface.jpg`
- `poker-software-comparison-table.webp`
- `opponent-tracking-database.png`

---

## 📐 IMAGE SIZING & COMPRESSION

### Recommended Sizes:

| Use Case | Width | Format | Max File Size |
|----------|-------|--------|---------------|
| Hero images | 1920px | WebP | 200KB |
| Screenshots | 1200px | WebP | 150KB |
| Feature images | 800px | WebP | 100KB |
| Icons | 128px | PNG/SVG | 20KB |
| Thumbnails | 400px | WebP | 50KB |
| Logo | 300px | PNG/SVG | 30KB |
| OG Image | 1200x630px | JPG | 150KB |

### Compression Tools:

**Free Online:**
- TinyPNG (tinypng.com) - PNG & JPG
- Squoosh (squoosh.app) - All formats including WebP
- Compressor.io - Multiple formats

**Desktop Apps:**
- ImageOptim (Mac) - Free
- FileOptimizer (Windows) - Free
- Adobe Photoshop - "Save for Web"

**Command Line:**
```bash
# Convert to WebP
cwebp input.png -q 80 -o output.webp

# Compress PNG
optipng -o7 input.png

# Compress JPG
jpegoptim --max=85 input.jpg
```

---

## 🚀 CURRENT IMAGES TO OPTIMIZE

Based on your website structure, here are the images that need optimization:

### 1. Logo
**Location:** `/frontend/public/images/poker-ai-logo.png`

**Current:** `poker-ai-logo.png`
**Rename to:** `poker-ai-logo-gto-solver-software.png`
**Alt text:** `Poker AI logo - Advanced poker software with GTO solver and AI decision support`

### 2. Favicon
**Location:** `/frontend/public/favicon.png`
**Keep as is:** (favicon doesn't need alt text)

### 3. Hero/Feature Images
**Locations:** `/frontend/public/images/`

**List of images to optimize:**

```
Current                     → Rename To                                        Alt Text
------------------------------------------------------------------------------------------
live-tables.png            → poker-ai-six-tables-multi-table-view.webp       "Poker AI displaying 6 simultaneous poker tables with real-time GTO analysis"
profit-tracker.png         → poker-profit-tracking-dashboard.webp            "Poker AI profit tracking dashboard showing daily win rate and bankroll growth"
calendar.png               → poker-profit-loss-calendar-monthly-view.webp    "Monthly poker profit/loss calendar showing 24 winning days with Poker AI"
hand-replay.png            → poker-hand-replay-analysis-tool.webp            "Poker AI hand replay tool analyzing pocket aces decision street by street"
opponents-board.png        → poker-opponent-database-hud-statistics.webp     "Poker AI opponent database with HUD statistics for 8,000+ tracked players"
activity-metrics.png       → poker-ai-performance-metrics-dashboard.webp     "Poker AI performance metrics showing 97% decision accuracy and win rate"
```

### 4. Open Graph Images (for social sharing)
**Create these if they don't exist:**

```
poker-ai-og-image.jpg       (1200x630px)
  Alt: "Poker AI - Advanced GTO Solver & Decision Support Software"

poker-ai-twitter-card.jpg   (1200x675px)
  Alt: "Poker AI - Professional poker software for serious players"
```

---

## 💻 CODE IMPLEMENTATION

### Update Home.jsx Image References:

Find all `<img>` tags and update them:

**Before:**
```jsx
<img src="/images/live-tables.png" alt={item.title} />
```

**After:**
```jsx
<img
  src="/images/poker-ai-six-tables-multi-table-view.webp"
  alt="Poker AI displaying 6 simultaneous poker tables with real-time GTO analysis and decision support"
  width="1200"
  height="800"
  loading="lazy"
/>
```

### Create Reusable Image Component:

Create `/frontend/src/components/OptimizedImage.jsx`:

```jsx
import React from 'react';

function OptimizedImage({ src, alt, width, height, className, eager = false }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
      decoding="async"
    />
  );
}

export default OptimizedImage;
```

**Usage:**
```jsx
import OptimizedImage from '../components/OptimizedImage';

<OptimizedImage
  src="/images/poker-ai-dashboard.webp"
  alt="Poker AI GTO solver dashboard with real-time analysis"
  width={1200}
  height={800}
/>
```

---

## 📊 IMAGE SITEMAP

Create `/frontend/public/sitemap-images.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <url>
    <loc>https://yoursite.com/</loc>
    <image:image>
      <image:loc>https://yoursite.com/images/poker-ai-logo-gto-solver-software.png</image:loc>
      <image:caption>Poker AI logo - Advanced poker software</image:caption>
      <image:title>Poker AI Logo</image:title>
    </image:image>
    <image:image>
      <image:loc>https://yoursite.com/images/poker-ai-six-tables-multi-table-view.webp</image:loc>
      <image:caption>Poker AI multi-table view with 6 simultaneous tables</image:caption>
      <image:title>Poker AI Multi-Table Interface</image:title>
    </image:image>
    <!-- Add all other images -->
  </url>

  <url>
    <loc>https://yoursite.com/gto-solver</loc>
    <image:image>
      <image:loc>https://yoursite.com/images/gto-solver-screenshot.webp</image:loc>
      <image:caption>GTO solver analyzing poker hand ranges</image:caption>
      <image:title>Poker AI GTO Solver</image:title>
    </image:image>
  </url>

  <!-- Add entries for all pages with images -->

</urlset>
```

**Submit to Google Search Console:**
After creating, submit `sitemap-images.xml` separately or reference it in your main sitemap.

---

## 🎨 RESPONSIVE IMAGES

### Use srcset for Different Screen Sizes:

```jsx
<img
  src="/images/poker-ai-dashboard-800.webp"
  srcset="
    /images/poker-ai-dashboard-400.webp 400w,
    /images/poker-ai-dashboard-800.webp 800w,
    /images/poker-ai-dashboard-1200.webp 1200w,
    /images/poker-ai-dashboard-1920.webp 1920w
  "
  sizes="(max-width: 640px) 400px,
         (max-width: 1024px) 800px,
         (max-width: 1920px) 1200px,
         1920px"
  alt="Poker AI dashboard showing GTO solver and multi-table analysis"
  width="1200"
  height="800"
  loading="lazy"
/>
```

**Benefits:**
- Mobile users get smaller images (faster load)
- Desktop users get high-res images (better quality)
- Saves bandwidth and improves Core Web Vitals

---

## ✅ ACTION ITEMS

### Immediate Tasks:

1. **Rename all image files** using SEO-friendly names
2. **Add alt text** to every image in the codebase
3. **Compress all images** using TinyPNG or Squoosh
4. **Convert to WebP** where possible (keep PNG backup)
5. **Add width/height** attributes to prevent layout shift
6. **Enable lazy loading** on all non-critical images
7. **Create OG images** for social sharing
8. **Generate image sitemap**

### Files to Update:

- `/frontend/src/pages/Home.jsx` - Update all image tags
- `/frontend/src/pages/Features.jsx` - Add alt text
- `/frontend/src/pages/GTOSolver.jsx` - Optimize images
- `/frontend/src/pages/HandAnalyzer.jsx` - Add lazy loading
- `/frontend/src/components/Header.jsx` - Logo alt text
- `/frontend/public/index.html` - OG image tags

---

## 📈 EXPECTED SEO IMPACT

After image optimization:

### Performance Improvements:
- 🚀 **Page load speed:** 30-50% faster
- 📱 **Mobile performance:** Significant improvement
- 🎯 **Core Web Vitals:** Better LCP (Largest Contentful Paint)
- 📊 **Google PageSpeed Score:** +10-20 points

### SEO Benefits:
- 🔍 **Image search traffic:** Images rank in Google Images
- ♿ **Accessibility score:** Improved for screen readers
- 🎨 **User experience:** Faster, smoother browsing
- 💰 **Conversion rate:** Better UX = more signups

---

## 🛠️ AUTOMATION SCRIPT

Save time with this Node.js script to batch process images:

```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './frontend/public/images';
const outputDir = './frontend/public/images/optimized';

fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    sharp(path.join(inputDir, file))
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp')))
      .then(() => console.log(`Optimized: ${file}`))
      .catch(err => console.error(`Error: ${file}`, err));
  }
});
```

**Install:**
```bash
npm install sharp
node optimize-images.js
```

---

## 📝 CHECKLIST FOR EACH IMAGE

Before uploading any new image:

- [ ] Renamed with descriptive, keyword-rich filename
- [ ] Compressed to appropriate file size
- [ ] Converted to WebP (with JPG/PNG fallback)
- [ ] Sized appropriately for display resolution
- [ ] Alt text written (descriptive + keywords)
- [ ] Width and height attributes added in code
- [ ] Lazy loading enabled (if not above fold)
- [ ] Tested on mobile and desktop
- [ ] Added to image sitemap (if important)

---

## 🎯 PRIORITY ORDER

### Week 1 (High Priority):
1. ✅ Logo alt text
2. ✅ Hero images optimization
3. ✅ Screenshot compression
4. ✅ Add loading="lazy" to all images
5. ✅ Create OG images for social sharing

### Week 2 (Medium Priority):
6. ⏳ Rename all existing images
7. ⏳ Convert images to WebP
8. ⏳ Add width/height to all images
9. ⏳ Create image sitemap
10. ⏳ Implement responsive images

### Week 3 (Nice to Have):
11. ⏳ Create multiple sizes for srcset
12. ⏳ Set up automated image pipeline
13. ⏳ Add image captions where helpful
14. ⏳ A/B test image placements

---

**Remember:** Every image is an SEO opportunity. Properly optimized images can drive significant traffic from Google Images and improve your overall search rankings!

---

*Last Updated: April 8, 2026*
