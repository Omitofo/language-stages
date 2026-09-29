import { useState, useRef, useEffect } from 'react';
import type { LevelGroup } from '../types/stage';

interface Props {
  levels: LevelGroup[];
  activeStageId: string | null;
  activeTitle?: string;
  onSelect: (stageId: string) => void;
}

/**
 * Mobile-only stage picker. Desktop uses the always-open Sidebar.
 */
export default function StageDropdown({
  levels,
  activeStageId,
  activeTitle,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const label = activeTitle || 'Select a stage';

  return (
    <div ref={rootRef} className="md:hidden relative w-full px-0 pt-0 pb-2 z-40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          w-full flex items-center justify-between gap-3
          px-4 py-2.5 rounded-xl
          glass-strong text-sm font-medium
          transition active:scale-[0.99]
        "
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate text-left">{label}</span>
        <svg
          className={`w-4 h-4 shrink-0 text-[rgb(var(--muted))] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute left-0 right-0 mt-1.5
            max-h-[min(50vh,360px)] overflow-y-auto
            rounded-xl glass-strong shadow-xl
            py-2 z-50
          "
          role="listbox"
        >
          {levels.map((level) => (
            <div key={level.id} className="mb-1">
              <div className="px-4 py-1.5 text-[10px] uppercase tracking-swiss text-[rgb(var(--muted))] font-medium">
                {level.id}
                <span className="mx-1.5 opacity-40">·</span>
                {level.name}
              </div>
              {level.stages.map((stage) => {
                const isActive = stage.id === activeStageId;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onSelect(stage.id);
                      setOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                      ${isActive
                        ? 'nav-active'
                        : 'text-[rgb(var(--fg))] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'}
                    `}
                  >
                    {stage.title.en}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
