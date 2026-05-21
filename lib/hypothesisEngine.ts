import {
  DIAGNOSTIC_HYPOTHESIS_REGISTRY,
  type HypothesisRegistryEntry,
} from "@/data/diagnosticHypotheses";
import { scoreHypothesisConfidence, shouldSuppressHypothesis } from "@/lib/confidenceScoring";
import { generateHypothesisRationale } from "@/lib/narrativeGenerator";
import { calibrateOpportunityTheme } from "@/lib/opportunityCalibration";
import {
  evaluateStructuralSignals,
  type SignalEvaluationContext,
} from "@/lib/signalGrouping";
import { prioritizeHypotheses, MAX_SURFACED_HYPOTHESES } from "@/lib/hypothesisPrioritization";
import { buildObservedPatternsOutput } from "@/lib/patternFeatureBuilder";
import {
  isHypothesisEvidenceEligible,
  mergeEvidenceWithFrameworkSignals,
  type EvidenceComputationInput,
  runEvidenceComputation,
} from "@/lib/evidenceComputation";
import { inferRoles } from "@/lib/roleInference";
import type { DiagnosticHypothesis, DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { EprScores } from "@/types/ui";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { LeverDiagnosticUnlock } from "@/types/ingestion";
import {
  buildThemeExposureContext,
  runOpportunityExposureEngine,
} from "@/lib/opportunityExposure";
import type { ComputedEvidenceBundle, EvidenceStrength } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

export type HypothesisEngineInput = {
  knowledge: KnowledgeRegistryContext;
  normalizedFields: CanonicalFieldKey[];
  leverUnlocks: LeverDiagnosticUnlock[];
  eprScores?: EprScores;
  evidenceInput?: EvidenceComputationInput;
  opportunityExposure?: OpportunityExposureBundle;
};

function eprAverage(scores?: EprScores): number | null {
  if (!scores) return null;
  const vals = Object.values(scores);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function matchSignals(
  fired: SupportingSignal[],
  ids: string[],
): SupportingSignal[] {
  const set = new Set(ids);
  return fired.filter((s) => set.has(s.signalId));
}

function conflictingSignals(
  fired: SupportingSignal[],
  ids: string[],
): SupportingSignal[] {
  return matchSignals(fired, ids);
}

function buildCandidate(
  entry: HypothesisRegistryEntry,
  fired: SupportingSignal[],
  ctx: SignalEvaluationContext,
  evidenceRatio: number,
  evidenceStrength: EvidenceStrength,
  evidenceMetrics: ComputedEvidenceBundle["metrics"],
  exposureBundle: OpportunityExposureBundle,
): DiagnosticHypothesis {
  const supporting = matchSignals(fired, entry.triggerSignalIds);
  const conflicting = conflictingSignals(fired, entry.conflictingSignalIds);

  const confidence = scoreHypothesisConfidence({
    supportingSignals: supporting,
    conflictingSignals: conflicting,
    hypothesisFamily: entry.hypothesisFamily,
    roleInference: ctx.roleInference,
    evidenceCoverageRatio: evidenceRatio,
    eprAverage: ctx.eprAverage,
  });

  const themeExposure = buildThemeExposureContext(
    exposureBundle,
    entry.hypothesisFamily,
  );

  const opportunityTheme = calibrateOpportunityTheme(
    entry.opportunityThemeId,
    entry.hypothesisFamily,
    confidence.level,
    entry.elasticitySensitivity,
    {
      themeName: entry.hypothesisName,
      supportingSignals: supporting,
      confidence,
      evidenceStrength,
      evidenceMetrics,
      themeExposure,
    },
  );

  const rationale = generateHypothesisRationale(
    entry.narrativeKey,
    supporting,
    entry.hypothesisName,
  );

  const status = shouldSuppressHypothesis(confidence)
    ? "suppressed_low_confidence"
    : "surfaced";

  return {
    id: entry.id,
    hypothesisName: entry.hypothesisName,
    hypothesisFamily: entry.hypothesisFamily,
    description: entry.description,
    rationale,
    supportingSignals: supporting,
    conflictingSignals: conflicting,
    retailerContexts: entry.retailerContexts,
    categoryContexts: entry.categoryContexts,
    architectureImplications: entry.architectureImplications,
    confidence,
    opportunityTheme,
    elasticitySensitivity: entry.elasticitySensitivity,
    status,
    priorityRank: 0,
  };
}

export function runDiagnosticHypothesisEngine(
  input: HypothesisEngineInput,
): DiagnosticHypothesisOutput {
  const roleInference = inferRoles({
    archetypeId: input.knowledge.archetypeId,
    pricingPosture: input.knowledge.pricingPosture,
    strategicObjectives: input.knowledge.strategicObjectives,
    categoryHint: input.knowledge.categoryHint,
  });

  const patterns = buildObservedPatternsOutput(
    input.normalizedFields,
    input.leverUnlocks,
  );

  const allFeatures = [
    ...patterns.kviPatterns.features,
    ...patterns.architecturePatterns.features,
    ...patterns.zoningPatterns.features,
    ...patterns.promotionPatterns.features,
    ...patterns.markdownPatterns.features,
  ];
  const defined = allFeatures.filter((f) => f.status !== "not_defined").length;
  const total = allFeatures.length;
  const evidenceRatio = total > 0 ? defined / total : 0;

  const signalCtx: SignalEvaluationContext = {
    knowledge: input.knowledge,
    roleInference,
    normalizedFields: input.normalizedFields,
    patternFeaturesDefined: defined,
    patternFeaturesTotal: total,
    eprAverage: eprAverage(input.eprScores),
  };

  const evidence: ComputedEvidenceBundle = input.evidenceInput
    ? runEvidenceComputation(input.evidenceInput)
    : runEvidenceComputation({
        archetypeId: input.knowledge.archetypeId,
        pricingPosture: input.knowledge.pricingPosture,
        categoryRows: [],
        normalizedFields: input.normalizedFields,
      });

  const exposureBundle =
    input.opportunityExposure ??
    (input.evidenceInput
      ? runOpportunityExposureEngine({
          ...input.evidenceInput,
          evidence,
          eprAverage: eprAverage(input.eprScores),
        })
      : runOpportunityExposureEngine({
          archetypeId: input.knowledge.archetypeId,
          pricingPosture: input.knowledge.pricingPosture,
          categoryRows: [],
          normalizedFields: input.normalizedFields,
          evidence,
          eprAverage: eprAverage(input.eprScores),
        }));

  const frameworkFired = evaluateStructuralSignals(signalCtx);
  const fired = mergeEvidenceWithFrameworkSignals(frameworkFired, evidence);

  const registryMap = new Map(
    DIAGNOSTIC_HYPOTHESIS_REGISTRY.map((e) => [e.id, e] as const),
  );

  const candidates: DiagnosticHypothesis[] = [];

  for (const entry of DIAGNOSTIC_HYPOTHESIS_REGISTRY) {
    if (!entry.retailerContexts.includes(input.knowledge.archetypeId)) continue;
    if (!isHypothesisEvidenceEligible(entry.id, evidence)) continue;

    const supporting = matchSignals(fired, entry.triggerSignalIds);
    if (supporting.length < entry.minSignalsToSurface) continue;

    candidates.push(
      buildCandidate(
        entry,
        fired,
        signalCtx,
        evidenceRatio,
        evidence.evidenceStrength,
        evidence.metrics,
        exposureBundle,
      ),
    );
  }

  const { surfaced, suppressed } = prioritizeHypotheses(candidates, registryMap);

  return {
    generatedAt: new Date().toISOString(),
    engineVersion: "6a.1.0-evidence",
    guardrailMessage:
      "Hypotheses are evidence-backed structural interpretations — not pricing recommendations, optimizations, or benchmark verdicts. Themes without measured signals are suppressed.",
    hypotheses: surfaced,
    suppressedCount: suppressed.length,
    architectureFirstNote: `Architecture-related themes prioritized (max ${MAX_SURFACED_HYPOTHESES} surfaced). ${suppressed.length} theme(s) suppressed for low confidence or rank.`,
  };
}

export function getFiredSignalSummary(input: HypothesisEngineInput): SupportingSignal[] {
  const roleInference = inferRoles({
    archetypeId: input.knowledge.archetypeId,
    pricingPosture: input.knowledge.pricingPosture,
    strategicObjectives: input.knowledge.strategicObjectives,
    categoryHint: input.knowledge.categoryHint,
  });
  const patterns = buildObservedPatternsOutput(
    input.normalizedFields,
    input.leverUnlocks,
  );
  const allFeatures = [
    ...patterns.kviPatterns.features,
    ...patterns.architecturePatterns.features,
    ...patterns.zoningPatterns.features,
    ...patterns.promotionPatterns.features,
    ...patterns.markdownPatterns.features,
  ];
  const defined = allFeatures.filter((f) => f.status !== "not_defined").length;
  return evaluateStructuralSignals({
    knowledge: input.knowledge,
    roleInference,
    normalizedFields: input.normalizedFields,
    patternFeaturesDefined: defined,
    patternFeaturesTotal: allFeatures.length,
    eprAverage: eprAverage(input.eprScores),
  });
}
