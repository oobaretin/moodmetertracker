import { useCallback, useMemo, useState } from 'react';
import { getQuadrant, calculateEnergy, calculatePleasantness, getQuadrantColor, getQuadrantLabel } from '../utils/moodUtils';

const GRID_SIZE = 450; // Increased size for better visibility

/**
 * Emotion label positions: Quadrant, Emotion, Left (%), Top (%)
 * RED: stressed 30,15 | angry 22,19 | frustrated 38,23 | anxious 18,28
 * YELLOW: happy 75,15 | joyful 68,19 | energized 65,24 | excited 82,26
 * BLUE: depressed 35,72 | sad 25,76 | lonely 36,81 | tired 20,84
 * GREEN: content 75,72 | calm 66,76 | peaceful 82,80 | relaxed 68,85
 */
const EMOTION_LABELS = [
  { name: 'stressed', left: 30, top: 15 },
  { name: 'angry', left: 22, top: 19 },
  { name: 'frustrated', left: 38, top: 23 },
  { name: 'anxious', left: 18, top: 28 },
  { name: 'happy', left: 75, top: 15 },
  { name: 'joyful', left: 68, top: 19 },
  { name: 'energized', left: 65, top: 24 },
  { name: 'excited', left: 82, top: 26 },
  { name: 'depressed', left: 35, top: 72 },
  { name: 'sad', left: 25, top: 76 },
  { name: 'lonely', left: 36, top: 81 },
  { name: 'tired', left: 20, top: 84 },
  { name: 'content', left: 75, top: 72 },
  { name: 'calm', left: 66, top: 76 },
  { name: 'peaceful', left: 82, top: 80 },
  { name: 'relaxed', left: 68, top: 85 },
];

/** Slightly larger for spaced-out labels; snap lands dot in center of word (translate -50%, -50%). */
const SNAP_THRESHOLD = 0.06;

/** Magnetic snap: x,y as decimals (0–1), 1:1 with label left/top %. Center-point logic matches CSS. */
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

