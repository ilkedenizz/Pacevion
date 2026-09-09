import { useQuery } from '@tanstack/react-query';
import { getCalendar, getDriverStandings, getRaceResults, getConstructorStandings, getSeasonCalendar, getQualifyingResults } from '../api/endpoints';
import { useSeason } from '../context/SeasonContext';

/**
 * Hook to fetch the current season's race calendar.
 */
export function useCalendar() {
  const { season } = useSeason();
  return useQuery({
    queryKey: ['calendar', season],
    queryFn: () => getCalendar(season),
  });
}

/**
 * Hook to fetch the current season's driver standings.
 */
export function useDriverStandings() {
  const { season } = useSeason();
  return useQuery({
    queryKey: ['driverStandings', season],
    queryFn: () => getDriverStandings(season),
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
  const { season } = useSeason();
  return useQuery({
    queryKey: ['constructorStandings', season],
    queryFn: () => getConstructorStandings(season),
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

