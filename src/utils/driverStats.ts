import type { ResultRace, QualifyingRace, DriverStanding } from '../api/types';

export interface DriverForm {
  raceName: string;
  round: string;
  grid: number | 'PIT' | null;
  position: number | 'DNF' | 'DNS' | 'DSQ';
  positionText: string;
  points: string;
  status: string;
  delta: number | null; // e.g. +3 (gained 3 places), -2 (lost 2 places), 0 (held), or null if not applicable
}

export interface DriverStatsAggr {
  bestFinish: string;
  avgFinish: string;
  winsCount: number;
  podiumsCount: number;
  pointsFinishes: number;
  dnfCount: number;
  classifiedCount: number;
  totalEntries: number;
}

export interface DriverTeammateComparison {
  teammate: DriverStanding | null;
  driverPoints: number;
  teammatePoints: number;
  driverWins: number;
  teammateWins: number;
  driverPodiums: number;
  teammatePodiums: number;
  driverRacesAhead: number;
  teammateRacesAhead: number;
  driverQualyWins: number;
  teammateQualyWins: number;
  equalRaces: number;
}

export function isClassifiedResult(status?: string): boolean {
  if (!status) return false;
  const s = status.trim().toLowerCase();
  if (s === 'finished') return true;
  if (/\+\d+\s*lap/i.test(s) || /laps?$/i.test(s) || s.includes('lap')) return true;
  return false;
}

export function parseGridPosition(gridStr?: string): number | 'PIT' | null {
  if (!gridStr && gridStr !== '0') return null;
  const trimmed = String(gridStr).trim();
  if (trimmed === '0') return 'PIT';
  const num = parseInt(trimmed, 10);
  if (isNaN(num) || num <= 0) return null;
  return num;
}

export function parseFinishPosition(posStr?: string, status?: string, posText?: string): number | 'DNF' | 'DNS' | 'DSQ' {
  const statusStr = (status || '').toLowerCase();
  const textStr = (posText || '').toUpperCase();

  if (statusStr.includes('disqualified') || textStr === 'D' || textStr === 'DSQ') {
    return 'DSQ';
  }
  if (statusStr.includes('did not start') || statusStr.includes('not started') || textStr === 'W' || textStr === 'DNS') {
    return 'DNS';
  }

  if (isClassifiedResult(status)) {
    const num = parseInt(posStr || posText || '', 10);
    if (!isNaN(num) && num > 0) return num;
  }

  return 'DNF';
}

export function calculateGridDelta(grid: number | 'PIT' | null, position: number | 'DNF' | 'DNS' | 'DSQ'): number | null {
  if (typeof grid !== 'number' || typeof position !== 'number') {
    return null;
  }
  return grid - position;
}

export function getDriverForm(driverId: string, races: ResultRace[] | undefined, limit?: number): DriverForm[] {
  if (!races || races.length === 0 || !driverId) return [];

  const forms: DriverForm[] = [];

  for (const race of races) {
    const res = race.Results?.find(r => r.Driver.driverId === driverId);
    if (res) {
      const grid = parseGridPosition(res.grid);
      const position = parseFinishPosition(res.position, res.status, res.positionText);
      const delta = calculateGridDelta(grid, position);

      forms.push({
        raceName: race.raceName,
        round: race.round,
        grid,
        position,
        positionText: res.positionText || res.position,
        points: res.points || '0',
        status: res.status || 'Finished',
        delta
      });
    }
  }

  return limit ? forms.slice(-limit) : forms;
}

export function getDriverStatsAggr(driverId: string, races: ResultRace[] | undefined): DriverStatsAggr {
  const defaultStats: DriverStatsAggr = {
    bestFinish: '—',
    avgFinish: '—',
    winsCount: 0,
    podiumsCount: 0,
    pointsFinishes: 0,
    dnfCount: 0,
    classifiedCount: 0,
    totalEntries: 0
  };

  if (!races || races.length === 0 || !driverId) return defaultStats;

  const finishes: number[] = [];
  let best = Infinity;
  let wins = 0;
  let podiums = 0;
  let pointsFinishes = 0;
  let dnfCount = 0;
  let totalEntries = 0;

  races.forEach(race => {
    const res = race.Results?.find(r => r.Driver.driverId === driverId);
    if (res) {
      totalEntries++;
      const pos = parseFinishPosition(res.position, res.status, res.positionText);

      if (typeof pos === 'number') {
        finishes.push(pos);
        if (pos < best) best = pos;
        if (pos === 1) wins++;
        if (pos <= 3) podiums++;
        if (pos <= 10) pointsFinishes++;
      } else {
        dnfCount++;
      }
    }
  });

  return {
    bestFinish: best === Infinity ? '—' : `P${best}`,
    avgFinish: finishes.length > 0 ? `P${(finishes.reduce((a, b) => a + b, 0) / finishes.length).toFixed(1)}` : '—',
    winsCount: wins,
    podiumsCount: podiums,
    pointsFinishes,
    dnfCount,
    classifiedCount: finishes.length,
    totalEntries
  };
}

