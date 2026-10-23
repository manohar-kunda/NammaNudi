import React, { useState, useEffect } from 'react';
import { fetchScenarioRoleplay } from '../api';
import { ErrorState } from './ErrorState';
import { ArrowLeftIcon, SpeakerIcon } from './Icons';

const QUALITY_STYLES = {
  good: {
    label: 'Good reply',
    bg: '#ecfdf5',
    border: '#34d399',
    text: '#065f46',
    badgeBg: '#d1fae5',
    badgeText: '#047857',
  },
  ok: {
    label: 'Okay reply',
    bg: '#fffbeb',
    border: '#fbbf24',
    text: '#92400e',
    badgeBg: '#fef3c7',
    badgeText: '#b45309',
  },
  poor: {
    label: 'Needs work',
    bg: '#fef2f2',
    border: '#f87171',
    text: '#991b1b',
    badgeBg: '#fee2e2',
    badgeText: '#b91c1c',
  },
};

export function RoleplayView({
  scenario,
  onBack,
  onComplete,
  hasVoice,
  onSpeak,
  speakingId,
}) {
  const [roleplay, setRoleplay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const loadRoleplay = async () => {
    setLoading(true);
    setError(null);
    setIsFinished(false);
    setSelectedOptionIndex(null);
    setHistory([]);
    try {
      const data = await fetchScenarioRoleplay(scenario.slug);
      setRoleplay(data);
      setCurrentNodeId(data?.start || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoleplay();
  }, [scenario.slug]);

  const handleReset = () => {
    if (!roleplay) {
      loadRoleplay();
      return;
    }
    setCurrentNodeId(roleplay.start || null);
    setSelectedOptionIndex(null);
    setHistory([]);
    setIsFinished(false);
  };

  const handleSelectOption = (index) => {
    if (selectedOptionIndex !== null) return; // already picked this turn
    setSelectedOptionIndex(index);
  };

  const handleContinue = () => {
    if (selectedOptionIndex === null) return;
    const currentNode = roleplay?.nodes?.[currentNodeId];
    if (!currentNode) return;

    const chosenOption = currentNode.options?.[selectedOptionIndex];
    if (!chosenOption) return;

    const newHistory = [
      ...history,
      {
        nodeId: currentNodeId,
        node: currentNode,
        chosenOption,
        turnNumber: history.length + 1,
      },
    ];
    setHistory(newHistory);
    setSelectedOptionIndex(null);

    if (chosenOption.next === null || !roleplay.nodes[chosenOption.next]) {
      setIsFinished(true);
      if (onComplete) {
        const counts = newHistory.reduce(
          (acc, h) => {
            const q = h.chosenOption.quality || 'ok';
            acc[q] = (acc[q] || 0) + 1;
            return acc;
          },
          { good: 0, ok: 0, poor: 0 }
        );
        onComplete(scenario.slug, counts);
      }
    } else {
      setCurrentNodeId(chosenOption.next);
    }
  };

  if (loading) {
    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <div className="loading-spinner">
          <div className="spinner-circle" />
          <span>Loading {scenario.title.toLowerCase()} role-play...</span>
        </div>
      </div>
    );
  }

  if (error || !roleplay || !roleplay.nodes) {
    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <ErrorState
          message={error || 'Role-play scenario data is missing or incomplete.'}
          onRetry={loadRoleplay}
        />
      </div>
    );
  }

  // Summary screen at end of dialogue
  if (isFinished) {
    const summary = history.reduce(
      (acc, h) => {
        const q = h.chosenOption.quality || 'ok';
        acc[q] = (acc[q] || 0) + 1;
        return acc;
      },
      { good: 0, ok: 0, poor: 0 }
    );

    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Practice Hub</span>
        </button>

        <div className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              fontSize: '1.75rem',
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '6px' }}>
            Dialogue Complete!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            You completed the <strong>{roleplay.title}</strong> role-play.
          </p>

          {/* Breakdown cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px 8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>
                {summary.good}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>
                Good Replies
              </div>
            </div>
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                {summary.ok}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>
                Okay Replies
              </div>
            </div>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c' }}>
                {summary.poor}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>
                Needs Work
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="retry-btn"
              onClick={handleReset}
              style={{ backgroundColor: 'var(--primary-red)' }}
            >
              Try Again
            </button>
            <button
              type="button"
              className="retry-btn"
              onClick={onBack}
              style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border-warm)' }}
            >
              Back to Practice Hub
            </button>
          </div>
        </div>

        {/* Conversation Review */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
            Conversation Review
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((turn) => {
              const qStyle = QUALITY_STYLES[turn.chosenOption.quality] || QUALITY_STYLES.ok;
              return (
                <div key={turn.turnNumber} className="card" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                    Turn {turn.turnNumber} • {turn.node.speaker}
                  </div>
                  <div className="kn-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#70102d', marginBottom: '4px' }}>
                    {turn.node.kn}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#b45309', marginBottom: '10px' }}>
                    {turn.node.translit} ({turn.node.en})
                  </div>

                  <div
                    style={{
                      backgroundColor: qStyle.bg,
                      border: `1px solid ${qStyle.border}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', color: qStyle.text }}>
                        Your Choice
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: qStyle.badgeBg,
                          color: qStyle.badgeText,
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}
                      >
                        {qStyle.label}
                      </span>
                    </div>
                    <div className="kn-text" style={{ fontSize: '1rem', fontWeight: 700, color: qStyle.text }}>
                      {turn.chosenOption.kn}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: qStyle.text, opacity: 0.9 }}>
                      {turn.chosenOption.translit}
                    </div>
                    {turn.chosenOption.feedback && (
                      <div style={{ fontSize: '0.775rem', marginTop: '6px', fontStyle: 'italic', color: qStyle.text }}>
                        💡 {turn.chosenOption.feedback}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Active dialogue node
  const currentNode = roleplay.nodes[currentNodeId];
  if (!currentNode) {
    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to Practice Hub</span>
        </button>
        <ErrorState
          message={`Conversational node "${currentNodeId}" could not be loaded.`}
          onRetry={handleReset}
        />
      </div>
    );
  }

  const selectedOption =
    selectedOptionIndex !== null ? currentNode.options?.[selectedOptionIndex] : null;
  const qualityStyle = selectedOption ? QUALITY_STYLES[selectedOption.quality] || QUALITY_STYLES.ok : null;

  return (
    <div className="reading-column">
      <button type="button" className="back-btn" onClick={onBack}>
        <ArrowLeftIcon size={18} />
        <span>Practice Hub</span>
      </button>

      <div style={{ marginBottom: '14px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary-red)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {scenario.title} Role-play
        </span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
          {roleplay.title}
        </h2>
      </div>

      {/* Speaker Bubble */}
      <div
        className="card"
        style={{
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          padding: '18px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '0.775rem',
              fontWeight: 800,
              color: '#92400e',
              backgroundColor: '#fef3c7',
              padding: '3px 10px',
              borderRadius: '12px',
              display: 'inline-block',
            }}
          >
            {currentNode.speaker}
          </span>

          {hasVoice && (
            <button
              type="button"
              className={`icon-btn ${speakingId === currentNodeId ? 'playing' : ''}`}
              onClick={() => onSpeak(currentNode.kn, currentNodeId)}
              title="Listen to dialogue"
              aria-label="Listen to speaker line"
            >
              <SpeakerIcon size={20} />
            </button>
          )}
        </div>

        <div className="kn-text" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#70102d', marginBottom: '6px' }}>
          {currentNode.kn}
        </div>
        <div style={{ fontSize: '0.925rem', fontWeight: 600, color: '#b45309', marginBottom: '4px' }}>
          {currentNode.translit}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
          {currentNode.en}
        </div>
      </div>

      {/* Options Prompt */}
      <div style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
        {selectedOptionIndex === null
          ? 'Choose your reply (pick one):'
          : 'Your response feedback:'}
      </div>

      {/* Reply Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {currentNode.options?.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isDimmed = selectedOptionIndex !== null && !isSelected;
          const optStyle = isSelected ? QUALITY_STYLES[option.quality] || QUALITY_STYLES.ok : null;

          return (
            <button
              key={idx}
              type="button"
              className="card"
              disabled={selectedOptionIndex !== null}
              onClick={() => handleSelectOption(idx)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                cursor: selectedOptionIndex === null ? 'pointer' : 'default',
                opacity: isDimmed ? 0.45 : 1,
                borderColor: isSelected ? optStyle.border : 'var(--border-warm)',
                backgroundColor: isSelected ? optStyle.bg : '#ffffff',
                transform: 'none',
                boxShadow: isSelected ? `0 0 0 2px ${optStyle.border}` : '0 1px 3px rgba(0,0,0,0.04)',
                marginBottom: 0,
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                <span className="kn-text" style={{ fontSize: '1.1rem', fontWeight: 700, color: isSelected ? optStyle.text : '#70102d' }}>
                  {option.kn}
                </span>
                {isSelected && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: optStyle.badgeBg,
                      color: optStyle.badgeText,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}
                  >
                    {optStyle.label}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? optStyle.text : '#b45309', marginBottom: '2px' }}>
                {option.translit}
              </div>
              <div style={{ fontSize: '0.8rem', color: isSelected ? optStyle.text : 'var(--text-muted)' }}>
                {option.en}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner after picking */}
      {selectedOption && qualityStyle && (
        <div
          className="card"
          style={{
            backgroundColor: qualityStyle.bg,
            borderColor: qualityStyle.border,
            padding: '14px 16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                backgroundColor: qualityStyle.badgeBg,
                color: qualityStyle.badgeText,
                padding: '2px 8px',
                borderRadius: '8px',
              }}
            >
              {qualityStyle.label}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: qualityStyle.text, lineHeight: 1.45 }}>
            {selectedOption.feedback || 'Good attempt! Let us continue the conversation.'}
          </p>

          <button
            type="button"
            className="retry-btn"
            onClick={handleContinue}
            style={{
              marginTop: '12px',
              backgroundColor: qualityStyle.text,
              color: '#ffffff',
              padding: '8px 18px',
              width: '100%',
              maxWidth: '320px',
            }}
          >
            {selectedOption.next === null || !roleplay.nodes[selectedOption.next]
              ? 'Finish Dialogue & See Summary'
              : 'Continue to Next Step →'}
          </button>
        </div>
      )}
    </div>
  );
}
