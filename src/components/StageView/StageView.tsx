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

  return (
    <div className="h-full flex flex-col">
      {/* Top bar: language + variant only */}
      <div className="flex items-center justify-between gap-4 pl-14 pr-4 md:px-6 h-14 border-b border-[rgb(var(--glass-border))] glass shrink-0 z-30">
        <div className="flex items-center gap-3">
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
        <div className="text-xs text-[rgb(var(--muted))] hidden sm:block truncate max-w-[40%]">
          {stage.title.en}
        </div>
      </div>

      {/* Stage canvas + controls below */}
      <div className="flex-1 min-h-0 flex flex-col items-center pt-3 sm:pt-4 md:pt-5 px-3 sm:px-4 md:px-6 pb-6 md:pb-10">
        {/* Stage frame */}
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

          {/* Mobile speech bubble — safe centered zone under the top edge */}
          {currentTurn && (
            <div className="md:hidden absolute left-3 right-3 top-3 z-20 flex justify-center pointer-events-none">
              <div className="w-full max-w-[min(300px,100%)]">
                <Dialogue turn={currentTurn} />
              </div>
            </div>
          )}

          {/* Characters — static rule-of-thirds positions; only dialogue text changes */}
          <div className="absolute inset-0 overflow-hidden">
            {variant.characters?.map((ch) => {
              const isSpeaking = ch.id === currentSpeaker;
              const isCustomer = ch.id === 'customer';

              // Rule of thirds: left third ~33%, right third ~67%
              const left = isCustomer ? '33%' : '67%';

              return (
                <div
                  key={ch.id}
                  className="
                    absolute
                    w-[62%] max-w-[300px]
                    sm:max-w-[340px]
                    md:w-[40%] md:max-w-[420px]
                    lg:max-w-[480px]
                    h-[90%] max-h-[620px]
                    -translate-x-1/2
                    pointer-events-none
                    z-[5]
                    transition-opacity duration-300
                  "
                  style={{
                    left,
                    // Low in the frame for a closer feel
                    top: isCustomer ? '36%' : '32%',
                  }}
                >
                  {/* Desktop bubble above the speaking character */}
                  {isSpeaking && currentTurn && (
                    <div className="hidden md:block absolute bottom-full mb-2 z-20 left-1/2 -translate-x-1/2 w-[min(300px,40vw)]">
                      <Dialogue turn={currentTurn} />
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

        {/* Prev / Next — below the stage container, spaced + centered */}
        <div className="mt-5 sm:mt-6 w-full max-w-6xl lg:max-w-7xl flex justify-center">
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
