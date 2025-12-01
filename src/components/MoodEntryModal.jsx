import { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { getEmotionWords, getActivityOptions } from '../utils/moodUtils';

export default function MoodEntryModal({ isOpen, onClose, onSave, initialData }) {
  const [note, setNote] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('');

  // Define handleSave first so it can be used in useEffect
  const handleSave = useCallback(() => {
    if (!initialData) return;
    onSave({
      ...initialData,
      note,
      activities,
      selectedEmotion,
    });
    onClose();
  }, [initialData, note, activities, selectedEmotion, onSave, onClose]);

  useEffect(() => {
    if (initialData) {
      setNote(initialData.note || '');
      setActivities(initialData.activities || []);
      setSelectedEmotion(initialData.selectedEmotion || '');
    } else {
      setNote('');
      setActivities([]);
      setSelectedEmotion('');
    }
  }, [initialData, isOpen]);

  // Handle ESC key to close modal and Cmd/Ctrl+Enter to save
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleEnter = (e) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleEnter);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleEnter);
    };
  }, [isOpen, onClose, handleSave]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      const firstInput = document.querySelector('textarea, input[type="checkbox"]');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emotionWords = initialData?.quadrant ? getEmotionWords(initialData.quadrant) : [];
  const activityOptions = getActivityOptions();

  const handleActivityToggle = (activityId) => {
    setActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const quadrantColors = {
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
    red: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Log Your Mood
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mood Position Preview */}
          {initialData && (
            <div className={`p-4 rounded-lg border-2 ${quadrantColors[initialData.quadrant] || ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {initialData.quadrant.charAt(0).toUpperCase() + initialData.quadrant.slice(1)} Quadrant
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Energy: {initialData.energy}% | Pleasantness: {initialData.pleasantness}%
                </span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Position: ({Math.round(initialData.x)}, {Math.round(initialData.y)})
              </div>
            </div>
          )}

          {/* Emotion Suggestions */}
          {emotionWords.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionWords.map(word => (
                  <button
                    key={word}
                    onClick={() => setSelectedEmotion(selectedEmotion === word ? '' : word)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedEmotion === word
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {note.length} characters
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What were you doing?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activityOptions.map(activity => (
                <label
                  key={activity.id}
                  className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={activities.includes(activity.id)}
                    onChange={() => handleActivityToggle(activity.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Mood
            </button>
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            Press ESC to close • Cmd/Ctrl + Enter to save
          </div>
        </div>
      </div>
    </div>
  );
}

