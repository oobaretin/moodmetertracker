import { useState, useEffect, useRef } from 'react';

const BREATH_LABELS = { idle: 'Click to Start', inhale: 'Inhale...', hold: 'Hold...', exhale: 'Exhale...' };
const BREATH_LABELS_NIGHT = { idle: 'Tap for Sleep Prep (4-7-8)', inhale: 'Inhale...', hold: 'Hold...', exhale: 'Exhale...' };

/** 9 PM to 5 AM = Night Shift for wind-down / sleep prep. */
function getTimeContext() {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 5;
}

/**
 * Shift Card – modal-style card with quadrant-specific strategies, 4-7-8 breathing pacer, optional note.
 * Structure: shiftCard, cardBadge, cardTitle, cardDesc, action items (with breathing inside 4-7-8), note, "I feel better".
 * Shown after "Yes, help me shift" from mood prompt.
 * After 9 PM or before 5 AM: "Night Shift" wind-down content (dim lights, digital sunset, gratitude note).
 */

const shiftData = {
  red: {
    name: 'Red Quadrant',
    class: 'red-quadrant',
    title: 'High Energy & Unpleasant',
    desc: "Let's de-escalate and find some calm.",
    actions: [
      { icon: '🧘‍♂️', title: '4-7-8 Breath', text: 'Inhale 4s, hold 7s, exhale 8s.' },
      { icon: '💧', title: 'Cold Water', text: 'Splash your face to reset your nerves.' },
    ],
  },
  blue: {
    name: 'Blue Quadrant',
    class: 'blue-quadrant',
    title: 'Low Energy & Unpleasant',
    desc: 'Small steps can help shift your momentum.',
    actions: [
      { icon: '✅', title: 'Micro-Win', text: 'Do one task that takes under 2 mins.' },
      { icon: '👋', title: 'Reach Out', text: 'Text a friend just to say hi.' },
    ],
  },
  yellow: {
    name: 'Yellow Quadrant',
    class: 'yellow-quadrant',
    title: 'High Energy & Pleasant',
    desc: "You're glowing! Use this energy wisely.",
    actions: [
      { icon: '🚀', title: 'Create', text: 'Spend 10 mins on your hardest goal.' },
      { icon: '✨', title: 'Savor', text: 'Identify exactly what is making you happy.' },
    ],
  },
  green: {
    name: 'Green Quadrant',
    class: 'green-quadrant',
    title: 'Low Energy & Pleasant',
    desc: 'A perfect time for rest and reflection.',
    actions: [
      { icon: '📝', title: 'Reflect', text: "Write down one thing you're grateful for." },
      { icon: '🔋', title: 'Recharge', text: 'Put your phone away for 5 minutes.' },
    ],
  },
};

/** Night Shift (9 PM–5 AM): wind-down, sleep prep, gratitude. */
const nightShiftData = {
  name: 'Night Shift',
  class: 'night-shift',
  title: '🌙 Nightly Wind-Down',
  desc: 'Digital Sunset: Put the phone away after this log. Below, write one thing that went well today.',
  actions: [
    { icon: '🌙', title: '4-7-8 Breath', text: 'Natural tranquilizer. Inhale 4s, hold 7s, exhale 8s.' },
    { icon: '💡', title: 'Dim the Lights', text: "Signal to your brain that it's time for melatonin." },
  ],
};

// Badge colors: .red-quadrant, .blue-quadrant, etc.
const BADGE_CLASSES = {
  red: 'bg-[#fee2e2] text-[#dc2626] dark:bg-red-900/30 dark:text-red-300',
  blue: 'bg-[#dbeafe] text-[#2563eb] dark:bg-blue-900/30 dark:text-blue-300',
  yellow: 'bg-[#fef9c3] text-[#ca8a04] dark:bg-amber-900/30 dark:text-amber-300',
  green: 'bg-[#dcfce7] text-[#16a34a] dark:bg-emerald-900/30 dark:text-emerald-300',
  night: 'bg-slate-200 text-slate-800 dark:bg-slate-600/50 dark:text-slate-200',
};

