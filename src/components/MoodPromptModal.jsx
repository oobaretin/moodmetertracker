/**
 * Mood Prompt Modal – contextual prompt after logging a mood.
 * Red/Blue: "Would you like a strategy to shift your mood?" [Yes, help me shift] [No, let me feel this]
 * Yellow/Green: "How would you like to use this energy?" [Savor it] [Channel it] [Share it]
 */

const UNPLEASANT_QUADRANTS = ['red', 'blue'];
const PLEASANT_QUADRANTS = ['yellow', 'green'];

export default function MoodPromptModal({
  isOpen,
  onClose,
  quadrant,
  onYesHelpShift,
  onNoLetFeel,
  onSavor,
  onChannel,
  onShare,
}) {
  if (!isOpen || !quadrant) return null;

  const isUnpleasant = UNPLEASANT_QUADRANTS.includes(quadrant);
  const isPleasant = PLEASANT_QUADRANTS.includes(quadrant);

  const handleYesHelpShift = () => {
    onYesHelpShift?.(quadrant);
    onClose?.();
  };

  const handleNoLetFeel = () => {
    onNoLetFeel?.();
    onClose?.();
  };

  const handleSavor = () => {
    onSavor?.();
    onClose?.();
  };

  const handleChannel = () => {
    onChannel?.();
    onClose?.();
  };

  const handleShare = () => {
    onShare?.();
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="mood-prompt-title"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-[20px] p-6 shadow-xl z-[1000] font-sans animate-fade-in"
      >
        <h2 id="mood-prompt-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {isUnpleasant && "Would you like a strategy to shift your mood?"}
          {isPleasant && "How would you like to use this energy?"}
        </h2>

        {isUnpleasant && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleYesHelpShift}
              className="flex-1 min-w-[120px] py-3 px-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Yes, help me shift
            </button>
            <button
              type="button"
              onClick={handleNoLetFeel}
              className="flex-1 min-w-[120px] py-3 px-4 bg-slate-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors border border-slate-200 dark:border-gray-600"
            >
              No, let me feel this
            </button>
          </div>
        )}

        {isPleasant && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSavor}
              className="flex-1 min-w-[100px] py-3 px-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Savor it
            </button>
            <button
              type="button"
              onClick={handleChannel}
              className="flex-1 min-w-[100px] py-3 px-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Channel it
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 min-w-[100px] py-3 px-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            >
              Share it
            </button>
          </div>
        )}
      </div>
    </>
  );
}
