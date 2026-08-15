import React, { useMemo } from 'react';
import NextRaceHero from './components/NextRaceHero';
import DriverStandingsPreview from './components/DriverStandingsPreview';
import LastRaceCard from './components/LastRaceCard';
import UpcomingRaces from './components/UpcomingRaces';
import ChampionshipAnalytics from './components/ChampionshipAnalytics';
import AboutSection from './components/AboutSection';
import { useCalendar, useDriverStandings } from '../../hooks/useF1Data';
import { useSEO } from '../../hooks/useSEO';
import { useLanguage } from '../../context/LanguageContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { data: races } = useCalendar();
  const { data: standings } = useDriverStandings();
  const { t } = useLanguage();

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

    const points = standings && standings.length > 0 ? standings[0].points : '0';
    const constructors = standings
      ? new Set(standings.map((s) => s.Constructors[0]?.constructorId).filter(Boolean)).size
      : 0;

    return { total, completed, points, constructors };
  }, [races, standings]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-accent"></div>
        <div className="dashboard-header-content">
          <span className="dashboard-category">F1 2026</span>
          <h1 className="dashboard-title">{t('seasonOverview')}</h1>
          <p className="dashboard-subtitle">{t('realTimeStats')}</p>
        </div>
        <div className="dashboard-header-divider"></div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-hero-row">
          <NextRaceHero />
        </div>

        <div className="season-stats-row">
          <div className="stat-card">
            <span className="stat-label">{t('totalRounds')}</span>
            <span className="stat-value">{stats.total || '—'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('completedGps')}</span>
            <span className="stat-value">{stats.completed || '—'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('leaderPoints')}</span>
            <span className="stat-value">{stats.points || '—'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('teamsEntered')}</span>
            <span className="stat-value">{stats.constructors || '—'}</span>
          </div>
        </div>
        
        <div className="grid-content-row">
          <div className="content-column-main">
            <DriverStandingsPreview />
          </div>
          
          <div className="content-column-side">
            <ChampionshipAnalytics />
            <LastRaceCard />
            <UpcomingRaces />
          </div>
        </div>

        <AboutSection />
      </div>
    </div>
  );
};

export default Dashboard;
