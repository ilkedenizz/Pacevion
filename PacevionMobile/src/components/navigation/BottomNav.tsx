import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flag, Trophy, Activity, Calendar, Menu } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import './BottomNav.css';

const navItems = [
  { path: '/', icon: <Flag size={20} strokeWidth={2.2} />, label: 'HOME' },
  { path: '/calendar', icon: <Calendar size={20} strokeWidth={2.2} />, label: 'CALENDAR' },
  { path: '/live', icon: <Activity size={20} strokeWidth={2.2} />, label: 'LIVE' },
  { path: '/standings', icon: <Trophy size={20} strokeWidth={2.2} />, label: 'STANDINGS' },
  { path: '/more', icon: <Menu size={20} strokeWidth={2.2} />, label: 'MORE' },
];

export const BottomNav: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isLive = item.path === '/live';
        return (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="bn-icon">
              {item.icon}
              {isLive && unreadCount > 0 && (
                <span className="bn-unread-dot" aria-label={`${unreadCount} unread live notifications`} />
              )}
            </span>
            <span className="bn-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;

