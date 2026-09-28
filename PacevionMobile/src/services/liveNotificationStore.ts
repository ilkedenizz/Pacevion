// PacevionMobile/src/services/liveNotificationStore.ts

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

class LiveNotificationStore {
  private notifications: LiveNotification[] = [];
  private seenEventIds: Set<string> = new Set();
  private listeners: Set<(notifications: LiveNotification[]) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (storedNotifs) {
        this.notifications = JSON.parse(storedNotifs);
      }

      const storedIds = localStorage.getItem(STORAGE_KEY_SEEN_IDS);
      if (storedIds) {
        const parsed = JSON.parse(storedIds);
        if (Array.isArray(parsed)) {
          this.seenEventIds = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('[LiveNotificationStore] Error loading from storage', e);
      this.notifications = [];
      this.seenEventIds = new Set();
    }
  }

  private saveToStorage(): void {
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
      console.warn('[LiveNotificationStore] Error saving to storage', e);
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
    if (this.seenEventIds.has(notification.id)) {
      return false; // Already recorded
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
    this.saveToStorage();
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
    this.listeners.forEach(fn => fn(list));
  }
}

export const liveNotificationStore = new LiveNotificationStore();
