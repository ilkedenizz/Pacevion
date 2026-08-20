import type { ResultRace, QualifyingRace, DriverStanding } from '../api/types';

export interface DriverForm {
  raceName: string;
  round: string;
  position: number | 'DNF';
}

export interface DriverTeammateComparison {
  teammate: DriverStanding | null;
  driverPoints: number;
  teammatePoints: number;
  driverWins: number;
  teammateWins: number;
  driverPodiums: number;
  teammatePodiums: number;
  driverQualyWins: number;
  teammateQualyWins: number;
}

export function getDriverForm(driverId: string, races: ResultRace[] | undefined, limit: number = 5): DriverForm[] {
  if (!races) return [];
  
  const forms: DriverForm[] = [];
  
  for (const race of races) {
    const res = race.Results?.find(r => r.Driver.driverId === driverId);
    if (res) {
      const isFinished = res.status === 'Finished' || /lap/i.test(res.status);
      forms.push({
        raceName: race.raceName,
        round: race.round,
        position: isFinished ? parseInt(res.position, 10) : 'DNF'
      });
    }
  }

  // return the last `limit` races
  return forms.slice(-limit);
}

export function getDriverStatsAggr(driverId: string, races: ResultRace[] | undefined) {
  if (!races) return { bestFinish: null, avgFinish: null };
  
  const finishes: number[] = [];
  let best = Infinity;

  races.forEach(race => {
    const res = race.Results?.find(r => r.Driver.driverId === driverId);
    if (res) {
      const pos = parseInt(res.position, 10);
      if (res.status === 'Finished' || /lap/i.test(res.status)) {
        finishes.push(pos);
        if (pos < best) best = pos;
      }
    }
  });

  return {
    bestFinish: best === Infinity ? 'N/A' : `P${best}`,
    avgFinish: finishes.length > 0 ? `P${(finishes.reduce((a,b)=>a+b,0) / finishes.length).toFixed(1)}` : 'N/A'
  };
}

export function getTeammateComparison(
  driverId: string, 
  constructorId: string, 
  standings: DriverStanding[] | undefined,
  raceResults: ResultRace[] | undefined,
  qualyResults: QualifyingRace[] | undefined
): DriverTeammateComparison {
  
  const driverStd = standings?.find(s => s.Driver.driverId === driverId);
  const teammateStd = standings?.find(s => 
    s.Constructors[0]?.constructorId === constructorId && 
    s.Driver.driverId !== driverId
  );

  let dWins = 0, tWins = 0;
  let dPod = 0, tPod = 0;
  let dQualy = 0, tQualy = 0;

  if (raceResults) {
    raceResults.forEach(race => {
      const dRes = race.Results?.find(r => r.Driver.driverId === driverId);
      const tRes = teammateStd ? race.Results?.find(r => r.Driver.driverId === teammateStd.Driver.driverId) : null;

      if (dRes) {
        const p = parseInt(dRes.position, 10);
        if (p === 1) dWins++;
        if (p <= 3) dPod++;
      }
      if (tRes) {
        const p = parseInt(tRes.position, 10);
        if (p === 1) tWins++;
        if (p <= 3) tPod++;
      }
    });
  }

  if (qualyResults) {
    qualyResults.forEach(race => {
      const dRes = race.QualifyingResults?.find(r => r.Driver.driverId === driverId);
      const tRes = teammateStd ? race.QualifyingResults?.find(r => r.Driver.driverId === teammateStd.Driver.driverId) : null;

      if (dRes && tRes) {
        const dPos = parseInt(dRes.position, 10);
        const tPos = parseInt(tRes.position, 10);
        if (dPos < tPos) dQualy++;
        else if (tPos < dPos) tQualy++;
      }
    });
  }

  return {
    teammate: teammateStd || null,
    driverPoints: parseFloat(driverStd?.points || '0'),
    teammatePoints: parseFloat(teammateStd?.points || '0'),
    driverWins: dWins,
    teammateWins: tWins,
    driverPodiums: dPod,
    teammatePodiums: tPod,
    driverQualyWins: dQualy,
    teammateQualyWins: tQualy
  };
}
