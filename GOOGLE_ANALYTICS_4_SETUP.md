# Google Analytics 4 (GA4) Setup Guide

## Why You Need Google Analytics

Google Analytics tracks:
- How many people visit your site
- Where they come from (Google, social media, direct)
- Which pages they view
- How long they stay
- Conversion rates (signups, downloads)

**Critical for understanding your SEO performance!**

---

## Step-by-Step Setup (10 Minutes)

### Step 1: Create Google Analytics Account

1. Go to: https://analytics.google.com
2. Click "Start measuring"
3. Sign in with your Google account

### Step 2: Set Up Property

1. **Account name:** Enter "Poker AI" or your company name
2. **Property name:** Enter "Poker AI Website"
3. **Reporting time zone:** Select your timezone
4. **Currency:** Select USD
5. Click "Next"

### Step 3: Business Information

1. **Industry category:** Select "Games" or "Software"
2. **Business size:** Select your team size
3. **How you plan to use Analytics:** Select all that apply
4. Click "Create"
5. Accept Terms of Service

### Step 4: Set Up Data Stream

1. Select "Web"
2. **Website URL:** `https://sharkpokerclub.com`
3. **Stream name:** "Poker AI Website"
4. Click "Create stream"

### Step 5: Get Your Measurement ID

You'll see a **Measurement ID** like: `G-XXXXXXXXXX`

**IMPORTANT:** Copy this ID! You'll need it.

---

## Adding GA4 to Your Website

### ✅ Already Done!

I've already added the Google Analytics code to your site in `frontend/index.html`.

**Just replace the placeholder with your real Measurement ID:**

1. Open `/Users/victorkoulikov/Desktop/server/frontend/index.html`

2. Find this line:
   ```javascript
   gtag('config', 'G-XXXXXXXXXX', {
   ```

3. Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 5

4. Also replace it in this line:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

5. Save the file

6. Deploy to production:
   ```bash
   cd /Users/victorkoulikov/Desktop/server
   npm run build
   git add frontend/index.html
   git commit -m "feat: Add Google Analytics 4 tracking"
   git push origin main
   ```

---

## Setting Up Key Events (Conversions)

Track important user actions!

### Event 1: Sign Up

1. In GA4, go to **Configure** → **Events**
2. Click "Create event"
3. **Event name:** `sign_up`
4. This will auto-track when users visit `/signup`

### Event 2: Download

1. Create another event
2. **Event name:** `download`
3. Tracks visits to `/download`

### Event 3: Purchase (Subscription)

1. Create event
2. **Event name:** `purchase`
3. Track successful payments

### Mark as Conversions

1. Go to **Configure** → **Events**
2. Toggle "Mark as conversion" for:
   - sign_up ✅
   - download ✅
   - purchase ✅

---

## Understanding Your GA4 Reports

### Real-Time Report

**Location:** Reports → Real-time

**What it shows:**
- Active users right now
- Where they're from
- Which pages they're viewing

**Use it to:**
- Verify GA4 is working
- See immediate traffic from campaigns

### Acquisition Report

**Location:** Reports → Acquisition → Traffic acquisition

**What it shows:**
- Where users come from:
  - Organic Search (Google, Bing)
  - Direct (typed URL)
  - Social (Twitter, Reddit, Discord)
  - Referral (other websites linking to you)

**Use it to:**
- Measure SEO success (Organic Search growth)
- Track backlink effectiveness (Referral traffic)
- Identify best traffic sources

### Engagement Report

**Location:** Reports → Engagement → Pages and screens

**What it shows:**
- Most viewed pages
- Average engagement time
- Bounce rate

**Use it to:**
- Find your best content
- Identify pages that need improvement
- Optimize user experience

### Conversion Report

**Location:** Reports → Conversions

**What it shows:**
- How many sign-ups
- Conversion rate
- Revenue (if e-commerce enabled)

