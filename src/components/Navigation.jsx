import { Home, History, TrendingUp, Heart, Settings } from 'lucide-react';

const tabs = [
  { id: 'track', label: 'Track', icon: Home },
  { id: 'history', label: 'History', icon: History },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'insights', label: 'Insights', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          <button
            type="button"
            onClick={() => onTabChange('track')}
            className="flex-shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Go to Track mood"
          >
            <img
              src="/images/moodmeter.png"
              alt=""
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain"
            />
          </button>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 -mb-0.5 scrollbar-thin">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

