export const MEMO_TITLE_PREFIX = "Pricing Diagnostic — Executive Memo";

export const MEMO_EXECUTIVE_ANSWER_HEADING = "Executive Answer";

export const MEMO_STRUCTURAL_THEMES_HEADING = "Structural Themes";

export const MEMO_LEADERSHIP_HEADING = "Leadership Focus Areas / Key Questions";

export const DEFAULT_LEADERSHIP_QUESTIONS = [
  "Is visible value investment concentrated in the highest-impact categories?",
  "Does current architecture adequately support premiumization and trade-up?",
  "Is promotional intensity reinforcing or replacing base-price architecture?",
] as const;

export const MEMO_COHERENCE_LABELS = {
  strong: "Pricing architecture appears broadly coherent with selective structural tension.",
  mixed:
    "Pricing architecture shows mixed coherence — opportunity likely concentrates in structure and role clarity.",
  constrained:
    "Pricing architecture appears constrained — coherence and monetization may be competing priorities.",
} as const;

export const MEMO_FOOTER_NOTE =
  "Draft executive memo — consultant-refinable. Not a recommendation or optimization output.";
