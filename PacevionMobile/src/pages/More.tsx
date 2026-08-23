import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Car, 
  Trophy, 
  Calendar, 
  Radio, 
  BookOpen, 
  Info, 
  Database, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  Bell
} from 'lucide-react';
import { useDriverStandings, useConstructorStandings, useCalendar } from '../hooks/useF1Data';
import './More.css';

export const More: React.FC = () => {
  const navigate = useNavigate();
  const { data: drivers } = useDriverStandings('2026');
  const { data: constructors } = useConstructorStandings('2026');
  const { data: calendar } = useCalendar('2026');

  return (
    <div className="page more-page fade-in">
      {/* 1. Header */}
      <header className="more-header">
        <div className="mh-left">
          <h1 className="mh-title font-heading editorial-headline">MORE / HUB</h1>
          <span className="mh-subtitle font-mono">PACEVION • 2026 FIA FORMULA 1 COMPANION</span>
        </div>
        <div className="mh-badge font-mono">
          <Zap size={10} color="var(--color-primary)" />
          <span>V2.0.0</span>
        </div>
      </header>

      {/* 2. Group: Championship */}
      <section className="more-section">
        <h2 className="ms-title font-mono">CHAMPIONSHIP & GRID</h2>
        <div className="more-card-group">
          <div 
            className="more-item" 
            onClick={() => navigate('/drivers')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Users size={16} color="var(--color-primary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">2026 DRIVERS LINEUP</span>
              <span className="mi-desc font-mono">{drivers?.length || 20} Drivers • Stats & H2H Battles</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>

          <div 
            className="more-item" 
            onClick={() => navigate('/cars')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Car size={16} color="var(--color-primary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">CONSTRUCTORS & CARS</span>
              <span className="mi-desc font-mono">{constructors?.length || 10} Teams • Chassis & Power Units</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>

          <div 
            className="more-item" 
            onClick={() => navigate('/standings')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Trophy size={16} color="var(--color-warning)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">WORLD STANDINGS</span>
              <span className="mi-desc font-mono">Driver & Constructor Points</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>

          <div 
            className="more-item" 
            onClick={() => navigate('/calendar')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Calendar size={16} color="var(--color-text-secondary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">RACE CALENDAR</span>
              <span className="mi-desc font-mono">{calendar?.length || 24} Grand Prix Timetable</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>
        </div>
      </section>

      {/* 3. Group: Race & Knowledge */}
      <section className="more-section">
        <h2 className="ms-title font-mono">RACE & TELEMETRY</h2>
        <div className="more-card-group">
          <div 
            className="more-item" 
            onClick={() => navigate('/live')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Radio size={16} color="var(--color-primary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">LIVE TIMING FEED</span>
              <span className="mi-desc font-mono">Race Control & Timing Screen</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>

          <div 
            className="more-item" 
            onClick={() => navigate('/more/learn')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><BookOpen size={16} color="var(--color-text-secondary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">LEARN F1</span>
              <span className="mi-desc font-mono">Aerodynamics, Tyres & Rules</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>
        </div>
      </section>

      {/* 4. Group: Settings */}
      <section className="more-section">
        <h2 className="ms-title font-mono">SETTINGS</h2>
        <div className="more-card-group">
          <div 
            className="more-item" 
            onClick={() => navigate('/more/notifications')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Bell size={16} color="var(--color-primary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">NOTIFICATIONS</span>
              <span className="mi-desc font-mono">Race & Session Reminders</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>
        </div>
      </section>

      {/* 5. Group: Application & System */}
      <section className="more-section">
        <h2 className="ms-title font-mono">SYSTEM & ABOUT</h2>
        <div className="more-card-group">
          <div 
            className="more-item" 
            onClick={() => navigate('/more/about')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Info size={16} color="var(--color-text-secondary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">ABOUT PACEVION</span>
              <span className="mi-desc font-mono">Architecture & Specs</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>

          <div 
            className="more-item" 
            onClick={() => navigate('/more/data-sources')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><Database size={16} color="var(--color-text-secondary)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">DATA SOURCES</span>
              <span className="mi-desc font-mono">Jolpica Ergast REST API</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>

          <div 
            className="more-item" 
            onClick={() => navigate('/more/privacy')}
            role="button"
            tabIndex={0}
          >
            <div className="mi-icon"><ShieldCheck size={16} color="var(--color-success)" /></div>
            <div className="mi-content">
              <span className="mi-title font-heading">PRIVACY POLICY</span>
              <span className="mi-desc font-mono">Zero Personal Data Collection</span>
            </div>
            <ChevronRight size={14} className="mi-arrow" />
          </div>
        </div>
      </section>

      {/* 5. Footer Branding */}
      <footer className="more-footer font-mono">
        <span className="mf-text">PACEVION MOBILE COMPANION</span>
        <span className="mf-sub">DESIGNED FOR MOTORSPORT FANS</span>
      </footer>
    </div>
  );
};

export default More;

