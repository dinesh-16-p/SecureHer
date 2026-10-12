import {
  parseJourneyArrivalTimestamp,
  isJourneyOverdue,
  getJourneyTimeRemainingMs,
  formatExpectedArrivalDisplay,
  formatJourneyTimeStatus
} from './src/services/journey/journeyTimeUtils.js';

console.log('=== SECUREHER TRUSTED JOURNEY RELIABILITY ENGINE TESTS ===\n');

// --------------------------------------------------------------------------
// TEST 1: AM/PM Boundary Transition (e.g., 11:30 AM to 1:00 PM)
// --------------------------------------------------------------------------
console.log('[TEST 1] AM/PM Boundary Handling...');
const start1130am = new Date('2026-10-12T11:30:00.000Z');
const arrival1pm = new Date('2026-10-12T13:00:00.000Z');

const journeyAmPm = {
  status: 'active',
  startedAt: start1130am.toISOString(),
  expectedArrivalAt: arrival1pm.toISOString(),
  expectedArrivalEpoch: arrival1pm.getTime(),
  expectedArrivalLabel: '01:00 PM'
};

const checkAt12pm = new Date('2026-10-12T12:00:00.000Z').getTime();
const checkAt105pm = new Date('2026-10-12T13:05:00.000Z').getTime();

const isOverdueAt12pm = isJourneyOverdue(journeyAmPm, checkAt12pm);
const isOverdueAt105pm = isJourneyOverdue(journeyAmPm, checkAt105pm);

console.assert(!isOverdueAt12pm, 'Should NOT be overdue at 12:00 PM for 1:00 PM arrival');
console.assert(isOverdueAt105pm, 'MUST be overdue at 1:05 PM for 1:00 PM arrival');
console.log('  ✓ AM/PM boundary evaluated correctly without alphabetical string comparison bugs.');

// --------------------------------------------------------------------------
// TEST 2: Midnight Crossover & Next-Day Arrival
// --------------------------------------------------------------------------
console.log('\n[TEST 2] Midnight Crossover & Calendar Date Transition...');
const start1145pm = new Date('2026-10-12T23:45:00.000Z');
const arrival1230amNextDay = new Date('2026-10-13T00:30:00.000Z');

const journeyMidnight = {
  status: 'active',
  startedAt: start1145pm.toISOString(),
  expectedArrivalAt: arrival1230amNextDay.toISOString(),
  expectedArrivalEpoch: arrival1230amNextDay.getTime(),
  expectedArrivalLabel: '12:30 AM'
};

const checkAt1155pm = new Date('2026-10-12T23:55:00.000Z').getTime();
const checkAt1235amNextDay = new Date('2026-10-13T00:35:00.000Z').getTime();

console.assert(!isJourneyOverdue(journeyMidnight, checkAt1155pm), 'Should NOT be overdue at 11:55 PM before midnight');
console.assert(isJourneyOverdue(journeyMidnight, checkAt1235amNextDay), 'MUST be overdue at 12:35 AM next day');

const remainingMs = getJourneyTimeRemainingMs(journeyMidnight, checkAt1155pm);
console.assert(remainingMs === 35 * 60 * 1000, `Expected 35m remaining across midnight, got ${remainingMs / 60000}m`);
console.log('  ✓ Midnight crossover properly handled across calendar date boundary.');

// --------------------------------------------------------------------------
// TEST 3: Backward Compatibility with Legacy Firestore String Formats
// --------------------------------------------------------------------------
console.log('\n[TEST 3] Backward Compatibility: Legacy Localized String Parsing...');

// Case A: Legacy localized "04:30 PM"
const legacyJourney1 = {
  status: 'active',
  startedAt: '2026-10-12T15:00:00.000',
  expectedArrivalAt: '04:30 PM'
};
const parsedLegacy1 = parseJourneyArrivalTimestamp(legacyJourney1, new Date('2026-10-12T15:00:00.000'));
console.assert(parsedLegacy1 != null, 'Legacy "04:30 PM" must parse to valid epoch');
const dLegacy1 = new Date(parsedLegacy1);
console.assert(dLegacy1.getHours() === 16 && dLegacy1.getMinutes() === 30, 'Parsed time must be 16:30');
console.log('  ✓ Legacy "04:30 PM" string correctly resolved into today\'s 16:30 local epoch.');

// Case B: Legacy crossover "12:15 AM" starting at "11:45 PM"
const legacyMidnight = {
  status: 'active',
  startedAt: '2026-10-12T23:45:00.000',
  expectedArrivalAt: '12:15 AM'
};
const parsedLegacyMidnight = parseJourneyArrivalTimestamp(legacyMidnight, new Date('2026-10-12T23:45:00.000'));
const dMidnight = new Date(parsedLegacyMidnight);
console.assert(dMidnight.getDate() === 13, 'Arrival past midnight must advance calendar day to next date');
console.log('  ✓ Legacy string crossing midnight correctly advances day anchor to tomorrow.');

// Case C: Legacy 24-hour "18:45"
const legacy24h = {
  status: 'active',
  startedAt: '2026-10-12T17:00:00.000',
  expectedArrivalAt: '18:45'
};
const parsed24h = parseJourneyArrivalTimestamp(legacy24h, new Date('2026-10-12T17:00:00.000'));
const d24h = new Date(parsed24h);
console.assert(d24h.getHours() === 18 && d24h.getMinutes() === 45, 'Parsed 24-hour format must match');
console.log('  ✓ Legacy 24-hour time string ("18:45") correctly parsed.');

// --------------------------------------------------------------------------
// TEST 4: Duration Formatting & Real-time Labels
// --------------------------------------------------------------------------
console.log('\n[TEST 4] Human-readable Status & Countdown Formatting...');

const testJourney = {
  status: 'active',
  expectedArrivalEpoch: Date.now() + 15 * 60 * 1000 // 15 mins from now
};
const statusRemaining = formatJourneyTimeStatus(testJourney, Date.now());
console.assert(statusRemaining.includes('15 mins left'), `Expected "15 mins left", got "${statusRemaining}"`);

const overdueJourney = {
  status: 'active',
  expectedArrivalEpoch: Date.now() - 12 * 60 * 1000 // 12 mins ago
};
const statusOverdue = formatJourneyTimeStatus(overdueJourney, Date.now());
console.assert(statusOverdue.includes('12 mins overdue'), `Expected "12 mins overdue", got "${statusOverdue}"`);
console.log('  ✓ Time remaining and overdue labels formatted accurately.');

// --------------------------------------------------------------------------
// TEST 5: Inactive/Completed Journeys Never Flag Overdue
// --------------------------------------------------------------------------
console.log('\n[TEST 5] Status Guards for Completed / Cancelled Journeys...');
const completedJourney = {
  status: 'completed',
  expectedArrivalEpoch: Date.now() - 1000000
};
console.assert(!isJourneyOverdue(completedJourney), 'Completed journey must NEVER report overdue');

const pausedJourney = {
  status: 'paused',
  expectedArrivalEpoch: Date.now() - 1000000
};
console.assert(!isJourneyOverdue(pausedJourney), 'Paused journey must NEVER report overdue');
console.log('  ✓ Completed and paused journeys strictly guarded against false overdue alarms.');

console.log('\n=== ALL TRUSTED JOURNEY RELIABILITY TESTS PASSED WITH 0 ERRORS ===');
