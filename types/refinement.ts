/** Human-in-the-loop diagnostic refinement — presentation layer only. */

export type RefinementSliderState = {
  /** 0 = conservative opportunity framing, 100 = aggressive */
  opportunityFraming: number;
  /** 0 = lower architecture weighting, 100 = higher */
  architectureEmphasis: number;
  /** 0 = cautious narrative, 100 = assertive narrative */
  confidenceAdjustment: number;
};

export type RefinementConfidenceTone = "cautious" | "neutral" | "assertive";

export type RefinementEmphasis = {
  architectureWeight: number;
  kviWeight: number;
  promoWeight: number;
  premiumizationWeight: number;
  plNbWeight: number;
  opportunityWidthFactor: number;
  confidenceTone: RefinementConfidenceTone;
  categoryBoosts: string[];
  categoryDeprioritize: string[];
  maturityHint: "lower" | "neutral" | "higher";
};

export type RefinementTrailSource = "slider" | "feedback" | "apply" | "reset";

export type RefinementTrailEntry = {
  id: string;
  label: string;
  source: RefinementTrailSource;
};

export type RefinementWorkflowMode = "base" | "preview" | "applied";

export type RefinementState = {
  sliders: RefinementSliderState;
  feedbackText: string;
  mode: RefinementWorkflowMode;
  /** Active emphasis when previewing or after apply */
  activeEmphasis: RefinementEmphasis | null;
  appliedEmphasis: RefinementEmphasis | null;
  trail: RefinementTrailEntry[];
};

export type RefinementPresentationMeta = {
  mode: RefinementWorkflowMode;
  badges: string[];
  trail: RefinementTrailEntry[];
  isUserRefined: boolean;
};
