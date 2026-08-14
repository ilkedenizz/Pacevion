import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 32, className = '' }) => {
  return (
    <div
      className={`loader-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
      role="status"
      aria-label="Loading"
    >
      <Loader2 className="animate-spin text-primary" size={size} style={{ color: 'var(--color-accent)' }} />
    </div>
  );
};

export default Loader;
