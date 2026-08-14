import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorState.css';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'An error occurred while loading F1 data.',
  onRetry,
}) => {
  return (
    <div className="error-state-container" role="alert">
      <AlertCircle className="error-icon" size={48} />
      <h3 className="error-title">Data Load Error</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry} type="button">
          <RefreshCw size={16} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
