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
  aggregateMarginOpportunity,
  buildRevenueSensitivitySummary,
  parseMarginBounds,
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

  const bounds = hypotheses
    .map((h) => parseMarginBounds(h.opportunityTheme.estimatedMarginRange))
    .filter((b): b is { low: number; high: number } => b !== null);

  const low =
    bounds.length > 0 ? Math.min(...bounds.map((b) => b.low)) : 0.3;
  const high =
    bounds.length > 0 ? Math.max(...bounds.map((b) => b.high)) : 0.8;

  const archetype = getArchetype(archetypeId);

  return {
    id: definition.id,
    themeName: definition.themeName,
    themeFamily: definition.themeFamily,
    summary: definition.summary,
    supportingHypotheses: hypotheses,
    supportingSignals: collectSignals(hypotheses),
    confidence: mergeConfidence(hypotheses),
    marginOpportunityRange: `${low.toFixed(1)}%–${high.toFixed(1)}% margin opportunity (thematic)`,
    marginOpportunityLowPct: low,
    marginOpportunityHighPct: high,
    revenueSensitivityRange: definition.revenueSensitivityNote,
    recoverability:
      hypotheses[0]?.opportunityTheme.recoverability ?? "medium",
    strategicImportance: "primary",
    retailerContextNotes: `${archetype?.archetypeName ?? archetypeId} archetype`,
    rank: 0,
  };
}

export type StorylineSynthesisInput = {
  hypothesisOutput: DiagnosticHypothesisOutput;
  knowledge: KnowledgeRegistryContext;
  retailerDisplayName?: string | null;
  hasRevenueInScope?: boolean;
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

  for (const def of EXECUTIVE_THEME_DEFINITIONS) {
    const hyps = def.hypothesisIds
      .map((id) => hypothesisById.get(id))
      .filter((h): h is DiagnosticHypothesis => h !== undefined);
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

  const storyline: StorylineSummary = {
    id: `storyline-${archetypeId}`,
    title,
    executiveSummary: buildExecutiveSummary(
      primary,
      archetypeId,
      input.retailerDisplayName ?? null,
    ),
    primaryThemes: primary,
    secondaryThemes: secondary,
    marginOpportunityTotalRange: aggregateMarginOpportunity(primary, secondary),
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
    engineVersion: "6b.0.0",
    generatedAt: new Date().toISOString(),
    guardrailMessage: STORYLINE_GUARDRAIL,
  };
}
