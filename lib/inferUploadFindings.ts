import {
  canonicalFieldsFromResolutions,
  normalizeDetectedColumns,
} from "@/lib/fieldNormalization";
import { evaluateDiagnosticUnlocks } from "@/lib/diagnosticUnlocks";
import type { LeverKey } from "@/types/diagnostic-output";
import type { CanonicalFieldKey } from "@/types/upload-schema";

const LEVER_SHORT_LABEL: Record<LeverKey, string> = {
  kvis: "KVI",
  price_architecture: "Architecture",
  price_zoning: "Zoning",
  promotions: "Promotions",
  markdown: "Markdown",
};

/** Minimum mapping confidence to treat a column as a structural signal. */
const DETECTION_CONFIDENCE_MIN = 0.85;

export type UploadFindings = {
  detected: string[];
  diagnosticsAvailable: string[];
  hasFileSignal: boolean;
};

const PRICING_FIELDS: CanonicalFieldKey[] = ["price", "unitPrice", "promoPrice"];
const CATEGORY_FIELDS: CanonicalFieldKey[] = ["category", "subcategory"];
const GEO_FIELDS: CanonicalFieldKey[] = ["store", "zone", "region"];
const PROMO_FIELDS: CanonicalFieldKey[] = [
  "promoFlag",
  "promoPrice",
  "markdownFlag",
  "markdownPrice",
];

export function inferUploadFindings(
  uploadedFileCount: number,
  detectedColumns: string[] = [],
): UploadFindings {
  const hasFileSignal = uploadedFileCount > 0;

  if (!hasFileSignal) {
    return {
      detected: [],
      diagnosticsAvailable: ["Architecture", "KVI"],
      hasFileSignal: false,
    };
  }

  if (detectedColumns.length === 0) {
    return {
      detected: ["Pricing structure"],
      diagnosticsAvailable: ["Architecture", "Promotions"],
      hasFileSignal: true,
    };
  }

  const resolutions = normalizeDetectedColumns(detectedColumns);
  const fields = new Set(
    canonicalFieldsFromResolutions(
      resolutions,
      [],
      DETECTION_CONFIDENCE_MIN,
    ),
  );

  const detected: string[] = [];
  if (PRICING_FIELDS.some((f) => fields.has(f))) {
    detected.push("Pricing structure");
  }
  if (CATEGORY_FIELDS.some((f) => fields.has(f))) {
    detected.push("Category hierarchy");
  }
  if (GEO_FIELDS.some((f) => fields.has(f))) {
    detected.push("Store / zone information");
  }
  if (PROMO_FIELDS.some((f) => fields.has(f))) {
    detected.push("Promotional indicators");
  }

  const unlocks = evaluateDiagnosticUnlocks([...fields]);
  const diagnosticsAvailable = unlocks
    .filter((u) => u.status === "available" || u.status === "ready")
    .map((u) => LEVER_SHORT_LABEL[u.leverKey]);

  return {
    detected,
    diagnosticsAvailable:
      diagnosticsAvailable.length > 0
        ? diagnosticsAvailable
        : detected.includes("Pricing structure")
          ? ["Architecture", "Promotions"]
          : ["Architecture", "KVI"],
    hasFileSignal: true,
  };
}
