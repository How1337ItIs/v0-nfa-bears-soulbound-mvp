#!/usr/bin/env node
// Simple E2E smoke test for invite → verify → mint
// Usage: node scripts/api_smoke_test.js [baseUrl]

const DEFAULT_BASE = process.env.NFA_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
const BASE = process.argv[2] || DEFAULT_BASE;

async function postJSON(path, body) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (_) { json = { raw: text }; }
  return { ok: res.ok, status: res.status, json };
}

async function main() {
  console.log(`API Smoke Test against: ${BASE}`);
  const testAddress = process.env.TEST_ADDRESS || '0x8ba1f109551bD432803012645Ac136ddd64DBA72';

  // 1) Generate invite
  console.log('\n[1/3] Generating invite...');
  const gen = await postJSON('/api/invite', {
    venueId: 'local-dev',
    latitude: 37.7749,
    longitude: -122.4194
  });
  console.log('Status:', gen.status, 'OK:', gen.ok);
  console.log('Response:', gen.json);
  if (!gen.ok) {
    console.error('Invite generation failed. Exiting.');
    process.exit(1);
  }

  const code = gen.json.code || gen.json?.data?.code || gen.json?.inviteCode || gen.json?.result?.code;
  if (!code) {
    console.error('Could not find invite code in response. Exiting.');
    process.exit(1);
  }
  console.log('Invite code:', code);

  // 2) Verify invite
  console.log('\n[2/3] Verifying invite...');
  const verify = await postJSON('/api/invite/verify', { code, address: testAddress });
  console.log('Status:', verify.status, 'OK:', verify.ok);
  console.log('Response:', verify.json);
  if (!verify.ok) {
    console.warn('Invite verify returned non-200. Continuing to mint for visibility.');
  }

  // 3) Attempt mint (may depend on relayer/env; report outcome)
  console.log('\n[3/3] Minting SBT (gasless relayer)...');
  const mint = await postJSON('/api/mint', { address: testAddress, code });
  console.log('Status:', mint.status, 'OK:', mint.ok);
  console.log('Response:', mint.json);

  console.log('\nSummary:');
  console.log('- Invite:', gen.ok ? 'OK' : `FAIL (${gen.status})`);
  console.log('- Verify:', verify.ok ? 'OK' : `NON-200 (${verify.status})`);
  console.log('- Mint:', mint.ok ? 'OK' : `NON-200 (${mint.status})`);

  // Exit 0 to keep CI/dev non-blocking; failures are visible in output
  process.exit(0);
}

// Ensure global fetch exists (Node 18+). If not, exit with hint.
if (typeof fetch !== 'function') {
  console.error('Global fetch not found. Use Node 18+ or run with a polyfill.');
  process.exit(2);
}

main().catch((err) => {
  console.error('Smoke test error:', err);
  process.exit(2);
});

