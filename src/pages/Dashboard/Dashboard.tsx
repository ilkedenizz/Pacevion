import React, { useMemo } from 'react';
import { Flag, Users, Award, CheckCircle, CalendarDays } from 'lucide-react';
import NextRaceHero from './components/NextRaceHero';
import DriverStandingsPreview from './components/DriverStandingsPreview';
import LastRaceCard from './components/LastRaceCard';
import UpcomingRaces from './components/UpcomingRaces';
import ChampionshipAnalytics from './components/ChampionshipAnalytics';
import AboutSection from './components/AboutSection';
import { useCalendar, useDriverStandings } from '../../hooks/useF1Data';
import { useSEO } from '../../hooks/useSEO';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { data: races } = useCalendar();
  const { data: standings } = useDriverStandings();

  useSEO({
    title: 'Pacevion — Formula 1 Results, Standings & Race Data',
    description: 'Pacevion ile Formula 1 yarış sonuçlarını, pilotlar ve takımlar şampiyonası puan durumlarını, yarış takvimini ve detaylı F1 verilerini takip edin.',
    canonicalPath: '/'
  });

  const stats = useMemo(() => {
    const total = races ? races.length : 0;
    const now = new Date();
    const completed = races
      ? races.filter((race) => {
          const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
          const raceDate = new Date(`${race.date}T${raceTimeStr}`);
          return raceDate <= now;
        }).length
      : 0;

    const drivers = standings ? standings.length : 0;
    const constructors = standings
      ? new Set(standings.map((s) => s.Constructors[0]?.constructorId).filter(Boolean)).size
      : 0;
    const remaining = total - completed;

    return { total, completed, drivers, constructors, remaining };
  }, [races, standings]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {/* HERO */}
        <div className="grid-hero-row">
          <NextRaceHero />
        </div>

        {/* SEASON OVERVIEW STATS BAR */}
        <div className="season-stats-bar">
          <div className="season-stats-label">2026 SEASON OVERVIEW</div>
          <div className="season-stats-items">
            <div className="season-stat">
              <Flag size={20} className="season-stat-icon" />
              <div className="season-stat-body">
                <span className="season-stat-value">{stats.total || '—'}</span>
                <span className="season-stat-title">GRAND PRIX</span>
                <span className="season-stat-sub">SEASON RACES</span>
              </div>
            </div>
            <div className="season-stat-divider" />
            <div className="season-stat">
              <Users size={20} className="season-stat-icon" />
              <div className="season-stat-body">
                <span className="season-stat-value">{stats.drivers || '—'}</span>
                <span className="season-stat-title">DRIVERS</span>
                <span className="season-stat-sub">ON THE GRID</span>
              </div>
            </div>
            <div className="season-stat-divider" />
            <div className="season-stat">
              <Award size={20} className="season-stat-icon" />
              <div className="season-stat-body">
                <span className="season-stat-value">{stats.constructors || '—'}</span>
                <span className="season-stat-title">TEAMS</span>
                <span className="season-stat-sub">COMPETING</span>
              </div>
            </div>
            <div className="season-stat-divider" />
            <div className="season-stat">
              <CheckCircle size={20} className="season-stat-icon" />
              <div className="season-stat-body">
                <span className="season-stat-value">{stats.completed || '—'}</span>
                <span className="season-stat-title">ROUNDS COMPLETED</span>
                <span className="season-stat-sub">{stats.remaining || '—'} TO GO</span>
              </div>
            </div>
            <div className="season-stat-divider" />
            <div className="season-stat">
              <CalendarDays size={20} className="season-stat-icon" />
              <div className="season-stat-body">
                <span className="season-stat-value">{stats.remaining || '—'}</span>
                <span className="season-stat-title">REMAINING</span>
                <span className="season-stat-sub">RACES LEFT</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-COLUMN DATA GRID */}
        <div className="grid-content-row">
          <DriverStandingsPreview />
          <ChampionshipAnalytics />
          <LastRaceCard />
          <UpcomingRaces />
        </div>

        {/* ABOUT */}
        <AboutSection />
      </div>
    </div>
  );
};

export default Dashboard;


