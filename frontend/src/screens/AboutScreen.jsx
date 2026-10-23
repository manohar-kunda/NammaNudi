import React, { useState, useEffect } from 'react';
import { fetchScenarios, fetchScenarioPhrases } from '../api';
import { ErrorState, LoadingState } from '../components/ErrorState';
import { ArrowLeftIcon } from '../components/Icons';

export function AboutScreen({ onBack }) {
  const [phrases, setPhrases] = useState([]);
  const [basicsPhrases, setBasicsPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPhrases = async () => {
    setLoading(true);
    setError(null);
    try {
      const scenarios = await fetchScenarios();
      const hasBasics = (scenarios || []).some((sc) => sc.slug === 'basics');

      const scenarioSlugs = (scenarios || []).map((sc) => sc.slug);
      const lists = await Promise.all(
        scenarioSlugs.map((slug) => fetchScenarioPhrases(slug))
      );
      const combined = lists.flat();
      setPhrases(combined);

      // Only load survival starter phrases if the basics scenario is present in the API
      if (hasBasics) {
        const basicsList = lists[scenarioSlugs.indexOf('basics')] || [];
        setBasicsPhrases(basicsList);
      } else {
        setBasicsPhrases([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhrases();
  }, []);

  const totalCount = phrases.length;
  const reviewedCount = phrases.filter((p) => p.reviewed === true).length;
  const awaitingReviewCount = phrases.filter((p) => !p.reviewed).length;

  // Determine review status headline strictly following the real API data
  let reviewHeadline = '';
  let reviewDescription = '';

  if (totalCount > 0 && reviewedCount === totalCount) {
    reviewHeadline = 'Reviewed by native Kannada speakers';
    reviewDescription = `All ${totalCount} phrases in the catalog have been reviewed and approved by native Kannada speakers.`;
  } else if (reviewedCount > 0) {
    reviewHeadline = `${reviewedCount} of ${totalCount} phrases reviewed by native speakers`;
    reviewDescription = `${reviewedCount} phrases have been verified by native Kannada speakers; ${awaitingReviewCount} remain in the review queue.`;
  } else {
    reviewHeadline = 'Awaiting native-speaker review';
    reviewDescription = `All ${totalCount} phrases are currently marked as awaiting review by a native Kannada speaker (reviewed: false).`;
  }

  return (
    <div className="reading-column">
      {onBack && (
        <button type="button" className="back-btn" onClick={onBack}>
          <ArrowLeftIcon size={18} />
          <span>Back to Home</span>
        </button>
      )}

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-red)' }}>
          About NammaNudi
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Practical everyday spoken Kannada for people moving to and living in Karnataka.
        </p>
      </div>

      {/* Mission Statement for Newcomers */}
      <div className="card" style={{ padding: '18px', marginBottom: '14px', borderLeft: '4px solid var(--primary-red)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
          Welcome to Karnataka! (ಕರ್ನಾಟಕಕ್ಕೆ ಸುಸ್ವಾಗತ)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          Moving to a new city can be overwhelming when you don&apos;t know the local language.
          <strong> NammaNudi</strong> (ನಮ್ಮ ನುಡಿ — <em>Our Voice</em>) was created for students, professionals,
          and newcomers to easily pick up the natural, polite phrases needed for real daily interactions in Bengaluru
          and across Karnataka — from hiring an auto and ordering coffee to buying groceries and speaking with a doctor.
        </p>
      </div>

      {/* Live Content Verification Status */}
      <div className="card" style={{ padding: '18px', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
          Phrase Review Status
        </h3>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: reviewedCount > 0 ? '#047857' : '#b45309', marginBottom: '6px' }}>
          {reviewHeadline}
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          {reviewDescription}
        </p>

        {loading && (
          <LoadingState
            label="Computing review status from server..."
            onRetry={loadPhrases}
          />
        )}

        {error && <ErrorState message={error} onRetry={loadPhrases} />}

        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '12px',
              }}
              data-testid="reviewed-true-box"
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>
                {reviewedCount} / {totalCount}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46' }}>
                Phrases reviewed (reviewed=true)
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '12px',
              }}
              data-testid="awaiting-review-box"
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309' }}>
                {awaitingReviewCount} / {totalCount}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>
                Awaiting native review
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Survival Starter List (Built from API data) */}
      {!loading && !error && basicsPhrases.length > 0 && (
        <div className="card" style={{ padding: '18px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Survival Starter Phrases
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Core conversational essentials directly from the catalog to help you get started immediately:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {basicsPhrases.map((phrase) => (
              <div
                key={phrase.id}
                style={{
                  backgroundColor: 'var(--badge-bg)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  border: '1px solid var(--border-warm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="kn-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {phrase.kn}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-gold)' }}>
                    {phrase.translit}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {phrase.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Essential App Notes */}
      <div className="card" style={{ padding: '18px', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
          How NammaNudi Works
        </h3>
        <ul style={{ paddingLeft: '18px', fontSize: '0.835rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li>
            <strong>Audio Pronunciation:</strong> Audio uses your device&apos;s browser{' '}
            <code>speechSynthesis</code> API (<code>kn-IN</code>) when a Kannada voice package is installed. If your device doesn&apos;t have a Kannada voice, the text and transliteration remain fully readable.
          </li>
          <li>
            <strong>Offline Support:</strong> Once loaded, a Service Worker caches the app shell and scenario phrases so you can continue learning even without internet. Note that live keyword search requires an active connection.
          </li>
          <li>
            <strong>Healthcare Disclaimer:</strong> Phrases in the Healthcare scenario are practical conversational communication aids to help you express symptoms at clinics and pharmacies, not medical advice.
          </li>
          <li>
            <strong>Privacy &amp; Progress:</strong> Your quiz scores, practice completions, and saved phrases are stored locally in your browser&apos;s <code>localStorage</code>. No personal data or accounts are ever sent to a server.
          </li>
        </ul>
      </div>
    </div>
  );
}
