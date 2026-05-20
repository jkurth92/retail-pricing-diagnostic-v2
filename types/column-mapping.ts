import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { UploadFileType } from "@/types/ingestion";

export type MappingMethod =
  | "exact_match"
  | "fuzzy_match"
  | "synonym_match"
  | "user_selected"
  | "unmapped";

export type MappingStatus =
  | "mapped"
  | "pending_review"
  | "unmapped"
  | "rejected";

export type ColumnCandidate = {
  sourceColumn: string;
  normalizedField: CanonicalFieldKey | null;
  confidence: number | null;
  mappingMethod: MappingMethod;
  requiresReview: boolean;
};

export type NormalizedFieldMapping = {
  normalizedField: CanonicalFieldKey;
  sourceColumn: string | null;
  sourceFileType: UploadFileType;
  confidence: number | null;
  required: boolean;
  mappingStatus: MappingStatus;
};
