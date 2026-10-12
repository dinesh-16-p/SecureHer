import {
  LOCATION_MAX_AGE_MS,
  ACCURACY_THRESHOLDS,
  getAccuracyCategory,
  isLocationFresh,
  formatLocationFix
} from './src/services/permissionService.js';

console.log('=== SECUREHER GPS ENGINE ACCURACY & FRESHNESS TEST ===\n');

// 1. Test Accuracy Categories
console.log('[TEST 1] Testing Accuracy Category Boundaries...');
const testsAccuracy = [
  { accuracy: 5, expected: 'high' },
  { accuracy: 20, expected: 'high' },
  { accuracy: 20.1, expected: 'moderate' },
  { accuracy: 50, expected: 'moderate' },
  { accuracy: 100, expected: 'moderate' },
  { accuracy: 100.1, expected: 'poor' },
  { accuracy: 1500, expected: 'poor' },
  { accuracy: null, expected: 'unknown' },
  { accuracy: undefined, expected: 'unknown' }
];

testsAccuracy.forEach(({ accuracy, expected }) => {
  const result = getAccuracyCategory(accuracy);
  if (result !== expected) {
    throw new Error(`getAccuracyCategory(${accuracy}) returned "${result}", expected "${expected}"`);
  }
  console.log(`  ✓ Accuracy ${accuracy}m correctly categorized as "${result}"`);
});
console.log('✓ Test 1 Passed: All accuracy category thresholds validated.\n');

// 2. Test Location Freshness Thresholds (120s max age)
console.log('[TEST 2] Testing Freshness Thresholds (120 seconds)...');
const now = Date.now();

// Fresh reading: 10 seconds ago
const freshTimestamp = now - 10000;
if (!isLocationFresh(freshTimestamp, LOCATION_MAX_AGE_MS)) {
  throw new Error('Fresh timestamp (10s old) was incorrectly marked as stale!');
}
console.log('  ✓ Timestamp 10s old is marked fresh.');

// Fresh reading at boundary: 119 seconds ago
const boundaryTimestamp = now - 119000;
if (!isLocationFresh(boundaryTimestamp, LOCATION_MAX_AGE_MS)) {
  throw new Error('Timestamp at 119s was incorrectly marked as stale!');
}
console.log('  ✓ Timestamp 119s old is marked fresh.');

// Stale reading: 121 seconds ago
const staleTimestamp = now - 121000;
if (isLocationFresh(staleTimestamp, LOCATION_MAX_AGE_MS)) {
  throw new Error('Stale timestamp (121s old) was incorrectly marked as fresh!');
}
console.log('  ✓ Timestamp 121s old is correctly identified as stale.');

// Stale reading: 1 hour ago
const veryStaleTimestamp = now - 3600000;
if (isLocationFresh(veryStaleTimestamp, LOCATION_MAX_AGE_MS)) {
  throw new Error('Timestamp 1 hour old was incorrectly marked as fresh!');
}
console.log('  ✓ Timestamp 1 hour old is correctly identified as stale.');
console.log('✓ Test 2 Passed: 120s freshness window validated.\n');

// 3. Test formatLocationFix
console.log('[TEST 3] Testing formatLocationFix Normalization...');
const mockRawPosition = {
  coords: {
    latitude: 19.0760,
    longitude: 72.8777,
    accuracy: 14.8,
    heading: 90,
    speed: 1.2,
    altitude: 25.0
  },
  timestamp: now - 5000 // 5 seconds ago
};

const formatted = formatLocationFix(mockRawPosition);
console.log('  Formatted fix output:', JSON.stringify(formatted, null, 2));

if (formatted.latitude !== 19.0760 || formatted.longitude !== 72.8777) {
  throw new Error('Coordinates altered during formatting!');
}
if (formatted.accuracy !== 14.8) {
  throw new Error('Accuracy altered during formatting!');
}
if (formatted.accuracyCategory !== 'high') {
  throw new Error(`Expected accuracyCategory 'high', got '${formatted.accuracyCategory}'`);
}
if (!formatted.isFresh || formatted.isStale) {
  throw new Error('5s old fix should be fresh, not stale!');
}
if (formatted.ageMs < 4000 || formatted.ageMs > 6000) {
  throw new Error(`ageMs calculated incorrectly: ${formatted.ageMs}`);
}
console.log('✓ Test 3 Passed: formatLocationFix output structure verified.\n');

// 4. Test formatLocationFix with Poor and Stale Reading
console.log('[TEST 4] Testing formatLocationFix with Poor Accuracy & Stale Timestamp...');
const mockStalePosition = {
  coords: {
    latitude: 12.9716,
    longitude: 77.5946,
    accuracy: 350.0 // Coarse cell tower fix
  },
  timestamp: now - 300000 // 5 minutes ago
};

const formattedStale = formatLocationFix(mockStalePosition);
if (formattedStale.accuracyCategory !== 'poor') {
  throw new Error(`Expected accuracyCategory 'poor', got '${formattedStale.accuracyCategory}'`);
}
if (formattedStale.isFresh || !formattedStale.isStale) {
  throw new Error('5 minute old fix must be identified as stale!');
}
console.log('  ✓ 350m accuracy correctly categorized as "poor"');
console.log('  ✓ 5m old fix correctly identified as "stale"');
console.log('✓ Test 4 Passed: Poor/Stale fix properly tagged without discarding.\n');

console.log('=== ALL GPS ENGINE TESTS PASSED WITH 0 ERRORS ===\n');
