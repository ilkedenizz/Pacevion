// src/services/liveNotificationStore.ts

export type LiveNotificationType = 
  | 'START'
  | 'FIRST_LAPS'
  | 'LEADER'
  | 'OVERTAKE'
  | 'FASTEST_LAP'
  | 'PIT'
  | 'DNF'
  | 'FLAG'
  | 'FINISH'
  | 'REMINDER'
  | 'INFO';

export interface LiveNotification {
  id: string;
  season: string;
  round: string;
  raceName?: string;
  timestamp: number;
  lap?: number;
  type: LiveNotificationType;
  title: string;
  message: string;
  read: boolean;
  driverId?: string;
  driverCode?: string;
  teamColor?: string;
}

const STORAGE_KEY_NOTIFICATIONS = 'pacevion_live_notifications_feed_v2';
const STORAGE_KEY_SEEN_IDS = 'pacevion_seen_live_event_ids_v2';
const MAX_NOTIFICATIONS = 150;
const MAX_SEEN_IDS = 1000;

export class LiveNotificationStore {
  private notifications: LiveNotification[] = [];
  private seenEventIds: Set<string> = new Set();
  private listeners: Set<(notifications: LiveNotification[]) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      this.notifications = [];
      this.seenEventIds = new Set();
      return;
    }

    try {
      const storedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (storedNotifs) {
        const parsed = JSON.parse(storedNotifs);
        if (Array.isArray(parsed)) {
          this.notifications = parsed.filter(item => item && typeof item.id === 'string');
        } else {
          this.notifications = [];
        }
      }

      const storedIds = localStorage.getItem(STORAGE_KEY_SEEN_IDS);
      if (storedIds) {
        const parsed = JSON.parse(storedIds);
        if (Array.isArray(parsed)) {
          this.seenEventIds = new Set(parsed.filter(id => typeof id === 'string'));
        } else {
          this.seenEventIds = new Set();
        }
      }
    } catch (e) {
      console.warn('[LiveNotificationStore] Error loading from storage, resetting:', e);
      this.notifications = [];
      this.seenEventIds = new Set();
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.setItem(
        STORAGE_KEY_NOTIFICATIONS,
        JSON.stringify(this.notifications.slice(0, MAX_NOTIFICATIONS))
      );
      localStorage.setItem(
        STORAGE_KEY_SEEN_IDS,
        JSON.stringify(Array.from(this.seenEventIds).slice(-MAX_SEEN_IDS))
      );
    } catch (e) {
      console.warn('[LiveNotificationStore] Error saving to storage, attempting prune:', e);
      try {
        this.notifications = this.notifications.slice(0, 50);
        localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(this.notifications));
      } catch {
        // Storage genuinely unavailable, continue in memory
      }
    }
  }

  public isEventSeen(eventId: string): boolean {
    return this.seenEventIds.has(eventId);
  }

  public markEventSeen(eventId: string): void {
    this.seenEventIds.add(eventId);
    this.saveToStorage();
  }

  public addNotification(notification: Omit<LiveNotification, 'read'>): boolean {
    if (!notification || !notification.id || this.seenEventIds.has(notification.id)) {
      return false; // Already recorded or invalid
    }

    this.seenEventIds.add(notification.id);

    const newNotif: LiveNotification = {
      ...notification,
      read: false,
    };

    this.notifications = [newNotif, ...this.notifications].slice(0, MAX_NOTIFICATIONS);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  public getNotifications(): LiveNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.saveToStorage();
    this.notifyListeners();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.saveToStorage();
    this.notifyListeners();
  }

  public clearAll(): void {
    this.notifications = [];
    this.seenEventIds.clear();
    this.saveToStorage();
    this.notifyListeners();
  }

  public reset(): void {
    this.notifications = [];
    this.seenEventIds.clear();
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
        localStorage.removeItem(STORAGE_KEY_SEEN_IDS);
      } catch {
        // Ignore removal error
      }
    }
    this.notifyListeners();
  }

  public subscribe(listener: (notifications: LiveNotification[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const list = [...this.notifications];
    this.listeners.forEach(fn => {
      try {
        fn(list);
      } catch (err) {
        console.error('[LiveNotificationStore] Listener error:', err);
      }
    });
  }
}

export const liveNotificationStore = new LiveNotificationStore();

