import type { LevelGroup } from '../../types/stage';

interface Props {
  levels: LevelGroup[];
  activeStageId: string | null;
  onSelect: (stageId: string) => void;
}

/**
 * Desktop sidebar — always expanded (full titles).
 * Mobile uses StageDropdown instead (hidden below md).
 */
export default function Sidebar({ levels, activeStageId, onSelect }: Props) {
  return (
    <aside
      className="
        hidden md:flex
        w-[var(--sidebar-w)] shrink-0
        flex-col
        glass !border-y-0 !border-l-0 !rounded-none
        z-40
      "
    >
      <div className="flex items-center h-14 px-5 border-b border-[rgb(var(--glass-border)/0.6)]">
        <span className="font-display font-semibold tracking-tight text-sm">
          Language Stages
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {levels.map((level) => (
          <div key={level.id} className="mb-5">
            <div className="px-3 mb-2 text-[10px] uppercase tracking-swiss text-[rgb(var(--muted))] font-medium">
              {level.id}
              <span className="mx-1.5 opacity-40">·</span>
              {level.name}
            </div>
            <ul className="space-y-0.5">
              {level.stages.map((stage) => {
                const isActive = stage.id === activeStageId;
                return (
                  <li key={stage.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(stage.id)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150
                        ${isActive
                          ? 'nav-active'
                          : 'text-[rgb(var(--fg))] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'}
                      `}
                      title={stage.title.en}
                    >
                      {stage.title.en}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
