import type { LeverKey } from "@/types/diagnostic-output";
import type { UploadReadinessState } from "@/types/data-readiness";
import type { ColumnCandidate } from "@/types/column-mapping";
import type { NormalizationStatus } from "@/types/normalization";

export type UploadFileType =
  | "price_file"
  | "product_master"
  | "store_zone_file"
  | "sales_volume_file"
  | "margin_cost_file"
  | "promotion_file"
  | "markdown_file"
  | "optional_context_document";

export type DiagnosticUnlockStatus =
  | "unavailable"
  | "limited"
  | "available"
  | "ready";

export type LeverDiagnosticUnlock = {
  leverKey: LeverKey;
  label: string;
  status: DiagnosticUnlockStatus;
  message: string;
  missingFields: string[];
};

export type UploadFile = {
  id: string;
  fileType: UploadFileType;
  uploadedAt: string;
  originalFileName: string;
  status: "placeholder_preview" | "not_uploaded";
  rowCount: number | null;
  detectedColumns: string[];
  mappedColumns: ColumnCandidate[];
  normalizationStatus: NormalizationStatus;
  readinessState: UploadReadinessState;
  diagnosticsUnlocked: LeverKey[];
  notes: string;
};
