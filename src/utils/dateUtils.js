import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp) {
  const date = parseISO(timestamp);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format date for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date
 */
export function formatDate(timestamp) {
  const date = parseISO(timestamp);
  return format(date, 'MMM d, yyyy');
}

/**
 * Get time of day category
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Time category
 */
export function getTimeOfDay(timestamp) {
  const date = parseISO(timestamp);
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Get date key for grouping
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Date key (YYYY-MM-DD)
 */
export function getDateKey(timestamp) {
  const date = parseISO(timestamp);
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get date range for filtering
 * @param {number} days - Number of days
 * @returns {Object} Start and end dates
 */
export function getDateRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}


