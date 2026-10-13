import React from 'react';

export function Header({ onOpenAbout, isAboutActive }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-brand">
          <div className="karnataka-badge" aria-hidden="true">
            <div className="flag-top" />
            <div className="flag-bottom" />
          </div>
          <h1 className="header-title">
            <span>NammaNudi</span>
            <span className="header-title-kn">ನಮ್ಮ ನುಡಿ</span>
          </h1>
        </div>

        {onOpenAbout && (
          <button
            type="button"
            onClick={onOpenAbout}
            data-testid="about-status-btn"
            style={{
              background: isAboutActive ? '#fde68a' : 'rgba(255, 255, 255, 0.14)',
              color: isAboutActive ? '#70102d' : '#ffffff',
              border: '1px solid rgba(254, 215, 170, 0.45)',
              borderRadius: '999px',
              padding: '4px 11px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            About & Status
          </button>
        )}
      </div>
      <p className="header-tagline">
        Practical everyday Kannada for life in Karnataka
      </p>
    </header>
  );
}
