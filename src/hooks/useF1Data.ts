// src/hooks/useF1Data.ts
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getDriverStandings, getRaceResults, getConstructorStandings, getSeasonCalendar, getQualifyingResults } from '../api/endpoints';

/**
 * Hook to fetch the current season's race calendar.
 */
export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: getCalendar,
  });
}

/**
 * Hook to fetch the current season's driver standings.
 */
export function useDriverStandings() {
  return useQuery({
    queryKey: ['driverStandings'],
    queryFn: getDriverStandings,
  });
}

/**
 * Hook to fetch results for a specific race.
 */
export function useRaceResults(season: string, round: string) {
  return useQuery({
    queryKey: ['raceResults', season, round],
    queryFn: () => getRaceResults(season, round),
    enabled: !!season && !!round,
  });
}

/**
 * Hook to fetch the current season's constructor standings.
 */
export function useConstructorStandings() {
  return useQuery({
    queryKey: ['constructorStandings'],
    queryFn: getConstructorStandings,
  });
}

/**
 * Hook to fetch a specific season's calendar.
 */
export function useSeasonCalendar(season: string) {
  return useQuery({
    queryKey: ['seasonCalendar', season],
    queryFn: () => getSeasonCalendar(season),
    enabled: !!season,
  });
}

/**
 * Hook to fetch qualifying results for a specific race.
 */
export function useQualifyingResults(season: string, round: string) {
  return useQuery({
    queryKey: ['qualifyingResults', season, round],
    queryFn: () => getQualifyingResults(season, round),
    enabled: !!season && !!round,
  });
}
