import React from 'react';
import { useSEO } from '../hooks/useSEO';

const Drivers: React.FC = () => {
  useSEO({
    title: 'F1 Drivers Directory | Pacevion',
    description: 'Formula 1 2026 sezonu resmi sürücü kadrosu, pilot numaraları ve pilot bilgileri.',
    canonicalPath: '/drivers'
  });

  return (
    <div className="page-container bg-surface" style={{ padding: 'var(--space-5)' }}>
      <h1 className="text-primary" style={{ fontSize: 'var(--font-size-xl)' }}>Drivers (Coming Soon)</h1>
    </div>
  );
};

export default Drivers;
