# NFA Bears Dual-Path Architecture Plan

## Core Philosophy: Two Distinct User Journeys

The NFA Bears MVP serves two fundamentally different user types with distinct capabilities, onboarding flows, and dashboard experiences.

## User Types & Capabilities

### Genesis Holders (Tier 1)
- **Profile**: Existing Web3 users with external wallets (MetaMask, etc.)
- **Entry**: Already own Genesis NFT or mint one ($333 investment)
- **Capabilities**:
  - Generate venue-specific QR invite codes
  - Track invite metrics and community growth
  - Full POAT minting and collection management
  - Access to premium features and governance
  - Can create invite codes for SBT recipients

### SBT Recipients (Tier 2)  
- **Profile**: New users being onboarded to Web3
- **Entry**: Scan QR from Genesis holder → Privy wallet creation
- **Onboarding**: Complete payment ($10) OR tasks to earn SBT
- **Capabilities**:
  - Basic POAT minting and collection
  - Community participation (forums, events)
  - Limited features (no invite generation)
  - Upgrade path to Genesis holder available

## Technical Architecture

### Dashboard Conditional Logic
\`\`\`typescript
// Core logic for dashboard routing
const determineUserType = async (wallet: Address) => {
  const genesisBalance = await checkGenesisNFTBalance(wallet);
  const sbtBalance = await checkSBTBalance(wallet);
  
  if (genesisBalance > 0) return 'GENESIS_HOLDER';
  if (sbtBalance > 0) return 'SBT_HOLDER';
  return 'NEW_USER';
}
\`\`\`

### User Flow State Machine

\`\`\`
[Connect Wallet] 
    ↓
[Check NFT Holdings]
    ↓
    ├── Genesis NFT Found → [Genesis Dashboard]
    ├── SBT Found → [SBT Dashboard]  
    └── No NFTs → [Landing/Mint Options]

[Scan QR Code]
    ↓
[Privy Wallet Creation]
    ↓
[Onboarding Flow: Payment/Tasks]
    ↓
[SBT Minting]
    ↓
[Welcome Guide]
    ↓
[SBT Dashboard]
\`\`\`

## Implementation Plan

### Phase 1: Conditional Dashboard System
1. **Create user type detection hook**
   - `useUserType()` hook that checks wallet contents
   - Caches results to avoid repeated blockchain calls
   - Handles loading states and errors

2. **Implement dashboard routing**
   - Genesis Dashboard: `/dashboard/genesis`
   - SBT Dashboard: `/dashboard/sbt`
   - Landing: `/dashboard` (redirects based on user type)

3. **Build Genesis Dashboard features**
   - QR code generation interface
   - Invite tracking and metrics
   - Community management tools
   - POAT minting interface

4. **Build SBT Dashboard features**
   - Simplified interface focused on consumption
   - POAT collection display
   - Community participation tools
   - Upgrade prompts to Genesis

### Phase 2: SBT Onboarding Flow
1. **Enhanced invite redemption page**
   - Detect if user has wallet connected
   - If no wallet: Trigger Privy social login
   - If wallet connected: Check if eligible for SBT

2. **Payment/Task completion system**
   - Stripe integration for $10 payment
   - Alternative task completion system
   - Progress tracking and validation

3. **SBT minting integration**
   - Automatic SBT mint after payment/task completion
   - Transaction confirmation and success state
   - Error handling and retry mechanisms

4. **Welcome guide system**
   - Multi-step onboarding tutorial
   - Community introduction
   - Feature walkthrough
   - Profile setup assistance

### Phase 3: POAT System
1. **POAT smart contract deployment**
   - Event-specific NFT minting
   - Attendance verification system
   - Metadata management

2. **POAT minting interface**
   - QR code scanning for event check-ins
   - Location verification for events
   - Automatic POAT generation

3. **POAT collection management**
   - Display user's POAT collections
   - Event history and memories
   - Social sharing features

## File Structure Plan

\`\`\`
app/
├── dashboard/
│   ├── page.tsx (router based on user type)
│   ├── genesis/
│   │   ├── page.tsx (Genesis holder dashboard)
│   │   ├── invites/
│   │   ├── metrics/
│   │   └── community/
│   └── sbt/
│       ├── page.tsx (SBT holder dashboard)
│       ├── collect/
│       └── participate/
├── onboarding/
│   ├── payment/
│   ├── tasks/
│   └── welcome/
└── invite/
    └── [code]/
        ├── page.tsx (enhanced redemption)
        └── components/

hooks/
├── useUserType.ts
├── useGenesisNFT.ts
├── useSBT.ts
└── usePOAT.ts

components/
├── dashboard/
│   ├── GenesisDashboard.tsx
│   ├── SBTDashboard.tsx
│   └── UserTypeProvider.tsx
├── onboarding/
│   ├── PaymentFlow.tsx
│   ├── TaskFlow.tsx
│   └── WelcomeGuide.tsx
└── poat/
    ├── POATMinter.tsx
    └── POATCollection.tsx
\`\`\`

## Database Schema Updates

\`\`\`sql
-- User profiles with type tracking
CREATE TABLE user_profiles (
  wallet_address TEXT PRIMARY KEY,
  user_type ENUM('genesis', 'sbt', 'new') NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invite tracking with more metadata
CREATE TABLE invites (
  code TEXT PRIMARY KEY,
  creator_wallet TEXT NOT NULL,
  venue_id TEXT NOT NULL,
  redemptions INTEGER DEFAULT 0,
  max_redemptions INTEGER DEFAULT 1,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- POAT events and minting
CREATE TABLE poat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  venue_id TEXT NOT NULL,
  date DATE NOT NULL,
  metadata_uri TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE poat_mints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  event_id UUID REFERENCES poat_events(id),
  token_id INTEGER NOT NULL,
  minted_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## Smart Contract Updates

### Enhanced Membership Contract
- Add user type detection methods
- Implement upgradeability for SBT → Genesis
- POAT compatibility interfaces

### POAT Contract System
- Event-specific minting
- Batch operations for efficiency  
- Integration with venue location verification

## Success Metrics

### Genesis Holder Engagement
- Number of invites generated per user
- Invite conversion rates
- POAT minting frequency
- Community contribution metrics

### SBT Onboarding Success
- Conversion rate from QR scan to SBT mint
- Payment vs task completion rates
- Welcome guide completion rates
- Time to first POAT mint

## Security Considerations

### Sybil Resistance
- One SBT per Privy account maximum
- Device fingerprinting for duplicate detection
- Social verification for task completion
- Rate limiting on sensitive operations

### Economic Security  
- Payment processing fraud prevention
- Task completion verification
- Invite code abuse prevention
- POAT event attendance verification

## Deployment Strategy

### Phase 1 (Immediate)
- Deploy conditional dashboard system
- Test with existing Genesis holders
- Gather feedback on UX flow

### Phase 2 (Week 2)
- Launch SBT onboarding flow
- Enable payment processing
- Deploy welcome guide system

### Phase 3 (Week 3)
- Launch POAT system
- Enable full community features
- Open for broader community testing

This dual-path architecture ensures that both user types get an experience tailored to their needs and capabilities, while maintaining a clear upgrade path from SBT to Genesis holder.
