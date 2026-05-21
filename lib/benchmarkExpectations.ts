/**
 * Soft directional benchmark reference ranges (Step 14B).
 * Informed by McKinsey-style pricing strategy / grocery benchmark / KVI & architecture frameworks.
 * NOT hard thresholds — contextual guides only.
 */

import type { BenchmarkRangePct } from "@/types/benchmark-calibration";
import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";

export type ArchetypeBenchmarkProfile = {
  archetypeId: RetailerArchetypeId;
  displayName: string;
  structuralNote: string;
  kviSalesSharePct: BenchmarkRangePct;
  premiumMainstreamGapPct: BenchmarkRangePct;
  plNbGapPct: BenchmarkRangePct;
  entryMainstreamGapPct: BenchmarkRangePct;
  /** How much architecture compression matters for this archetype (0.7–1.3) */
  architectureIssueWeight: number;
  /** How much weak PL/NB matters (0.7–1.3) */
  plNbIssueWeight: number;
  /** How much KVI over-investment matters (0.7–1.3) */
  kviIssueWeight: number;
};

const range = (low: number, high: number, label: string): BenchmarkRangePct => ({
  lowPct: low,
  highPct: high,
  label,
});

export const ARCHETYPE_BENCHMARK_PROFILES: ArchetypeBenchmarkProfile[] = [
  {
    archetypeId: "discount",
    displayName: "Discount",
    structuralNote:
      "Aggressive KVI investment, narrow architecture, and strong visible value signaling are typical.",
    kviSalesSharePct: range(20, 30, "KVI sales share (discount)"),
    premiumMainstreamGapPct: range(10, 20, "Premium vs mainstream gap (discount)"),
    plNbGapPct: range(5, 15, "PL vs NB gap (discount)"),
    entryMainstreamGapPct: range(5, 10, "Entry vs mainstream gap (discount)"),
    architectureIssueWeight: 0.85,
    plNbIssueWeight: 0.9,
    kviIssueWeight: 0.95,
  },
  {
    archetypeId: "mass",
    displayName: "Mass",
    structuralNote:
      "Balanced architecture with mixed KVI investment and monetization tiers is typical.",
    kviSalesSharePct: range(15, 25, "KVI sales share (mass)"),
    premiumMainstreamGapPct: range(15, 30, "Premium vs mainstream gap (mass)"),
    plNbGapPct: range(10, 20, "PL vs NB gap (mass)"),
    entryMainstreamGapPct: range(10, 20, "Entry vs mainstream gap (mass)"),
    architectureIssueWeight: 1,
    plNbIssueWeight: 1,
    kviIssueWeight: 1,
  },
  {
    archetypeId: "grocery",
    displayName: "Grocery",
    structuralNote:
      "High KVI discipline, localized expectations, and strong traffic-driver categories are typical.",
    kviSalesSharePct: range(20, 25, "KVI sales share (grocery)"),
    premiumMainstreamGapPct: range(15, 25, "Premium vs mainstream gap (grocery)"),
    plNbGapPct: range(15, 25, "PL vs NB gap (grocery)"),
    entryMainstreamGapPct: range(10, 20, "Entry vs mainstream gap (grocery)"),
    architectureIssueWeight: 1,
    plNbIssueWeight: 1.05,
    kviIssueWeight: 1.05,
  },
  {
    archetypeId: "premium_grocery",
    displayName: "Premium grocery",
    structuralNote: "Wider premium ladders and lower KVI intensity versus mainstream grocery.",
    kviSalesSharePct: range(8, 15, "KVI sales share (premium grocery)"),
    premiumMainstreamGapPct: range(30, 60, "Premium vs mainstream gap (premium)"),
    plNbGapPct: range(0, 10, "PL vs NB gap (premium)"),
    entryMainstreamGapPct: range(20, 35, "Entry vs mainstream gap (premium)"),
    architectureIssueWeight: 1.2,
    plNbIssueWeight: 1.1,
    kviIssueWeight: 0.85,
  },
  {
    archetypeId: "specialty",
    displayName: "Specialty",
    structuralNote: "Monetization and brand architecture are critical; wider tier separation expected.",
    kviSalesSharePct: range(10, 20, "KVI sales share (specialty)"),
    premiumMainstreamGapPct: range(20, 40, "Premium vs mainstream gap (specialty)"),
    plNbGapPct: range(5, 15, "PL vs NB gap (specialty)"),
    entryMainstreamGapPct: range(15, 25, "Entry vs mainstream gap (specialty)"),
    architectureIssueWeight: 1.15,
    plNbIssueWeight: 1.1,
    kviIssueWeight: 0.9,
  },
  {
    archetypeId: "convenience",
    displayName: "Convenience",
    structuralNote: "Higher tolerated base index and convenience premium; narrower promo architecture.",
    kviSalesSharePct: range(10, 15, "KVI sales share (convenience)"),
    premiumMainstreamGapPct: range(15, 28, "Premium vs mainstream gap (convenience)"),
    plNbGapPct: range(8, 18, "PL vs NB gap (convenience)"),
    entryMainstreamGapPct: range(8, 16, "Entry vs mainstream gap (convenience)"),
    architectureIssueWeight: 0.9,
    plNbIssueWeight: 0.95,
    kviIssueWeight: 0.85,
  },
  {
    archetypeId: "club",
    displayName: "Club",
    structuralNote: "Pack-value architecture and membership monetization; moderate KVI breadth.",
    kviSalesSharePct: range(12, 22, "KVI sales share (club)"),
    premiumMainstreamGapPct: range(12, 25, "Premium vs mainstream gap (club)"),
    plNbGapPct: range(8, 18, "PL vs NB gap (club)"),
    entryMainstreamGapPct: range(8, 18, "Entry vs mainstream gap (club)"),
    architectureIssueWeight: 0.95,
    plNbIssueWeight: 1,
    kviIssueWeight: 0.9,
  },
  {
    archetypeId: "apparel_softlines",
    displayName: "Apparel / softlines",
    structuralNote: "Wider architecture expected; markdown sensitivity is high (regular-price v1 focus).",
    kviSalesSharePct: range(10, 20, "KVI sales share (apparel)"),
    premiumMainstreamGapPct: range(20, 45, "Premium vs mainstream gap (apparel)"),
    plNbGapPct: range(10, 22, "PL vs NB gap (apparel)"),
    entryMainstreamGapPct: range(15, 30, "Entry vs mainstream gap (apparel)"),
    architectureIssueWeight: 1.1,
    plNbIssueWeight: 1,
    kviIssueWeight: 0.95,
  },
];

