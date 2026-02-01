import { useCallback, useMemo, useState } from 'react';
import { getQuadrant, calculateEnergy, calculatePleasantness, getQuadrantColor, getQuadrantLabel } from '../utils/moodUtils';

const GRID_SIZE = 450; 

const EMOTION_LABELS = [
  { name: 'stressed', left: 30, top: 15 }, { name: 'angry', left: 22, top: 19 },
  { name: 'frustrated', left: 38, top: 23 }, { name: 'anxious', left: 18, top: 28 },
  { name: 'happy', left: 75, top: 15 }, { name: 'joyful', left: 68, top: 19 },
  { name: 'energized', left: 65, top: 24 }, { name: 'excited', left: 82, top: 26 },
  { name: 'depressed', left: 35, top: 72 }, { name: 'sad', left: 25, top: 76 },
  { name: 'lonely', left: 36, top: 81 }, { name: 'tired', left: 20, top: 84 },
  { name: 'content', left: 75, top: 72 }, { name: 'calm', left: 66, top: 76 },
  { name: 'peaceful', left: 82, top: 80 }, { name: 'relaxed', left: 68, top: 85 },
];

const SNAP_THRESHOLD = 0.06;

const EMOTION_COORDINATES = EMOTION_LABELS.map(({ name, left, top }) => ({
  name,
  x: left / 100,
  y: top / 100,
}));

function findSnappedEmotion(nx, ny) {
  let closest = null;
  let minDist = SNAP_THRESHOLD;
  for (const emotion of EMOTION_COORDINATES) {
    const dist = Math.sqrt((nx - emotion.x) ** 2 + (ny - emotion.y) ** 2);
    if (dist < minDist) {
      minDist = dist;
      closest = emotion;
    }
  }
  return closest;
}

export default function MoodGrid({ onMoodSelect, selectionDotPosition, snappedEmotionWord, onResetSelection }) {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  // Use a stable ID for the SVG gradients
  const gradientId = "mood-grad-fixed";

  const handleInteraction = useCallback((clientX, clientY, target) => {
    const rect = target.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;

    let x = Math.max(0, Math.min(GRID_SIZE, (clientX - rect.left) * scaleX));
    let y = Math.max(0, Math.min(GRID_SIZE, (clientY - rect.top) * scaleY));

    const nx = x / GRID_SIZE;
    const ny = y / GRID_SIZE;
    const snapped = findSnappedEmotion(nx, ny);
    let snappedWord = null;
    
    if (snapped) {
      x = snapped.x * GRID_SIZE;
      y = snapped.y * GRID_SIZE;
      snappedWord = snapped.name;
    }

    if (onMoodSelect) {
      onMoodSelect({
        x, y,
        quadrant: getQuadrant(x, y),
        energy: calculateEnergy(y),
        pleasantness: calculatePleasantness(x),
        snappedWord
      });
    }
  }, [onMoodSelect]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative inline-block border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Selection Dot Layer */}
        {selectionDotPosition && (
          <div
            className="absolute z-40 w-4 h-4 bg-white border-2 border-black rounded-full pointer-events-none transition-all duration-200"
            style={{
              left: `${(selectionDotPosition.x / GRID_SIZE) * 100}%`,
              top: `${(selectionDotPosition.y / GRID_SIZE) * 100}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
          />
        )}

        <svg
          width={GRID_SIZE}
          height={GRID_SIZE}
          className="bg-white dark:bg-gray-900 cursor-crosshair"
          viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
          onClick={(e) => handleInteraction(e.clientX, e.clientY, e.currentTarget)}
          onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             setHoverPosition({ 
               x: (e.clientX - rect.left) * (GRID_SIZE / rect.width), 
               y: (e.clientY - rect.top) * (GRID_SIZE / rect.height) 
             });
             setIsHovering(true);
          }}
          onMouseLeave={() => setIsHovering(false)}
        >
          <defs>
            <linearGradient id={`${gradientId}-red`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#fee2e2" /></linearGradient>
            <linearGradient id={`${gradientId}-yellow`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fcd34d" /><stop offset="100%" stopColor="#fef9c3" /></linearGradient>
            <linearGradient id={`${gradientId}-blue`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dbeafe" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
            <linearGradient id={`${gradientId}-green`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dcfce7" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
          </defs>

          <rect x="0" y="0" width={GRID_SIZE/2} height={GRID_SIZE/2} fill={`url(#${gradientId}-red)`} />
          <rect x={GRID_SIZE/2} y="0" width={GRID_SIZE/2} height={GRID_SIZE/2} fill={`url(#${gradientId}-yellow)`} />
          <rect x="0" y={GRID_SIZE/2} width={GRID_SIZE/2} height={GRID_SIZE/2} fill={`url(#${gradientId}-blue)`} />
          <rect x={GRID_SIZE/2} y={GRID_SIZE/2} width={GRID_SIZE/2} height={GRID_SIZE/2} fill={`url(#${gradientId}-green)`} />
          
          <line x1={GRID_SIZE/2} y1="0" x2={GRID_SIZE/2} y2={GRID_SIZE} stroke="rgba(0,0,0,0.1)" strokeDasharray="4" />
          <line x1="0" y1={GRID_SIZE/2} x2={GRID_SIZE} y2={GRID_SIZE/2} stroke="rgba(0,0,0,0.1)" strokeDasharray="4" />
        </svg>

        {/* Emotion Labels Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {EMOTION_LABELS.map((emotion) => (
            <span
              key={emotion.name}
              className={`absolute text-[11px] font-medium transition-all px-1 rounded ${snappedEmotionWord === emotion.name ? 'bg-black text-white scale-110 z-50' : 'text-gray-700 opacity-80'}`}
              style={{ 
                left: `${emotion.left}%`, 
                top: `${emotion.top}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {emotion.name}
            </span>
          ))}
        </div>
      </div>

      {onResetSelection && (selectionDotPosition || snappedEmotionWord) && (
        <button 
          onClick={onResetSelection}
          className="mt-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 transition-colors"
        >
          ↺ Reset Selection
        </button>
      )}
    </div>
  );
}