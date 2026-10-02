import { 
  getCurrentRaceState, 
  buildSessionsForRace, 
  isWeekendCompleted
} from '../src/utils/raceWeekend';
import type { Race } from '../src/api/types';

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

console.log('\n--- TESTING RACE STATE & SESSION TRANSITIONS ---\n');

const mockStandardRace: Race = {
  season: '2026',
  round: '1',
  url: 'https://test.com/australia',
  raceName: 'Australian Grand Prix',
  Circuit: {
    circuitId: 'albert_park',
    url: 'https://test.com/albert_park',
    circuitName: 'Albert Park Circuit',
    Location: { lat: '-37.8497', long: '144.968', locality: 'Melbourne', country: 'Australia' }
  },
  date: '2026-03-15',
  time: '04:00:00Z',
  FirstPractice: { date: '2026-03-13', time: '01:30:00Z' },
  SecondPractice: { date: '2026-03-13', time: '05:00:00Z' },
  ThirdPractice: { date: '2026-03-14', time: '01:30:00Z' },
  Qualifying: { date: '2026-03-14', time: '05:00:00Z' }
};

const mockSprintRace: Race = {
  season: '2026',
  round: '2',
  url: 'https://test.com/china',
  raceName: 'Chinese Grand Prix',
  Circuit: {
    circuitId: 'shanghai',
    url: 'https://test.com/shanghai',
    circuitName: 'Shanghai International Circuit',
    Location: { lat: '31.3389', long: '121.22', locality: 'Shanghai', country: 'China' }
  },
  date: '2026-03-22',
  time: '07:00:00Z',
  FirstPractice: { date: '2026-03-20', time: '03:30:00Z' },
  SprintQualifying: { date: '2026-03-20', time: '07:30:00Z' },
  Sprint: { date: '2026-03-21', time: '03:00:00Z' },
  Qualifying: { date: '2026-03-21', time: '07:00:00Z' }
};

const calendar = [mockStandardRace, mockSprintRace];

// Test 1: Session building for standard race
console.log('1. Session Building (Standard Race):');
const stdSessions = buildSessionsForRace(mockStandardRace);
assert(stdSessions.length === 5, 'Standard race has 5 sessions (FP1, FP2, FP3, Quali, Race)');
assert(stdSessions[0].name === 'Practice 1', 'First session is Practice 1');
assert(stdSessions[1].name === 'Practice 2', 'Second session is Practice 2');
assert(stdSessions[2].name === 'Practice 3', 'Third session is Practice 3');
assert(stdSessions[3].name === 'Qualifying', 'Fourth session is Qualifying');
assert(stdSessions[4].name === 'Race', 'Fifth session is Race');

// Test 2: Session building for sprint race
console.log('\n2. Session Building (Sprint Race):');
const sprintSessions = buildSessionsForRace(mockSprintRace);
assert(sprintSessions.length === 5, 'Sprint race has 5 sessions (FP1, SQ, Sprint, Quali, Race)');
assert(sprintSessions[0].name === 'Practice 1', 'First session is Practice 1');
assert(sprintSessions[1].name === 'Sprint Shootout', 'Second session is Sprint Shootout');
assert(sprintSessions[2].name === 'Sprint', 'Third session is Sprint');
assert(sprintSessions[3].name === 'Qualifying', 'Fourth session is Qualifying');
assert(sprintSessions[4].name === 'Race', 'Fifth session is Race');

// Test 3: NO_RACE_WEEKEND (2 weeks before season start)
console.log('\n3. State: NO_RACE_WEEKEND:');
const stateFar = getCurrentRaceState(calendar, new Date('2026-03-01T12:00:00Z'));
assert(stateFar.status === 'NO_RACE_WEEKEND', 'Status is NO_RACE_WEEKEND far before race');
assert(stateFar.race?.round === '1', 'Target race is Round 1');
assert(stateFar.nextSession?.name === 'Practice 1', 'Next session is Practice 1');

