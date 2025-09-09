# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview: NFA Bears MVP

**Cultural Foundation**: "Fuck crypto, real family shit" - A Grateful Dead-inspired Web3 community that prioritizes authentic human connection over speculation. Triple entendre: Non-Fungible Acid Bears | Not Fade Away | Not Financial Advice.

**Core Philosophy**: Based on the "Pill Triad" - Clear (radical transparency), Rave (collective joy), Light (transformative insight). Follows Jerry Garcia's wisdom: "You don't want to be the king" - no centralized control, community-driven governance.

**Mission**: Preserve and evolve Deadhead parking lot culture using blockchain tools to facilitate genuine IRL connections, support underground vendors, and keep the music playing in intimate venues.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Smart contract operations
npm run compile:contracts
npm run deploy:membership
npm run mint:demo
```

## Membership Architecture (Dual-Token System)

### Current Implementation: Miracle SBTs
- **Contract**: `contracts/NFABearsMembership.sol` (ERC-721 with transfer blocking)
- **Distribution**: In-person only via GPS-verified QR codes
- **Purpose**: Free membership for grassroots onboarding
- **Benefits**: Community access, vendor discounts (~10%), POAT collection
- **Verification**: Non-transferable, one per wallet, 30-day activation window

### Missing: Genesis Bears (710 NFTs @ $333)
- **Purpose**: Founding members with governance votes and premium benefits
- **Governance**: 1 NFT = 1 DAO vote for treasury, events, partnerships
- **Benefits**: ~20% vendor discounts, free event access, art evolution perks
- **Revenue**: ~$236K treasury funding live events (28%), development (19%), artists (14%)

## Technical Architecture

### "60-Second Miracle" Flow
1. **Ambassador** (`/ambassador`): Generates geo-fenced QR codes (15min TTL)
2. **GPS Validation** (`/invite/[code]`): Haversine formula verifies venue proximity  
3. **Privy Integration**: Email/wallet login, no seed phrases required
4. **SBT Minting**: Gas-subsidized NFT minting via relayer
5. **Community Integration**: Discord access, buddy pairing, welcome guide

### Security & Sybil Resistance
- **GPS Verification**: 100m venue radius with Haversine distance calculation
- **HMAC Signatures**: Time-stamped invite codes with cryptographic validation
- **Rate Limiting**: 5 requests/minute via Upstash Redis
- **Device Fingerprinting**: Prevent bulk claiming (not yet implemented)
- **One-Time Codes**: Redis TTL ensures single-use with 15-minute expiry

### Backend Infrastructure  
- **Redis**: Invite storage, rate limiting, session management
- **API Routes**: `/api/invite` (POST/GET), `/api/mint` (SBT creation)
- **Vendor System**: QR scanning for membership verification (`/vendor`)
- **PWA Support**: Offline capability, mobile-optimized experience

## Venue System (`data/venues.json`)

Three configured venues with GPS coordinates and radius:
- **local-dev**: SF coordinates (37.7749, -122.4194), 100m radius for testing
- **berkeley-art-museum**: Real venue with 50m radius  
- **sf-moma**: Production venue with 75m radius

**Development**: Set `DEV_SKIP_GPS=true` to bypass location verification

## Environment Configuration

Required `.env` variables:
- `NEXT_PUBLIC_PRIVY_APP_ID`: Web3 authentication
- `REDIS_URL`, `REDIS_TOKEN`: Upstash Redis for invite storage
- `SECRET_KEY`: HMAC signing for invite security  
- `DEV_SKIP_GPS`: Development GPS bypass flag
- `NEXT_PUBLIC_BASE_URL`: Invite URL generation

## Web3 Integration (Berachain Focus)

- **Network**: Berachain bepolia testnet (chainId: 80069)
- **Privy + Wagmi**: Seamless wallet creation and blockchain interaction
- **Target Features**: Proof-of-Liquidity yield farming, BGT governance tokens
- **Gas Subsidization**: Relayer covers transaction costs for user onboarding

## Missing Critical Components

### Economics Infrastructure
- **Treasury Management**: Multi-sig, DAO governance, PoL integration
- **POAT System**: Event attendance NFTs with IPFS metadata  
- **Vendor Marketplace**: Discount verification, reimbursement automation
- **Credit System**: Referral rewards staking toward BGT yield

### Community Features  
- **Discord Integration**: Role assignment, buddy pairing, moderation
- **Deadhead Chatbot**: Archive.org integration, crowd-sourced lore verification
- **Regional Chapters**: Decentralized event organization framework

## Development Priorities

### Immediate (Current MVP Issues)
1. **Complete Authentication**: Finish Privy flow in `/invite/[code]` redemption
2. **Fix SSR Bug**: Resolve HTMLElement hydration issues in QR generation  
3. **SBT Minting**: Connect successful verification to actual NFT creation
4. **Genesis Contracts**: Implement ERC-721A with UUPS upgradeability

### Medium-Term (Q3-Q4 2025 Roadmap)
1. **Vendor Pilot**: 10 vendors with discount verification system
2. **Event Infrastructure**: Small venue shows, POAT distribution
3. **Community Tools**: Discord bot, onboarding automation
4. **Economic Foundation**: Treasury deployment, PoL integration

## Code Conventions & Culture

- **No Comments**: Code should be self-documenting unless complex algorithms
- **Security First**: Every user input validated, rate limited, cryptographically signed
- **Mobile-First**: PWA functionality, offline capability, touch-optimized UI
- **Community Values**: All features must serve authentic human connection over metrics

## Known Issues

- **SSR Bug**: HTMLElement used client-side in QR generation components  
- **Incomplete Flow**: Invite redemption stops at verification, missing SBT mint
- **Missing Contracts**: No Genesis NFT, POAT, or treasury management deployed
- **Vendor Integration**: Scanner works but no discount/reimbursement backend

## Testing Strategy

- **GPS Testing**: Chrome DevTools Sensors panel for location spoofing
- **Local Development**: Use `local-dev` venue with SF coordinates
- **Redis Testing**: `test-redis.js` script for connection verification  
- **Smart Contracts**: Hardhat local network before bepolia deployment

This is not just a Web3 project - it's a cultural preservation effort using technology to keep the Deadhead community spirit alive for future generations. Every technical decision should honor that mission.