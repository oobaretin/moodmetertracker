import { useEffect, useState, useRef } from 'react';

/**
 * Bottom-center toast: slides up into view, auto-hides after duration.
 * Non-intrusive; pointer-events: none so user can click through.
 */
export default function BottomToast({ message, onHide, duration = 3000 }) {
  const [visible, setVisible] = useState(false);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = setTimeout(() => onHide?.(), 500);
    }, duration);
    return () => {
      clearTimeout(timer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [duration, onHide]);

  if (!message) return null;

  return (
    <div
      id="toast"
      className={`toast-notification ${visible ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
