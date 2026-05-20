import type { CalculationStatus } from "@/types/diagnostic-output";

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

export type SchemaFieldDefinition = {
  name: string;
  requirement: FieldRequirement;
  description: string;
};

export type DiagnosticAvailability =
  | "unavailable"
  | "limited"
  | "available";

export type UploadReadinessEntry = {
  kind: UploadFileKind;
  label: string;
  status: "not_uploaded";
  requiredFields: SchemaFieldDefinition[];
  recommendedFields: SchemaFieldDefinition[];
  optionalFields: SchemaFieldDefinition[];
  diagnosticsAvailability: DiagnosticAvailability;
  readinessNote: string;
  parsingStatus: CalculationStatus;
};

export type DataReadinessModel = {
  overallStatus: CalculationStatus;
  uploads: UploadReadinessEntry[];
  summaryNotes: string[];
};
