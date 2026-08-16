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

export async function getCalendar(year: string | number = 'current'): Promise<Race[]> {
  const data = await fetchClient<MRDataCalendarResponse>(`/${year}.json`);
  return data.MRData.RaceTable.Races;
}

export async function getDriverStandings(year: string | number = 'current'): Promise<DriverStanding[]> {
  const data = await fetchClient<MRDataDriverStandingsResponse>(`/${year}/driverStandings.json`);
  const lists = data.MRData.StandingsTable.StandingsLists;
  return lists.length > 0 ? lists[0].DriverStandings : [];
}

export async function getConstructorStandings(year: string | number = 'current'): Promise<ConstructorStanding[]> {
  const data = await fetchClient<MRDataConstructorStandingsResponse>(`/${year}/constructorStandings.json`);
  const lists = data.MRData.StandingsTable.StandingsLists;
  return lists.length > 0 ? lists[0].ConstructorStandings : [];
}

export async function getRaceResults(season: string | number, round: string | number): Promise<ResultRace | null> {
  const data = await fetchClient<MRDataRaceResultsResponse>(`/${season}/${round}/results.json`);
  const races = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}
