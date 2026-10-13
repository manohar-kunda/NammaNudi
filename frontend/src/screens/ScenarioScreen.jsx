import React, { useState, useEffect } from 'react';
import { fetchScenarioPhrases } from '../api';
import { PhraseCard } from '../components/PhraseCard';
import { ErrorState, LoadingState } from '../components/ErrorState';
import { ArrowLeftIcon } from '../components/Icons';

export function ScenarioScreen({
  scenario,
  onBack,
  isSaved,
  onToggleSave,
  hasVoice,
  onSpeak,
  speakingId,
}) {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPhrases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchScenarioPhrases(scenario.slug);
      setPhrases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhrases();
  }, [scenario.slug]);

  return (
    <div>
      <button type="button" className="back-btn" onClick={onBack}>
        <ArrowLeftIcon size={18} />
        <span>All Scenarios</span>
      </button>

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          {scenario.title} Phrases
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Tap any phrase to expand its full example sentence.
        </p>
      </div>

      {scenario.slug === 'healthcare' && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: '#92400e',
            marginBottom: '14px',
            fontWeight: 500,
          }}
        >
          Note: Healthcare phrases are conversational communication aids, not medical advice.
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadPhrases} />}

      {loading && (
        <LoadingState
          label={`Loading ${scenario.title.toLowerCase()} phrases...`}
          onRetry={loadPhrases}
        />
      )}

      {!loading && !error && phrases.length === 0 && (
        <div className="empty-state">
          <div className="empty-title">No phrases found</div>
          <p className="empty-sub">There are no phrases listed for this scenario yet.</p>
        </div>
      )}

      {!loading &&
        !error &&
        phrases.map((phrase) => (
          <PhraseCard
            key={phrase.id}
            phrase={phrase}
            isSaved={isSaved(phrase.id)}
            onToggleSave={onToggleSave}
            hasVoice={hasVoice}
            onSpeak={onSpeak}
            speakingId={speakingId}
          />
        ))}
    </div>
  );
}
