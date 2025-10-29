# NFA Bears MVP - Vercel Deployment Guide
**From Local to Production in 30 Minutes**

## 🎯 Prerequisites

Before deploying, ensure:
- ✅ Production build passes (`npm run build`)
- ✅ All environment variables documented
- ✅ Upstash Redis configured and tested
- ✅ Relayer wallet funded (>0.1 BERA)
- ✅ Smart contract deployed on Berachain Bepolia
- ✅ Privy app configured for production domain

---

## 🚀 Vercel Deployment (Recommended)

### Why Vercel?
- Built for Next.js (zero config)
- Edge functions for API routes
- Automatic HTTPS
- Preview deployments for testing
- Free tier sufficient for pilot event

### Step 1: Push to GitHub (5 minutes)

```bash
cd nfa-bears-mvp

# If not already pushed:
git remote add origin https://github.com/YOUR_USERNAME/nfa-bears-mvp.git
git push -u origin main
```

### Step 2: Connect to Vercel (3 minutes)

1. Go to https://vercel.com/
2. Sign up with GitHub account
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. Vercel auto-detects Next.js configuration

### Step 3: Configure Environment Variables (10 minutes)

In Vercel project settings → Environment Variables, add ALL of these:

#### Required (CRITICAL)
```bash
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=cma5v396b00ublb0m4h2qkrvh

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0xF0e401E962f2C126A3E44a6708E0884De038E77b
NEXT_PUBLIC_BEPOLIA_RPC=https://bepolia.rpc.berachain.com
NEXT_PUBLIC_GENESIS_BEARS_CONTRACT=[when deployed]

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://together-walleye-23740.upstash.io
UPSTASH_REDIS_REST_TOKEN=[your-token-here]
REDIS_URL=[same as above]
REDIS_TOKEN=[same as TOKEN above]

# Security (NEVER EXPOSE THESE)
DEPLOYER_PRIVATE_KEY=0x[your-64-char-private-key]
SECRET_KEY=[your-secret-key]
INVITE_SECRET_KEY=[your-invite-secret]

# Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEV_SKIP_GPS=false  # CRITICAL: Must be false for production!
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=[if using]
```

**IMPORTANT**:
- Set all as **"Production"** environment
- Also set for **"Preview"** if testing
- **Never** commit these to Git!

### Step 4: Configure Privy for Production Domain (5 minutes)

1. Go to https://dashboard.privy.io/
2. Select your app
3. **Settings** → **Allowed domains**
4. Add your Vercel deployment URLs:
   - `https://your-app.vercel.app`
   - `https://your-app-*.vercel.app` (for preview deploys)
5. Save changes

### Step 5: Deploy! (2 minutes)

1. Click **"Deploy"** in Vercel dashboard
2. Wait for build to complete (~3-5 minutes)
3. Vercel shows **"Production"** URL
4. Click to view your live app!

---

## ✅ Post-Deployment Verification

### Test Checklist

Once deployed, test these critical flows:

#### 1. Homepage Loads
```bash
curl https://your-app.vercel.app
# Should return HTML with "NFA Bears"
```

#### 2. Ambassador Portal Works
- Open `https://your-app.vercel.app/ambassador`
- Should see venue selector
- Generate test invite
- QR code should appear

#### 3. Invite API Functional
```bash
curl -X POST https://your-app.vercel.app/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}'
```
Should return JSON with QR code data

#### 4. Privy Authentication
- Click "Connect & Enter"
- Privy modal should appear
- Sign in with email
- Should redirect to dashboard

#### 5. Member Dashboard
- After login, should see dashboard
- Wallet address displayed
- User profile accessible

---

## 🌐 Custom Domain Setup (Optional)

### Using Your Own Domain

1. In Vercel project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `nfabears.xyz` (or your domain)
4. Vercel provides DNS records
5. Add records to your domain registrar
6. Wait for DNS propagation (~10-30 min)
7. HTTPS certificate auto-generated

