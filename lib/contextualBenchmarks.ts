/**
 * Contextual benchmark interpretation — observed vs expected structure (Step 14B).
 */

import { getArchetypeBenchmarkProfile } from "@/lib/benchmarkExpectations";
import { buildNormativeStructureSnapshot } from "@/lib/normativeStructures";
import type { ArchitectureSignalResult } from "@/lib/architectureSignals";
import type { KviSignalResult } from "@/lib/kviSignals";
import type {
  BenchmarkComparisonPosition,
  BenchmarkInterpretation,
  BenchmarkRangePct,
  CategorySensitivityProfile,
} from "@/types/benchmark-calibration";
import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";

export const CATEGORY_SENSITIVITY_PROFILES: CategorySensitivityProfile[] = [
  {
    scopeCategory: "Grocery",
    sensitivityNote: "Very high price sensitivity; KVI-heavy traffic architecture.",
    premiumizationOpportunity: "moderate",
    kviWeight: "high",
    elasticityFraming: "high",
  },
  {
    scopeCategory: "Household essentials",
    sensitivityNote: "High traffic-driver weighting; PL/NB separation is monetization-critical.",
    premiumizationOpportunity: "moderate",
    kviWeight: "high",
    elasticityFraming: "high",
  },
  {
    scopeCategory: "Beauty",
    sensitivityNote: "Premiumization opportunity with moderate elasticity; narrow premium gaps are notable.",
    premiumizationOpportunity: "high",
    kviWeight: "moderate",
    elasticityFraming: "moderate",
  },
  {
    scopeCategory: "Pet",
    sensitivityNote: "Loyalty and premiumization mix; architecture coherence supports trade-up.",
    premiumizationOpportunity: "high",
    kviWeight: "moderate",
    elasticityFraming: "moderate",
  },
  {
    scopeCategory: "Apparel",
    sensitivityNote: "Wider architecture expected; regular-price ladder clarity is primary (markdown out of v1 scope).",
    premiumizationOpportunity: "moderate",
    kviWeight: "low",
    elasticityFraming: "moderate",
  },
  {
    scopeCategory: "Electronics",
    sensitivityNote: "Highly competitive, transparent pricing; architecture signals are directional only.",
    premiumizationOpportunity: "low",
    kviWeight: "moderate",
    elasticityFraming: "high",
  },
  {
    scopeCategory: "Home decor",
    sensitivityNote: "Architecture-driven monetization; lower price sensitivity than traffic categories.",
    premiumizationOpportunity: "high",
    kviWeight: "low",
    elasticityFraming: "low",
  },
  {
    scopeCategory: "Seasonal",
    sensitivityNote: "Event-driven architecture; regular-price spacing still informs coherence.",
    premiumizationOpportunity: "moderate",
    kviWeight: "moderate",
    elasticityFraming: "moderate",
  },
];

export function getCategorySensitivity(
  category: string,
): CategorySensitivityProfile | undefined {
  const key = category.trim().toLowerCase();
  return CATEGORY_SENSITIVITY_PROFILES.find(
    (p) => p.scopeCategory.toLowerCase() === key,
  );
}

export function compareToExpectedRange(
  observedPct: number,
  expected: BenchmarkRangePct,
): BenchmarkComparisonPosition {
  const span = expected.highPct - expected.lowPct;
  const mid = (expected.lowPct + expected.highPct) / 2;

  if (observedPct < expected.lowPct * 0.75) return "below_expected";
  if (observedPct < expected.lowPct) return "narrower_than_typical";
  if (observedPct > expected.highPct * 1.25) return "above_expected";
  if (observedPct > expected.highPct) return "broader_than_expected";
  if (Math.abs(observedPct - mid) <= span * 0.15) return "consistent_with_leading";
  return "within_expected";
}

function positionPhrase(
  position: BenchmarkComparisonPosition,
  metricLabel: string,
  expected: BenchmarkRangePct,
  archetypeName: string,
  postureLabel: string,
  category?: string,
): string {
  const ctx = category ? ` in ${category}` : "";
  const band = `${expected.lowPct}–${expected.highPct}%`;

  switch (position) {
    case "below_expected":
      return `${metricLabel}${ctx} appears below the expected range (${band}) for a ${archetypeName} retailer with ${postureLabel} posture.`;
    case "narrower_than_typical":
      return `${metricLabel}${ctx} is narrower than typical for ${archetypeName} (${band} reference band).`;
    case "broader_than_expected":
      return `${metricLabel}${ctx} is broader than expected for ${archetypeName} — may indicate over-spacing versus traffic role.`;
    case "above_expected":
      return `${metricLabel}${ctx} sits above the typical ${archetypeName} band (${band}) — interpret with category role.`;
    case "consistent_with_leading":
      return `${metricLabel}${ctx} is consistent with leading ${archetypeName} regular-price structure (${band} band).`;
    default:
      return `${metricLabel}${ctx} sits within the expected ${archetypeName} range (${band}).`;
  }
}

function severityFromPosition(
  position: BenchmarkComparisonPosition,
  issueWeight: number,
): number {
  const base =
    position === "below_expected"
      ? 0.85
      : position === "narrower_than_typical"
        ? 0.65
        : position === "broader_than_expected" || position === "above_expected"
          ? 0.35
          : position === "within_expected"
            ? 0.2
            : 0.15;
  return Math.min(1, base * issueWeight);
}

export type ContextualBenchmarkInput = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  postureDisplay: string;
  arch: ArchitectureSignalResult;
  kvi: KviSignalResult;
  categories?: string[];
  eprAverage?: number | null;
};

