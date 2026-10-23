import React from 'react';
import {
  SpeakerIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  AlertCircleIcon,
} from './Icons';

export function WordCard({
  word,
  isSaved,
  onToggleSave,
  hasVoice,
  onSpeak,
  speakingId,
}) {
  const isWordSpeaking = speakingId === word.id;

  return (
    <article className="card word-card" data-testid={`word-card-${word.id}`}>
      {/* Top Header: Kannada Word, Badges, Action Buttons */}
      <div className="word-card-header">
        <div className="word-title-group">
          <h3 className="word-kn">{word.kn}</h3>
          <div className="word-meta-badges">
            <span className="badge word-type-badge">{word.type}</span>
            {word.reviewed ? (
              <span className="badge badge-reviewed">Native Reviewed</span>
            ) : (
              <span className="badge badge-pending">Awaiting review</span>
            )}
          </div>
        </div>

        <div className="word-card-actions">
          {hasVoice && (
            <button
              type="button"
              className={`icon-btn ${isWordSpeaking ? 'playing' : ''}`}
              onClick={() => onSpeak(word.kn, word.id)}
              aria-label={`Play audio for ${word.translit}`}
              title="Play browser speech synthesis (kn-IN)"
            >
              <SpeakerIcon size={20} />
            </button>
          )}

          <button
            type="button"
            className={`icon-btn ${isSaved ? 'active' : ''}`}
            onClick={() => onToggleSave(word.id)}
            aria-label={isSaved ? `Remove ${word.translit} from saved words` : `Save ${word.translit}`}
            title={isSaved ? 'Saved in Words' : 'Save word'}
            data-testid={`save-word-btn-${word.id}`}
          >
            {isSaved ? <BookmarkFilledIcon size={20} /> : <BookmarkIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Transliteration & Meaning */}
      <div className="word-translit">{word.translit}</div>
      <div className="word-en">{word.en}</div>

      {/* Audio Fallback Notice */}
      {!hasVoice && (
        <span className="voice-note" style={{ display: 'block', marginTop: '6px' }}>
          Kannada TTS voice (kn-IN) not installed on this device/browser.
        </span>
      )}

      {/* Details Grid / Sections */}
      <div className="word-sections">
        {/* Used For */}
        <div className="word-section-item">
          <span className="word-section-label">Used for</span>
          <span className="word-section-value">{word.purpose}</span>
        </div>

        {/* Where */}
        <div className="word-section-item">
          <span className="word-section-label">Where</span>
          <div className="word-where-chips">
            {(word.where || []).map((place) => (
              <span key={place} className="chip-mini">
                {place}
              </span>
            ))}
          </div>
        </div>

        {/* When */}
        <div className="word-section-item">
          <span className="word-section-label">When</span>
          <span className="word-section-value">{word.when}</span>
        </div>

        {/* Politeness */}
        <div className="word-section-item">
          <span className="word-section-label">Politeness</span>
          <div className="word-section-value">
            <span
              className="badge"
              style={{
                display: 'inline-block',
                marginRight: '6px',
                marginBottom: '4px',
                backgroundColor:
                  word.register === 'polite'
                    ? 'var(--badge-bg)'
                    : 'var(--accent-gold-light)',
                color:
                  word.register === 'polite'
                    ? 'var(--primary-red)'
                    : 'var(--accent-gold)',
                fontWeight: 700,
                textTransform: 'capitalize',
              }}
            >
              {word.register}
            </span>
            <span>{word.tip}</span>
          </div>
        </div>

        {/* Common Mistake (only if present) */}
        {word.mistake && (
          <div className="word-mistake-box">
            <div className="word-mistake-header">
              <AlertCircleIcon size={16} />
              <span>Common mistake</span>
            </div>
            <p className="word-mistake-text">{word.mistake}</p>
          </div>
        )}

        {/* Example Conversation */}
        {word.dialogue && word.dialogue.length > 0 && (
          <div className="word-dialogue-section">
            <span className="word-section-label" style={{ marginBottom: '8px' }}>
              Example conversation
            </span>
            <div className="word-dialogue-turns">
              {word.dialogue.map((turn, idx) => {
                const turnAudioId = `${word.id}-turn-${idx + 1}`;
                const isTurnSpeaking = speakingId === turnAudioId;

                return (
                  <div key={idx} className="word-dialogue-turn">
                    <div className="turn-header">
                      <span className="speaker-pill">{turn.speaker}</span>
                      {hasVoice && (
                        <button
                          type="button"
                          className={`icon-btn icon-btn-sm ${isTurnSpeaking ? 'playing' : ''}`}
                          onClick={() => onSpeak(turn.kn, turnAudioId)}
                          aria-label={`Play turn audio for ${turn.speaker}`}
                          title="Play Kannada pronunciation"
                        >
                          <SpeakerIcon size={16} />
                        </button>
                      )}
                    </div>
                    <p className="turn-kn">{turn.kn}</p>
                    <p className="turn-translit">{turn.translit}</p>
                    <p className="turn-en">{turn.en}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
