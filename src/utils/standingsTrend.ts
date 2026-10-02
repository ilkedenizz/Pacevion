import type { DriverStanding, ConstructorStanding } from '../api/types';

export interface PositionTrendResult {
  type: 'up' | 'down' | 'same' | 'none';
  diff: number | null;
  text: string;
  symbol: string;
  className: string;
}

const NO_TREND: PositionTrendResult = {
  type: 'none',
  diff: null,
  text: '—',
  symbol: '—',
  className: 'trend-same',
};

/**
 * Calculates the position trend of a driver by comparing current standings with
 * the standings from the immediately preceding completed race/round.
 */
export function calculateDriverTrend(
  driverId: string | undefined | null,
  currentPosition: string | number | undefined | null,
  previousStandings: DriverStanding[] | null | undefined
): PositionTrendResult {
  if (!driverId || currentPosition === undefined || currentPosition === null) {
    return NO_TREND;
  }

  const curr = typeof currentPosition === 'number' ? currentPosition : parseInt(String(currentPosition), 10);
  if (isNaN(curr)) {
    return NO_TREND;
  }

  if (!previousStandings || !Array.isArray(previousStandings) || previousStandings.length === 0) {
    return NO_TREND;
  }

  const prevItem = previousStandings.find((d) => d?.Driver?.driverId === driverId);
  if (!prevItem || !prevItem.position) {
    return NO_TREND;
  }

  const prev = parseInt(String(prevItem.position), 10);
  if (isNaN(prev)) {
    return NO_TREND;
  }

  const diff = prev - curr;

  if (diff > 0) {
    return {
      type: 'up',
      diff,
      text: `▲${diff}`,
      symbol: '▲',
      className: 'trend-up',
    };
  }

  if (diff < 0) {
    return {
      type: 'down',
      diff,
      text: `▼${Math.abs(diff)}`,
      symbol: '▼',
      className: 'trend-down',
    };
  }

  return {
    type: 'same',
    diff: 0,
    text: '=',
    symbol: '=',
    className: 'trend-same',
  };
}

/**
 * Calculates the position trend of a constructor by comparing current standings with
 * the standings from the immediately preceding completed race/round.
 */
export function calculateConstructorTrend(
  constructorId: string | undefined | null,
  currentPosition: string | number | undefined | null,
  previousStandings: ConstructorStanding[] | null | undefined
): PositionTrendResult {
  if (!constructorId || currentPosition === undefined || currentPosition === null) {
    return NO_TREND;
  }

  const curr = typeof currentPosition === 'number' ? currentPosition : parseInt(String(currentPosition), 10);
  if (isNaN(curr)) {
    return NO_TREND;
  }

  if (!previousStandings || !Array.isArray(previousStandings) || previousStandings.length === 0) {
    return NO_TREND;
  }

  const prevItem = previousStandings.find((c) => c?.Constructor?.constructorId === constructorId);
  if (!prevItem || !prevItem.position) {
    return NO_TREND;
  }

  const prev = parseInt(String(prevItem.position), 10);
  if (isNaN(prev)) {
    return NO_TREND;
  }

  const diff = prev - curr;

  if (diff > 0) {
    return {
      type: 'up',
      diff,
      text: `▲${diff}`,
      symbol: '▲',
      className: 'trend-up',
    };
  }

  if (diff < 0) {
    return {
      type: 'down',
      diff,
      text: `▼${Math.abs(diff)}`,
      symbol: '▼',
      className: 'trend-down',
    };
  }

  return {
    type: 'same',
    diff: 0,
    text: '=',
    symbol: '=',
    className: 'trend-same',
  };
}
