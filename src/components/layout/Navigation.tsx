import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Shield, Trophy } from 'lucide-react';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            <LayoutDashboard className="nav-icon" size={18} />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/calendar"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Calendar className="nav-icon" size={18} />
            <span className="nav-text">Calendar</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/drivers"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Users className="nav-icon" size={18} />
            <span className="nav-text">Drivers</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/constructors"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Shield className="nav-icon" size={18} />
            <span className="nav-text">Constructors</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/standings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Trophy className="nav-icon" size={18} />
            <span className="nav-text">Standings</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