### Update Environment Variables
```bash
# After custom domain is active:
NEXT_PUBLIC_APP_URL=https://nfabears.xyz
```

### Update Privy Allowed Domains
- Add `https://nfabears.xyz` to Privy dashboard

---

## 🔧 Production vs Development Differences

### Environment Variables to Change

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_DEV_SKIP_GPS` | `true` | `false` ⚠️ |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | `https://your-app.vercel.app` |
| `NODE_ENV` | `development` | `production` |

### Features That Change Behavior

**GPS Verification**:
- Dev: Skipped when `DEV_SKIP_GPS=true`
- Prod: **Always enforced** for Sybil resistance

**Console Logs**:
- Dev: All logs visible
- Prod: Removed by Next.js compiler

**Error Messages**:
- Dev: Full stack traces
- Prod: User-friendly messages

---

## 📊 Monitoring Production

### Vercel Analytics (Free)

Already integrated via `@vercel/analytics`:
- View in Vercel dashboard → Analytics
- Page views
- Performance metrics
- Error tracking

### Custom Monitoring

**Relayer Wallet Balance**:
```bash
# Check daily
curl -X POST https://bepolia.rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4","latest"],"id":1}'
```

**Redis Usage**:
- Check Upstash dashboard
- Monitor invite code storage
- Watch rate limit hits

**Transaction History**:
- https://bepolia.beratrail.io/address/0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4
- Monitor successful mints
- Check gas usage

---

## 🐛 Troubleshooting Production Issues

### "Invite generation fails"
**Check**:
- Redis credentials correct in Vercel env vars
- Upstash database is active (not paused/deleted)
- Rate limiting not hit

**Fix**:
```bash
# Test Redis connection from Vercel
# Add this to /api/test route temporarily
const redis = require('@upstash/redis');
const client = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});
await client.ping(); // Should return "PONG"
```

### "Privy authentication not working"
**Check**:
- Privy app ID correct
- Production domain added to Privy allowed domains
- Browser doesn't block cookies/popups

**Fix**:
- Verify domain in Privy dashboard
- Test in incognito mode (clear cache)
- Check browser console for errors

### "SBT minting fails"
**Check**:
- Relayer wallet has BERA
- Contract address correct
- RPC URL working
- Private key correct (check first 6 chars: `0x[6 chars]...`)

**Fix**:
```bash
# Test contract from Node:
const { createPublicClient, http } = require('viem');
const client = createPublicClient({
  chain: {id: 80069, ...},
  transport: http('https://bepolia.rpc.berachain.com')
});
// Test read
await client.readContract({
  address: '0xF0e401E962f2C126A3E44a6708E0884De038E77b',
  abi: [...],
  functionName: 'hasMinted',
  args: ['0xTEST_ADDRESS']
});
```

### "GPS verification always fails"
**Check**:
- `DEV_SKIP_GPS` is `false` in production
- Venue coordinates correct in `data/venues.json`
- Radius appropriate (100m recommended)
- User granted location permissions

**Fix**:
- Test at actual venue
- Increase radius if needed
- Check browser location permissions

---

## 🔄 Deployment Workflow

### For Updates After Initial Deploy

```bash
# 1. Make changes locally
git add -A
git commit -m "feat: add new feature"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploys!
# Check deployment progress at vercel.com
```

### Preview Deployments

Every git branch gets its own preview URL:

```bash
# Create feature branch
git checkout -b feature/new-dashboard
git push origin feature/new-dashboard

# Vercel creates: https://your-app-git-feature-new-dashboard.vercel.app
# Test safely without affecting production
```

---

## 📅 Pre-Event Deployment Timeline

### 1 Week Before Event
- [ ] Deploy to Vercel staging
- [ ] Test all flows on staging URL
- [ ] Invite beta testers to try it
- [ ] Fix any bugs found

### 3 Days Before Event
- [ ] Update `data/venues.json` with REAL event coordinates
- [ ] Deploy to production
- [ ] Test GPS verification at venue (if possible)
- [ ] Train ambassadors on production URL

