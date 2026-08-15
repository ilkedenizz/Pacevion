import React, { useMemo } from 'react';
import NextRaceHero from './components/NextRaceHero';
import DriverStandingsPreview from './components/DriverStandingsPreview';
import LastRaceCard from './components/LastRaceCard';
import UpcomingRaces from './components/UpcomingRaces';
import ChampionshipAnalytics from './components/ChampionshipAnalytics';
import AboutSection from './components/AboutSection';
import RevealSection from '../../components/ui/RevealSection';
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

    // Next Race computation for data strip
    const nextRace = races ? races.find(race => {
      const raceTimeStr = race.time ? (race.time.endsWith('Z') ? race.time : `${race.time}Z`) : '00:00:00Z';
      const raceDate = new Date(`${race.date}T${raceTimeStr}`);
      return raceDate > now;
    }) : null;
    
    const nextEventName = nextRace ? nextRace.Circuit.Location.country : '—';

    return { total, completed, drivers, constructors, remaining, nextEventName };
  }, [races, standings]);

  return (
    <div className="dashboard-wrapper">
      {/* 1. Full Width Broadcast Hero */}
      <RevealSection className="hero-broadcast-wrapper">
        <NextRaceHero />
      </RevealSection>

      {/* 2. Horizontal Data Strip */}
      <RevealSection className="data-strip-wrapper">
        <div className="data-strip">
          <div className="strip-item">
            <span className="strip-label">ROUND</span>
            <span className="strip-value">{stats.completed + 1 || '—'}</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">RACES</span>
            <span className="strip-value">{stats.total || '—'}</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">DRIVERS</span>
            <span className="strip-value">{stats.drivers || '—'}</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">TEAMS</span>
            <span className="strip-value">{stats.constructors || '—'}</span>
          </div>
          <div className="strip-item strip-item-accent">
            <span className="strip-label">NEXT EVENT</span>
            <span className="strip-value">{stats.nextEventName}</span>
          </div>
        </div>
      </RevealSection>

      {/* 3. Editorial Dashboard Grid */}
      <div className="editorial-container">
        <div className="editorial-grid">
          
          <RevealSection className="editorial-panel">
            <div className="editorial-header">
              <span className="ed-num">01</span>
              <span className="ed-title">DRIVER STANDINGS</span>
            </div>
            <DriverStandingsPreview />
          </RevealSection>

          <RevealSection className="editorial-panel">
            <div className="editorial-header">
              <span className="ed-num">02</span>
              <span className="ed-title">CHAMPIONSHIP BATTLE</span>
            </div>
            <ChampionshipAnalytics />
          </RevealSection>

          <RevealSection className="editorial-panel">
            <div className="editorial-header">
              <span className="ed-num">03</span>
              <span className="ed-title">LATEST RACE</span>
            </div>
            <LastRaceCard />
          </RevealSection>

          <RevealSection className="editorial-panel">
            <div className="editorial-header">
              <span className="ed-num">04</span>
              <span className="ed-title">UPCOMING SCHEDULE</span>
            </div>
            <UpcomingRaces />
          </RevealSection>

        </div>
      </div>

      {/* 4. Editorial About Section */}
      <div className="editorial-container">
        <RevealSection className="editorial-about-wrapper">
          <AboutSection />
        </RevealSection>
      </div>

    </div>
  );
};

export default Dashboard;


