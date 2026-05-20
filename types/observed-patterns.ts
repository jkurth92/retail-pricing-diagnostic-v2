import type { CalculationStatus, LeverKey } from "@/types/diagnostic-output";
import type {
  LeverPatternFeaturesSection,
  PatternFeatureStatus,
} from "@/types/pattern-features";
import type { CanonicalFieldKey } from "@/types/upload-schema";

/** @deprecated Legacy section status — use LeverPatternFeaturesSection */
export type PatternSectionStatus = {
  status: CalculationStatus;
  evidenceLabel: string;
  findingsLabel: string;
  opportunityImpactLabel: string;
};

export type ObservedPricingPatternsOutput = {
  guardrailMessage: string;
  status: PatternFeatureStatus;
  overallStatus: CalculationStatus;
  kviPatterns: LeverPatternFeaturesSection;
  architecturePatterns: LeverPatternFeaturesSection;
  zoningPatterns: LeverPatternFeaturesSection;
  promotionPatterns: LeverPatternFeaturesSection;
  markdownPatterns: LeverPatternFeaturesSection;
  readinessSummary: string;
  missingInputs: CanonicalFieldKey[];
  notes: string[];
  /** Legacy map for output contract compatibility */
  sections: Record<LeverKey, PatternSectionStatus>;
};

export function leverSectionToKey(
  section: LeverPatternFeaturesSection,
): LeverKey {
  return section.leverKey;
}
