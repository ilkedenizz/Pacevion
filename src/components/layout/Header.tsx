import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import './Header.css';

import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { language: lang, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLangChange = (selectedLang: Language) => {
    setLanguage(selectedLang);
    setIsDropdownOpen(false);
  };

  return (
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
        <div className="header-logo-section">
          <span className="title">Pacevion</span>
        </div>
      </div>

      <div className="header-center desktop-nav">
        <nav className="desktop-nav-links">
          <NavLink to="/" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`} end>{t('overview')}</NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('calendar')}</NavLink>
          <NavLink to="/standings" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('standings')}</NavLink>
          <NavLink to="/drivers" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('drivers')}</NavLink>

          <NavLink to="/cars" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('cars')}</NavLink>
          <NavLink to="/learn" className={({ isActive }) => `desktop-nav-link ${isActive ? 'active' : ''}`}>{t('learn')}</NavLink>
        </nav>
      </div>

      <div className="header-right">
        <div className="header-status-section">
          <div className="status-item">
            <span className="status-indicator live" />
            <span className="status-value font-mono">{t('liveFeed')}</span>
          </div>
        </div>

        <div className="status-divider" />

        {/* Compact Language Selector */}
        <div className="lang-selector-container" ref={dropdownRef}>
          <button
            className="lang-selector-btn"
            onClick={() => setIsDropdownOpen(prev => !prev)}
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
  );
};

export default Header;
