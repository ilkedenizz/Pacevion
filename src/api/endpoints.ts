import { fetchClient } from './fetchClient';
import type {
  MRDataCalendarResponse,
  MRDataDriverStandingsResponse,
  MRDataRaceResultsResponse,
  MRDataConstructorStandingsResponse,
  MRDataQualifyingResponse,
  MRDataSprintResultsResponse,
  Race,
  DriverStanding,
  ConstructorStanding,
  ResultRace,
  QualifyingRace,
  SprintRace,
} from './types';
import { MOCK_2026_CALENDAR, MOCK_2026_DRIVERS, MOCK_2026_CONSTRUCTORS } from '../data/mock2026';
import { MOCK_2027_RACES } from '../data/mock2027';

/**
 * Fetch the race calendar/schedule for the current season.
 */
export async function getCalendar(season: string = '2026'): Promise<Race[]> {
  if (season === '2027') return MOCK_2027_RACES;
  try {
    const data = await fetchClient<MRDataCalendarResponse>(`/${season}.json`);
    const races = data?.MRData?.RaceTable?.Races;
    if (races && races.length > 0) return races;
    if (season === '2026') return MOCK_2026_CALENDAR;
    return [];
  } catch (error) {
    if (season === '2026') return MOCK_2026_CALENDAR;
    if (season === '2027') return MOCK_2027_RACES;
    throw error;
  }
}

/**
 * Fetch the driver standings for the current season.
 */
export async function getDriverStandings(season: string = '2026'): Promise<DriverStanding[]> {
  if (season === '2027') return [];
  try {
    const data = await fetchClient<MRDataDriverStandingsResponse>(`/${season}/driverStandings.json`);
    const lists = data?.MRData?.StandingsTable?.StandingsLists;
    if (lists && lists.length > 0 && lists[0].DriverStandings.length > 0) {
      return lists[0].DriverStandings;
    }
    if (season === '2026') return MOCK_2026_DRIVERS;
    return [];
  } catch (error) {
    if (season === '2026') return MOCK_2026_DRIVERS;
    throw error;
  }
}

/**
 * Fetch results for a specific race.
 */
export async function getRaceResults(season: string, round: string): Promise<ResultRace | null> {
  if (season === '2027') return null;
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/${round}/results.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch the latest completed race results.
 */
export async function getLatestRaceResults(): Promise<ResultRace | null> {
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/current/last/results.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch all race results for a season.
 */
export async function getAllSeasonResults(season: string = '2026'): Promise<ResultRace[]> {
  if (season === '2027') return [];
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/results.json?limit=1000`);
    return data?.MRData?.RaceTable?.Races || [];
  } catch {
    return [];
  }
}

/**
 * Fetch the constructor standings for the current season.
 */
export async function getConstructorStandings(season: string = '2026'): Promise<ConstructorStanding[]> {
  if (season === '2027') return [];
  try {
    const data = await fetchClient<MRDataConstructorStandingsResponse>(`/${season}/constructorStandings.json`);
    const lists = data?.MRData?.StandingsTable?.StandingsLists;
    if (lists && lists.length > 0 && lists[0].ConstructorStandings.length > 0) {
      return lists[0].ConstructorStandings;
    }
    if (season === '2026') return MOCK_2026_CONSTRUCTORS;
    return [];
  } catch (error) {
    if (season === '2026') return MOCK_2026_CONSTRUCTORS;
    throw error;
  }
}

/**
 * Fetch the calendar for a specific season.
 */
export async function getSeasonCalendar(season: string): Promise<Race[]> {
  return getCalendar(season);
}

/**
 * Fetch qualifying results for a specific race.
 */
export async function getQualifyingResults(season: string, round: string): Promise<QualifyingRace | null> {
  if (season === '2027') return null;
  try {
    const data = await fetchClient<MRDataQualifyingResponse>(`/${season}/${round}/qualifying.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}

/**
 * Fetch sprint race results for a specific race.
 */
export async function getSprintResults(season: string, round: string): Promise<SprintRace | null> {
  if (season === '2027') return null;
  try {
    const data = await fetchClient<MRDataSprintResultsResponse>(`/${season}/${round}/sprint.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch {
    return null;
  }
}
