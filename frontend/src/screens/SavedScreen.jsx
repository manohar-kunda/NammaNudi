import React from 'react';
import { PhraseCard } from '../components/PhraseCard';
import { BookmarkIcon } from '../components/Icons';

export function SavedScreen({
  savedPhrases,
  isSaved,
  onToggleSave,
  hasVoice,
  onSpeak,
  speakingId,
  onBrowseScenarios,
}) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          Saved Phrases
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Quick offline reference saved on your device ({savedPhrases.length} total).
        </p>
      </div>

      {savedPhrases.length === 0 ? (
        <div className="empty-state">
          <BookmarkIcon className="empty-icon" size={48} />
          <div className="empty-title">No Saved Phrases Yet</div>
          <p className="empty-sub">
            Tap the bookmark icon on any phrase card across transport, shopping, dining, or clinic scenarios to save it here for fast access.
          </p>
          <button
            type="button"
            className="retry-btn"
            style={{ marginTop: '12px', backgroundColor: 'var(--primary-red)' }}
            onClick={onBrowseScenarios}
          >
            Browse Scenarios
          </button>
        </div>
      ) : (
        <div className="phrases-grid">
          {savedPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              isSaved={isSaved(phrase.id)}
              onToggleSave={onToggleSave}
              hasVoice={hasVoice}
              onSpeak={onSpeak}
              speakingId={speakingId}
              showScenarioBadge={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
