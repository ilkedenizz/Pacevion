import React from 'react';
import { useParams } from 'react-router-dom';

const RaceDetails: React.FC = () => {
  const { season, round } = useParams<{ season: string; round: string }>();

  return (
    <div className="page-container bg-surface" style={{ padding: 'var(--space-5)' }}>
      <h1 className="text-primary" style={{ fontSize: 'var(--font-size-xl)' }}>
        Race Details: Season {season}, Round {round} (Coming Soon)
      </h1>
    </div>
  );
};

export default RaceDetails;
