import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flag, Trophy, Activity, Users, Car, Menu } from 'lucide-react';
import './BottomNav.css';

const navItems = [
  { path: '/home', icon: <Flag size={20} strokeWidth={2.5} />, label: 'HOME' },
  { path: '/standings', icon: <Trophy size={20} strokeWidth={2.5} />, label: 'STANDINGS' },
  { path: '/live', icon: <Activity size={20} strokeWidth={2.5} />, label: 'LIVE' },
  { path: '/drivers', icon: <Users size={20} strokeWidth={2.5} />, label: 'DRIVERS' },
  { path: '/cars', icon: <Car size={20} strokeWidth={2.5} />, label: 'CARS' },
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
