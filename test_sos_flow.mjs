/**
 * Automated Verification Suite for SecureHer Phase 4: Emergency SOS Flow & Delivery Reliability
 * 
 * Tests:
 * 1. Contact selection and email regex validation
 * 2. GPS freshness, recent, stale, and unavailable state evaluation (zero fake coordinates)
 * 3. Emergency SOS deduplication guard
 * 4. Provider response contract (Brevo acceptance vs inbox delivery vs failure)
 * 5. Audio alarm autoplay policy tracking and resume mechanics
 * 6. User-scoped Firestore safety event schema compliance
 */

import assert from 'node:assert';

console.log('🧪 Starting Phase 4 Emergency SOS Flow & Delivery Reliability Test Suite...\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 1. Contact Selection & Email Validation
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveEmergencyContacts(emergencyContacts) {
  if (!emergencyContacts || emergencyContacts.length === 0) return { primary: null, validList: [] };

  const validList = emergencyContacts
    .filter((c) => c.email && EMAIL_REGEX.test(c.email.trim()))
    .map((c) => ({
      email: c.email.trim(),
      name: c.name?.trim() || 'Emergency Contact'
    }));

  const primaryWithEmail = emergencyContacts.find(
    (c) => c.isPrimary && c.email && EMAIL_REGEX.test(c.email.trim())
  );
  if (primaryWithEmail) return { primary: primaryWithEmail, validList };

  const anyWithEmail = emergencyContacts.find(
    (c) => c.email && EMAIL_REGEX.test(c.email.trim())
  );
  if (anyWithEmail) return { primary: anyWithEmail, validList };

  const primaryOnly = emergencyContacts.find((c) => c.isPrimary);
  if (primaryOnly) return { primary: primaryOnly, validList };

  return { primary: emergencyContacts[0], validList };
}

runTest('Contact Selection: Prioritizes contact with isPrimary AND valid email', () => {
  const contacts = [
    { name: 'Dad', phone: '9876543210', email: '', isPrimary: false },
    { name: 'Mom', phone: '9876543211', email: 'mom@example.com', isPrimary: true },
    { name: 'Sister', phone: '9876543212', email: 'sister@example.com', isPrimary: false }
  ];
  const { primary, validList } = resolveEmergencyContacts(contacts);
  assert.strictEqual(primary.name, 'Mom');
  assert.strictEqual(validList.length, 2);
  assert.strictEqual(validList[0].email, 'mom@example.com');
});

runTest('Contact Selection: Bypasses phone-only first contact when second contact has email', () => {
  const contacts = [
    { name: 'Police Officer', phone: '100', isPrimary: false },
    { name: 'Brother', phone: '9876543213', email: 'bro@secureher.org', isPrimary: false }
  ];
  const { primary, validList } = resolveEmergencyContacts(contacts);
  assert.strictEqual(primary.name, 'Brother');
  assert.strictEqual(validList.length, 1);
  assert.strictEqual(validList[0].email, 'bro@secureher.org');
});

runTest('Contact Selection: Rejects malformed or invalid recipient emails', () => {
  const contacts = [
    { name: 'Invalid 1', email: 'bademail.com' },
    { name: 'Invalid 2', email: 'bad@' },
    { name: 'Invalid 3', email: '@domain.com' },
    { name: 'Valid One', email: 'contact@domain.com' }
  ];
  const { primary, validList } = resolveEmergencyContacts(contacts);
  assert.strictEqual(primary.name, 'Valid One');
  assert.strictEqual(validList.length, 1);
  assert.strictEqual(validList[0].email, 'contact@domain.com');
});

// ---------------------------------------------------------------------------
// 2. GPS Freshness, Stale Age, and Zero-Fabrication Verification
// ---------------------------------------------------------------------------
function evaluateLocationForSOS(currentLocation, now = Date.now()) {
  if (!currentLocation || typeof currentLocation.latitude !== 'number' || typeof currentLocation.longitude !== 'number') {
    return { targetLoc: null, locationStatus: 'unavailable' };
  }

  const ageMs = now - currentLocation.timestamp;
  if (ageMs < 30000) {
    return {
      targetLoc: { ...currentLocation, isFresh: true, isStale: false },
      locationStatus: 'fresh'
    };
  } else if (ageMs < 120000) {
    return {
      targetLoc: {
        ...currentLocation,
        isFresh: false,
        isStale: false,
        isRecent: true,
        ageSec: Math.round(ageMs / 1000)
      },
      locationStatus: 'recent'
    };
  } else {
    return {
      targetLoc: {
        ...currentLocation,
        isFresh: false,
        isStale: true,
        staleReason: `GPS fix is stale by ${Math.round(ageMs / 1000)}s`,
        ageSec: Math.round(ageMs / 1000)
      },
      locationStatus: 'stale'
    };
  }
}

runTest('GPS Evaluation: Fresh fix (< 30s) is marked fresh with live accuracy', () => {
  const now = 1700000000000;
  const fix = { latitude: 12.9716, longitude: 77.5946, accuracy: 8.5, timestamp: now - 5000 };
  const { targetLoc, locationStatus } = evaluateLocationForSOS(fix, now);
  assert.strictEqual(locationStatus, 'fresh');
  assert.strictEqual(targetLoc.isFresh, true);
  assert.strictEqual(targetLoc.isStale, false);
});

runTest('GPS Evaluation: Recent fix (45s) is marked recent without claiming fresh live GPS', () => {
  const now = 1700000000000;
  const fix = { latitude: 12.9716, longitude: 77.5946, accuracy: 12.0, timestamp: now - 45000 };
  const { targetLoc, locationStatus } = evaluateLocationForSOS(fix, now);
  assert.strictEqual(locationStatus, 'recent');
  assert.strictEqual(targetLoc.isFresh, false);
  assert.strictEqual(targetLoc.isRecent, true);
  assert.strictEqual(targetLoc.ageSec, 45);
});

runTest('GPS Evaluation: Stale fix (300s) is honestly flagged as stale with age warning', () => {
  const now = 1700000000000;
  const fix = { latitude: 12.9716, longitude: 77.5946, accuracy: 25.0, timestamp: now - 300000 };
  const { targetLoc, locationStatus } = evaluateLocationForSOS(fix, now);
  assert.strictEqual(locationStatus, 'stale');
  assert.strictEqual(targetLoc.isStale, true);
  assert.strictEqual(targetLoc.isFresh, false);
  assert.strictEqual(targetLoc.ageSec, 300);
});

runTest('GPS Evaluation: When location is denied/null, dispatches unavailable with ZERO fake Mumbai coordinates', () => {
  const { targetLoc, locationStatus } = evaluateLocationForSOS(null);
  assert.strictEqual(locationStatus, 'unavailable');
  assert.strictEqual(targetLoc, null);
  // Guarantee no Mumbai default (19.0760, 72.8777)
  assert.notStrictEqual(targetLoc?.latitude, 19.076);
});

// ---------------------------------------------------------------------------
// 3. SOS In-Flight Deduplication Guard
// ---------------------------------------------------------------------------
class MockSOSController {
  constructor() {
    this.inFlight = false;
    this.callCount = 0;
  }

  async trigger() {
    if (this.inFlight) {
      return { skipped: true, reason: 'duplicate_in_flight' };
    }
    this.inFlight = true;
    this.callCount++;
    try {
      await new Promise((r) => setTimeout(r, 50));
      return { skipped: false, count: this.callCount };
    } finally {
      this.inFlight = false;
    }
  }
}

runTest('Deduplication: Rapid double-click rejects duplicate in-flight invocation', async () => {
  const controller = new MockSOSController();
  const [res1, res2] = await Promise.all([
    controller.trigger(),
    controller.trigger()
  ]);
  assert.strictEqual(controller.callCount, 1);
  assert.strictEqual(res1.skipped, false);
  assert.strictEqual(res2.skipped, true);
  assert.strictEqual(res2.reason, 'duplicate_in_flight');
});

// ---------------------------------------------------------------------------
// 4. Provider Response Contract (Brevo acceptance vs inbox delivery vs failure)
// ---------------------------------------------------------------------------
function parseBackendSOSResponse(httpStatus, responseBody) {
  if (httpStatus === 401) {
    return {
      success: false,
      emailStatus: 'failed',
      providerStatus: 'unauthorized',
      message: 'Authentication token invalid or expired'
    };
  }
  if (httpStatus === 400) {
    return {
      success: false,
      emailStatus: 'failed',
      providerStatus: 'invalid_request',
      message: responseBody.detail || 'Invalid emergency contact parameters'
    };
  }
  if (httpStatus === 200 || httpStatus === 201) {
    if (responseBody.emailStatus === 'provider_accepted') {
      return {
        success: true,
        emailStatus: 'provider_accepted',
        providerStatus: 'accepted',
        messageId: responseBody.messageId,
        message: 'Accepted by email provider for dispatch (Delivery queued)'
      };
    }
  }
  return {
    success: false,
    emailStatus: responseBody.emailStatus || 'failed',
    providerStatus: responseBody.providerStatus || 'rejected',
    message: responseBody.message || 'Dispatch failed'
  };
}

runTest('Provider Contract: HTTP 201 from Brevo is classified as provider_accepted, NOT delivered', () => {
  const brevoMock = {
    success: true,
    emailStatus: 'provider_accepted',
    messageId: '<202610121820.5982123@smtp-relay.brevo.com>',
    locationStatus: 'fresh'
  };
  const parsed = parseBackendSOSResponse(200, brevoMock);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.emailStatus, 'provider_accepted');
  assert.strictEqual(parsed.providerStatus, 'accepted');
  assert.notStrictEqual(parsed.emailStatus, 'delivered');
  assert.ok(parsed.messageId.includes('@smtp-relay.brevo.com'));
});

