/**
 * One-time onboarding overlay: explains the Mood Meter grid (energy × feeling, quadrants).
 * Hidden after "Let's Start"; preference stored so returning users don't see it again.
 */

export default function OnboardingOverlay({ onClose }) {
  return (
    <div
      id="onboardingOverlay"
      className="onboarding-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboardingTitle"
    >
      <div className="onboarding-card">
        <h2 id="onboardingTitle" className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to your Mood Meter
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Understanding your emotions is the first step to managing them. Here is how to use the grid:
        </p>

        <div className="onboarding-steps">
          <div className="step">
            <strong>Vertical:</strong> Energy level (Low to High)
          </div>
          <div className="step">
            <strong>Horizontal:</strong> Feeling (Unpleasant to Pleasant)
          </div>
        </div>

        <div className="quadrant-legend">
          <span className="text-red-500">● Red: Angry/Stressed</span>
          <span className="text-amber-400">● Yellow: Happy/Excited</span>
          <br />
          <span className="text-blue-400">● Blue: Sad/Tired</span>
          <span className="text-emerald-400">● Green: Calm/Content</span>
        </div>

        <button
          type="button"
          className="start-btn"
          onClick={onClose}
        >
          Let&apos;s Start
        </button>
      </div>
    </div>
  );
}
