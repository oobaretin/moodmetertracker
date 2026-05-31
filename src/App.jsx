import { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import BottomNavigation from './components/BottomNavigation';
import PageHeader from './components/PageHeader';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingOverlay from './components/OnboardingOverlay';
import MoodGrid from './components/MoodGrid';
import MoodEntryModal from './components/MoodEntryModal';
import MoodPromptModal from './components/MoodPromptModal';
import ShiftCard from './components/ShiftCard';
import MoodHistory from './components/MoodHistory';
import Analytics from './components/Analytics';
import MoodRegulation from './components/MoodRegulation';
import Settings from './components/Settings';
import FloatingCheckIn from './components/FloatingCheckIn';
import StreakBadge from './components/StreakBadge';
import QuickMoodButtons from './components/QuickMoodButtons';
import QuadrantTrendsChart from './components/QuadrantTrendsChart';
import TimeOfDayPatterns from './components/TimeOfDayPatterns';
import RecentReflections from './components/RecentReflections';
import Footer from './components/Footer';
import { ToastContainer } from './components/Toast';
import BottomToast from './components/BottomToast';
import Celebration from './components/Celebration';
import {
  getMoodEntries,
  saveMoodEntry,
  updateMoodEntry,
  getUserPreferences,
  getUserStats,
  updateUserStats,
  hasSeenWelcome,
  markWelcomeSeen,
  hasSeenOnboarding,
  markOnboardingSeen,
  getLastMood,
  setLastMood,
  clearLastMood,
  getMoodHistory,
  addToMoodHistory,
  updateLastMoodHistoryNote,
  saveUserPreferences,
} from './utils/storage';
import { calculateStreak, getBadges } from './utils/moodUtils';
import { TAB_IDS, getTabMeta } from './config/tabs';

const APP_NAME = 'Mood Meter Tracker';

function getTabFromHash() {
  const hash = window.location.hash.replace('#', '');
  return TAB_IDS.includes(hash) ? hash : 'track';
}

function App() {
  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [entries, setEntries] = useState([]);
  const [preferences, setPreferences] = useState(getUserPreferences());
  const [stats, setStats] = useState(getUserStats());
  const [showWelcome, setShowWelcome] = useState(!hasSeenWelcome());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [bottomToastMessage, setBottomToastMessage] = useState(null);
  const [celebration, setCelebration] = useState({ show: false, message: '' });
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [promptQuadrant, setPromptQuadrant] = useState(null);
  const [showShiftCard, setShowShiftCard] = useState(false);
  const [shiftCardQuadrant, setShiftCardQuadrant] = useState(null);
  const [selectionDotPosition, setSelectionDotPosition] = useState(null);
  const [snappedEmotionWord, setSnappedEmotionWord] = useState(null);
  const [moodHistoryList, setMoodHistoryList] = useState(() => getMoodHistory());
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding());

  const loadEntries = useCallback(() => {
    const loadedEntries = getMoodEntries();
    setEntries(loadedEntries);
  }, []);

  // Sync tab with URL hash (matches public/sitemap.xml routes)
  useEffect(() => {
    const onHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (showWelcome) return;
    const nextHash = `#${activeTab}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
  }, [activeTab, showWelcome]);

  const tabMeta = getTabMeta(activeTab);

  useEffect(() => {
    if (showWelcome) {
      document.title = `Welcome · ${APP_NAME}`;
      return;
    }
    document.title = `${tabMeta.documentTitle} · ${APP_NAME}`;
  }, [showWelcome, tabMeta.documentTitle]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load entries and mood history on mount
  useEffect(() => {
    loadEntries();
    setMoodHistoryList(getMoodHistory());
  }, [loadEntries]);

  // Restore last mood dot if saved within last 24 hours
  useEffect(() => {
    const saved = getLastMood();
    if (!saved || saved.x == null || saved.y == null) return;
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (Date.now() - (saved.timestamp || 0) < oneDayMs) {
      setSelectionDotPosition({ x: saved.x, y: saved.y });
    }
  }, []);

  // Ensure welcome state is synced with storage on mount
  useEffect(() => {
    const hasSeen = hasSeenWelcome();
    if (hasSeen) {
      setShowWelcome(false);
    }
  }, []);

  // Sync onboarding visibility with storage
  useEffect(() => {
    if (hasSeenOnboarding()) {
      setShowOnboarding(false);
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  // Update stats when entries change
  useEffect(() => {
    const streak = calculateStreak(entries);
    const updatedStats = {
      streakCount: streak,
      totalCheckIns: entries.length,
      lastCheckIn: entries.length > 0 ? entries[entries.length - 1].timestamp : null,
      badges: getBadges({ streakCount: streak }, entries.length),
    };
    setStats(updatedStats);
    updateUserStats(updatedStats);
  }, [entries]);

  const handleMoodSelect = useCallback((moodData) => {
    setSelectedMood(moodData);
    setSelectionDotPosition({ x: moodData.x, y: moodData.y });
    setSnappedEmotionWord(moodData.snappedWord ?? null);
    setLastMood({ x: moodData.x, y: moodData.y, timestamp: Date.now() });
    setEditingEntry(null);
    setModalOpen(true);
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleSaveMood = useCallback((moodData) => {
    if (editingEntry) {
      const updated = updateMoodEntry(editingEntry.id, moodData);
      if (updated) {
        loadEntries();
        addToast('Mood entry updated successfully!', 'success');
      } else {
        addToast('Failed to update mood entry', 'error');
      }
    } else {
      saveMoodEntry(moodData);
      addToMoodHistory({ quadrant: moodData.quadrant });
      setMoodHistoryList(getMoodHistory());
      loadEntries();
      setBottomToastMessage('Mood saved · stay mindful ✨');

      if (!preferences.skipMoodPrompt) {
        setTimeout(() => {
          setPromptQuadrant(moodData.quadrant);
          setShowMoodPrompt(true);
        }, 400);
      }

      const newStreak = calculateStreak([...entries, moodData]);
      if (newStreak === 7) {
        setTimeout(() => {
          setCelebration({ show: true, message: '🔥 7-Day Streak!' });
        }, 600);
      }
    }
    setModalOpen(false);
    setSelectedMood(null);
    setEditingEntry(null);
  }, [editingEntry, loadEntries, entries, addToast, preferences.skipMoodPrompt]);

  const handleSkipMoodPromptsForever = useCallback(() => {
    const updated = { ...preferences, skipMoodPrompt: true };
    saveUserPreferences(updated);
    setPreferences(updated);
    setShowMoodPrompt(false);
    setPromptQuadrant(null);
  }, [preferences]);

  const handleEditEntry = useCallback((entry) => {
    setEditingEntry(entry);
    setSelectedMood({
      x: entry.x,
      y: entry.y,
      quadrant: entry.quadrant,
      energy: entry.energy,
      pleasantness: entry.pleasantness,
    });
    setModalOpen(true);
  }, []);

  const handlePreferencesChange = useCallback((newPreferences) => {
    setPreferences(newPreferences);
  }, []);

  const handleGetStarted = useCallback(() => {
    markWelcomeSeen();
    setShowWelcome(false);
    setActiveTab('track');
    window.location.hash = '#track';
  }, []);

  const handleCloseOnboarding = useCallback(() => {
    markOnboardingSeen();
    setShowOnboarding(false);
  }, []);

  const handleResetSelection = useCallback(() => {
    setSelectionDotPosition(null);
    setShowShiftCard(false);
    setShiftCardQuadrant(null);
    setSnappedEmotionWord(null);
    setSelectedMood(null);
    setModalOpen(false);
    clearLastMood();
  }, []);

  const lastMoodQuadrant = entries.length > 0 ? entries[entries.length - 1].quadrant : null;

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {showOnboarding && <OnboardingOverlay onClose={handleCloseOnboarding} />}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1 pb-24 md:pb-8">
        <PageHeader title={tabMeta.pageTitle} description={tabMeta.pageDescription} />
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
              <div className="w-full lg:w-auto lg:flex-shrink-0 flex flex-col items-center gap-4">
                <MoodGrid
                  onMoodSelect={handleMoodSelect}
                  selectedPosition={selectedMood}
                  selectionDotPosition={selectionDotPosition}
                  snappedEmotionWord={snappedEmotionWord}
                  onResetSelection={handleResetSelection}
                />
                <QuickMoodButtons onMoodSelect={handleMoodSelect} />
              </div>
              <div className="w-full lg:w-80 lg:flex-shrink-0 flex justify-center lg:justify-start lg:pt-8">
                <StreakBadge
                  streak={stats.streakCount}
                  totalCheckIns={entries.length}
                  badges={stats.badges}
                />
              </div>
            </div>
            <QuadrantTrendsChart entries={entries} />
            <RecentReflections moodHistory={moodHistoryList} />
            <TimeOfDayPatterns moodHistory={moodHistoryList} />
            {moodHistoryList.length > 0 && (
              <div className="mt-8 max-w-2xl mx-auto">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent check-ins</h3>
                <ul className="flex flex-wrap gap-2">
                  {[...moodHistoryList].reverse().map((entry, index) => (
                    <li
                      key={`${entry.date}-${entry.time}-${index}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300"
                    >
                      <span className={`capitalize font-medium ${
                        entry.quadrant === 'red' ? 'text-red-600 dark:text-red-400' :
                        entry.quadrant === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        entry.quadrant === 'yellow' ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {entry.quadrant}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{entry.time}</span>
                      <span className="text-gray-400 dark:text-gray-500">{entry.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <MoodHistory entries={entries} onEdit={handleEditEntry} onDelete={loadEntries} onRefresh={loadEntries} />
        )}

        {activeTab === 'analytics' && <Analytics entries={entries} />}
        {activeTab === 'insights' && <MoodRegulation lastMoodQuadrant={lastMoodQuadrant} />}
        {activeTab === 'settings' && (
          <Settings
            onPreferencesChange={handlePreferencesChange}
            onDataChange={loadEntries}
            onClearAllMoodData={() => {
              setSelectionDotPosition(null);
              setMoodHistoryList(getMoodHistory());
              loadEntries();
            }}
          />
        )}
      </main>

      {activeTab !== 'track' && (
        <FloatingCheckIn
          onClick={() => handleTabChange('track')}
          className="bottom-20 md:bottom-6"
        />
      )}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <MoodEntryModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedMood(null); setEditingEntry(null); }} onSave={handleSaveMood} initialData={editingEntry || selectedMood} />
      <MoodPromptModal
        isOpen={showMoodPrompt}
        quadrant={promptQuadrant}
        onClose={() => { setShowMoodPrompt(false); setPromptQuadrant(null); }}
        onYesHelpShift={(q) => { setShiftCardQuadrant(q); setShowShiftCard(true); }}
        onSkipPromptsForever={handleSkipMoodPromptsForever}
      />
      
      <ShiftCard
        isOpen={showShiftCard}
        quadrant={shiftCardQuadrant}
        moodHistory={moodHistoryList}
        initialNote={snappedEmotionWord ? `Feeling ${snappedEmotionWord}. ` : ''}
        onClose={() => {
          setShowShiftCard(false);
          setShiftCardQuadrant(null);
          setSnappedEmotionWord(null);
          setSelectionDotPosition(null);
        }}
        onSaveNote={(note) => {
          updateLastMoodHistoryNote(note);
          setMoodHistoryList(getMoodHistory());
        }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {bottomToastMessage && <BottomToast message={bottomToastMessage} onHide={() => setBottomToastMessage(null)} duration={3000} />}
      <Celebration show={celebration.show} message={celebration.message} onComplete={() => setCelebration({ show: false, message: '' })} />
      <div className="mb-20 md:mb-0">
        <Footer onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export default App;