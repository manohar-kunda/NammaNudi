import React from 'react';
import { HomeIcon, SearchIcon, BookmarkIcon, PracticeIcon, InfoIcon } from './Icons';

export function Header({ onOpenAbout, isAboutActive, activeTab, onSelectTab, savedCount }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'search', label: 'Search', icon: SearchIcon },
    { id: 'saved', label: 'Saved', icon: BookmarkIcon, count: savedCount },
    { id: 'practice', label: 'Practice', icon: PracticeIcon },
    { id: 'about', label: 'About & Status', icon: InfoIcon },
  ];

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-top">
          <div className="header-brand" onClick={() => onSelectTab && onSelectTab('home')} style={{ cursor: onSelectTab ? 'pointer' : 'default' }}>
            <div className="karnataka-badge" aria-hidden="true">
              <div className="flag-top" />
              <div className="flag-bottom" />
            </div>
            <h1 className="header-title">
              <span>NammaNudi</span>
              <span className="header-title-kn">ನಮ್ಮ ನುಡಿ</span>
            </h1>
          </div>

          {/* Desktop Navigation (Visible at >=1024px) */}
          <nav className="desktop-nav" aria-label="Desktop primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === 'about' ? isAboutActive : activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`desktop-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (item.id === 'about') {
                      onOpenAbout();
                    } else if (onSelectTab) {
                      onSelectTab(item.id);
                    }
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="desktop-badge">{item.count}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile/Tablet About pill button (Hidden at >=1024px) */}
          {onOpenAbout && (
            <button
              type="button"
              className="mobile-about-btn"
              onClick={onOpenAbout}
              data-testid="about-status-btn"
            >
              {isAboutActive ? 'Close About' : 'About & Status'}
            </button>
          )}
        </div>
        <p className="header-tagline">
          Practical everyday Kannada for life in Karnataka
        </p>
      </div>
    </header>
  );
}
