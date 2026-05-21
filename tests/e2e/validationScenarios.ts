import { RETAILER_VALIDATION_SCENARIOS } from "@/tests/e2e/retailer-scenarios";

export type FlowCheckpoint =
  | "retailer_context"
  | "client_context"
  | "scope_readiness"
  | "role_inference"
  | "hypothesis_generation"
  | "opportunity_framing"
  | "executive_storyline"
  | "manual_override"
  | "api_fallback";

export type ValidationScenarioExpectation = {
  scenarioId: string;
  checkpoints: FlowCheckpoint[];
  mustHaveExecutiveProfile: boolean;
  mustHavePrimaryThemes: boolean;
  maxPrimaryThemes: number;
  architectureThemeRequired: boolean;
  marginBeforeRevenueInCopy: boolean;
  apiMustNotDriveHypotheses: boolean;
};

export const VALIDATION_SCENARIO_EXPECTATIONS: ValidationScenarioExpectation[] =
  RETAILER_VALIDATION_SCENARIOS.map((s) => ({
    scenarioId: s.id,
    checkpoints: [
      "retailer_context",
      "client_context",
      "scope_readiness",
      "role_inference",
      "hypothesis_generation",
      "opportunity_framing",
      "executive_storyline",
      "manual_override",
      "api_fallback",
    ],
    mustHaveExecutiveProfile: true,
    mustHavePrimaryThemes: true,
    maxPrimaryThemes: 5,
    architectureThemeRequired: s.expectedStorylineEmphasis.includes("Architecture"),
    marginBeforeRevenueInCopy: true,
    apiMustNotDriveHypotheses: true,
  }));

export function getScenarioExpectation(
  scenarioId: string,
): ValidationScenarioExpectation | undefined {
  return VALIDATION_SCENARIO_EXPECTATIONS.find((e) => e.scenarioId === scenarioId);
}
