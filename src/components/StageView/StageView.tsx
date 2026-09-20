import type { Stage, StageUIState, LevelGroup } from '../../types/stage';
import LanguageSwitcher from '../LanguageSwitcher';
import VariantSwitcher from '../VariantSwitcher';
import StageDropdown from '../StageDropdown';
import StepControls from './StepControls';
import Dialogue from './Dialogue';

interface Props {
  stage: Stage;
  ui: StageUIState;
  onUpdateUi: (partial: Partial<StageUIState>) => void;
  levels: LevelGroup[];
  onSelectStage: (stageId: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export default function StageView({
  stage,
  ui,
  onUpdateUi,
  levels,
  onSelectStage,
  dark,
  onToggleTheme,
}: Props) {
  const langData = stage.languages[ui.language];
  if (!langData) return null;

  const variant = langData.variants[ui.variant] || langData.variants[langData.defaultVariant];
  if (!variant) return null;

  const availableLanguages = Object.keys(stage.languages);
  const availableVariants = Object.keys(langData.variants);
  const totalSteps = variant.dialogue.length;

  const setLanguage = (language: string) => {
    const newLang = stage.languages[language];
    onUpdateUi({
      language,
      variant: newLang.defaultVariant,
      currentStep: 0,
    });
  };

  const setVariant = (variantId: string) => {
    onUpdateUi({ variant: variantId, currentStep: 0 });
  };

  const next = () => {
    if (ui.currentStep < totalSteps - 1) {
      onUpdateUi({ currentStep: ui.currentStep + 1 });
    }
  };

  const prev = () => {
    if (ui.currentStep > 0) {
      onUpdateUi({ currentStep: ui.currentStep - 1 });
    }
  };

  const currentTurn = variant.dialogue[ui.currentStep];
  const currentSpeaker = currentTurn?.speaker;

  return (
    <div className="h-full flex flex-col">
      {/* Header — centered controls, theme icon on the right */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 h-14 md:h-12 glass !border-0 shrink-0 z-30">
        <LanguageSwitcher
          languages={availableLanguages.map((code) => ({
            code,
            label: stage.languages[code].label,
          }))}
          current={ui.language}
          onChange={setLanguage}
        />
        {availableVariants.length > 1 && (
          <VariantSwitcher
            variants={availableVariants.map((id) => ({
              id,
              label: langData.variants[id].label,
            }))}
            current={ui.variant}
            onChange={setVariant}
          />
        )}
        {/* Theme toggle — icon only, right side */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-lg leading-none hover:bg-black/5 dark:hover:bg-white/10 transition"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Stage + controls */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Mobile dropdown sits just above the stage image */}
        <div className="w-full max-w-6xl lg:max-w-7xl">
          <StageDropdown
            levels={levels}
            activeStageId={ui.stageId}
            activeTitle={stage.title.en}
            onSelect={onSelectStage}
          />
        </div>

        <div
          className="
            relative w-full
            max-w-6xl lg:max-w-7xl
            h-[min(52vh,480px)] sm:h-[min(56vh,520px)] md:h-[min(58vh,560px)]
            rounded-2xl overflow-hidden
            border border-white/25 dark:border-white/10
            shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]
            bg-slate-900/20
            shrink-0
          "
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${variant.background})`,
              backgroundColor: '#1e293b',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Mobile bubble — staff higher, customer a bit lower */}
          {currentTurn && (
            <div
              className={`
                md:hidden absolute left-3 right-3 z-20 flex justify-center pointer-events-none
                ${currentSpeaker === 'customer' ? 'top-20' : 'top-12'}
              `}
            >
              <div className="w-full max-w-[min(320px,100%)]">
                <Dialogue
                  turn={currentTurn}
                  pointerOffset={currentSpeaker === 'customer' ? 30 : 70}
                />
              </div>
            </div>
          )}

          {/* Characters + desktop bubble anchored above the speaker */}
          <div className="absolute inset-0 overflow-hidden">
            {variant.characters?.map((ch) => {
              const isSpeaking = ch.id === currentSpeaker;
              const isCustomer = ch.id === 'customer';
              const left = isCustomer ? '33%' : '67%';
              const sizeClass = isCustomer
                ? 'w-[72%] max-w-[340px] sm:max-w-[380px] md:w-[46%] md:max-w-[480px] lg:max-w-[540px]'
                : 'w-[42%] max-w-[180px] sm:max-w-[220px] md:w-[34%] md:max-w-[360px] lg:max-w-[400px]';

              return (
                <div
                  key={ch.id}
                  className={`
                    absolute ${sizeClass}
                    h-[92%] max-h-[640px]
                    -translate-x-1/2
                    pointer-events-none
                    transition-opacity duration-300
                    ${isSpeaking ? 'z-[10] opacity-100' : 'z-[5] opacity-70 md:opacity-90'}
                  `}
                  style={{
                    left,
                    top: isCustomer ? '42%' : '40%',
                  }}
                >
                  {/* Desktop/tablet: bubble sits directly above this character */}
                  {isSpeaking && currentTurn && (
                    <div className="hidden md:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-[min(280px,42vw)] z-20">
                      <Dialogue turn={currentTurn} pointerOffset={50} />
                    </div>
                  )}

                  <img
                    src={ch.src}
                    alt={ch.id}
                    className="w-full h-full object-contain object-top drop-shadow-2xl select-none"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 w-full max-w-6xl lg:max-w-7xl flex justify-center">
          <StepControls
            current={ui.currentStep}
            total={totalSteps}
            onPrev={prev}
            onNext={next}
          />
        </div>
      </div>
    </div>
  );
}
