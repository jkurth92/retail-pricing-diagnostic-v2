import {
  EXECUTIVE_THEME_DEFINITIONS,
  EXECUTIVE_THEME_BY_ID,
  type ExecutiveThemeDefinition,
} from "@/data/executiveThemes";
import {
  STORYLINE_GUARDRAIL,
  STORYLINE_NOTES,
  STORYLINE_TITLES,
} from "@/data/storylineTemplates";
import {
  buildConfidenceSummary,
  buildExecutiveSummary,
  buildStorylineNarrative,
} from "@/lib/executiveNarrative";
import {
  computeAggregatedMarginOpportunity,
  buildRevenueSensitivitySummary,
} from "@/lib/opportunityAggregator";
import { buildOpportunitySummary } from "@/lib/opportunitySummary";
import { calibrateStorylineResult } from "@/lib/outputCalibration";
import { rankExecutiveThemes } from "@/lib/themeRanker";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { DiagnosticHypothesis } from "@/types/diagnostic-hypotheses";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSummary } from "@/types/storyline";
import type { OpportunitySummary } from "@/types/opportunity-summary";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { ConfidenceScore } from "@/types/confidence-scoring";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import { getArchetype, postureLabel } from "@/lib/archetypeContext";
import { calibrateThemeDisplayName } from "@/lib/interpretationCalibration";
import { buildExecutiveThemeOpportunityTrace } from "@/lib/opportunityCalculationTrace";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

function mergeConfidence(
  hypotheses: DiagnosticHypothesis[],
): ConfidenceScore {
  const order: DiagnosticConfidenceLevel[] = [
    "low",
    "medium",
    "medium_high",
    "high",
  ];
  let best: DiagnosticConfidenceLevel = "low";
  for (const h of hypotheses) {
    if (order.indexOf(h.confidence.level) > order.indexOf(best)) {
      best = h.confidence.level;
    }
  }
  const primary = hypotheses.find((h) => h.confidence.level === best);
  return (
    primary?.confidence ?? {
      level: best,
      explanation: "Merged from supporting hypotheses.",
      evidenceCoverage: "partial",
      signalReinforcement: hypotheses.length,
      maturityAdjustment: 0,
    }
  );
}

function collectSignals(hypotheses: DiagnosticHypothesis[]) {
  const seen = new Set<string>();
  const out: DiagnosticHypothesis["supportingSignals"] = [];
  for (const h of hypotheses) {
    for (const s of h.supportingSignals) {
      if (!seen.has(s.signalId)) {
        seen.add(s.signalId);
        out.push(s);
      }
    }
  }
  return out;
}

function buildExecutiveTheme(
  definition: ExecutiveThemeDefinition,
  hypotheses: DiagnosticHypothesis[],
  archetypeId: KnowledgeRegistryContext["archetypeId"],
): ExecutiveTheme | null {
  if (hypotheses.length === 0) return null;

  const archetype = getArchetype(archetypeId);

  const childTraces = hypotheses
    .map((h) => h.opportunityTheme.calculationTrace)
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  const calculationTrace = buildExecutiveThemeOpportunityTrace(
    definition.id,
    definition.themeName,
    childTraces,
  );

  return {
    id: definition.id,
    themeName: calibrateThemeDisplayName(definition.themeName, archetypeId),
    themeFamily: definition.themeFamily,
    summary: definition.summary,
    supportingHypotheses: hypotheses,
    supportingSignals: collectSignals(hypotheses),
    confidence: mergeConfidence(hypotheses),
    marginOpportunityRange: calculationTrace.finalRange.display,
    marginOpportunityLowPct: calculationTrace.finalRange.lowPct,
    marginOpportunityHighPct: calculationTrace.finalRange.highPct,
    revenueSensitivityRange: definition.revenueSensitivityNote,
    recoverability:
      hypotheses[0]?.opportunityTheme.recoverability ?? "medium",
    strategicImportance: "primary",
    retailerContextNotes: `${archetype?.archetypeName ?? archetypeId} archetype`,
    rank: 0,
    calculationTrace,
  };
}

export type StorylineSynthesisInput = {
  hypothesisOutput: DiagnosticHypothesisOutput;
  knowledge: KnowledgeRegistryContext;
  retailerDisplayName?: string | null;
  hasRevenueInScope?: boolean;
  computedEvidence?: ComputedEvidenceBundle;
  opportunityExposure?: OpportunityExposureBundle;
};

