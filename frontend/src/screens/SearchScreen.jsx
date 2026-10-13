import React, { useState, useEffect } from 'react';
import { searchPhrases } from '../api';
import { PhraseCard } from '../components/PhraseCard';
import { ErrorState } from '../components/ErrorState';
import { SearchIcon, CloseIcon } from '../components/Icons';

export function SearchScreen({
  isSaved,
  onToggleSave,
  hasVoice,
  onSpeak,
  speakingId,
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 280);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (debouncedQuery.length > 100) {
      setError('Search query cannot exceed 100 characters.');
      setResults([]);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    searchPhrases(debouncedQuery)
      .then((data) => {
        if (active) setResults(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.length <= 100) {
      setQuery(val);
      if (error && error.includes('100 characters')) setError(null);
    } else {
      setQuery(val.slice(0, 100));
      setError('Search query is limited to 100 characters.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          Search Phrases
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Search across Kannada, Roman transliteration, or English translation.
        </p>
      </div>

      <div className="search-container">
        <div className="search-input-wrap">
          <span className="search-icon-left">
            <SearchIcon size={20} />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="e.g. meter, ದೋಸೆ, headache, tea..."
            value={query}
            maxLength={100}
            onChange={handleInputChange}
            aria-label="Search Kannada phrases"
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                setDebouncedQuery('');
                setResults([]);
              }}
              aria-label="Clear search query"
            >
              <CloseIcon size={18} />
            </button>
          )}
        </div>
        <div className="search-counter">
          {query.length} / 100 characters
        </div>
      </div>

      {error && <ErrorState message={error} />}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner-circle" />
          <span>Searching phrases...</span>
        </div>
      )}

      {!loading && !error && !debouncedQuery && (
        <div className="empty-state">
          <SearchIcon className="empty-icon" size={48} />
          <div className="empty-title">Instant Bilingual Search</div>
          <p className="empty-sub">
            Type any everyday keyword in Kannada script (e.g. <strong>ನೀರು</strong>), transliteration (e.g. <strong>bega</strong>), or English (e.g. <strong>ticket</strong>).
          </p>
        </div>
      )}

      {!loading && !error && debouncedQuery && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-title">No matching phrases found</div>
          <p className="empty-sub">
            No phrases matched &ldquo;{debouncedQuery}&rdquo;. Try another spelling or simpler term.
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
            Found {results.length} phrase{results.length > 1 ? 's' : ''}
          </div>
          {results.map((phrase) => (
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
