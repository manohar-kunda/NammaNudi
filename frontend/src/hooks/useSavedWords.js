import { useState, useCallback } from 'react';

const STORAGE_KEY = 'nammanudi_saved_words_v1';

export function useSavedWords() {
  const [savedWordIds, setSavedWordIds] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('Failed to read saved words from localStorage:', err);
      return [];
    }
  });

  const isWordSaved = useCallback(
    (wordId) => savedWordIds.includes(wordId),
    [savedWordIds]
  );

  const toggleSaveWord = useCallback((wordId) => {
    setSavedWordIds((prev) => {
      const next = prev.includes(wordId)
        ? prev.filter((id) => id !== wordId)
        : [...prev, wordId];
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch (err) {
        console.warn('Failed to write saved words to localStorage:', err);
      }
      return next;
    });
  }, []);

  return { savedWordIds, isWordSaved, toggleSaveWord };
}