function parseTimestamp(entry) {
  const ts = entry?.timestamp;
  if (ts == null) return 0;
  if (typeof ts === 'number') return ts;
  const t = new Date(ts).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export default function ShiftCard({ isOpen, onClose, quadrant, onSaveNote, moodHistory = [], initialNote = '' }) {
  const [moodNote, setMoodNote] = useState('');
  const [breathPhase, setBreathPhase] = useState('idle');
  const [breathScale, setBreathScale] = useState(1);
  const [breathOpacity, setBreathOpacity] = useState(0.6);
  const [breathTransition, setBreathTransition] = useState('all 1s linear');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const breathTimeoutRef = useRef(null);

  const pulse = () => {
    if (hapticEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(60);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMoodNote('');
      setIsBreathingActive(false);
      setBreathPhase('idle');
      setBreathScale(1);
      setBreathOpacity(0.6);
      setBreathTransition('all 1s linear');
      if (breathTimeoutRef.current) {
        clearTimeout(breathTimeoutRef.current);
        breathTimeoutRef.current = null;
      }
    } else if (initialNote) {
      setMoodNote(initialNote);
    }
  }, [isOpen, initialNote]);

  const runBreathStep = (phase) => {
    const isNightBreath = getTimeContext();
    const inhaleMs = isNightBreath ? 4400 : 4000;
    const holdMs = isNightBreath ? 7700 : 7000;
    const exhaleMs = isNightBreath ? 8800 : 8000;
    if (phase === 'inhale') {
      pulse();
      setBreathPhase('inhale');
      setBreathTransition(`all ${inhaleMs / 1000}s ease-in-out`);
      setBreathScale(2.5);
      setBreathOpacity(1);
      breathTimeoutRef.current = setTimeout(() => runBreathStep('hold'), inhaleMs);
    } else if (phase === 'hold') {
      pulse();
      setBreathPhase('hold');
      setBreathTransition('none');
      breathTimeoutRef.current = setTimeout(() => runBreathStep('exhale'), holdMs);
    } else if (phase === 'exhale') {
      pulse();
      setBreathPhase('exhale');
      setBreathTransition(`all ${exhaleMs / 1000}s ease-in-out`);
      setBreathScale(1);
      setBreathOpacity(0.6);
      breathTimeoutRef.current = setTimeout(() => runBreathStep('inhale'), exhaleMs);
    }
  };

  const startBreathing = () => {
    if (isBreathingActive) return;
    setIsBreathingActive(true);
    runBreathStep('inhale');
  };

  useEffect(() => {
    return () => {
      if (breathTimeoutRef.current) {
        clearTimeout(breathTimeoutRef.current);
        breathTimeoutRef.current = null;
      }
    };
  }, []);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startMs = startOfToday.getTime();
  const toughToday = (moodHistory || []).filter(
    (e) => parseTimestamp(e) >= startMs && (e.quadrant === 'red' || e.quadrant === 'blue')
  );
  const showSafetyAlert = toughToday.length >= 3;

  useEffect(() => {
    if (showSafetyAlert && isOpen && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [showSafetyAlert, isOpen]);

  if (!isOpen || !quadrant) return null;

  const isNight = getTimeContext();
  const data = isNight ? nightShiftData : (shiftData[quadrant] || shiftData.red);
  const badgeClass = isNight ? BADGE_CLASSES.night : (BADGE_CLASSES[quadrant] || BADGE_CLASSES.red);
  const breathLabels = isNight ? BREATH_LABELS_NIGHT : BREATH_LABELS;

  const handleSaveAndClose = () => {
    onSaveNote?.(moodNote);
    onClose?.();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] animate-fade-in"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        id="shiftCard"
        className={`shift-card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-[10px] rounded-[20px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-[1000] font-sans animate-shift-card-in ${isNight ? 'night-active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cardTitle"
      >
        <div className="shift-header flex justify-between items-center mb-4">
          <span id="cardBadge" className={`quadrant-badge ${data.class} text-xs font-bold uppercase py-1 px-3 rounded-[20px] ${badgeClass}`}>
            {data.name}
          </span>
          <button
            type="button"
            className="close-btn bg-transparent border-0 text-2xl cursor-pointer text-[#94a3b8] hover:text-slate-700 dark:hover:text-slate-200 leading-none p-0"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <h3 id="cardTitle" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {data.title}
        </h3>
        <p id="cardDesc" className="strategy-text text-sm text-gray-600 dark:text-gray-400 mb-4">
          {data.desc}
        </p>

        <div className="space-y-3 mb-4">
          <div className="action-item flex flex-col sm:flex-row gap-4 bg-[#f8fafc] dark:bg-gray-700/50 p-3 rounded-[12px] border border-[#e2e8f0] dark:border-gray-600">
            <div id="icon1" className="icon text-2xl flex-shrink-0" aria-hidden="true">
              {data.actions[0].icon}
            </div>
            <div className="content flex-1 min-w-0">
              <strong id="title1" className="text-gray-900 dark:text-white block text-sm">
                {data.actions[0].title}
              </strong>
              <p id="text1" className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {data.actions[0].text}
              </p>
              {data.actions[0].title === '4-7-8 Breath' && (
                <div
                  className="breathing-container flex flex-col items-center justify-center py-5 mt-3 bg-slate-100 dark:bg-gray-600/50 rounded-xl cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={breathPhase === 'idle' ? startBreathing : undefined}
                  onKeyDown={(e) => breathPhase === 'idle' && (e.key === 'Enter' || e.key === ' ') && startBreathing()}
                  aria-label={breathPhase === 'idle' ? 'Start 4-7-8 breathing' : undefined}
                >
                  <div
                    id="breathingCircle"
                    className="breath-circle breath-circle-heartbeat w-[60px] h-[60px] rounded-full bg-blue-500 shadow-lg"
                    style={{
                      transform: `scale(${breathScale})`,
                      opacity: breathOpacity,
                      transition: breathTransition,
                    }}
                  />
                  <div id="breathLabel" className="breath-label mt-3 text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    {breathLabels[breathPhase]}
                  </div>
                  <div className="haptic-toggle mt-3 flex items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      id="vibrateToggle"
                      checked={hapticEnabled}
                      onChange={(e) => setHapticEnabled(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-500 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="vibrateToggle" className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      📳 Haptic Guidance
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="action-item flex gap-4 bg-[#f8fafc] dark:bg-gray-700/50 p-3 rounded-[12px] border border-[#e2e8f0] dark:border-gray-600">
            <div id="icon2" className="icon text-2xl flex-shrink-0" aria-hidden="true">
              {data.actions[1].icon}
            </div>
            <div className="content">
              <strong id="title2" className="text-gray-900 dark:text-white block text-sm">
                {data.actions[1].title}
              </strong>
              <p id="text2" className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {data.actions[1].text}
              </p>
            </div>
          </div>
        </div>

        <div className="note-section mt-4 pt-4 border-t border-slate-200 dark:border-gray-600 text-left">
          <label htmlFor="moodNote" className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            {isNight ? 'Gratitude: One thing that went well today (Optional)' : "What's on your mind? (Optional)"}
          </label>
          <textarea
            id="moodNote"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder={isNight ? 'e.g., Finished a tough conversation...' : 'e.g., Just finished a big project...'}
            rows={3}
            className="note-input w-full min-h-[60px] p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none outline-none transition-colors focus:border-slate-400 dark:focus:border-gray-500"
          />
        </div>

        <button
          type="button"
          className="done-btn w-full py-3 bg-[#1e293b] dark:bg-slate-700 text-white border-0 rounded-[10px] font-semibold cursor-pointer mt-2.5 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          onClick={handleSaveAndClose}
        >
          I feel better
        </button>

        {showSafetyAlert && (
          <div id="safetyAlert" className="safety-alert mt-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center animate-slide-up">
            <p className="text-sm font-medium text-red-900 dark:text-red-200 mb-1">
              <strong>You&apos;ve had a tough run today.</strong>
            </p>
            <p className="text-sm text-red-800 dark:text-red-300 mb-3">
              If you need someone to talk to, support is available 24/7.
            </p>
            <div className="safety-links flex flex-col gap-2">
              <a href="tel:988" className="safety-btn block bg-red-700 hover:bg-red-800 text-white no-underline py-2.5 px-4 rounded-lg text-sm font-bold transition-colors">
                📞 Call 988 (US)
              </a>
              <a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="safety-btn block bg-red-700 hover:bg-red-800 text-white no-underline py-2.5 px-4 rounded-lg text-sm font-bold transition-colors">
                💬 Text HOME to 741741
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
