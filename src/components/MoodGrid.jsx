import { useCallback, useMemo, useState } from 'react';
import { getQuadrant, calculateEnergy, calculatePleasantness, getEmotionWords, getQuadrantColor, getQuadrantLabel } from '../utils/moodUtils';

const GRID_SIZE = 450; // Increased size for better visibility
const EMOTION_WORDS = {
  yellow: [
    { word: 'joyful', x: 342, y: 72 },
    { word: 'excited', x: 378, y: 108 },
    { word: 'energized', x: 324, y: 90 },
    { word: 'happy', x: 360, y: 54 },
  ],
  red: [
    { word: 'angry', x: 72, y: 72 },
    { word: 'frustrated', x: 108, y: 90 },
    { word: 'anxious', x: 54, y: 108 },
    { word: 'stressed', x: 90, y: 54 },
  ],
  blue: [
    { word: 'sad', x: 72, y: 342 },
    { word: 'lonely', x: 108, y: 360 },
    { word: 'tired', x: 54, y: 378 },
    { word: 'depressed', x: 90, y: 324 },
  ],
  green: [
    { word: 'calm', x: 342, y: 342 },
    { word: 'peaceful', x: 378, y: 360 },
    { word: 'relaxed', x: 324, y: 378 },
    { word: 'content', x: 360, y: 324 },
  ],
};

export default function MoodGrid({ onMoodSelect, selectedPosition }) {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ showBelow: true, left: true });

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svg = e.currentTarget;
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;
    
    // Calculate coordinates accounting for SVG scaling
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    
    const x = Math.max(0, Math.min(GRID_SIZE, (clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(GRID_SIZE, (clientY - rect.top) * scaleY));
    
    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);
    
    onMoodSelect({ x, y, quadrant, energy, pleasantness });
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

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width;
    const scaleY = GRID_SIZE / rect.height;
    
    const x = Math.max(0, Math.min(GRID_SIZE, (touch.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(GRID_SIZE, (touch.clientY - rect.top) * scaleY));
    
    const quadrant = getQuadrant(x, y);
    const energy = calculateEnergy(y);
    const pleasantness = calculatePleasantness(x);
    
    onMoodSelect({ x, y, quadrant, energy, pleasantness });
  }, [onMoodSelect]);

  const gradientId = useMemo(() => `mood-gradient-${Math.random().toString(36).substr(2, 9)}`, []);

  const displayPosition = hoverPosition || selectedPosition;

  return (
    <div className="relative flex justify-center items-center w-full">
      <div className="relative inline-block">
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

          {/* Emotion words */}
          {Object.entries(EMOTION_WORDS).map(([quadrant, words]) =>
            words.map(({ word, x, y }) => (
              <text
                key={`${quadrant}-${word}`}
                x={x}
                y={y}
                className="text-xs sm:text-sm font-medium fill-gray-800 dark:fill-gray-200 pointer-events-none"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
              >
                {word}
              </text>
            ))
          )}

          {/* Hover/Selected position indicator */}
          {displayPosition && (
            <>
              <circle
                cx={displayPosition.x}
                cy={displayPosition.y}
                r={isHovering ? "10" : "8"}
                fill={isHovering ? getQuadrantColor(displayPosition.quadrant) : "white"}
                stroke={isHovering ? "white" : "#374151"}
                strokeWidth={isHovering ? "2" : "3"}
                className="pointer-events-none transition-all"
                style={{
                  opacity: isHovering ? 0.8 : 1,
                  filter: isHovering ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
                }}
              />
              {/* Pulse animation for hover */}
              {isHovering && (
                <circle
                  cx={displayPosition.x}
                  cy={displayPosition.y}
                  r="15"
                  fill="none"
                  stroke={getQuadrantColor(displayPosition.quadrant)}
                  strokeWidth="2"
                  opacity="0.4"
                  className="pointer-events-none animate-pulse-slow"
                />
              )}
            </>
          )}
        </svg>

        {/* Hover tooltip - positioned to always be visible */}
        {isHovering && hoverPosition && (
          <div
            className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 pointer-events-none z-50 whitespace-nowrap"
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
            {/* Arrow pointing to cursor position */}
            <div
              className="absolute w-0 h-0 left-1/2"
              style={{
                [tooltipPosition.showBelow ? 'bottom' : 'top']: '-4px',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                [tooltipPosition.showBelow 
                  ? 'borderTop' 
                  : 'borderBottom']: '4px solid rgb(229, 231, 235)',
              }}
            />
            {/* Dark mode arrow color */}
            <div
              className="absolute w-0 h-0 left-1/2 dark:block hidden"
              style={{
                [tooltipPosition.showBelow ? 'bottom' : 'top']: '-4px',
                transform: 'translateX(-50%)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                [tooltipPosition.showBelow 
                  ? 'borderTop' 
                  : 'borderBottom']: '4px solid rgb(31, 41, 55)',
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
