import type { Race, DriverStanding, ConstructorStanding } from '../api/types';

export const MOCK_2026_CALENDAR: Race[] = [
  {
    season: '2026', round: '1', url: '', raceName: 'Bahrain Grand Prix',
    Circuit: { circuitId: 'bahrain', url: '', circuitName: 'Bahrain International Circuit', Location: { lat: '26.0325', long: '50.5106', locality: 'Sakhir', country: 'Bahrain' } },
    date: '2026-03-01', time: '15:00:00Z',
  },
  {
    season: '2026', round: '2', url: '', raceName: 'Saudi Arabian Grand Prix',
    Circuit: { circuitId: 'jeddah', url: '', circuitName: 'Jeddah Corniche Circuit', Location: { lat: '21.6319', long: '39.1044', locality: 'Jeddah', country: 'Saudi Arabia' } },
    date: '2026-03-15', time: '17:00:00Z',
  },
  {
    season: '2026', round: '3', url: '', raceName: 'Australian Grand Prix',
    Circuit: { circuitId: 'albert_park', url: '', circuitName: 'Albert Park Grand Prix Circuit', Location: { lat: '-37.8497', long: '144.968', locality: 'Melbourne', country: 'Australia' } },
    date: '2026-03-29', time: '04:00:00Z',
  },
  {
    season: '2026', round: '4', url: '', raceName: 'Japanese Grand Prix',
    Circuit: { circuitId: 'suzuka', url: '', circuitName: 'Suzuka Circuit', Location: { lat: '34.8431', long: '136.541', locality: 'Suzuka', country: 'Japan' } },
    date: '2026-04-12', time: '05:00:00Z',
  },
  {
    season: '2026', round: '5', url: '', raceName: 'Miami Grand Prix',
    Circuit: { circuitId: 'miami', url: '', circuitName: 'Miami International Autodrome', Location: { lat: '25.9581', long: '-80.2389', locality: 'Miami', country: 'USA' } },
    date: '2026-05-03', time: '19:30:00Z',
  },
  {
    season: '2026', round: '6', url: '', raceName: 'Emilia Romagna Grand Prix',
    Circuit: { circuitId: 'imola', url: '', circuitName: 'Autodromo Enzo e Dino Ferrari', Location: { lat: '44.3439', long: '11.7167', locality: 'Imola', country: 'Italy' } },
    date: '2026-05-17', time: '13:00:00Z',
  },
  {
    season: '2026', round: '7', url: '', raceName: 'Monaco Grand Prix',
    Circuit: { circuitId: 'monaco', url: '', circuitName: 'Circuit de Monaco', Location: { lat: '43.7347', long: '7.42056', locality: 'Monte-Carlo', country: 'Monaco' } },
    date: '2026-05-31', time: '13:00:00Z',
  },
  {
    season: '2026', round: '8', url: '', raceName: 'Spanish Grand Prix',
    Circuit: { circuitId: 'catalunya', url: '', circuitName: 'Circuit de Barcelona-Catalunya', Location: { lat: '41.57', long: '2.26111', locality: 'MontmelÃ³', country: 'Spain' } },
    date: '2026-06-14', time: '13:00:00Z',
  },
  {
    season: '2026', round: '9', url: '', raceName: 'Canadian Grand Prix',
    Circuit: { circuitId: 'villeneuve', url: '', circuitName: 'Circuit Gilles Villeneuve', Location: { lat: '45.5', long: '-73.5228', locality: 'Montreal', country: 'Canada' } },
    date: '2026-06-28', time: '18:00:00Z',
  },
  {
    season: '2026', round: '10', url: '', raceName: 'Austrian Grand Prix',
    Circuit: { circuitId: 'red_bull_ring', url: '', circuitName: 'Red Bull Ring', Location: { lat: '47.2197', long: '14.7647', locality: 'Spielberg', country: 'Austria' } },
    date: '2026-07-12', time: '13:00:00Z',
  },
  {
    season: '2026', round: '11', url: '', raceName: 'British Grand Prix',
    Circuit: { circuitId: 'silverstone', url: '', circuitName: 'Silverstone Circuit', Location: { lat: '52.0786', long: '-1.01694', locality: 'Silverstone', country: 'UK' } },
    date: '2026-07-26', time: '14:00:00Z',
  },
  {
    season: '2026', round: '12', url: '', raceName: 'Belgian Grand Prix',
    Circuit: { circuitId: 'spa', url: '', circuitName: 'Circuit de Spa-Francorchamps', Location: { lat: '50.4372', long: '5.97139', locality: 'Spa', country: 'Belgium' } },
    date: '2026-08-30', time: '13:00:00Z',
  },
  {
    season: '2026', round: '13', url: '', raceName: 'Italian Grand Prix',
    Circuit: { circuitId: 'monza', url: '', circuitName: 'Autodromo Nazionale di Monza', Location: { lat: '45.6156', long: '9.28111', locality: 'Monza', country: 'Italy' } },
    date: '2026-09-13', time: '13:00:00Z',
  },
  {
    season: '2026', round: '14', url: '', raceName: 'Azerbaijan Grand Prix',
    Circuit: { circuitId: 'baku', url: '', circuitName: 'Baku City Circuit', Location: { lat: '40.3725', long: '49.8533', locality: 'Baku', country: 'Azerbaijan' } },
    date: '2026-09-27', time: '11:00:00Z',
  },
  {
    season: '2026', round: '15', url: '', raceName: 'Singapore Grand Prix',
    Circuit: { circuitId: 'marina_bay', url: '', circuitName: 'Marina Bay Street Circuit', Location: { lat: '1.2914', long: '103.864', locality: 'Marina Bay', country: 'Singapore' } },
    date: '2026-10-11', time: '12:00:00Z',
  },
  {
    season: '2026', round: '16', url: '', raceName: 'United States Grand Prix',
    Circuit: { circuitId: 'americas', url: '', circuitName: 'Circuit of the Americas', Location: { lat: '30.1328', long: '-97.6411', locality: 'Austin', country: 'USA' } },
    date: '2026-10-25', time: '19:00:00Z',
  },
  {
    season: '2026', round: '17', url: '', raceName: 'Mexico City Grand Prix',
    Circuit: { circuitId: 'rodriguez', url: '', circuitName: 'AutÃ³dromo Hermanos RodrÃ­guez', Location: { lat: '19.4042', long: '-99.0907', locality: 'Mexico City', country: 'Mexico' } },
    date: '2026-11-08', time: '20:00:00Z',
  },
  {
    season: '2026', round: '18', url: '', raceName: 'SÃ£o Paulo Grand Prix',
    Circuit: { circuitId: 'interlagos', url: '', circuitName: 'AutÃ³dromo JosÃ© Carlos Pace', Location: { lat: '-23.7036', long: '-46.6997', locality: 'SÃ£o Paulo', country: 'Brazil' } },
    date: '2026-11-22', time: '17:00:00Z',
  },
  {
    season: '2026', round: '19', url: '', raceName: 'Las Vegas Grand Prix',
    Circuit: { circuitId: 'vegas', url: '', circuitName: 'Las Vegas Strip Circuit', Location: { lat: '36.1147', long: '-115.173', locality: 'Las Vegas', country: 'USA' } },
    date: '2026-12-05', time: '06:00:00Z',
  },
  {
    season: '2026', round: '20', url: '', raceName: 'Abu Dhabi Grand Prix',
    Circuit: { circuitId: 'yas_marina', url: '', circuitName: 'Yas Marina Circuit', Location: { lat: '24.4672', long: '54.6031', locality: 'Abu Dhabi', country: 'UAE' } },
    date: '2026-12-13', time: '13:00:00Z',
  }
];

