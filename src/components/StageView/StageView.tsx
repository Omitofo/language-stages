import type { Stage, StageUIState } from '../../types/stage';
import LanguageSwitcher from '../LanguageSwitcher';
import VariantSwitcher from '../VariantSwitcher';
import StepControls from './StepControls';
import CorePhrase from './CorePhrase';
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
      {/* Top bar: language + variant */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-14 border-b border-[rgb(var(--glass-border))] glass shrink-0">
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
        <div className="text-xs text-[rgb(var(--muted))] hidden sm:block">
          {stage.title.en}
        </div>
      </div>

      {/* Stage area */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url(${variant.background})`,
            backgroundColor: '#1e293b',
          }}
        />

        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

        {/* Characters + Dialogue — strong foreground layer */}
        <div className="absolute inset-0 overflow-hidden">
          {variant.characters?.map((ch) => {
            const isSpeaking = ch.id === currentSpeaker;
            const isCustomer = ch.id === 'customer';

            // --- Responsive character sizing & placement ---
            // Mobile: speaking character larger + closer to center; non-speaking smaller + side
            // Desktop: keep the original left/right staging from JSON
            let left = `${ch.position.x}%`;
            let sizeClass =
              'w-[52vw] max-w-[240px] sm:w-[44vw] sm:max-w-[260px] md:w-[30vw] md:max-w-[320px] lg:max-w-[360px]';
            let opacityClass = 'opacity-100';
            let zClass = 'z-[5]';

            if (isSpeaking) {
              // On mobile, pull the speaker toward center and make them bigger
              sizeClass =
                'w-[62vw] max-w-[280px] sm:w-[48vw] sm:max-w-[280px] md:w-[32vw] md:max-w-[340px] lg:max-w-[380px]';
              zClass = 'z-[10]';
              // Soft center bias only on the smallest screens
              if (isCustomer) {
                left = '32%'; // slightly right of pure left
              } else {
                left = '68%'; // slightly left of pure right
              }
            } else {
              // Non-speaking: smaller + a bit more faded on mobile so speaker owns the space
              sizeClass =
                'w-[40vw] max-w-[180px] sm:w-[38vw] sm:max-w-[220px] md:w-[28vw] md:max-w-[300px] lg:max-w-[340px]';
              opacityClass = 'opacity-60 sm:opacity-80 md:opacity-100';
              zClass = 'z-[4]';
            }

            const heightClass = 'h-[78vh] max-h-[600px]';

            return (
              <div
                key={ch.id}
                className={`absolute ${sizeClass} ${heightClass} -translate-x-1/2 pointer-events-none ${zClass} ${opacityClass} transition-all duration-400 ease-out`}
                style={{
                  left,
                  top: isCustomer ? '70%' : '66%',
                }}
              >
                {/* Speech bubble — only for the current speaker, attached above */}
                {isSpeaking && currentTurn && (
                  <div
                    className={`
                      absolute bottom-full mb-2 z-20
                      w-[min(300px,86vw)]
                      left-1/2 -translate-x-1/2
                    `}
                  >
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

      {/* Bottom controls — extra breathing room from the edge */}
      <div className="shrink-0 glass border-t border-[rgb(var(--glass-border))] px-4 md:px-6 pt-5 pb-7 md:pt-5 md:pb-6 space-y-3">
        <CorePhrase
          phrase={variant.corePhrase}
          romanization={variant.romanization}
        />
        <StepControls
          current={ui.currentStep}
          total={totalSteps}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </div>
  );
}
