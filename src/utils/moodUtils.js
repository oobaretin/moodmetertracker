/**
 * Mood calculation and utility functions
 */

/**
 * Get quadrant from coordinates
 * @param {number} x - X coordinate (0-450)
 * @param {number} y - Y coordinate (0-450)
 * @returns {string} Quadrant name
 */
export function getQuadrant(x, y) {
  const GRID_SIZE = 450;
  const centerX = GRID_SIZE / 2;
  const centerY = GRID_SIZE / 2;
  
  if (x >= centerX && y < centerY) return 'yellow'; // High energy + Pleasant
  if (x < centerX && y < centerY) return 'red'; // High energy + Unpleasant
  if (x < centerX && y >= centerY) return 'blue'; // Low energy + Unpleasant
  return 'green'; // Low energy + Pleasant
}

/**
 * Calculate energy level from Y coordinate
 * @param {number} y - Y coordinate (0-450)
 * @returns {number} Energy level (0-100)
 */
export function calculateEnergy(y) {
  const GRID_SIZE = 450;
  return Math.round(100 - (y / GRID_SIZE) * 100);
}

/**
 * Calculate pleasantness from X coordinate
 * @param {number} x - X coordinate (0-450)
 * @returns {number} Pleasantness level (0-100)
 */
export function calculatePleasantness(x) {
  const GRID_SIZE = 450;
  return Math.round((x / GRID_SIZE) * 100);
}

/**
 * Get emotion words for quadrant
 * @param {string} quadrant - Quadrant name
 * @returns {Array<string>} Array of emotion words
 */
export function getEmotionWords(quadrant) {
  const emotions = {
    yellow: ['joyful', 'excited', 'energized', 'happy', 'enthusiastic', 'elated', 'thrilled'],
    red: ['angry', 'frustrated', 'anxious', 'stressed', 'irritated', 'overwhelmed', 'agitated'],
    blue: ['sad', 'lonely', 'tired', 'depressed', 'exhausted', 'melancholy', 'down'],
    green: ['calm', 'peaceful', 'relaxed', 'content', 'serene', 'tranquil', 'at ease'],
  };
  return emotions[quadrant] || [];
}

/**
 * Get quadrant color
 * @param {string} quadrant - Quadrant name
 * @returns {string} Color hex code
 */
export function getQuadrantColor(quadrant) {
  const colors = {
    yellow: '#FCD34D',
    red: '#F87171',
    blue: '#60A5FA',
    green: '#34D399',
  };
  return colors[quadrant] || '#9CA3AF';
}

/**
 * Get quadrant label
 * @param {string} quadrant - Quadrant name
 * @returns {string} Label text
 */
export function getQuadrantLabel(quadrant) {
  const labels = {
    yellow: 'High Energy + Pleasant',
    red: 'High Energy + Unpleasant',
    blue: 'Low Energy + Unpleasant',
    green: 'Low Energy + Pleasant',
  };
  return labels[quadrant] || '';
}

/**
 * Get activity options
 * @returns {Array<Object>} Array of activity objects
 */
export function getActivityOptions() {
  return [
    { id: 'work', label: 'Work' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'social', label: 'Social' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'eating', label: 'Eating' },
    { id: 'commute', label: 'Commute' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'other', label: 'Other' },
  ];
}

/**
 * Calculate streak from entries
 * @param {Array} entries - Mood entries
 * @returns {number} Current streak in days
 */
export function calculateStreak(entries) {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dates = new Set(
    sortedEntries.map(e => {
      const date = new Date(e.timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );
  
  let checkDate = new Date(today);
  
  while (dates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  return streak;
}

/**
 * Get badges based on stats
 * @param {Object} stats - User stats
 * @param {number} totalEntries - Total number of entries
 * @returns {Array<string>} Array of badge names
 */
export function getBadges(stats, totalEntries) {
  const badges = [];
  
  if (totalEntries >= 1) badges.push('first-checkin');
  if (stats.streakCount >= 7) badges.push('streak-7');
  if (stats.streakCount >= 30) badges.push('streak-30');
  if (totalEntries >= 100) badges.push('checkins-100');
  
  return badges;
}

