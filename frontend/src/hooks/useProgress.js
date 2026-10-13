import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'nammanudi_progress_v1';

const DEFAULT_PROGRESS = {
  quizBestScores: {},
  roleplayCompletions: {},
};

function readInitialProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      quizBestScores: parsed?.quizBestScores && typeof parsed.quizBestScores === 'object'
        ? parsed.quizBestScores
        : {},
      roleplayCompletions: parsed?.roleplayCompletions && typeof parsed.roleplayCompletions === 'object'
        ? parsed.roleplayCompletions
        : {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(readInitialProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [progress]);

  const recordQuizScore = useCallback((scenarioSlug, score, total = 5) => {
    if (!scenarioSlug) return;
    setProgress((prev) => {
      const existing = prev.quizBestScores[scenarioSlug];
      const bestScore = existing ? Math.max(existing.bestScore, score) : score;
      const attempts = existing ? (existing.attempts || 0) + 1 : 1;
      return {
        ...prev,
        quizBestScores: {
          ...prev.quizBestScores,
          [scenarioSlug]: {
            bestScore,
            total,
            attempts,
            lastScore: score,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const recordRoleplayCompletion = useCallback((scenarioSlug, summary = { good: 0, ok: 0, poor: 0 }) => {
    if (!scenarioSlug) return;
    setProgress((prev) => {
      const existing = prev.roleplayCompletions[scenarioSlug];
      const count = existing ? (existing.count || 0) + 1 : 1;
      return {
        ...prev,
        roleplayCompletions: {
          ...prev.roleplayCompletions,
          [scenarioSlug]: {
            count,
            lastSummary: {
              good: summary.good || 0,
              ok: summary.ok || 0,
              poor: summary.poor || 0,
            },
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const getScenarioProgress = useCallback(
    (scenarioSlug) => {
      const quiz = progress.quizBestScores[scenarioSlug] || null;
      const roleplay = progress.roleplayCompletions[scenarioSlug] || null;
      return { quiz, roleplay };
    },
    [progress]
  );

  const totalRoleplayCompletions = Object.values(progress.roleplayCompletions).reduce(
    (acc, item) => acc + (item?.count || 0),
    0
  );

  const scenariosWithRoleplayDone = Object.values(progress.roleplayCompletions).filter(
    (item) => (item?.count || 0) > 0
  ).length;

  const scenariosWithQuizDone = Object.keys(progress.quizBestScores).length;

  const totalBestQuizPoints = Object.values(progress.quizBestScores).reduce(
    (acc, item) => acc + (item?.bestScore || 0),
    0
  );

  return {
    progress,
    recordQuizScore,
    recordRoleplayCompletion,
    getScenarioProgress,
    totalRoleplayCompletions,
    scenariosWithRoleplayDone,
    scenariosWithQuizDone,
    totalBestQuizPoints,
  };
}
