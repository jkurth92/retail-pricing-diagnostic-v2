import { buildRetailerPricingProfile } from "@/lib/retailerProfileBuilder";
import {
  buildOpeningExecutiveNarrative,
  buildStructuralPictureSummary,
} from "@/lib/strategicNarrative";
import {
  buildBenchmarkPrimaryDrivers,
  buildExposurePrimaryDrivers,
  buildOpportunityHeadline,
  buildStrategicImplicationOneLiner,
} from "@/lib/evidenceExecutiveSummary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import {
  buildConciseExecutiveImplications,
  polishEvidenceMetrics,
  polishEvidenceThemes,
} from "@/lib/executiveOutputPolish";
import {
  filterGenericNarrativeLines,
  orderThemesByNarrativeDominance,
  sortLinesByFamilyPriority,
} from "@/lib/signalPrioritization";
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
  opportunityExposure?: OpportunityExposureBundle | null,
): ExecutiveSummary {
  const { storyline } = storylineResult;
  const profile = buildRetailerPricingProfile(
    knowledge,
    eprScores,
    strategicContext,
    enrichment,
  );

  const topThemes = orderThemesByNarrativeDominance([
    ...storyline.primaryThemes,
    ...storyline.secondaryThemes,
  ]).slice(0, 5);

  const archThemes = topThemes.filter((t) => ARCH_FAMILIES.has(t.themeFamily));

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

  const strategicImplicationOneLiner = buildStrategicImplicationOneLiner(
    evidenceBundle,
    storyline.primaryThemes,
  );

  const narrative = buildOpeningExecutiveNarrative(
    profile,
    storyline.primaryThemes,
    storyline,
    enrichment,
  );

  const maturitySummary = `${profile.maturityProfile} ${buildStructuralPictureSummary(profile, archThemes)}`;

  const evidenceBackedThemes = polishEvidenceThemes(
    evidenceBundle.evidenceBackedThemes.length > 0
      ? evidenceBundle.evidenceBackedThemes
      : storyline.primaryThemes.slice(0, 3).map((t) => ({
          headline: t.themeName,
          detail: t.summary,
        })),
    3,
  );

  const exposureBundle = opportunityExposure ?? null;

  const benchmarkLines =
    evidenceBundle.benchmarkCalibration?.executiveContextLines ?? [];

  const supportingEvidenceMetrics = polishEvidenceMetrics(
    [
      ...benchmarkLines,
      ...(exposureBundle?.causalFramingLines ?? []),
      ...(exposureBundle?.exposureSummaries ?? []),
      ...evidenceBundle.summaries,
    ].length > 0
      ? [
          ...benchmarkLines,
          ...(exposureBundle?.causalFramingLines ?? []),
          ...(exposureBundle?.exposureSummaries ?? []),
          ...evidenceBundle.summaries,
        ]
      : storyline.primaryThemes.flatMap((t) =>
          t.supportingSignals
            .slice(0, 1)
            .map((s) => s.explanation || s.signalName),
        ),
    4,
  );

  const implications = buildConciseExecutiveImplications(
    evidenceBundle,
    strategicImplicationOneLiner,
  );

  return {
    id: `exec-summary-${knowledge.archetypeId}`,
    retailerProfile: profile,
    pricingPosture: profile.posture,
    executiveNarrative: narrative,
    topThemes,
    marginOpportunitySummary: storyline.marginOpportunityTotalRange,
    marginOpportunityTotalTrace: storyline.marginOpportunityTotalTrace,
    revenueSensitivitySummary: storyline.revenueSensitivitySummary,
    confidenceSummary: storyline.confidenceSummary,
    maturitySummary,
    strategicImplications: filterGenericNarrativeLines(implications),
    opportunityHeadline: buildOpportunityHeadline(
      storylineResult,
      evidenceBundle,
      exposureBundle,
    ),
    primaryDrivers: (() => {
      const benchmarkDrivers = buildBenchmarkPrimaryDrivers(benchmarkLines);
      const exposureDrivers = exposureBundle
        ? buildExposurePrimaryDrivers(exposureBundle)
        : [];
      if (benchmarkDrivers.length > 0 || exposureDrivers.length > 0) {
        return sortLinesByFamilyPriority([
          ...benchmarkDrivers,
          ...exposureDrivers,
        ]).slice(0, 4);
      }
      if (evidenceBundle.primaryDrivers.length > 0) {
        return sortLinesByFamilyPriority(evidenceBundle.primaryDrivers).slice(0, 4);
      }
      return orderThemesByNarrativeDominance(archThemes)
        .slice(0, 3)
        .map((t) => t.themeName);
    })(),
    evidenceBackedThemes,
    supportingEvidenceMetrics,
    strategicImplicationOneLiner,
    evidenceStrength: evidenceBundle.evidenceStrength,
    opportunityExposure: exposureBundle ?? undefined,
    exposureSummaries: exposureBundle?.exposureSummaries ?? [],
    causalFramingLines: exposureBundle?.causalFramingLines ?? [],
    nextFocusAreas: [],
  };
}
