import { NavLink, useLocation } from 'react-router-dom';
import { Home, CalendarDays, Trophy, Users, Menu } from 'lucide-react';
import './BottomNav.css';

export function BottomNav() {
  const { pathname } = useLocation();

  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/standings', label: 'Standings', icon: Trophy },
    { to: '/drivers', label: 'Drivers', icon: Users },
    { to: '/more', label: 'More', icon: Menu },
  ];

  const isTabActive = (tabPath: string) => {
    if (tabPath === '/') return pathname === '/';
    if (tabPath === '/more') return pathname.startsWith('/more');
    return pathname.startsWith(tabPath);
  };

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const active = isTabActive(tab.to);

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
          >
            <tab.icon className="bottom-nav-icon" size={22} />
            <span className="bottom-nav-label">{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default BottomNav;
