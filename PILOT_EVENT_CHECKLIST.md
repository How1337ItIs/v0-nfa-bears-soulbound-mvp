# NFA Bears MVP - Pilot Event Deployment Checklist

## Pre-Event Setup (1-2 weeks before)

### Environment Variables
- [ ] `NEXT_PUBLIC_PRIVY_APP_ID` - Privy authentication app ID
- [ ] `NEXT_PUBLIC_CONTRACT_ADDRESS` - Deployed SBT contract address  
- [ ] `NEXT_PUBLIC_BEPOLIA_RPC` - Berachain RPC URL
- [ ] `REDIS_URL` & `REDIS_TOKEN` - Upstash Redis credentials
- [ ] `SECRET_KEY` - HMAC signing key for invite security
- [ ] `DEPLOYER_PRIVATE_KEY` - Gas relayer wallet private key
- [ ] `NEXT_PUBLIC_BASE_URL` - Production domain
- [ ] `DEV_SKIP_GPS=false` (remove for production GPS verification)

### Smart Contract Status
- [x] **Contract Deployed**: `0xF0e401E962f2C126A3E44a6708E0884De038E77b` on Berachain bepolia
- [x] **Contract Functions**: `mintMembership()` and `hasMinted()` available
- [ ] **Verify Relayer Wallet Balance**: Check if `0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4` has sufficient BERA
- [ ] **Test Contract Ownership**: Confirm relayer can mint SBTs
- [ ] **Environment Variable**: Set `NEXT_PUBLIC_CONTRACT_ADDRESS=0xF0e401E962f2C126A3E44a6708E0884De038E77b`
- [ ] **Deployer Private Key**: Set `DEPLOYER_PRIVATE_KEY` to relayer wallet key

### Infrastructure
- [ ] Deploy Next.js app to Vercel/production hosting
- [ ] Configure Upstash Redis production instance
- [ ] Set up domain and SSL certificates
- [ ] Test all API endpoints (`/api/invite`, `/api/mint`)
- [ ] Verify QR code generation works in production

### Venue Configuration
- [ ] Update `data/venues.json` with event venue coordinates
- [ ] Test GPS radius calculation with event location
- [ ] Set appropriate radius (recommended: 50-100 meters)
- [ ] Verify venue ID matches ambassador portal options

## Quick Test Commands

Before the event, run these to verify everything works:

```bash
# Check contract status
npx tsx scripts/sanity-check.ts

# Start development server
npm run dev

# Test the flow:
# 1. Visit /ambassador
# 2. Generate invite code
# 3. Scan QR with phone 
# 4. Complete authentication
# 5. Verify SBT mint in member dashboard
```

## Day of Event Setup (2-3 hours before)

### Ambassador Training
- [ ] Brief ambassadors on the 60-second onboarding flow
- [ ] Test ambassador portal on their devices (`/ambassador`)
- [ ] Ensure they can generate QR codes successfully
- [ ] Practice explaining "Miracle SBT" concept to newcomers
- [ ] Share backup contact (you) for technical issues

### Technical Checks
- [ ] **CRITICAL**: Test end-to-end flow at exact event location
- [ ] Generate invite → Scan → Complete authentication → Verify SBT mint
- [ ] Verify GPS works at exact event location (disable `DEV_SKIP_GPS`)
- [ ] Check mobile responsiveness on various devices
- [ ] Test QR code scanning under different lighting conditions
- [ ] Verify Privy authentication works on mobile browsers
- [ ] Confirm Berachain transactions confirm within 30 seconds

### Vendor Setup (if applicable)
- [ ] Set up vendor scanner stations
- [ ] Test membership verification with test SBT
- [ ] Brief vendors on discount verification process
- [ ] Ensure vendor devices can scan member QR codes

## During Event Monitoring

### Real-time Metrics
- [ ] Monitor Redis for active invite codes
- [ ] Watch for failed minting transactions
- [ ] Track successful SBT mints in real-time
- [ ] Monitor ambassador portal usage
- [ ] Check error rates in production logs

### Support
- [ ] Have technical contact available for troubleshooting
- [ ] Monitor Discord/social for user feedback
- [ ] Document any issues for post-event review
- [ ] Collect user feedback on onboarding experience

## Post-Event Analysis

### Data Collection
- [ ] Total invite codes generated
- [ ] Successful SBT mints completed
- [ ] Failed/abandoned onboarding attempts
- [ ] Average time from QR scan to SBT mint
- [ ] Most common error types

### Community Follow-up
- [ ] Send Discord invites to new members
- [ ] Share event POAT if implemented
- [ ] Gather feedback from ambassadors
- [ ] Document lessons learned for next event

## Emergency Procedures

### Common Issues & Solutions
- **GPS not working**: Check venue coordinates, consider temporary `DEV_SKIP_GPS=true`
- **Privy authentication failing**: Verify app ID, check mobile browser compatibility
- **Minting failures**: Check deployer wallet BERA balance, verify contract address
- **Redis connection issues**: Check Upstash status, verify environment variables
- **QR codes not generating**: Check ambassador internet connection, try different browser

### Rollback Plan
- [ ] Keep staging environment ready with same codebase
- [ ] Have backup venue coordinates prepared
- [ ] Maintain manual member list as fallback
- [ ] Prepare alternative onboarding method (email collection)

## Success Metrics

### Minimum Viable Success
- [ ] At least 10 successful SBT mints
- [ ] No major technical failures lasting >5 minutes
- [ ] Positive user feedback on experience
- [ ] Ambassadors can operate independently after brief training

### Stretch Goals
- [ ] 50+ successful onboardings
- [ ] <30 second average onboarding time
- [ ] Zero abandoned flows due to technical issues
- [ ] Vendor verification system working smoothly
- [ ] Strong community engagement post-event

## Technical Debt / Known Issues
- [ ] SSR QR code rendering (resolved)
- [ ] Member dashboard needs POAT integration
- [ ] Vendor reimbursement system not implemented
- [ ] Discord integration not automated
- [ ] No analytics dashboard for real-time monitoring

---

## Emergency Contacts
- **Technical Lead**: [Your contact]
- **Upstash Support**: [Redis provider]
- **Privy Support**: [Auth provider]
- **Berachain Discord**: [Network support]

**Remember**: This is about "real family shit" - prioritize human connection over perfect technology. A warm welcome matters more than a flawless technical experience.