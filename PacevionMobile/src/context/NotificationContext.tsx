// PacevionMobile/src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { liveNotificationStore } from '../services/liveNotificationStore';
import type { LiveNotification } from '../services/liveNotificationStore';

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
