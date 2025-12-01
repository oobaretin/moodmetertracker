import { Plus } from 'lucide-react';

export default function FloatingCheckIn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110 flex items-center justify-center z-50"
      aria-label="Check in"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}


