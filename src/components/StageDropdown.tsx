import { useState, useRef, useEffect } from 'react';
import type { LevelGroup } from '../types/stage';

interface Props {
  levels: LevelGroup[];
  activeStageId: string | null;
  activeTitle?: string;
  onSelect: (stageId: string) => void;
}

/**
 * Mobile-only stage picker: a button that opens a scrollable dropdown menu.
 * Lives between the header and the stage canvas.
 */
export default function StageDropdown({
  levels,
  activeStageId,
  activeTitle,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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
    <div ref={rootRef} className="md:hidden relative w-full px-3 pt-2 pb-1 z-40">
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
          className={`w-4 h-4 shrink-0 text-[rgb(var(--muted))] transition-transform ${open ? 'rotate-180' : ''}`}
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
            absolute left-3 right-3 mt-1.5
            max-h-[min(50vh,360px)] overflow-y-auto
            rounded-xl glass-strong shadow-xl
            py-2 z-50
          "
          role="listbox"
        >
          {levels.map((level) => (
            <div key={level.id} className="mb-1">
              <div className="px-4 py-1 text-[10px] uppercase tracking-widest text-[rgb(var(--muted))] font-medium">
                {level.id} — {level.name}
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
                      w-full text-left px-4 py-2.5 text-sm transition
                      ${isActive
                        ? 'bg-neon-cyan/15 text-neon-cyan font-medium'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-[rgb(var(--fg))]'}
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