**Use it to:**
- Track business growth
- Calculate ROI from SEO
- Optimize conversion funnel

---

## Custom Reports to Create

### SEO Performance Report

Track organic search traffic:

1. Go to **Explore** → Create new exploration
2. Add dimensions:
   - Session source/medium
   - Landing page
3. Add metrics:
   - Sessions
   - Engaged sessions
   - Conversions
4. Filter: Session source/medium = "google / organic"

### Landing Page Performance

See which pages drive conversions:

1. **Explore** → Create new exploration
2. Dimensions: Landing page
3. Metrics:
   - Sessions
   - Engagement rate
   - Conversions
   - Conversion rate
4. Sort by conversions (descending)

---

## Setting Up Goals & Funnels

### Funnel: Homepage → Signup → Success

1. Go to **Explore** → Funnel exploration
2. Add steps:
   - Step 1: page_view (/)
   - Step 2: page_view (/signup)
   - Step 3: sign_up event
3. Name it "Signup Funnel"

**What it shows:**
- How many people go from homepage → signup
- Where users drop off
- Conversion rate at each step

### Funnel: Blog → Signup

1. Create new funnel
2. Steps:
   - Step 1: page_view (/blog/*)
   - Step 2: page_view (/signup)
   - Step 3: sign_up event

**Use it to:**
- Measure blog content effectiveness
- Optimize CTAs in blog posts

---

## Tracking Campaign Performance

### UTM Parameters

Add UTM codes to track specific campaigns:

**Example URLs:**

Reddit post:
```
https://sharkpokerclub.com/?utm_source=reddit&utm_medium=social&utm_campaign=launch
```

Twitter bio link:
```
https://sharkpokerclub.com/?utm_source=twitter&utm_medium=social&utm_campaign=profile
```

Email campaign:
```
https://sharkpokerclub.com/?utm_source=email&utm_medium=email&utm_campaign=newsletter
```

**Build UTM links:** https://ga-dev-tools.google/campaign-url-builder/

---

## What to Monitor Weekly

### Week 1: Installation Check
- [ ] Real-time shows active users? ✅
- [ ] Page views being tracked? ✅
- [ ] Events firing correctly? ✅

### Week 2+: Growth Metrics
- [ ] Total users (should grow week-over-week)
- [ ] Organic search traffic (SEO working?)
- [ ] Top landing pages (which content performs best?)
- [ ] Conversion rate (signups/total users)

### Monthly Reviews
- [ ] Export data to spreadsheet
- [ ] Compare month-over-month growth
- [ ] Identify traffic sources to double down on
- [ ] Find underperforming pages to improve

---

## Key Metrics to Track

### Traffic Metrics

| Metric | What It Means | Target (Month 1) | Target (Month 6) |
|--------|---------------|------------------|------------------|
| **Total Users** | Unique visitors | 500+ | 10,000+ |
| **Sessions** | Website visits | 750+ | 15,000+ |
| **Organic Search** | Google traffic | 200+ | 8,000+ |
| **Avg Session Duration** | Time on site | 1:30+ | 2:30+ |

### Engagement Metrics

| Metric | What It Means | Good | Great |
|--------|---------------|------|-------|
| **Bounce Rate** | % who leave immediately | <50% | <30% |
| **Pages/Session** | Pages per visit | 2.5+ | 4.0+ |
| **Engagement Rate** | % engaged sessions | 60%+ | 75%+ |

### Conversion Metrics

| Metric | What It Means | Good | Great |
|--------|---------------|------|-------|
| **Conversion Rate** | % who sign up | 2%+ | 5%+ |
| **Goal Completions** | Total conversions | 10+/week | 50+/week |

---

## Advanced Features

### User Demographics

**Enable in:** Admin → Property Settings → Data Collection

See user:
- Age
- Gender
- Interests
- Location

**Use it to:**
- Understand your audience
- Target ads better
- Create relevant content

### E-Commerce Tracking

If you sell directly (not just subscriptions):

1. Go to **Admin** → **Data Streams** → Your stream
2. Enable "Enhanced measurement"
3. Turn on E-commerce events

### Cross-Domain Tracking

If you have multiple domains (e.g., blog.sharkpokerclub.com):

1. **Admin** → **Data Streams** → Configure tag settings
2. Add all domains
3. Users will be tracked across both sites

---

## Integrations

### Link to Google Search Console

**Huge benefit:** See search queries in GA4!

1. **Admin** → **Product Links** → **Search Console Links**
2. Click "Link"
3. Select your Search Console property
4. Click "Confirm"

**Now you can see:**
- Which Google searches led to visits
- Landing pages from organic search
- Click-through rates

### Link to Google Ads (If Running Ads)

1. **Admin** → **Google Ads Links**
2. Follow setup wizard
3. Track ad performance in GA4

---

## Privacy & Compliance

### Cookie Consent

**Recommended:** Add cookie consent banner

Popular options:
- Cookiebot
- OneTrust
- CookieYes

### IP Anonymization

Already enabled in your setup:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

### GDPR Compliance

If you have EU users:
1. Add cookie consent banner
2. Allow users to opt-out
3. Add Privacy Policy page (you already have this)

---

## Troubleshooting

### "No data available"

**Wait 24-48 hours** after setup. Data isn't instant.

### "Not receiving any hits"

1. Check Measurement ID is correct
2. Verify GA4 code is in `<head>`
3. Test in Real-Time report (visit your site, check if you appear)
4. Check browser isn't blocking analytics

### Events not tracking

1. Go to **Configure** → **Debug View**
2. Install "Google Analytics Debugger" Chrome extension
3. Visit your site and check debug console

---

## Monthly SEO Report Template

Create this spreadsheet monthly:

| Month | Total Users | Organic Users | Conversions | Conversion Rate | Top Landing Page |
|-------|-------------|---------------|-------------|-----------------|------------------|
| Jan 2026 | 500 | 200 | 10 | 2.0% | / |
| Feb 2026 | 1,200 | 600 | 30 | 2.5% | /gto-solver |
| Mar 2026 | 3,000 | 1,800 | 90 | 3.0% | /blog/what-is-gto-poker |

**Track growth over time!**

---

## Next Steps

1. ✅ **Copy your Measurement ID** from GA4
2. ✅ **Update index.html** with real ID (replace G-XXXXXXXXXX)
3. ✅ **Deploy to production**
4. ✅ **Wait 24 hours** for data to appear
5. ✅ **Check Real-Time report** to verify it's working
6. ✅ **Set up key events** (sign_up, download, purchase)
7. ✅ **Link to Google Search Console**

---

## Pro Tips

### 1. Create Custom Dashboards

Build a daily SEO dashboard:
1. Organic traffic trend
2. Top landing pages
3. Conversion funnel
4. Top traffic sources

### 2. Set Up Alerts

Get notified of unusual activity:
1. **Admin** → **Custom Alerts**
2. Alert when conversions drop >20%
3. Alert when traffic spikes >50%

### 3. Export Data Weekly

1. Go to any report
2. Click "Share" → "Download file"
3. Track trends in Excel/Sheets

---

## Resources

- GA4 Documentation: https://support.google.com/analytics
- GA4 Academy (Free Course): https://analytics.google.com/analytics/academy/
- UTM Builder: https://ga-dev-tools.google/campaign-url-builder/

---

## Your GA4 Implementation Checklist

- [ ] Created GA4 property
- [ ] Got Measurement ID
- [ ] Updated index.html with real ID
- [ ] Deployed to production
- [ ] Verified data appears in Real-Time
- [ ] Set up key events (sign_up, download)
- [ ] Linked to Google Search Console
- [ ] Created custom dashboard for SEO metrics
- [ ] Set up weekly reporting routine

**Once complete, you'll have full visibility into your SEO and traffic performance!**
