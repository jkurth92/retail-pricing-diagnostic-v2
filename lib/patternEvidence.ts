import { CANONICAL_FIELD_CATALOG } from "@/data/uploadFieldCatalog";
import type { UploadFileType } from "@/types/ingestion";
import type { PatternEvidenceLink } from "@/types/pattern-features";
import type { CanonicalFieldKey } from "@/types/upload-schema";

const fieldByKey = new Map(
  CANONICAL_FIELD_CATALOG.map((f) => [f.key, f] as const),
);

function primaryFileTypeForField(
  field: CanonicalFieldKey,
): UploadFileType | null {
  const def = fieldByKey.get(field);
  if (!def?.sourceFileKinds?.length) return null;
  const kind = def.sourceFileKinds[0];
  const map: Record<string, UploadFileType> = {
    price_file: "price_file",
    product_master: "product_master",
    store_zone: "store_zone_file",
    sales_volume: "sales_volume_file",
    margin_cost: "margin_cost_file",
    promotion: "promotion_file",
    markdown: "markdown_file",
    optional_context: "optional_context_document",
  };
  return map[kind] ?? null;
}

export function buildEvidenceLinksForFields(
  sourceFields: CanonicalFieldKey[],
  featureId: string,
): PatternEvidenceLink[] {
  const seen = new Set<string>();
  const links: PatternEvidenceLink[] = [];

  for (const field of sourceFields) {
    const evidenceId = `evidence-${featureId}-${field}`;
    if (seen.has(evidenceId)) continue;
    seen.add(evidenceId);

    const def = fieldByKey.get(field);
    links.push({
      evidenceId,
      sourceFileType: primaryFileTypeForField(field),
      sourceFields: [field],
      interpretationNote: def
        ? `${def.displayLabel}: ${def.description}`
        : `Normalized field "${field}" supplies this feature after mapping.`,
    });
  }

  return links;
}

export function describeMissingFields(
  required: CanonicalFieldKey[],
  present: Set<CanonicalFieldKey>,
): CanonicalFieldKey[] {
  return required.filter((f) => !present.has(f));
}
