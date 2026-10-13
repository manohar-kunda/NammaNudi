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
      <div>
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

  if (error) {
    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <ErrorState message={error} onRetry={loadQuiz} />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>
        <ErrorState
          message="No quiz questions found for this scenario."
          onRetry={loadQuiz}
        />
      </div>
    );
  }

  if (isFinished) {
    return (
      <div>
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to {scenario.title} Practice</span>
        </button>

        <div className="card" style={{ padding: '24px 18px', textAlign: 'center' }} data-testid="quiz-summary">
          <span
            className="badge"
            style={{ backgroundColor: '#fef3c7', color: '#92400e', marginBottom: '10px' }}
          >
            Quiz Completed
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-red)', marginBottom: '6px' }}>
            {scenario.title} Quiz Result
          </h2>

          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#047857',
              margin: '14px 0',
            }}
            data-testid="quiz-final-score"
          >
            {score} / {questions.length}
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {score === questions.length
              ? 'Outstanding! You got every question right.'
              : score >= 3
              ? 'Great effort! Keep practicing to master all phrases.'
              : 'Good start! Review the scenario phrases and try again.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="retry-btn"
              style={{ backgroundColor: 'var(--primary-red)', padding: '10px 18px', fontSize: '0.875rem' }}
              onClick={handleRetry}
            >
              Try again
            </button>
            <button
              type="button"
              className="retry-btn"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                border: '1px solid var(--border-warm)',
                padding: '10px 18px',
                fontSize: '0.875rem',
              }}
              onClick={onBack}
            >
              Choose another activity
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQuestion.answerIndex;

  return (
    <div>
      <button type="button" className="back-btn" onClick={onBack}>
        <ArrowLeftIcon size={18} />
        <span>Back to {scenario.title} Practice</span>
      </button>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-red)' }}>
            {scenario.title} Quiz
          </h2>
          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '6px',
            width: '100%',
            backgroundColor: '#e7e5e4',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              backgroundColor: 'var(--primary-red)',
              transition: 'width 0.25s ease',
            }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '18px', marginBottom: '14px' }}>
        <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          {currentQuestion.prompt}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(currentQuestion.options || []).map((optionText, idx) => {
            let borderColor = 'var(--border-warm)';
            let bgColor = '#ffffff';
            let textColor = 'var(--text-main)';

            if (isAnswered) {
              if (idx === currentQuestion.answerIndex) {
                borderColor = '#10b981';
                bgColor = '#ecfdf5';
                textColor = '#065f46';
              } else if (idx === selectedOption) {
                borderColor = '#f87171';
                bgColor = '#fef2f2';
                textColor = '#991b1b';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className="card kn-text"
                style={{
                  margin: 0,
                  padding: '12px 14px',
                  textAlign: 'left',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: isAnswered ? 'default' : 'pointer',
                  borderColor,
                  backgroundColor: bgColor,
                  color: textColor,
                  borderWidth: isAnswered && (idx === currentQuestion.answerIndex || idx === selectedOption) ? '2px' : '1px',
                }}
              >
                {optionText}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div
          className="card"
          data-testid="quiz-feedback"
          style={{
            backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2',
            borderColor: isCorrect ? '#34d399' : '#f87171',
            borderWidth: '1.5px',
            padding: '16px',
          }}
        >
          <div style={{ marginBottom: '6px' }}>
            <span
              className="badge"
              style={{
                backgroundColor: isCorrect ? '#d1fae5' : '#fee2e2',
                color: isCorrect ? '#047857' : '#b91c1c',
                fontWeight: 700,
              }}
            >
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </span>
          </div>
          <p
            className="kn-text"
            style={{
              fontSize: '0.9rem',
              color: isCorrect ? '#065f46' : '#991b1b',
              fontWeight: 500,
              marginBottom: '12px',
            }}
          >
            {currentQuestion.explanation}
          </p>
          <button
            type="button"
            className="retry-btn"
            style={{ backgroundColor: 'var(--primary-red)', padding: '9px 18px', fontSize: '0.875rem' }}
            onClick={handleNext}
          >
            {currentIndex + 1 < questions.length ? 'Next Question' : 'See Final Score'}
          </button>
        </div>
      )}
    </div>
  );
}
