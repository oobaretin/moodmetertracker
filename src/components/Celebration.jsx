import { useEffect, useState } from 'react';
import { Sparkles, Trophy, Star } from 'lucide-react';

export default function Celebration({ show, message, onComplete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-slide-up">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse-slow" />
          </div>
          <div className="relative">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
            <Star className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            <Star className="w-6 h-6 text-yellow-400 absolute -bottom-1 -left-1 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {message}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Keep up the great work! 🎉
        </p>
      </div>
    </div>
  );
}

