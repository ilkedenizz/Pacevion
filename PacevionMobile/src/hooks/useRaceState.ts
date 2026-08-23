import { useState, useEffect, useMemo, useCallback } from 'react';
import { App } from '@capacitor/app';
import { useCalendar } from './useF1Data';
import { getCurrentRaceState } from '../utils/raceWeekend';
import type { CurrentRaceState, RaceStateStatus } from '../utils/raceWeekend';
import { useQueryClient } from '@tanstack/react-query';

// Default refresh interval for the clock (not network requests)
const CLOCK_TICK_MS = 10000; // 10 seconds

export function useRaceState() {
  const { data: calendar, isLoading, isError, refetch: refetchCalendar } = useCalendar('2026');
  const [now, setNow] = useState(new Date());
  const queryClient = useQueryClient();

  const raceState = useMemo<CurrentRaceState | null>(() => {
    if (!calendar) return null;
    return getCurrentRaceState(calendar, now);
  }, [calendar, now]);

  // Tick the clock
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  // Handle App foreground (resume)
  useEffect(() => {
    const listener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        setNow(new Date()); // Update the clock immediately
        // When coming to foreground, we can invalidate active queries to force refetch
        queryClient.invalidateQueries({ queryKey: ['latest-race-results'] });
        queryClient.invalidateQueries({ queryKey: ['qualifyingResults'] });
        queryClient.invalidateQueries({ queryKey: ['sprintResults'] });
      }
    });

    return () => {
      listener.then(l => l.remove()).catch(() => {});
    };
  }, [queryClient]);

  // Determine ideal network polling interval based on current state
  const getPollingInterval = useCallback((status: RaceStateStatus) => {
    switch (status) {
      case 'ACTIVE_SESSION':
        return 30000; // 30 seconds
      case 'WAITING_FOR_SESSION':
        return 60000; // 1 minute
      case 'UPCOMING_WEEKEND':
        return 300000; // 5 minutes
      case 'POST_RACE':
        return 300000; // 5 minutes
      case 'NO_RACE_WEEKEND':
      default:
        return 600000; // 10 minutes
    }
  }, []);

  const pollingInterval = raceState ? getPollingInterval(raceState.status) : 600000;

  return {
    calendar,
    isLoading,
    isError,
    now,
    raceState,
    pollingInterval,
    refetchCalendar,
    forceRefreshTime: () => setNow(new Date()),
  };
}
