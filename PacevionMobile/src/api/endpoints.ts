import { fetchClient } from './fetchClient';
import type {
  MRDataCalendarResponse,
  MRDataDriverStandingsResponse,
  MRDataConstructorStandingsResponse,
  MRDataRaceResultsResponse,
  Race,
  DriverStanding,
  ConstructorStanding,
  ResultRace,
} from './types';
import { MOCK_2026_CALENDAR, MOCK_2026_DRIVERS, MOCK_2026_CONSTRUCTORS } from '../data/mock2026';

export async function getCalendar(year: string | number = 'current'): Promise<Race[]> {
  try {
    const data = await fetchClient<MRDataCalendarResponse>(`/${year}.json`);
    const races = data?.MRData?.RaceTable?.Races;
    if (races && races.length > 0) return races;
    
    // Fallback if array is empty
    if (year === '2026' || year === 2026) return MOCK_2026_CALENDAR;
    return [];
  } catch (error) {
    if (year === '2026' || year === 2026) return MOCK_2026_CALENDAR;
    throw error;
  }
}

export async function getDriverStandings(year: string | number = 'current'): Promise<DriverStanding[]> {
  try {
    const data = await fetchClient<MRDataDriverStandingsResponse>(`/${year}/driverStandings.json`);
    const lists = data?.MRData?.StandingsTable?.StandingsLists;
    if (lists && lists.length > 0) return lists[0].DriverStandings;
    
    if (year === '2026' || year === 2026) return MOCK_2026_DRIVERS;
    return [];
  } catch (error) {
    if (year === '2026' || year === 2026) return MOCK_2026_DRIVERS;
    throw error;
  }
}

export async function getDriverStandingsWithRound(year: string | number = 'current', round?: string | number): Promise<{ round: string, standings: DriverStanding[] }> {
  try {
    const url = round ? `/${year}/${round}/driverStandings.json` : `/${year}/driverStandings.json`;
    const data = await fetchClient<MRDataDriverStandingsResponse>(url);
    const lists = data?.MRData?.StandingsTable?.StandingsLists;
    if (lists && lists.length > 0) return { round: lists[0].round, standings: lists[0].DriverStandings };
    
    if ((year === '2026' || year === 2026) && !round) return { round: '0', standings: MOCK_2026_DRIVERS };
    return { round: '0', standings: [] };
  } catch {
    if ((year === '2026' || year === 2026) && !round) return { round: '0', standings: MOCK_2026_DRIVERS };
    return { round: '0', standings: [] };
  }
}

export async function getConstructorStandingsWithRound(year: string | number = 'current', round?: string | number): Promise<{ round: string, standings: ConstructorStanding[] }> {
  try {
    const url = round ? `/${year}/${round}/constructorStandings.json` : `/${year}/constructorStandings.json`;
    const data = await fetchClient<MRDataConstructorStandingsResponse>(url);
    const lists = data?.MRData?.StandingsTable?.StandingsLists;
    if (lists && lists.length > 0) return { round: lists[0].round, standings: lists[0].ConstructorStandings };
    
    if ((year === '2026' || year === 2026) && !round) return { round: '0', standings: MOCK_2026_CONSTRUCTORS };
    return { round: '0', standings: [] };
  } catch {
    if ((year === '2026' || year === 2026) && !round) return { round: '0', standings: MOCK_2026_CONSTRUCTORS };
    return { round: '0', standings: [] };
  }
}

export async function getRaceResults(season: string | number, round: string | number): Promise<ResultRace | null> {
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/${round}/results.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}

export async function getLatestRaceResults(): Promise<ResultRace | null> {
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/current/last/results.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}

export async function getAllSeasonResults(season: string | number): Promise<ResultRace[]> {
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/results.json?limit=1000`);
    return data?.MRData?.RaceTable?.Races || [];
  } catch {
    return [];
  }
}

export async function getQualifyingResults(season: string | number, round: string | number): Promise<import('./types').QualifyingRace | null> {
  try {
    const data = await fetchClient<import('./types').MRDataQualifyingResultsResponse>(`/${season}/${round}/qualifying.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}

export async function getAllSeasonQualifying(season: string | number): Promise<import('./types').QualifyingRace[]> {
  try {
    const data = await fetchClient<import('./types').MRDataQualifyingResultsResponse>(`/${season}/qualifying.json?limit=1000`);
    return data?.MRData?.RaceTable?.Races || [];
  } catch {
    return [];
  }
}