export const PRICING_POSTURE_NOTES: Record<PricingPosture, string> = {
  EDLP: "Tight ladders, shallow promo depth, and low price variance are typical.",
  HiLo: "Wider ladders, visible promotions, and stronger trade-up spacing are typical.",
  Hybrid: "Selective promo depth with monetization tiers in non-traffic categories.",
  Premium: "Wider premium separation and lower KVI intensity versus value-led peers.",
  Value: "Narrow opening price points and broad visible value signaling.",
  Convenience: "Convenience premium tolerated; narrower architecture versus grocery.",
  Specialty: "Brand-led architecture and monetization separation are critical.",
};

export function getArchetypeBenchmarkProfile(
  archetypeId: RetailerArchetypeId,
): ArchetypeBenchmarkProfile {
  return (
    ARCHETYPE_BENCHMARK_PROFILES.find((p) => p.archetypeId === archetypeId) ??
    ARCHETYPE_BENCHMARK_PROFILES.find((p) => p.archetypeId === "mass")!
  );
}

/** Posture adjusts expected gap width modestly (soft modifier, not a rule). */
export function postureGapAdjustment(posture: PricingPosture): {
  premiumGapShiftPct: number;
  entryGapShiftPct: number;
  kviShiftPct: number;
} {
  switch (posture) {
    case "EDLP":
      return { premiumGapShiftPct: -2, entryGapShiftPct: -1, kviShiftPct: 2 };
    case "HiLo":
      return { premiumGapShiftPct: 2, entryGapShiftPct: 2, kviShiftPct: 0 };
    case "Premium":
      return { premiumGapShiftPct: 5, entryGapShiftPct: 3, kviShiftPct: -3 };
    case "Value":
      return { premiumGapShiftPct: -3, entryGapShiftPct: -2, kviShiftPct: 3 };
    case "Convenience":
      return { premiumGapShiftPct: 0, entryGapShiftPct: 0, kviShiftPct: -2 };
    default:
      return { premiumGapShiftPct: 0, entryGapShiftPct: 0, kviShiftPct: 0 };
  }
}

export function adjustedExpectedRange(
  base: BenchmarkRangePct,
  shiftLow: number,
  shiftHigh: number,
): BenchmarkRangePct {
  return {
    ...base,
    lowPct: Math.max(0, base.lowPct + shiftLow),
    highPct: Math.max(base.lowPct + 1, base.highPct + shiftHigh),
  };
}
