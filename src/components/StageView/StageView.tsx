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

      {/* Stage canvas — constrained container with glossy border, not full-bleed */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div
          className="
            relative w-full h-full
            max-w-5xl max-h-[780px]
            rounded-2xl overflow-hidden
            border border-white/25 dark:border-white/10
            shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]
            bg-slate-900/20
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Mobile speech bubble — safe centered zone under the top edge */}
          {currentTurn && (
            <div className="md:hidden absolute left-3 right-3 top-3 z-20 flex justify-center pointer-events-none">
              <div className="w-full max-w-[min(300px,100%)]">
                <Dialogue turn={currentTurn} />
              </div>
            </div>
          )}

          {/* Characters */}
          <div className="absolute inset-0 overflow-hidden">
            {variant.characters?.map((ch) => {
              const isSpeaking = ch.id === currentSpeaker;
              const isCustomer = ch.id === 'customer';

              let left = `${ch.position.x}%`;
              let sizeClass =
                'w-[48%] max-w-[220px] sm:max-w-[240px] md:w-[30%] md:max-w-[300px] lg:max-w-[340px]';
              let opacityClass = 'opacity-100';
              let zClass = 'z-[5]';

              if (isSpeaking) {
                sizeClass =
                  'w-[55%] max-w-[260px] sm:max-w-[270px] md:w-[32%] md:max-w-[320px] lg:max-w-[360px]';
                zClass = 'z-[10]';
                if (isCustomer) left = '34%';
                else left = '66%';
              } else {
                sizeClass =
                  'w-[36%] max-w-[160px] sm:max-w-[190px] md:w-[26%] md:max-w-[280px] lg:max-w-[320px]';
                opacityClass = 'opacity-55 sm:opacity-75 md:opacity-100';
                zClass = 'z-[4]';
              }

              return (
                <div
                  key={ch.id}
                  className={`absolute ${sizeClass} h-[65%] max-h-[480px] -translate-x-1/2 pointer-events-none ${zClass} ${opacityClass} transition-all duration-400 ease-out`}
                  style={{
                    left,
                    top: isCustomer ? '58%' : '54%',
                  }}
                >
                  {/* Desktop bubble above speaker */}
                  {isSpeaking && currentTurn && (
                    <div className="hidden md:block absolute bottom-full mb-2 z-20 left-1/2 -translate-x-1/2 w-[min(260px,36vw)]">
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

          {/* Prev / Next — bottom of the stage container, over the scene */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-8 pointer-events-none bg-gradient-to-t from-black/40 to-transparent">
            <div className="pointer-events-auto flex justify-center">
              <StepControls
                current={ui.currentStep}
                total={totalSteps}
                onPrev={prev}
                onNext={next}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
