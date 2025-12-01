import { useCallback } from 'react';
import { Smile, Frown, Meh, Heart } from 'lucide-react';
import { getQuadrantColor } from '../utils/moodUtils';

const QUICK_MOODS = [
  { 
    label: 'Happy', 
    icon: Smile, 
    x: 360, 
    y: 90, 
    quadrant: 'yellow',
    color: '#FCD34D'
  },
  { 
    label: 'Calm', 
    icon: Heart, 
    x: 360, 
    y: 360, 
    quadrant: 'green',
    color: '#34D399'
  },
  { 
    label: 'Stressed', 
    icon: Frown, 
    x: 90, 
    y: 90, 
    quadrant: 'red',
    color: '#F87171'
  },
  { 
    label: 'Tired', 
    icon: Meh, 
    x: 90, 
    y: 360, 
    quadrant: 'blue',
    color: '#60A5FA'
  },
];

export default function QuickMoodButtons({ onMoodSelect }) {
  const handleQuickMood = useCallback((mood) => {
    const energy = Math.round(100 - (mood.y / 450) * 100);
    const pleasantness = Math.round((mood.x / 450) * 100);
    
    onMoodSelect({
      x: mood.x,
      y: mood.y,
      quadrant: mood.quadrant,
      energy,
      pleasantness,
    });
  }, [onMoodSelect]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Quick Log
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {QUICK_MOODS.map((mood) => {
          const Icon = mood.icon;
          return (
            <button
              key={mood.label}
              onClick={() => handleQuickMood(mood)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:scale-105 hover:shadow-md"
              style={{
                borderColor: mood.color,
                backgroundColor: `${mood.color}15`,
              }}
            >
              <Icon 
                className="w-6 h-6" 
                style={{ color: mood.color }}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Or click on the grid for precise selection
      </p>
    </div>
  );
}


