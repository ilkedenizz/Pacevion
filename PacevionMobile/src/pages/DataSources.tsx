import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Database, Globe, RefreshCw } from 'lucide-react';
import './DataSources.css';

export const DataSources: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="datasources-page font-mono">
      <header className="datasources-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={22} />
        </button>
        <div className="datasources-header-titles">
          <h1 className="brand-badge font-mono">DATA SOURCES</h1>
          <p className="championship-sub">2026 FIA FORMULA 1 WORLD CHAMPIONSHIP</p>
        </div>
      </header>

      <main className="datasources-content">
        <section className="datasource-card">
          <div className="card-title-row">
            <Database size={16} className="card-icon" />
            <h2>JOLPICA / ERGAST F1 API</h2>
          </div>
          <p className="card-quote">
            "Race schedules, results and championship data are provided through the application's F1 data provider."
          </p>
          <p className="card-desc">
            Pacevion connects directly to the Jolpica Ergast REST endpoints for Formula 1 calendar rounds, circuit locations, driver standings, constructor points, and official race results.
          </p>
        </section>

        <section className="datasource-card">
          <div className="card-title-row">
            <Globe size={16} className="card-icon" />
            <h2>REAL-TIME DISCOVERY</h2>
          </div>
          <p className="card-desc">
            All data queries are cached in client memory to optimize performance and prevent rate-limiting while providing high-frequency updates during race weekends.
          </p>
        </section>

        <section className="datasource-card">
          <div className="card-title-row">
            <RefreshCw size={16} className="card-icon" />
            <h2>TRANSPARENCY STATEMENT</h2>
          </div>
          <p className="card-desc">
            No unauthorized external data feeds or synthetic driver points are injected into the standings or race classification screens.
          </p>
        </section>
      </main>
    </div>
  );
};

export default DataSources;
