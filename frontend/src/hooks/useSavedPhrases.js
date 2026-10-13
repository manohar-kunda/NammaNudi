import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'nammanudi_saved_phrases_v1';

export function useSavedPhrases() {
  const [savedPhrases, setSavedPhrases] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPhrases));
    } catch {
      // ignore storage quota errors
    }
  }, [savedPhrases]);

  const isSaved = useCallback(
    (phraseId) => savedPhrases.some((p) => p.id === phraseId),
    [savedPhrases]
  );

  const toggleSave = useCallback((phrase) => {
    setSavedPhrases((prev) => {
      const exists = prev.some((p) => p.id === phrase.id);
      if (exists) {
        return prev.filter((p) => p.id !== phrase.id);
      }
      return [...prev, phrase];
    });
  }, []);

  return { savedPhrases, isSaved, toggleSave };
}
