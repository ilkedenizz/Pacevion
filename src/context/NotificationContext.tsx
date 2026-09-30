// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { liveNotificationStore } from '../services/liveNotificationStore';
import type { LiveNotification } from '../services/liveNotificationStore';
import { liveRaceTracker } from '../services/liveRaceTracker';
import { useRaceState } from '../hooks/useRaceState';
import { getRaceResults, getQualifyingResults, getSprintResults, getPitStops } from '../api/endpoints';

interface NotificationContextType {
  notifications: LiveNotification[];
  unreadCount: number;
  isOpen: boolean;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  requestBrowserPermission: () => Promise<boolean>;
  browserPermission: NotificationPermission | 'unsupported';
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<LiveNotification[]>(() => 
    liveNotificationStore.getNotifications()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('default');

  const queryClient = useQueryClient();
  const { raceState, pollingInterval } = useRaceState();
  const isFetchingRef = useRef(false);

  // Synchronize in-memory notification store
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    } else {
      setBrowserPermission('unsupported');
    }

    const unsubscribe = liveNotificationStore.subscribe((list) => {
      setNotifications(list);
    });

    return () => unsubscribe();
  }, []);

  // Track session start event
  useEffect(() => {
    if (raceState?.status === 'ACTIVE_SESSION' && raceState.race && raceState.activeSession) {
      liveRaceTracker.trackSessionStart(raceState.race, raceState.activeSession.name);
    }
  }, [raceState?.status, raceState?.race, raceState?.activeSession]);

  // Core global telemetry fetcher and event processor
  const fetchAndProcessLiveTelemetry = useCallback(async () => {
    if (!raceState || !raceState.race || isFetchingRef.current) return;

    const status = raceState.status;
    // Only poll live telemetry during active sessions or immediate post-race wrapup
    if (status !== 'ACTIVE_SESSION' && status !== 'POST_RACE') {
      return;
    }

    const season = String(raceState.race.season || '2026');
    const round = String(raceState.race.round || '1');
    const activeOrLast = raceState.activeSession || raceState.lastCompletedSession;
    const sessionType = activeOrLast?.type || 'RACE';

    isFetchingRef.current = true;
    try {
      if (sessionType === 'QUALIFYING') {
        const qualyData = await getQualifyingResults(season, round);
        if (qualyData) {
          queryClient.setQueryData(['qualifyingResults', season, round], qualyData);
        }
      } else if (sessionType === 'SPRINT') {
        const sprintData = await getSprintResults(season, round);
        if (sprintData) {
          queryClient.setQueryData(['sprintResults', season, round], sprintData);
        }
      } else {
        // Race session
        const [raceData, pitData] = await Promise.all([
          getRaceResults(season, round),
          getPitStops(season, round).catch(() => [])
        ]);

        if (raceData && raceData.Results && raceData.Results.length > 0) {
          queryClient.setQueryData(['raceResults', season, round], raceData);
          if (pitData && pitData.length > 0) {
            queryClient.setQueryData(['pitStops', season, round], pitData);
          }
          liveRaceTracker.processRaceResults(raceData, pitData);
        }
      }
    } catch (err) {
      console.warn('[GlobalLiveTracker] Live telemetry poll failed safely:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [raceState, queryClient]);

  // Global Polling Loop (Single authoritative timer across all routes)
  useEffect(() => {
    const isLiveActive = raceState?.status === 'ACTIVE_SESSION';
    if (!isLiveActive || !pollingInterval) {
      return;
    }

    // Trigger immediate poll on active session entry
    fetchAndProcessLiveTelemetry();

    const interval = setInterval(() => {
      fetchAndProcessLiveTelemetry();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [raceState?.status, pollingInterval, fetchAndProcessLiveTelemetry]);

  // Tab foreground / visibility change reconciliation
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && raceState?.status === 'ACTIVE_SESSION') {
        fetchAndProcessLiveTelemetry();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [raceState?.status, fetchAndProcessLiveTelemetry]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const openNotificationCenter = () => setIsOpen(true);
  const closeNotificationCenter = () => setIsOpen(false);
  const toggleNotificationCenter = () => setIsOpen(prev => !prev);

  const markAsRead = (id: string) => liveNotificationStore.markAsRead(id);
  const markAllAsRead = () => liveNotificationStore.markAllAsRead();
  const clearAll = () => liveNotificationStore.clearAll();

  const requestBrowserPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      return permission === 'granted';
    } catch {
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        openNotificationCenter,
        closeNotificationCenter,
        toggleNotificationCenter,
        markAsRead,
        markAllAsRead,
        clearAll,
        requestBrowserPermission,
        browserPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
