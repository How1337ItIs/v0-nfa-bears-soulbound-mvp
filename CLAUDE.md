# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the NFA Bears MVP codebase.

# 🚨 CRITICAL REFERENCE

## Environment Variables

**YOU MUST** ensure these environment variables are properly configured:

```bash
# SECURITY CRITICAL - Never expose or log these
DEPLOYER_PRIVATE_KEY=0x[64_char_hex_private_key]
SECRET_KEY=[64_char_random_string_for_hmac]

# Contract Addresses  
NEXT_PUBLIC_CONTRACT_ADDRESS=0xF0e401E962f2C126A3E44a6708E0884De038E77b

# Blockchain & Auth
NEXT_PUBLIC_BEPOLIA_RPC=https://bepolia.rpc.berachain.com/
NEXT_PUBLIC_PRIVY_APP_ID=[privy_app_id]

# Database
REDIS_URL=[upstash_redis_url]
REDIS_TOKEN=[upstash_redis_token]

# Development (set to 'true' to bypass GPS verification)
DEV_SKIP_GPS=false
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

## Contract Addresses & Chain Info

- **Chain**: Berachain Bepolia Testnet (Chain ID: **80069**)
- **RPC**: https://bepolia.rpc.berachain.com/
- **Explorer**: https://bepolia.beratrail.io/
- **Membership Contract**: `0xF0e401E962f2C126A3E44a6708E0884De038E77b`
- **Genesis Contract**: TBD (not yet deployed)

## Development Commands

```bash
# Essential daily commands
npm run dev              # Start development server (port 3001)
npm run build           # Build for production
npm run lint            # Lint and typecheck
npm run typecheck       # TypeScript validation

# Smart contract operations
npm run compile:contracts    # Compile Solidity contracts
npm run deploy:membership   # Deploy membership contract
npm run mint:demo          # Test minting workflow
```

## Security Warnings

**🚨 NEVER MODIFY THESE WITHOUT EXPLICIT APPROVAL:**
- Environment variable handling in API routes (`app/api/*/route.ts`)
- HMAC signing logic in invite system (`lib/crypto-utils.ts`)
- Private key usage in minting relayer (`app/api/mint/route.ts`)
- Rate limiting configuration (`@upstash/ratelimit` instances)

# ⚡ DAILY DEVELOPMENT

## Tech Stack & Architecture

- **Framework**: Next.js 15 with App Router, TypeScript, React 18
- **Styling**: Tailwind CSS with custom glassmorphic components
- **Web3**: Privy (auth) + wagmi v2 + viem v2 (blockchain interactions)
- **Blockchain**: Berachain Bepolia testnet only
- **Database**: Upstash Redis (invite codes, rate limiting)
- **PWA**: Full mobile app capabilities with service worker

## User Type Logic

**CRITICAL BUSINESS LOGIC** - User hierarchy affects all feature access:

1. **Genesis Holders**: Own Genesis Bears NFTs → 20% discounts, DAO voting, can miracle others
2. **SBT Members**: Own Miracle SBT → 10% discounts, community access  
3. **Unverified Users**: No NFTs → Must donate $10 OR complete tasks to access features

```typescript
// User type detection pattern (see lib/userTypeDetection.ts)
const userType = await detectUserType(address);
if (userType === 'genesis') {
  // Premium features enabled
} else if (userType === 'sbt') {
  // Standard member features
} else {
  // Unverified user flow
}
```

## API Patterns & Examples

### Invite System (`/api/invite`)
```typescript
// Generate invite (POST)
{ "venueId": "local-dev", "latitude": 37.7749, "longitude": -122.4194 }

// Verify invite (GET)
/api/invite/[code] → validates GPS + HMAC signature
```

### Minting System (`/api/mint`)
```typescript
// Mint SBT (POST)
{ "address": "0x...", "code": "invite_code" }
// → Validates code, checks existing membership, mints via relayer
```

## Code Conventions

- **NO COMMENTS**: Code must be self-documenting unless complex algorithms
- **Security First**: Every user input validated, rate limited, cryptographically signed
- **Mobile-First**: PWA functionality, offline capability, touch-optimized UI
- **Environment Validation**: All critical env vars validated at module level

## Common Workflows

### Testing GPS System
```bash
# Use Chrome DevTools > Sensors > Location to spoof coordinates
# Default test venue: SF (37.7749, -122.4194) with 100m radius
# Set DEV_SKIP_GPS=true to bypass for development
```

### Smart Contract Deployment
```bash
npm run compile:contracts
npm run deploy:membership
# Contract address automatically updates in .env
```

### Debugging Invite Flow
```javascript
// Check Redis invite storage
const inviteData = await redis.get(`invite:${code}`);
console.log('Invite data:', JSON.parse(inviteData));
```

# 📚 CONTEXTUAL KNOWLEDGE

## Business Logic Summary

**Revenue Model**: 
- Genesis Bears (710 NFTs @ $333 each) = ~$236K treasury
- Miracle SBTs (free, GPS-verified, community growth)
- Vendor discount system (10-20% based on membership tier)

**"60-Second Miracle" Flow**:
1. Ambassador generates GPS-locked QR code (15min expiry)
2. User scans → GPS verification within 100m radius
3. Privy login (email/social → embedded wallet creation)
4. Gasless SBT minting via relayer wallet
5. Community access granted

## GPS Verification System

- **Algorithm**: Haversine formula for distance calculation
- **Radius**: Configurable per venue (50-100m typical)
- **Security**: HMAC-signed invite codes with timestamp
- **Venues**: Configured in `data/venues.json`

```javascript
// GPS validation pattern
const distance = calculateHaversineDistance(userLat, userLon, venueLat, venueLon);
if (distance > venue.radius) throw new Error('Outside venue radius');
```

## Rate Limiting & Redis

- **Upstash Redis**: Invite storage, rate limiting, session management
- **Rate Limits**: 5 requests/minute on `/api/invite`, 3 requests/minute on `/api/mint`
- **Data Structure**: `invite:${code}` → `{timestamp, venueId}`
- **TTL**: 15 minutes for invite codes

## Testing Approach

- **Local Development**: Use `local-dev` venue with SF coordinates
- **GPS Testing**: Chrome DevTools Sensors panel for location spoofing
- **Contract Testing**: Hardhat local network before Bepolia deployment
- **Redis Testing**: `scripts/test-redis.js` for connection verification

# 🎯 PROJECT CONTEXT

## Cultural Foundation

**Mission**: Preserve Deadhead parking lot culture using Web3 tools for authentic IRL connections. Based on "Pill Triad" philosophy: Clear (transparency), Rave (joy), Light (insight). Community-driven, anti-speculation.

## Current Issues & TODOs

**Known Issues**:
- Some mock data in dashboard components (needs real blockchain data)
- Genesis Bears contract not yet deployed
- POAT (Proof of Attendance) system incomplete
- Vendor discount tracking needs implementation

**Development Priorities**:
1. Complete Genesis Bears minting functionality  
2. Implement POAT event attendance tracking
3. Build vendor discount verification system
4. Add comprehensive test suite

---

**This is a cultural preservation project using technology to keep authentic community spirit alive. Every technical decision should honor this mission.**