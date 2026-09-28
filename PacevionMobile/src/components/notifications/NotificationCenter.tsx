// PacevionMobile/src/components/notifications/NotificationCenter.tsx
import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Trophy, 
  Zap, 
  Flag, 
  AlertTriangle, 
  Radio, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import type { LiveNotification, LiveNotificationType } from '../../services/liveNotificationStore';
import './NotificationCenter.css';

interface NotificationCenterProps {
  onClose?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAll, 
    closeNotificationCenter,
    requestBrowserPermission,
    browserPermission
  } = useNotifications();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'RACE' | 'DNF'>('ALL');

  const handleClose = () => {
    if (onClose) onClose();
    else closeNotificationCenter();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'RACE') return n.type === 'START' || n.type === 'LEADER' || n.type === 'OVERTAKE' || n.type === 'FASTEST_LAP' || n.type === 'FINISH';
    if (filter === 'DNF') return n.type === 'DNF' || n.type === 'FLAG';
    return true;
  });

  const getEventIcon = (type: LiveNotificationType, teamColor?: string) => {
    switch (type) {
      case 'START':
      case 'FINISH':
        return <Flag size={16} color="var(--color-success)" />;
      case 'LEADER':
        return <Trophy size={16} color="var(--color-warning)" />;
      case 'FASTEST_LAP':
        return <Zap size={16} color="#C98EE8" />;
      case 'OVERTAKE':
      case 'FIRST_LAPS':
        return <ArrowUpRight size={16} color={teamColor || 'var(--color-primary)'} />;
      case 'DNF':
        return <AlertTriangle size={16} color="var(--color-primary)" />;
      case 'FLAG':
        return <ShieldAlert size={16} color="var(--color-warning)" />;
      case 'REMINDER':
      default:
        return <Radio size={16} color="var(--color-text-secondary)" />;
    }
  };

  const formatTimestamp = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="nc-overlay" onClick={handleClose}>
      <div className="nc-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="nc-header">
          <div className="nc-title-row">
            <div className="nc-title-left">
              <Bell size={18} color="var(--color-primary)" />
              <h2 className="nc-title font-heading">{t('notifications').toUpperCase()}</h2>
              {unreadCount > 0 && (
                <span className="nc-unread-badge font-mono">{unreadCount}</span>
              )}
            </div>
            <button className="nc-close-btn" onClick={handleClose} aria-label="Close notification center">
              <X size={18} />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="nc-actions-bar font-mono">
            {unreadCount > 0 && (
              <button className="nc-action-link" onClick={markAllAsRead}>
                <CheckCheck size={14} />
                <span>Mark all as read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button className="nc-action-link text-muted" onClick={clearAll}>
                <Trash2 size={14} />
                <span>Clear history</span>
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="nc-filter-chips font-mono">
            <button 
              className={`nc-chip ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              ALL ({notifications.length})
            </button>
            <button 
              className={`nc-chip ${filter === 'UNREAD' ? 'active' : ''}`}
              onClick={() => setFilter('UNREAD')}
            >
              UNREAD ({unreadCount})
            </button>
            <button 
              className={`nc-chip ${filter === 'RACE' ? 'active' : ''}`}
              onClick={() => setFilter('RACE')}
            >
              RACE EVENTS
            </button>
            <button 
              className={`nc-chip ${filter === 'DNF' ? 'active' : ''}`}
              onClick={() => setFilter('DNF')}
            >
              INCIDENTS / DNF
            </button>
          </div>
        </div>

        {/* Permission Banner if not enabled */}
        {browserPermission === 'default' && (
          <div className="nc-perm-banner">
            <div className="nc-perm-text font-mono">
              <span>Enable alerts for live race events</span>
            </div>
            <button className="nc-perm-btn font-mono" onClick={() => requestBrowserPermission()}>
              ENABLE
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="nc-body">
          {filteredNotifications.length === 0 ? (
            <div className="nc-empty font-mono">
              <Bell size={28} className="nc-empty-icon" />
              <span className="nc-empty-text">No notifications found</span>
              <span className="nc-empty-sub">Live race events, overtakes, and session reminders will appear here.</span>
            </div>
          ) : (
            <div className="nc-list">
              {filteredNotifications.map((item: LiveNotification) => (
                <div 
                  key={item.id} 
                  className={`nc-item ${item.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className="nc-item-icon">
                    {getEventIcon(item.type, item.teamColor)}
                  </div>
                  <div className="nc-item-content">
                    <div className="nc-item-top">
                      <span className="nc-item-title font-heading">{item.title}</span>
                      <span className="nc-item-time font-mono">{formatTimestamp(item.timestamp)}</span>
                    </div>
                    <p className="nc-item-msg font-mono">{item.message}</p>
                    <div className="nc-item-meta font-mono">
                      {item.raceName && <span className="nc-meta-tag">{item.raceName}</span>}
                      {item.lap !== undefined && item.lap > 0 && (
                        <span className="nc-meta-tag accent">LAP {item.lap}</span>
                      )}
                      {item.driverCode && (
                        <span className="nc-meta-tag driver" style={{ borderColor: item.teamColor || 'var(--color-border)' }}>
                          {item.driverCode}
                        </span>
                      )}
                    </div>
                  </div>
                  {!item.read && <span className="nc-unread-dot" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
