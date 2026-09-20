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
      {/* Top bar: language + variant — pl-14 on mobile so hamburger doesn't overlap */}
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
        <div className="text-xs text-[rgb(var(--muted))] hidden sm:block">
          {stage.title.en}
        </div>
      </div>

      {/* Stage area — full remaining height */}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30 pointer-events-none" />

        {/* Controls overlay — glass card for contrast */}
        <div className="absolute top-0 left-0 right-0 z-20 px-3 md:px-6 pt-3 pb-2 pointer-events-none">
          <div className="pointer-events-auto max-w-lg mx-auto">
            <div className="glass-strong rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-xl space-y-3 border border-white/10">
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
        </div>

        {/* Mobile: centered speech bubble in a safe zone (avoids going off-frame) */}
        {currentTurn && (
          <div className="md:hidden absolute left-3 right-3 top-[7.5rem] z-20 flex justify-center pointer-events-none">
            <div className="w-full max-w-[min(300px,100%)]">
              <Dialogue turn={currentTurn} />
            </div>
          </div>
        )}

        {/* Characters + desktop speech bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {variant.characters?.map((ch) => {
            const isSpeaking = ch.id === currentSpeaker;
            const isCustomer = ch.id === 'customer';

            let left = `${ch.position.x}%`;
            let sizeClass =
              'w-[50vw] max-w-[230px] sm:w-[42vw] sm:max-w-[250px] md:w-[30vw] md:max-w-[320px] lg:max-w-[360px]';
            let opacityClass = 'opacity-100';
            let zClass = 'z-[5]';

            if (isSpeaking) {
              sizeClass =
                'w-[58vw] max-w-[270px] sm:w-[46vw] sm:max-w-[270px] md:w-[32vw] md:max-w-[340px] lg:max-w-[380px]';
              zClass = 'z-[10]';
              if (isCustomer) {
                left = '34%';
              } else {
                left = '66%';
              }
            } else {
              sizeClass =
                'w-[38vw] max-w-[170px] sm:w-[36vw] sm:max-w-[210px] md:w-[28vw] md:max-w-[300px] lg:max-w-[340px]';
              opacityClass = 'opacity-55 sm:opacity-75 md:opacity-100';
              zClass = 'z-[4]';
            }

            const heightClass = 'h-[70vh] max-h-[540px]';

            return (
              <div
                key={ch.id}
                className={`absolute ${sizeClass} ${heightClass} -translate-x-1/2 pointer-events-none ${zClass} ${opacityClass} transition-all duration-400 ease-out`}
                style={{
                  left,
                  top: isCustomer ? '74%' : '70%',
                }}
              >
                {/* Desktop only: bubble attached above the character */}
                {isSpeaking && currentTurn && (
                  <div className="hidden md:block absolute bottom-full mb-2 z-20 left-1/2 -translate-x-1/2 w-[min(280px,40vw)]">
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
    </div>
  );
}
