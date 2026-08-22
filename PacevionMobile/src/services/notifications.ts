import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import type { Race } from '../api/types';

const PREFS_KEY = 'pacevion_notification_prefs';

export interface NotificationPreferences {
  raceReminderEnabled: boolean;
  qualifyingReminderEnabled: boolean;
  sprintReminderEnabled: boolean;
  raceResultsEnabled: boolean;
  qualifyingResultsEnabled: boolean;
  reminderMinutes: number;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  raceReminderEnabled: true,
  qualifyingReminderEnabled: true,
  sprintReminderEnabled: true,
  raceResultsEnabled: false,
  qualifyingResultsEnabled: false,
  reminderMinutes: 30,
};

export class NotificationService {
  // Load Preferences
  static async getPreferences(): Promise<NotificationPreferences> {
    try {
      const { value } = await Preferences.get({ key: PREFS_KEY });
      if (value) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(value) };
      }
    } catch (error) {
      console.warn('Failed to get notification preferences', error);
    }
    return DEFAULT_PREFERENCES;
  }

  // Save Preferences
  static async savePreferences(prefs: Partial<NotificationPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...prefs };
      await Preferences.set({ key: PREFS_KEY, value: JSON.stringify(updated) });
    } catch (error) {
      console.warn('Failed to save notification preferences', error);
    }
  }

  // Check and Request Permission
  static async requestPermission(): Promise<boolean> {
    try {
      let permStatus = await LocalNotifications.checkPermissions();
      
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }
      
      return permStatus.display === 'granted';
    } catch (error) {
      console.warn('Failed to request notification permission', error);
      return false;
    }
  }

  // Parse Date string
  private static parseDateString(dateStr?: string, timeStr?: string): Date | null {
    if (!dateStr) return null;
    const time = timeStr ? timeStr.replace('Z', '') : '00:00:00';
    return new Date(`${dateStr}T${time}Z`);
  }

  // Sync scheduled notifications
  static async syncScheduledNotifications(calendar: Race[]): Promise<void> {
    try {
      const prefs = await this.getPreferences();
      
      await this.cancelAllPacevionNotifications();

      const permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display !== 'granted') {
        return;
      }

      const notificationsToSchedule: import('@capacitor/local-notifications').LocalNotificationSchema[] = [];
      const now = Date.now();

      calendar.forEach((race, index) => {
        const round = parseInt(race.round) || (index + 1);

        // RACE
        if (prefs.raceReminderEnabled && race.date) {
          const raceDate = this.parseDateString(race.date, race.time);
          if (raceDate) {
            const triggerTime = raceDate.getTime() - prefs.reminderMinutes * 60 * 1000;
            if (triggerTime > now) {
              notificationsToSchedule.push({
                id: parseInt(`10${round}`), // 10 prefix for race
                title: "🏁 RACE STARTING SOON",
                body: `${race.raceName} starts in ${prefs.reminderMinutes} minutes.`,
                schedule: { at: new Date(triggerTime) },
                extra: { route: `/races/${race.season}/${race.round}` }
              });
            }
          }
        }

        const isSprint = !!race.Sprint;

        // QUALIFYING
        if (prefs.qualifyingReminderEnabled && race.Qualifying?.date) {
          const qualyDate = this.parseDateString(race.Qualifying.date, race.Qualifying.time);
          if (qualyDate) {
            const triggerTime = qualyDate.getTime() - prefs.reminderMinutes * 60 * 1000;
            if (triggerTime > now) {
              notificationsToSchedule.push({
                id: parseInt(`20${round}`), // 20 prefix for qualifying
                title: "⏱ QUALIFYING STARTING SOON",
                body: `Qualifying for ${race.raceName} starts in ${prefs.reminderMinutes} minutes.`,
                schedule: { at: new Date(triggerTime) },
                extra: { route: `/races/${race.season}/${race.round}` }
              });
            }
          }
        }

        // SPRINT
        if (isSprint && prefs.sprintReminderEnabled && race.Sprint?.date) {
          const sprintDate = this.parseDateString(race.Sprint.date, race.Sprint.time);
          if (sprintDate) {
            const triggerTime = sprintDate.getTime() - prefs.reminderMinutes * 60 * 1000;
            if (triggerTime > now) {
              const shortName = race.raceName.replace(' Grand Prix', '');
              notificationsToSchedule.push({
                id: parseInt(`30${round}`), // 30 prefix for sprint
                title: "⚡ SPRINT STARTING SOON",
                body: `${shortName} Sprint starts in ${prefs.reminderMinutes} minutes.`,
                schedule: { at: new Date(triggerTime) },
                extra: { route: `/races/${race.season}/${race.round}` }
              });
            }
          }
        }
      });

      if (notificationsToSchedule.length > 0) {
        // limit to first 100 or 500 to not exceed android limits if needed, but 24 races * 3 = 72, which is fine
        await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      }

    } catch (error) {
      console.warn('Failed to sync scheduled notifications', error);
    }
  }

  // Cancel all pacevion notifications
  static async cancelAllPacevionNotifications(): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch (error) {
      console.warn('Failed to cancel notifications', error);
    }
  }
}
