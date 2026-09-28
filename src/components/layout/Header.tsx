import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, CalendarDays, Bell } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';
import { useSeason } from '../../context/SeasonContext';
import type { SeasonYear } from '../../context/SeasonContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import './Header.css';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { language: lang, setLanguage, t } = useLanguage();
  const { season, setSeason } = useSeason();
  const { unreadCount, isOpen, toggleNotificationCenter, closeNotificationCenter } = useNotifications();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const seasonDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (seasonDropdownRef.current && !seasonDropdownRef.current.contains(event.target as Node)) {
        setIsSeasonDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangChange = (selectedLang: Language) => {
    setLanguage(selectedLang);
    setIsDropdownOpen(false);
  };

  const handleSeasonChange = (selectedSeason: SeasonYear) => {
    setSeason(selectedSeason);
    setIsSeasonDropdownOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={isSidebarOpen}
            type="button"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="header-logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="title">Pacevion</span>
          </div>
        </div>

        <div className="header-center desktop-nav">
          <nav className="desktop-nav-links">
            <NavLink to="/" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`} end>{t('overview')}</NavLink>
            <NavLink to="/calendar" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('calendar')}</NavLink>
            <NavLink to="/live" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('live')}</NavLink>
            <NavLink to="/standings" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('standings')}</NavLink>
            <NavLink to="/drivers" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('drivers')}</NavLink>
            <NavLink to="/cars" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('cars')}</NavLink>
            <NavLink to="/learn" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('learn')}</NavLink>
          </nav>
        </div>

        <div className="header-right">
          <div 
            className="header-status-section"
            onClick={() => navigate('/live')}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
            title="Go to Live Feed"
          >
            <div className="status-item">
              <span className="status-indicator live" />
              <span className="status-value font-mono">{t('liveFeed')}</span>
            </div>
          </div>

          <div className="status-divider" />

          {/* Notification Bell */}
          <button 
            className="header-notif-btn"
            onClick={toggleNotificationCenter}
            aria-label="Toggle notifications"
            title="Notifications"
            type="button"
            style={{
              position: 'relative',
              background: 'transparent',
              border: '1px solid var(--color-border, #222)',
              color: unreadCount > 0 ? 'var(--color-primary, #e10600)' : 'var(--color-text-secondary, #aaa)',
              padding: '6px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span 
                className="font-mono" 
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--color-primary, #e10600)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 800,
                  borderRadius: '999px',
                  minWidth: '15px',
                  height: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  lineHeight: 1
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Season Selector */}
          <div className="lang-selector-container" ref={seasonDropdownRef}>
            <button
              className="lang-selector-btn"
              onClick={() => { setIsSeasonDropdownOpen(prev => !prev); setIsDropdownOpen(false); }}
              aria-haspopup="true"
              aria-expanded={isSeasonDropdownOpen}
              aria-label="Select season"
              type="button"
            >
              <CalendarDays size={14} className="lang-icon" />
              <span className="lang-text">{season}</span>
              <ChevronDown size={12} className={`chevron-icon ${isSeasonDropdownOpen ? 'rotated' : ''}`} />
            </button>
            
            {isSeasonDropdownOpen && (
              <ul className="lang-dropdown-menu" role="menu">
                <li role="none">
                  <button
                    role="menuitem"
                    className={`lang-option-btn ${season === '2026' ? 'active' : ''}`}
                    onClick={() => handleSeasonChange('2026')}
                    type="button"
                  >
                    2026 Season
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className={`lang-option-btn ${season === '2027' ? 'active' : ''}`}
                    onClick={() => handleSeasonChange('2027')}
                    type="button"
                  >
                    2027 <span style={{fontSize: '9px', opacity: 0.7}}>(Provisional)</span>
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Compact Language Selector */}
          <div className="lang-selector-container" ref={dropdownRef}>
            <button
              className="lang-selector-btn"
              onClick={() => { setIsDropdownOpen(prev => !prev); setIsSeasonDropdownOpen(false); }}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              aria-label="Select language"
              type="button"
            >
              <Globe size={14} className="lang-icon" />
              <span className="lang-text">{lang}</span>
              <ChevronDown size={12} className={`chevron-icon ${isDropdownOpen ? 'rotated' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <ul className="lang-dropdown-menu" role="menu">
                <li role="none">
                  <button
                    role="menuitem"
                    className={`lang-option-btn ${lang === 'EN' ? 'active' : ''}`}
                    onClick={() => handleLangChange('EN')}
                    type="button"
                  >
                    English (EN)
                  </button>
                </li>
                <li role="none">
                  <button
                    role="menuitem"
                    className={`lang-option-btn ${lang === 'TR' ? 'active' : ''}`}
                    onClick={() => handleLangChange('TR')}
                    type="button"
                  >
                    Türkçe (TR)
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Notification Center Modal */}
      {isOpen && <NotificationCenter onClose={closeNotificationCenter} />}
    </>
  );
};

export default Header;
