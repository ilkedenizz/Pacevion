import {
  isClassifiedResult,
  parseGridPosition,
  parseFinishPosition,
  calculateGridDelta,
  getDriverForm,
  getDriverStatsAggr,
  getTeammateComparison
} from '../src/utils/driverStats';
import type { ResultRace, QualifyingRace, DriverStanding } from '../src/api/types';

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

console.log('\n--- TESTING DRIVER STATS & PROFILE CALCULATIONS ---\n');

// 1. isClassifiedResult
console.log('1. isClassifiedResult:');
assert(isClassifiedResult('Finished') === true, 'Finished status is classified');
assert(isClassifiedResult('+1 Lap') === true, '+1 Lap status is classified');
assert(isClassifiedResult('+2 Laps') === true, '+2 Laps status is classified');
assert(isClassifiedResult('Engine') === false, 'Engine failure is not classified');
assert(isClassifiedResult('Collision') === false, 'Collision is not classified');
assert(isClassifiedResult('Disqualified') === false, 'Disqualified is not classified');
assert(isClassifiedResult('Did not start') === false, 'Did not start is not classified');

// 2. parseGridPosition
console.log('\n2. parseGridPosition:');
assert(parseGridPosition('1') === 1, 'Grid "1" parsed as 1');
assert(parseGridPosition('10') === 10, 'Grid "10" parsed as 10');
assert(parseGridPosition('0') === 'PIT', 'Grid "0" parsed as PIT lane start');
assert(parseGridPosition('') === null, 'Empty grid parsed as null');
assert(parseGridPosition(undefined) === null, 'Undefined grid parsed as null');

// 3. parseFinishPosition
console.log('\n3. parseFinishPosition:');
assert(parseFinishPosition('1', 'Finished', '1') === 1, 'P1 finished parsed as 1');
assert(parseFinishPosition('5', '+1 Lap', '5') === 5, 'P5 +1 Lap parsed as 5');
assert(parseFinishPosition('18', 'Engine', 'R') === 'DNF', 'Engine retirement parsed as DNF');
assert(parseFinishPosition('20', 'Disqualified', 'D') === 'DSQ', 'Disqualification parsed as DSQ');
assert(parseFinishPosition('0', 'Did not start', 'W') === 'DNS', 'DNS parsed as DNS');

// 4. calculateGridDelta
console.log('\n4. calculateGridDelta:');
assert(calculateGridDelta(5, 2) === 3, 'Grid 5 to Finish 2 is +3 gain');
assert(calculateGridDelta(1, 4) === -3, 'Grid 1 to Finish 4 is -3 loss');
assert(calculateGridDelta(3, 3) === 0, 'Grid 3 to Finish 3 is 0 (held position)');
assert(calculateGridDelta('PIT', 10) === null, 'PIT start delta is null');
assert(calculateGridDelta(4, 'DNF') === null, 'DNF delta is null');
assert(calculateGridDelta(null, 5) === null, 'Missing grid delta is null');