export function getTeammateComparison(
  driverId: string,
  constructorId: string | undefined,
  standings: DriverStanding[] | undefined,
  raceResults: ResultRace[] | undefined,
  qualyResults: QualifyingRace[] | undefined
): DriverTeammateComparison {
  const defaultComp: DriverTeammateComparison = {
    teammate: null,
    driverPoints: 0,
    teammatePoints: 0,
    driverWins: 0,
    teammateWins: 0,
    driverPodiums: 0,
    teammatePodiums: 0,
    driverRacesAhead: 0,
    teammateRacesAhead: 0,
    driverQualyWins: 0,
    teammateQualyWins: 0,
    equalRaces: 0
  };

  if (!driverId || !constructorId || !standings || standings.length === 0) {
    return defaultComp;
  }

  const driverStd = standings.find(s => s.Driver.driverId === driverId);
  const teammateStd = standings.find(s =>
    s.Constructors[0]?.constructorId === constructorId &&
    s.Driver.driverId !== driverId
  );

  if (!teammateStd) {
    return {
      ...defaultComp,
      driverPoints: parseFloat(driverStd?.points || '0'),
      driverWins: parseInt(driverStd?.wins || '0', 10)
    };
  }

  const teammateId = teammateStd.Driver.driverId;

  let dWins = 0, tWins = 0;
  let dPod = 0, tPod = 0;
  let dRacesAhead = 0, tRacesAhead = 0, eqRaces = 0;
  let dQualy = 0, tQualy = 0;

  if (raceResults && raceResults.length > 0) {
    raceResults.forEach(race => {
      const dRes = race.Results?.find(r => r.Driver.driverId === driverId);
      const tRes = race.Results?.find(r => r.Driver.driverId === teammateId);

      if (dRes) {
        const p = parseFinishPosition(dRes.position, dRes.status, dRes.positionText);
        if (typeof p === 'number') {
          if (p === 1) dWins++;
          if (p <= 3) dPod++;
        }
      }

      if (tRes) {
        const p = parseFinishPosition(tRes.position, tRes.status, tRes.positionText);
        if (typeof p === 'number') {
          if (p === 1) tWins++;
          if (p <= 3) tPod++;
        }
      }

      if (dRes && tRes) {
        const dPos = parseFinishPosition(dRes.position, dRes.status, dRes.positionText);
        const tPos = parseFinishPosition(tRes.position, tRes.status, tRes.positionText);

        const dClassified = typeof dPos === 'number';
        const tClassified = typeof tPos === 'number';

        if (dClassified && tClassified) {
          if (dPos < tPos) dRacesAhead++;
          else if (tPos < dPos) tRacesAhead++;
          else eqRaces++;
        } else if (dClassified && !tClassified) {
          dRacesAhead++;
        } else if (!dClassified && tClassified) {
          tRacesAhead++;
        } else {
          eqRaces++;
        }
      }
    });
  }

  if (qualyResults && qualyResults.length > 0) {
    qualyResults.forEach(race => {
      const dRes = race.QualifyingResults?.find(r => r.Driver.driverId === driverId);
      const tRes = race.QualifyingResults?.find(r => r.Driver.driverId === teammateId);

      if (dRes && tRes) {
        const dPos = parseInt(dRes.position, 10);
        const tPos = parseInt(tRes.position, 10);
        if (!isNaN(dPos) && !isNaN(tPos)) {
          if (dPos < tPos) dQualy++;
          else if (tPos < dPos) tQualy++;
        }
      }
    });
  }

  return {
    teammate: teammateStd,
    driverPoints: parseFloat(driverStd?.points || '0'),
    teammatePoints: parseFloat(teammateStd.points || '0'),
    driverWins: dWins || parseInt(driverStd?.wins || '0', 10),
    teammateWins: tWins || parseInt(teammateStd.wins || '0', 10),
    driverPodiums: dPod,
    teammatePodiums: tPod,
    driverRacesAhead: dRacesAhead,
    teammateRacesAhead: tRacesAhead,
    driverQualyWins: dQualy,
    teammateQualyWins: tQualy,
    equalRaces: eqRaces
  };
}