// Test 4: UPCOMING_WEEKEND (30 hours before FP1)
console.log('\n4. State: UPCOMING_WEEKEND:');
const stateUpcoming = getCurrentRaceState(calendar, new Date('2026-03-11T19:30:00Z'));
assert(stateUpcoming.status === 'UPCOMING_WEEKEND', 'Status is UPCOMING_WEEKEND within 72h of FP1');
assert(stateUpcoming.race?.round === '1', 'Target race is Round 1');

// Test 5: ACTIVE_SESSION for FP1
console.log('\n5. State: ACTIVE_SESSION (FP1):');
const stateFP1 = getCurrentRaceState(calendar, new Date('2026-03-13T02:00:00Z'));
assert(stateFP1.status === 'ACTIVE_SESSION', 'Status is ACTIVE_SESSION during FP1');
assert(stateFP1.activeSession?.name === 'Practice 1', 'Active session is Practice 1');
assert(stateFP1.activeSession?.shortName === 'FP1', 'Short name is FP1');

// Test 6: WAITING_FOR_SESSION (between FP1 and FP2)
console.log('\n6. State: WAITING_FOR_SESSION (between FP1 & FP2):');
const stateGap = getCurrentRaceState(calendar, new Date('2026-03-13T03:30:00Z'));
assert(stateGap.status === 'WAITING_FOR_SESSION', 'Status is WAITING_FOR_SESSION between sessions');
assert(stateGap.lastCompletedSession?.name === 'Practice 1', 'Last completed is Practice 1');
assert(stateGap.nextSession?.name === 'Practice 2', 'Next session is Practice 2');

// Test 7: ACTIVE_SESSION for Qualifying
console.log('\n7. State: ACTIVE_SESSION (Qualifying):');
const stateQuali = getCurrentRaceState(calendar, new Date('2026-03-14T05:30:00Z'));
assert(stateQuali.status === 'ACTIVE_SESSION', 'Status is ACTIVE_SESSION during Qualifying');
assert(stateQuali.activeSession?.name === 'Qualifying', 'Active session is Qualifying');

// Test 8: ACTIVE_SESSION for Race
console.log('\n8. State: ACTIVE_SESSION (Race):');
const stateRace = getCurrentRaceState(calendar, new Date('2026-03-15T04:30:00Z'));
assert(stateRace.status === 'ACTIVE_SESSION', 'Status is ACTIVE_SESSION during Race');
assert(stateRace.activeSession?.name === 'Race', 'Active session is Race');

// Test 9: POST_RACE (3 hours after race finishes, within 24h window)
console.log('\n9. State: POST_RACE:');
const statePost = getCurrentRaceState(calendar, new Date('2026-03-15T09:00:00Z'));
assert(statePost.status === 'POST_RACE', 'Status is POST_RACE after race finishes');
assert(statePost.race?.round === '1', 'Current race was Round 1');
assert(statePost.nextRace?.round === '2', 'Next race is Round 2');

// Test 10: Transition to Next Weekend between rounds
console.log('\n10. State: Transition to Round 2:');
const stateBetweenRounds = getCurrentRaceState(calendar, new Date('2026-03-17T12:00:00Z'));
assert(stateBetweenRounds.race?.round === '2', 'Target race shifted to Round 2');

// Test 11: Sprint Weekend ACTIVE_SESSION (Sprint)
console.log('\n11. State: ACTIVE_SESSION (Sprint):');
const stateSprint = getCurrentRaceState(calendar, new Date('2026-03-21T03:30:00Z'));
assert(stateSprint.status === 'ACTIVE_SESSION', 'Status is ACTIVE_SESSION during Sprint');
assert(stateSprint.activeSession?.name === 'Sprint', 'Active session is Sprint');

// Test 12: isWeekendCompleted
console.log('\n12. isWeekendCompleted:');
assert(isWeekendCompleted(mockStandardRace, new Date('2026-03-14T12:00:00Z')) === false, 'Weekend not completed before Sunday race');
assert(isWeekendCompleted(mockStandardRace, new Date('2026-03-15T07:00:00Z')) === true, 'Weekend completed after race end');

console.log(`\n========================================`);
if (failed === 0) {
  console.log(`ALL ${passed} TRANSITION TESTS PASSED!`);
  process.exit(0);
} else {
  console.error(`FAILED: ${failed} test(s) failed out of ${passed + failed}`);
  process.exit(1);
}
