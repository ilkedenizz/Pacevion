import React from 'react';
import { useSEO } from '../hooks/useSEO';

const Constructors: React.FC = () => {
  useSEO({
    title: 'F1 Constructors & Teams Directory | Pacevion',
    description: 'Formula 1 2026 sezonu aktif yarışan markalar, takım merkezleri ve detaylı bilgiler.',
    canonicalPath: '/constructors'
  });

  return (
    <div className="page-container bg-surface" style={{ padding: 'var(--space-5)' }}>
      <h1 className="text-primary" style={{ fontSize: 'var(--font-size-xl)' }}>Constructors (Coming Soon)</h1>
    </div>
  );
};

export default Constructors;
