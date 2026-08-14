// src/api/types.ts

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

export interface RaceTable {
  season?: string;
  round?: string;
  Races: Race[];
}

export interface MRDataCalendarResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: RaceTable;
  };
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface StandingsList {
  season: string;
  round: string;
  DriverStandings: DriverStanding[];
}

export interface StandingsTable {
  season?: string;
  round?: string;
  StandingsLists: StandingsList[];
}

export interface MRDataDriverStandingsResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: StandingsTable;
  };
}

export interface FastestLap {
  rank: string;
  lap: string;
  Time: {
    time: string;
  };
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

export interface ResultsRaceTable {
  season?: string;
  round?: string;
  Races: ResultRace[];
}

export interface MRDataRaceResultsResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: ResultsRaceTable;
  };
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface ConstructorStandingsList {
  season: string;
  round: string;
  ConstructorStandings: ConstructorStanding[];
}

export interface ConstructorStandingsTable {
  season?: string;
  round?: string;
  StandingsLists: ConstructorStandingsList[];
}

export interface MRDataConstructorStandingsResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    StandingsTable: ConstructorStandingsTable;
  };
}
