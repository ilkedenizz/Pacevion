import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Activity, Trophy, Menu } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { path: '/', icon: <Home size={22} strokeWidth={2} />, label: 'HOME' },
  { path: '/calendar', icon: <Calendar size={22} strokeWidth={2} />, label: 'CALENDAR' },
  { path: '/live', icon: <Activity size={22} strokeWidth={2} />, label: 'LIVE' },
  { path: '/standings', icon: <Trophy size={22} strokeWidth={2} />, label: 'STANDINGS' },
  { path: '/more', icon: <Menu size={22} strokeWidth={2} />, label: 'MORE' },
];

const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `bn-item ${isActive ? 'active' : ''}`}
          end={item.path === '/'}
        >
          <span className="bn-icon">{item.icon}</span>
          <span className="bn-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
