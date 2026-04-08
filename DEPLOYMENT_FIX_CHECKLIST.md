# Render Deployment Fix - Quick Checklist

## 🔴 Your Issue
Render shows: "Instance failed: Exited with status 1"

## ✅ Quick Fix (5 minutes)

### 1. Add Environment Variables

Go to: **Render Dashboard → stake-advisor service → Environment**

Add these 2 variables:

```
ADMIN_EMAIL = admin@sharkpokerclub.com
ADMIN_PASSWORD = [create a strong password]
```

Click **Save Changes** (this will trigger auto-deploy)

### 2. Wait for Deploy

- Watch the **Logs** tab
- Look for: "Application startup complete"
- Wait ~2-3 minutes

### 3. Test It Works

Visit: `https://stake-advisor.onrender.com/health`

Should show: `{"status":"ok"}`

## ✅ If That Doesn't Work

### Check These Variables Exist:

**Required:**
- ✅ ADMIN_EMAIL
- ✅ ADMIN_PASSWORD
- ✅ DATABASE_URL (auto-set from database)
- ✅ SECRET_KEY (auto-generated)

**Optional (ignore for now):**
- ❌ REDIS_URL (not needed)
- ❌ SMTP_* (not needed yet)
- ❌ PADDLE_* (not needed yet)

### Check Database

1. Go to **Databases** in Render dashboard
2. Verify "license-keys-db" exists and is "Available"
3. If not, create it:
   - Click "New" → "PostgreSQL"
   - Name: license-keys-db
   - Plan: Free

## 🎯 Success = This Works

```
✅ https://stake-advisor.onrender.com/health → {"status":"ok"}
✅ https://stake-advisor.onrender.com/docs → API documentation loads
✅ https://sharkpokerclub.com → Frontend loads
```

## 📋 Current Status

Your frontend builds successfully ✅
Your backend needs environment variables ❌

## 💡 Pro Tip

After fixing, save your ADMIN_EMAIL and ADMIN_PASSWORD somewhere safe. You'll need them to:
- Access the admin panel: https://stake-advisor.onrender.com/admin
- Manage licenses and users

## ⏭️ After This Works

1. [ ] Enable HTTPS (see FIX_HTTPS_RENDER_GUIDE.md)
2. [ ] Submit sitemap to Google
3. [ ] Set up Google Analytics
4. [ ] Configure payments (Stripe/Paddle)
