import { buildRetailerPricingProfile } from "@/lib/retailerProfileBuilder";
import {
  buildOpeningExecutiveNarrative,
  buildStructuralPictureSummary,
} from "@/lib/strategicNarrative";
import {
  buildOpportunityHeadline,
  buildStrategicImplicationOneLiner,
} from "@/lib/evidenceExecutiveSummary";
import { buildStrategicImplications } from "@/lib/strategicImplications";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";
import type { EprScores } from "@/types/ui";

const ARCH_FAMILIES = new Set(["Architecture", "Premiumization"]);

export function buildExecutiveSummaryBlock(
  knowledge: KnowledgeRegistryContext,
  storylineResult: StorylineSynthesisResult,
  eprScores: EprScores,
  retailerDisplayName: string,
  strategicContext?: string,
  enrichment?: RetailerEnrichmentBundle | null,
  evidence?: ComputedEvidenceBundle,
): ExecutiveSummary {
  const { storyline, opportunity } = storylineResult;
  const profile = buildRetailerPricingProfile(
    knowledge,
    eprScores,
    strategicContext,
    enrichment,
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
    enrichment,
  );

  const maturitySummary = `${profile.maturityProfile} ${buildStructuralPictureSummary(profile, archThemes)}`;

  const evidenceBundle = evidence ?? {
    evidenceStrength: "weak" as const,
    summaries: [],
    evidenceBackedThemes: [],
    primaryDrivers: [],
    metrics: [],
    computedSignals: [],
    eligibleHypothesisIds: [],
    generatedAt: "",
    engineVersion: "",
    promoMarkdownEligible: false,
    rowCount: 0,
    categoriesAnalyzed: [],
    normalizedFields: [],
  };

  const evidenceBackedThemes =
    evidenceBundle.evidenceBackedThemes.length > 0
      ? evidenceBundle.evidenceBackedThemes
      : storyline.primaryThemes.slice(0, 3).map((t) => ({
          headline: t.themeName,
          detail: t.summary,
        }));

  const supportingEvidenceMetrics =
    evidenceBundle.summaries.length > 0
      ? evidenceBundle.summaries.slice(0, 5)
      : storyline.primaryThemes
          .flatMap((t) => t.supportingSignals.slice(0, 1).map((s) => s.signalName))
          .slice(0, 3);

  const strategicImplicationOneLiner = buildStrategicImplicationOneLiner(
    evidenceBundle,
    storyline.primaryThemes,
  );

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
    strategicImplications: [strategicImplicationOneLiner, ...implications.slice(0, 2)],
    opportunityHeadline: buildOpportunityHeadline(storylineResult, evidenceBundle),
    primaryDrivers:
      evidenceBundle.primaryDrivers.length > 0
        ? evidenceBundle.primaryDrivers
        : archThemes.slice(0, 3).map((t) => t.themeFamily),
    evidenceBackedThemes,
    supportingEvidenceMetrics,
    strategicImplicationOneLiner,
    evidenceStrength: evidenceBundle.evidenceStrength,
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
