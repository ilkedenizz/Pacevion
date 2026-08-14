// src/api/endpoints.ts
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

/**
 * Fetch the calendar for a specific season.
 */
export async function getSeasonCalendar(season: string): Promise<Race[]> {
  const data = await fetchClient<MRDataCalendarResponse>(`/${season}.json`);
  return data.MRData.RaceTable.Races;
}

/**
 * Fetch qualifying results for a specific race.
 */
export async function getQualifyingResults(season: string, round: string): Promise<QualifyingRace | null> {
  const data = await fetchClient<MRDataQualifyingResponse>(`/${season}/${round}/qualifying.json`);
  const races = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}
