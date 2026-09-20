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
            backgroundColor: '#1e293b', // fallback while image loads
          }}
        />

        {/* Soft overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Characters + Dialogue — characters live in the foreground layer */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Characters: large, lower, bottom half clipped under the stage for a strong 2D foreground feel */}
          {variant.characters?.map((ch) => {
            // Slightly different vertical bias so they don't sit at the exact same height
            const isCustomer = ch.id === 'customer';
            const top = isCustomer ? '62%' : '58%';
            const widthClass = 'w-[42vw] max-w-[220px] md:w-[28vw] md:max-w-[280px] lg:max-w-[320px]';
            // Tall enough that legs go below the viewport
            const heightClass = 'h-[70vh] max-h-[520px]';

            return (
              <div
                key={ch.id}
                className={`absolute ${widthClass} ${heightClass} -translate-x-1/2 pointer-events-none z-[5]`}
                style={{
                  left: `${ch.position.x}%`,
                  top,
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

          {/* Dialogue bubbles sit above the characters */}
          <Dialogue
            turns={variant.dialogue}
            currentStep={ui.currentStep}
            characters={variant.characters}
          />
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
