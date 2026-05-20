import type { LeverKey } from "@/types/diagnostic-output";
import type { CanonicalFieldKey } from "@/types/upload-schema";

export type UploadFileKind =
  | "price_file"
  | "product_master"
  | "store_zone"
  | "sales_volume"
  | "margin_cost"
  | "promotion"
  | "markdown"
  | "context_documents";

export type FieldRequirement = "required" | "recommended" | "optional";

/** Upload and normalization lifecycle — descriptive only in Step 3. */
export type UploadReadinessState =
  | "not_uploaded"
  | "partially_uploaded"
  | "upload_complete"
  | "normalization_partial"
  | "normalization_complete"
  | "diagnostics_limited"
  | "diagnostics_ready";

export type DiagnosticAvailability =
  | "unavailable"
  | "limited"
  | "available";

export type LeverDiagnosticReadiness = {
  leverKey: LeverKey;
  label: string;
  availability: DiagnosticAvailability;
  missingRequiredFields: CanonicalFieldKey[];
  readinessState: UploadReadinessState;
  note: string;
};

/** Descriptive scoring dimensions — values null until parsing is implemented. */
export type ReadinessScoreMetrics = {
  fieldCoveragePct: number | null;
  fileCoveragePct: number | null;
  rowCoveragePct: number | null;
  diagnosticCoveragePct: number | null;
  dataQualityNotes: string[];
};

export type UploadFileReadinessCard = {
  kind: UploadFileKind;
  label: string;
  purpose: string;
  readinessState: UploadReadinessState;
  normalizationLabel: "Pending normalization" | "Ready for diagnostic use";
  requiredFieldsPresent: CanonicalFieldKey[];
  requiredFieldsMissing: CanonicalFieldKey[];
  recommendedFieldsMissing: CanonicalFieldKey[];
  unlocksDiagnostics: LeverKey[];
  diagnosticsAvailability: DiagnosticAvailability;
  score: ReadinessScoreMetrics;
  readinessNote: string;
};

export type OverallReadinessSummary = {
  overallState: UploadReadinessState;
  implementationStatus: "schema_defined" | "parsing_not_active";
  score: ReadinessScoreMetrics;
  leverReadiness: LeverDiagnosticReadiness[];
  summaryNotes: string[];
};

export type DataReadinessModel = OverallReadinessSummary & {
  uploads: UploadFileReadinessCard[];
};

/** @deprecated Use UploadFileReadinessCard — retained for gradual migration. */
export type SchemaFieldDefinition = {
  name: string;
  requirement: FieldRequirement;
  description: string;
};

/** @deprecated Use UploadFileReadinessCard */
export type UploadReadinessEntry = {
  kind: UploadFileKind;
  label: string;
  status: "not_uploaded";
  requiredFields: SchemaFieldDefinition[];
  recommendedFields: SchemaFieldDefinition[];
  optionalFields: SchemaFieldDefinition[];
  diagnosticsAvailability: DiagnosticAvailability;
  readinessNote: string;
  parsingStatus: import("@/types/diagnostic-output").CalculationStatus;
};