export const MOCK_2026_DRIVERS: DriverStanding[] = [
  { position: '1', positionText: '1', points: '125', wins: '3', Driver: { driverId: 'norris', permanentNumber: '4', code: 'NOR', url: '', givenName: 'Lando', familyName: 'Norris', dateOfBirth: '1999-11-13', nationality: 'British' }, Constructors: [{ constructorId: 'mclaren', url: '', name: 'McLaren', nationality: 'British' }] },
  { position: '2', positionText: '2', points: '110', wins: '2', Driver: { driverId: 'leclerc', permanentNumber: '16', code: 'LEC', url: '', givenName: 'Charles', familyName: 'Leclerc', dateOfBirth: '1997-10-16', nationality: 'Monegasque' }, Constructors: [{ constructorId: 'ferrari', url: '', name: 'Ferrari', nationality: 'Italian' }] },
  { position: '3', positionText: '3', points: '98', wins: '1', Driver: { driverId: 'verstappen', permanentNumber: '1', code: 'VER', url: '', givenName: 'Max', familyName: 'Verstappen', dateOfBirth: '1997-09-30', nationality: 'Dutch' }, Constructors: [{ constructorId: 'red_bull', url: '', name: 'Red Bull', nationality: 'Austrian' }] },
  { position: '4', positionText: '4', points: '85', wins: '0', Driver: { driverId: 'piastri', permanentNumber: '81', code: 'PIA', url: '', givenName: 'Oscar', familyName: 'Piastri', dateOfBirth: '2001-04-06', nationality: 'Australian' }, Constructors: [{ constructorId: 'mclaren', url: '', name: 'McLaren', nationality: 'British' }] },
  { position: '5', positionText: '5', points: '72', wins: '0', Driver: { driverId: 'sainz', permanentNumber: '55', code: 'SAI', url: '', givenName: 'Carlos', familyName: 'Sainz', dateOfBirth: '1994-09-01', nationality: 'Spanish' }, Constructors: [{ constructorId: 'williams', url: '', name: 'Williams', nationality: 'British' }] },
  { position: '6', positionText: '6', points: '65', wins: '0', Driver: { driverId: 'hamilton', permanentNumber: '44', code: 'HAM', url: '', givenName: 'Lewis', familyName: 'Hamilton', dateOfBirth: '1985-01-07', nationality: 'British' }, Constructors: [{ constructorId: 'ferrari', url: '', name: 'Ferrari', nationality: 'Italian' }] },
];

export const MOCK_2026_CONSTRUCTORS: ConstructorStanding[] = [
  { position: '1', positionText: '1', points: '210', wins: '3', Constructor: { constructorId: 'mclaren', url: '', name: 'McLaren', nationality: 'British' } },
  { position: '2', positionText: '2', points: '175', wins: '2', Constructor: { constructorId: 'ferrari', url: '', name: 'Ferrari', nationality: 'Italian' } },
  { position: '3', positionText: '3', points: '140', wins: '1', Constructor: { constructorId: 'red_bull', url: '', name: 'Red Bull', nationality: 'Austrian' } },
  { position: '4', positionText: '4', points: '95', wins: '0', Constructor: { constructorId: 'mercedes', url: '', name: 'Mercedes', nationality: 'German' } },
  { position: '5', positionText: '5', points: '60', wins: '0', Constructor: { constructorId: 'aston_martin', url: '', name: 'Aston Martin', nationality: 'British' } },
  { position: '6', positionText: '6', points: '35', wins: '0', Constructor: { constructorId: 'audi', url: '', name: 'Audi', nationality: 'German' } },
  { position: '7', positionText: '7', points: '20', wins: '0', Constructor: { constructorId: 'cadillac', url: '', name: 'Cadillac', nationality: 'American' } },
];
