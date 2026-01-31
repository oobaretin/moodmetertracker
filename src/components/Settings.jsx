import { useState, useEffect, useRef } from 'react';
import { Download, Upload, Trash2, Moon, Sun, Bell } from 'lucide-react';
import { getUserPreferences, saveUserPreferences, clearAllMoodData, getMoodEntries, getMoodHistory } from '../utils/storage';
import { exportToCSV, exportToJSON, importFromJSON } from '../utils/exportUtils';

const CLEAR_RESET_MS = 3000;

export default function Settings({ onPreferencesChange, onDataChange, onClearAllMoodData }) {
  const [preferences, setPreferences] = useState(getUserPreferences());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clearStage, setClearStage] = useState(0);
  const clearTimerRef = useRef(null);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    const prefs = getUserPreferences();
    setPreferences(prefs);
  }, []);

  const handlePreferenceChange = (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    saveUserPreferences(updated);
    onPreferencesChange(updated);
  };

  const handleExportCSV = () => {
    const entries = getMoodEntries();
    exportToCSV(entries);
  };

  const handleExportJSON = () => {
    const entries = getMoodEntries();
    exportToJSON(entries);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportError('');
    importFromJSON(file)
      .then(entries => {
        // Merge with existing entries
        const existing = getMoodEntries();
        const merged = [...existing, ...entries];
        // Save imported entries (in a real app, you'd want to deduplicate)
        window.storage.setItem('mood-entries', JSON.stringify(merged));
        onDataChange();
        alert(`Successfully imported ${entries.length} entries`);
        e.target.value = ''; // Reset file input
      })
      .catch(error => {
        setImportError(error.message || 'Failed to import file');
        e.target.value = '';
      });
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you absolutely sure? This will delete ALL your mood entries and cannot be undone.')) {
      clearAllMoodData();
      onClearAllMoodData?.();
      onDataChange();
      setShowDeleteConfirm(false);
      alert('All data has been deleted');
    }
  };

  const resetClearButton = () => {
    setClearStage(0);
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  };

  const confirmClearData = () => {
    if (clearStage === 0) {
      setClearStage(1);
      clearTimerRef.current = setTimeout(resetClearButton, CLEAR_RESET_MS);
    } else {
      clearAllMoodData();
      onClearAllMoodData?.();
      onDataChange();
      resetClearButton();
      alert('All data has been successfully deleted.');
    }
  };

  const getQuadrantDescription = (q) => {
    const desc = {
      red: 'High Energy / Unpleasant',
      yellow: 'High Energy / Pleasant',
      blue: 'Low Energy / Unpleasant',
      green: 'Low Energy / Pleasant',
    };
    return desc[q] ?? 'Unknown';
  };

  const downloadMoodHistory = () => {
    const history = getMoodHistory();
    if (history.length === 0) {
      alert('No data found to download. Start logging your mood first!');
      return;
    }
    const escapeCsv = (s) => (s == null ? '' : `"${String(s).replace(/"/g, '""')}"`);
    let csvContent = 'Date,Time,Quadrant,Energy/Pleasantness,Note\n';
    history.forEach((item) => {
      const date = item.date ?? '';
      const time = item.time ?? '';
      const quadrant = item.quadrant ?? '';
      const quadrantInfo = getQuadrantDescription(quadrant);
      const note = item.note != null ? String(item.note).replace(/,/g, ' ') : '';
      csvContent += `${escapeCsv(date)},${escapeCsv(time)},${escapeCsv(quadrant)},${escapeCsv(quadrantInfo)},${escapeCsv(note)}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `my_mood_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              {preferences.darkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-gray-900 dark:text-white">Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative"></div>
            </label>
          </label>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Reminders
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">Enable Daily Reminder</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.dailyReminder}
                onChange={(e) => handlePreferenceChange('dailyReminder', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative"></div>
            </label>
          </label>
          {preferences.dailyReminder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                value={preferences.reminderTime}
                onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacy
        </h3>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-900 dark:text-white">Privacy Mode (Hide notes in preview)</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.privacyMode}
              onChange={(e) => handlePreferenceChange('privacyMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 relative"></div>
          </label>
        </label>
      </div>

      {/* Goals */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Goal
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Check-ins per day
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={preferences.dailyGoal}
            onChange={(e) => handlePreferenceChange('dailyGoal', parseInt(e.target.value) || 1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-32"
          />
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Data
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export as JSON
          </button>
        </div>
      </div>

      {/* Data Import */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Import Data
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import from JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
          {importError && (
            <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
          )}
        </div>
      </div>

      {/* Delete All Data - two-step confirm */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-red-200 dark:border-red-900/30">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
          Danger Zone
        </h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Data
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete all your mood entries? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Management: Download CSV + Clear All Mood Data */}
      <div className="settings-section mt-10 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
        <div className="data-actions flex flex-wrap justify-center gap-3 mb-4">
          <button
            id="downloadBtn"
            type="button"
            onClick={downloadMoodHistory}
            className="secondary-btn flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 bg-slate-100 dark:bg-gray-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-gray-600 hover:bg-slate-200 dark:hover:bg-gray-600"
          >
            <Download className="w-4 h-4" />
            Download My History (CSV)
          </button>
          <button
            id="clearDataBtn"
            type="button"
            onClick={confirmClearData}
            className={`danger-btn w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-200 border-2 ${
              clearStage === 1
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                : 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            {clearStage === 0 ? 'Clear All Mood Data' : 'Are you sure? Click again to wipe data.'}
          </button>
        </div>
        <p className="settings-note text-xs text-slate-400 dark:text-slate-500">
          CSV opens in Excel or Google Sheets. Clearing data permanently deletes your history and resets trends.
        </p>
      </div>
    </div>
  );
}

