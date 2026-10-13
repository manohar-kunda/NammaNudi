import React, { useState, useEffect } from 'react';
import { fetchScenarios, fetchScenarioPhrases } from '../api';
import { ErrorState } from '../components/ErrorState';
import { ArrowLeftIcon } from '../components/Icons';

export function AboutScreen({ onBack }) {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPhrases = async () => {
    setLoading(true);
    setError(null);
    try {
      const scenarios = await fetchScenarios();
      const lists = await Promise.all(
        (scenarios || []).map((sc) => fetchScenarioPhrases(sc.slug))
      );
      const combined = lists.flat();
      setPhrases(combined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhrases();
  }, []);

  const totalCount = phrases.length;
  const reviewedCount = phrases.filter((p) => p.reviewed === true).length;
  const awaitingReviewCount = phrases.filter((p) => !p.reviewed).length;

  return (
    <div>
      {onBack && (
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to Home</span>
        </button>
      )}

      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          About & Content Status
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Transparency on phrase verification, audio synthesis, and offline capabilities.
        </p>
      </div>

      {/* Live Content Verification Status */}
      <div className="card" style={{ padding: '18px', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
          Native-Speaker Review Status
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Computed from the phrase catalog across all five scenarios. Every phrase stays marked as{' '}
          <code style={{ fontSize: '0.8rem' }}>reviewed: false</code> until verified by a native Kannada speaker.
        </p>

        {loading && (
          <div className="loading-spinner" style={{ padding: '20px 0' }}>
            <div className="spinner-circle" />
            <span>Computing review status...</span>
          </div>
        )}

        {error && <ErrorState message={error} onRetry={loadPhrases} />}

        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '12px',
              }}
              data-testid="reviewed-true-box"
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>
                {reviewedCount} / {totalCount}
              </div>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#065f46' }}>
                Phrases verified by native speaker (reviewed=true)
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '12px',
              }}
              data-testid="awaiting-review-box"
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                {awaitingReviewCount} / {totalCount}
              </div>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#92400e' }}>
                Phrases awaiting native-speaker review
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio & Healthcare Disclaimers */}
      <div className="card" style={{ padding: '18px', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Audio & Healthcare Notes
        </h3>
        <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>
            <strong>Browser Speech Synthesis:</strong> Pronunciation audio uses your browser&apos;s built-in{' '}
            <code>speechSynthesis</code> API (<code>kn-IN</code>) when a Kannada voice is installed on your device. It is not a native studio recording.
          </li>
          <li>
            <strong>Healthcare Disclaimer:</strong> Phrases in the Healthcare scenario are practical communication aids for clinic and pharmacy interactions, not medical advice.
          </li>
          <li>
            <strong>Offline Support:</strong> A Service Worker caches the app shell along with all 5 scenarios&apos; phrases, role-play dialogues, and quizzes for offline use. Live keyword search remains online-only.
          </li>
        </ul>
      </div>
    </div>
  );
}
