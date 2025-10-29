# NFA Bears MVP - API Testing Guide
**Complete Endpoint Validation**

## 🎯 API Overview

Three critical endpoints power the 60-Second Miracle:

1. **POST /api/invite** - Generate GPS-locked invite codes
2. **GET /api/invite?code=...** - Verify invite codes
3. **POST /api/mint** - Mint SBT via gasless relayer

---

## 🧪 Testing POST /api/invite

### Generate Invite Code

**Endpoint**: `POST /api/invite`

**Request**:
```bash
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": "local-dev",
    "latitude": 37.7749,
    "longitude": -122.4194
  }'
```

**Success Response (200)**:
```json
{
  "success": true,
  "code": "local-dev:1761589788624:19f1aea76d9cd5ea:5f7f90284566373e",
  "url": "http://localhost:3001/invite/local-dev:...",
  "qrUrl": "data:image/png;base64,...",
  "expiresAt": 1761590688624,
  "venue": {
    "id": "local-dev",
    "name": "Local Development Venue",
    "lat": 37.7749,
    "lng": -122.4194,
    "radius": 100
  }
}
```

**Rate Limit Response (429)**:
```json
{
  "error": "Too many invite generation attempts",
  "type": "RATE_LIMIT",
  "retryAfter": 45,
  "timestamp": "2025-10-28T10:00:00.000Z"
}
```

**Headers**:
- `X-RateLimit-Limit: 5`
- `X-RateLimit-Remaining: 4`
- `X-RateLimit-Reset: [timestamp]`

### Test Scenarios

#### Valid Request
```bash
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}'
```
**Expected**: 200, QR code returned

#### Invalid Venue
```bash
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"nonexistent","latitude":37.7749,"longitude":-122.4194}'
```
**Expected**: 400, "Invalid venue"

#### Missing Coordinates
```bash
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev"}'
```
**Expected**: 400, validation error

#### Rate Limit Test
```bash
# Send 6 requests rapidly
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/invite \
    -H "Content-Type: application/json" \
    -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}'
  echo "\n---"
done
```
**Expected**: First 5 succeed (200), 6th fails (429)

---

## 🔍 Testing GET /api/invite

### Verify Invite Code

**Endpoint**: `GET /api/invite?code=[invite-code]`

**Request**:
```bash
# Use code from previous POST response
curl "http://localhost:3001/api/invite?code=local-dev:1761589788624:19f1aea76d9cd5ea:5f7f90284566373e"
```

**Success Response (200)**:
```json
{
  "success": true,
  "venueId": "local-dev",
  "timestamp": 1761589788624,
  "isValid": true
}
```

**Invalid Code Response (400)**:
```json
{
  "error": "Invalid or expired invite code",
  "type": "VALIDATION",
  "timestamp": "2025-10-28T10:00:00.000Z"
}
```

### Test Scenarios

#### Valid Code (Fresh)
```bash
# Generate new code first
CODE=$(curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}' \
  | grep -o '"code":"[^"]*"' | cut -d'"' -f4)

# Verify it immediately
curl "http://localhost:3001/api/invite?code=$CODE"
```
**Expected**: 200, valid

#### Expired Code
```bash
# Code expires after 15 minutes
# Wait or use old code
curl "http://localhost:3001/api/invite?code=old-expired-code"
```
**Expected**: 400, expired

#### Malformed Code
```bash
curl "http://localhost:3001/api/invite?code=invalid-format"
```
**Expected**: 400, invalid

#### Missing Code
```bash
curl "http://localhost:3001/api/invite"
```
**Expected**: 400, missing code

---

## 🎨 Testing POST /api/mint

### Mint SBT

**Endpoint**: `POST /api/mint`

**Request**:
```bash
curl -X POST http://localhost:3001/api/mint \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "code": "local-dev:1761589788624:19f1aea76d9cd5ea:5f7f90284566373e"
  }'
```

**Success Response (200)**:
```json
{
  "success": true,
  "transactionHash": "0x123abc...",
  "membershipId": 42,
  "message": "SBT minted successfully"
}
```

**Already Minted Response (400)**:
```json
{
  "error": "This wallet already has a membership NFT",
  "type": "VALIDATION",
  "timestamp": "2025-10-28T10:00:00.000Z"
}
```

**Expired Code Response (400)**:
```json
{
  "error": "Invalid or expired invite code",
  "type": "VALIDATION"
}
```

### Test Scenarios

#### Full Happy Path
```bash
# Step 1: Generate invite
RESPONSE=$(curl -s -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}')

CODE=$(echo $RESPONSE | grep -o '"code":"[^"]*"' | cut -d'"' -f4)
echo "Generated code: $CODE"

# Step 2: Mint SBT
curl -X POST http://localhost:3001/api/mint \
  -H "Content-Type: application/json" \
  -d "{\"address\":\"0xNEW_TEST_ADDRESS\",\"code\":\"$CODE\"}"
```
**Expected**: Transaction hash returned, SBT minted

#### Duplicate Mint Attempt
```bash
# Try to mint again with same address
curl -X POST http://localhost:3001/api/mint \
  -H "Content-Type: application/json" \
  -d "{\"address\":\"0xSAME_ADDRESS\",\"code\":\"$NEW_CODE\"}"
```
**Expected**: 400, "already has membership"

#### Code Reuse Attempt
```bash
# Generate code and mint
# Then try to use same code again
curl -X POST http://localhost:3001/api/mint \
  -H "Content-Type: application/json" \
  -d "{\"address\":\"0xDIFFERENT_ADDRESS\",\"code\":\"$ALREADY_USED_CODE\"}"
```
**Expected**: 400, code already consumed (deleted from Redis)

---

