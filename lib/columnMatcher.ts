import { normalizeColumnHeader } from "@/lib/fieldNormalization";
import type { ColumnCandidate, MappingMethod } from "@/types/column-mapping";
import type { CanonicalFieldKey } from "@/types/upload-schema";

const REVIEW_CONFIDENCE_THRESHOLD = 0.85;

export function matchColumn(sourceColumn: string): ColumnCandidate {
  const resolved = normalizeColumnHeader(sourceColumn);
  const method: MappingMethod =
    resolved.method === "semantic_inference" || !resolved.canonicalField
      ? "unmapped"
      : resolved.method === "exact_match" ||
          resolved.method === "synonym_match" ||
          resolved.method === "fuzzy_match"
        ? resolved.method
        : "fuzzy_match";
  const confidence = resolved.confidence;
  return {
    sourceColumn,
    normalizedField: resolved.canonicalField,
    confidence: resolved.canonicalField ? confidence : null,
    mappingMethod: method,
    requiresReview:
      resolved.canonicalField != null
        ? confidence < REVIEW_CONFIDENCE_THRESHOLD
        : true,
  };
}

export function matchDetectedColumns(
  detectedColumns: string[],
): ColumnCandidate[] {
  return detectedColumns.map(matchColumn);
}

export function buildFieldMappingsFromCandidates(
  candidates: ColumnCandidate[],
  fileType: import("@/types/ingestion").UploadFileType,
  requiredFields: CanonicalFieldKey[],
): import("@/types/column-mapping").NormalizedFieldMapping[] {
  const byField = new Map<CanonicalFieldKey, ColumnCandidate>();
  for (const c of candidates) {
    if (c.normalizedField && !byField.has(c.normalizedField)) {
      byField.set(c.normalizedField, c);
    }
  }
  const allFields = new Set<CanonicalFieldKey>([
    ...requiredFields,
    ...byField.keys(),
  ]);
  return Array.from(allFields).map((normalizedField) => {
    const match = byField.get(normalizedField);
    return {
      normalizedField,
      sourceColumn: match?.sourceColumn ?? null,
      sourceFileType: fileType,
      confidence: match?.confidence ?? null,
      required: requiredFields.includes(normalizedField),
      mappingStatus: match
        ? match.requiresReview
          ? "pending_review"
          : "mapped"
        : "unmapped",
    };
  });
}
