/**
 * Calibration proportionality — tightens opportunity width and confidence inflation
 * without changing benchmark band tables or core diagnostic frameworks.
 */

import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { EvidenceStrength } from "@/types/evidence-computation";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";
import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import type { EvidenceCoverageAssessment } from "@/types/data-interpretation";
import type { ArchitectureSignalResult } from "@/lib/architectureSignals";

export type ProportionalityContext = {
  evidenceStrength?: EvidenceStrength;
  architectureCompressionCategories?: number;
  architectureAffectedRevenuePct?: number;
  strongMetricCount?: number;
  evidenceCoverageScore?: number;
  sufficiencyLevel?: EvidenceCoverageAssessment["sufficiencyLevel"];
  inferenceHeavy?: boolean;
};

export function portfolioOverlapFactor(ctx?: ProportionalityContext): number {
  const base = OUTPUT_CALIBRATION_RULES.marginOverlapFactor;
  if (!ctx) return base;
  let factor = base;
  if (ctx.evidenceStrength === "moderate") factor *= 0.92;
  if (ctx.evidenceStrength === "weak") factor *= 0.85;
  if ((ctx.architectureCompressionCategories ?? 0) <= 1) factor *= 0.9;
  if (ctx.inferenceHeavy) factor *= 0.88;
  return Math.max(0.38, Math.min(base, factor));
}

/** Per-theme high endpoint cap from evidence severity (not benchmark tables). */
export function themeHighCapPct(
  evidenceStrength: EvidenceStrength,
  confidenceLevel: DiagnosticConfidenceLevel,
  familyIsArchitecture: boolean,
): number {
  let cap = familyIsArchitecture ? 1.5 : 1.1;
  if (evidenceStrength === "weak") cap = Math.min(cap, 0.9);
  else if (evidenceStrength === "moderate") cap = Math.min(cap, 1.25);
  else if (evidenceStrength === "strong") cap = Math.min(cap, 1.5);

  if (confidenceLevel === "low") cap = Math.min(cap, 0.85);
  else if (confidenceLevel === "medium") cap = Math.min(cap, 1.15);
  else if (confidenceLevel === "medium_high") cap = Math.min(cap, 1.35);

  return cap;
}

export function calibratePortfolioRangeEndpoints(
  low: number,
  high: number,
  ctx: ProportionalityContext,
): { lowPct: number; highPct: number } {
  const archCats = ctx.architectureCompressionCategories ?? 0;
  const strong = ctx.strongMetricCount ?? 0;
  const strength = ctx.evidenceStrength ?? "moderate";

  let maxHigh = 2.2;
  if (strength === "weak") maxHigh = 1.1;
  else if (strength === "moderate") {
    if (archCats >= 3 && strong >= 2) maxHigh = 1.8;
    else if (archCats >= 2) maxHigh = 1.5;
    else maxHigh = 1.4;
  } else if (strength === "strong") {
    if (archCats >= 4 && strong >= 3) maxHigh = 2.5;
    else if (archCats >= 2) maxHigh = 2.0;
    else maxHigh = 1.7;
  }

  if (ctx.inferenceHeavy || ctx.sufficiencyLevel === "low") {
    maxHigh = Math.min(maxHigh, 1.35);
  }
  if ((ctx.evidenceCoverageScore ?? 1) < 0.45) {
    maxHigh = Math.min(maxHigh, 1.25);
  }

  const minSpan = 0.5;
  let adjustedHigh = Math.min(high, maxHigh);
  let adjustedLow = Math.min(low, adjustedHigh - minSpan);
  adjustedLow = Math.max(0.4, adjustedLow);
  adjustedHigh = Math.max(adjustedLow + minSpan, adjustedHigh);

  return {
    lowPct: Math.round(adjustedLow * 10) / 10,
    highPct: Math.round(adjustedHigh * 10) / 10,
  };
}

export function proportionalityContextFromSignals(
  evidenceStrength?: EvidenceStrength,
  arch?: ArchitectureSignalResult,
  coverage?: EvidenceCoverageAssessment | null,
  strongMetricCount = 0,
): ProportionalityContext {
  const inferenceHeavy =
    coverage != null &&
    (coverage.sufficiencyLevel === "low" ||
      coverage.overallScore < 0.5 ||
      coverage.dimensions.some((d) => /infer|proxy|partial/i.test(d.note ?? "")));

  return {
    evidenceStrength,
    architectureCompressionCategories: arch?.compressionCategories.length ?? 0,
    architectureAffectedRevenuePct: undefined,
    strongMetricCount,
    evidenceCoverageScore: coverage?.overallScore,
    sufficiencyLevel: coverage?.sufficiencyLevel,
    inferenceHeavy,
  };
}

export function applyProportionalPortfolioCalibration(
  result: {
    rangeText: string;
    trace: OpportunityCalculationTrace | null;
  },
  ctx: ProportionalityContext,
): { rangeText: string; trace: OpportunityCalculationTrace | null } {
  const match = result.rangeText.match(
    /(\d+(?:\.\d+)?)\s*%?\s*[–-]\s*(\d+(?:\.\d+)?)\s*%/,
  );
  if (!match || !result.trace) return result;

  const low = parseFloat(match[1]);
  const high = parseFloat(match[2]);
  const { lowPct, highPct } = calibratePortfolioRangeEndpoints(low, high, ctx);
  const display = `${lowPct}%–${highPct}% indicative margin opportunity (thematic, non-additive)`;

  return {
    rangeText: display,
    trace: {
      ...result.trace,
      finalRange: { lowPct, highPct, display },
      intermediateSteps: [
        ...result.trace.intermediateSteps,
        {
          label: "6. Proportionality calibration",
          value: `${lowPct}% – ${highPct}%`,
          detail:
            "Upper bound tightened to align with evidence severity and overlap discipline.",
        },
      ],
      formulaSummary: `${result.trace.formulaSummary ?? ""} · proportionality cap applied`,
    },
  };
}

export function categoryArchitectureFraming(
  arch: ArchitectureSignalResult,
): string[] {
  const lines: string[] = [];
  for (const category of arch.compressionCategories.slice(0, 3)) {
    lines.push(`Compressed premium spacing in ${category}`);
  }
  for (const category of arch.plNbNarrowCategories.slice(0, 2)) {
    if (!arch.compressionCategories.includes(category)) {
      lines.push(`Weaker monetization separation in ${category}`);
    }
  }
  return lines;
}