// Mock Data for Aggregations & Teammate Tests
const mockStandings: DriverStanding[] = [
  {
    position: '1',
    positionText: '1',
    points: '43',
    wins: '1',
    Driver: { driverId: 'norris', givenName: 'Lando', familyName: 'Norris', dateOfBirth: '1999-11-13', nationality: 'British', permanentNumber: '4', url: '' },
    Constructors: [{ constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' }]
  },
  {
    position: '2',
    positionText: '2',
    points: '27',
    wins: '0',
    Driver: { driverId: 'piastri', givenName: 'Oscar', familyName: 'Piastri', dateOfBirth: '2001-04-06', nationality: 'Australian', permanentNumber: '81', url: '' },
    Constructors: [{ constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' }]
  },
  {
    position: '3',
    positionText: '3',
    points: '25',
    wins: '1',
    Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc', dateOfBirth: '1997-10-16', nationality: 'Monegasque', permanentNumber: '16', url: '' },
    Constructors: [{ constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' }]
  }
];

const mockRaces: ResultRace[] = [
  {
    season: '2026',
    round: '1',
    raceName: 'Australian Grand Prix',
    Circuit: { circuitId: 'albert_park', circuitName: 'Albert Park', url: '', Location: { lat: '0', long: '0', locality: 'Melbourne', country: 'Australia' } },
    date: '2026-03-15',
    url: '',
    Results: [
      { number: '4', position: '1', positionText: '1', points: '25', grid: '2', laps: '58', status: 'Finished', Driver: mockStandings[0].Driver, Constructor: mockStandings[0].Constructors[0] },
      { number: '81', position: '4', positionText: '4', points: '12', grid: '5', laps: '58', status: 'Finished', Driver: mockStandings[1].Driver, Constructor: mockStandings[1].Constructors[0] },
      { number: '16', position: '2', positionText: '2', points: '18', grid: '1', laps: '58', status: 'Finished', Driver: mockStandings[2].Driver, Constructor: mockStandings[2].Constructors[0] }
    ]
  },
  {
    season: '2026',
    round: '2',
    raceName: 'Chinese Grand Prix',
    Circuit: { circuitId: 'shanghai', circuitName: 'Shanghai Circuit', url: '', Location: { lat: '0', long: '0', locality: 'Shanghai', country: 'China' } },
    date: '2026-03-22',
    url: '',
    Results: [
      { number: '4', position: '2', positionText: '2', points: '18', grid: '1', laps: '56', status: 'Finished', Driver: mockStandings[0].Driver, Constructor: mockStandings[0].Constructors[0] },
      { number: '81', position: '3', positionText: '3', points: '15', grid: '4', laps: '56', status: 'Finished', Driver: mockStandings[1].Driver, Constructor: mockStandings[1].Constructors[0] },
      { number: '16', position: '19', positionText: 'R', points: '0', grid: '3', laps: '12', status: 'Engine', Driver: mockStandings[2].Driver, Constructor: mockStandings[2].Constructors[0] }
    ]
  }
];

const mockQualifying: QualifyingRace[] = [
  {
    season: '2026',
    round: '1',
    raceName: 'Australian Grand Prix',
    Circuit: mockRaces[0].Circuit,
    date: '2026-03-14',
    url: '',
    QualifyingResults: [
      { number: '16', position: '1', Driver: mockStandings[2].Driver, Constructor: mockStandings[2].Constructors[0], Q1: '1:17.000', Q2: '1:16.500', Q3: '1:16.000' },
      { number: '4', position: '2', Driver: mockStandings[0].Driver, Constructor: mockStandings[0].Constructors[0], Q1: '1:17.100', Q2: '1:16.600', Q3: '1:16.100' },
      { number: '81', position: '5', Driver: mockStandings[1].Driver, Constructor: mockStandings[1].Constructors[0], Q1: '1:17.300', Q2: '1:16.900', Q3: '1:16.400' }
    ]
  },
  {
    season: '2026',
    round: '2',
    raceName: 'Chinese Grand Prix',
    Circuit: mockRaces[1].Circuit,
    date: '2026-03-21',
    url: '',
    QualifyingResults: [
      { number: '4', position: '1', Driver: mockStandings[0].Driver, Constructor: mockStandings[0].Constructors[0], Q1: '1:33.000', Q2: '1:32.500', Q3: '1:32.000' },
      { number: '16', position: '3', Driver: mockStandings[2].Driver, Constructor: mockStandings[2].Constructors[0], Q1: '1:33.200', Q2: '1:32.700', Q3: '1:32.200' },
      { number: '81', position: '4', Driver: mockStandings[1].Driver, Constructor: mockStandings[1].Constructors[0], Q1: '1:33.400', Q2: '1:32.900', Q3: '1:32.400' }
    ]
  }
];

// 5. getDriverForm
console.log('\n5. getDriverForm:');
const norrisForm = getDriverForm('norris', mockRaces);
assert(norrisForm.length === 2, 'Norris has 2 race form entries');
assert(norrisForm[0].position === 1, 'Round 1 finish is P1');
assert(norrisForm[0].grid === 2, 'Round 1 grid is P2');
assert(norrisForm[0].delta === 1, 'Round 1 delta is +1 (started P2, finished P1)');
assert(norrisForm[1].position === 2, 'Round 2 finish is P2');
assert(norrisForm[1].grid === 1, 'Round 2 grid is P1');
assert(norrisForm[1].delta === -1, 'Round 2 delta is -1 (started P1, finished P2)');

const leclercForm = getDriverForm('leclerc', mockRaces);
assert(leclercForm.length === 2, 'Leclerc has 2 race form entries');
assert(leclercForm[0].position === 2, 'Round 1 finish is P2');
assert(leclercForm[1].position === 'DNF', 'Round 2 finish is DNF');
assert(leclercForm[1].delta === null, 'Round 2 delta is null for DNF');

// 6. getDriverStatsAggr
console.log('\n6. getDriverStatsAggr:');
const norrisAggr = getDriverStatsAggr('norris', mockRaces);
assert(norrisAggr.bestFinish === 'P1', 'Norris best finish is P1');
assert(norrisAggr.avgFinish === 'P1.5', 'Norris average finish is P1.5 (P1 & P2)');
assert(norrisAggr.winsCount === 1, 'Norris has 1 win');
assert(norrisAggr.podiumsCount === 2, 'Norris has 2 podiums');
assert(norrisAggr.pointsFinishes === 2, 'Norris has 2 points finishes');
assert(norrisAggr.dnfCount === 0, 'Norris has 0 DNFs');

const leclercAggr = getDriverStatsAggr('leclerc', mockRaces);
assert(leclercAggr.bestFinish === 'P2', 'Leclerc best finish is P2');
assert(leclercAggr.avgFinish === 'P2.0', 'Leclerc average finish is P2.0 (only 1 classified finish)');
assert(leclercAggr.dnfCount === 1, 'Leclerc has 1 DNF');

const emptyAggr = getDriverStatsAggr('unknown_driver', mockRaces);
assert(emptyAggr.bestFinish === '—', 'Unknown driver best finish is "—"');
assert(emptyAggr.avgFinish === '—', 'Unknown driver avg finish is "—"');

// 7. getTeammateComparison
console.log('\n7. getTeammateComparison:');
const mclarenComp = getTeammateComparison('norris', 'mclaren', mockStandings, mockRaces, mockQualifying);
assert(mclarenComp.teammate?.Driver.driverId === 'piastri', 'Norris teammate is Piastri');
assert(mclarenComp.driverPoints === 43, 'Norris points = 43');
assert(mclarenComp.teammatePoints === 27, 'Piastri points = 27');
assert(mclarenComp.driverWins === 1, 'Norris wins = 1');
assert(mclarenComp.teammateWins === 0, 'Piastri wins = 0');
assert(mclarenComp.driverPodiums === 2, 'Norris podiums = 2');
assert(mclarenComp.teammatePodiums === 1, 'Piastri podiums = 1');
assert(mclarenComp.driverRacesAhead === 2, 'Norris finished ahead of Piastri in both races');
assert(mclarenComp.teammateRacesAhead === 0, 'Piastri finished ahead = 0');
assert(mclarenComp.driverQualyWins === 2, 'Norris won both qualifying duels against Piastri');

const noTeammateComp = getTeammateComparison('leclerc', 'ferrari', mockStandings, mockRaces, mockQualifying);
assert(noTeammateComp.teammate === null, 'Ferrari has no teammate in mock standings, returns null cleanly');

console.log(`\n========================================`);
if (failed === 0) {
  console.log(`ALL ${passed} DRIVER STATS TESTS PASSED!`);
  process.exit(0);
} else {
  console.error(`FAILED: ${failed} test(s) failed out of ${passed + failed}`);
  process.exit(1);
}
