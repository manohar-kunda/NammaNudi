import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { ScenarioScreen } from './screens/ScenarioScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SavedScreen } from './screens/SavedScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { AboutScreen } from './screens/AboutScreen';
import { useSavedPhrases } from './hooks/useSavedPhrases';
import { useSpeech } from './hooks/useSpeech';
import { useProgress } from './hooks/useProgress';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedScenario, setSelectedScenario] = useState(null);

  const { savedPhrases, isSaved, toggleSave } = useSavedPhrases();
  const { hasVoice, speak, speakingId } = useSpeech();
  const {
    progress,
    recordQuizScore,
    recordRoleplayCompletion,
    getScenarioProgress,
    totalRoleplayCompletions,
    scenariosWithQuizDone,
    totalBestQuizPoints,
  } = useProgress();

  const handleSelectScenario = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleBackToScenarios = () => {
    setSelectedScenario(null);
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab !== 'home') {
      setSelectedScenario(null);
    }
  };

  const renderContent = () => {
    if (activeTab === 'about') {
      return (
        <AboutScreen
          onBack={() => {
            setActiveTab('home');
            setSelectedScenario(null);
          }}
        />
      );
    }

    if (activeTab === 'home') {
      if (selectedScenario) {
        return (
          <ScenarioScreen
            scenario={selectedScenario}
            onBack={handleBackToScenarios}
            isSaved={isSaved}
            onToggleSave={toggleSave}
            hasVoice={hasVoice}
            onSpeak={speak}
            speakingId={speakingId}
          />
        );
      }
      return (
        <HomeScreen
          onSelectScenario={handleSelectScenario}
          onNavigateSearch={() => handleSelectTab('search')}
          onNavigatePractice={() => handleSelectTab('practice')}
          onNavigateAbout={() => handleSelectTab('about')}
          progress={progress}
          totalRoleplayCompletions={totalRoleplayCompletions}
          scenariosWithQuizDone={scenariosWithQuizDone}
          totalBestQuizPoints={totalBestQuizPoints}
        />
      );
    }

    if (activeTab === 'search') {
      return (
        <SearchScreen
          isSaved={isSaved}
          onToggleSave={toggleSave}
          hasVoice={hasVoice}
          onSpeak={speak}
          speakingId={speakingId}
        />
      );
    }

    if (activeTab === 'saved') {
      return (
        <SavedScreen
          savedPhrases={savedPhrases}
          isSaved={isSaved}
          onToggleSave={toggleSave}
          hasVoice={hasVoice}
          onSpeak={speak}
          speakingId={speakingId}
          onBrowseScenarios={() => {
            setActiveTab('home');
            setSelectedScenario(null);
          }}
        />
      );
    }

    if (activeTab === 'practice') {
      return (
        <PracticeScreen
          getScenarioProgress={getScenarioProgress}
          onCompleteRoleplay={recordRoleplayCompletion}
          onCompleteQuiz={recordQuizScore}
          hasVoice={hasVoice}
          onSpeak={speak}
          speakingId={speakingId}
        />
      );
    }

    return null;
  };

  return (
    <div className="app-viewport">
      <Header
        onOpenAbout={() => handleSelectTab(activeTab === 'about' ? 'home' : 'about')}
        isAboutActive={activeTab === 'about'}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        savedCount={savedPhrases.length}
      />
      <main className="main-content">{renderContent()}</main>
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        savedCount={savedPhrases.length}
      />
    </div>
  );
}

export default App;
