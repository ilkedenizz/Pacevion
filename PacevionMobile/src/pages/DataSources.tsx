import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Globe, RefreshCw } from 'lucide-react';
import './DataSources.css';

export const DataSources: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page datasources-page fade-in">
      <header className="datasources-header font-mono">
        <button 
          className="lh-back-btn" 
          onClick={() => navigate('/more')} 
          aria-label="Back to Hub"
        >
          <ArrowLeft size={13} />
          <span>MORE / HUB</span>
        </button>
        <div className="datasources-header-titles">
          <h1 className="brand-badge font-heading">DATA SOURCES</h1>
          <p className="championship-sub font-mono">2026 FIA FORMULA 1 COMPANION</p>
        </div>
      </header>

      <main className="datasources-content">
        <section className="datasource-card">
          <div className="card-title-row">
            <Database size={16} className="card-icon" />
            <h2 className="font-heading">JOLPICA / ERGAST F1 API</h2>
          </div>
          <p className="card-quote font-mono">
            "Race schedules, results and championship data are provided through the application's F1 data provider."
          </p>
          <p className="card-desc font-mono">
            Pacevion connects directly to the Jolpica Ergast REST endpoints for Formula 1 calendar rounds, circuit locations, driver standings, constructor points, and official race results.
          </p>
        </section>

        <section className="datasource-card">
          <div className="card-title-row">
            <Globe size={16} className="card-icon" />
            <h2 className="font-heading">REAL-TIME DISCOVERY & CACHE</h2>
          </div>
          <p className="card-desc font-mono">
            All data queries are cached in client memory to optimize performance and prevent rate-limiting while providing high-frequency updates during race weekends.
          </p>
        </section>

        <section className="datasource-card">
          <div className="card-title-row">
            <RefreshCw size={16} className="card-icon" />
            <h2 className="font-heading">TRANSPARENCY & DATA INTEGRITY</h2>
          </div>
          <p className="card-desc font-mono">
            No unauthorized external data feeds or synthetic driver points are injected into the standings or race classification screens.
          </p>
        </section>
      </main>
    </div>
  );
};

export default DataSources;