export function buildContextualInterpretations(
  input: ContextualBenchmarkInput,
): BenchmarkInterpretation[] {
  const normative = buildNormativeStructureSnapshot(
    input.archetypeId,
    input.pricingPosture,
  );
  const profile = getArchetypeBenchmarkProfile(input.archetypeId);
  const archetypeName = profile.displayName;
  const interpretations: BenchmarkInterpretation[] = [];

  if (input.arch.premiumMainstreamGapPct !== null) {
    const pos = compareToExpectedRange(
      input.arch.premiumMainstreamGapPct,
      normative.premiumMainstreamGapRange,
    );
    interpretations.push({
      metricKind: "premium_mainstream_gap",
      observedPct: input.arch.premiumMainstreamGapPct,
      observedDisplay: `${Math.round(input.arch.premiumMainstreamGapPct)}%`,
      expectedRange: normative.premiumMainstreamGapRange,
      position: pos,
      narrativePhrase: positionPhrase(
        pos,
        "Premium/Mainstream separation",
        normative.premiumMainstreamGapRange,
        archetypeName,
        input.postureDisplay,
      ),
      severityWeight: severityFromPosition(pos, profile.architectureIssueWeight),
      archetypeId: input.archetypeId,
      pricingPosture: input.pricingPosture,
    });
  }

  if (input.arch.entryMainstreamGapPct !== null) {
    const pos = compareToExpectedRange(
      input.arch.entryMainstreamGapPct,
      normative.entryMainstreamGapRange,
    );
    interpretations.push({
      metricKind: "entry_mainstream_gap",
      observedPct: input.arch.entryMainstreamGapPct,
      observedDisplay: `${Math.round(input.arch.entryMainstreamGapPct)}%`,
      expectedRange: normative.entryMainstreamGapRange,
      position: pos,
      narrativePhrase: positionPhrase(
        pos,
        "Entry/Mainstream separation",
        normative.entryMainstreamGapRange,
        archetypeName,
        input.postureDisplay,
      ),
      severityWeight: severityFromPosition(pos, profile.architectureIssueWeight * 0.9),
      archetypeId: input.archetypeId,
      pricingPosture: input.pricingPosture,
    });
  }

  if (input.arch.plNbGapPctMedian !== null) {
    const pos = compareToExpectedRange(
      input.arch.plNbGapPctMedian,
      normative.plNbGapRange,
    );
    interpretations.push({
      metricKind: "pl_nb_gap",
      observedPct: input.arch.plNbGapPctMedian,
      observedDisplay: `${Math.round(input.arch.plNbGapPctMedian)}%`,
      expectedRange: normative.plNbGapRange,
      position: pos,
      narrativePhrase: positionPhrase(
        pos,
        "PL/NB separation",
        normative.plNbGapRange,
        archetypeName,
        input.postureDisplay,
        input.arch.plNbCategoriesNarrow > 0
          ? input.arch.compressionCategories[0] ?? "measured categories"
          : undefined,
      ),
      severityWeight: severityFromPosition(pos, profile.plNbIssueWeight),
      archetypeId: input.archetypeId,
      pricingPosture: input.pricingPosture,
    });
  }

  const kviPos = compareToExpectedRange(
    input.kvi.kviRevenueSharePct,
    normative.kviExpectedRange,
  );
  interpretations.push({
    metricKind: "kvi_revenue_share",
    observedPct: input.kvi.kviRevenueSharePct,
    observedDisplay: `~${input.kvi.kviRevenueSharePct}%`,
    expectedRange: normative.kviExpectedRange,
    position: kviPos,
    narrativePhrase: positionPhrase(
      kviPos === "above_expected" || kviPos === "broader_than_expected"
        ? "above_expected"
        : kviPos,
      "KVI-like revenue concentration",
      normative.kviExpectedRange,
      archetypeName,
      input.postureDisplay,
    ),
    severityWeight: severityFromPosition(
      kviPos === "above_expected" || kviPos === "broader_than_expected"
        ? "above_expected"
        : kviPos,
      profile.kviIssueWeight,
    ),
    archetypeId: input.archetypeId,
    pricingPosture: input.pricingPosture,
  });

  for (const cat of input.arch.compressionCategories.slice(0, 2)) {
    const sens = getCategorySensitivity(cat);
    if (!sens) continue;
    const existing = interpretations.find((i) => i.category === cat);
    if (existing) continue;
    interpretations.push({
      metricKind: "premium_mainstream_gap",
      observedPct: input.arch.premiumMainstreamGapPct,
      observedDisplay: "compressed tiers",
      expectedRange: normative.premiumMainstreamGapRange,
      position: "below_expected",
      narrativePhrase: `Tier spacing in ${cat} appears compressed relative to ${sens.sensitivityNote.toLowerCase()}`,
      severityWeight: 0.7 * profile.architectureIssueWeight,
      archetypeId: input.archetypeId,
      pricingPosture: input.pricingPosture,
      category: cat,
    });
  }

  return interpretations;
}

/** Maturity adjusts how problematic the same gap is (EPR proxy). */
export function maturityInterpretationMultiplier(
  eprAverage: number | null | undefined,
  issueSeverity: number,
): number {
  if (eprAverage == null) return 1;
  if (eprAverage >= 3.5) return 1 + issueSeverity * 0.12;
  if (eprAverage < 2.5) return 1 - issueSeverity * 0.08;
  return 1;
}