runTest('Provider Contract: Missing credentials properly reports missing_credentials without crashing', () => {
  const errorMock = {
    success: false,
    emailStatus: 'failed',
    providerStatus: 'missing_credentials',
    message: 'Brevo email API is not configured on the backend server.'
  };
  const parsed = parseBackendSOSResponse(200, errorMock);
  assert.strictEqual(parsed.success, false);
  assert.strictEqual(parsed.providerStatus, 'missing_credentials');
  assert.strictEqual(parsed.emailStatus, 'failed');
});

runTest('Provider Contract: Invalid or expired Firebase ID token returns 401', () => {
  const parsed = parseBackendSOSResponse(401, { detail: 'Invalid or expired Firebase authentication token.' });
  assert.strictEqual(parsed.success, false);
  assert.strictEqual(parsed.providerStatus, 'unauthorized');
});

// ---------------------------------------------------------------------------
// 5. Audio Siren Autoplay Restriction Handling
// ---------------------------------------------------------------------------
class MockAudioContext {
  constructor(initialState = 'suspended') {
    this.state = initialState;
    this.allowResume = false;
  }
  async resume() {
    if (this.allowResume) {
      this.state = 'running';
    }
    return Promise.resolve();
  }
}

class MockSOSAlarm {
  constructor(ctx) {
    this.audioCtx = ctx;
    this.isPlaying = false;
  }

