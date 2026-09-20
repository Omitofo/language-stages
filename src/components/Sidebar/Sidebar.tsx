import type { LevelGroup } from '../../types/stage';

interface Props {
  levels: LevelGroup[];
  activeStageId: string | null;
  onSelect: (stageId: string) => void;
  open: boolean;
  onToggle: () => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export default function Sidebar({
  levels,
  activeStageId,
  onSelect,
  open,
  onToggle,
  dark,
  onToggleTheme,
}: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 flex flex-col
          glass !border-0
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}
        `}
      >
        {/* Header — no separator border */}
        <div className="flex items-center justify-between px-4 h-14">
          {open && (
            <span className="font-display font-semibold tracking-tight text-sm">
              Language Stages
            </span>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Levels tree */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {levels.map((level) => (
            <div key={level.id} className="mb-4">
              {open && (
                <div className="px-2 mb-1 text-[10px] uppercase tracking-widest text-[rgb(var(--muted))] font-medium">
                  {level.id} — {level.name}
                </div>
              )}
              <ul className="space-y-0.5">
                {level.stages.map((stage) => {
                  const isActive = stage.id === activeStageId;
                  return (
                    <li key={stage.id}>
                      <button
                        onClick={() => onSelect(stage.id)}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition
                          ${isActive
                            ? 'bg-neon-cyan/15 text-neon-cyan font-medium neon-border'
                            : 'hover:bg-black/5 dark:hover:bg-white/5 text-[rgb(var(--fg))]'}
                        `}
                        title={stage.title.en}
                      >
                        {open ? stage.title.en : stage.id.slice(0, 2)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer — no separator border */}
        <div className="p-3">
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            {dark ? '☀️' : '🌙'}
            {open && <span>{dark ? 'Light' : 'Dark'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
