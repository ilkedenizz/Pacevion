import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Radio } from 'lucide-react';
import './LiveFeed.css';

export interface LiveFeedData {
  // Empty for now, to be extended later
}

interface LiveFeedProps {
  data?: LiveFeedData[] | null;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ data = null }) => {
  const navigate = useNavigate();
  const hasData = data && data.length > 0;

  return (
    <div className="livefeed-page">
      <header className="livefeed-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={24} />
          </button>
          <h1>LIVE FEED</h1>
        </div>
        <div className="status-indicator">
          NO ACTIVE SESSION
        </div>
      </header>

      {!hasData && (
        <div className="empty-state">
          <div className="empty-icon-container">
            <Radio size={48} className="empty-icon" />
            <div className="pulsing-dot" />
          </div>
          <h2>No Live Session</h2>
          <p>Live timing data will appear here during active F1 sessions</p>
        </div>
      )}

      <div className="skeleton-container">
        <span className="skeleton-label">TIMING FEED</span>
        <div className="skeleton-card skeleton" />
        <div className="skeleton-card skeleton" />
        <div className="skeleton-card skeleton" />
      </div>
    </div>
  );
};

export default LiveFeed;
