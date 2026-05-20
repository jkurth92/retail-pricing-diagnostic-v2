import type { LeverKey } from "@/types/diagnostic-output";
import type { FieldRequirement, UploadFileKind } from "@/types/data-readiness";

/** Canonical normalized field keys — single internal schema for all uploads. */
export type CanonicalFieldKey =
  | "sku"
  | "productName"
  | "brand"
  | "category"
  | "subcategory"
  | "price"
  | "unitPrice"
  | "packSize"
  | "sizeUnit"
  | "upc"
  | "store"
  | "zone"
  | "region"
  | "revenue"
  | "units"
  | "cost"
  | "margin"
  | "promoFlag"
  | "promoPrice"
  | "markdownFlag"
  | "markdownPrice"
  | "effectiveDate"
  | "endDate"
  | "kviFlag"
  | "privateLabelFlag";

export type LeverFieldNeed = FieldRequirement | "not_needed";

export type CanonicalFieldDefinition = {
  key: CanonicalFieldKey;
  displayLabel: string;
  description: string;
  /** Role in the canonical normalized record (not upload-file-specific). */
  canonicalRequirement: FieldRequirement;
  /** Client file types that may supply this field after mapping. */
  sourceFileKinds: UploadFileKind[];
  /** Per-lever need once normalized (for diagnostic availability). */
  leverNeeds: Record<LeverKey, LeverFieldNeed>;
};

/** One row in the normalized pricing diagnostic dataset (all fields optional until parsed). */
export type NormalizedPricingRecord = {
  [K in CanonicalFieldKey]?: string | number | boolean | null;
};

export type UploadFileSchemaDefinition = {
  kind: UploadFileKind;
  label: string;
  purpose: string;
  /** Fields this file type is expected to map into the canonical schema. */
  mapsToFields: CanonicalFieldKey[];
  /** Fields required from this file for upload_complete readiness. */
  requiredFromFile: CanonicalFieldKey[];
  recommendedFromFile: CanonicalFieldKey[];
  optionalFromFile: CanonicalFieldKey[];
  /** Diagnostic levers this file can contribute evidence toward (after normalization). */
  contributesToLevers: LeverKey[];
};

export type CanonicalUploadSchema = {
  version: string;
  normalizedRecordName: "NormalizedPricingRecord";
  fields: CanonicalFieldDefinition[];
  fileTypes: UploadFileSchemaDefinition[];
};
