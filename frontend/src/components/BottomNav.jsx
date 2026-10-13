import React from 'react';
import { HomeIcon, SearchIcon, BookmarkIcon, PracticeIcon } from './Icons';

export function BottomNav({ activeTab, onSelectTab, savedCount }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'search', label: 'Search', icon: SearchIcon },
    { id: 'saved', label: `Saved${savedCount > 0 ? ` (${savedCount})` : ''}`, icon: BookmarkIcon },
    { id: 'practice', label: 'Practice', icon: PracticeIcon },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={22} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
