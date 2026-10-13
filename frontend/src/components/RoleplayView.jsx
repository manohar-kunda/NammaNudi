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
    if (selectedOptionIndex !== null) return;
    setSelectedOptionIndex(index);
  };

  const handleContinue = () => {
    if (!roleplay || !roleplay.nodes || selectedOptionIndex === null) return;
    const currentNode = roleplay.nodes[currentNodeId];
    if (!currentNode || !Array.isArray(currentNode.options)) return;

    const chosen = currentNode.options[selectedOptionIndex];
    if (!chosen) return;

    const updatedHistory = [
      ...history,
      {
        nodeId: currentNodeId,
        speaker: currentNode.speaker,
        promptKn: currentNode.kn,
        replyKn: chosen.kn,
        replyTranslit: chosen.translit,
        replyEn: chosen.en,
        quality: chosen.quality || 'ok',
        feedback: chosen.feedback || '',
      },
    ];

    setHistory(updatedHistory);
    setSelectedOptionIndex(null);

    if (chosen.next === null || chosen.next === undefined) {
      const counts = updatedHistory.reduce(
        (acc, turn) => {
          const q = turn.quality;
          if (q === 'good' || q === 'ok' || q === 'poor') {
            acc[q] += 1;
          }
          return acc;
        },
        { good: 0, ok: 0, poor: 0 }
      );
      setIsFinished(true);
      if (onComplete) {
        onComplete(scenario.slug, counts);
      }
    } else {
      setCurrentNodeId(chosen.next);
    }
  };

  if (loading) {
    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <div className="loading-spinner">
          <div className="spinner-circle" />
          <span>Loading role-play dialogue...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <ErrorState message={error} onRetry={loadRoleplay} />
      </div>
    );
  }

  // Guard against missing roleplay structure or missing node
  const currentNode =
    roleplay && roleplay.nodes && currentNodeId
      ? roleplay.nodes[currentNodeId]
      : null;

  if (!isFinished && !currentNode) {
    console.error(`[NammaNudi Roleplay] Missing dialogue node "${currentNodeId}" in scenario "${scenario.slug}"`);
    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <ErrorState
          message="This part of the conversation could not be loaded. Please try starting the role-play again."
          onRetry={handleReset}
        />
      </div>
    );
  }

  if (isFinished) {
    const counts = history.reduce(
      (acc, turn) => {
        const q = turn.quality;
        if (q === 'good' || q === 'ok' || q === 'poor') {
          acc[q] += 1;
        }
        return acc;
      },
      { good: 0, ok: 0, poor: 0 }
    );

    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>

        <div className="card" style={{ padding: '22px 18px' }}>
          <span
            className="badge"
            style={{ backgroundColor: '#fef3c7', color: '#92400e', marginBottom: '8px' }}
          >
            Role-play Complete
          </span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '4px' }}>
            {roleplay.title}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            You completed {history.length} conversation {history.length === 1 ? 'turn' : 'turns'}. Here is your reply breakdown:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '12px 8px',
                textAlign: 'center',
              }}
              data-testid="summary-good-count"
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#047857' }}>
                {counts.good}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>
                Good
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '12px 8px',
                textAlign: 'center',
              }}
              data-testid="summary-ok-count"
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
                {counts.ok}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>
                Okay
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 8px',
                textAlign: 'center',
              }}
              data-testid="summary-poor-count"
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b91c1c' }}>
                {counts.poor}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>
                Poor
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="retry-btn"
              style={{ backgroundColor: 'var(--primary-red)', padding: '10px 18px', fontSize: '0.875rem' }}
              onClick={handleReset}
            >
              Try again
            </button>
            <button
              type="button"
              className="retry-btn"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                border: '1px solid var(--border-warm)',
                padding: '10px 18px',
                fontSize: '0.875rem',
              }}
              onClick={onBack}
            >
              Choose another activity
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption =
    selectedOptionIndex !== null && Array.isArray(currentNode.options)
      ? currentNode.options[selectedOptionIndex]
      : null;

  const qualityStyle = selectedOption
    ? QUALITY_STYLES[selectedOption.quality] || QUALITY_STYLES.ok
    : null;

  return (
    <div>
      <button type="button" className="back-btn" onClick={onBack}>
        <ArrowLeftIcon size={18} />
        <span>Back to {scenario.title} Practice</span>
      </button>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-red)' }}>
            {roleplay.title}
          </h2>
          <span className="badge" style={{ backgroundColor: '#f5f5f4', color: '#44403c' }}>
            Turn {history.length + 1}
          </span>
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Read the speaker&apos;s line and choose the best Kannada response.
        </p>
      </div>

      {/* Other Speaker's Line */}
      <div
        className="card"
        style={{
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            className="badge"
            style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 700 }}
          >
            {currentNode.speaker || 'Speaker'}
          </span>

          {hasVoice && (
            <button
              type="button"
              className={`icon-btn ${speakingId === currentNodeId ? 'playing' : ''}`}
              onClick={() => onSpeak(currentNode.kn, currentNodeId)}
              aria-label="Listen to speaker line"
              title="Play synthesized Kannada audio (kn-IN)"
            >
              <SpeakerIcon size={18} />
            </button>
          )}
        </div>

        <p className="phrase-kn" style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
          {currentNode.kn}
        </p>
        <p className="phrase-translit" style={{ marginBottom: '4px' }}>
          {currentNode.translit}
        </p>
        <p className="phrase-en">{currentNode.en}</p>
      </div>

      {/* Feedback Banner & Continue Button */}
      {selectedOption && qualityStyle && (
        <div
          className="card"
          data-testid="roleplay-feedback"
          style={{
            backgroundColor: qualityStyle.bg,
            borderColor: qualityStyle.border,
            borderWidth: '1.5px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              className="badge"
              style={{
                backgroundColor: qualityStyle.badgeBg,
                color: qualityStyle.badgeText,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {selectedOption.quality} — {qualityStyle.label}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: qualityStyle.text, fontWeight: 500, marginBottom: '12px' }}>
            {selectedOption.feedback}
          </p>
          <button
            type="button"
            className="retry-btn"
            style={{ backgroundColor: 'var(--primary-red)', padding: '9px 18px', fontSize: '0.875rem' }}
            onClick={handleContinue}
          >
            {selectedOption.next ? 'Continue Conversation' : 'Finish Role-play'}
          </button>
        </div>
      )}

      {/* User Reply Options */}
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Choose your reply:
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(currentNode.options || []).map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isLocked = selectedOptionIndex !== null;
            const optQuality = QUALITY_STYLES[opt.quality] || QUALITY_STYLES.ok;

            return (
              <button
                key={idx}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelectOption(idx)}
                className="card option-reply-btn"
                data-quality={opt.quality}
                style={{
                  margin: 0,
                  textAlign: 'left',
                  cursor: isLocked ? 'default' : 'pointer',
                  borderColor: isSelected ? optQuality.border : 'var(--border-warm)',
                  backgroundColor: isSelected ? optQuality.bg : '#ffffff',
                  borderWidth: isSelected ? '2px' : '1px',
                  opacity: isLocked && !isSelected ? 0.65 : 1,
                }}
              >
                <div className="kn-text" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#70102d', marginBottom: '4px' }}>
                  {opt.kn}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#b45309', marginBottom: '2px' }}>
                  {opt.translit}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {opt.en}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
