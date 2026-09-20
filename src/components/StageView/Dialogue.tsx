import type { DialogueTurn } from '../../types/stage';

interface Props {
  turn: DialogueTurn;
}

/**
 * Pure bubble content. Positioning is handled by the parent character container
 * so the bubble always stays attached to its speaker across all breakpoints.
 */
export default function Dialogue({ turn }: Props) {
  return (
    <div className="transition-all duration-300">
      <div className="glass-strong rounded-2xl px-4 py-3 shadow-xl backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-wider text-[rgb(var(--muted))] mb-1">
          {turn.speaker}
        </div>
        <div className="text-[15px] sm:text-base md:text-lg leading-snug font-medium break-words">
          {turn.text}
        </div>
        {turn.romanization && (
          <div className="mt-1 text-xs text-[rgb(var(--muted))] font-mono break-words">
            {turn.romanization}
          </div>
        )}
      </div>
      {/* Pointer aimed downward toward the character */}
      <div className="mx-auto w-3 h-3 bg-white/70 dark:bg-slate-800/80 rotate-45 -mt-1.5 border-r border-b border-white/40 dark:border-slate-600/50" />
    </div>
  );
}
