import React from 'react';
import { useParams } from 'react-router-dom';

const DriverProfile: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();

  return (
    <div className="page-container bg-surface" style={{ padding: 'var(--space-5)' }}>
      <h1 className="text-primary" style={{ fontSize: 'var(--font-size-xl)' }}>
        Driver Profile: {driverId} (Coming Soon)
      </h1>
    </div>
  );
};

export default DriverProfile;
