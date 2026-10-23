import React, { useState, useMemo, useEffect } from 'react';
import wordsData from '../data/words.json';
import { WordCard } from '../components/WordCard';
import { useSavedWords } from '../hooks/useSavedWords';
import {
  ArrowLeftIcon,
  SearchIcon,
  CloseIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
} from '../components/Icons';

const WHERE_OPTIONS = [
  { id: 'all', label: 'All places' },
  { id: 'auto', label: 'Auto' },
  { id: 'bus-metro', label: 'Bus & Metro' },
  { id: 'market', label: 'Market' },
  { id: 'shop', label: 'Shop' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'clinic', label: 'Clinic' },
  { id: 'office', label: 'Office' },
  { id: 'home', label: 'Home' },
  { id: 'anywhere', label: 'Anywhere' },
];

export function WordsScreen({ onBack, hasVoice, onSpeak, speakingId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedWhere, setSelectedWhere] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);

  const { savedWordIds, isWordSaved, toggleSaveWord } = useSavedWords();

  // Debounce search query by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter words client-side
  const filteredWords = useMemo(() => {
    return wordsData.filter((word) => {
      // 1. Saved-only filter
      if (savedOnly && !savedWordIds.includes(word.id)) {
        return false;
      }

      // 2. Where place filter
      if (selectedWhere !== 'all') {
        const places = word.where || [];
        if (!places.includes(selectedWhere)) {
          return false;
        }
      }

      // 3. Search query filter over kn, translit, en
      if (debouncedQuery) {
        const knMatch = (word.kn || '').toLowerCase().includes(debouncedQuery);
        const translitMatch = (word.translit || '').toLowerCase().includes(debouncedQuery);
        const enMatch = (word.en || '').toLowerCase().includes(debouncedQuery);
        if (!knMatch && !translitMatch && !enMatch) {
          return false;
        }
      }

      return true;
    });
  }, [debouncedQuery, selectedWhere, savedOnly, savedWordIds]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedWhere('all');
    setSavedOnly(false);
  };

  const savedCount = savedWordIds.length;

  return (
    <div className="words-screen-container">
      {/* Top Navigation */}
      <button
        type="button"
        className="back-btn"
        onClick={onBack}
        data-testid="words-back-btn"
      >
        <ArrowLeftIcon size={18} />
        <span>Back to Home</span>
      </button>

      {/* Screen Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge" style={{ backgroundColor: '#be123c', color: '#ffffff', fontWeight: 800 }}>
            30 Core Words
          </span>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Spoken Kannada Essentials
          </span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          Everyday Kannada Words
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          High-frequency words with usage notes, politeness rules, common mistakes, and realistic 2-turn conversations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar-wrap" style={{ marginBottom: '12px' }}>
        <div className="search-input-box">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search words (e.g. beku, illi, ಕೊಡಿ, please give)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="words-search-input"
            aria-label="Search Kannada words"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips (Place filters + Saved toggle) */}
      <div className="words-filter-bar" style={{ marginBottom: '14px' }}>
        {/* Saved Only Toggle Chip */}
        <button
          type="button"
          className={`filter-chip ${savedOnly ? 'active saved-active' : ''}`}
          onClick={() => setSavedOnly((prev) => !prev)}
          data-testid="filter-saved-only"
          aria-pressed={savedOnly}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderColor: savedOnly ? 'var(--primary-red)' : 'var(--border-warm)',
          }}
        >
          {savedOnly ? <BookmarkFilledIcon size={14} /> : <BookmarkIcon size={14} />}
          <span>Saved only {savedCount > 0 ? `(${savedCount})` : ''}</span>
        </button>

        {/* Place Filter Chips */}
        {WHERE_OPTIONS.map((opt) => {
          const isActive = selectedWhere === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedWhere(opt.id)}
              data-testid={`filter-chip-${opt.id}`}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Results Header / Count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 2px',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Showing {filteredWords.length} of {wordsData.length} words
        </span>
        {(searchQuery || selectedWhere !== 'all' || savedOnly) && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-red)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Empty State: No results from search/filter */}
      {filteredWords.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '36px 20px',
            backgroundColor: '#ffffff',
          }}
          data-testid="words-empty-state"
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <SearchIcon size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
            {savedOnly && savedCount === 0 ? 'No saved words yet' : 'No matching words found'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto 16px' }}>
            {savedOnly && savedCount === 0
              ? 'Tap the bookmark icon on any word card to save it for quick revision.'
              : 'Try searching with different keywords, check the spelling, or reset your place filters.'}
          </p>
          <button
            type="button"
            className="retry-btn"
            onClick={handleResetFilters}
            style={{ backgroundColor: 'var(--primary-red)', padding: '9px 18px', fontSize: '0.875rem' }}
          >
            {savedOnly && savedCount === 0 ? 'View All 30 Words' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* Words Grid */}
      {filteredWords.length > 0 && (
        <div className="words-grid" data-testid="words-grid">
          {filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isSaved={isWordSaved(word.id)}
              onToggleSave={toggleSaveWord}
              hasVoice={hasVoice}
              onSpeak={onSpeak}
              speakingId={speakingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
