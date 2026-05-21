/**
 * Normative structure expectations — coherence vs positioning (Step 14B).
 * Regular-price architecture, KVI, PL/NB, and tier spacing only (v1).
 */

import {
  adjustedExpectedRange,
  getArchetypeBenchmarkProfile,
  postureGapAdjustment,
  PRICING_POSTURE_NOTES,
} from "@/lib/benchmarkExpectations";
import type { NormativeStructureSnapshot } from "@/types/benchmark-calibration";
import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";

export function buildNormativeStructureSnapshot(
  archetypeId: RetailerArchetypeId,
  pricingPosture: PricingPosture,
): NormativeStructureSnapshot {
  const profile = getArchetypeBenchmarkProfile(archetypeId);
  const postureAdj = postureGapAdjustment(pricingPosture);

  const premiumMainstreamGapRange = adjustedExpectedRange(
    profile.premiumMainstreamGapPct,
    postureAdj.premiumGapShiftPct,
    postureAdj.premiumGapShiftPct,
  );
  const entryMainstreamGapRange = adjustedExpectedRange(
    profile.entryMainstreamGapPct,
    postureAdj.entryGapShiftPct,
    postureAdj.entryGapShiftPct,
  );
  const kviExpectedRange = adjustedExpectedRange(
    profile.kviSalesSharePct,
    postureAdj.kviShiftPct,
    postureAdj.kviShiftPct,
  );

  return {
    archetypeId,
    pricingPosture,
    coherenceQuestion:
      "Is the retailer’s regular-price structure coherent relative to its positioning and category mix?",
    archetypeStructuralNote: profile.structuralNote,
    postureStructuralNote: PRICING_POSTURE_NOTES[pricingPosture],
    kviExpectedRange,
    premiumMainstreamGapRange,
    plNbGapRange: profile.plNbGapPct,
    entryMainstreamGapRange,
  };
}

export function coherencePriorityForArchetype(archetypeId: RetailerArchetypeId): {
  architecture: number;
  plNb: number;
  kvi: number;
} {
  const p = getArchetypeBenchmarkProfile(archetypeId);
  return {
    architecture: p.architectureIssueWeight,
    plNb: p.plNbIssueWeight,
    kvi: p.kviIssueWeight,
  };
}
