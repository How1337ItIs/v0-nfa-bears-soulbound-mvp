# NFA Bears MVP - Mobile Testing Guide
**For Pilot Event Preparation**

## 🎯 Why This Matters

The 60-Second Miracle happens on **mobile phones in parking lots**. Not laptops in offices. This guide ensures the experience works in real-world chaos:
- Bright sunlight (can't see screen)
- Spotty wifi (3G/4G only)
- Various devices (old iPhones, Android phones)
- Dust, rain, sweat (phone barely working)
- Loud music (can't hear)
- Distracted users (vibing to music)

**If it doesn't work flawlessly on mobile, the pilot event fails.**

---

## 📱 Critical Mobile Flows to Test

### Flow 1: Ambassador Generating Invite (30 seconds)
**Device**: Ambassador's phone (iOS/Android)
**Location**: Event location with GPS enabled

1. Open `http://your-domain.com/ambassador`
2. Select venue from dropdown
3. Tap "Generate Invite" button
4. QR code appears within 2 seconds
5. QR code is LARGE and scannable in bright sunlight
6. 15-minute countdown starts
7. Can share QR via screenshot/link

**Pass Criteria**:
- ✅ QR code visible in direct sunlight
- ✅ Touch targets minimum 44px (Apple guideline)
- ✅ Loads in <3 seconds on 4G
- ✅ Works on iOS Safari AND Android Chrome
- ✅ GPS permissions request appears properly

### Flow 2: New Member Scanning & Onboarding (60 seconds)
**Device**: New member's phone (various models)
**Location**: Event location, first-time user

1. Scan QR code with phone camera
2. Browser opens invite URL
3. Privy login modal appears
4. Enter email address
5. Verify email (check phone/email)
6. Embedded wallet created
7. SBT mints automatically
8. "Welcome!" message appears
9. Discord invite link shown

**Pass Criteria**:
- ✅ Total time <60 seconds
- ✅ Works without installing any apps
- ✅ Privy modal renders on mobile browsers
- ✅ Email verification works on phone
- ✅ Success message is CLEAR and exciting
- ✅ Works on spotty wifi/4G

### Flow 3: Member Showing Discount QR (10 seconds)
**Device**: Member's phone
**Location**: Vendor booth/table

1. Open `http://your-domain.com/member`
2. QR code with wallet address appears
3. Tap to make fullscreen
4. Vendor scans code

**Pass Criteria**:
- ✅ QR code renders LARGE (minimum 200x200px)
- ✅ High contrast (works in bright sun AND dark venues)
- ✅ Page loads instantly (<1 second)
- ✅ Works offline (PWA caching)
- ✅ Fullscreen mode available

### Flow 4: Vendor Scanning & Verifying (15 seconds)
**Device**: Vendor's phone/tablet
**Location**: Vendor booth with internet

1. Open `http://your-domain.com/vendor`
2. Camera permission granted
3. Point at member's QR code
4. Address extracted
5. Smart contract verification
6. Green checkmark OR red X
7. Discount amount shown (10% or 20%)

**Pass Criteria**:
- ✅ Camera works on iOS AND Android
- ✅ QR scanner works in various lighting
- ✅ Verification completes in <3 seconds
- ✅ Clear visual feedback (big ✓ or ✗)
- ✅ Offline mode shows cached results

---

## 🧪 Testing Checklist

### Device Coverage
Test on MINIMUM 3 devices:
- [ ] **iPhone** (iOS Safari) - Latest iOS
- [ ] **Old iPhone** (iOS 14+) - Test backward compatibility
- [ ] **Android** (Chrome) - Latest Android
- [ ] **Budget Android** - Test on lower-end device

### Network Conditions
Test on ALL connection types:
- [ ] **WiFi** - Fast, stable
- [ ] **4G/LTE** - Moderate speed
- [ ] **3G** - Slow, realistic
- [ ] **Spotty** - Toggle airplane mode during flow
- [ ] **Offline** - PWA functionality

### Lighting Conditions
Test QR codes in:
- [ ] **Bright sunlight** - Hardest to read screens
- [ ] **Indoor lighting** - Normal conditions
- [ ] **Dark venue** - Concert/nighttime
- [ ] **Dusk** - Transitional lighting

### Browser Compatibility
- [ ] **iOS Safari** (majority of iPhone users)
- [ ] **iOS Chrome** (uses Safari engine)
- [ ] **Android Chrome** (most Android users)
- [ ] **Android Firefox** (alternative browser)
- [ ] **Samsung Internet** (pre-installed on Samsung)

### Permissions Testing
- [ ] **Location permissions** - Ambassador needs GPS
- [ ] **Camera permissions** - Vendor scanner needs camera
- [ ] **Notification permissions** - PWA install prompt
- [ ] **Permission denial handling** - Graceful errors

---

## 🐛 Common Mobile Issues & Fixes

### Issue: QR Code Too Small to Scan
**Symptoms**: User struggles to scan, multiple attempts
**Fix**: Increase QR code size to minimum 250x250px
**Code**: `components/BigQRCode.tsx` - adjust size prop

### Issue: Privy Modal Cut Off on Small Screens
**Symptoms**: "Sign In" button not visible, can't scroll
**Fix**: Add `viewport` meta tag, test on iPhone SE (smallest)
**Code**: `app/layout.tsx` - check viewport settings

### Issue: Camera Not Working on iOS Safari
**Symptoms**: Black screen when trying to scan QR
**Fix**: Ensure HTTPS (required for camera access)
**Fix**: Request permissions explicitly before opening camera

### Issue: Slow Loading on 3G
**Symptoms**: Spinning loader for 10+ seconds
**Fix**: Implement service worker caching (PWA)
**Fix**: Lazy load heavy components
**Code**: Check `next.config.js` PWA settings

### Issue: GPS Not Accurate Indoors
**Symptoms**: "Outside venue radius" error when clearly inside
**Fix**: Increase venue radius from 50m to 100m
**Fix**: Add manual override for ambassadors
**Code**: `data/venues.json` - adjust radius values

---

## 🎬 Real-World Test Scenarios

### Scenario 1: Parking Lot Onboarding
**Setting**: Sunny afternoon, outdoor concert parking lot
**Actors**: 1 ambassador, 1 new member
**Steps**:
1. Ambassador approaches someone admiring tie-dyes
2. "Hey, want to join our Dead family? Takes 30 seconds"
3. Pulls out phone, opens ambassador portal
4. In bright sunlight, can they see the screen?
5. Generate QR code - does it appear quickly?
6. New person scans with camera - does it work first try?
7. Privy login on their phone - can they enter email easily?
8. Wait for SBT mint - does it complete in <60 sec?
9. Success message - is it exciting enough?

**Success**: Both people smile, new member feels welcomed

### Scenario 2: Vendor Booth Discount
**Setting**: Festival vendor selling tie-dye shirts
**Actors**: 1 vendor, 1 NFA Bears member
**Steps**:
1. Member: "I'm an NFA Bears member, do I get the discount?"
2. Vendor: "Sure! Show me your QR code"
3. Member opens phone, navigates to /member
4. Shows QR code to vendor
5. Vendor scans with their tablet
6. Verification happens (contract call)
7. "✓ SBT Member - 10% discount approved!"
8. Vendor applies discount manually

**Success**: Fast, no friction, vendor trusts the system

### Scenario 3: Nighttime Indoor Venue
**Setting**: Dark concert venue, loud music, crowded
**Actors**: 1 ambassador, 3 new members in a group
**Steps**:
1. Group of friends interested in joining
2. Dark venue - phone screens at max brightness
3. QR code must be readable in low light
4. Each person scans the SAME QR code
5. System prevents duplicate scans (one-time use)
6. All three get onboarded simultaneously
7. They all receive welcome message

**Success**: Works in chaos, handles concurrent users

---

## 📊 Performance Benchmarks

### Load Time Targets
- Homepage: <1.5 seconds on 4G
- Ambassador portal: <2 seconds on 4G
- QR code generation: <2 seconds after tap
- Member dashboard: <1 second (cached)
- Vendor verification: <3 seconds total

### Bundle Size Targets
- Initial JS bundle: <300KB gzipped
- CSS: <50KB gzipped
- Images: Use WebP, <100KB each
- Fonts: Subset only needed glyphs

### Interaction Targets
- Touch target size: ≥44x44px
- Tap to response: <100ms
- Animation frame rate: 60fps
- Scroll performance: Smooth, no jank

---

## 🔧 Testing Tools

### Browser DevTools
```bash
# Chrome DevTools Device Emulation
# Press F12 → Toggle Device Toolbar (Cmd+Shift+M)
# Test on: iPhone SE, iPhone 12, Pixel 5, Galaxy S20
```

### Lighthouse Mobile Audit
```bash
# Run from Chrome DevTools
# Targets:
# - Performance: >90
# - Accessibility: >95
# - Best Practices: >90
# - PWA: >90
```

### Network Throttling
```bash
# Chrome DevTools → Network tab
# Throttle to "Fast 3G" or "Slow 3G"
# Test all critical flows
```

### Real Device Testing (CRITICAL)
```bash
# NO SUBSTITUTES - Must test on actual phones
# Borrow devices from:
# - Friends/family
# - Local phone store (demo units)
# - Ambassadors before event
```

---

## ✅ Pre-Event Mobile Checklist

### 1 Week Before
- [ ] Test on 3+ real devices (iOS + Android)
- [ ] Verify all flows work on 3G
- [ ] Test QR codes in bright sunlight outdoors
- [ ] Check camera permissions on all browsers
- [ ] Validate Privy works on mobile browsers

### 24 Hours Before
- [ ] Test at EXACT event location
- [ ] Verify GPS works at venue coordinates
- [ ] Check venue wifi/cell signal strength
- [ ] Have ambassadors test on their personal phones
- [ ] Screenshot all flows working successfully

### Day Of Event
- [ ] Ambassadors arrive early to test
- [ ] Generate test invite at venue location
- [ ] Scan test invite with multiple devices
- [ ] Verify vendor scanner works in booth lighting
- [ ] Have backup plan if wifi fails (mobile hotspot)

---

## 🚨 Red Flags - Stop and Fix

If you see ANY of these during testing, **DO NOT PROCEED** to pilot event:

- ⛔ QR code generation takes >5 seconds
- ⛔ Privy modal doesn't load on mobile
- ⛔ Camera permissions fail on iOS
- ⛔ Member can't complete flow in <90 seconds
- ⛔ Vendor verification fails >10% of the time
- ⛔ App crashes on older devices
- ⛔ Requires downloading an app (should be web-only)
- ⛔ GPS verification fails at actual venue
- ⛔ Page doesn't work offline at all

---

## 📝 Test Results Template

Use this to document your testing:

```markdown
## Mobile Test Session: [Date]

### Device: [iPhone 12, iOS 16.5, Safari]
### Network: [WiFi / 4G / 3G]
### Location: [Indoor / Outdoor / Venue]

### Ambassador Flow
- Generate invite: ⏱️ [2.3s] ✅ Pass
- QR visibility: ✅ Readable in sunlight
- Touch targets: ✅ All tappable
- Notes: [Any issues]

### Member Onboarding
- Scan to mint: ⏱️ [47s] ✅ Pass
- Privy login: ✅ Modal rendered
- Email verify: ✅ Worked
- Success message: ✅ Clear
- Notes: [Any issues]

### Vendor Verification
- Scan member QR: ⏱️ [3.1s] ✅ Pass
- Verification: ✅ Contract call succeeded
- Visual feedback: ✅ Big green checkmark
- Notes: [Any issues]

### Issues Found: [None / List]
### Blockers: [None / List]
### Overall: ✅ Ready / ⚠️ Needs fixes / ⛔ Not ready
```

---

## 🎯 Success Criteria

Your mobile experience is ready when:

✅ Ambassador can generate invite in <30 seconds
✅ New member completes onboarding in <60 seconds
✅ Works on 80%+ of devices tested
✅ QR codes scannable in all lighting conditions
✅ Vendor verification completes in <15 seconds
✅ Zero app downloads required
✅ Works on spotty 3G connection
✅ Graceful error messages (not tech jargon)
✅ Ambassadors can use confidently after 5-minute training
✅ Members say "that was easy!" not "that was confusing"

---

**Remember**: This isn't about perfect code. It's about **real humans in parking lots joining a family**. Make it feel like getting miracled a ticket - easy, generous, welcoming.

"Fuck crypto, real family shit" means the tech disappears and the human connection shines. 🐻

---

**Last Updated**: 2025-10-27
**Next**: Test at actual venue with real phones
