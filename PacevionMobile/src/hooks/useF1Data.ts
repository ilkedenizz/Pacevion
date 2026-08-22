import { useQuery } from '@tanstack/react-query';
import {
  getCalendar,
  getDriverStandings,
  getConstructorStandingsWithRound,
  getRaceResults,
  getAllSeasonResults,
  getAllSeasonQualifying,
  getQualifyingResults,
  getDriverStandingsWithRound,
  getLatestRaceResults,
  getSprintResults,
} from '../api/endpoints';

export const useCalendar = (year: string | number = 'current') => {
  return useQuery({
    queryKey: ['calendar', year],
    queryFn: () => getCalendar(year),
  });
};

export const useDriverStandings = (year: string | number = 'current') => {
  return useQuery({
    queryKey: ['driverStandings', year],
    queryFn: () => getDriverStandings(year),
  });
};

export const useDriverStandingsWithPrevious = (year: string | number = 'current') => {
  return useQuery({
    queryKey: ['driverStandingsWithPrevious', year],
    queryFn: async () => {
      const current = await getDriverStandingsWithRound(year);
      if (!current.round || current.round === '0' || current.round === '1') {
        return { current: current.standings, previous: null };
      }
      const prevRound = parseInt(current.round) - 1;
      const prev = await getDriverStandingsWithRound(year, prevRound);
      return { current: current.standings, previous: prev.standings };
    },
  });
};

export const useConstructorStandings = (year: string | number = 'current') => {
  return useQuery({
    queryKey: ['constructorStandings', year],
    queryFn: async () => {
      const res = await getConstructorStandingsWithRound(year);
      return res.standings;
    }
  });
};

export const useConstructorStandingsWithPrevious = (year: string | number = 'current') => {
  return useQuery({
    queryKey: ['constructorStandingsWithPrevious', year],
    queryFn: async () => {
      const current = await getConstructorStandingsWithRound(year);
      if (!current.round || current.round === '0' || current.round === '1') {
        return { current: current.standings, previous: null };
      }
      const prevRound = parseInt(current.round) - 1;
      const prev = await getConstructorStandingsWithRound(year, prevRound);
      return { current: current.standings, previous: prev.standings };
    },
  });
};

export const useRaceResults = (season: string | number, round: string | number) => {
  return useQuery({
    queryKey: ['raceResults', season, round],
    queryFn: () => getRaceResults(season, round),
    enabled: !!season && !!round,
  });
};

export const useLatestRaceResults = () => {
  return useQuery({
    queryKey: ['latest-race-results'],
    queryFn: () => getLatestRaceResults(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAllSeasonResults = (season: string | number) => {
  return useQuery({
    queryKey: ['allSeasonResults', season],
    queryFn: () => getAllSeasonResults(season),
    enabled: !!season,
  });
};

export const useAllSeasonQualifying = (season: string | number) => {
  return useQuery({
    queryKey: ['allSeasonQualifying', season],
    queryFn: () => getAllSeasonQualifying(season),
    enabled: !!season,
  });
};

export const useQualifyingResults = (season: string | number, round: string | number) => {
  return useQuery({
    queryKey: ['qualifyingResults', season, round],
    queryFn: () => getQualifyingResults(season, round),
    enabled: !!season && !!round,
  });
};

export const useSprintResults = (season: string | number, round: string | number, isSprint: boolean) => {
  return useQuery({
    queryKey: ['sprintResults', season, round],
    queryFn: () => getSprintResults(season, round),
    enabled: !!season && !!round && isSprint,
  });
};
