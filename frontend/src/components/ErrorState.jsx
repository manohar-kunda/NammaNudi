import React from 'react';
import { AlertCircleIcon } from './Icons';

export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <div className="error-title">
        <AlertCircleIcon size={20} />
        <span>Connection Issue</span>
      </div>
      <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{message}</p>
      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
