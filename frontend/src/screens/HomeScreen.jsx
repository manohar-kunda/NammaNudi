import React, { useState, useEffect } from 'react';
import { fetchScenarios } from '../api';
import { ScenarioCard } from '../components/ScenarioCard';
import { ErrorState } from '../components/ErrorState';

export function HomeScreen({
  onSelectScenario,
  onNavigateSearch,
  onNavigatePractice,
  onNavigateAbout,
  progress,
  totalRoleplayCompletions,
  scenariosWithQuizDone,
  totalBestQuizPoints,
}) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchScenarios();
      setScenarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const quizBestScores = progress?.quizBestScores || {};
  const roleplayCompletions = progress?.roleplayCompletions || {};
  const hasAnyProgress = totalRoleplayCompletions > 0 || scenariosWithQuizDone > 0;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          Everyday Situations
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Essential spoken Kannada phrases for real-life Karnataka interactions.
        </p>
      </div>

      {/* Small Progress Summary on Home Screen */}
      <div
        className="card"
        data-testid="home-progress-summary"
        style={{
          marginBottom: '16px',
          backgroundColor: '#ffffff',
          borderColor: '#fde68a',
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: hasAnyProgress ? '10px' : '4px',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-red)' }}>
            Your Practice Progress
          </span>
          <button
            type="button"
            onClick={onNavigatePractice}
            style={{
              background: 'none',
              border: 'none',
              color: '#b45309',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to Practice &rarr;
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            Role-plays completed: <strong style={{ color: 'var(--text-main)' }}>{totalRoleplayCompletions}</strong>
          </span>
          <span>&bull;</span>
          <span>
            Quizzes taken: <strong style={{ color: 'var(--text-main)' }}>{scenariosWithQuizDone}/5</strong>
            {scenariosWithQuizDone > 0 && ` (${totalBestQuizPoints} pts)`}
          </span>
        </div>

        {hasAnyProgress && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px dashed var(--border-warm)',
            }}
          >
            {scenarios.map((sc) => {
              const q = quizBestScores[sc.slug];
              const rp = roleplayCompletions[sc.slug];
              if (!q && (!rp || rp.count === 0)) return null;
              return (
                <span
                  key={sc.slug}
                  className="badge"
                  style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.72rem' }}
                >
                  {sc.title}: {rp?.count ? `RP ${rp.count}x` : ''}
                  {rp?.count && q ? ' · ' : ''}
                  {q ? `Quiz ${q.bestScore}/${q.total}` : ''}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={loadData} />}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner-circle" />
          <span>Loading everyday scenarios...</span>
        </div>
      )}

      {!loading && !error && (
        <div>
          {scenarios.map((sc) => (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              onSelect={() => onSelectScenario(sc)}
            />
          ))}
        </div>
      )}

      <div
        className="card"
        style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          borderColor: '#fde68a',
        }}
      >
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
          Looking for a specific phrase?
        </h3>
        <p style={{ fontSize: '0.825rem', color: '#78350f', marginBottom: '10px' }}>
          Search across Kannada script, English, or Roman transliteration.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onNavigateSearch}
            className="retry-btn"
            style={{ backgroundColor: '#b45309', padding: '8px 16px' }}
          >
            Open Search
          </button>
          {onNavigateAbout && (
            <button
              type="button"
              onClick={onNavigateAbout}
              className="retry-btn"
              style={{
                backgroundColor: '#ffffff',
                color: '#78350f',
                border: '1px solid #f59e0b',
                padding: '8px 14px',
              }}
            >
              About & Content Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
