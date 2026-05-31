import { ArrowRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { getQuadrantColor, getQuadrantLabel } from '../utils/moodUtils';

function formatWhenLogged(timestamp) {
  const date =
    typeof timestamp === 'number'
      ? new Date(timestamp)
      : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 24) return formatDistanceToNow(date, { addSuffix: true });
  return format(date, 'MMM d, h:mm a');
}

function getLatestEntry(entries) {
  if (!entries?.length) return null;
  return [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
}

const QUADRANT_TEXT = {
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  yellow: 'text-amber-600 dark:text-amber-400',
  green: 'text-emerald-600 dark:text-emerald-400',
};

export default function LastLoggedBanner({ entries, onGoInsights }) {
  const latest = getLatestEntry(entries);
  if (!latest?.timestamp) return null;

  const quadrant = latest.quadrant;
  const label = getQuadrantLabel(quadrant) || quadrant;
  const emotion = latest.selectedEmotion || latest.snappedWord;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      style={{ borderLeftWidth: 4, borderLeftColor: getQuadrantColor(quadrant) }}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Last logged
        </p>
        <p className="mt-0.5 text-sm sm:text-base text-gray-900 dark:text-white">
          <span className={`font-semibold capitalize ${QUADRANT_TEXT[quadrant] || ''}`}>
            {label}
          </span>
          {emotion && (
            <span className="text-gray-600 dark:text-gray-400"> · {emotion}</span>
          )}
          <span className="text-gray-500 dark:text-gray-400"> — {formatWhenLogged(latest.timestamp)}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onGoInsights}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors shrink-0"
      >
        Regulation tools
        <ArrowRight className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
