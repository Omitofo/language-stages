interface Lang {
  code: string;
  label: string;
}

interface Props {
  languages: Lang[];
  current: string;
  onChange: (code: string) => void;
}

export default function LanguageSwitcher({ languages, current, onChange }: Props) {
  if (languages.length <= 1) return null;

  return (
    <div
      className="
        inline-flex rounded-lg overflow-hidden
        border border-[rgb(var(--glass-border)/0.9)]
        bg-[rgb(var(--surface)/0.4)]
        text-sm md:text-xs
      "
      role="group"
      aria-label="Language"
    >
      {languages.map((lang) => {
        const active = lang.code === current;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={`
              px-3 py-2 md:px-2.5 md:py-1.5 transition-colors duration-150 font-medium
              ${active
                ? 'segment-active'
                : 'text-[rgb(var(--muted))] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}
            `}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
