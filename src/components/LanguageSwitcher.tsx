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
    <div className="flex rounded-lg overflow-hidden border border-[rgb(var(--glass-border))] text-sm">
      {languages.map((lang) => {
        const active = lang.code === current;
        return (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={`
              px-3 py-1.5 transition font-medium
              ${active
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : 'hover:bg-black/5 dark:hover:bg-white/5 text-[rgb(var(--muted))]'}
            `}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
