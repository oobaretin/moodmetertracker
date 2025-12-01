import { Calendar, TrendingUp, Heart, Search } from 'lucide-react';

export default function EmptyState({ type, onAction, actionLabel }) {
  const configs = {
    history: {
      icon: Calendar,
      title: 'No mood entries yet',
      description: 'Start tracking your mood to see your history here',
      actionLabel: 'Log Your First Mood',
    },
    analytics: {
      icon: TrendingUp,
      title: 'No data yet',
      description: 'Start tracking your mood to see analytics and insights',
      actionLabel: 'Start Tracking',
    },
    insights: {
      icon: Heart,
      title: 'No insights yet',
      description: 'Log some moods to get personalized insights and coping suggestions',
      actionLabel: 'Log Your Mood',
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your filters or search terms',
      actionLabel: 'Clear Filters',
    },
  };

  const config = configs[type] || configs.history;
  const Icon = config.icon;

  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {config.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {config.description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {actionLabel || config.actionLabel}
        </button>
      )}
    </div>
  );
}

