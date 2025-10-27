# Pilot Event Simulation - Full Walkthrough
**Practice Run for 60-Second Miracle**

## 🎯 Purpose

This document simulates a complete pilot event from setup to teardown. Practice this flow BEFORE the real event to catch any issues.

---

## 📅 Timeline: Event Day

### T-Minus 3 Hours: Pre-Event Setup

**Location**: Home/office (good wifi)

#### 1. System Health Check
```bash
cd nfa-bears-mvp
node scripts/pre-flight-check.js
```

**Expected**: All green checkmarks

#### 2. Environment Verification
```bash
# Check you're in PRODUCTION mode
grep "DEV_SKIP_GPS" .env
# Should be: DEV_SKIP_GPS=false
```

#### 3. Generate Test Invite
```bash
# Replace coordinates with your ACTUAL event location
curl -X POST http://your-domain.com/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":YOUR_LAT,"longitude":YOUR_LON}'
```

**Expected**: JSON response with QR code data

#### 4. Test Minting (with test wallet)
- Open invite URL on phone
- Complete Privy login
- Verify SBT mints
- Check transaction on https://bepolia.beratrail.io/

#### 5. Ambassador Briefing
- Share AMBASSADOR_TRAINING.md with team
- Walk through 60-second flow
- Practice on their phones
- Answer questions

---

### T-Minus 1 Hour: On-Site Setup

**Location**: Actual event venue

#### 1. Ambassadors Arrive
- [ ] Check in with each ambassador
- [ ] Verify phones charged (>80%)
- [ ] Test GPS at exact location
- [ ] Verify cellular/wifi signal

#### 2. Venue GPS Test
```
Each ambassador:
1. Opens /ambassador page
2. Generates test invite
3. Verifies GPS coordinates match venue
4. Tests QR code in sunlight
5. Scans with another phone to confirm readability
```

#### 3. Vendor Coordination
- [ ] Brief vendors on discount verification
- [ ] Test vendor scanner (/vendor page)
- [ ] Verify vendor phones can scan QR codes
- [ ] Show them how green checkmark appears

#### 4. Communication Setup
- [ ] Ambassadors join group chat/Discord
- [ ] Share tech support contact
- [ ] Establish check-in schedule (every 30 min)

---

### T-Minus 30 Minutes: Final Checks

#### Pre-Event Huddle
- [ ] Gather all ambassadors
- [ ] Quick refresher on 60-second flow
- [ ] Remind: "It's about welcoming people, not hitting numbers"
- [ ] Share the vibe: "Fuck crypto, real family shit"
- [ ] Circle up, get hyped!

#### Last Technical Checks
- [ ] Generate one final test invite
- [ ] Verify it creates successfully
- [ ] Check server logs for any errors
- [ ] Confirm relayer wallet balance >0.1 BERA

---

## 🎪 Event Time: The 60-Second Miracle

### Hour 1: Early Arrivals (Pre-Show)

**Scene**: Parking lot, people setting up tailgates, grilling

#### Ambassador Positioning
- Spread out across parking lot
- Position near popular spots (food, merch)
- Work in pairs when possible
- Wear visible NFA Bears gear

#### First Approach
**Target**: Someone in a Grateful Dead shirt

**Ambassador**: "Hey man, sick shirt! You been on the bus long?"
**Person**: "Oh yeah, seen 'em 20 times!"
**Ambassador**: "No way! Want to join our Deadhead collective? Takes 30 seconds, it's free."
**Person**: "What is it?"
**Ambassador**: "Digital membership, gets you discounts at vendors, access to our community. Plus we're keeping the lot culture alive, ya know?"
**Person**: "Sure, why not!"

#### The Flow
1. **[5sec]** Ambassador opens /ambassador, selects venue
2. **[3sec]** Taps "Generate Invite"
3. **[2sec]** QR code appears with countdown
4. **[5sec]** Turns phone to new member, "Scan this with your camera"
5. **[5sec]** New member opens camera, scans QR
6. **[10sec]** Link opens, Privy modal appears
7. **[15sec]** Enters email: "deadhead@gmail.com"
8. **[10sec]** Checks email for verification code
9. **[5sec]** Enters code, wallet created
10. **[10sec]** SBT mints automatically
11. **[3sec]** "Welcome to the family!" appears

**Total**: 73 seconds (a bit over, but acceptable for first-timer)

**Ambassador**: "You're in! Check your email for Discord invite. Show this QR at vendors for discounts!"
**Person**: "That's it? That was easy!"
**Ambassador**: "That's the point! Welcome aboard! 🐻"

#### First Success Metrics
- ✅ Completed successfully
- ⏱️ 73 seconds (within acceptable range)
- 😊 Person seemed happy
- 📱 Mobile experience worked smoothly

---

### Hour 2: Set Break (Peak Onboarding)

**Scene**: Band takes a break, people wandering, social

#### Group Onboarding
**Target**: Three friends hanging out together

**Ambassador**: "Hey folks! Y'all together? Want to join our Deadhead family? Free membership, takes a minute."
**Friend 1**: "All of us?"
**Ambassador**: "Yeah! You can all scan the same code."
**Friend 2**: "What do we get?"
**Ambassador**: "Vendor discounts, community access, plus you're supporting real Dead culture."
**Friend 3**: "I'm down!"

#### The Flow (Concurrent)
- All three pull out phones
- Each scans the same QR code
- All three go through Privy flow simultaneously
- System handles concurrent requests

