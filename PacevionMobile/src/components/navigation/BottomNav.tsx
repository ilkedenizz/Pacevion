import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flag, Trophy, Activity, Calendar, Menu } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { path: '/', icon: <Flag size={20} strokeWidth={2.5} />, label: 'HOME' },
  { path: '/calendar', icon: <Calendar size={20} strokeWidth={2.5} />, label: 'CALENDAR' },
  { path: '/live', icon: <Activity size={20} strokeWidth={2.5} />, label: 'LIVE' },
  { path: '/standings', icon: <Trophy size={20} strokeWidth={2.5} />, label: 'STANDINGS' },
  { path: '/more', icon: <Menu size={20} strokeWidth={2.5} />, label: 'MORE' },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'} // Important for root path to not match everything
          >
            <div className="nav-icon-wrap">
              {item.icon}
            </div>
            <span className="nav-label font-mono">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
