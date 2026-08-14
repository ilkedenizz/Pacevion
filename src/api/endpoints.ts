// src/api/endpoints.ts
import { fetchClient } from './fetchClient';
import type {
  MRDataCalendarResponse,
  MRDataDriverStandingsResponse,
  MRDataRaceResultsResponse,
  MRDataConstructorStandingsResponse,
  Race,
  DriverStanding,
  ConstructorStanding,
  ResultRace,
} from './types';

/**
 * Fetch the race calendar/schedule for the current season.
 */
export async function getCalendar(): Promise<Race[]> {
  const data = await fetchClient<MRDataCalendarResponse>('/current.json');
  return data.MRData.RaceTable.Races;
}

/**
 * Fetch the driver standings for the current season.
 */
export async function getDriverStandings(): Promise<DriverStanding[]> {
  const data = await fetchClient<MRDataDriverStandingsResponse>('/current/driverStandings.json');
  const lists = data.MRData.StandingsTable.StandingsLists;
  return lists.length > 0 ? lists[0].DriverStandings : [];
}

/**
 * Fetch results for a specific race.
 */
export async function getRaceResults(season: string, round: string): Promise<ResultRace | null> {
  const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/${round}/results.json`);
  const races = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}

/**
 * Fetch the constructor standings for the current season.
 */
export async function getConstructorStandings(): Promise<ConstructorStanding[]> {
  const data = await fetchClient<MRDataConstructorStandingsResponse>('/current/constructorStandings.json');
  const lists = data.MRData.StandingsTable.StandingsLists;
  return lists.length > 0 ? lists[0].ConstructorStandings : [];
}
