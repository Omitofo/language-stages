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

  // Place bubble above the speaker, with a side bias so it never covers the face.
  // On very small screens the bubble stays more centered and higher.
  let left = '50%';
  let top = '18%';
  let transform = 'translateX(-50%)';

  if (char) {
    const x = char.position.x;
    // Prefer the inner side of the character so the bubble stays in the open center area
    if (x < 40) {
      // Customer (left) → bubble a bit to the right of them
      left = `${Math.min(x + 18, 48)}%`;
      transform = 'translateX(-20%)';
    } else {
      // Staff (right) → bubble a bit to the left of them
      left = `${Math.max(x - 18, 52)}%`;
      transform = 'translateX(-80%)';
    }
    // Keep the bubble in the upper third so it clears the large foreground characters
    top = '14%';
  }

  return (
    <div
      className="absolute max-w-[min(300px,82vw)] z-20 transition-all duration-300"
      style={{ left, top, transform }}
    >
      <div className="glass-strong rounded-2xl px-4 py-3 shadow-xl backdrop-blur-md">
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
