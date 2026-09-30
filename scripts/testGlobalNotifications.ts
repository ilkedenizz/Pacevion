import { LiveRaceTracker } from '../src/services/liveRaceTracker';
import { LiveNotificationStore } from '../src/services/liveNotificationStore';
import type { ResultRace, Race, PitStop } from '../src/api/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n--- TESTING GLOBAL LIVE TRACKING & NOTIFICATIONS ---\n');

// 1. Isolated Store & Tracker Initialization
console.log('1. Store & Tracker Initialization:');
const testStore = new LiveNotificationStore();
const testTracker = new LiveRaceTracker(testStore);

assert(testStore.getNotifications().length === 0, 'Initial notification store is empty');
assert(testStore.getUnreadCount() === 0, 'Initial unread count is 0');

// 2. Session Start Event Detection
console.log('\n2. Session Start Detection:');
const mockRace: Race = {
  season: '2026',
  round: '1',
  raceName: 'Australian Grand Prix',
  date: '2026-03-15',
  time: '04:00:00Z',
  url: '',
  Circuit: { circuitId: 'albert_park', circuitName: 'Albert Park', url: '', Location: { lat: '0', long: '0', locality: 'Melbourne', country: 'Australia' } }
};

const started = testTracker.trackSessionStart(mockRace, 'Race');
assert(started === true, 'Session start emitted successfully');
assert(testStore.getNotifications().length === 1, 'Notification added to store');
assert(testStore.getUnreadCount() === 1, 'Unread count is 1');
assert(testStore.getNotifications()[0].type === 'START', 'Notification type is START');

// Duplicate start event is ignored
const duplicateStart = testTracker.trackSessionStart(mockRace, 'Race');
assert(duplicateStart === false, 'Duplicate session start was suppressed');
assert(testStore.getNotifications().length === 1, 'Store length remained 1');
assert(testStore.getUnreadCount() === 1, 'Unread count remains 1');

// 3. Live Telemetry Processing & Leader Change
console.log('\n3. Telemetry Processing (Leader Change & Fastest Lap):');
const mockLap10: ResultRace = {
  ...mockRace,
  Results: [
    {
      number: '4', position: '1', positionText: '1', points: '25', grid: '2', laps: '10', status: 'Finished',
      Driver: { driverId: 'norris', givenName: 'Lando', familyName: 'Norris', dateOfBirth: '1999-11-13', nationality: 'British', url: '' },
      Constructor: { constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' },
      FastestLap: { rank: '1', lap: '8', Time: { time: '1:19.456' } }
    },
    {
      number: '16', position: '2', positionText: '2', points: '18', grid: '1', laps: '10', status: 'Finished',
      Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc', dateOfBirth: '1997-10-16', nationality: 'Monegasque', url: '' },
      Constructor: { constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' }
    }
  ]
};

testTracker.processRaceResults(mockLap10);
// First classification sets baseline
assert(testStore.getNotifications().length === 1, 'Initial baseline sets snapshot without false alerts');

// Lap 11: Leclerc overtakes Norris for lead & takes fastest lap
const mockLap11: ResultRace = {
  ...mockRace,
  Results: [
    {
      number: '16', position: '1', positionText: '1', points: '25', grid: '1', laps: '11', status: 'Finished',
      Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc', dateOfBirth: '1997-10-16', nationality: 'Monegasque', url: '' },
      Constructor: { constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' },
      FastestLap: { rank: '1', lap: '11', Time: { time: '1:18.990' } }
    },
    {
      number: '4', position: '2', positionText: '2', points: '18', grid: '2', laps: '11', status: 'Finished',
      Driver: { driverId: 'norris', givenName: 'Lando', familyName: 'Norris', dateOfBirth: '1999-11-13', nationality: 'British', url: '' },
      Constructor: { constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' }
    }
  ]
};

testTracker.processRaceResults(mockLap11);
const notifsAfterLap11 = testStore.getNotifications();
assert(notifsAfterLap11.some(n => n.type === 'LEADER' && n.driverId === 'leclerc'), 'LEADER change notification generated for Leclerc');
assert(notifsAfterLap11.some(n => n.type === 'FASTEST_LAP' && n.driverId === 'leclerc'), 'FASTEST_LAP notification generated for Leclerc');

// 4. Pit Stop Event Processing
console.log('\n4. Pit Stop Event Processing:');
const mockPits: PitStop[] = [
  { driverId: 'norris', lap: '12', stop: '1', time: '14:25:30', duration: '2.4' }
];

testTracker.processPitStops('2026', '1', 'Australian Grand Prix', mockPits);
assert(testStore.getNotifications().some(n => n.type === 'PIT' && n.driverId === 'norris'), 'PIT stop notification added for Norris');

// Duplicate pit stop feed
testTracker.processPitStops('2026', '1', 'Australian Grand Prix', mockPits);
const pitNotifsCount = testStore.getNotifications().filter(n => n.type === 'PIT' && n.driverId === 'norris').length;
assert(pitNotifsCount === 1, 'Duplicate pit stop is strictly deduplicated');

// 5. Retirement (DNF) Detection
console.log('\n5. DNF Detection:');
const mockLap15DNF: ResultRace = {
  ...mockRace,
  Results: [
    {
      number: '16', position: '1', positionText: '1', points: '25', grid: '1', laps: '15', status: 'Finished',
      Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc', dateOfBirth: '1997-10-16', nationality: 'Monegasque', url: '' },
      Constructor: { constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' }
    },
    {
      number: '4', position: '19', positionText: 'R', points: '0', grid: '2', laps: '13', status: 'Engine',
      Driver: { driverId: 'norris', givenName: 'Lando', familyName: 'Norris', dateOfBirth: '1999-11-13', nationality: 'British', url: '' },
      Constructor: { constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' }
    }
  ]
};

testTracker.processRaceResults(mockLap15DNF);
assert(testStore.getNotifications().some(n => n.type === 'DNF' && n.driverId === 'norris'), 'DNF notification generated for Norris engine retirement');

// 6. Notification Center Actions: Mark Read & Clear All
console.log('\n6. Mark as Read & Clear Actions:');
const unreadBefore = testStore.getUnreadCount();
assert(unreadBefore > 0, `Unread count is ${unreadBefore}`);

const firstNotif = testStore.getNotifications()[0];
testStore.markAsRead(firstNotif.id);
assert(testStore.getUnreadCount() === unreadBefore - 1, 'Marking single notification as read decrements unread count by 1');

testStore.markAllAsRead();
assert(testStore.getUnreadCount() === 0, 'markAllAsRead sets unread count to 0');
assert(testStore.getNotifications().every(n => n.read === true), 'All notifications have read = true');

testStore.clearAll();
assert(testStore.getNotifications().length === 0, 'clearAll removes all notifications');
assert(testStore.getUnreadCount() === 0, 'Unread count is 0 after clearAll');

console.log(`\n========================================`);
if (failed === 0) {
  console.log(`ALL ${passed} GLOBAL NOTIFICATION TESTS PASSED!`);
  process.exit(0);
} else {
  console.error(`FAILED: ${failed} test(s) failed out of ${passed + failed}`);
  process.exit(1);
}
