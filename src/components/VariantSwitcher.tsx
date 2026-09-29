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
    <div
      className="
        inline-flex rounded-lg overflow-hidden
        border border-[rgb(var(--glass-border)/0.9)]
        bg-[rgb(var(--surface)/0.4)]
        text-sm md:text-xs
      "
      role="group"
      aria-label="Variant"
    >
      {variants.map((v) => {
        const active = v.id === current;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onChange(v.id)}
            className={`
              px-3 py-2 md:px-2.5 md:py-1.5 transition-colors duration-150 font-medium
              ${active
                ? 'segment-secondary-active'
                : 'text-[rgb(var(--muted))] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}
            `}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
