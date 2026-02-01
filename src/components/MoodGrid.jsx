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

export default function MoodGrid({ onMoodSelect, selectedPosition, selectionDotPosition, snappedEmotionWord, onResetSelection }) {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ showBelow: true, left: true });

  // STABILIZED GRADIENT ID
  const gradientId = useMemo(() => `mood-gradient-static`, []);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

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

    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);

    if (onMoodSelect) {
      onMoodSelect({ x, y, quadrant, energy, pleasantness, snappedWord });
    }
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
    const relativeY = (e.clientY - rect.top) / rect.height;
    
    setTooltipPosition({
      showBelow: relativeY < 0.4,
      left: true,
    });
    
    setHoverPosition({ x, y, quadrant, energy, pleasantness });
    setIsHovering(true);
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
    if (onMoodSelect) {
      onMoodSelect({ x, y, quadrant, energy, pleasantness, snappedWord: emotion.name });
    }
  }, [onMoodSelect]);

  return (
    <div className="relative flex flex-col justify-center items-center w-full" id="moodGridContainer">
      <div className="mood-grid relative inline-block">
        
        {selectionDotPosition && (
          <div
            id="selectionDot"
            style={{
              position: 'absolute',
              left: `${(selectionDotPosition.x / GRID_SIZE) * 100}%`,
              top: `${(selectionDotPosition.y / GRID_SIZE) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 40,
              pointerEvents: 'none'
            }}
          />
        )}

        <div className="relative inline-block" style={{ touchAction: 'none' }}>
          <svg
            width={GRID_SIZE}
            height={GRID_SIZE}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg cursor-crosshair transition-all"
            style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
            viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id={`${gradientId}-yellow`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id={`${gradientId}-red`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F87171" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#F87171" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id={`${gradientId}-blue`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id={`${gradientId}-green`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            <rect x={GRID_SIZE / 2} y="0" width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-yellow)`} />
            <rect x="0" y="0" width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-red)`} />
            <rect x="0" y={GRID_SIZE / 2} width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-blue)`} />
            <rect x={GRID_SIZE / 2} y={GRID_SIZE / 2} width={GRID_SIZE / 2} height={GRID_SIZE / 2} fill={`url(#${gradientId}-green)`} />

            <line x1={GRID_SIZE / 2} y1="0" x2={GRID_SIZE / 2} y2={GRID_SIZE} stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            <line x1="0" y1={GRID_SIZE / 2} x2={GRID_SIZE} y2={GRID_SIZE / 2} stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />

            <g className="select-none pointer-events-none" fill="currentColor">
              <text x="10" y="25" className="text-[10px] font-bold opacity-70">HIGH ENERGY</text>
              <text x="10" y={GRID_SIZE - 15} className="text-[10px] font-bold opacity-70">LOW ENERGY</text>
              <text x="10" y={GRID_SIZE / 2 - 10} className="text-[10px] font-bold opacity-70">UNPLEASANT</text>
              <text x={GRID_SIZE - 75} y={GRID_SIZE / 2 - 10} className="text-[10px] font-bold opacity-70">PLEASANT</text>
            </g>

            {isHovering && hoverPosition && (
              <circle
                cx={hoverPosition.x}
                cy={hoverPosition.y}
                r="8"
                fill={getQuadrantColor(hoverPosition.quadrant)}
                stroke="white"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))' }}
              />
            )}
          </svg>

          <div className="absolute inset-0 pointer-events-none">
            {EMOTION_LABELS.map((emotion) => (
              <span
                key={emotion.name}
                className={`emotion-label pointer-events-auto ${snappedEmotionWord === emotion.name ? 'active-snap' : ''}`}
                style={{ 
                  left: `${emotion.left}%`, 
                  top: `${emotion.top}%`,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLabelClick(emotion);
                }}
              >
                {emotion.name}
              </span>
            ))}
          </div>
        </div>

        {isHovering && hoverPosition && (
          <div
            className="tooltip absolute pointer-events-none z-50"
            style={{
              left: `${(hoverPosition.x / GRID_SIZE) * 100}%`,
              top: `${(hoverPosition.y / GRID_SIZE) * 100}%`,
              transform: tooltipPosition.showBelow ? 'translate(-50%, 20px)' : 'translate(-50%, -110%)'
            }}
          >
            <div className="text-xs font-bold">{getQuadrantLabel(hoverPosition.quadrant)}</div>
            <div className="text-[10px] opacity-80">
              E: {hoverPosition.energy}% | P: {hoverPosition.pleasantness}%
            </div>
          </div>
        )}
      </div>

      {(selectionDotPosition || snappedEmotionWord) && (
        <button type="button" className="reset-btn mt-4" onClick={onResetSelection}>
          ↺ Reset Selection
        </button>
      )}
    </div>
  );
}