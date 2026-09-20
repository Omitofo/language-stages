import type { Stage, StageUIState } from '../../types/stage';
import LanguageSwitcher from '../LanguageSwitcher';
import VariantSwitcher from '../VariantSwitcher';
import StepControls from './StepControls';
import Dialogue from './Dialogue';

interface Props {
  stage: Stage;
  ui: StageUIState;
  onUpdateUi: (partial: Partial<StageUIState>) => void;
}

export default function StageView({ stage, ui, onUpdateUi }: Props) {
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
  // Pointer leans toward the speaker: customer (left) ~28%, staff (right) ~72%
  const pointerOffset = currentSpeaker === 'customer' ? 28 : 72;

  return (
    <div className="h-full flex flex-col">
      {/* Top bar — compact on mobile so hamburger + switches don't feel crowded */}
      <div className="flex items-center gap-2 sm:gap-3 pl-12 pr-3 sm:pl-14 sm:pr-4 md:px-6 h-12 sm:h-14 border-b border-[rgb(var(--glass-border))] glass shrink-0 z-30">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
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
        </div>
        <div className="text-xs text-[rgb(var(--muted))] hidden sm:block truncate max-w-[40%] shrink-0">
          {stage.title.en}
        </div>
      </div>

      {/* Stage + controls — vertically centered with tighter spacing */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        {/* Stage frame */}
        <div
          className="
            relative w-full
            max-w-6xl lg:max-w-7xl
            h-[min(54vh,500px)] sm:h-[min(56vh,520px)] md:h-[min(58vh,560px)]
            rounded-2xl overflow-hidden
            border border-white/25 dark:border-white/10
            shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]
            bg-slate-900/20
            shrink-0
          "
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${variant.background})`,
              backgroundColor: '#1e293b',
            }}
          />

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Speech bubble — stays inside the frame with padding; pointer tracks speaker */}
          {currentTurn && (
            <div className="absolute left-3 right-3 top-3 sm:left-4 sm:right-4 sm:top-4 z-20 flex justify-center pointer-events-none">
              <div className="w-full max-w-[min(320px,100%)]">
                <Dialogue turn={currentTurn} pointerOffset={pointerOffset} />
              </div>
            </div>
          )}

          {/* Characters — static rule-of-thirds */}
          <div className="absolute inset-0 overflow-hidden">
            {variant.characters?.map((ch) => {
              const isSpeaking = ch.id === currentSpeaker;
              const isCustomer = ch.id === 'customer';

              const left = isCustomer ? '33%' : '67%';

              // Customer larger; staff smaller especially on mobile
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

        {/* Prev / Next — tight spacing under the stage */}
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
