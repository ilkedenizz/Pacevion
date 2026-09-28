// src/services/__tests__/liveRaceTracker.test.ts
import { LiveNotificationStore } from '../liveNotificationStore';
import { LiveRaceTracker } from '../liveRaceTracker';
import type { ResultRace, Race, PitStop } from '../../api/types';

function createMockDriver(id: string, code: string, first: string, last: string) {
  return {
    driverId: id,
    code,
    givenName: first,
    familyName: last,
    dateOfBirth: '1990-01-01',
    nationality: 'Mock',
    url: ''
  };
}

function createMockConstructor(id: string, name: string) {
  return {
    constructorId: id,
    name,
    nationality: 'Mock',
    url: ''
  };
}

const driverVER = createMockDriver('max_verstappen', 'VER', 'Max', 'Verstappen');
const driverNOR = createMockDriver('norris', 'NOR', 'Lando', 'Norris');
const driverLEC = createMockDriver('leclerc', 'LEC', 'Charles', 'Leclerc');
const driverHAM = createMockDriver('hamilton', 'HAM', 'Lewis', 'Hamilton');
const driverPIA = createMockDriver('piastri', 'PIA', 'Oscar', 'Piastri');
const driverRUS = createMockDriver('russell', 'RUS', 'George', 'Russell');
const driverSAI = createMockDriver('sainz', 'SAI', 'Carlos', 'Sainz');
const driverALO = createMockDriver('alonso', 'ALO', 'Fernando', 'Alonso');
const driverPER = createMockDriver('perez', 'PER', 'Sergio', 'Perez');
const driverTSU = createMockDriver('tsunoda', 'TSU', 'Yuki', 'Tsunoda');

const teamRedBull = createMockConstructor('red_bull', 'Red Bull Racing');
const teamMcLaren = createMockConstructor('mclaren', 'McLaren');
const teamFerrari = createMockConstructor('ferrari', 'Ferrari');
const teamMercedes = createMockConstructor('mercedes', 'Mercedes');
const teamAston = createMockConstructor('aston_martin', 'Aston Martin');
const teamRB = createMockConstructor('rb', 'RB');

