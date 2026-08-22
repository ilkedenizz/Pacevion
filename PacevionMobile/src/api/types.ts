export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
}

export interface Time {
  millis?: string;
  time: string;
}

export interface Session {
  date: string;
  time?: string;
}

export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying?: Session;
  Sprint?: Session;
  SprintQualifying?: Session;
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface FastestLap {
  rank: string;
  lap: string;
  Time: { time: string };
  AverageSpeed?: { units: string; speed: string };
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: Time;
  FastestLap?: FastestLap;
}

export interface ResultRace extends Race {
  Results: RaceResult[];
}

// API response wrappers
export interface MRDataCalendarResponse {
  MRData: { RaceTable: { Races: Race[] } };
}

export interface MRDataDriverStandingsResponse {
  MRData: { StandingsTable: { StandingsLists: { season: string; round: string; DriverStandings: DriverStanding[] }[] } };
}

export interface MRDataConstructorStandingsResponse {
  MRData: { StandingsTable: { StandingsLists: { season: string; round: string; ConstructorStandings: ConstructorStanding[] }[] } };
}

export interface MRDataRaceResultsResponse {
  MRData: { RaceTable: { Races: ResultRace[] } };
}

export interface QualifyingResult {
  number: string;
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1: string;
  Q2?: string;
  Q3?: string;
}

export interface QualifyingRace extends Race {
  QualifyingResults: QualifyingResult[];
}

export interface MRDataQualifyingResultsResponse {
  MRData: { RaceTable: { Races: QualifyingRace[] } };
}

// Sprint Results (same shape as RaceResult from the API)
export type SprintResult = RaceResult;

export interface SprintRace extends Race {
  SprintResults: SprintResult[];
}

export interface MRDataSprintResultsResponse {
  MRData: { RaceTable: { Races: SprintRace[] } };
}
