// src/hooks/useF1Data.ts
import { useQuery } from '@tanstack/react-query';
import { getCalendar, getDriverStandings, getRaceResults, getConstructorStandings } from '../api/endpoints';

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
