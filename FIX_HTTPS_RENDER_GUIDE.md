# Fix HTTPS on Render.com - Step by Step

## 🎯 Goal
Get `https://sharkpokerclub.com` working with SSL certificate

---

## Step 1: Check Your Render Dashboard

1. Go to https://dashboard.render.com
2. Click on your app/service (the one serving sharkpokerclub.com)
3. Go to **Settings** tab
4. Scroll down to **Custom Domain** section

---

## Step 2: Configure Custom Domain

### Option A: If Domain is NOT Added Yet

1. Click **"Add Custom Domain"**
2. Enter: `sharkpokerclub.com`
3. Also add: `www.sharkpokerclub.com` (recommended)
4. Click **"Save"**

### Option B: If Domain is Already Added

Check the status - it should show:
- ✅ "SSL Certificate: Active" (Green checkmark)
- ⏳ "SSL Certificate: Pending" (Yellow, wait 5-60 mins)
- ❌ "SSL Certificate: Failed" (Red, needs DNS fix)

---

## Step 3: Update DNS Settings

Render will show you **DNS records** to add. You need to add these at your domain registrar (where you bought sharkpokerclub.com).

### Find the DNS Records Render Wants:

In Render dashboard, you'll see something like:

**For sharkpokerclub.com:**
```
Type: A
Name: @
Value: 216.24.57.1 (example IP)
```

**For www.sharkpokerclub.com:**
```
Type: CNAME
Name: www
Value: your-app-name.onrender.com
```

### Add These DNS Records:

1. **Go to your domain registrar** (GoDaddy, Namecheap, Cloudflare, etc.)
2. Find **DNS Settings** or **DNS Management**
3. **Add A Record:**
   - Type: `A`
   - Host/Name: `@` or leave blank
   - Value: The IP address Render shows
   - TTL: 3600 or Auto

4. **Add CNAME Record:**
   - Type: `CNAME`
   - Host/Name: `www`
   - Value: `your-app-name.onrender.com`
   - TTL: 3600 or Auto

5. **Save Changes**

---

## Step 4: Wait for DNS Propagation

- **Minimum:** 5 minutes
- **Typical:** 30-60 minutes
- **Maximum:** 24 hours (rare)

### Check DNS Propagation:
Go to https://dnschecker.org
- Enter: `sharkpokerclub.com`
- Check if A record shows Render's IP
- Check if CNAME shows your Render app

---

## Step 5: Enable "Force HTTPS" in Render

Once SSL is active:

1. Render Dashboard → Your Service → Settings
2. Find **"Force HTTPS"** toggle
3. Turn it **ON** ✅
4. Save

This redirects all `http://` to `https://` automatically.

---

## Step 6: Verify HTTPS Works

1. Visit `https://sharkpokerclub.com`
2. You should see a **padlock 🔒** in browser address bar
3. Click the padlock → Should say "Connection is secure"

---

## Step 7: Update All Files with HTTPS URLs

Now that HTTPS works, update these files:

### File 1: sitemap.xml
```bash
cd /Users/victorkoulikov/Desktop/server/frontend/public
# Open sitemap.xml
# Find & Replace ALL instances:
# http://yoursite.com → https://sharkpokerclub.com
```

### File 2: All React Helmet Pages
Update canonical URLs in:
- `/frontend/src/pages/GTOSolver.jsx`
- `/frontend/src/pages/HandAnalyzer.jsx`
- `/frontend/src/pages/HowItWorks.jsx`
- `/frontend/src/pages/Blog.jsx`

Change:
```jsx
<link rel="canonical" href="https://yoursite.com/gto-solver" />
```
To:
```jsx
<link rel="canonical" href="https://sharkpokerclub.com/gto-solver" />
```

### File 3: BreadcrumbSchema Component
Update URLs in breadcrumb items.

---

## Step 8: Redeploy to Render

```bash
cd /Users/victorkoulikov/Desktop/server/frontend
npm run build

# Then either:
# - Push to GitHub (if auto-deploy is enabled)
# - Or manually deploy via Render dashboard
```

---

## Step 9: Validate Fix in Google Search Console

1. Go to Google Search Console
2. Experience → HTTPS section
3. Click **"VALIDATE FIX"** button
4. Wait 1-7 days for Google to re-crawl

---

## ✅ Checklist

- [ ] Domain added to Render
- [ ] DNS A record added
- [ ] DNS CNAME record added
- [ ] Wait for DNS propagation (30-60 mins)
- [ ] SSL Certificate shows "Active" in Render
- [ ] Force HTTPS enabled in Render
- [ ] https://sharkpokerclub.com loads with padlock 🔒
- [ ] Updated sitemap.xml with HTTPS URLs
- [ ] Updated all React Helmet canonical URLs
- [ ] Redeployed to Render
- [ ] Validated fix in Google Search Console

---

## 🆘 Troubleshooting

### Problem: "SSL Certificate: Pending" for Hours
**Solution:** Check DNS records are correct. May need to wait up to 24h for DNS propagation.

### Problem: "SSL Certificate: Failed"
**Solution:**
1. Delete the custom domain in Render
2. Wait 5 minutes
3. Re-add it
4. Make sure DNS records are exact

### Problem: Site loads but shows "Not Secure"
**Solution:**
1. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Try incognito/private browsing
3. Check if Force HTTPS is enabled in Render

### Problem: DNS Not Propagating
**Solution:**
1. Double-check DNS records match exactly what Render shows
2. Wait longer (can take 24 hours)
3. Use https://dnschecker.org to monitor progress

---

## 📞 Need More Help?

If stuck after following these steps:
1. Check Render's support docs: https://render.com/docs/custom-domains
2. Post in Render community: https://community.render.com
3. Contact Render support (they're very responsive!)

---

**Remember:** Once HTTPS is working, Google will re-crawl within 1-7 days and the error will disappear!

---

*Last Updated: April 8, 2026*