export default function MoodGrid({ onMoodSelect, selectedPosition, selectionDotPosition, snappedEmotionWord }) {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ showBelow: true, left: true });

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

    let x = Math.max(0, Math.min(GRID_SIZE, (clientX - rect.left) * scaleX));
    let y = Math.max(0, Math.min(GRID_SIZE, (clientY - rect.top) * scaleY));

    // Magnetic snap: if click is near an emotion word, snap dot to it
    const nx = x / GRID_SIZE;
    const ny = y / GRID_SIZE;
    const snapped = findSnappedEmotion(nx, ny);
    let snappedWord = null;
    if (snapped) {
      x = snapped.x * GRID_SIZE;
      y = snapped.y * GRID_SIZE;
      snappedWord = snapped.name;
    }

    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);

    onMoodSelect({ x, y, quadrant, energy, pleasantness, snappedWord });
  }, [onMoodSelect]);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;
    
    const x = Math.max(0, Math.min(GRID_SIZE, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(GRID_SIZE, (e.clientY - rect.top) * scaleY));
    
    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);
    
    // Calculate tooltip position based on cursor location
    const relativeY = (e.clientY - rect.top) / rect.height;
    
    // Show tooltip below cursor if in top 40%, above cursor if in bottom 60%
    // This ensures tooltip is always visible
    setTooltipPosition({
      showBelow: relativeY < 0.4, // Show below cursor if in top 40%
      left: true, // Always center horizontally
    });
    
    setHoverPosition({ x, y, quadrant, energy, pleasantness });
    setIsHovering(true);
    e.currentTarget.style.cursor = 'crosshair';
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setHoverPosition(null);
  }, []);

  const handleLabelClick = useCallback((emotion) => {
    const x = (emotion.left / 100) * GRID_SIZE;
    const y = (emotion.top / 100) * GRID_SIZE;
    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);
    onMoodSelect({ x, y, quadrant, energy, pleasantness, snappedWord: emotion.name });
  }, [onMoodSelect]);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;
    
    let x = Math.max(0, Math.min(GRID_SIZE, (touch.clientX - rect.left) * scaleX));
    let y = Math.max(0, Math.min(GRID_SIZE, (touch.clientY - rect.top) * scaleY));
    
    const nx = x / GRID_SIZE;
    const ny = y / GRID_SIZE;
    const snapped = findSnappedEmotion(nx, ny);
    let snappedWord = null;
    if (snapped) {
      x = snapped.x * GRID_SIZE;
      y = snapped.y * GRID_SIZE;
      snappedWord = snapped.name;
    }
    
    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);
    
    onMoodSelect({ x, y, quadrant, energy, pleasantness, snappedWord });
  }, [onMoodSelect]);

  const gradientId = useMemo(() => `mood-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  const displayPosition = hoverPosition || selectedPosition;

  return (
    <div className="relative flex justify-center items-center w-full" id="moodGridContainer">
      <div className="mood-grid relative inline-block">
        {/* Selection dot: div overlay at last clicked position (persists until new mood or shift card closed) */}
        {selectionDotPosition && (
          <div
            id="selectionDot"
            style={{
              left: `calc(${(selectionDotPosition.x / GRID_SIZE) * 100}% - 7px)`,
              top: `calc(${(selectionDotPosition.y / GRID_SIZE) * 100}% - 7px)`,
            }}
          />
        )}
        <div className="relative inline-block" style={{ display: 'inline-block' }}>
        <svg
          width={GRID_SIZE}
          height={GRID_SIZE}
          className="border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg cursor-crosshair transition-all hover:shadow-xl"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            touchAction: 'none',
            display: 'block',
            margin: '0 auto'
          }}
          viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
        >
          <defs>
            <linearGradient id={`${gradientId}-yellow`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id={`${gradientId}-red`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id={`${gradientId}-blue`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={`${gradientId}-green`} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Quadrants */}
          <rect x={GRID_SIZE / 2} y="0" width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-yellow)`} />
          <rect x="0" y="0" width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-red)`} />
          <rect x="0" y={GRID_SIZE / 2} width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-blue)`} />
          <rect x={GRID_SIZE / 2} y={GRID_SIZE / 2} width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-green)`} />

          {/* Center lines */}
          <line x1={GRID_SIZE / 2} y1="0" x2={GRID_SIZE / 2} y2={GRID_SIZE} stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
          <line x1="0" y1={GRID_SIZE / 2} x2={GRID_SIZE} y2={GRID_SIZE / 2} stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />

          {/* Axis labels */}
          <text x="10" y="20" className="text-xs font-semibold fill-gray-700 dark:fill-gray-300">
            HIGH ENERGY
          </text>
          <text x="10" y={GRID_SIZE - 10} className="text-xs font-semibold fill-gray-700 dark:fill-gray-300">
            LOW ENERGY
          </text>
          <text x="10" y={GRID_SIZE / 2 + 10} className="text-xs font-semibold fill-gray-700 dark:fill-gray-300">
            UNPLEASANT
          </text>
          <text x={GRID_SIZE - 100} y={GRID_SIZE / 2 + 10} className="text-xs font-semibold fill-gray-700 dark:fill-gray-300">
            PLEASANT
          </text>

          {/* Hover indicator only (selection dot is a separate div overlay) */}
          {isHovering && hoverPosition && (
            <>
              <circle
                cx={hoverPosition.x}
                cy={hoverPosition.y}
                r="10"
                fill={getQuadrantColor(hoverPosition.quadrant)}
                stroke="white"
                strokeWidth="2"
                className="pointer-events-none transition-all"
                style={{
                  opacity: 0.8,
                  filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.3))',
                }}
              />
              <circle
                cx={hoverPosition.x}
                cy={hoverPosition.y}
                r="15"
                fill="none"
                stroke={getQuadrantColor(hoverPosition.quadrant)}
                strokeWidth="2"
                opacity="0.4"
                className="pointer-events-none animate-pulse-slow"
              />
            </>
          )}
        </svg>

        {/* Emotion labels: fixed-center overlay (translate -50%, -50%) so no overlap/shake */}
        <div className="emotion-labels-overlay absolute inset-0 pointer-events-none" aria-hidden="true">
          {EMOTION_LABELS.map((emotion) => {
            const isSnapped = snappedEmotionWord && emotion.name.toLowerCase() === snappedEmotionWord.toLowerCase();
            return (
              <span
                key={emotion.name}
                className={`emotion-label ${isSnapped ? 'active-snap' : ''}`}
                style={{ left: `${emotion.left}%`, top: `${emotion.top}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleLabelClick(emotion);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLabelClick(emotion);
                  }
                }}
                aria-label={`Log mood: ${emotion.name}`}
              >
                {emotion.name}
              </span>
            );
          })}
        </div>
        </div>

        {/* Hover tooltip - glassmorphism so quadrant gradients peek through */}
        {isHovering && hoverPosition && (
          <div
            className="tooltip absolute pointer-events-none z-50 whitespace-nowrap"
            style={{
              left: `${(hoverPosition.x / GRID_SIZE) * 100}%`,
              top: `${(hoverPosition.y / GRID_SIZE) * 100}%`,
              transform: tooltipPosition.showBelow
                ? 'translate(-50%, 15px)'  // Show below cursor
                : 'translate(-50%, calc(-100% - 15px))',  // Show above cursor
              maxWidth: '220px',
              minWidth: '180px',
            }}
          >
            <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
              {getQuadrantLabel(hoverPosition.quadrant)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Energy: {hoverPosition.energy}% | Pleasantness: {hoverPosition.pleasantness}%
            </div>
            {/* Arrow: matches glass border so quadrant colors peek through */}
            <div
              className="absolute w-0 h-0 left-1/2 tooltip-arrow"
              style={{
                [tooltipPosition.showBelow ? 'bottom' : 'top']: '-4px',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                [tooltipPosition.showBelow 
                  ? 'borderTop' 
                  : 'borderBottom']: '4px solid rgba(255, 255, 255, 0.4)',
              }}
            />
            <div
              className="absolute w-0 h-0 left-1/2 tooltip-arrow dark:block hidden"
              style={{
                [tooltipPosition.showBelow ? 'bottom' : 'top']: '-4px',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                [tooltipPosition.showBelow 
                  ? 'borderTop' 
                  : 'borderBottom']: '4px solid rgba(255, 255, 255, 0.15)',
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {isHovering ? (
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Click to log this mood
          </span>
        ) : (
          'Click anywhere on the grid to log your mood'
        )}
      </div>
    </div>
  );
}