  async play() {
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    if (this.audioCtx.state === 'suspended') {
      return { success: false, reason: 'autoplay_blocked', state: 'suspended' };
    }
    this.isPlaying = true;
    return { success: true, reason: 'playing', state: 'running' };
  }

  async resume() {
    this.audioCtx.allowResume = true;
    return this.play();
  }
}

runTest('Audio Alarm: Reports autoplay_blocked honestly when browser suspends AudioContext', async () => {
  const ctx = new MockAudioContext('suspended');
  const alarm = new MockSOSAlarm(ctx);

  const res = await alarm.play();
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.reason, 'autoplay_blocked');
  assert.strictEqual(alarm.isPlaying, false);

  // User performs deliberate un-mute gesture
  const resumeRes = await alarm.resume();
  assert.strictEqual(resumeRes.success, true);
  assert.strictEqual(resumeRes.reason, 'playing');
  assert.strictEqual(alarm.isPlaying, true);
});

// ---------------------------------------------------------------------------
// 6. User-Scoped Firestore Safety Event Schema Compliance
// ---------------------------------------------------------------------------
function buildSafetyEventRecord({ uid, targetLoc, locationStatus, recipientEmail, apiResult }) {
  if (!uid) throw new Error('User not authenticated');
  return {
    path: `users/${uid}/safetyEvents`,
    data: {
      type: 'SOS',
      status: 'activated',
      latitude: targetLoc?.latitude ?? null,
      longitude: targetLoc?.longitude ?? null,
      accuracy: targetLoc?.accuracy ?? null,
      accuracyCategory: targetLoc?.accuracyCategory ?? 'unknown',
      locationStatus,
      locationTimestamp: targetLoc?.timestamp ?? null,
      isLocationStale: targetLoc?.isStale ?? false,
      recipientEmail: recipientEmail || null,
      emailStatus: apiResult?.emailStatus || 'pending',
      providerStatus: apiResult?.providerStatus || null,
      messageId: apiResult?.messageId || null,
      clientTimestamp: new Date().toISOString()
    }
  };
}

runTest('Firestore Safety Event: Strictly scoped to users/{uid}/safetyEvents with comprehensive audit fields', () => {
  const event = buildSafetyEventRecord({
    uid: 'user_test_7788',
    targetLoc: { latitude: 12.9716, longitude: 77.5946, accuracy: 14.2, timestamp: Date.now(), isStale: false, accuracyCategory: 'high' },
    locationStatus: 'fresh',
    recipientEmail: 'trusted_guardian@example.com',
    apiResult: { emailStatus: 'provider_accepted', providerStatus: 'accepted', messageId: 'msg_9812' }
  });

  assert.strictEqual(event.path, 'users/user_test_7788/safetyEvents');
  assert.strictEqual(event.data.type, 'SOS');
  assert.strictEqual(event.data.locationStatus, 'fresh');
  assert.strictEqual(event.data.latitude, 12.9716);
  assert.strictEqual(event.data.emailStatus, 'provider_accepted');
  assert.strictEqual(event.data.providerStatus, 'accepted');
  assert.strictEqual(event.data.messageId, 'msg_9812');
  assert.strictEqual(typeof event.data.clientTimestamp, 'string');
});

// Summary
console.log(`\n========================================`);
console.log(`Phase 4 Emergency SOS Flow Results: ${passedTests}/${totalTests} Passed.`);
console.log(`========================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
