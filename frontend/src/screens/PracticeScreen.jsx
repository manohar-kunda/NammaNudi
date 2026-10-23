import React, { useState, useEffect } from 'react';
import { fetchScenarios } from '../api';
import { ErrorState, LoadingState } from '../components/ErrorState';
import { RoleplayView } from '../components/RoleplayView';
import { QuizView } from '../components/QuizView';
import {
  BusIcon,
  ShoppingBagIcon,
  HeartPulseIcon,
  BriefcaseIcon,
  UtensilsIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from '../components/Icons';

const ICON_MAP = {
  bus: BusIcon,
  'shopping-bag': ShoppingBagIcon,
  'heart-pulse': HeartPulseIcon,
  briefcase: BriefcaseIcon,
  utensils: UtensilsIcon,
};

export function PracticeScreen({
  getScenarioProgress,
  onCompleteRoleplay,
  onCompleteQuiz,
  hasVoice,
  onSpeak,
  speakingId,
}) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedScenario, setSelectedScenario] = useState(null);
  const [activeMode, setActiveMode] = useState(null); // 'roleplay' | 'quiz' | null

  const loadScenarios = async () => {
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
    loadScenarios();
  }, []);

  if (selectedScenario && activeMode === 'roleplay') {
    return (
      <RoleplayView
        scenario={selectedScenario}
        onBack={() => setActiveMode(null)}
        onComplete={onCompleteRoleplay}
        hasVoice={hasVoice}
        onSpeak={onSpeak}
        speakingId={speakingId}
      />
    );
  }

  if (selectedScenario && activeMode === 'quiz') {
    return (
      <QuizView
        scenario={selectedScenario}
        onBack={() => setActiveMode(null)}
        onComplete={onCompleteQuiz}
      />
    );
  }

  // Step 2: Scenario selected -> Choose Role-play or Quiz
  if (selectedScenario) {
    const progress = getScenarioProgress ? getScenarioProgress(selectedScenario.slug) : null;
    const quizScore = progress?.quiz?.bestScore;
    const roleplayCount = progress?.roleplay?.count || 0;

    return (
      <div className="reading-column">
        <button
          type="button"
          className="back-btn"
          onClick={() => setSelectedScenario(null)}
        >
          <ArrowLeftIcon size={18} />
          <span>All Scenarios</span>
        </button>

        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
            Practice: {selectedScenario.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Choose an interactive practice activity below.
          </p>
        </div>

        {/* Practice Mode Choice Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Role-play Card */}
          <div
            className="card"
            style={{
              padding: '18px',
              borderLeft: '4px solid #881337',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Interactive Dialogue
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                  Branching Role-play
                </h3>
              </div>
              {roleplayCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  Completed {roleplayCount}×
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Practice realistic conversations (e.g. negotiating with an auto driver, asking prices, placing an order). Receive instant quality feedback on every response.
            </p>
            <button
              type="button"
              className="retry-btn"
              onClick={() => setActiveMode('roleplay')}
              style={{
                backgroundColor: 'var(--primary-red)',
                alignSelf: 'flex-start',
                marginTop: '4px',
              }}
            >
              Start Role-play &rarr;
            </button>
          </div>

          {/* Quiz Card */}
          <div
            className="card"
            style={{
              padding: '18px',
              borderLeft: '4px solid #b45309',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  5-Question Assessment
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                  Scenario Quiz
                </h3>
              </div>
              {quizScore !== undefined && (
                <span
                  style={{
                    backgroundColor: '#fffbeb',
                    color: '#92400e',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid #fde68a',
                  }}
                >
                  Best: {quizScore}/5
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Test your recall of key vocabulary and polite sentence constructions. Instant explanations show you why each answer is right or wrong.
            </p>
            <button
              type="button"
              className="retry-btn"
              onClick={() => setActiveMode('quiz')}
              style={{
                backgroundColor: '#b45309',
                alignSelf: 'flex-start',
                marginTop: '4px',
              }}
            >
              Start Quiz &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Scenario selection hub
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          Practice & Test Yourself
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Pick an everyday scenario to practice interactive role-plays or take a 5-question quiz.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={loadScenarios} />}

      {loading && (
        <LoadingState label="Loading practice scenarios..." onRetry={loadScenarios} />
      )}

      {!loading && !error && (
        <div className="scenarios-grid">
          {scenarios.map((sc) => {
            const Icon = ICON_MAP[sc.icon] || BusIcon;
            const progress = getScenarioProgress ? getScenarioProgress(sc.slug) : null;
            const quizScore = progress?.quiz?.bestScore;
            const roleplayCount = progress?.roleplay?.count || 0;

            return (
              <button
                key={sc.id}
                type="button"
                className="card scenario-card"
                onClick={() => setSelectedScenario(sc)}
              >
                <div className="scenario-icon-box">
                  <Icon size={24} />
                </div>
                <div className="scenario-info">
                  <div className="scenario-title">
                    <span>{sc.title}</span>
                  </div>
                  <div className="scenario-count">
                    {quizScore !== undefined ? (
                      <span style={{ color: '#047857', fontWeight: 600 }}>Quiz: {quizScore}/5</span>
                    ) : (
                      <span>Quiz pending</span>
                    )}
                    {' • '}
                    {roleplayCount > 0 ? (
                      <span style={{ color: '#047857', fontWeight: 600 }}>Role-play: {roleplayCount}×</span>
                    ) : (
                      <span>Role-play pending</span>
                    )}
                  </div>
                </div>
                <ChevronRightIcon size={20} className="empty-icon" style={{ width: 20, height: 20, color: '#a8a29e' }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
