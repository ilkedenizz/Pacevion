import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { NotificationService, DEFAULT_PREFERENCES } from '../services/notifications';
import type { NotificationPreferences } from '../services/notifications';
import { useCalendar } from '../hooks/useF1Data';
import { LocalNotifications } from '@capacitor/local-notifications';
import './NotificationSettings.css';

export const NotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const { data: calendar } = useCalendar('current');
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [permStatus, setPermStatus] = useState<string>('checking...');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const permissionRequestedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const currentPrefs = await NotificationService.getPreferences();
        setPrefs(currentPrefs);
        
        let perm = await LocalNotifications.checkPermissions();
        
        if (perm.display === 'prompt' && !permissionRequestedRef.current) {
          permissionRequestedRef.current = true;
          perm = await LocalNotifications.requestPermissions();
          
          if (perm.display === 'granted' && calendar && calendar.length > 0) {
            await NotificationService.syncScheduledNotifications(calendar);
          }
        }
        
        setPermStatus(perm.display);
      } catch (e) {
        console.error(e);
        setPermStatus('unknown');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => {
      setFeedbackMsg(null);
    }, 3000);
  };

  const syncAndProvideFeedback = async (newPrefs: Partial<NotificationPreferences>, requestPerm: boolean = false) => {
    try {
      setIsSyncing(true);
      await NotificationService.savePreferences(newPrefs);
      
      if (requestPerm) {
        let perm = await LocalNotifications.checkPermissions();
        if (perm.display === 'prompt') {
          perm = await LocalNotifications.requestPermissions();
        }
        setPermStatus(perm.display);
        
        if (perm.display !== 'granted') {
          showFeedback('FAILED: NOTIFICATIONS BLOCKED');
          setIsSyncing(false);
          return;
        }
      }

      if (calendar && calendar.length > 0) {
        await NotificationService.syncScheduledNotifications(calendar);
        showFeedback('✓ SCHEDULE UPDATED');
      } else {
        showFeedback('✓ SETTINGS SAVED');
      }
    } catch (e) {
      console.error(e);
      showFeedback('FAILED TO UPDATE');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    const newValue = !prefs[key as keyof NotificationPreferences];
    const newPrefs = { ...prefs, [key]: newValue };
    setPrefs(newPrefs);
    
    // Request permission if turning any of these ON
    const needsPerm = newValue === true && (key === 'raceReminderEnabled' || key === 'qualifyingReminderEnabled' || key === 'sprintReminderEnabled');
    
    syncAndProvideFeedback(newPrefs, needsPerm);
  };

  const handleTimeChange = (minutes: number) => {
    if (prefs.reminderMinutes === minutes) return;
    const newPrefs = { ...prefs, reminderMinutes: minutes };
    setPrefs(newPrefs);
    syncAndProvideFeedback(newPrefs, false);
  };

  const getStatusDisplay = () => {
    if (permStatus === 'granted') {
      const anyOn = prefs.raceReminderEnabled || prefs.qualifyingReminderEnabled || prefs.sprintReminderEnabled;
      if (anyOn) {
        return {
          title: 'ENABLED',
          desc: '● LOCAL SCHEDULE ACTIVE',
          color: 'var(--color-success)'
        };
      }
      return {
        title: 'PAUSED',
        desc: '○ ALL REMINDERS ARE OFF',
        color: 'var(--color-warning)'
      };
    }
    if (permStatus === 'denied') {
      return {
        title: 'BLOCKED',
        desc: '○ ENABLE NOTIFICATIONS IN ANDROID SETTINGS',
        color: 'var(--color-error)'
      };
    }
    return {
      title: 'DISABLED',
      desc: '○ NOTIFICATION PERMISSION DENIED',
      color: 'var(--color-text-muted)'
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="page notif-settings-page fade-in">
      {/* Header */}
      <header className="page-header sticky-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} color="#fff" />
        </button>
        <div className="header-titles">
          <h1 className="font-heading">NOTIFICATIONS</h1>
        </div>
        <div style={{ width: 24 }} /> {/* Spacer */}
      </header>

      <div className="ns-content">
        {/* Status Card */}
        <div className="ns-status-card">
          <div className="ns-status-icon">
            <Bell size={20} color={statusDisplay.color} />
          </div>
          <div className="ns-status-info">
            <span className="ns-status-title font-heading">
              {statusDisplay.title}
            </span>
            <span className="ns-status-desc font-mono">
              {statusDisplay.desc}
            </span>
          </div>
        </div>

        {/* Toggles Group */}
        <section className="ns-group">
          <h2 className="ns-group-title font-mono">REMINDERS</h2>
          
          <div className="ns-toggle-row">
            <div className="ns-toggle-info">
              <span className="ns-toggle-label font-heading">RACE</span>
              <span className="ns-toggle-desc font-mono">Get notified before every Grand Prix</span>
            </div>
            <button 
              className={`ns-toggle-btn ${prefs.raceReminderEnabled ? 'active' : ''}`}
              onClick={() => handleToggle('raceReminderEnabled')}
              aria-label="Enable race reminders"
              disabled={isSyncing}
            >
              {prefs.raceReminderEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="ns-toggle-row">
            <div className="ns-toggle-info">
              <span className="ns-toggle-label font-heading">QUALIFYING</span>
              <span className="ns-toggle-desc font-mono">Get notified before qualifying</span>
            </div>
            <button 
              className={`ns-toggle-btn ${prefs.qualifyingReminderEnabled ? 'active' : ''}`}
              onClick={() => handleToggle('qualifyingReminderEnabled')}
              aria-label="Enable qualifying reminders"
              disabled={isSyncing}
            >
              {prefs.qualifyingReminderEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="ns-toggle-row">
            <div className="ns-toggle-info">
              <span className="ns-toggle-label font-heading">SPRINT</span>
              <span className="ns-toggle-desc font-mono">Get notified before sprint sessions</span>
            </div>
            <button 
              className={`ns-toggle-btn ${prefs.sprintReminderEnabled ? 'active' : ''}`}
              onClick={() => handleToggle('sprintReminderEnabled')}
              aria-label="Enable sprint reminders"
              disabled={isSyncing}
            >
              {prefs.sprintReminderEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </section>

        {/* Reminder Time Group */}
        <section className="ns-group">
          <h2 className="ns-group-title font-mono">REMINDER TIME</h2>
          <div className="ns-time-options">
            <button 
              className={`ns-time-btn font-mono ${prefs.reminderMinutes === 5 ? 'active' : ''}`}
              onClick={() => handleTimeChange(5)}
              disabled={isSyncing}
            >
              {prefs.reminderMinutes === 5 && <span style={{ marginRight: '4px' }}>✓</span>}
              5 MIN
            </button>
            <button 
              className={`ns-time-btn font-mono ${prefs.reminderMinutes === 15 ? 'active' : ''}`}
              onClick={() => handleTimeChange(15)}
              disabled={isSyncing}
            >
              {prefs.reminderMinutes === 15 && <span style={{ marginRight: '4px' }}>✓</span>}
              15 MIN
            </button>
            <button 
              className={`ns-time-btn font-mono ${prefs.reminderMinutes === 30 ? 'active' : ''}`}
              onClick={() => handleTimeChange(30)}
              disabled={isSyncing}
            >
              {prefs.reminderMinutes === 30 && <span style={{ marginRight: '4px' }}>✓</span>}
              30 MIN
            </button>
            <button 
              className={`ns-time-btn font-mono ${prefs.reminderMinutes === 60 ? 'active' : ''}`}
              onClick={() => handleTimeChange(60)}
              disabled={isSyncing}
            >
              {prefs.reminderMinutes === 60 && <span style={{ marginRight: '4px' }}>✓</span>}
              1 HOUR
            </button>
          </div>
        </section>
      </div>

      {/* Feedback Toast */}
      {createPortal(
        <>
          {feedbackMsg && (
            <div className="ns-feedback-toast font-mono">
              {feedbackMsg}
            </div>
          )}
          {isSyncing && !feedbackMsg && (
            <div className="ns-feedback-toast font-mono">
              SYNCING...
            </div>
          )}
        </>,
        document.body
      )}
    </div>
  );
};

export default NotificationSettings;
