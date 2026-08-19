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

export async function getConstructorStandings(year: string | number = 'current'): Promise<ConstructorStanding[]> {
  try {
    const data = await fetchClient<MRDataConstructorStandingsResponse>(`/${year}/constructorStandings.json`);
    const lists = data?.MRData?.StandingsTable?.StandingsLists;
    if (lists && lists.length > 0) return lists[0].ConstructorStandings;
    
    if (year === '2026' || year === 2026) return MOCK_2026_CONSTRUCTORS;
    return [];
  } catch (error) {
    if (year === '2026' || year === 2026) return MOCK_2026_CONSTRUCTORS;
    throw error;
  }
}

export async function getRaceResults(season: string | number, round: string | number): Promise<ResultRace | null> {
  try {
    const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/${round}/results.json`);
    const races = data?.MRData?.RaceTable?.Races;
    return races && races.length > 0 ? races[0] : null;
  } catch (_error) {
    // We don't have mock results yet, just return null on error
    return null;
  }
}
