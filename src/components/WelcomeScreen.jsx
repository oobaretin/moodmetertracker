import { Sparkles, TrendingUp, BarChart3, Heart } from 'lucide-react';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Mood Meter Tracker
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Track your emotional well-being with precision and insight
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Click on the Mood Grid
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The grid has two axes: Energy (vertical) and Pleasantness (horizontal). 
                    Click anywhere that represents how you're feeling right now.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Add Context
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Optionally add a note, select activities you were doing, and choose an emotion word 
                    that best describes your feeling.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Track & Analyze
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    View your mood history, discover patterns, and get insights about your emotional 
                    well-being over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              The Four Quadrants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                  🟡 High Energy + Pleasant
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  Joyful, excited, energized, happy
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                  🔴 High Energy + Unpleasant
                </h3>
                <p className="text-sm text-red-800 dark:text-red-400">
                  Angry, frustrated, anxious, stressed
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  🔵 Low Energy + Unpleasant
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Sad, lonely, tired, depressed
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  🟢 Low Energy + Pleasant
                </h3>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Calm, peaceful, relaxed, content
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onGetStarted}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={onGetStarted}
              className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Skip Introduction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

