import type { LeverKey } from "@/types/diagnostic-output";
import type { UploadFileType } from "@/types/ingestion";
import type { CanonicalFieldKey } from "@/types/upload-schema";

export type PatternFeatureStatus =
  | "not_defined"
  | "defined"
  | "pending_alignment"
  | "ready_for_engine";

export type PatternOutputType =
  | "numeric"
  | "percent"
  | "categorical"
  | "boolean"
  | "range"
  | "composite";

export type PatternEvidenceLink = {
  evidenceId: string;
  sourceFileType: UploadFileType | null;
  sourceFields: CanonicalFieldKey[];
  interpretationNote: string;
};

export type PatternFeature = {
  id: string;
  leverKey: LeverKey;
  featureName: string;
  description: string;
  sourceFields: CanonicalFieldKey[];
  calculationNote: string;
  outputType: PatternOutputType;
  status: PatternFeatureStatus;
  requiresAlignment: boolean;
  examples: string[];
  value: number | null;
  evidenceLinks: PatternEvidenceLink[];
};

export type LeverPatternFeaturesSection = {
  leverKey: LeverKey;
  label: string;
  features: PatternFeature[];
  featureCount: number;
  requiredFields: CanonicalFieldKey[];
  sectionStatus: PatternFeatureStatus;
  readinessSummary: string;
  missingInputs: CanonicalFieldKey[];
  notes: string;
  evidenceLabel: string;
  findingsLabel: string;
  opportunityImpactLabel: string;
};
