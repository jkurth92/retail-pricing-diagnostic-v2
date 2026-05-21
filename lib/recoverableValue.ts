import {
  MAX_SINGLE_THEME_HIGH_PCT,
} from "@/data/benchmarkOpportunityBands";
import type { CalibrationBand } from "@/data/opportunityCalibrationBands";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { EvidenceStrength } from "@/types/evidence-computation";

export type RecoverableValueInput = {
  band: CalibrationBand;
  confidenceLevel: DiagnosticConfidenceLevel;
  evidenceStrength: EvidenceStrength;
  confidenceWidthMult: number;
  exposureWidthMult: number;
  elasticityWidthMult: number;
  benchmarkWidthMult?: number;
  themeAffectedRevenuePct: number;
};

export type RecoverableValueResult = {
  rawLowPct: number;
  rawHighPct: number;
  combinedMultiplier: number;
  adjustedLowPct: number;
  adjustedHighPct: number;
  roundedLowPct: number;
  roundedHighPct: number;
  recoverablePoolNote: string;
};

/**
 * Deterministic recoverable strategic value pool — NOT optimized price changes.
 */
export function computeRecoverableValuePool(
  input: RecoverableValueInput,
): RecoverableValueResult {
  const rawLow = input.band.marginRangeLowPct;
  const rawHigh = input.band.marginRangeHighPct;

  const benchmarkMult = input.benchmarkWidthMult ?? 1;
  const combined =
    input.confidenceWidthMult *
    input.exposureWidthMult *
    input.elasticityWidthMult *
    benchmarkMult;

  const adjustedLow = rawLow * combined;
  const adjustedHigh = Math.min(rawHigh * combined, MAX_SINGLE_THEME_HIGH_PCT);
  const roundedLow = parseFloat(adjustedLow.toFixed(1));
  const roundedHigh = parseFloat(
    Math.max(adjustedHigh, roundedLow + 0.1).toFixed(1),
  );

  const note =
    input.themeAffectedRevenuePct > 0
      ? `Thematic pool sized with ${input.themeAffectedRevenuePct}% in-scope revenue exposure — directional recoverable value, not SKU optimization.`
      : "Thematic pool sized without category exposure linkage — directional only.";

  return {
    rawLowPct: rawLow,
    rawHighPct: rawHigh,
    combinedMultiplier: combined,
    adjustedLowPct: adjustedLow,
    adjustedHighPct: adjustedHigh,
    roundedLowPct: roundedLow,
    roundedHighPct: roundedHigh,
    recoverablePoolNote: note,
  };
}
