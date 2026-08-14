import React from 'react';
import NextRaceHero from './components/NextRaceHero';
import DriverStandingsPreview from './components/DriverStandingsPreview';
import LastRaceCard from './components/LastRaceCard';
import UpcomingRaces from './components/UpcomingRaces';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">F1 Season Dashboard</h2>
        <p className="dashboard-subtitle">Real-time statistics, calendars, and championship standings.</p>
      </div>

      <div className="dashboard-grid">
        <div className="grid-hero-row">
          <NextRaceHero />
        </div>
        
        <div className="grid-content-row">
          <div className="content-column-main">
            <DriverStandingsPreview />
          </div>
          
          <div className="content-column-side">
            <LastRaceCard />
            <UpcomingRaces />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
