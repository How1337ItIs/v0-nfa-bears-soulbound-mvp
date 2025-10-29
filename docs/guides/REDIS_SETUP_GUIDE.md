# Upstash Redis Setup Guide
**15-Minute Fix for NFA Bears MVP**

## 🎯 Why You Need This

Your invite generation and SBT minting system requires Redis to:
- Store invite codes temporarily (15min expiry)
- Track one-time use (prevent code reuse)
- Enable rate limiting (prevent abuse)
- Verify invite codes during redemption

**Without Redis**: Nothing works. With Redis: Everything works.

---

## ⚡ Quick Setup (15 minutes)

### Step 1: Create Upstash Account (3 minutes)

1. Go to https://upstash.com/
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with:
   - **GitHub** (fastest - one click)
   - **Google** (also fast)
   - **Email** (requires verification)

4. Verify your email if needed
5. You'll land on the Upstash console

### Step 2: Create Redis Database (2 minutes)

1. Click **"Create Database"** button
2. Fill in details:
   - **Name**: `nfa-bears-mvp` (or anything you want)
   - **Type**: Select **"Regional"** (faster, cheaper)
   - **Region**: Choose closest to your users:
     - **US East** (N. Virginia) - East Coast events
     - **US West** (Oregon) - West Coast events
     - **Europe** - EU events
   - **Primary Region**: Leave default
   - **Read Region**: Leave empty (not needed)

3. Click **"Create"**
4. Database creates in ~10 seconds

### Step 3: Get Your Credentials (1 minute)

Once database is created, you'll see the database dashboard.

1. Look for **"REST API"** section
2. Find two values:
   - **UPSTASH_REDIS_REST_URL**: Looks like `https://[something].upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: Long string of characters

3. Click the **"Copy"** button next to each one

**Screenshot for reference**:
```
┌─────────────────────────────────────┐
│ REST API                            │
├─────────────────────────────────────┤
│ UPSTASH_REDIS_REST_URL              │
│ https://us1-smart-bear-12345.      │
│ upstash.io              [Copy]     │
│                                     │
│ UPSTASH_REDIS_REST_TOKEN           │
│ AXjaK3jKa3jkJAKJD...    [Copy]     │
└─────────────────────────────────────┘
```

### Step 4: Add to Your .env File (2 minutes)

1. Open your `.env` file in the `nfa-bears-mvp` folder
2. Find these lines (they might be empty or have placeholder values):
   ```bash
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   ```

3. **Paste your values**:
   ```bash
   UPSTASH_REDIS_REST_URL=https://us1-smart-bear-12345.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXjaK3jKa3jkJAKJDjkajdkajdkjakdjKAJD
   ```

4. **Save the file**

**Important**: Make sure there are NO SPACES around the `=` sign!
```bash
# ✅ CORRECT
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io

# ❌ WRONG (spaces will break it)
UPSTASH_REDIS_REST_URL = https://your-url.upstash.io
```

### Step 5: Restart Dev Server (1 minute)

1. Go to your terminal where `npm run dev` is running
2. Press `Ctrl+C` to stop the server
3. Run `npm run dev` again
4. Server will load the new Redis configuration

**Alternative**: If using background process, just restart it

### Step 6: Test It Works (5 minutes)

Open a new terminal and run:

```bash
cd nfa-bears-mvp

# Test invite generation
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId": "local-dev", "latitude": 37.7749, "longitude": -122.4194}'
```

**Expected SUCCESS response**:
```json
{
  "code": "local-dev:1730049847:a3f8c9d2e4b7:9a8b",
  "qrCodeDataUrl": "data:image/png;base64,...",
  "expiresAt": 1730050747000,
  "venue": {
    "id": "local-dev",
    "name": "Local Development Venue"
  }
}
```

**If you see this**: ✅ **REDIS IS WORKING!** You're unblocked!

**If you get error**: Check:
- Is the URL correct? (should start with `https://`)
- Is the token correct? (no extra spaces)
- Did you restart the dev server?
- Try creating a new Redis database

---

## 🔧 Alternative: Use Different Redis Provider

If Upstash isn't working, you have options:

### Option 1: Redis Labs (Similar to Upstash)
1. Go to https://redis.com/try-free/
2. Create free account
3. Get REST API credentials
4. Same setup process

### Option 2: Local Redis (Development Only)
**Not recommended for production, but works for testing**:

```bash
# Install Redis locally
# Windows: Use Docker
docker run -d -p 6379:6379 redis

# Mac/Linux: Use Homebrew
brew install redis
redis-server

# Update .env
UPSTASH_REDIS_REST_URL=http://localhost:6379
UPSTASH_REDIS_REST_TOKEN=local-dev-token
```

**Note**: Local Redis won't work for production deployment!

---

## 🎯 After Redis Is Configured

Once Redis is working, you can:

1. **Test invite generation**
   - Open `/ambassador` page
   - Generate QR codes
   - Verify they expire after 15 minutes

2. **Test minting flow**
   - Scan invite QR code
   - Complete Privy auth
   - Verify SBT mints successfully

3. **Deploy to production**
   - Add same Redis creds to Vercel/hosting
   - Deploy Next.js app
   - Test on production URL

---

## 📞 Need Help?

### Upstash Support
- **Docs**: https://upstash.com/docs/redis
- **Discord**: https://discord.gg/upstash
- **Status**: https://status.upstash.com/

### Common Issues
- **"Database creation failed"**: Try different region
- **"Invalid credentials"**: Re-copy from dashboard, check for spaces
- **"Connection timeout"**: Check your internet connection
- **"401 Unauthorized"**: Token is wrong or expired

---

## ✅ Checklist

- [ ] Created Upstash account
- [ ] Created Redis database
- [ ] Copied UPSTASH_REDIS_REST_URL
- [ ] Copied UPSTASH_REDIS_REST_TOKEN
- [ ] Added both to `.env` file
- [ ] No spaces around `=` signs
- [ ] Saved `.env` file
- [ ] Restarted dev server
- [ ] Tested with curl command
- [ ] Got successful JSON response
- [ ] **UNBLOCKED!** 🎉

---

**Estimated Total Time**: 10-15 minutes
**Difficulty**: Easy (mostly copy-paste)
**Impact**: Unlocks entire application

Once this is done, you're 100% ready for pilot event testing! 🐻
