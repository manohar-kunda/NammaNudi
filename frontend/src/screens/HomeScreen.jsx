import React, { useState, useEffect } from 'react';
import { fetchScenarios } from '../api';
import { ScenarioCard } from '../components/ScenarioCard';
import { ErrorState, LoadingState } from '../components/ErrorState';

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
        className="card home-progress-card"
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
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            Practice Hub &rarr;
          </button>
        </div>

        {hasAnyProgress ? (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            >
              <div style={{ background: '#fef3c7', padding: '6px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#92400e' }}>
                  {totalRoleplayCompletions}
                </div>
                <div style={{ fontSize: '0.675rem', fontWeight: 600, color: '#78350f' }}>
                  Role-plays Done
                </div>
              </div>
              <div style={{ background: '#ecfdf5', padding: '6px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46' }}>
                  {scenariosWithQuizDone} / 5
                </div>
                <div style={{ fontSize: '0.675rem', fontWeight: 600, color: '#047857' }}>
                  Quizzes Solved
                </div>
              </div>
              <div style={{ background: '#fdf2f8', padding: '6px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#881337' }}>
                  {totalBestQuizPoints}
                </div>
                <div style={{ fontSize: '0.675rem', fontWeight: 600, color: '#70102d' }}>
                  Total Points
                </div>
              </div>
            </div>

            {/* Per-scenario mini indicators */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                paddingTop: '6px',
                borderTop: '1px dashed #fde68a',
              }}
            >
              {['transport', 'shopping', 'healthcare', 'workplace', 'restaurant'].map((slug) => {
                const qScore = quizBestScores[slug]?.bestScore;
                const rpCount = roleplayCompletions[slug]?.count || 0;
                const isTouched = qScore !== undefined || rpCount > 0;
                return (
                  <span
                    key={slug}
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: isTouched ? '#ecfdf5' : '#f5f5f4',
                      color: isTouched ? '#065f46' : '#78716c',
                      border: isTouched ? '1px solid #a7f3d0' : '1px solid #e7e5e4',
                      textTransform: 'capitalize',
                    }}
                  >
                    {slug} {qScore !== undefined ? `(${qScore}/5)` : ''} {rpCount > 0 ? '✓' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
            Start practicing scenarios with interactive role-plays and 5-question quizzes to track your score!
          </p>
        )}
      </div>

      {error && <ErrorState message={error} onRetry={loadData} />}

      {loading && (
        <LoadingState label="Loading Karnataka scenarios..." onRetry={loadData} />
      )}

      {!loading && !error && (
        <div className="scenarios-grid">
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
        className="card home-cta-card"
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