export type StorylineSynthesisResult = {
  storyline: StorylineSummary;
  opportunity: OpportunitySummary;
  allThemesBuilt: number;
  suppressedThemeCount: number;
};

export function synthesizeStoryline(
  input: StorylineSynthesisInput,
): StorylineSynthesisResult {
  const hypothesisById = new Map(
    input.hypothesisOutput.hypotheses.map((h) => [h.id, h] as const),
  );

  const candidateThemes: ExecutiveTheme[] = [];

  const promoFamilies = new Set(["Promotions", "Markdown"]);
  const evidence = input.computedEvidence;

  for (const def of EXECUTIVE_THEME_DEFINITIONS) {
    if (
      promoFamilies.has(def.themeFamily) &&
      evidence &&
      !evidence.promoMarkdownEligible
    ) {
      continue;
    }

    const hyps = def.hypothesisIds
      .map((id) => hypothesisById.get(id))
      .filter((h): h is DiagnosticHypothesis => h !== undefined);
    if (hyps.length === 0) continue;

    const theme = buildExecutiveTheme(def, hyps, input.knowledge.archetypeId);
    if (theme) {
      theme.retailerContextNotes = `${getArchetype(input.knowledge.archetypeId)?.archetypeName ?? input.knowledge.archetypeId} · ${postureLabel(input.knowledge.pricingPosture)} posture`;
      candidateThemes.push(theme);
    }
  }

  const defMap = EXECUTIVE_THEME_BY_ID;
  const { primary, secondary, suppressed } = rankExecutiveThemes(
    candidateThemes,
    defMap,
  );

  const archetypeId = input.knowledge.archetypeId;
  const title =
    STORYLINE_TITLES[archetypeId] ?? "Structural pricing diagnostic storyline";

  const revenueSensitivitySummary = buildRevenueSensitivitySummary(
    [...primary, ...secondary],
    `${getArchetype(archetypeId)?.archetypeName ?? archetypeId} archetype.`,
  );

  const aggregated = computeAggregatedMarginOpportunity(primary, secondary);

  if (aggregated.trace && input.opportunityExposure) {
    aggregated.trace.exposureSummaries = input.opportunityExposure.exposureSummaries;
    aggregated.trace.categoryExposure = input.opportunityExposure.categoryExposures
      .filter((c) => c.affectedIssueTags.length > 0)
      .map((c) => ({
        label: c.category,
        value: `${c.revenueWeightPct}% revenue · ${c.monetizableExposurePct}% monetizable`,
        detail: `Elasticity ${c.elasticitySensitivity} · ${c.elasticitySource}`,
      }));
  }

  const storyline: StorylineSummary = {
    id: `storyline-${archetypeId}`,
    title,
    executiveSummary: buildExecutiveSummary(
      primary,
      archetypeId,
      input.retailerDisplayName ?? null,
      evidence,
    ),
    primaryThemes: primary,
    secondaryThemes: secondary,
    marginOpportunityTotalRange: aggregated.rangeText,
    marginOpportunityTotalTrace: aggregated.trace ?? undefined,
    revenueSensitivitySummary,
    confidenceSummary: buildConfidenceSummary(primary),
    narrative: buildStorylineNarrative(primary, defMap, archetypeId),
    notes: [...STORYLINE_NOTES],
  };

  const opportunity = buildOpportunitySummary(
    primary,
    secondary,
    revenueSensitivitySummary,
    input.hasRevenueInScope ?? false,
  );

  return {
    storyline,
    opportunity,
    allThemesBuilt: candidateThemes.length,
    suppressedThemeCount: suppressed,
  };
}

export function runOpportunityStorylineEngine(
  input: StorylineSynthesisInput,
): StorylineSynthesisResult & {
  engineVersion: string;
  generatedAt: string;
  guardrailMessage: string;
} {
  const result = calibrateStorylineResult(synthesizeStoryline(input));
  return {
    ...result,
    engineVersion: "6b.1.0-evidence",
    generatedAt: new Date().toISOString(),
    guardrailMessage: STORYLINE_GUARDRAIL,
  };
}
