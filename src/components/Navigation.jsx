import { TABS } from '../config/tabs';

export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 min-h-14 py-2 md:min-h-20 md:py-3 lg:min-h-24">
          <button
            type="button"
            onClick={() => onTabChange('track')}
            className="flex items-center gap-2 flex-shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Go to Track mood"
          >
            <img
              src="/images/moodmeter.png"
              alt=""
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain"
            />
            <span className="md:hidden text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[9rem]">
              Mood Meter
            </span>
          </button>
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => {
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
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
