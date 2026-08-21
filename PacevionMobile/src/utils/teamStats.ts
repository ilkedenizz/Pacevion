import type { ResultRace, DriverStanding } from '../api/types';

export interface TeamSeasonPerformance {
  raceName: string;
  round: string;
  pointsAcquired: number;
  totalPoints: number;
}

export function getTeamSeasonPerformance(constructorId: string, races: ResultRace[] | undefined): TeamSeasonPerformance[] {
  if (!races) return [];
  
  const perf: TeamSeasonPerformance[] = [];
  let total = 0;

  races.forEach(race => {
    let racePoints = 0;
    race.Results?.forEach(r => {
      if (r.Constructor.constructorId === constructorId) {
        racePoints += parseFloat(r.points || '0');
      }
    });

    total += racePoints;
    perf.push({
      raceName: race.raceName,
      round: race.round,
      pointsAcquired: racePoints,
      totalPoints: total
    });
  });

  return perf;
}

export function getTeamDrivers(constructorId: string, standings: DriverStanding[] | undefined) {
  if (!standings) return [];
  return standings.filter(s => s.Constructors[0]?.constructorId === constructorId);
}