export function runAllTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, desc: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${desc}`);
    } else {
      failed++;
      errors.push(desc);
      console.error(`  ✗ FAIL: ${desc}`);
    }
  }

  console.log('\n--- Running Live Race Tracker & Notification Store Test Suite ---\n');

  // Test 1: Empty race
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tracker.processRaceResults({} as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tracker.processRaceResults({ Results: [] } as any);
    assert(store.getNotifications().length === 0, 'Scenario 1: Empty race produces 0 notifications');
  }

  // Test 2: Race start
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);
    const mockRace: Race = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: {
        circuitId: 'albert_park',
        circuitName: 'Albert Park Circuit',
        url: '',
        Location: { lat: '-37.8497', long: '144.968', locality: 'Melbourne', country: 'Australia' }
      }
    };

    tracker.trackSessionStart(mockRace, 'Race');
    assert(store.getNotifications().length === 1, 'Scenario 2: Race start generates 1 notification');
    assert(store.getNotifications()[0].type === 'START', 'Scenario 2: Notification type is START');

    // Duplicate session start in same race
    tracker.trackSessionStart(mockRace, 'Race');
    assert(store.getNotifications().length === 1, 'Scenario 2: Duplicate race start is ignored');
  }

  // Test 3: Lap 1 Grouped summary
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    const lap1Data: ResultRace = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: 'Albert Park', url: '', Location: { lat: '', long: '', locality: 'Melbourne', country: 'Australia' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: '1', status: 'Running', Driver: driverVER, Constructor: teamRedBull },
        { number: '4', position: '2', positionText: '2', points: '0', grid: '4', laps: '1', status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
        { number: '16', position: '3', positionText: '3', points: '0', grid: '2', laps: '1', status: 'Running', Driver: driverLEC, Constructor: teamFerrari },
        { number: '81', position: '4', positionText: '4', points: '0', grid: '3', laps: '1', status: 'Running', Driver: driverPIA, Constructor: teamMcLaren },
      ]
    };

    tracker.processRaceResults(lap1Data);
    const notifs = store.getNotifications();
    const lap1Notif = notifs.find(n => n.type === 'FIRST_LAPS' && n.lap === 1);
    assert(!!lap1Notif, 'Scenario 3: Lap 1 generates grouped FIRST_LAPS summary');
    assert(!notifs.some(n => n.type === 'LEADER'), 'Scenario 3: Initial baseline leader does not trigger LEADER change alert');
  }

  // Test 4 & 5: Lap 2 & Lap 3 Grouped summaries
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    const baseResults = (lap: number, posNOR: string, posLEC: string) => ({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: 'Albert Park', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: String(lap), status: 'Running', Driver: driverVER, Constructor: teamRedBull },
        { number: '4', position: posNOR, positionText: posNOR, points: '0', grid: '4', laps: String(lap), status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
        { number: '16', position: posLEC, positionText: posLEC, points: '0', grid: '2', laps: String(lap), status: 'Running', Driver: driverLEC, Constructor: teamFerrari },
      ]
    });

    tracker.processRaceResults(baseResults(1, '2', '3'));
    tracker.processRaceResults(baseResults(2, '3', '2'));
    tracker.processRaceResults(baseResults(3, '2', '3'));

    const lap2 = store.getNotifications().find(n => n.type === 'FIRST_LAPS' && n.lap === 2);
    const lap3 = store.getNotifications().find(n => n.type === 'FIRST_LAPS' && n.lap === 3);
    assert(!!lap2, 'Scenario 4: Lap 2 generates grouped FIRST_LAPS summary');
    assert(!!lap3, 'Scenario 5: Lap 3 generates grouped FIRST_LAPS summary');
  }

  // Test 6: Leader change
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    // Initial leader VER
    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: '5', status: 'Running', Driver: driverVER, Constructor: teamRedBull },
        { number: '4', position: '2', positionText: '2', points: '0', grid: '2', laps: '5', status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
      ]
    });

    assert(store.getNotifications().filter(n => n.type === 'LEADER').length === 0, 'Scenario 6: Baseline leader generates 0 alerts');

    // NOR takes the lead on lap 6
    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '4', position: '1', positionText: '1', points: '0', grid: '2', laps: '6', status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
        { number: '1', position: '2', positionText: '2', points: '0', grid: '1', laps: '6', status: 'Running', Driver: driverVER, Constructor: teamRedBull },
      ]
    });

    const leaderNotifs = store.getNotifications().filter(n => n.type === 'LEADER');
    assert(leaderNotifs.length === 1, 'Scenario 6: Leader change creates exactly 1 LEADER alert');
    assert(leaderNotifs[0].driverId === 'norris', 'Scenario 6: Leader alert identifies Norris as new leader');
  }

  // Test 7: Fastest lap
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    // Baseline lap with fastest lap 1:20.000
    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: '10', status: 'Running', Driver: driverVER, Constructor: teamRedBull, FastestLap: { rank: '1', lap: '8', Time: { time: '1:20.000' } } },
      ]
    });

    assert(store.getNotifications().filter(n => n.type === 'FASTEST_LAP').length === 0, 'Scenario 7: Baseline fastest lap generates 0 alerts');

    // New fastest lap 1:19.450
    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '4', position: '1', positionText: '1', points: '0', grid: '1', laps: '12', status: 'Running', Driver: driverNOR, Constructor: teamMcLaren, FastestLap: { rank: '1', lap: '12', Time: { time: '1:19.450' } } },
      ]
    });

    const flNotifs = store.getNotifications().filter(n => n.type === 'FASTEST_LAP');
    assert(flNotifs.length === 1, 'Scenario 7: New fastest lap produces 1 alert');
    assert(flNotifs[0].message.includes('1:19.450'), 'Scenario 7: Fastest lap time is accurately reported in message');
  }

  // Test 8: Pit Stop
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    const mockPitStops: PitStop[] = [
      { driverId: 'max_verstappen', lap: '15', stop: '1', time: '14:25:30', duration: '22.4' }
    ];

    tracker.processPitStops('2026', '1', 'Australian Grand Prix', mockPitStops);
    const pitNotifs = store.getNotifications().filter(n => n.type === 'PIT');
    assert(pitNotifs.length === 1, 'Scenario 8: Pit stop generates 1 PIT alert');
    assert(pitNotifs[0].message.includes('pitted for stop #1'), 'Scenario 8: Pit message has correct stop details');

    // Duplicate pit stop feed
    tracker.processPitStops('2026', '1', 'Australian Grand Prix', mockPitStops);
    assert(store.getNotifications().filter(n => n.type === 'PIT').length === 1, 'Scenario 8: Duplicate pit stop feed produces no duplicates');
  }

  // Test 9: DNF / Retirements vs Lapped
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: '20', status: 'Finished', Driver: driverVER, Constructor: teamRedBull },
        { number: '4', position: '2', positionText: '2', points: '0', grid: '2', laps: '19', status: '+1 Lap', Driver: driverNOR, Constructor: teamMcLaren }, // Lapped, NOT DNF
        { number: '16', position: '3', positionText: 'R', points: '0', grid: '3', laps: '14', status: 'Engine', Driver: driverLEC, Constructor: teamFerrari }, // Genuine DNF
      ]
    });

    const dnfNotifs = store.getNotifications().filter(n => n.type === 'DNF');
    assert(dnfNotifs.length === 1, 'Scenario 9: Only genuine engine retirement generates DNF alert (lapped driver ignored)');
    assert(dnfNotifs[0].driverId === 'leclerc', 'Scenario 9: DNF driver is Leclerc');
  }

  // Test 10: Position gain (>3 places mid-race)
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    // Initial snapshot at lap 10
    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '44', position: '8', positionText: '8', points: '0', grid: '8', laps: '10', status: 'Running', Driver: driverHAM, Constructor: teamMercedes },
      ]
    });

    // HAM surges from P8 to P4 (+4 places) on lap 11
    tracker.processRaceResults({
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '44', position: '4', positionText: '4', points: '0', grid: '8', laps: '11', status: 'Running', Driver: driverHAM, Constructor: teamMercedes },
      ]
    });

    const overtakeNotifs = store.getNotifications().filter(n => n.type === 'OVERTAKE');
    assert(overtakeNotifs.length === 1, 'Scenario 10: Surging 4 places mid-race generates OVERTAKE alert');
  }

  // Test 11: Race Finish (Chequered flag)
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    const fullResults: ResultRace = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '25', grid: '1', laps: '58', status: 'Finished', Driver: driverVER, Constructor: teamRedBull },
        { number: '4', position: '2', positionText: '2', points: '18', grid: '2', laps: '58', status: 'Finished', Driver: driverNOR, Constructor: teamMcLaren },
        { number: '16', position: '3', positionText: '3', points: '15', grid: '3', laps: '58', status: 'Finished', Driver: driverLEC, Constructor: teamFerrari },
        { number: '81', position: '4', positionText: '4', points: '12', grid: '4', laps: '58', status: 'Finished', Driver: driverPIA, Constructor: teamMcLaren },
        { number: '44', position: '5', positionText: '5', points: '10', grid: '5', laps: '58', status: 'Finished', Driver: driverHAM, Constructor: teamMercedes },
        { number: '63', position: '6', positionText: '6', points: '8', grid: '6', laps: '58', status: 'Finished', Driver: driverRUS, Constructor: teamMercedes },
        { number: '55', position: '7', positionText: '7', points: '6', grid: '7', laps: '58', status: 'Finished', Driver: driverSAI, Constructor: teamFerrari },
        { number: '14', position: '8', positionText: '8', points: '4', grid: '8', laps: '58', status: 'Finished', Driver: driverALO, Constructor: teamAston },
        { number: '11', position: '9', positionText: '9', points: '2', grid: '9', laps: '58', status: 'Finished', Driver: driverPER, Constructor: teamRedBull },
        { number: '22', position: '10', positionText: '10', points: '1', grid: '10', laps: '57', status: '+1 Lap', Driver: driverTSU, Constructor: teamRB },
      ]
    };

    tracker.processRaceResults(fullResults);
    const finishNotifs = store.getNotifications().filter(n => n.type === 'FINISH');
    assert(finishNotifs.length === 1, 'Scenario 11: Race completion triggers 1 FINISH alert');

    // Repeated final payload does not duplicate finish
    tracker.processRaceResults(fullResults);
    assert(store.getNotifications().filter(n => n.type === 'FINISH').length === 1, 'Scenario 11: Duplicate final payload does not re-fire FINISH');
  }

  // Test 12: Duplicate API responses
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    const payload: ResultRace = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: '1', status: 'Running', Driver: driverVER, Constructor: teamRedBull },
        { number: '4', position: '2', positionText: '2', points: '0', grid: '5', laps: '1', status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
      ]
    };

    tracker.processRaceResults(payload);
    const countAfterFirst = store.getNotifications().length;

    tracker.processRaceResults(payload);
    tracker.processRaceResults(payload);
    assert(store.getNotifications().length === countAfterFirst, 'Scenario 12: Identical payloads over multiple calls produce 0 extra notifications');
  }

  // Test 13: Older API response (stale lap count ignored)
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    const lap15Data: ResultRace = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: '15', status: 'Running', Driver: driverVER, Constructor: teamRedBull },
      ]
    };

    const staleLap12Data: ResultRace = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
      Results: [
        { number: '4', position: '1', positionText: '1', points: '0', grid: '2', laps: '12', status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
      ]
    };

    tracker.processRaceResults(lap15Data);
    tracker.processRaceResults(staleLap12Data);

    const snapshot = tracker.getSnapshot('2026', '1');
    assert(snapshot?.maxLaps === 15, 'Scenario 13: Stale response with lap 12 does not degrade snapshot from lap 15');
  }

  // Test 14: Refresh / Reload state persistence
  {
    const store1 = new LiveNotificationStore();
    store1.reset();
    const tracker1 = new LiveRaceTracker(store1);

    const mockRace: Race = {
      season: '2026',
      round: '1',
      raceName: 'Australian Grand Prix',
      url: '',
      date: '2026-03-15',
      Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } }
    };

    tracker1.trackSessionStart(mockRace, 'Race');
    const notifCount = store1.getNotifications().length;

    // Simulate page reload by creating a new Tracker and Store with same seen IDs in store
    const store2 = new LiveNotificationStore();
    const tracker2 = new LiveRaceTracker(store2);
    tracker2.trackSessionStart(mockRace, 'Race');

    assert(store2.getNotifications().length === notifCount, 'Scenario 14: Replayed start event after reload is suppressed by seenEventIds');
  }

  // Test 15: Multiple polling cycles
  {
    const store = new LiveNotificationStore();
    store.reset();
    const tracker = new LiveRaceTracker(store);

    for (let lap = 1; lap <= 5; lap++) {
      tracker.processRaceResults({
        season: '2026',
        round: '1',
        raceName: 'Australian Grand Prix',
        url: '',
        date: '2026-03-15',
        Circuit: { circuitId: 'albert_park', circuitName: '', url: '', Location: { lat: '', long: '', locality: '', country: '' } },
        Results: [
          { number: '1', position: '1', positionText: '1', points: '0', grid: '1', laps: String(lap), status: 'Running', Driver: driverVER, Constructor: teamRedBull },
          { number: '4', position: '2', positionText: '2', points: '0', grid: '2', laps: String(lap), status: 'Running', Driver: driverNOR, Constructor: teamMcLaren },
        ]
      });
    }

    const notifs = store.getNotifications();
    const lap1Count = notifs.filter(n => n.id.includes('lap1_summary')).length;
    const lap2Count = notifs.filter(n => n.id.includes('lap2_summary')).length;
    assert(lap1Count <= 1 && lap2Count <= 1, 'Scenario 15: 5 progressive polling cycles maintain strict 1-per-lap summary limits');
  }

  console.log(`\nTest results: ${passed} passed, ${failed} failed.`);
  return { passed, failed, errors };
}

