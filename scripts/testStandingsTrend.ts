import { calculateDriverTrend, calculateConstructorTrend } from '../src/utils/standingsTrend';
import type { DriverStanding, ConstructorStanding } from '../src/api/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

console.log('\n--- TESTING STANDINGS POSITION TRENDS ---');

const mockPrevDrivers: DriverStanding[] = [
  {
    position: '1',
    positionText: '1',
    points: '25',
    wins: '1',
    Driver: { driverId: 'norris', givenName: 'Lando', familyName: 'Norris', url: '', dateOfBirth: '', nationality: 'British' },
    Constructors: [{ constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' }],
  },
  {
    position: '2',
    positionText: '2',
    points: '18',
    wins: '0',
    Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc', url: '', dateOfBirth: '', nationality: 'Monegasque' },
    Constructors: [{ constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' }],
  },
  {
    position: '5',
    positionText: '5',
    points: '10',
    wins: '0',
    Driver: { driverId: 'hamilton', givenName: 'Lewis', familyName: 'Hamilton', url: '', dateOfBirth: '', nationality: 'British' },
    Constructors: [{ constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' }],
  },
  {
    position: '8',
    positionText: '8',
    points: '4',
    wins: '0',
    Driver: { driverId: 'verstappen', givenName: 'Max', familyName: 'Verstappen', url: '', dateOfBirth: '', nationality: 'Dutch' },
    Constructors: [{ constructorId: 'red_bull', name: 'Red Bull', nationality: 'Austrian', url: '' }],
  },
];

const mockPrevConstructors: ConstructorStanding[] = [
  {
    position: '1',
    positionText: '1',
    points: '28',
    wins: '1',
    Constructor: { constructorId: 'mclaren', name: 'McLaren', nationality: 'British', url: '' },
  },
  {
    position: '2',
    positionText: '2',
    points: '28',
    wins: '0',
    Constructor: { constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian', url: '' },
  },
  {
    position: '4',
    positionText: '4',
    points: '12',
    wins: '0',
    Constructor: { constructorId: 'mercedes', name: 'Mercedes', nationality: 'German', url: '' },
  },
];

// 1. Driver Standings Trends
console.log('\n1. Driver Standings Trends:');
// Gained position: Hamilton moved from P5 to P2 (+3)
const hamiltonTrend = calculateDriverTrend('hamilton', '2', mockPrevDrivers);
assert(hamiltonTrend.type === 'up', 'Hamilton trend type is up');
assert(hamiltonTrend.diff === 3, 'Hamilton gained 3 positions');
assert(hamiltonTrend.text === '▲3', 'Hamilton text is ▲3');
assert(hamiltonTrend.className === 'trend-up', 'Hamilton class is trend-up');

// Lost position: Norris moved from P1 to P3 (-2)
const norrisTrend = calculateDriverTrend('norris', '3', mockPrevDrivers);
assert(norrisTrend.type === 'down', 'Norris trend type is down');
assert(norrisTrend.diff === -2, 'Norris lost 2 positions');
assert(norrisTrend.text === '▼2', 'Norris text is ▼2');
assert(norrisTrend.className === 'trend-down', 'Norris class is trend-down');

// Unchanged position: Leclerc remained P2
const leclercTrend = calculateDriverTrend('leclerc', '2', mockPrevDrivers);
assert(leclercTrend.type === 'same', 'Leclerc trend type is same');
assert(leclercTrend.diff === 0, 'Leclerc delta is 0');
assert(leclercTrend.text === '=', 'Leclerc text is =');
assert(leclercTrend.className === 'trend-same', 'Leclerc class is trend-same');

// 2. Unavailable Previous Standings / Preseason / Round 1
console.log('\n2. Unavailable / First Round / Preseason:');
const nullPrevTrend = calculateDriverTrend('norris', '1', null);
assert(nullPrevTrend.type === 'none', 'Null previous standings returns type none');
assert(nullPrevTrend.text === '—', 'Null previous standings returns —');
assert(nullPrevTrend.className === 'trend-same', 'Null previous standings uses trend-same class');

const undefinedPrevTrend = calculateDriverTrend('norris', '1', undefined);
assert(undefinedPrevTrend.type === 'none', 'Undefined previous standings returns type none');
assert(undefinedPrevTrend.text === '—', 'Undefined previous standings returns —');

const emptyPrevTrend = calculateDriverTrend('norris', '1', []);
assert(emptyPrevTrend.type === 'none', 'Empty previous standings returns type none');
assert(emptyPrevTrend.text === '—', 'Empty previous standings returns —');

// 3. Driver Not in Previous Standings / Partial Standings
console.log('\n3. Driver Missing in Previous Standings:');
// Antonelli is a rookie or did not race in round 1
const rookieTrend = calculateDriverTrend('antonelli', '10', mockPrevDrivers);
assert(rookieTrend.type === 'none', 'Missing driver in previous standings returns type none');
assert(rookieTrend.diff === null, 'Missing driver diff is null');
assert(rookieTrend.text === '—', 'Missing driver text is —');

// Invalid current position
const invalidPosTrend = calculateDriverTrend('norris', 'N/A', mockPrevDrivers);
assert(invalidPosTrend.type === 'none', 'Invalid current position returns type none');
assert(invalidPosTrend.text === '—', 'Invalid current position text is —');

// 4. Constructor Standings Trends
console.log('\n4. Constructor Standings Trends:');
// Gained position: Mercedes moved from P4 to P2 (+2)
const mercTrend = calculateConstructorTrend('mercedes', '2', mockPrevConstructors);
assert(mercTrend.type === 'up', 'Mercedes constructor trend type is up');
assert(mercTrend.diff === 2, 'Mercedes constructor gained 2 positions');
assert(mercTrend.text === '▲2', 'Mercedes constructor text is ▲2');
assert(mercTrend.className === 'trend-up', 'Mercedes constructor class is trend-up');

// Lost position: McLaren moved from P1 to P2 (-1)
const mclarenTrend = calculateConstructorTrend('mclaren', '2', mockPrevConstructors);
assert(mclarenTrend.type === 'down', 'McLaren constructor trend type is down');
assert(mclarenTrend.diff === -1, 'McLaren constructor lost 1 position');
assert(mclarenTrend.text === '▼1', 'McLaren constructor text is ▼1');
assert(mclarenTrend.className === 'trend-down', 'McLaren constructor class is trend-down');

// Unchanged position: Ferrari remained P2
const ferrariTrend = calculateConstructorTrend('ferrari', '2', mockPrevConstructors);
assert(ferrariTrend.type === 'same', 'Ferrari constructor trend type is same');
assert(ferrariTrend.diff === 0, 'Ferrari constructor diff is 0');
assert(ferrariTrend.text === '=', 'Ferrari constructor text is =');
assert(ferrariTrend.className === 'trend-same', 'Ferrari constructor class is trend-same');

// Missing constructor in previous standings
const audiTrend = calculateConstructorTrend('audi', '9', mockPrevConstructors);
assert(audiTrend.type === 'none', 'Missing constructor in previous standings returns type none');
assert(audiTrend.text === '—', 'Missing constructor text is —');

// Null constructor previous standings
const nullConstructorTrend = calculateConstructorTrend('ferrari', '1', null);
assert(nullConstructorTrend.type === 'none', 'Null constructor previous standings returns type none');
assert(nullConstructorTrend.text === '—', 'Null constructor previous standings returns —');

console.log('\n========================================');
console.log('ALL STANDINGS TREND TESTS PASSED!\n');
