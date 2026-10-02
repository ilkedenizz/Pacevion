import { useQuery } from '@tanstack/react-query';
import {
  getCalendar,
  getDriverStandings,
  getDriverStandingsWithRound,
  getRaceResults,
  getLatestRaceResults,
  getAllSeasonResults,
  getAllSeasonQualifying,
  getConstructorStandings,
  getConstructorStandingsWithRound,
  getSeasonCalendar,
  getQualifyingResults,
  getSprintResults,
  getPitStops
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
 * Hook to fetch current driver standings along with the previous round's standings for trend calculation.
 */
export function useDriverStandingsWithPrevious(customSeason?: string) {
  const { season: contextSeason } = useSeason();
  const season = customSeason || contextSeason || '2026';
  return useQuery({
    queryKey: ['driverStandingsWithPrevious', season],
    queryFn: async () => {
      const current = await getDriverStandingsWithRound(season);
      if (!current.round || current.round === '0' || current.round === '1') {
        return { current: current.standings, previous: null };
      }
      const prevRound = parseInt(current.round, 10) - 1;
      const prev = await getDriverStandingsWithRound(season, prevRound);
      return { current: current.standings, previous: prev.standings };
    },
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
 * Hook to fetch all qualifying results for a season.
 */
export function useAllSeasonQualifying(season: string) {
  return useQuery({
    queryKey: ['allSeasonQualifying', season],
    queryFn: () => getAllSeasonQualifying(season),
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
 * Hook to fetch current constructor standings along with the previous round's standings for trend calculation.
 */
export function useConstructorStandingsWithPrevious(customSeason?: string) {
  const { season: contextSeason } = useSeason();
  const season = customSeason || contextSeason || '2026';
  return useQuery({
    queryKey: ['constructorStandingsWithPrevious', season],
    queryFn: async () => {
      const current = await getConstructorStandingsWithRound(season);
      if (!current.round || current.round === '0' || current.round === '1') {
        return { current: current.standings, previous: null };
      }
      const prevRound = parseInt(current.round, 10) - 1;
      const prev = await getConstructorStandingsWithRound(season, prevRound);
      return { current: current.standings, previous: prev.standings };
    },
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

/**
 * Hook to fetch pit stops for a specific race.
 */
export function usePitStops(season: string, round: string, pollingInterval: number | null = null) {
  return useQuery({
    queryKey: ['pitStops', season, round],
    queryFn: () => getPitStops(season, round),
    enabled: !!season && !!round,
    refetchInterval: pollingInterval || false,
  });
}

