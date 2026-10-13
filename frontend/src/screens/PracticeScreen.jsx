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
    const { quiz, roleplay } = getScenarioProgress
      ? getScenarioProgress(selectedScenario.slug)
      : { quiz: null, roleplay: null };

    return (
      <div>
        <button
          type="button"
          className="back-btn"
          onClick={() => setSelectedScenario(null)}
        >
          <ArrowLeftIcon size={18} />
          <span>All Practice Scenarios</span>
        </button>

        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-red)' }}>
            {selectedScenario.title} Practice
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Choose an interactive activity for {selectedScenario.title.toLowerCase()} situations.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            className="card scenario-card"
            data-testid="choose-roleplay-btn"
            onClick={() => setActiveMode('roleplay')}
            style={{ padding: '18px', margin: 0 }}
          >
            <div className="scenario-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="scenario-title">Interactive Role-play</span>
                {roleplay && roleplay.count > 0 && (
                  <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
                    Completed {roleplay.count}x
                  </span>
                )}
              </div>
              <p className="scenario-count" style={{ fontSize: '0.85rem' }}>
                Step into a branching conversation with real-time feedback on your Kannada replies.
              </p>
            </div>
            <ChevronRightIcon size={20} />
          </button>

          <button
            type="button"
            className="card scenario-card"
            data-testid="choose-quiz-btn"
            onClick={() => setActiveMode('quiz')}
            style={{ padding: '18px', margin: 0 }}
          >
            <div className="scenario-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="scenario-title">5-Question Scenario Quiz</span>
                {quiz && (
                  <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                    Best: {quiz.bestScore}/{quiz.total}
                  </span>
                )}
              </div>
              <p className="scenario-count" style={{ fontSize: '0.85rem' }}>
                Test your recall of practical {selectedScenario.title.toLowerCase()} phrases with instant explanations.
              </p>
            </div>
            <ChevronRightIcon size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Pick a scenario
  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          Practice & Role-play
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Pick a scenario to practice branching role-play dialogues or take a 5-question quiz.
        </p>
      </div>

      {error && <ErrorState message={error} onRetry={loadScenarios} />}

      {loading && (
        <LoadingState
          label="Loading practice scenarios..."
          onRetry={loadScenarios}
        />
      )}

      {!loading && !error && (
        <div>
          {scenarios.map((sc) => {
            const IconComponent = ICON_MAP[sc.icon] || BusIcon;
            const { quiz, roleplay } = getScenarioProgress
              ? getScenarioProgress(sc.slug)
              : { quiz: null, roleplay: null };

            return (
              <button
                key={sc.id}
                type="button"
                className="card scenario-card"
                data-testid={`practice-scenario-${sc.slug}`}
                onClick={() => {
                  setSelectedScenario(sc);
                  setActiveMode(null);
                }}
              >
                <div className="scenario-icon-box" aria-hidden="true">
                  <IconComponent size={24} />
                </div>

                <div className="scenario-info">
                  <div className="scenario-title">{sc.title}</div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginTop: '6px',
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        backgroundColor: roleplay?.count > 0 ? '#ecfdf5' : '#f5f5f4',
                        color: roleplay?.count > 0 ? '#047857' : '#57534e',
                      }}
                    >
                      {roleplay?.count > 0
                        ? `Role-play: ${roleplay.count}x`
                        : 'Role-play: not started'}
                    </span>

                    <span
                      className="badge"
                      style={{
                        backgroundColor: quiz ? '#fef3c7' : '#f5f5f4',
                        color: quiz ? '#92400e' : '#57534e',
                      }}
                    >
                      {quiz
                        ? `Best Quiz: ${quiz.bestScore}/${quiz.total}`
                        : 'Quiz: —/5'}
                    </span>
                  </div>
                </div>

                <ChevronRightIcon size={20} className="scenario-chevron" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
