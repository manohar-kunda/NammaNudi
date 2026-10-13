import React, { useState } from 'react';
import {
  SpeakerIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from './Icons';

export function PhraseCard({
  phrase,
  isSaved,
  onToggleSave,
  hasVoice,
  onSpeak,
  speakingId,
  showScenarioBadge = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const isPlaying = speakingId === phrase.id;

  return (
    <article className="card phrase-card">
      <div className="phrase-top-row">
        <div>
          {showScenarioBadge && (
            <span className="badge badge-scenario" style={{ marginBottom: '6px' }}>
              {phrase.scenario}
            </span>
          )}
          <div className="phrase-kn">{phrase.kn}</div>
        </div>

        <div className="phrase-actions">
          {hasVoice && (
            <button
              type="button"
              className={`icon-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => onSpeak(phrase.kn, phrase.id)}
              aria-label={`Play synthesized audio for ${phrase.translit}`}
              title="Play browser speech synthesis (kn-IN)"
            >
              <SpeakerIcon size={20} />
            </button>
          )}
          <button
            type="button"
            className={`icon-btn ${isSaved ? 'active' : ''}`}
            onClick={() => onToggleSave(phrase)}
            aria-label={isSaved ? 'Remove from saved phrases' : 'Save phrase'}
            title={isSaved ? 'Saved' : 'Save phrase'}
          >
            {isSaved ? <BookmarkFilledIcon size={20} /> : <BookmarkIcon size={20} />}
          </button>
        </div>
      </div>

      <div className="phrase-translit">{phrase.translit}</div>
      <div className="phrase-en">{phrase.en}</div>

      {!hasVoice && (
        <span className="voice-note">
          Kannada TTS voice (kn-IN) not installed on this device/browser.
        </span>
      )}

      {phrase.example && (
        <div className="phrase-footer">
          <button
            type="button"
            className="example-toggle-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            <span>{expanded ? 'Hide example' : 'Show example sentence'}</span>
            {expanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </button>

          <span className="badge badge-pending">
            {phrase.reviewed ? 'Native Reviewed' : 'Unreviewed draft'}
          </span>
        </div>
      )}

      {expanded && phrase.example && (
        <div className="example-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="ex-label">Example Usage</span>
            {hasVoice && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => onSpeak(phrase.example.kn, `${phrase.id}-ex`)}
                aria-label="Play synthesized audio for example sentence"
                title="Play browser speech synthesis (kn-IN)"
              >
                <SpeakerIcon size={16} />
              </button>
            )}
          </div>
          <div className="ex-kn">{phrase.example.kn}</div>
          <div className="ex-translit">{phrase.example.translit}</div>
          <div className="ex-en">{phrase.example.en}</div>
        </div>
      )}
    </article>
  );
}
