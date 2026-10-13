import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
  const [hasVoice, setHasVoice] = useState(false);
  const [activeVoice, setActiveVoice] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasVoice(false);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(
        (v) => v.lang.toLowerCase() === 'kn-in' || v.lang.toLowerCase().startsWith('kn')
      );
      if (knVoice) {
        setHasVoice(true);
        setActiveVoice(knVoice);
      } else {
        setHasVoice(false);
        setActiveVoice(null);
      }
    };

    checkVoices();
    window.speechSynthesis.onvoiceschanged = checkVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text, phraseId) => {
      if (!('speechSynthesis' in window) || !hasVoice) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN';
      if (activeVoice) {
        utterance.voice = activeVoice;
      }
      utterance.rate = 0.85; // Slightly slower for better learner clarity

      utterance.onstart = () => setSpeakingId(phraseId);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    },
    [hasVoice, activeVoice]
  );

  return { hasVoice, speak, speakingId };
}
