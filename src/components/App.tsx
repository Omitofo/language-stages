import { useState, useEffect } from 'react';
import type { Stage, StageUIState, LevelGroup } from '../types/stage';
import { LEVEL_NAMES } from '../types/stage';
import Sidebar from './Sidebar/Sidebar';
import StageView from './StageView/StageView';

// Import all stages at build time (static)
import askForTheBill from '../../data/stages/L00/ask-for-the-bill.json';
import whereIsTheToilet from '../../data/stages/L00/where-is-the-toilet.json';
import askForWater from '../../data/stages/L00/ask-for-water.json';
import howMuchIsIt from '../../data/stages/L00/how-much-is-it.json';
import whereIsTheStation from '../../data/stages/L00/where-is-the-station.json';
import onePlease from '../../data/stages/L00/one-please.json';
import thisOnePlease from '../../data/stages/L00/this-one-please.json';
import iDontUnderstand from '../../data/stages/L00/i-dont-understand.json';

const allStages: Stage[] = [
  thisOnePlease as Stage,
  iDontUnderstand as Stage,
  whereIsTheToilet as Stage,
  askForWater as Stage,
  askForTheBill as Stage,
  howMuchIsIt as Stage,
  whereIsTheStation as Stage,
  onePlease as Stage,
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

  // On mobile start with sidebar closed (dropdown replaces it)
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  // Auto-select first stage so mobile isn't empty on load
  useEffect(() => {
    if (!ui && allStages.length > 0) {
      const stage = allStages[0];
      const language = Object.keys(stage.languages)[0];
      setUi({
        stageId: stage.id,
        language,
        variant: stage.languages[language].defaultVariant,
        currentStep: 0,
      });
    }
  }, [ui]);

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
        {currentStage && ui ? (
          <StageView
            stage={currentStage}
            ui={ui}
            onUpdateUi={updateUi}
            levels={levels}
            onSelectStage={selectStage}
            dark={dark}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-4">
              <h1 className="text-3xl font-display font-semibold tracking-tight">
                Language Stages
              </h1>
              <p className="text-[rgb(var(--muted))] text-lg">
                Select a stage to begin.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
