#!/usr/bin/env node

/**
 * GPS Distance Calculation Tester
 * Tests Haversine formula for venue proximity verification
 *
 * Run: node scripts/test-gps-calculation.js
 */

// Haversine formula - calculates great-circle distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Test venues
const venues = [
  {
    id: 'local-dev',
    name: 'Local Development Venue',
    lat: 37.7749,
    lng: -122.4194,
    radius: 100,
  },
  {
    id: 'berkeley-art-museum',
    name: 'Berkeley Art Museum',
    lat: 37.8715,
    lng: -122.2607,
    radius: 50,
  },
  {
    id: 'sf-moma',
    name: 'San Francisco Museum of Modern Art',
    lat: 37.7857,
    lng: -122.4011,
    radius: 75,
  },
];

console.log('🐻 NFA Bears GPS Distance Calculator\n');
console.log('Testing Haversine formula for venue proximity...\n');

// Test scenarios
const testScenarios = [
  {
    name: 'Exact venue location',
    venue: venues[0],
    userLat: 37.7749,
    userLon: -122.4194,
    shouldPass: true,
  },
  {
    name: '50 meters away (inside 100m radius)',
    venue: venues[0],
    userLat: 37.7753,
    userLon: -122.4194,
    shouldPass: true,
  },
  {
    name: '150 meters away (outside 100m radius)',
    venue: venues[0],
    userLat: 37.7762,
    userLon: -122.4194,
    shouldPass: false,
  },
  {
    name: 'Berkeley Art Museum - inside 50m',
    venue: venues[1],
    userLat: 37.8716,
    userLon: -122.2607,
    shouldPass: true,
  },
  {
    name: 'Berkeley Art Museum - outside 50m',
    venue: venues[1],
    userLat: 37.8720,
    userLon: -122.2607,
    shouldPass: false,
  },
  {
    name: 'SF MOMA - inside 75m',
    venue: venues[2],
    userLat: 37.7860,
    userLon: -122.4011,
    shouldPass: true,
  },
];

let passCount = 0;
let failCount = 0;

testScenarios.forEach((scenario, index) => {
  const distance = calculateDistance(
    scenario.venue.lat,
    scenario.venue.lng,
    scenario.userLat,
    scenario.userLon
  );

  const withinRadius = distance <= scenario.venue.radius;
  const testPassed = withinRadius === scenario.shouldPass;

  const status = testPassed ? '✅ PASS' : '❌ FAIL';
  const icon = withinRadius ? '📍' : '🚫';

  console.log(`Test ${index + 1}: ${scenario.name}`);
  console.log(`  Venue: ${scenario.venue.name}`);
  console.log(`  Radius: ${scenario.venue.radius}m`);
  console.log(`  Distance: ${distance.toFixed(2)}m ${icon}`);
  console.log(`  Within radius: ${withinRadius ? 'YES' : 'NO'}`);
  console.log(`  Expected: ${scenario.shouldPass ? 'PASS' : 'FAIL'}`);
  console.log(`  Result: ${status}\n`);

  if (testPassed) {
    passCount++;
  } else {
    failCount++;
  }
});

// GPS accuracy notes
console.log('───────────────────────────────────────');
console.log('📊 Test Results');
console.log('───────────────────────────────────────');
console.log(`Total tests: ${testScenarios.length}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`Success rate: ${((passCount / testScenarios.length) * 100).toFixed(1)}%`);
console.log('───────────────────────────────────────\n');

// GPS accuracy warnings
console.log('⚠️  GPS ACCURACY NOTES:\n');
console.log('• Consumer GPS typically accurate to ±5-10 meters');
console.log('• Urban environments can have ±15-20 meter errors');
console.log('• Indoor venues may have ±50+ meter errors');
console.log('• Buildings can cause "urban canyon" effects');
console.log('• Weather can affect accuracy\n');

console.log('💡 RECOMMENDATIONS:\n');
console.log('• Use 100m radius for most venues (good balance)');
console.log('• Avoid <50m radius (too many false negatives)');
console.log('• Test at actual venue before event');
console.log('• Ambassador presence is PRIMARY Sybil resistance');
console.log('• GPS is SECONDARY verification\n');

console.log('🎯 FOR PILOT EVENT:\n');
console.log('• Ambassadors should test GPS at venue 1 hour before');
console.log('• If GPS fails, have manual override code');
console.log('• Remember: Person-to-person onboarding is the REAL verification');
console.log('• "Real family shit" means trusting humans, not just tech\n');

// Interactive distance calculator
console.log('───────────────────────────────────────');
console.log('🧮 Quick Distance Calculator');
console.log('───────────────────────────────────────\n');

// Example: Oakland to SF
const oaklandLat = 37.8044;
const oaklandLon = -122.2712;
const sfLat = 37.7749;
const sfLon = -122.4194;
const oaklandToSF = calculateDistance(oaklandLat, oaklandLon, sfLat, sfLon);
console.log(`Oakland to SF: ${(oaklandToSF / 1000).toFixed(2)} km\n`);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateDistance };
}
