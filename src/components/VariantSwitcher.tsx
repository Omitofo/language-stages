interface Variant {
  id: string;
  label: string;
}

interface Props {
  variants: Variant[];
  current: string;
  onChange: (id: string) => void;
}

export default function VariantSwitcher({ variants, current, onChange }: Props) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-[rgb(var(--glass-border))] text-sm sm:text-base">
      {variants.map((v) => {
        const active = v.id === current;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`
              px-3 sm:px-4 py-2 sm:py-2.5 transition font-medium
              ${active
                ? 'bg-neon-magenta/20 text-neon-magenta'
                : 'hover:bg-black/5 dark:hover:bg-white/5 text-[rgb(var(--muted))]'}
            `}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
