import { fetchClient } from './fetchClient';
import type {
  MRDataCalendarResponse,
  MRDataDriverStandingsResponse,
  MRDataRaceResultsResponse,
  MRDataConstructorStandingsResponse,
  MRDataQualifyingResponse,
  Race,
  DriverStanding,
  ConstructorStanding,
  ResultRace,
  QualifyingRace,
} from './types';
import { MOCK_2027_RACES } from '../data/mock2027';

/**
 * Fetch the race calendar/schedule for the current season.
 */
export async function getCalendar(season: string = '2026'): Promise<Race[]> {
  if (season === '2027') return MOCK_2027_RACES;
  try {
    const data = await fetchClient<MRDataCalendarResponse>(`/${season}.json`);
    return data.MRData.RaceTable.Races;
  } catch (error) {
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
    const lists = data.MRData.StandingsTable.StandingsLists;
    return lists.length > 0 ? lists[0].DriverStandings : [];
  } catch (error) {
    if (season === '2027') return [];
    throw error;
  }
}

/**
 * Fetch results for a specific race.
 */
export async function getRaceResults(season: string, round: string): Promise<ResultRace | null> {
  if (season === '2027') return null;
  const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/${round}/results.json`);
  const races = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}

/**
 * Fetch the constructor standings for the current season.
 */
export async function getConstructorStandings(season: string = '2026'): Promise<ConstructorStanding[]> {
  if (season === '2027') return [];
  try {
    const data = await fetchClient<MRDataConstructorStandingsResponse>(`/${season}/constructorStandings.json`);
    const lists = data.MRData.StandingsTable.StandingsLists;
    return lists.length > 0 ? lists[0].ConstructorStandings : [];
  } catch (error) {
    if (season === '2027') return [];
    throw error;
  }
}

/**
 * Fetch the calendar for a specific season.
 */
export async function getSeasonCalendar(season: string): Promise<Race[]> {
  if (season === '2027') return MOCK_2027_RACES;
  const data = await fetchClient<MRDataCalendarResponse>(`/${season}.json`);
  return data.MRData.RaceTable.Races;
}

/**
 * Fetch qualifying results for a specific race.
 */
export async function getQualifyingResults(season: string, round: string): Promise<QualifyingRace | null> {
  if (season === '2027') return null;
  const data = await fetchClient<MRDataQualifyingResponse>(`/${season}/${round}/qualifying.json`);
  const races = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}

