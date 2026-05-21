import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { buildFallbackBundle } from "@/lib/api/contextResolver";
import { runDiagnosticHypothesisEngine } from "@/lib/hypothesisEngine";
import { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import { runOpportunityStorylineEngine } from "@/lib/storylineSynthesizer";
import {
  calibrateReadoutImplications,
  calibrateStorylineResult,
} from "@/lib/outputCalibration";
import { runEndToEndValidation } from "@/lib/endToEndValidator";
import type { EndToEndValidationResult } from "@/lib/endToEndValidator";
import {
  RETAILER_VALIDATION_SCENARIOS,
  type RetailerValidationScenario,
} from "@/tests/e2e/retailer-scenarios";
import { DEFAULT_EPR_SCORES } from "@/types/ui";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

export type ValidationHarnessResult = EndToEndValidationResult & {
  scenario: RetailerValidationScenario;
  knowledge: KnowledgeRegistryContext;
};

export function buildKnowledgeFromScenario(
  scenario: RetailerValidationScenario,
): KnowledgeRegistryContext {
  return {
    archetypeId: scenario.archetypeId,
    pricingPosture: scenario.pricingPosture,
    strategicObjectives: scenario.strategicObjectives,
    categoryHint: scenario.categoryHint,
  };
}

export function runValidationScenario(
  scenarioId: string,
  eprScores = DEFAULT_EPR_SCORES,
): ValidationHarnessResult | null {
  const scenario = RETAILER_VALIDATION_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) return null;

  const knowledge = buildKnowledgeFromScenario(scenario);
  const ingestion = buildPlaceholderIngestionDataset();
  const hypothesisOutput = runDiagnosticHypothesisEngine({
    knowledge,
    normalizedFields: ingestion.normalizedFields,
    leverUnlocks: ingestion.leverUnlocks,
    eprScores,
  });

  const storylineResult = calibrateStorylineResult(
    runOpportunityStorylineEngine({
      hypothesisOutput,
      knowledge,
      retailerDisplayName: scenario.retailerName,
      hasRevenueInScope: false,
    }),
  );

  const enrichment = buildFallbackBundle(scenario.retailerName);

  const readout = calibrateReadoutImplications(
    runExecutiveDeliverableEngine({
      knowledge,
      storylineResult,
      eprScores,
      retailerDisplayName: scenario.retailerName,
      enrichment,
    }),
  );

  const validation = runEndToEndValidation({
    scenario,
    knowledge,
    hypothesisOutput,
    storylineResult,
    readout,
    enrichment,
  });

  return { ...validation, scenario, knowledge };
}

export function runAllValidationScenarios(): ValidationHarnessResult[] {
  return RETAILER_VALIDATION_SCENARIOS.map((s) => runValidationScenario(s.id)!);
}
