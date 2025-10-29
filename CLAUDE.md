# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the NFA Bears MVP codebase.

# 🚨 CRITICAL REFERENCE

## Environment Variables

**YOU MUST** ensure these environment variables are properly configured:

\`\`\`bash
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
\`\`\`

## Contract Addresses & Chain Info

- **Chain**: Berachain Bepolia Testnet (Chain ID: **80069**)
- **RPC**: https://bepolia.rpc.berachain.com/
- **Explorer**: https://bepolia.beratrail.io/
- **Membership Contract**: `0xF0e401E962f2C126A3E44a6708E0884De038E77b`
- **Genesis Contract**: TBD (not yet deployed)

## Development Commands

\`\`\`bash
# Essential daily commands
npm run dev              # Start development server (port 3001)
npm run build           # Build for production
npm run lint            # Lint and typecheck
npm run typecheck       # TypeScript validation

# Smart contract operations
npm run compile:contracts    # Compile Solidity contracts
npm run deploy:membership   # Deploy membership contract
npm run mint:demo          # Test minting workflow
\`\`\`

## Security Warnings

**🚨 NEVER MODIFY THESE WITHOUT EXPLICIT APPROVAL:**
- Environment variable handling in API routes (`app/api/*/route.ts`)
- HMAC signing logic in invite system (`lib/crypto-utils.ts`)
- Private key usage in minting relayer (`app/api/mint/route.ts`)
- Rate limiting configuration (`@upstash/ratelimit` instances)

## Agent Coordination (Colab MCP)

**Colab MCP** enables seamless coordination between Claude Code, Cursor, and Codex CLI with shared session context.

### How to Communicate Between Agents

**From Claude Code → Cursor:**
```
[CURSOR_REQUEST] action:browser_test priority:high id:test-001
Please test localhost:3000 homepage:
- Navigate and screenshot
- Verify wallet button visible
- Check console for errors
```

**From Cursor → Claude Code:**
```
[CLAUDE_REQUEST] action:code_review priority:medium id:review-001
Please review the new GPS verification logic in lib/gps-utils.ts
Focus on: security, performance, edge cases
```

**From Claude Code/Cursor → Codex:**
```
[CODEX_REQUEST] action:terminal_command priority:high id:cmd-001
Please run the following terminal commands:
- npm run build
- npm run lint
Report any errors or warnings
```

**From Codex → Claude Code/Cursor:**
```
[RESPONSE] id:cmd-001 status:completed
Build completed successfully
Lint found 2 warnings (see details)
```

### Search for Requests

**In Cursor:**
```javascript
// Find Claude Code's requests
search_logs("[CURSOR_REQUEST]")
// Find Codex's responses
search_logs("[RESPONSE]")
```

**In Claude Code:**
```javascript
// Find Cursor's requests
search_logs("[CLAUDE_REQUEST]")
// Find Codex's responses
search_logs("[RESPONSE]")
```

**In Codex:**
```javascript
// Find requests from any agent
search_logs("[CODEX_REQUEST]")
// Find all pending requests
search_logs("priority:high")
```

### Best Practices

- **Use clear prefixes**: `[CURSOR_REQUEST]`, `[CLAUDE_REQUEST]`, `[CODEX_REQUEST]`, `[RESPONSE]`
- **Include IDs**: For tracking request/response pairs
- **Set priority**: high/medium/low for task urgency
- **Be specific**: Clear action items, not vague descriptions
- **Don't use custom log files**: Write directly in session - Colab MCP auto-tracks
- **Check Codex status**: Use `codex_status` tool to see if Codex CLI is active

### Available Colab MCP Tools

- `list_sessions` - See all coding sessions
- `fetch_transcript` - Get full conversation history
- `summarize_session` - Quick session overview
- `search_logs(query)` - Find specific discussions/commands
- `codex_status` - Check Codex CLI activity (if using Codex)

### Configuration (Windows Paths)

**CRITICAL**: Colab MCP requires correct log paths in both `~/.cursor/mcp.json` and `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "colab-mcp": {
      "command": "python",
      "args": ["-m", "colab_mcp.main"],
      "env": {
        "CLAUDE_HOME": "C:\\Users\\natha\\.claude",
        "CURSOR_LOGS": "C:\\Users\\natha\\AppData\\Roaming\\Cursor\\logs",
        "TMPDIR": "C:\\Users\\natha\\AppData\\Local\\Temp"
      }
    }
  }
}
```

**Note**: The correct Cursor logs path is `AppData\Roaming\Cursor\logs`, NOT `.cursor-server\data\logs`

### Installation

- Ensure Python 3.10+ (`python --version`)
- Install: `pip install colab-mcp`
- Run installer: `colab-mcp-install` (use elevated shell on Windows)
- Restart both tools: fully quit and relaunch Cursor and Claude Code

### Troubleshooting

- Verify `CURSOR_LOGS` path: `C:\\Users\\natha\\AppData\\Roaming\\Cursor\\logs`
- Confirm install: `pip show colab-mcp`; fallback command: `python -m colab_mcp.main`
- Validate JSON in `~/.cursor/mcp.json` and `~/.claude/mcp.json`
- Restart tools after any config change
- Use `search_logs("[CURSOR_REQUEST]")` to confirm indexing

### See Also

- `AGENTS.md` → Colab MCP Setup and Usage (Expanded) for step-by-step guidance

### Common Coordination Patterns

**Browser Testing Request:**
```
[CURSOR_REQUEST] id:homepage-test priority:high
@Browser test localhost:3000
- Screenshot on load
- Click "Connect Wallet"
- Verify Privy modal appears
- Check console for Web3 errors
```

**Code Review Request:**
```
[CLAUDE_REQUEST] id:security-review priority:high
Review /api/mint/route.ts for:
- Private key exposure risks
- Rate limiting bypasses
- HMAC signature validation
- Input sanitization gaps
```

**Design Feedback Request:**
```
[CURSOR_REQUEST] id:ui-feedback priority:medium
@Browser compare localhost:3000/dashboard with Figma design
Focus on: spacing, colors, responsive breakpoints
Provide screenshot with annotations
```

**Three-Agent Workflow (Claude + Cursor + Codex):**
```
# Claude Code identifies work needed
[CODEX_REQUEST] id:build-check priority:high
Run full build and test suite:
- npm run build
- npm run typecheck
- npm run lint
Report all errors/warnings

# Codex executes and reports
[RESPONSE] id:build-check status:completed
Build: ✓ Success
Typecheck: ✗ 3 errors in components/Dashboard.tsx
Lint: ⚠️ 2 warnings

# Claude Code requests code review
[CURSOR_REQUEST] id:typecheck-fix priority:high
@Browser open components/Dashboard.tsx
Review the 3 type errors Codex found
Suggest fixes considering the design mockups

# Cursor provides visual context
[RESPONSE] id:typecheck-fix status:completed
[Browser screenshot + type error annotations]
Recommended fixes: [details]
```

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

\`\`\`typescript
// User type detection pattern (see lib/userTypeDetection.ts)
const userType = await detectUserType(address);
if (userType === 'genesis') {
  // Premium features enabled
} else if (userType === 'sbt') {
  // Standard member features
} else {
  // Unverified user flow
}
\`\`\`

## API Patterns & Examples

### Invite System (`/api/invite`)
\`\`\`typescript
// Generate invite (POST)
{ "venueId": "local-dev", "latitude": 37.7749, "longitude": -122.4194 }

// Verify invite (GET)
/api/invite/[code] → validates GPS + HMAC signature
\`\`\`

### Minting System (`/api/mint`)
\`\`\`typescript
// Mint SBT (POST)
{ "address": "0x...", "code": "invite_code" }
// → Validates code, checks existing membership, mints via relayer
\`\`\`

## Code Conventions

- **NO COMMENTS**: Code must be self-documenting unless complex algorithms
- **Security First**: Every user input validated, rate limited, cryptographically signed
- **Mobile-First**: PWA functionality, offline capability, touch-optimized UI
- **Environment Validation**: All critical env vars validated at module level

## Common Workflows

### Testing GPS System
\`\`\`bash
# Use Chrome DevTools > Sensors > Location to spoof coordinates
# Default test venue: SF (37.7749, -122.4194) with 100m radius
# Set DEV_SKIP_GPS=true to bypass for development
\`\`\`

### Smart Contract Deployment
\`\`\`bash
npm run compile:contracts
npm run deploy:membership
# Contract address automatically updates in .env
\`\`\`

### Debugging Invite Flow
\`\`\`javascript
// Check Redis invite storage
const inviteData = await redis.get(`invite:${code}`);
console.log('Invite data:', JSON.parse(inviteData));
\`\`\`

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

\`\`\`javascript
// GPS validation pattern
const distance = calculateHaversineDistance(userLat, userLon, venueLat, venueLon);
if (distance > venue.radius) throw new Error('Outside venue radius');
\`\`\`

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

**Mission**: Preserve Deadhead parking lot culture using Web3 tools for authentic IRL connections. Based on core cultural values: transparency, community joy, and cultural education. Community-driven, anti-speculation.

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
