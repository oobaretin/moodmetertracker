import { Heart, Github, Mail } from 'lucide-react';

export default function Footer({ onTabChange }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mood Meter Tracker
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your emotional well-being with precision and gain valuable insights 
              into your mood patterns over time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleLinkClick('track')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Track Mood
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('history')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  History
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('analytics')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('insights')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleLinkClick('settings')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  Settings
                </button>
              </li>
              <li>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Based on Yale Center for Emotional Intelligence
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              <span>
                Made with care for your emotional well-being
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:support@moodtracker.com"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Mood Meter Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

