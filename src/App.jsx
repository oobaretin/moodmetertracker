import { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
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
} from './utils/storage';
import { calculateStreak, getBadges } from './utils/moodUtils';

function App() {
  const [activeTab, setActiveTab] = useState('track');
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

  // Load entries and mood history on mount
  useEffect(() => {
    loadEntries();
    setMoodHistoryList(getMoodHistory());
  }, []);

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

  // Sync onboarding visibility with storage (e.g. returning user)
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

  const loadEntries = useCallback(() => {
    const loadedEntries = getMoodEntries();
    setEntries(loadedEntries);
  }, []);

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
      addToast('Mood logged successfully! 🎉', 'success');
      setBottomToastMessage('Moment captured. Stay mindful! ✨');
      // Show contextual mood prompt after a short delay so entry modal closes first
      setTimeout(() => {
        setPromptQuadrant(moodData.quadrant);
        setShowMoodPrompt(true);
      }, 350);
      // Check for streak milestones
      const newStreak = calculateStreak([...entries, moodData]);
      if (newStreak === 7) {
        setTimeout(() => {
          setCelebration({ show: true, message: '🔥 7-Day Streak!' });
          addToast('🔥 7-day streak! Keep it up!', 'success');
        }, 500);
      } else if (newStreak === 30) {
        setTimeout(() => {
          setCelebration({ show: true, message: '🌟 30-Day Streak!' });
          addToast('🌟 Amazing! 30-day streak achieved!', 'success');
        }, 500);
      }
      // Check for total check-ins milestone
      if (entries.length + 1 === 100) {
        setTimeout(() => {
          setCelebration({ show: true, message: '🏆 100 Check-ins!' });
        }, 500);
      }
    }
    setModalOpen(false);
    setSelectedMood(null);
    setEditingEntry(null);
  }, [editingEntry, loadEntries, entries, addToast]);

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
    try {
      // Mark as seen first
      markWelcomeSeen();
      // Update state - use functional updates to ensure they happen
      setShowWelcome(false);
      setActiveTab('track');
    } catch (error) {
      console.error('Error in handleGetStarted:', error);
      // Fallback: just hide welcome screen
      setShowWelcome(false);
      setActiveTab('track');
    }
  }, []);

  const lastMoodQuadrant = entries.length > 0 ? entries[entries.length - 1].quadrant : null;

  // Show welcome screen if not seen
  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

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

  // Main app content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {showOnboarding && (
        <OnboardingOverlay onClose={handleCloseOnboarding} />
      )}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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

        {!activeTab && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        )}

        {activeTab === 'history' && (
          <MoodHistory
            entries={entries}
            onEdit={handleEditEntry}
            onDelete={loadEntries}
            onRefresh={loadEntries}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics entries={entries} />
        )}

        {activeTab === 'insights' && (
          <MoodRegulation lastMoodQuadrant={lastMoodQuadrant} />
        )}

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

      <FloatingCheckIn onClick={() => setActiveTab('track')} />

      <MoodEntryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMood(null);
          setEditingEntry(null);
        }}
        onSave={handleSaveMood}
        initialData={editingEntry || selectedMood}
      />

      <MoodPromptModal
        isOpen={showMoodPrompt}
        quadrant={promptQuadrant}
        onClose={() => {
          setShowMoodPrompt(false);
          setPromptQuadrant(null);
        }}
        onYesHelpShift={(quadrant) => {
          setShiftCardQuadrant(quadrant);
          setShowShiftCard(true);
        }}
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
          setSelectionDotPosition(null); /* Remove dot when shift card is closed */
        }}
        onSaveNote={(note) => {
          updateLastMoodHistoryNote(note);
          setMoodHistoryList(getMoodHistory());
        }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Bottom-center toast: slides up on mood logged, auto-hides after 3s */}
      {bottomToastMessage && (
        <BottomToast
          message={bottomToastMessage}
          onHide={() => setBottomToastMessage(null)}
          duration={3000}
        />
      )}

      <Celebration
        show={celebration.show}
        message={celebration.message}
        onComplete={() => setCelebration({ show: false, message: '' })}
      />

      <Footer onTabChange={setActiveTab} />
    </div>
  );
}

export default App;

