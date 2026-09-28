// PacevionMobile/src/services/liveRaceTracker.ts
import type { RaceResult, ResultRace, Race } from '../api/types';
import { liveNotificationStore } from './liveNotificationStore';
import { getTeamDetails } from '../data/teamDetails';

interface DriverLapState {
  driverId: string;
  driverName: string;
  driverCode: string;
  position: number;
  grid: number;
  laps: number;
  status: string;
  pitCount?: number;
  fastestLap?: string;
  constructorId: string;
}

interface RaceSnapshot {
  season: string;
  round: string;
  raceName: string;
  maxLaps: number;
  currentLeaderId?: string;
  fastestLapDriverId?: string;
  fastestLapTime?: string;
  driverStates: Map<string, DriverLapState>;
  retirements: Set<string>;
  lap1Processed: boolean;
  lap2Processed: boolean;
  lap3Processed: boolean;
  finishedProcessed: boolean;
}

class LiveRaceTracker {
  private activeSnapshots: Map<string, RaceSnapshot> = new Map();

  private getRaceKey(season: string, round: string): string {
    return `${season}_${round}`;
  }

  /**
   * Dispatches both browser Notification (if permitted) and in-app store record
   */
  private emitEvent(
    params: {
      eventId: string;
      season: string;
      round: string;
      raceName: string;
      lap?: number;
      type: import('./liveNotificationStore').LiveNotificationType;
      title: string;
      message: string;
      driverId?: string;
      driverCode?: string;
      teamColor?: string;
    }
  ): void {
    const added = liveNotificationStore.addNotification({
      id: params.eventId,
      season: params.season,
      round: params.round,
      raceName: params.raceName,
      timestamp: Date.now(),
      lap: params.lap,
      type: params.type,
      title: params.title,
      message: params.message,
      driverId: params.driverId,
      driverCode: params.driverCode,
      teamColor: params.teamColor,
    });

    if (added) {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(params.title, {
            body: params.message,
            icon: '/favicon.ico',
            tag: params.eventId,
          });
        } catch {
          // Ignore notification error
        }
      }
    }
  }

  /**
   * Process a race session becoming active (Race started)
   */
  public trackSessionStart(race: Race, sessionName: string): void {
    const season = race.season;
    const round = race.round;
    const eventId = `${season}_r${round}_start_${sessionName.toLowerCase().replace(/\s+/g, '_')}`;

    this.emitEvent({
      eventId,
      season,
      round,
      raceName: race.raceName,
      type: 'START',
      title: `🏁 ${sessionName.toUpperCase()} STARTED`,
      message: `${race.raceName} — ${sessionName} is now green and underway.`,
    });
  }

  /**
   * Primary telemetry/classification processor:
   * Compares incoming race classification against previous snapshot to identify events.
   */
  public processRaceResults(raceResults: ResultRace): void {
    if (!raceResults || !raceResults.Results || raceResults.Results.length === 0) {
      return;
    }

    const season = raceResults.season;
    const round = raceResults.round;
    const raceName = raceResults.raceName;
    const raceKey = this.getRaceKey(season, round);

    let snapshot = this.activeSnapshots.get(raceKey);
    const isFirstRun = !snapshot;

    if (!snapshot) {
      snapshot = {
        season,
        round,
        raceName,
        maxLaps: 0,
        driverStates: new Map(),
        retirements: new Set(),
        lap1Processed: false,
        lap2Processed: false,
        lap3Processed: false,
        finishedProcessed: false,
      };
      this.activeSnapshots.set(raceKey, snapshot);
    }

    const results = raceResults.Results;
    let currentMaxLaps = 0;
    const currentLeader = results.find(r => r.position === '1');
    const currentFastestLap = results.find(r => r.FastestLap?.rank === '1');

    results.forEach(r => {
      const l = parseInt(r.laps, 10);
      if (!isNaN(l) && l > currentMaxLaps) currentMaxLaps = l;
    });

    snapshot.maxLaps = Math.max(snapshot.maxLaps, currentMaxLaps);
    const currentLap = currentMaxLaps;

    // 1. Leader Change Detection
    if (currentLeader && currentLeader.Driver) {
      const leaderId = currentLeader.Driver.driverId;
      const leaderName = `${currentLeader.Driver.givenName} ${currentLeader.Driver.familyName}`;
      const leaderCode = currentLeader.Driver.code || currentLeader.Driver.familyName.slice(0, 3).toUpperCase();
      const teamColor = getTeamDetails(currentLeader.Constructor.constructorId).color;

      if (!isFirstRun && snapshot.currentLeaderId && snapshot.currentLeaderId !== leaderId) {
        const prevDriverState = snapshot.driverStates.get(snapshot.currentLeaderId);
        const prevName = prevDriverState ? prevDriverState.driverName : 'the previous leader';
        const eventId = `${season}_r${round}_lap${currentLap}_leader_${leaderId}`;

        this.emitEvent({
          eventId,
          season,
          round,
          raceName,
          lap: currentLap,
          type: 'LEADER',
          title: `🏎️ RACE LEAD CHANGE — LAP ${currentLap}`,
          message: `${leaderName} (${leaderCode}) has taken the race lead from ${prevName}!`,
          driverId: leaderId,
          driverCode: leaderCode,
          teamColor,
        });
      }

      snapshot.currentLeaderId = leaderId;
    }

    // 2. Fastest Lap Detection
    if (currentFastestLap && currentFastestLap.FastestLap?.Time?.time) {
      const flDriverId = currentFastestLap.Driver.driverId;
      const flTime = currentFastestLap.FastestLap.Time.time;
      const flLap = parseInt(currentFastestLap.FastestLap.lap, 10) || currentLap;
      const flDriverName = `${currentFastestLap.Driver.givenName} ${currentFastestLap.Driver.familyName}`;
      const flDriverCode = currentFastestLap.Driver.code || currentFastestLap.Driver.familyName.slice(0, 3).toUpperCase();
      const teamColor = getTeamDetails(currentFastestLap.Constructor.constructorId).color;

      if (!isFirstRun && snapshot.fastestLapTime && snapshot.fastestLapTime !== flTime) {
        const eventId = `${season}_r${round}_lap${flLap}_fastestlap_${flDriverId}_${flTime.replace(/[^a-zA-Z0-9]/g, '')}`;

        this.emitEvent({
          eventId,
          season,
          round,
          raceName,
          lap: flLap,
          type: 'FASTEST_LAP',
          title: `⚡ NEW FASTEST LAP — ${flTime}`,
          message: `${flDriverName} (${flDriverCode}) clocked the fastest lap of ${flTime} on Lap ${flLap}.`,
          driverId: flDriverId,
          driverCode: flDriverCode,
          teamColor,
        });
      }

      snapshot.fastestLapDriverId = flDriverId;
      snapshot.fastestLapTime = flTime;
    }

    // 3. First 3 Laps Grouped Overtake & Shuffle Analysis
    if (currentLap >= 1 && currentLap <= 3) {
      const isLap1 = currentLap === 1 && !snapshot.lap1Processed;
      const isLap2 = currentLap === 2 && !snapshot.lap2Processed;
      const isLap3 = currentLap === 3 && !snapshot.lap3Processed;

      if (isLap1 || isLap2 || isLap3) {
        const notableChanges: string[] = [];
        let totalOvertakes = 0;

        results.forEach(r => {
          const posNum = parseInt(r.position, 10);
          const gridPos = parseInt(r.grid, 10);
          if (gridPos > 0 && !isNaN(posNum)) {
            const gain = gridPos - posNum;
            if (gain !== 0) {
              totalOvertakes++;
              if (Math.abs(gain) >= 2 || posNum <= 3) {
                const prefix = gain > 0 ? `+${gain}` : `${gain}`;
                notableChanges.push(`${r.Driver.familyName} (P${posNum}, ${prefix})`);
              }
            }
          }
        });

        if (notableChanges.length > 0) {
          const eventId = `${season}_r${round}_lap${currentLap}_opening_summary`;
          const summaryStr = notableChanges.slice(0, 3).join(', ');
          const moreCount = notableChanges.length > 3 ? ` and ${notableChanges.length - 3} more` : '';

          this.emitEvent({
            eventId,
            season,
            round,
            raceName,
            lap: currentLap,
            type: 'FIRST_LAPS',
            title: `🚦 LAP ${currentLap} CLASSIFICATION UPDATE`,
            message: `Lap ${currentLap}: ${totalOvertakes} position changes across the field. Highlights: ${summaryStr}${moreCount}.`,
          });
        }

        if (isLap1) snapshot.lap1Processed = true;
        if (isLap2) snapshot.lap2Processed = true;
        if (isLap3) snapshot.lap3Processed = true;
      }
    }

    // 4. Retirements / DNFs Detection
    results.forEach(r => {
      const driverId = r.Driver.driverId;
      const status = r.status || '';
      const isFinished = status === 'Finished' || /^\+/.test(status) || /lap/i.test(status);
      const isRetired = !isFinished && status !== '' && status !== 'Running' && status !== 'Active';

      if (isRetired && !snapshot.retirements.has(driverId)) {
        snapshot.retirements.add(driverId);
        const driverName = `${r.Driver.givenName} ${r.Driver.familyName}`;
        const driverCode = r.Driver.code || r.Driver.familyName.slice(0, 3).toUpperCase();
        const teamName = r.Constructor.name;
        const teamColor = getTeamDetails(r.Constructor.constructorId).color;
        const lapNum = parseInt(r.laps, 10) || currentLap;
        const eventId = `${season}_r${round}_lap${lapNum}_dnf_${driverId}`;

        this.emitEvent({
          eventId,
          season,
          round,
          raceName,
          lap: lapNum,
          type: 'DNF',
          title: `⚠️ RETIREMENT — ${driverCode}`,
          message: `Lap ${lapNum}: ${driverName} (${teamName}) has retired from the race (${status}).`,
          driverId,
          driverCode,
          teamColor,
        });
      }
    });

    // 5. Significant Position Gains (>3 places gained mid-race)
    if (!isFirstRun && currentLap > 3) {
      results.forEach(r => {
        const driverId = r.Driver.driverId;
        const currentPos = parseInt(r.position, 10);
        const prev = snapshot.driverStates.get(driverId);

        if (prev && !isNaN(currentPos) && prev.position > 0) {
          const delta = prev.position - currentPos;
          if (delta >= 3) {
            const driverName = `${r.Driver.givenName} ${r.Driver.familyName}`;
            const driverCode = r.Driver.code || r.Driver.familyName.slice(0, 3).toUpperCase();
            const teamColor = getTeamDetails(r.Constructor.constructorId).color;
            const eventId = `${season}_r${round}_lap${currentLap}_gain_${driverId}_p${currentPos}`;

            this.emitEvent({
              eventId,
              season,
              round,
              raceName,
              lap: currentLap,
              type: 'OVERTAKE',
              title: `🔥 MAJOR MOVE — ${driverCode} P${currentPos}`,
              message: `Lap ${currentLap}: ${driverName} surged +${delta} positions into P${currentPos}!`,
              driverId,
              driverCode,
              teamColor,
            });
          }
        }
      });
    }

    // 6. Race Finished / Chequered Flag
    const allCompletedOrRetired = results.every(r => {
      const s = r.status || '';
      return s === 'Finished' || /^\+/.test(s) || /lap/i.test(s) || snapshot.retirements.has(r.Driver.driverId);
    });

    if (allCompletedOrRetired && currentLeader && !snapshot.finishedProcessed && currentLap > 10) {
      snapshot.finishedProcessed = true;
      const winnerName = `${currentLeader.Driver.givenName} ${currentLeader.Driver.familyName}`;
      const winnerCode = currentLeader.Driver.code || currentLeader.Driver.familyName.slice(0, 3).toUpperCase();
      const winnerTeam = currentLeader.Constructor.name;
      const teamColor = getTeamDetails(currentLeader.Constructor.constructorId).color;
      const eventId = `${season}_r${round}_finish`;

      this.emitEvent({
        eventId,
        season,
        round,
        raceName,
        lap: currentLap,
        type: 'FINISH',
        title: `🏁 CHEQUERED FLAG — ${raceName.toUpperCase()}`,
        message: `${winnerName} (${winnerTeam}) wins the ${raceName}! Official race classification is now finalized.`,
        driverId: currentLeader.Driver.driverId,
        driverCode: winnerCode,
        teamColor,
      });
    }

    // Update snapshot driver states
    results.forEach((r: RaceResult) => {
      const posNum = parseInt(r.position, 10);
      const gridPos = parseInt(r.grid, 10);
      const laps = parseInt(r.laps, 10) || currentLap;

      snapshot.driverStates.set(r.Driver.driverId, {
        driverId: r.Driver.driverId,
        driverName: `${r.Driver.givenName} ${r.Driver.familyName}`,
        driverCode: r.Driver.code || r.Driver.familyName.slice(0, 3).toUpperCase(),
        position: isNaN(posNum) ? 0 : posNum,
        grid: isNaN(gridPos) ? 0 : gridPos,
        laps,
        status: r.status || '',
        constructorId: r.Constructor.constructorId,
      });
    });
  }
}

export const liveRaceTracker = new LiveRaceTracker();
