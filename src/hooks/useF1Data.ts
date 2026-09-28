import { useQuery } from '@tanstack/react-query';
import {
  getCalendar,
  getDriverStandings,
  getRaceResults,
  getLatestRaceResults,
  getAllSeasonResults,
  getConstructorStandings,
  getSeasonCalendar,
  getQualifyingResults,
  getSprintResults
} from '../api/endpoints';
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
 * Hook to fetch the latest completed race results.
 */
export function useLatestRaceResults() {
  return useQuery({
    queryKey: ['latestRaceResults'],
    queryFn: () => getLatestRaceResults(),
  });
}

/**
 * Hook to fetch all race results for a season.
 */
export function useAllSeasonResults(season: string) {
  return useQuery({
    queryKey: ['allSeasonResults', season],
    queryFn: () => getAllSeasonResults(season),
    enabled: !!season,
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

/**
 * Hook to fetch sprint race results for a specific race.
 */
export function useSprintResults(season: string, round: string) {
  return useQuery({
    queryKey: ['sprintResults', season, round],
    queryFn: () => getSprintResults(season, round),
    enabled: !!season && !!round,
  });
}
