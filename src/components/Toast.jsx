import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

const TOAST_TYPES = {
  success: { icon: CheckCircle, color: 'bg-green-500' },
  error: { icon: XCircle, color: 'bg-red-500' },
  info: { icon: Info, color: 'bg-blue-500' },
  warning: { icon: AlertCircle, color: 'bg-yellow-500' },
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const Icon = TOAST_TYPES[type]?.icon || TOAST_TYPES.info.icon;
  const color = TOAST_TYPES[type]?.color || TOAST_TYPES.info.color;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[300px] max-w-md flex items-start gap-3">
        <div className={`${color} rounded-full p-1 flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <p className="flex-1 text-sm text-gray-900 dark:text-white">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}

