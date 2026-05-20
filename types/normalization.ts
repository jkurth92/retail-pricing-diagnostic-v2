import type { CanonicalFieldKey } from "@/types/upload-schema";
import type {
  LeverDiagnosticUnlock,
} from "@/types/ingestion";
import type { UploadReadinessState } from "@/types/data-readiness";
import type { NormalizedFieldMapping } from "@/types/column-mapping";
import type { UploadFile } from "@/types/ingestion";

export type NormalizationStatus =
  | "not_started"
  | "mapping_in_progress"
  | "partially_normalized"
  | "normalized"
  | "normalization_failed";

export type NormalizationIssueType =
  | "missing_required_field"
  | "low_mapping_confidence"
  | "duplicate_columns"
  | "invalid_values"
  | "low_row_coverage"
  | "unsupported_format";

export type NormalizationIssue = {
  type: NormalizationIssueType;
  message: string;
  field: CanonicalFieldKey | null;
  sourceColumn: string | null;
};

export type NormalizedDatasetSummary = {
  uploadedFiles: UploadFile[];
  normalizedFields: CanonicalFieldKey[];
  missingFields: CanonicalFieldKey[];
  readinessSummary: UploadReadinessState;
  leverUnlocks: LeverDiagnosticUnlock[];
  normalizationIssues: NormalizationIssue[];
  fieldMappings: NormalizedFieldMapping[];
  score: {
    fieldCoveragePct: number | null;
    fileCoveragePct: number | null;
    rowCoveragePct: number | null;
    diagnosticCoveragePct: number | null;
  };
};
