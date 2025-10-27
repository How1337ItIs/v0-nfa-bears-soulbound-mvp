#!/usr/bin/env node

/**
 * NFA Bears Pre-Flight Checklist
 * Run this before deploying or running pilot event
 *
 * Usage: node scripts/pre-flight-check.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🐻 NFA Bears MVP - Pre-Flight Checklist\n');
console.log('═'.repeat(60));
console.log('Running comprehensive system checks...\n');

// Track overall status
let criticalIssues = 0;
let warnings = 0;
let checksPass = 0;

// Helper for status indicators
const CHECK = '✅';
const WARN = '⚠️ ';
const FAIL = '❌';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// ============================================================================
// 1. ENVIRONMENT VARIABLES CHECK
// ============================================================================

console.log('1️⃣  ENVIRONMENT VARIABLES');
console.log('─'.repeat(60));

const requiredVars = {
  'NEXT_PUBLIC_PRIVY_APP_ID': { type: 'public', critical: true },
  'NEXT_PUBLIC_CONTRACT_ADDRESS': { type: 'public', critical: true, format: /^0x[a-fA-F0-9]{40}$/ },
  'NEXT_PUBLIC_BEPOLIA_RPC': { type: 'public', critical: true, format: /^https:\/\// },
  'DEPLOYER_PRIVATE_KEY': { type: 'secret', critical: true, format: /^0x[a-fA-F0-9]{64}$/ },
  'SECRET_KEY': { type: 'secret', critical: true, minLength: 32 },
  'INVITE_SECRET_KEY': { type: 'secret', critical: true, minLength: 32 },
  'UPSTASH_REDIS_REST_URL': { type: 'secret', critical: true, format: /^https:\/\/.*upstash\.io/ },
  'UPSTASH_REDIS_REST_TOKEN': { type: 'secret', critical: true, minLength: 20 },
};

Object.entries(requiredVars).forEach(([key, config]) => {
  const value = process.env[key];
  const display = config.type === 'secret' ? '[REDACTED]' : value;

  if (!value) {
    console.log(`${FAIL} ${key}: MISSING`);
    if (config.critical) criticalIssues++;
    return;
  }

  // Check format
  if (config.format && !config.format.test(value)) {
    console.log(`${WARN} ${key}: Invalid format`);
    warnings++;
    return;
  }

  // Check minimum length
  if (config.minLength && value.length < config.minLength) {
    console.log(`${WARN} ${key}: Too short (min ${config.minLength} chars)`);
    warnings++;
    return;
  }

  console.log(`${CHECK} ${key}: ${config.type === 'secret' ? 'Configured' : display}`);
  checksPass++;
});

console.log('');

// ============================================================================
// 2. SMART CONTRACT CHECK
// ============================================================================

console.log('2️⃣  SMART CONTRACT STATUS');
console.log('─'.repeat(60));

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const rpcUrl = process.env.NEXT_PUBLIC_BEPOLIA_RPC;

if (contractAddress && rpcUrl) {
  console.log(`${CHECK} Contract Address: ${contractAddress}`);
  console.log(`${CHECK} RPC URL: ${rpcUrl}`);

  // Test RPC connection
  const testRPC = () => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1
      });

      const url = new URL(rpcUrl);
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json.result) {
              const chainId = parseInt(json.result, 16);
              console.log(`${CHECK} RPC Connection: Working (Chain ID: ${chainId})`);
              if (chainId === 80069) {
                console.log(`${CHECK} Network: Berachain Bepolia ✓`);
                checksPass += 2;
                resolve();
              } else {
                console.log(`${WARN} Network: Wrong chain (expected 80069, got ${chainId})`);
                warnings++;
                resolve();
              }
            } else {
              console.log(`${WARN} RPC Response: Unexpected format`);
              warnings++;
              resolve();
            }
          } catch (e) {
            console.log(`${FAIL} RPC Response: Parse error`);
            criticalIssues++;
            reject(e);
          }
        });
      });

      req.on('error', (e) => {
        console.log(`${FAIL} RPC Connection: Failed (${e.message})`);
        criticalIssues++;
        reject(e);
      });

      req.setTimeout(5000, () => {
        console.log(`${FAIL} RPC Connection: Timeout`);
        criticalIssues++;
        req.destroy();
        reject(new Error('Timeout'));
      });

      req.write(data);
      req.end();
    });
  };

  // Run async check
  testRPC().catch(() => {}).finally(() => continueChecks());
} else {
  console.log(`${FAIL} Missing contract address or RPC URL`);
  criticalIssues++;
  continueChecks();
}

function continueChecks() {
  setTimeout(() => {
    console.log('');

    // ============================================================================
    // 3. RELAYER WALLET CHECK
    // ============================================================================

    console.log('3️⃣  RELAYER WALLET BALANCE');
    console.log('─'.repeat(60));

    const checkBalance = () => {
      return new Promise((resolve, reject) => {
        const data = JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: ['0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4', 'latest'],
          id: 1
        });

        const url = new URL(rpcUrl);
        const options = {
          hostname: url.hostname,
          port: 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(body);
              const balance = parseInt(json.result, 16) / 1e18;

              console.log(`${CHECK} Address: 0xC9ba78130433dfC58dBf0F94f4Ff3b29E1a050a4`);
              console.log(`${CHECK} Balance: ${balance.toFixed(4)} BERA`);

              if (balance > 0.1) {
                console.log(`${CHECK} Status: Sufficient for pilot event (~${Math.floor(balance * 1000)} mints)`);
                checksPass++;
              } else if (balance > 0.01) {
                console.log(`${WARN} Status: Low balance - add more BERA before event`);
                warnings++;
              } else {
                console.log(`${FAIL} Status: Insufficient BERA - fund immediately!`);
                criticalIssues++;
              }
              resolve();
            } catch (e) {
              console.log(`${FAIL} Balance check failed`);
              criticalIssues++;
              reject(e);
            }
          });
        });

        req.on('error', (e) => {
          console.log(`${FAIL} Balance check failed: ${e.message}`);
          criticalIssues++;
          reject(e);
        });

        req.write(data);
        req.end();
      });
    };

    checkBalance().catch(() => {}).finally(() => finishChecks());
  }, 100);
}

function finishChecks() {
  setTimeout(() => {
    console.log('');

    // ============================================================================
    // 4. FILE SYSTEM CHECK
    // ============================================================================

    console.log('4️⃣  FILE SYSTEM');
    console.log('─'.repeat(60));

    const criticalFiles = [
      'app/api/invite/route.ts',
      'app/api/mint/route.ts',
      'app/ambassador/page.tsx',
      'app/member/page.tsx',
      'app/vendor/page.tsx',
      'lib/redis.ts',
      'contracts/membershipAbi.ts',
      'data/venues.json',
    ];

    criticalFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        console.log(`${CHECK} ${file}`);
        checksPass++;
      } else {
        console.log(`${FAIL} ${file}: Missing`);
        criticalIssues++;
      }
    });

    console.log('');

    // ============================================================================
    // FINAL SUMMARY
    // ============================================================================

    console.log('═'.repeat(60));
    console.log('📊 PRE-FLIGHT CHECK SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Checks Passed: ${checksPass}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`❌ Critical Issues: ${criticalIssues}`);
    console.log('═'.repeat(60));
    console.log('');

    // Deployment readiness assessment
    if (criticalIssues === 0 && warnings === 0) {
      console.log('🎉 ALL SYSTEMS GO!');
      console.log('');
      console.log('Your NFA Bears MVP is ready for:');
      console.log('  ✅ Production deployment');
      console.log('  ✅ Pilot event execution');
      console.log('  ✅ Ambassador onboarding');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Deploy to Vercel/production');
      console.log('  2. Test at actual event location');
      console.log('  3. Brief ambassadors');
      console.log('  4. Launch! 🚀');
    } else if (criticalIssues === 0) {
      console.log('⚠️  MOSTLY READY - Minor Warnings');
      console.log('');
      console.log(`You have ${warnings} warning(s) to address.`);
      console.log('Review the issues above before deploying.');
      console.log('');
      console.log('You CAN proceed to pilot, but fix warnings if possible.');
    } else {
      console.log('🚨 NOT READY FOR DEPLOYMENT');
      console.log('');
      console.log(`You have ${criticalIssues} CRITICAL issue(s) that MUST be fixed.`);
      console.log('');
      console.log('DO NOT run pilot event until these are resolved!');
      console.log('');
      console.log('Most common fix needed:');
      console.log('  → Configure Upstash Redis (see REDIS_SETUP_GUIDE.md)');
    }

    console.log('');
    console.log('═'.repeat(60));
    console.log('For detailed setup instructions:');
    console.log('  • REDIS_SETUP_GUIDE.md - Fix Redis configuration');
    console.log('  • CRITICAL_BLOCKERS.md - All blocking issues');
    console.log('  • MOBILE_TESTING_GUIDE.md - Test mobile experience');
    console.log('  • AMBASSADOR_TRAINING.md - Train your street team');
    console.log('═'.repeat(60));
    console.log('');
  }, 100);
}
