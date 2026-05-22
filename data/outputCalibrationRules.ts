/**
 * Output calibration constants — tuning presentation only, not diagnostic logic families.
 */
export const OUTPUT_CALIBRATION_RULES = {
  maxPrimaryThemes: 5,
  maxSecondaryThemes: 2,
  maxSurfacedHypotheses: 5,
  /** Flag themes whose margin band span exceeds this (percentage points). */
  maxThemeMarginSpanPct: 2.8,
  /** Flag aggregated storyline span above this (percentage points). */
  maxAggregatedMarginSpanPct: 4.5,
  marginOverlapFactor: 0.46,
  architectureFamilyBoost: 18,
  minPrimaryThemesPreferred: 2,
  maxStorylineSectionThemesListed: 3,
  maxImplicationsSurfaced: 8,
  revenueSensitivitySecondary: true,
  suppressDuplicateThemeFamilies: true,
  confidencePrimaryBar: ["medium", "medium_high", "high"] as const,
  narrativeMaxParagraphs: 4,
} as const;

export const CALIBRATION_NOTES = [
  "Primary themes capped at five; architecture-weighted ranking preserved.",
  "Margin totals use overlap factor — not additive dollar math.",
  "Revenue sensitivity is always secondary to margin opportunity.",
  "Low-confidence hypotheses and themes are suppressed from the executive readout.",
] as const;
