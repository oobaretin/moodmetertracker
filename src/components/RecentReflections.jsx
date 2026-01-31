/**
 * Recent Reflections – mini-journal feed showing the last 3 mood history entries.
 * Card look with quadrant-colored left border; shows note or fallback "Logged a {quadrant} mood."
 */

const BORDER_CLASSES = {
  red: 'border-l-red-500 dark:border-l-red-500',
  blue: 'border-l-blue-500 dark:border-l-blue-500',
  green: 'border-l-green-500 dark:border-l-green-500',
  yellow: 'border-l-amber-400 dark:border-l-amber-400',
};

function getTimeStr(entry) {
  const ts = entry.timestamp;
  if (ts != null) {
    const t = typeof ts === 'number' ? ts : new Date(ts).getTime();
    if (!Number.isNaN(t)) return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return entry.time ?? '—';
}

export default function RecentReflections({ moodHistory = [] }) {
  const latest = moodHistory.length === 0 ? [] : [...moodHistory].slice(-3).reverse();

  return (
    <div className="recent-notes-container mt-8 max-w-2xl mx-auto text-left">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reflections</h3>
      <div id="notesFeed" className="space-y-3">
        {latest.length === 0 ? (
          <p className="empty-msg text-sm text-slate-400 dark:text-slate-500 text-center py-5">
            Your recent reflections will appear here.
          </p>
        ) : (
          latest.map((item, index) => {
            const displayNote =
              item.note && String(item.note).trim() !== ''
                ? item.note
                : `Logged a ${item.quadrant ?? 'mood'} mood.`;
            const timeStr = getTimeStr(item);
            const borderClass = BORDER_CLASSES[item.quadrant] ?? 'border-l-slate-300 dark:border-l-gray-600';

            return (
              <div
                key={`${item.date}-${item.time}-${index}`}
                className={`note-card bg-white dark:bg-gray-800 border-l-4 ${borderClass} py-3 px-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700`}
              >
                <div className="note-header flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                  <span>{item.quadrant ?? 'mood'} mood</span>
                  <span>{timeStr}</span>
                </div>
                <div className="note-body text-sm text-slate-800 dark:text-slate-200 leading-snug italic">
                  &ldquo;{displayNote}&rdquo;
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
