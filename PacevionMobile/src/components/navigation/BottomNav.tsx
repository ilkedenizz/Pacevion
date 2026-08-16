import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, Trophy, Users, Menu } from 'lucide-react';
import './BottomNav.css';

export function BottomNav() {
  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/standings', label: 'Standings', icon: Trophy },
    { to: '/drivers', label: 'Drivers', icon: Users },
    { to: '/more', label: 'More', icon: Menu },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <tab.icon className="bottom-nav-icon" size={22} />
          <span className="bottom-nav-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
