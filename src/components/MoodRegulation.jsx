import { useState, useEffect, useRef } from 'react';
import { Heart, BookOpen, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import EmptyState from './EmptyState';

const BREATHING_PHASES = [
  { label: 'Breathe In', duration: 4 },
  { label: 'Hold', duration: 7 },
  { label: 'Breathe Out', duration: 8 },
];

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who are you grateful for?",
  "What's one thing that went well?",
  "What's a small win you had today?",
  "What's something beautiful you noticed?",
  "What are you proud of yourself for?",
];

const COPING_ACTIVITIES = {
  red: [
    "Take 5 deep breaths",
    "Go for a 10-minute walk",
    "Write down what's bothering you",
    "Listen to calming music",
    "Do some light stretching",
    "Drink a glass of water",
  ],
  blue: [
    "Reach out to a friend",
    "Take a warm shower or bath",
    "Do something creative",
    "Read something uplifting",
    "Practice self-compassion",
    "Get some fresh air",
  ],
  yellow: [
    "Share your joy with someone",
    "Do something active",
    "Express gratitude",
    "Help someone else",
    "Celebrate the moment",
    "Document this feeling",
  ],
  green: [
    "Savor this moment",
    "Practice mindfulness",
    "Continue what you're doing",
    "Reflect on what's working",
    "Share your calm with others",
    "Maintain this state",
  ],
};

export default function MoodRegulation({ lastMoodQuadrant }) {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [breathingCountdown, setBreathingCountdown] = useState(4);
  const [circleScale, setCircleScale] = useState(1);
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(GRATITUDE_PROMPTS[0]);
  const phaseStartTimeRef = useRef(Date.now());
  const phaseRef = useRef(0);

  useEffect(() => {
    if (!breathingActive) return;

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setBreathingCountdown(prev => {
        if (prev <= 1) {
          setBreathingPhase(prevPhase => {
            const nextPhase = (prevPhase + 1) % BREATHING_PHASES.length;
            phaseRef.current = nextPhase;
            phaseStartTimeRef.current = Date.now(); // Reset phase start time
            return nextPhase;
          });
          return BREATHING_PHASES[phaseRef.current].duration;
        }
        return prev - 1;
      });
    }, 1000);

    // Update animation smoothly (every 50ms for very smooth animation)
    const animationInterval = setInterval(() => {
      const currentPhaseIndex = phaseRef.current;
      const currentPhase = BREATHING_PHASES[currentPhaseIndex];
      const now = Date.now();
      const elapsed = (now - phaseStartTimeRef.current) / 1000; // Elapsed time in seconds
      const progress = Math.min(elapsed / currentPhase.duration, 1);
      
      if (currentPhaseIndex === 0) {
        // Breathe In: Scale from 1 to 1.8 over 4 seconds (smoother, larger expansion)
        // Use easing function for natural breathing feel
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        setCircleScale(1 + (easedProgress * 0.8));
      } else if (currentPhaseIndex === 1) {
        // Hold: Keep at 1.8 for 7 seconds (completely still)
        setCircleScale(1.8);
      } else {
        // Breathe Out: Scale from 1.8 to 1 over 8 seconds (smoother, slower)
        // Use easing function for natural breathing feel
        const easedProgress = 1 - Math.pow(1 - progress, 2); // Ease-out quadratic
        setCircleScale(1.8 - (easedProgress * 0.8));
      }
    }, 50); // Update every 50ms for very smooth animation

    return () => {
      clearInterval(countdownInterval);
      clearInterval(animationInterval);
    };
  }, [breathingActive]);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingPhase(0);
    phaseRef.current = 0;
    phaseStartTimeRef.current = Date.now();
    setBreathingCountdown(BREATHING_PHASES[0].duration);
    setCircleScale(1); // Start small
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase(0);
    setBreathingCountdown(4);
    setCircleScale(1); // Reset to normal size
  };

  const resetBreathing = () => {
    stopBreathing();
    setTimeout(() => {
      startBreathing();
    }, 100);
  };

  const getCurrentPhase = () => BREATHING_PHASES[breathingPhase];

  const getSuggestedActivities = () => {
    if (!lastMoodQuadrant) return [];
    return COPING_ACTIVITIES[lastMoodQuadrant] || [];
  };

  const getNewPrompt = () => {
    const randomPrompt = GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Breathing Exercise */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            4-7-8 Breathing Exercise
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          A simple breathing technique to help you relax and reduce stress
        </p>

        {!breathingActive ? (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <button
              onClick={startBreathing}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Start Breathing
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="relative mb-6" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                className="absolute rounded-full border-4 border-blue-500"
                style={{
                  width: '128px',
                  height: '128px',
                  transform: `scale(${circleScale})`,
                  transition: breathingPhase === 1 ? 'none' : 'transform 0.1s ease-out',
                  willChange: 'transform',
                  zIndex: 1,
                }}
              />
              <span 
                className="relative text-4xl font-bold text-blue-500 z-10"
                style={{ 
                  opacity: 1,
                  textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)',
                }}
              >
                {breathingCountdown}
              </span>
            </div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {getCurrentPhase().label}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {breathingPhase === 0 && 'Slowly breathe in...'}
              {breathingPhase === 1 && 'Hold your breath...'}
              {breathingPhase === 2 && 'Slowly breathe out...'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={stopBreathing}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={resetBreathing}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gratitude Journal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Gratitude Journal
          </h3>
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {currentPrompt}
          </p>
          <button
            onClick={getNewPrompt}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Get another prompt
          </button>
        </div>
        <textarea
          value={gratitudeEntry}
          onChange={(e) => setGratitudeEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none mb-4"
        />
        <button
          onClick={() => {
            setGratitudeEntry('');
            getNewPrompt();
          }}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Save Entry
        </button>
      </div>

      {/* Suggested Activities */}
      {lastMoodQuadrant && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Suggested Activities
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Based on your recent mood, here are some activities that might help:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getSuggestedActivities().map((activity, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <p className="text-sm text-gray-900 dark:text-white">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!lastMoodQuadrant && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState type="insights" />
        </div>
      )}
    </div>
  );
}

