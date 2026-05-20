import type { CalculationStatus, LeverKey } from "@/types/diagnostic-output";

export type PatternSectionStatus = {
  status: CalculationStatus;
  evidenceLabel: string;
  findingsLabel: string;
  opportunityImpactLabel: string;
};

export type ObservedPricingPatternsOutput = {
  guardrailMessage: string;
  sections: Record<LeverKey, PatternSectionStatus>;
  overallStatus: CalculationStatus;
};
