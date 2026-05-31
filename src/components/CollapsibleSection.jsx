import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="min-w-0">
          <span className="block font-semibold text-gray-900 dark:text-white">{title}</span>
          {subtitle && (
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {subtitle}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">{children}</div>}
    </section>
  );
}
