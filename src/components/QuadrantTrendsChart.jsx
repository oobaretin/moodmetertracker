/**
 * Last 7 Days quadrant trends chart.
 * Counts how many times the user logged each quadrant over the last 7 days.
 * Bars show percentage of total; insight text reflects the most common quadrant.
 */

const QUADRANT_ORDER = ['red', 'blue', 'green', 'yellow'];
const BAR_COLORS = {
  red: 'bg-red-500 dark:bg-red-500',
  blue: 'bg-blue-500 dark:bg-blue-500',
  green: 'bg-green-500 dark:bg-green-500',
  yellow: 'bg-amber-400 dark:bg-amber-400',
};
const INSIGHTS = {
  red: "You've been under quite a bit of stress lately. Remember to use your 'Shift' cards!",
  blue: "You've been feeling low energy. Maybe schedule some light social time?",
  green: "You're in a great state of balance. Keep savoring these calm moments!",
  yellow: "You're on a roll! Use this high energy for your creative projects.",
};

function parseTimestamp(entry) {
  const ts = entry.timestamp;
  if (ts == null) return 0;
  if (typeof ts === 'number') return ts;
  const parsed = new Date(ts).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function QuadrantTrendsChart({ entries }) {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const sevenDaysAgo = Date.now() - sevenDaysMs;

  const recent = (entries || []).filter((e) => parseTimestamp(e) > sevenDaysAgo);
  const total = recent.length;

  const counts = { red: 0, blue: 0, green: 0, yellow: 0 };
  recent.forEach((e) => {
    if (e.quadrant && counts[e.quadrant] !== undefined) counts[e.quadrant]++;
  });

  const percentages = {};
  QUADRANT_ORDER.forEach((q) => {
    percentages[q] = total > 0 ? (counts[q] / total) * 100 : 0;
  });

  const topMood = total > 0
    ? QUADRANT_ORDER.reduce((a, b) => (counts[a] >= counts[b] ? a : b))
    : null;
  const insightText = topMood ? INSIGHTS[topMood] : 'Start logging to see your patterns!';

  return (
    <div className="trends-container mt-8 max-w-2xl mx-auto p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Last 7 Days</h3>
      <div className="chart-bars flex justify-around items-end h-[150px] my-5 border-b-2 border-gray-200 dark:border-gray-600">
        {QUADRANT_ORDER.map((quadrant) => (
          <div key={quadrant} className="bar-group flex flex-col items-center w-[20%]">
            <div
              id={`bar-${quadrant}`}
              className={`bar ${BAR_COLORS[quadrant]} w-full rounded-t-lg min-h-[5px] transition-all duration-[0.8s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]`}
              style={{
                height: `${percentages[quadrant]}%`,
                minHeight: total > 0 ? 5 : 0,
              }}
              role="img"
              aria-label={`${quadrant}: ${counts[quadrant]} logs`}
            />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 capitalize">
              {quadrant}
            </span>
          </div>
        ))}
      </div>
      <p id="trend-insight" className="text-sm text-slate-600 dark:text-slate-400 italic">
        {insightText}
      </p>
    </div>
  );
}
