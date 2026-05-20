import type { LeverKey } from "@/types/diagnostic-output";
import type {
  DiagnosticAvailability,
  UploadReadinessState,
} from "@/types/data-readiness";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import { CANONICAL_FIELD_CATALOG } from "@/data/uploadFieldCatalog";

export type LeverDiagnosticRequirements = {
  leverKey: LeverKey;
  label: string;
  requiredFields: CanonicalFieldKey[];
  recommendedFields: CanonicalFieldKey[];
  optionalFields: CanonicalFieldKey[];
  /** File kinds that typically supply evidence for this lever. */
  contributingFileKinds: import("@/types/data-readiness").UploadFileKind[];
};

function fieldsForLever(
  leverKey: LeverKey,
  need: "required" | "recommended" | "optional",
): CanonicalFieldKey[] {
  return CANONICAL_FIELD_CATALOG.filter((f) => f.leverNeeds[leverKey] === need).map(
    (f) => f.key,
  );
}

export const LEVER_DIAGNOSTIC_REQUIREMENTS: LeverDiagnosticRequirements[] = [
  {
    leverKey: "kvis",
    label: "KVI patterns",
    requiredFields: fieldsForLever("kvis", "required"),
    recommendedFields: fieldsForLever("kvis", "recommended"),
    optionalFields: fieldsForLever("kvis", "optional"),
    contributingFileKinds: [
      "price_file",
      "product_master",
      "sales_volume",
      "promotion",
    ],
  },
  {
    leverKey: "price_architecture",
    label: "Price architecture patterns",
    requiredFields: fieldsForLever("price_architecture", "required"),
    recommendedFields: fieldsForLever("price_architecture", "recommended"),
    optionalFields: fieldsForLever("price_architecture", "optional"),
    contributingFileKinds: [
      "price_file",
      "product_master",
      "sales_volume",
      "margin_cost",
    ],
  },
  {
    leverKey: "price_zoning",
    label: "Price zoning patterns",
    requiredFields: fieldsForLever("price_zoning", "required"),
    recommendedFields: fieldsForLever("price_zoning", "recommended"),
    optionalFields: fieldsForLever("price_zoning", "optional"),
    contributingFileKinds: ["price_file", "store_zone", "sales_volume"],
  },
  {
    leverKey: "promotions",
    label: "Promotion patterns",
    requiredFields: fieldsForLever("promotions", "required"),
    recommendedFields: fieldsForLever("promotions", "recommended"),
    optionalFields: fieldsForLever("promotions", "optional"),
    contributingFileKinds: ["price_file", "promotion", "sales_volume"],
  },
  {
    leverKey: "markdown",
    label: "Markdown patterns",
    requiredFields: fieldsForLever("markdown", "required"),
    recommendedFields: fieldsForLever("markdown", "recommended"),
    optionalFields: fieldsForLever("markdown", "optional"),
    contributingFileKinds: ["markdown", "price_file", "margin_cost"],
  },
];

/** When overall state reaches diagnostics_ready, per-lever availability (future). */
export function leverAvailabilityWhenReady(
  leverKey: LeverKey,
): DiagnosticAvailability {
  const req = LEVER_DIAGNOSTIC_REQUIREMENTS.find((l) => l.leverKey === leverKey);
  if (!req) return "unavailable";
  if (req.requiredFields.length === 0) return "limited";
  return "available";
}

export function readinessStateLabel(state: UploadReadinessState): string {
  const labels: Record<UploadReadinessState, string> = {
    not_uploaded: "Not uploaded",
    partially_uploaded: "Partially uploaded",
    upload_complete: "Upload complete",
    normalization_partial: "Normalization partial",
    normalization_complete: "Normalization complete",
    diagnostics_limited: "Diagnostics limited",
    diagnostics_ready: "Diagnostics ready",
  };
  return labels[state];
}
