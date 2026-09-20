interface Props {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function StepControls({ current, total, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className="px-5 py-2.5 rounded-xl glass-strong text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition"
      >
        ← Prev
      </button>

      <div className="text-sm tabular-nums text-[rgb(var(--muted))] min-w-[3.5rem] text-center">
        {current + 1} / {total}
      </div>

      <button
        onClick={onNext}
        disabled={current >= total - 1}
        className="px-5 py-2.5 rounded-xl glass-strong text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Next →
      </button>
    </div>
  );
}
