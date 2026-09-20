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

          {/* Characters — larger + lower for a closer, more intimate framing */}
          <div className="absolute inset-0 overflow-hidden">
            {variant.characters?.map((ch) => {
              const isSpeaking = ch.id === currentSpeaker;
              const isCustomer = ch.id === 'customer';

              let left = `${ch.position.x}%`;
              // Larger sizes for a close-up feel
              let sizeClass =
                'w-[70%] max-w-[340px] sm:max-w-[380px] md:w-[46%] md:max-w-[460px] lg:max-w-[520px]';
              let opacityClass = 'opacity-100';
              let zClass = 'z-[5]';

              if (isSpeaking) {
                sizeClass =
                  'w-[82%] max-w-[400px] sm:max-w-[440px] md:w-[52%] md:max-w-[520px] lg:max-w-[580px]';
                zClass = 'z-[10]';
                if (isCustomer) left = '30%';
                else left = '70%';
              } else {
                sizeClass =
                  'w-[58%] max-w-[280px] sm:max-w-[320px] md:w-[38%] md:max-w-[400px] lg:max-w-[460px]';
                opacityClass = 'opacity-55 sm:opacity-75 md:opacity-100';
                zClass = 'z-[4]';
              }

              return (
                <div
                  key={ch.id}
                  className={`absolute ${sizeClass} h-[92%] max-h-[640px] -translate-x-1/2 pointer-events-none ${zClass} ${opacityClass} transition-all duration-400 ease-out`}
                  style={{
                    left,
                    // Lower in the frame so faces sit more in the foreground
                    top: isCustomer ? '38%' : '34%',
                  }}
                >
                  {/* Desktop bubble above speaker */}
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
