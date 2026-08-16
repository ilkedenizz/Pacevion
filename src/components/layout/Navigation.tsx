import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Shield, Trophy } from 'lucide-react';
import './Navigation.css';

import { useLanguage } from '../../context/LanguageContext';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="navigation-backdrop" 
          onClick={onClose} 
          role="presentation"
        />
      )}

      <nav className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="nav-group">
          <span className="nav-group-title">{t('overview')}</span>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
                end
              >
                <LayoutDashboard className="nav-icon" size={16} />
                <span className="nav-text">{t('dashboard')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/calendar"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Calendar className="nav-icon" size={16} />
                <span className="nav-text">{t('calendar')}</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="nav-group">
          <span className="nav-group-title">{t('championship')}</span>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/drivers"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Users className="nav-icon" size={16} />
                <span className="nav-text">{t('drivers')}</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/cars"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Shield className="nav-icon" size={16} />
                <span className="nav-text">{t('cars')}</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/standings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Trophy className="nav-icon" size={16} />
                <span className="nav-text">{t('standings')}</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
