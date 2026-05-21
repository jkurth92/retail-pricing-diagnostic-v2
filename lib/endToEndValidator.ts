import {
  checkArchetypePostureAlignment,
  checkExecutiveReadout,
  checkHypothesisOutput,
  checkStorylineCoherence,
} from "@/lib/diagnosticConsistencyChecker";
import { runContextSanityChecks } from "@/lib/contextSanityChecks";
import type { RetailerValidationScenario } from "@/tests/e2e/retailer-scenarios";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

export type ValidationSeverity = "pass" | "info" | "warning" | "error";

export type ValidationFlag = {
  code: string;
  severity: ValidationSeverity;
  message: string;
};

export type EndToEndValidationInput = {
  scenario: RetailerValidationScenario;
  knowledge: KnowledgeRegistryContext;
  hypothesisOutput: DiagnosticHypothesisOutput;
  storylineResult: StorylineSynthesisResult;
  readout: DiagnosticReadout;
  enrichment: RetailerEnrichmentBundle;
};

export type EndToEndValidationResult = {
  scenarioId: string;
  scenarioLabel: string;
  passed: boolean;
  flags: ValidationFlag[];
  summary: {
    hypothesisCount: number;
    primaryThemeCount: number;
    secondaryThemeCount: number;
    implicationCount: number;
    enrichmentStatus: string;
    marginRange: string;
  };
};

export function runEndToEndValidation(
  input: EndToEndValidationInput,
): EndToEndValidationResult {
  const flags: ValidationFlag[] = [
    ...checkArchetypePostureAlignment(input.knowledge, input.scenario),
    ...checkHypothesisOutput(input.hypothesisOutput),
    ...checkStorylineCoherence(input.storylineResult, input.scenario),
    ...checkExecutiveReadout(input.readout, input.scenario.id),
    ...runContextSanityChecks(
      input.enrichment,
      input.hypothesisOutput.hypotheses.length,
    ),
  ];

  const errors = flags.filter((f) => f.severity === "error").length;
  const warnings = flags.filter((f) => f.severity === "warning").length;
  const passed = errors === 0 && warnings <= 3;

  if (passed && flags.every((f) => f.severity !== "pass")) {
    flags.push({
      code: "validation_ok",
      severity: "pass",
      message: "End-to-end flow coherent within calibration guardrails.",
    });
  }

  return {
    scenarioId: input.scenario.id,
    scenarioLabel: input.scenario.label,
    passed,
    flags,
    summary: {
      hypothesisCount: input.hypothesisOutput.hypotheses.length,
      primaryThemeCount: input.storylineResult.storyline.primaryThemes.length,
      secondaryThemeCount: input.storylineResult.storyline.secondaryThemes.length,
      implicationCount: input.readout.strategicImplications.length,
      enrichmentStatus: input.enrichment.meta.profileStatus,
      marginRange: input.storylineResult.storyline.marginOpportunityTotalRange,
    },
  };
}
