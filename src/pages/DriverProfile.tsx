import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const DriverProfile: React.FC = () => {
  const { driverId = '' } = useParams<{ driverId: string }>();

  // Format ID for cleaner look (e.g. max_verstappen -> Max Verstappen)
  const formattedDriverName = useMemo(() => {
    return driverId
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [driverId]);

  useSEO({
    title: `${formattedDriverName} — F1 Driver Profile | Pacevion`,
    description: `Formula 1 pilotu ${formattedDriverName} hakkında detaylar, kariyer istatistikleri ve güncel sezon puan durumları.`,
    canonicalPath: `/drivers/${driverId}`
  });

  return (
    <div className="page-container bg-surface" style={{ padding: 'var(--space-5)' }}>
      <h1 className="text-primary" style={{ fontSize: 'var(--font-size-xl)' }}>
        Driver Profile: {formattedDriverName} (Coming Soon)
      </h1>
    </div>
  );
};

export default DriverProfile;
