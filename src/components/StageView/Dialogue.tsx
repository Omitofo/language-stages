import type { DialogueTurn, CharacterPlacement } from '../../types/stage';

interface Props {
  turns: DialogueTurn[];
  currentStep: number;
  characters?: CharacterPlacement[];
}

export default function Dialogue({ turns, currentStep, characters }: Props) {
  // Show only the current turn (clean sequential study)
  const turn = turns[currentStep];
  if (!turn) return null;

  const char = characters?.find((c) => c.id === turn.speaker);
  // Position the bubble near the character if we have placement data
  const style = char
    ? {
        left: `${Math.min(Math.max(char.position.x, 15), 85)}%`,
        top: `${Math.max(char.position.y - 18, 12)}%`,
        transform: 'translateX(-50%)',
      }
    : {
        left: '50%',
        top: '28%',
        transform: 'translateX(-50%)',
      };

  return (
    <div
      className="absolute max-w-[min(320px,80vw)] z-10 transition-all duration-300"
      style={style}
    >
      <div className="glass-strong rounded-2xl px-4 py-3 shadow-lg">
        <div className="text-[10px] uppercase tracking-wider text-[rgb(var(--muted))] mb-1">
          {turn.speaker}
        </div>
        <div className="text-base md:text-lg leading-snug font-medium">
          {turn.text}
        </div>
        {turn.romanization && (
          <div className="mt-1 text-xs text-[rgb(var(--muted))] font-mono">
            {turn.romanization}
          </div>
        )}
      </div>
      {/* Small pointer */}
      <div className="mx-auto w-3 h-3 bg-white/70 dark:bg-slate-800/80 rotate-45 -mt-1.5 border-r border-b border-white/40 dark:border-slate-600/50" />
    </div>
  );
}
