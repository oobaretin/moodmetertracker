/**
 * Window Storage API wrapper for persistent data storage
 * Uses window.storage API instead of localStorage
 */

/**
 * Initialize window.storage if not available
 * Custom storage implementation using window.storage API
 * This provides a Storage-like interface that can be backed by any persistence mechanism
 */
if (typeof window.storage === 'undefined') {
  window.storage = {
    _data: {},
    
    setItem(key, value) {
      this._data[key] = value;
      // In a production environment, this could be backed by:
      // - IndexedDB for client-side persistence
      // - Server-side storage via API calls
      // - Custom storage solution
    },
    
    getItem(key) {
      return this._data[key] || null;
    },
    
    removeItem(key) {
      delete this._data[key];
    },
    
    clear() {
      this._data = {};
    }
  };
}

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  MOOD_ENTRIES: 'mood-entries',
  USER_PREFERENCES: 'user-preferences',
  USER_STATS: 'user-stats',
  HAS_SEEN_WELCOME: 'has-seen-welcome',
  LAST_MOOD: 'lastMood',
  MOOD_HISTORY: 'moodHistory',
};

/**
 * Get item from storage
 * @param {string} key - Storage key
 * @returns {any} Parsed value or null
 */
export function getStorageItem(key) {
  try {
    const item = window.storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return null;
  }
}

/**
 * Set item in storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export function setStorageItem(key, value) {
  try {
    window.storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to storage (${key}):`, error);
    throw error;
  }
}

/**
 * Remove item from storage
 * @param {string} key - Storage key
 */
export function removeStorageItem(key) {
  try {
    window.storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
  }
}

/**
 * Clear all storage
 */
export function clearAllStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      window.storage.removeItem(key);
    });
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.LAST_MOOD);
      localStorage.removeItem(STORAGE_KEYS.MOOD_HISTORY);
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

/**
 * Last mood (selection dot) – persisted in localStorage so it restores on return.
 * @returns {{ x: number, y: number, timestamp: number } | null}
 */
export function getLastMood() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_MOOD);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Save last mood position for restore on next visit.
 * @param {{ x: number, y: number, timestamp?: number }} entry - Pixel coords (0–GRID_SIZE) and optional timestamp
 */
export function setLastMood(entry) {
  try {
    if (typeof localStorage === 'undefined') return;
    const moodEntry = {
      x: entry.x,
      y: entry.y,
      timestamp: entry.timestamp ?? Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.LAST_MOOD, JSON.stringify(moodEntry));
  } catch (error) {
    console.error('Error saving last mood:', error);
  }
}

const MOOD_HISTORY_MAX = 10;

/**
 * Mood history (recent check-ins) – persisted in localStorage.
 * @returns {Array<{ quadrant: string, time: string, date: string }>}
 */
export function getMoodHistory() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.MOOD_HISTORY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (error) {
    return [];
  }
}

/**
 * Append one entry to mood history; keeps only the last MOOD_HISTORY_MAX.
 * @param {{ quadrant: string, time?: string, date?: string }} entry
 */
export function addToMoodHistory(entry) {
  try {
    if (typeof localStorage === 'undefined') return;
    const history = getMoodHistory();
    const newEntry = {
      quadrant: entry.quadrant,
      time: entry.time ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: entry.date ?? new Date().toLocaleDateString(),
      timestamp: entry.timestamp ?? Date.now(),
    };
    history.push(newEntry);
    if (history.length > MOOD_HISTORY_MAX) history.shift();
    localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving mood history:', error);
  }
}

/**
 * Update the most recent mood history entry with an optional note (e.g. from Shift Card).
 * @param {string} note - Note text to attach to the last entry
 */
export function updateLastMoodHistoryNote(note) {
  try {
    if (typeof localStorage === 'undefined') return;
    const history = getMoodHistory();
    if (history.length === 0) return;
    history[history.length - 1] = { ...history[history.length - 1], note: note || '' };
    localStorage.setItem(STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error updating mood history note:', error);
  }
}

/**
 * Get all mood entries
 * @returns {Array} Array of mood entries
 */
export function getMoodEntries() {
  return getStorageItem(STORAGE_KEYS.MOOD_ENTRIES) || [];
}

/**
 * Save mood entry
 * @param {Object} entry - Mood entry object
 * @returns {Object} Saved entry with ID
 */
export function saveMoodEntry(entry) {
  const entries = getMoodEntries();
  const newEntry = {
    ...entry,
    id: entry.id || `mood-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
  };
  entries.push(newEntry);
  setStorageItem(STORAGE_KEYS.MOOD_ENTRIES, entries);
  return newEntry;
}

/**
 * Update mood entry
 * @param {string} id - Entry ID
 * @param {Object} updates - Updates to apply
 * @returns {Object|null} Updated entry or null
 */
export function updateMoodEntry(id, updates) {
  const entries = getMoodEntries();
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  entries[index] = { ...entries[index], ...updates };
  setStorageItem(STORAGE_KEYS.MOOD_ENTRIES, entries);
  return entries[index];
}

/**
 * Delete mood entry
 * @param {string} id - Entry ID
 * @returns {boolean} Success status
 */
export function deleteMoodEntry(id) {
  const entries = getMoodEntries();
  const filtered = entries.filter(e => e.id !== id);
  setStorageItem(STORAGE_KEYS.MOOD_ENTRIES, filtered);
  return filtered.length < entries.length;
}

/**
 * Delete all mood entries
 */
export function deleteAllMoodEntries() {
  setStorageItem(STORAGE_KEYS.MOOD_ENTRIES, []);
}

/**
 * Clear all mood-related data: entries, last mood dot, mood history.
 * Does not clear user preferences or stats.
 */
export function clearAllMoodData() {
  deleteAllMoodEntries();
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.LAST_MOOD);
    localStorage.removeItem(STORAGE_KEYS.MOOD_HISTORY);
  }
}

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export function getUserPreferences() {
  return getStorageItem(STORAGE_KEYS.USER_PREFERENCES) || {
    darkMode: false,
    dailyReminder: false,
    reminderTime: '09:00',
    privacyMode: false,
    customTags: [],
    dailyGoal: 1,
  };
}

/**
 * Save user preferences
 * @param {Object} preferences - Preferences object
 */
export function saveUserPreferences(preferences) {
  setStorageItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
}

/**
 * Get user stats
 * @returns {Object} User statistics
 */
export function getUserStats() {
  return getStorageItem(STORAGE_KEYS.USER_STATS) || {
    streakCount: 0,
    lastCheckIn: null,
    totalCheckIns: 0,
    badges: [],
  };
}

/**
 * Update user stats
 * @param {Object} stats - Stats updates
 */
export function updateUserStats(stats) {
  const currentStats = getUserStats();
  const updated = { ...currentStats, ...stats };
  setStorageItem(STORAGE_KEYS.USER_STATS, updated);
  return updated;
}

/**
 * Check if user has seen welcome screen
 * @returns {boolean}
 */
export function hasSeenWelcome() {
  return getStorageItem(STORAGE_KEYS.HAS_SEEN_WELCOME) || false;
}

/**
 * Mark welcome screen as seen
 */
export function markWelcomeSeen() {
  setStorageItem(STORAGE_KEYS.HAS_SEEN_WELCOME, true);
}

