import { useQuery } from '@tanstack/react-query';
import {
  getCalendar,
  getDriverStandings,
  getConstructorStandings,
  getRaceResults,
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

export const useConstructorStandings = (year: string | number = 'current') => {
  return useQuery({
    queryKey: ['constructorStandings', year],
    queryFn: () => getConstructorStandings(year),
  });
};

export const useRaceResults = (season: string | number, round: string | number) => {
  return useQuery({
    queryKey: ['raceResults', season, round],
    queryFn: () => getRaceResults(season, round),
    enabled: !!season && !!round,
  });
};
