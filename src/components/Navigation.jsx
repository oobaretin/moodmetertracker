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
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Mood Meter Tracker
            </h1>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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

