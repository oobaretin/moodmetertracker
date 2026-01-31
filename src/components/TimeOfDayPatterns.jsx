/**
 * Time of Day Patterns – split view showing dominant mood for Morning (before 12 PM) and Evening (after 6 PM).
 * Uses mood history entries with timestamp to split by hour and show circadian insight.
 */

const QUADRANT_EMOJIS = { red: '😡', blue: '😔', green: '😌', yellow: '😃' };
const BOX_CLASSES = {
  red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
  yellow: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
};

function getMostFrequent(arr) {
  if (!arr.length) return null;
  const counts = {};
  arr.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function parseTimestamp(entry) {
  const ts = entry.timestamp;
  if (ts == null) return null;
  if (typeof ts === 'number') return ts;
  const parsed = new Date(ts).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export default function TimeOfDayPatterns({ moodHistory = [] }) {
  const withTimestamp = moodHistory.filter((e) => parseTimestamp(e) != null);
  const amMoods = [];
  const pmMoods = [];

  withTimestamp.forEach((entry) => {
    const ts = parseTimestamp(entry);
    if (ts == null) return;
    const hour = new Date(ts).getHours();
    if (hour < 12) amMoods.push(entry.quadrant);
    else if (hour >= 18) pmMoods.push(entry.quadrant);
  });

  const amTop = getMostFrequent(amMoods);
  const pmTop = getMostFrequent(pmMoods);

  let circadianInsight = 'Log at different times to see your rhythm.';
  if (amMoods.length > 2 && pmMoods.length > 2 && amTop && pmTop) {
    if (amTop === pmTop) circadianInsight = 'Your mood is remarkably consistent throughout the day.';
    else if (amTop === 'green' && pmTop === 'red') circadianInsight = "You start calm, but end the day stressed. Consider a wind-down routine.";
    else circadianInsight = 'Your energy shifts significantly from day to night.';
  }

  const renderBox = (slotId, moods, label) => {
    const top = getMostFrequent(moods);
    const isEmpty = !moods.length;
    const emoji = isEmpty ? '--' : (QUADRANT_EMOJIS[top] ?? '--');
    const moodLabel = isEmpty ? 'No data yet' : top;
    const boxClass = isEmpty
      ? 'bg-slate-100 dark:bg-gray-700/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-gray-600'
      : `border ${BOX_CLASSES[top] ?? ''}`;

    return (
      <div id={slotId} className={`mood-summary-box p-4 rounded-xl transition-all duration-300 ${boxClass}`}>
        <span className="mood-emoji block text-3xl mb-1">{emoji}</span>
        <div className="mood-label text-sm font-semibold capitalize">{moodLabel}</div>
      </div>
    );
  };

  return (
    <div className="time-analysis-container mt-8 max-w-2xl mx-auto p-5 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-slate-300 dark:border-gray-600">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Time of Day Patterns</h3>
      <div className="split-view flex gap-4 mt-4">
        <div className="time-slot flex-1 text-center">
          <div className="time-header text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
            ☀️ Morning (Before 12 PM)
          </div>
          {renderBox('am-mood-box', amMoods)}
        </div>
        <div className="time-slot flex-1 text-center">
          <div className="time-header text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
            🌙 Evening (After 6 PM)
          </div>
          {renderBox('pm-mood-box', pmMoods)}
        </div>
      </div>
      <p id="circadian-insight" className="settings-note text-xs text-slate-500 dark:text-slate-400 mt-4 italic text-center">
        {circadianInsight}
      </p>
    </div>
  );
}
