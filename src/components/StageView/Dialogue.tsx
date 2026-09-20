import type { DialogueTurn } from '../../types/stage';

interface Props {
  turn: DialogueTurn;
  /** Horizontal offset of the pointer as % of bubble width (0 = left, 50 = center, 100 = right) */
  pointerOffset?: number;
}

/**
 * Speech bubble. Body stays centered; the triangle pointer shifts toward the speaker.
 */
export default function Dialogue({ turn, pointerOffset = 50 }: Props) {
  return (
    <div className="transition-all duration-300 w-full">
      <div className="glass-strong rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-wider text-[rgb(var(--muted))] mb-0.5">
          {turn.speaker}
        </div>
        <div className="text-[14px] sm:text-base md:text-lg leading-snug font-medium break-words">
          {turn.text}
        </div>
        {turn.romanization && (
          <div className="mt-1 text-xs text-[rgb(var(--muted))] font-mono break-words">
            {turn.romanization}
          </div>
        )}
      </div>
      {/* Pointer aimed downward — position shifts toward the speaking character */}
      <div
        className="relative h-2.5"
        aria-hidden
      >
        <div
          className="absolute top-0 w-3 h-3 bg-white/70 dark:bg-slate-800/80 rotate-45 -mt-1.5 border-r border-b border-white/40 dark:border-slate-600/50 -translate-x-1/2 transition-all duration-300"
          style={{ left: `${pointerOffset}%` }}
        />
      </div>
    </div>
  );
}
