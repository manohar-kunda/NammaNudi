import React, { useState, useEffect } from 'react';
import { AlertCircleIcon } from './Icons';
import { subscribeColdStart, triggerManualColdStartRetry } from '../api';

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

export function LoadingState({ label = 'Loading...', onRetry }) {
  const [coldStart, setColdStart] = useState({
    isWakingUp: false,
    retryAttempt: 0,
    maxRetries: 3,
  });

  useEffect(() => {
    return subscribeColdStart(setColdStart);
  }, []);

  if (coldStart.isWakingUp) {
    return (
      <div
        className="card"
        role="status"
        aria-live="polite"
        data-testid="cold-start-banner"
        style={{
          padding: '24px 18px',
          textAlign: 'center',
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          marginBottom: '16px',
        }}
      >
        <div className="spinner-circle" style={{ margin: '0 auto 14px auto' }} />
        <p
          style={{
            fontSize: '0.975rem',
            fontWeight: 700,
            color: 'var(--primary-red)',
            marginBottom: '6px',
          }}
        >
          Waking up the server, this can take up to a minute
        </p>
        <p style={{ fontSize: '0.825rem', color: '#78350f', marginBottom: '14px' }}>
          {coldStart.retryAttempt > 0
            ? `Automatic retry ${coldStart.retryAttempt} of ${coldStart.maxRetries}...`
            : 'Please wait while the service starts up...'}
        </p>
        <button
          type="button"
          className="retry-btn"
          data-testid="cold-start-retry-btn"
          style={{ margin: '0 auto', backgroundColor: 'var(--primary-red)', padding: '8px 18px' }}
          onClick={() => {
            triggerManualColdStartRetry();
            if (onRetry) onRetry();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="loading-spinner" role="status">
      <div className="spinner-circle" />
      <span>{label}</span>
    </div>
  );
}