### Day Before Event
- [ ] Verify relayer has >0.2 BERA
- [ ] Check all environment variables
- [ ] Run pre-flight script
- [ ] Test end-to-end flow at venue
- [ ] Brief ambassadors

### Event Day
- [ ] Ambassadors test 1 hour before
- [ ] Monitor Vercel analytics
- [ ] Watch for errors in realtime
- [ ] Have tech support ready

---

## 🎯 Production Readiness Checklist

### Environment
- [ ] All 16 environment variables set in Vercel
- [ ] `DEV_SKIP_GPS=false` for production
- [ ] Production domain added to Privy
- [ ] Redis database active in Upstash

### Smart Contracts
- [ ] Miracle SBT contract deployed: 0xF0e401E962f2C126A3E44a6708E0884De038E77b
- [ ] Relayer wallet funded: >0.1 BERA
- [ ] Contract ABI matches code
- [ ] Network is Berachain Bepolia (Chain ID: 80069)

### Testing
- [ ] Production build passes (`npm run build`)
- [ ] All API routes respond (200 status)
- [ ] Privy authentication works
- [ ] QR codes generate successfully
- [ ] Member dashboard loads
- [ ] Vendor verification functional

### Documentation
- [ ] Ambassadors trained (AMBASSADOR_TRAINING.md)
- [ ] Mobile testing complete (MOBILE_TESTING_GUIDE.md)
- [ ] Emergency contacts documented
- [ ] Rollback plan prepared

---

## 🆘 Emergency Procedures

### If Production Goes Down

1. **Check Vercel Status**
   - https://www.vercel-status.com/
   - May be platform-wide issue

2. **Rollback to Previous Deploy**
   - Vercel dashboard → Deployments
   - Click previous working deployment
   - "Promote to Production"

3. **Use Staging URL Temporarily**
   - Switch ambassadors to staging URL
   - Less ideal but keeps event running

4. **Manual Fallback**
   - Collect emails manually
   - Send invite links post-event
   - Apologize, offer extra perks

### If Redis Fails

- Check Upstash status
- Create new Redis database
- Update environment variables
- Redeploy

### If Relayer Runs Out of BERA

- Send more BERA to relayer wallet
- Pause onboarding until funded
- Use backup relayer wallet (if configured)

---

## 📈 Post-Event Deployment

### After Successful Pilot

1. **Collect Data**
   - Check Vercel analytics
   - Query Redis for metrics
   - Review transaction history
   - Survey ambassadors and members

2. **Deploy Improvements**
   - Fix bugs found during event
   - Add requested features
   - Optimize based on real usage

3. **Scale for Next Event**
   - Upgrade hosting if needed
   - Add more venues to `data/venues.json`
   - Train more ambassadors
   - Refine onboarding flow

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Privy Dashboard**: https://dashboard.privy.io/
- **Upstash Dashboard**: https://console.upstash.com/
- **Berachain Explorer**: https://bepolia.beratrail.io/
- **Next.js Deployment Docs**: https://nextjs.org/docs/app/building-your-application/deploying

---

## 🎉 Launch Checklist

**30 minutes before going live:**

```bash
# 1. Final pre-flight check
cd nfa-bears-mvp
node scripts/pre-flight-check.js

# 2. Commit latest changes
git add -A
git commit -m "Production ready for pilot event"
git push origin main

# 3. Wait for Vercel deploy (~3 min)
# 4. Test production URL
curl https://your-app.vercel.app

# 5. Generate test invite on production
# Visit: https://your-app.vercel.app/ambassador

# 6. Verify with ambassadors
# Share production URL
# Test on their phones

# 7. GO LIVE! 🚀
```

---

**Remember**: "Fuck crypto, real family shit"

The tech is just the tool. Focus on **welcoming people**, **building community**, and **keeping the parking lot spirit alive**.

Make every Miracle count. 🐻✨

---

**Last Updated**: 2025-10-28
**Deployment Platform**: Vercel
**Production URL**: [Set after deployment]
**Staging URL**: [Set after first preview]
