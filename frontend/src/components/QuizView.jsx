import React, { useState, useEffect } from 'react';
import { fetchScenarioQuiz } from '../api';
import { ErrorState } from './ErrorState';
import { ArrowLeftIcon } from './Icons';

export function QuizView({ scenario, onBack, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    try {
      const data = await fetchScenarioQuiz(scenario.slug);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [scenario.slug]);

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const currentQuestion = questions[currentIndex];
    if (currentQuestion && idx === currentQuestion.answerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      setIsFinished(true);
      if (onComplete) {
        onComplete(scenario.slug, score, questions.length);
      }
    } else {
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  if (loading) {
    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <div className="loading-spinner">
          <div className="spinner-circle" />
          <span>Loading quiz questions...</span>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <ErrorState
          message={error || 'No quiz questions available for this scenario.'}
          onRetry={loadQuiz}
        />
      </div>
    );
  }

  // Quiz summary screen
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="reading-column">
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Practice Hub</span>
        </button>

        <div className="card" style={{ padding: '28px 20px', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: passed ? '#ecfdf5' : '#fef2f2',
              color: passed ? '#047857' : '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {passed ? '✓' : '!'}
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '6px' }}>
            {passed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            You completed the <strong>{scenario.title}</strong> quiz.
          </p>

          <div
            style={{
              backgroundColor: passed ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${passed ? '#a7f3d0' : '#fde68a'}`,
              borderRadius: '16px',
              padding: '18px 24px',
              display: 'inline-block',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: passed ? '#047857' : '#b45309', lineHeight: 1 }}>
              {score} / {questions.length}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: passed ? '#065f46' : '#92400e', marginTop: '6px' }}>
              {percentage}% Correct
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="retry-btn"
              onClick={handleRetry}
              style={{ backgroundColor: 'var(--primary-red)' }}
            >
              Try Again
            </button>
            <button
              type="button"
              className="retry-btn"
              onClick={onBack}
              style={{ backgroundColor: '#ffffff', color: 'var(--text-main)', border: '1px solid var(--border-warm)' }}
            >
              Practice Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active question view
  const currentQ = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQ.answerIndex;

  return (
    <div className="reading-column">
      <button type="button" className="back-btn" onClick={onBack}>
        <ArrowLeftIcon size={18} />
        <span>Practice Hub</span>
      </button>

      {/* Progress Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary-red)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {scenario.title} Quiz
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#e7e5e4',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%`,
            backgroundColor: '#881337',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* Question Card */}
      <div
        className="card"
        style={{
          padding: '20px',
          marginBottom: '16px',
          backgroundColor: '#ffffff',
          borderColor: 'var(--border-warm)',
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5 }}>
          {currentQ.prompt}
        </h3>
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {currentQ.options?.map((opt, idx) => {
          let bg = '#ffffff';
          let border = 'var(--border-warm)';
          let text = 'var(--text-main)';

          if (isAnswered) {
            if (idx === currentQ.answerIndex) {
              bg = '#ecfdf5';
              border = '#10b981';
              text = '#065f46';
            } else if (idx === selectedOption) {
              bg = '#fef2f2';
              border = '#ef4444';
              text = '#991b1b';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              className="card"
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                cursor: isAnswered ? 'default' : 'pointer',
                backgroundColor: bg,
                borderColor: border,
                color: text,
                transform: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                marginBottom: 0,
                width: '100%',
                fontWeight: 600,
                fontSize: '0.925rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className="kn-text">{opt}</span>
              {isAnswered && idx === currentQ.answerIndex && (
                <span style={{ color: '#059669', fontSize: '1.1rem', fontWeight: 800 }}>✓</span>
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.answerIndex && (
                <span style={{ color: '#dc2626', fontSize: '1.1rem', fontWeight: 800 }}>✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Instant Feedback & Explanation */}
      {isAnswered && (
        <div
          className="card"
          style={{
            backgroundColor: isCorrect ? '#ecfdf5' : '#fffbeb',
            borderColor: isCorrect ? '#a7f3d0' : '#fde68a',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2',
                color: isCorrect ? '#047857' : '#b91c1c',
                padding: '3px 8px',
                borderRadius: '8px',
              }}
            >
              {isCorrect ? 'Correct! ✓' : 'Incorrect'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: isCorrect ? '#065f46' : '#92400e', lineHeight: 1.5 }}>
            {currentQ.explanation}
          </p>

          <button
            type="button"
            className="retry-btn"
            onClick={handleNext}
            style={{
              marginTop: '12px',
              backgroundColor: isCorrect ? '#047857' : '#b45309',
              color: '#ffffff',
              padding: '8px 18px',
              width: '100%',
              maxWidth: '240px',
            }}
          >
            {currentIndex + 1 === questions.length ? 'See Final Score →' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
