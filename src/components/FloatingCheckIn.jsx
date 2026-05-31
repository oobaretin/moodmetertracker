import { Plus } from 'lucide-react';

export default function FloatingCheckIn({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed right-4 md:right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center z-40 ${className}`}
      aria-label="Check in"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}




