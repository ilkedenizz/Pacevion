import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Bell,
  Moon,
  Globe,
  Sliders,
  Calendar,
  Users,
  Trophy,
  Car,
  BookOpen,
  Radio,
  Info,
  Database,
  Shield,
  Smartphone,
} from 'lucide-react';
import './More.css';

export const More: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="more-dashboard font-mono">
      {/* Header */}
      <header className="more-header">
        <div className="more-header-titles">
          <h1 className="brand-badge font-mono">MORE</h1>
          <p className="championship-sub font-mono">PACEVION · 2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
        </div>
      </header>

      {/* Main Sections */}
      <main className="more-sections-container">
        {/* APP SECTION */}
        <section className="menu-group">
          <h2 className="group-title">APP CONFIGURATION</h2>
          <div className="menu-items-card">
            {/* Notifications (Coming Soon) */}
            <div className="menu-row disabled-row">
              <div className="row-left">
                <Bell size={18} className="row-icon text-muted" />
                <div className="row-text">
                  <span className="row-title">NOTIFICATIONS</span>
                  <span className="row-sub">Race reminders & session alerts</span>
                </div>
              </div>
              <span className="status-pill coming-soon">COMING SOON</span>
            </div>

            {/* Appearance (Dark Theme) */}
            <div className="menu-row">
              <div className="row-left">
                <Moon size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">APPEARANCE</span>
                  <span className="row-sub">System default Pacevion dark theme</span>
                </div>
              </div>
              <span className="status-pill active-pill">DARK</span>
            </div>

            {/* Language (English) */}
            <div className="menu-row disabled-row">
              <div className="row-left">
                <Globe size={18} className="row-icon text-muted" />
                <div className="row-text">
                  <span className="row-title">LANGUAGE</span>
                  <span className="row-sub">English (US)</span>
                </div>
              </div>
              <span className="status-pill coming-soon">COMING SOON</span>
            </div>

            {/* App Settings */}
            <div className="menu-row disabled-row">
              <div className="row-left">
                <Sliders size={18} className="row-icon text-muted" />
                <div className="row-text">
                  <span className="row-title">APP SETTINGS</span>
                  <span className="row-sub">Cache & refresh preferences</span>
                </div>
              </div>
              <span className="status-pill coming-soon">COMING SOON</span>
            </div>
          </div>
        </section>

        {/* F1 SECTION */}
        <section className="menu-group">
          <h2 className="group-title">FORMULA 1 HUB</h2>
          <div className="menu-items-card">
            {/* Calendar */}
            <div className="menu-row clickable-row" onClick={() => navigate('/calendar')}>
              <div className="row-left">
                <Calendar size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">2026 CALENDAR</span>
                  <span className="row-sub">Race schedule & circuit maps</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Drivers */}
            <div className="menu-row clickable-row" onClick={() => navigate('/drivers')}>
              <div className="row-left">
                <Users size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">DRIVERS</span>
                  <span className="row-sub">2026 driver lineup & standings</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Standings */}
            <div className="menu-row clickable-row" onClick={() => navigate('/standings')}>
              <div className="row-left">
                <Trophy size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">STANDINGS</span>
                  <span className="row-sub">Drivers & Constructors championship</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Cars */}
            <div className="menu-row clickable-row" onClick={() => navigate('/more/cars')}>
              <div className="row-left">
                <Car size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">2026 CARS</span>
                  <span className="row-sub">Official car gallery & specs</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Learn F1 */}
            <div className="menu-row clickable-row" onClick={() => navigate('/more/learn')}>
              <div className="row-left">
                <BookOpen size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">LEARN F1</span>
                  <span className="row-sub">Technical overview & basics</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Live Race Center */}
            <div className="menu-row clickable-row" onClick={() => navigate('/more/live-feed')}>
              <div className="row-left">
                <Radio size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">LIVE RACE CENTER</span>
                  <span className="row-sub">Session status & classification</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="menu-group">
          <h2 className="group-title">ABOUT & LEGAL</h2>
          <div className="menu-items-card">
            {/* About Pacevion */}
            <div className="menu-row clickable-row" onClick={() => navigate('/more/about')}>
              <div className="row-left">
                <Info size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">ABOUT PACEVION</span>
                  <span className="row-sub">Overview & championship specs</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Data Sources */}
            <div className="menu-row clickable-row" onClick={() => navigate('/more/data-sources')}>
              <div className="row-left">
                <Database size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">DATA SOURCES</span>
                  <span className="row-sub">Ergast & Jolpica API providers</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* Privacy */}
            <div className="menu-row clickable-row" onClick={() => navigate('/more/privacy')}>
              <div className="row-left">
                <Shield size={18} className="row-icon icon-accent" />
                <div className="row-text">
                  <span className="row-title">PRIVACY & DATA</span>
                  <span className="row-sub">No personal tracking guarantee</span>
                </div>
              </div>
              <ChevronRight size={18} className="row-chevron" />
            </div>

            {/* App Version */}
            <div className="menu-row">
              <div className="row-left">
                <Smartphone size={18} className="row-icon text-muted" />
                <div className="row-text">
                  <span className="row-title">APP VERSION</span>
                  <span className="row-sub">Pacevion Mobile Build</span>
                </div>
              </div>
              <span className="version-tag">v1.0.0</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default More;