## 🔐 Security Testing

### Rate Limiting

**Invite Generation** (5 requests/minute):
```bash
# Test rate limit enforcement
for i in {1..10}; do
  RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}\n" -X POST http://localhost:3001/api/invite \
    -H "Content-Type: application/json" \
    -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}')
  echo "Request $i: $RESPONSE"
  echo "---"
done
```
**Expected**: First 5 succeed, rest get 429

**Minting** (3 requests/minute):
```bash
# Similar test for mint endpoint
for i in {1..5}; do
  curl -s -w "\nHTTP:%{http_code}\n" -X POST http://localhost:3001/api/mint \
    -H "Content-Type: application/json" \
    -d '{"address":"0xTEST","code":"test-code"}'
  echo "---"
done
```
**Expected**: First 3 might process, rest get 429

### HMAC Signature Validation

**Tampered Code**:
```bash
# Modify part of a valid code
curl "http://localhost:3001/api/invite?code=local-dev:1234567890:random:WRONG_SIG"
```
**Expected**: 400, invalid signature

**Replay Attack**:
```bash
# Try to reuse consumed code
curl -X POST http://localhost:3001/api/mint \
  -H "Content-Type: application/json" \
  -d '{"address":"0xNEW","code":"ALREADY_USED_CODE"}'
```
**Expected**: 400, code not found in Redis

### GPS Verification

**With DEV_SKIP_GPS=true** (Development):
```bash
# Any coordinates work
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":0,"longitude":0}'
```
**Expected**: 200, bypasses GPS check

**With DEV_SKIP_GPS=false** (Production):
```bash
# Outside 100m radius - should fail GPS check
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":40.7128,"longitude":-74.0060}'
```
**Expected**: 400, outside venue radius (in prod)

---

## 📊 Response Time Benchmarks

### Target Performance

| Endpoint | Target | Acceptable | Too Slow |
|----------|--------|------------|----------|
| POST /api/invite | <500ms | <2s | >3s |
| GET /api/invite | <200ms | <1s | >2s |
| POST /api/mint | <3s | <10s | >15s |

**Note**: Minting is slower due to blockchain confirmation

### Load Testing (Optional)

```bash
# Install Apache Bench
# Mac: brew install httpd
# Windows: Download from apache.org

# Test invite generation under load
ab -n 100 -c 10 -p invite-payload.json -T application/json \
   http://localhost:3001/api/invite

# invite-payload.json:
# {"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}
```

---

## 🐛 Common Issues

### "Redis connection failed"
**Symptoms**: All API routes return 500
**Debug**:
```bash
# Test Redis directly
node -e "
const {Redis} = require('@upstash/redis');
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});
redis.ping().then(r => console.log('PONG:', r));
"
```
**Fix**: Verify Redis credentials

### "Transaction reverted"
**Symptoms**: Minting fails with blockchain error
**Debug**:
- Check relayer has BERA
- Verify contract address
- Check RPC URL
- Test contract read call first

**Fix**:
```bash
# Check relayer balance
curl -X POST https://bepolia.rpc.berachain.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4","latest"],"id":1}'
```

### "CORS errors in browser"
**Symptoms**: Requests blocked by browser
**Debug**: Check browser console
**Fix**: Verify CORS headers in `next.config.js`:
```javascript
headers: [
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" }
]
```

---

## ✅ Pre-Event API Validation

**Run these tests before pilot event:**

```bash
# 1. Invite generation
curl -X POST http://localhost:3001/api/invite \
  -H "Content-Type: application/json" \
  -d '{"venueId":"local-dev","latitude":37.7749,"longitude":-122.4194}'
# ✅ Should return code + QR

# 2. Invite verification
curl "http://localhost:3001/api/invite?code=[CODE_FROM_STEP_1]"
# ✅ Should return valid

# 3. Minting (with test wallet)
curl -X POST http://localhost:3001/api/mint \
  -H "Content-Type: application/json" \
  -d '{"address":"0xTEST_WALLET","code":"[CODE_FROM_STEP_1]"}'
# ✅ Should mint or say already has one

# 4. Check blockchain
# Visit: https://bepolia.beratrail.io/address/0xTEST_WALLET
# ✅ Should see SBT token
```

---

## 📝 Testing Checklist

### Local Testing
- [ ] POST /api/invite returns 200 with QR code
- [ ] GET /api/invite validates codes correctly
- [ ] POST /api/mint successfully mints SBT
- [ ] Rate limiting triggers after 5/3 requests
- [ ] Expired codes return 400
- [ ] Duplicate mints prevented
- [ ] Invalid addresses rejected
- [ ] Redis stores/retrieves codes

### Production Testing
- [ ] All endpoints work on production URL
- [ ] HTTPS required for camera access
- [ ] CORS configured correctly
- [ ] Environment variables loaded
- [ ] GPS verification enforced (DEV_SKIP_GPS=false)
- [ ] Privy authentication integrated
- [ ] Transaction confirmations on Berachain

### Performance Testing
- [ ] Invite generation <500ms
- [ ] Code verification <200ms
- [ ] Minting completes <10s
- [ ] No timeout errors under load
- [ ] Redis responds quickly

---

## 🎯 Success Criteria

APIs are ready when:
- ✅ All endpoints return expected status codes
- ✅ Response times within targets
- ✅ Rate limiting works
- ✅ Security validations pass
- ✅ Error messages are clear
- ✅ Logs show proper information
- ✅ No unhandled exceptions

**The 60-Second Miracle depends on these APIs working flawlessly!**

---

**Last Updated**: 2025-10-28
**API Version**: v1 (MVP)
**Base URL Development**: http://localhost:3001
**Base URL Production**: https://your-app.vercel.app
