/**
 * Graceful degradation — preserve directional opportunity under imperfect data.
 */

import { formatMarginRange } from "@/lib/opportunityAggregator";
import type { EvidenceCoverageAssessment } from "@/types/data-interpretation";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { EvidenceStrength } from "@/types/evidence-computation";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

const ARCHETYPE_DIRECTIONAL_BANDS: Record<
  RetailerArchetypeId,
  { low: number; high: number }
> = {
  mass: { low: 0.6, high: 1.4 },
  grocery: { low: 0.7, high: 1.6 },
  discount: { low: 0.5, high: 1.4 },
  premium_grocery: { low: 0.8, high: 2.0 },
  club: { low: 0.5, high: 1.3 },
  convenience: { low: 0.4, high: 1.2 },
  specialty: { low: 0.9, high: 2.2 },
  apparel_softlines: { low: 1.0, high: 2.4 },
};

export function buildDirectionalFallbackRange(
  archetypeId: RetailerArchetypeId,
  coverage: EvidenceCoverageAssessment,
  evidenceStrength?: EvidenceStrength,
): string {
  const band = ARCHETYPE_DIRECTIONAL_BANDS[archetypeId] ?? {
    low: 0.8,
    high: 2.0,
  };
  const width = coverage.rangeWidthMultiplier;
  const low = band.low * (evidenceStrength === "weak" ? 0.85 : 1) * width;
  const high = band.high * width;
  return `${formatMarginRange(low, high)} — directional; evidence quality constrained`;
}

export function buildDegradedOpportunityMessage(
  coverage: EvidenceCoverageAssessment,
): string {
  if (coverage.sufficiencyLevel === "low") {
    return "Directional architecture opportunity identified; ranges widened because normalization and field coverage remain partial.";
  }
  return "Moderate directional opportunity identified, though evidence quality is constrained by incomplete architecture normalization.";
}

export type GracefulOpportunityResult = {
  rangeText: string;
  trace: OpportunityCalculationTrace | null;
  usedFallback: boolean;
};

export function applyGracefulOpportunityAggregation(
  primaryThemes: ExecutiveTheme[],
  secondaryThemes: ExecutiveTheme[],
  archetypeId: RetailerArchetypeId,
  coverage: EvidenceCoverageAssessment,
  evidenceStrength?: EvidenceStrength,
  existingCompute?: () => GracefulOpportunityResult,
): GracefulOpportunityResult {
  const computed = existingCompute?.();
  if (computed && !computed.rangeText.includes("Not estimated")) {
    if (computed.trace) {
      const match = computed.rangeText.match(
        /(\d+(?:\.\d+)?)\s*%?\s*[–-]\s*(\d+(?:\.\d+)?)\s*%/,
      );
      if (match && coverage.sufficiencyLevel !== "high") {
        const tighten =
          coverage.rangeWidthMultiplier > 1
            ? 1 / coverage.rangeWidthMultiplier
            : 0.92;
        const low = parseFloat(match[1]) * tighten;
        const high = parseFloat(match[2]) * tighten;
        return {
          rangeText: `${formatMarginRange(low, high)} (calibrated for partial evidence)`,
          trace: computed.trace,
          usedFallback: false,
        };
      }
    }
    return { ...computed, usedFallback: false };
  }

  const all = [...primaryThemes, ...secondaryThemes];
  if (all.length === 0 && !coverage.allowsDirectionalOpportunity) {
    return {
      rangeText: "Not estimated — insufficient prioritized themes",
      trace: null,
      usedFallback: false,
    };
  }

  if (all.length === 0 && coverage.allowsDirectionalOpportunity) {
    return {
      rangeText: buildDirectionalFallbackRange(
        archetypeId,
        coverage,
        evidenceStrength,
      ),
      trace: {
        traceId: "trace-graceful-fallback",
        themeId: "graceful-fallback",
        themeName: "Directional architecture pool",
        scope: "portfolio_total",
        inputSignals: [
          {
            label: "Evidence sufficiency",
            value: `${Math.round(coverage.overallScore * 100)}% weighted score`,
            detail: coverage.dimensions.map((d) => d.note).join(" "),
          },
        ],
        measuredValues: [],
        weightsApplied: [
          {
            label: "Degradation mode",
            value: coverage.sufficiencyLevel,
            detail: buildDegradedOpportunityMessage(coverage),
          },
        ],
        elasticityModifier: {
          label: "Elasticity modifier",
          value: "Directional only",
        },
        maturityConfidenceModifier: [],
        intermediateSteps: [],
        categoryExposure: [],
        finalRange: {
          lowPct: ARCHETYPE_DIRECTIONAL_BANDS[archetypeId]?.low ?? 0.8,
          highPct: ARCHETYPE_DIRECTIONAL_BANDS[archetypeId]?.high ?? 2,
          display: buildDirectionalFallbackRange(
            archetypeId,
            coverage,
            evidenceStrength,
          ),
        },
        formulaSummary:
          "Weighted sufficiency allowed directional band when themes were not prioritized.",
      },
      usedFallback: true,
    };
  }

  return (
    computed ?? {
      rangeText: buildDirectionalFallbackRange(archetypeId, coverage, evidenceStrength),
      trace: null,
      usedFallback: true,
    }
  );
}

/** Allow medium-confidence themes when weighted sufficiency supports directional read. */
export function confidenceMeetsDirectionalBar(
  level: import("@/types/confidence-scoring").DiagnosticConfidenceLevel,
  coverage: EvidenceCoverageAssessment,
): boolean {
  if (level === "medium" || level === "medium_high" || level === "high") {
    return true;
  }
  return coverage.overallScore >= 0.42 && coverage.allowsDirectionalOpportunity;
}
