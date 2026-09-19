/**
 * Core TypeScript types for language-stages.
 * This is the single source of truth for the data model.
 * Keep in sync with SYSTEM.md.
 */

export type StageStatus = "draft" | "ready";

export type LevelId =
  | "L00"
  | "L01"
  | "L02"
  | "L03"
  | "L04"
  | "L05"
  | "L06"
  | "L07+";

export interface CharacterPlacement {
  id: string; // e.g. "customer", "staff"
  src: string; // path to transparent PNG
  position: {
    x: number; // % from left
    y: number; // % from top
  };
}

export interface DialogueTurn {
  speaker: string; // must match a character id if characters are defined
  text: string;
  romanization?: string | null;
}

export interface StageVariant {
  label: string;
  background: string;
  corePhrase: string;
  romanization?: string | null;
  characters?: CharacterPlacement[];
  dialogue: DialogueTurn[];
}

export interface LanguageData {
  label: string;
  defaultVariant: string;
  variants: Record<string, StageVariant>;
}

export interface Stage {
  id: string;
  level: LevelId;
  title: {
    en: string;
    [lang: string]: string;
  };
  circumstance: {
    en: string;
    [lang: string]: string;
  };
  status: StageStatus;
  sourceInspiration?: string;
  languages: Record<string, LanguageData>;
}

/** Runtime UI state for the active stage */
export interface StageUIState {
  stageId: string;
  language: string;
  variant: string;
  currentStep: number;
}

/** Grouped structure used by the sidebar */
export interface LevelGroup {
  id: LevelId;
  name: string;
  stages: Stage[];
}

export const LEVEL_NAMES: Record<LevelId, string> = {
  L00: "Survival",
  L01: "Basic Action",
  L02: "Description",
  L03: "Interaction",
  L04: "Time & Experience",
  L05: "Plans & Future",
  L06: "Conversation",
  "L07+": "Complex",
};
