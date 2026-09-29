import { useState, useEffect } from 'react';
import type { Stage, StageUIState, LevelGroup } from '../types/stage';
import { LEVEL_NAMES } from '../types/stage';
import Sidebar from './Sidebar/Sidebar';
import StageView from './StageView/StageView';

// Import all stages at build time (static)
// L00 — Survival
import excuseMe from '../../data/stages/L00/excuse-me.json';
import thisOnePlease from '../../data/stages/L00/this-one-please.json';
import onePlease from '../../data/stages/L00/one-please.json';
import twoPlease from '../../data/stages/L00/two-please.json';
import askForWater from '../../data/stages/L00/ask-for-water.json';
import askForCoffee from '../../data/stages/L00/ask-for-coffee.json';
import askForTea from '../../data/stages/L00/ask-for-tea.json';
import askForTheBill from '../../data/stages/L00/ask-for-the-bill.json';
import howMuchIsIt from '../../data/stages/L00/how-much-is-it.json';
import whatIsThis from '../../data/stages/L00/what-is-this.json';
import whereIsIt from '../../data/stages/L00/where-is-it.json';
import whereIsTheToilet from '../../data/stages/L00/where-is-the-toilet.json';
import whereIsTheStation from '../../data/stages/L00/where-is-the-station.json';
import whereIsTheExit from '../../data/stages/L00/where-is-the-exit.json';
import iDontUnderstand from '../../data/stages/L00/i-dont-understand.json';
import askToRepeat from '../../data/stages/L00/ask-to-repeat.json';
import imLearningJapanese from '../../data/stages/L00/im-learning-japanese.json';
import speakSlowly from '../../data/stages/L00/speak-slowly.json';
import thankYou from '../../data/stages/L00/thank-you.json';
// L01 — Basic Action
import iWantThis from '../../data/stages/L01/i-want-this.json';

const allStages: Stage[] = [
  // L00 — Survival (attention → request → info → repair → close)
  excuseMe as Stage,
  thisOnePlease as Stage,
  onePlease as Stage,
  twoPlease as Stage,
  askForWater as Stage,
  askForCoffee as Stage,
  askForTea as Stage,
  askForTheBill as Stage,
  howMuchIsIt as Stage,
  whatIsThis as Stage,
  whereIsIt as Stage,
  whereIsTheToilet as Stage,
  whereIsTheStation as Stage,
  whereIsTheExit as Stage,
  iDontUnderstand as Stage,
  askToRepeat as Stage,
  imLearningJapanese as Stage,
  speakSlowly as Stage,
  thankYou as Stage,
  // L01 — Basic Action
  iWantThis as Stage,
];

const LANG_STORAGE_KEY = 'ls-language';

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

/** Pick language for a stage: prefer global preference if available, else first key. */
function resolveLanguage(stage: Stage, preferred: string | null): string {
  const keys = Object.keys(stage.languages);
  if (preferred && keys.includes(preferred)) return preferred;
  return keys[0];
}

export default function App() {
  const [levels] = useState(() => groupByLevel(allStages));
  const [ui, setUi] = useState<StageUIState | null>(null);
  const [dark, setDark] = useState(false);
  // Global language preference (survives stage switches)
  const [preferredLanguage, setPreferredLanguage] = useState<string | null>(null);

  // Restore theme + preferred language
  useEffect(() => {
    const savedTheme = localStorage.getItem('ls-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang) setPreferredLanguage(savedLang);
  }, []);

  // Auto-select first stage so mobile isn't empty on load
  useEffect(() => {
    if (!ui && allStages.length > 0) {
      const stage = allStages[0];
      const language = resolveLanguage(stage, preferredLanguage);
      setUi({
        stageId: stage.id,
        language,
        variant: stage.languages[language].defaultVariant,
        currentStep: 0,
      });
    }
  }, [ui, preferredLanguage]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('ls-theme', next ? 'dark' : 'light');
  };

  const selectStage = (stageId: string) => {
    const stage = allStages.find((s) => s.id === stageId);
    if (!stage) return;
    const language = resolveLanguage(stage, preferredLanguage ?? ui?.language ?? null);
    const defaultVariant = stage.languages[language].defaultVariant;
    setUi({
      stageId,
      language,
      variant: defaultVariant,
      currentStep: 0,
    });
  };

  const updateUi = (partial: Partial<StageUIState>) => {
    setUi((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      if (partial.language && partial.language !== prev.language) {
        setPreferredLanguage(partial.language);
        localStorage.setItem(LANG_STORAGE_KEY, partial.language);
      }
      return next;
    });
  };

  const currentStage = ui ? allStages.find((s) => s.id === ui.stageId) || null : null;

  return (
    <div className="flex h-full w-full relative">
      <Sidebar
        levels={levels}
        activeStageId={ui?.stageId ?? null}
        onSelect={selectStage}
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