**IMPORTANT**: One-time codes should still allow MULTIPLE people to scan within the 15-minute window (it's a group experience!). Each person gets their own unique SBT.

#### Group Metrics
- ✅ 3 successful onboardings from 1 QR code
- ⏱️ ~60 seconds each
- 😊 Social bonding experience
- 🎯 Efficient ambassador time

---

### Hour 3: Vendor Integration Test

**Scene**: Member approaches food vendor

#### Discount Verification
**Member**: "Hey, I'm an NFA Bears member - do I get a discount?"
**Vendor**: "Yeah! Show me your QR code."

**Member**:
1. Opens phone
2. Goes to nfabears.xyz/member
3. QR code with wallet address appears
4. Shows to vendor

**Vendor**:
1. Opens /vendor page on tablet
2. Camera activates
3. Scans member's QR code
4. On-chain verification happens
5. "✅ SBT Member - 10% Discount Approved" appears
6. Applies discount to purchase

**Vendor**: "You're all set! That'll be $18 instead of $20."
**Member**: "Nice! Thanks!"

#### Vendor Feedback Collection
- "Was that easy to verify?"
- "How long did it take?"
- "Would you do this again?"
- "Any confusion?"

---

### Hour 4: Challenge Scenarios

#### Challenge 1: Poor Cell Signal
**Problem**: Member can't load Privy modal, stuck loading
**Solution**:
- Ambassador: "Let's try the venue wifi instead of cell data"
- Connect to venue wifi
- Retry from beginning with new QR code
- Success on second attempt

**Lesson**: Always have wifi backup plan

#### Challenge 2: Bright Sunlight
**Problem**: Can't see QR code on screen
**Solution**:
- Ambassador: "Let me use my body to shade the screen"
- Positions body to block sun
- Increases brightness to max
- Member successfully scans

**Lesson**: Bring sunglasses, find shade spots

#### Challenge 3: Email Verification Delay
**Problem**: Member not getting verification email
**Solution**:
- Ambassador: "Check spam folder"
- Member: "Oh, there it is!"
- Completes flow

**Lesson**: Warn people to check spam

#### Challenge 4: Technical Glitch
**Problem**: Privy modal crashes, won't load
**Solution**:
- Ambassador: "No worries, let me grab your email and I'll send you a link to finish later"
- Collects email manually
- Follows up after show with invite link

**Lesson**: Always have graceful fallback

---

### Post-Event: Hour 5 Debrief

#### Metrics Collection
- Total invites generated: **47**
- Successful mints: **42**
- Completion rate: **89.4%** (just under 90% target)
- Average time: **58 seconds** (hit target!)
- Failed attempts: **5** (3 technical, 2 abandoned)

#### Ambassador Feedback
**What Worked**:
- "The vendor discount angle was huge - everyone wanted that"
- "Groups of friends loved doing it together"
- "QR codes scanned really well after we found shade"
- "Privy was way easier than explaining MetaMask"

**What Needs Improvement**:
- "Need better wifi - venue signal was weak"
- "One person's phone was too old, app wouldn't load"
- "Some people worried about email spam"
- "Would love NFA Bears t-shirts to be more visible"

**Unexpected Wins**:
- "Three people told their friends who weren't there yet"
- "One vendor asked to become a Genesis holder"
- "Member came back hour later to say thanks"

#### Technical Issues
- 2 Privy timeouts (slow network)
- 1 QR scanner fail (incompatible browser)
- 0 GPS verification failures (100m radius worked perfect)
- 0 rate limit hits (traffic manageable)

#### Community Impact
- 42 new members in Discord by next morning
- 8 people used vendor discounts same day
- Multiple "when's the next event?" messages
- Positive vibes all around

---

## ✅ Success Indicators

Your pilot event is successful if:

**Quantitative**:
- [ ] 10+ successful SBT mints
- [ ] >80% completion rate
- [ ] <90 second average onboarding time
- [ ] 0 major system outages
- [ ] 3+ vendors verify members

**Qualitative**:
- [ ] Ambassadors felt confident
- [ ] New members seemed excited
- [ ] Tech felt invisible (good!)
- [ ] People said "that was easy"
- [ ] Community vibe was strong
- [ ] You'd do it again

**Cultural**:
- [ ] Felt like Deadhead culture, not crypto hype
- [ ] Person-to-person connections made
- [ ] Generous, welcoming atmosphere
- [ ] "Real family shit" energy present
- [ ] Parking lot spirit alive

---

## 📝 Event Report Template

After your pilot, fill this out:

```markdown
# NFA Bears Pilot Event Report

**Date**: [Date]
**Venue**: [Name]
**Attendance**: [Estimated]
**Ambassadors**: [Count]

## Metrics
- Invite codes generated: [X]
- Successful mints: [X]
- Completion rate: [X%]
- Average time: [X seconds]

## What Worked
- [List 3-5 things]

## What Needs Improvement
- [List 3-5 things]

## Technical Issues
- [List any bugs/failures]

## Community Feedback
- [Quotes from new members]

## Ambassador Testimonials
- [Quotes from team]

## Recommendations for Next Event
- [Specific improvements]

## Overall Assessment
[2-3 paragraphs on how it went]
```

---

## 🎯 Remember

This isn't about perfect execution. It's about:
- **Real people** connecting in **real life**
- **Preserving culture** that matters
- **Building community** that lasts
- **Having fun** while doing it

The tech is just the tool. The **miracle is the human connection**.

Now go make some magic happen! 🐻✨

---

**Last Updated**: 2025-10-27
**Next**: Run your pilot event!
