/**
 * Refinement state — consultant-controlled narrative adjustments (non-destructive).
 */

import type {
  RefinementEmphasis,
  RefinementSliderState,
  RefinementState,
  RefinementTrailEntry,
  RefinementWorkflowMode,
} from "@/types/refinement";

export const DEFAULT_REFINEMENT_SLIDERS: RefinementSliderState = {
  opportunityFraming: 50,
  architectureEmphasis: 50,
  confidenceAdjustment: 50,
};

export const NEUTRAL_REFINEMENT_EMPHASIS: RefinementEmphasis = {
  architectureWeight: 0,
  kviWeight: 0,
  promoWeight: 0,
  premiumizationWeight: 0,
  plNbWeight: 0,
  opportunityWidthFactor: 1,
  confidenceTone: "neutral",
  categoryBoosts: [],
  categoryDeprioritize: [],
  maturityHint: "neutral",
};

export function createInitialRefinementState(): RefinementState {
  return {
    sliders: { ...DEFAULT_REFINEMENT_SLIDERS },
    feedbackText: "",
    mode: "base",
    activeEmphasis: null,
    appliedEmphasis: null,
    trail: [],
  };
}

export function mergeRefinementEmphasis(
  base: RefinementEmphasis,
  patch: Partial<RefinementEmphasis>,
): RefinementEmphasis {
  return {
    architectureWeight: clamp(
      base.architectureWeight + (patch.architectureWeight ?? 0),
      -1,
      1,
    ),
    kviWeight: clamp(base.kviWeight + (patch.kviWeight ?? 0), -1, 1),
    promoWeight: clamp(base.promoWeight + (patch.promoWeight ?? 0), -1, 1),
    premiumizationWeight: clamp(
      base.premiumizationWeight + (patch.premiumizationWeight ?? 0),
      -1,
      1,
    ),
    plNbWeight: clamp(base.plNbWeight + (patch.plNbWeight ?? 0), -1, 1),
    opportunityWidthFactor: clamp(
      base.opportunityWidthFactor * (patch.opportunityWidthFactor ?? 1),
      0.82,
      1.15,
    ),
    confidenceTone: patch.confidenceTone ?? base.confidenceTone,
    categoryBoosts: dedupeCi([
      ...base.categoryBoosts,
      ...(patch.categoryBoosts ?? []),
    ]),
    categoryDeprioritize: dedupeCi([
      ...base.categoryDeprioritize,
      ...(patch.categoryDeprioritize ?? []),
    ]),
    maturityHint: patch.maturityHint ?? base.maturityHint,
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function dedupeCi(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

export function refinementBadgesFromTrail(trail: RefinementTrailEntry[]): string[] {
  const labels = trail.map((t) => t.label);
  return [...new Set(labels)].slice(0, 8);
}

export function refinementModeLabel(mode: RefinementWorkflowMode): string {
  if (mode === "preview") return "Previewing refinements";
  if (mode === "applied") return "Refined by user emphasis";
  return "Engine-generated interpretation";
}

export function isRefinementActive(state: RefinementState): boolean {
  return state.mode === "preview" || state.mode === "applied";
}
