# Genesis Bears Mint Page - Setup Guide

## Overview

Complete mint page with:
- ✅ Credit card purchases (Thirdweb Pay)
- ✅ Crypto wallet purchases (MetaMask, Coinbase Wallet, etc.)
- ✅ Cross-chain bridging (buy from ETH, Base, Polygon, etc.)
- ✅ Discount code system
- ✅ Live mint counter
- ✅ Gift box tracking (first 100 buyers)
- ✅ Shipping form integration

## Files Created

```
app/
├── mint-genesis/page.tsx       # Main mint page
├── shipping/[tokenId]/page.tsx # Shipping form for gift box recipients
├── success/page.tsx            # Post-purchase success page
└── api/shipping/route.ts       # API endpoint for shipping data

contracts/
└── NFABearsGenesis.sol         # Smart contract with discount codes
```

## Setup Steps

### 1. Get Thirdweb Client ID

1. Go to https://thirdweb.com/dashboard
2. Create account / sign in
3. Go to Settings → API Keys
4. Create new Client ID
5. Copy the Client ID
6. Add to `.env`:
   ```bash
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
   ```

### 2. Deploy Smart Contract

#### Option A: Deploy via Thirdweb Dashboard (Easiest)

1. Go to https://thirdweb.com/dashboard/contracts/deploy
2. Click "Deploy Contract"
3. Upload `contracts/NFABearsGenesis.sol`
4. Select Berachain Bepolia as network
5. Fill in constructor params:
   - Name: "NFA Bears Genesis"
   - Symbol: "NFABEARS"
   - Royalty Recipient: Your wallet address
   - Royalty BPS: 500 (5%)
6. Click "Deploy"
7. Copy contract address to `.env`:
   ```bash
   NEXT_PUBLIC_GENESIS_BEARS_CONTRACT=0x...
   ```

#### Option B: Deploy via Hardhat

```bash
cd nfa-bears-mvp
npm run compile:contracts
npm run deploy:genesis
```

### 3. Add Discount Codes

After deploying, add discount codes via Thirdweb dashboard or directly:

```javascript
// Common discount codes to add:
addDiscountCode("OG_BEARS_25", 25)    // 25% off for OG community
addDiscountCode("HONEY_JAR_15", 15)   // 15% off for Mibera partners
addDiscountCode("PILOT_10", 10)       // 10% off for pilot attendees
addDiscountCode("ALICE_50", 50)       // 50% off for specific VIPs
```

Via Thirdweb dashboard:
1. Go to your deployed contract
2. Click "Write" tab
3. Find `addDiscountCode` function
4. Enter code (uppercase) and percentage
5. Execute transaction

### 4. Set Up Shipping Database

The `/api/shipping` endpoint currently just logs data. You need to connect it to a database:

#### Option A: Airtable (Easiest)
```bash
npm install airtable
```

```typescript
// In app/api/shipping/route.ts
import Airtable from 'airtable'

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID)

await base('Shipping').create({
  'Token ID': data.tokenId,
  'Name': data.name,
  'Email': data.email,
  'Address': data.address,
  // ...
})
```

#### Option B: Supabase
```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

await supabase.from('shipping').insert(data)
```

#### Option C: Google Sheets
Use Google Sheets API to append rows directly.

### 5. Test Locally

```bash
npm run dev
```

Navigate to `http://localhost:3001/mint-genesis`

#### Test Checklist:
- [ ] Page loads without errors
- [ ] Connect wallet works
- [ ] Discount code validation works
- [ ] Quantity selector works
- [ ] Price updates correctly
- [ ] Purchase button appears
- [ ] Network switching prompts appear (if on wrong network)
- [ ] Gift box counter shows correctly

### 6. Configure Thirdweb Pay (Credit Cards)

In Thirdweb dashboard:
1. Go to Settings → Payments
2. Enable Thirdweb Pay
3. Configure payment methods (credit cards enabled by default)
4. Set up KYC if needed for your jurisdiction

### 7. Order Physical Goods

For first 100 buyers, order:

**Silver Pendants (100):**
- Design your pendant
- Contact: CustomMade.com or local jeweler
- Budget: $30-50/unit
- Lead time: 4-6 weeks

**Tie-Dye Shirts (100):**
- Find Dead-scene vendor for cross-promotion
- Or use: CustomInk, Printful
- Budget: $20-30/unit
- Lead time: 2-3 weeks

**Sticker Packs (100):**
- StickerMule or Sticker Giant
- Budget: $3-5/pack
- Lead time: 1-2 weeks

**Packaging:**
- Custom boxes with logo
- Budget: $5-8/unit

## Launch Day Checklist

### Pre-Launch (1 week before)

- [ ] Contract deployed and verified on Berachain
- [ ] Discount codes added to contract
- [ ] Thirdweb Client ID configured
- [ ] Physical goods ordered (for first 100)
- [ ] Shipping database set up and tested
- [ ] Test mint completed successfully
- [ ] Discord announcement prepared
- [ ] Email list ready

### Launch Day

- [ ] Final test mint on production
- [ ] Monitor mint page for errors
- [ ] Watch for first 100 mint milestone
- [ ] Send shipping forms to first 100 buyers
- [ ] Respond to community questions
- [ ] Track sales progress
- [ ] Update social media with milestones

### Post-Launch

- [ ] Fulfill gift box orders
- [ ] Send tracking numbers
- [ ] Gather testimonials
- [ ] Plan follow-up events

## Customization

### Change Price
Edit `BASE_PRICE` in:
- `app/mint-genesis/page.tsx` (line 19)
- `contracts/NFABearsGenesis.sol` (line 17)

### Change Supply
Edit `MAX_SUPPLY` in:
- `app/mint-genesis/page.tsx` (line 20)
- `contracts/NFABearsGenesis.sol` (line 16)

### Change Gift Box Threshold
Edit `GIFT_BOX_THRESHOLD` in:
- `app/mint-genesis/page.tsx` (line 21)

### Styling
The page uses Tailwind CSS with glassmorphic design. Main colors:
- Purple: `from-purple-900 via-blue-900 to-indigo-900`
- Accent: `purple-600`, `pink-600`, `yellow-300`

## Troubleshooting

### "Invalid Client ID"
- Make sure `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set in `.env`
- Restart dev server after adding env vars

### "Contract not found"
- Ensure contract is deployed to Berachain Bepolia (chain ID 80069)
- Verify contract address in `.env`

### "Discount code not working"
- Check code is added to contract (call `checkDiscountCode`)
- Codes are case-sensitive (converted to uppercase in frontend)
- User can only use one discount code per wallet

### "Wrong Network" keeps appearing
- User needs to add Berachain Bepolia to their wallet
- Click "Switch Network" button to prompt wallet

### Shipping form not saving
- Check `/api/shipping` endpoint is working
- Verify database connection
- Check browser console for errors

## Support

- **Thirdweb Docs**: https://portal.thirdweb.com
- **Discord**: https://discord.gg/nfabears
- **Issues**: Open an issue in the repo

## Revenue Projections

At $333/NFT flat price:
- 100 sold = $33,300
- 300 sold = $99,900
- 710 sold = $236,430

First 100 gift box costs: ~$7-12K
Net after 710 sold: ~$220-230K

With 20% discount codes (example):
- 150 with 20% off @ $266 = $39,900
- 560 full price @ $333 = $186,480
- Total: $226,380 (still ~$214K net)

## Next Steps

After successful launch:
1. Monitor sales and fulfill gift boxes
2. Engage community in Discord
3. Plan first IRL event
4. Recruit vendor partners with proof of community
5. Consider secondary market strategy
