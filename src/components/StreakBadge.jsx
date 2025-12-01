import { Flame, Award } from 'lucide-react';
import { getBadges } from '../utils/moodUtils';

export default function StreakBadge({ streak, totalCheckIns, badges }) {
  const earnedBadges = getBadges({ streakCount: streak }, totalCheckIns);

  const badgeInfo = {
    'first-checkin': { label: 'First Check-in', icon: Award, color: 'bg-blue-500' },
    'streak-7': { label: '7-Day Streak', icon: Flame, color: 'bg-orange-500' },
    'streak-30': { label: '30-Day Streak', icon: Flame, color: 'bg-red-500' },
    'checkins-100': { label: '100 Check-ins', icon: Award, color: 'bg-purple-500' },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-sm mx-auto lg:mx-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {streak} {streak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[60px]">
        {earnedBadges.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Badges Earned
            </p>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map(badgeId => {
                const badge = badgeInfo[badgeId];
                if (!badge) return null;
                const Icon = badge.icon;
                return (
                  <div
                    key={badgeId}
                    className={`flex items-center gap-2 px-3 py-2 ${badge.color} text-white rounded-lg`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Keep tracking to earn badges!
          </div>
        )}
      </div>
    </div>
  );
}

