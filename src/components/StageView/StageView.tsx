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
      <div className="flex-1 relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url(${variant.background})`,
            backgroundColor: '#1e293b',
          }}
        />

        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 pointer-events-none" />

        {/* Characters + Dialogue — strong foreground layer */}
        <div className="absolute inset-0 overflow-hidden">
          {variant.characters?.map((ch) => {
            const isSpeaking = ch.id === currentSpeaker;
            const isCustomer = ch.id === 'customer';

            // Horizontal placement from JSON, vertical forced low so legs clip under viewport
            // Bigger on mobile so they feel close; slightly more restrained on large screens
            const sizeClass =
              'w-[55vw] max-w-[260px] sm:w-[48vw] sm:max-w-[280px] md:w-[32vw] md:max-w-[340px] lg:max-w-[380px]';
            // Tall container so only upper ~55-60% of the character is visible
            const heightClass = 'h-[85vh] max-h-[640px]';

            return (
              <div
                key={ch.id}
                className={`absolute ${sizeClass} ${heightClass} -translate-x-1/2 pointer-events-none z-[5] transition-all duration-300`}
                style={{
                  left: `${ch.position.x}%`,
                  // Push further down so more of the body is clipped
                  top: isCustomer ? '68%' : '64%',
                }}
              >
                {/* Speech bubble — rendered relative to this character so it always stays attached */}
                {isSpeaking && currentTurn && (
                  <div
                    className={`
                      absolute bottom-full mb-3 z-20
                      w-max max-w-[min(280px,78vw)]
                      left-1/2 -translate-x-1/2
                      ${isCustomer ? 'sm:left-[60%] sm:-translate-x-1/3' : 'sm:left-[40%] sm:-translate-x-2/3'}
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

      {/* Bottom controls */}
      <div className="shrink-0 glass border-t border-[rgb(var(--glass-border))] px-4 md:px-6 py-4 space-y-3">
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
