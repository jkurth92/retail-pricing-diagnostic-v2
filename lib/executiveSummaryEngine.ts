import { buildRetailerPricingProfile } from "@/lib/retailerProfileBuilder";
import {
  buildOpeningExecutiveNarrative,
  buildStructuralPictureSummary,
} from "@/lib/strategicNarrative";
import { buildStrategicImplications } from "@/lib/strategicImplications";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { EprScores } from "@/types/ui";

const ARCH_FAMILIES = new Set(["Architecture", "Premiumization"]);

export function buildExecutiveSummaryBlock(
  knowledge: KnowledgeRegistryContext,
  storylineResult: StorylineSynthesisResult,
  eprScores: EprScores,
  retailerDisplayName: string,
  strategicContext?: string,
): ExecutiveSummary {
  const { storyline, opportunity } = storylineResult;
  const profile = buildRetailerPricingProfile(
    knowledge,
    eprScores,
    strategicContext,
  );

  const topThemes = [
    ...storyline.primaryThemes,
    ...storyline.secondaryThemes,
  ].slice(0, 5);

  const archThemes = topThemes.filter((t) => ARCH_FAMILIES.has(t.themeFamily));
  const implications = buildStrategicImplications(
    topThemes,
    profile,
    storyline.confidenceSummary,
  );

  const narrative = buildOpeningExecutiveNarrative(
    profile,
    storyline.primaryThemes,
    storyline,
  );

  const maturitySummary = `${profile.maturityProfile} ${buildStructuralPictureSummary(profile, archThemes)}`;

  return {
    id: `exec-summary-${knowledge.archetypeId}`,
    retailerProfile: profile,
    pricingPosture: profile.posture,
    executiveNarrative: narrative,
    topThemes,
    marginOpportunitySummary: storyline.marginOpportunityTotalRange,
    revenueSensitivitySummary: storyline.revenueSensitivitySummary,
    confidenceSummary: storyline.confidenceSummary,
    maturitySummary,
    strategicImplications: implications.slice(0, 5),
    nextFocusAreas: [
      "Complete evidence alignment for architecture and KVI fields",
      "Validate role taxonomy with client category leads",
      "Align rule packs before translating thematic % to dollars",
      opportunity.status === "pending_scope_dollars"
        ? "Translate thematic pools to revenue in scope when formulas are approved"
        : "Define revenue in scope to enable future dollar framing",
    ],
  };
}
