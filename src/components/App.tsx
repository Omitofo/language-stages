import { useState, useEffect } from 'react';
import type { Stage, StageUIState, LevelGroup } from '../types/stage';
import { LEVEL_NAMES } from '../types/stage';
import Sidebar from './Sidebar/Sidebar';
import StageView from './StageView/StageView';

// Import all stages at build time (static)
import askForTheBill from '../../data/stages/L00/ask-for-the-bill.json';

const allStages: Stage[] = [
  askForTheBill as Stage,
  // Add more stages here as they are created
];

function groupByLevel(stages: Stage[]): LevelGroup[] {
  const map = new Map<string, Stage[]>();
  for (const s of stages) {
    const list = map.get(s.level) || [];
    list.push(s);
    map.set(s.level, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, stages]) => ({
      id: id as any,
      name: LEVEL_NAMES[id as keyof typeof LEVEL_NAMES] || id,
      stages,
    }));
}

export default function App() {
  const [levels] = useState(() => groupByLevel(allStages));
  const [ui, setUi] = useState<StageUIState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);

  // Restore theme preference
  useEffect(() => {
    const saved = localStorage.getItem('ls-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // On mobile start with sidebar closed so the stage is visible immediately
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('ls-theme', next ? 'dark' : 'light');
  };

  const selectStage = (stageId: string) => {
    const stage = allStages.find((s) => s.id === stageId);
    if (!stage) return;
    const langKeys = Object.keys(stage.languages);
    const language = langKeys[0];
    const defaultVariant = stage.languages[language].defaultVariant;
    setUi({
      stageId,
      language,
      variant: defaultVariant,
      currentStep: 0,
    });
    // On mobile close sidebar after selection
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const updateUi = (partial: Partial<StageUIState>) => {
    setUi((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  const currentStage = ui ? allStages.find((s) => s.id === ui.stageId) || null : null;

  return (
    <div className="flex h-full w-full relative">
      <Sidebar
        levels={levels}
        activeStageId={ui?.stageId ?? null}
        onSelect={selectStage}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        dark={dark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 relative overflow-hidden min-w-0">
        {/* Mobile menu button — borderless, no glass frame */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden fixed top-3.5 left-3 z-50 p-2 rounded-lg text-[rgb(var(--fg))] hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {currentStage && ui ? (
          <StageView
            stage={currentStage}
            ui={ui}
            onUpdateUi={updateUi}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-3xl font-display font-semibold tracking-tight">
                Language Stages
              </h1>
              <p className="text-[rgb(var(--muted))] text-lg">
                Select a stage from the sidebar to begin.
              </p>
              <p className="text-sm text-[rgb(var(--muted))]">
                Study the same communicative situation across languages.
              </p>
              {/* Mobile helper when no stage selected */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden mt-4 px-5 py-2.5 rounded-xl glass-strong text-sm font-medium"
              >
                Open stages
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
