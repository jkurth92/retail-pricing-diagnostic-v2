import { FIELD_SYNONYMS } from "@/data/fieldSynonyms";
import type {
  ColumnCandidate,
  MappingMethod,
} from "@/types/column-mapping";
import type { CanonicalFieldKey } from "@/types/upload-schema";

const REVIEW_CONFIDENCE_THRESHOLD = 0.85;

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

function findExactMatch(
  normalizedHeader: string,
): { field: CanonicalFieldKey; method: MappingMethod } | null {
  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS) as [
    CanonicalFieldKey,
    string[],
  ][]) {
    if (field === normalizedHeader) {
      return { field, method: "exact_match" };
    }
    if (synonyms.some((s) => s === normalizedHeader)) {
      return { field, method: "synonym_match" };
    }
  }
  return null;
}

function findFuzzyMatch(
  normalizedHeader: string,
): { field: CanonicalFieldKey; confidence: number } | null {
  let best: { field: CanonicalFieldKey; confidence: number } | null = null;
  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS) as [
    CanonicalFieldKey,
    string[],
  ][]) {
    const candidates = [field, ...synonyms];
    for (const candidate of candidates) {
      if (
        normalizedHeader.includes(candidate) ||
        candidate.includes(normalizedHeader)
      ) {
        const longer = Math.max(normalizedHeader.length, candidate.length);
        const shorter = Math.min(normalizedHeader.length, candidate.length);
        const confidence = shorter / longer;
        if (confidence >= 0.6 && (!best || confidence > best.confidence)) {
          best = { field, confidence };
        }
      }
    }
  }
  return best;
}

export function matchColumn(sourceColumn: string): ColumnCandidate {
  const normalizedHeader = normalizeHeader(sourceColumn);
  const exact = findExactMatch(normalizedHeader);
  if (exact) {
    const confidence = exact.method === "exact_match" ? 1 : 0.95;
    return {
      sourceColumn,
      normalizedField: exact.field,
      confidence,
      mappingMethod: exact.method,
      requiresReview: confidence < REVIEW_CONFIDENCE_THRESHOLD,
    };
  }
  const fuzzy = findFuzzyMatch(normalizedHeader);
  if (fuzzy) {
    return {
      sourceColumn,
      normalizedField: fuzzy.field,
      confidence: fuzzy.confidence,
      mappingMethod: "fuzzy_match",
      requiresReview: true,
    };
  }
  return {
    sourceColumn,
    normalizedField: null,
    confidence: null,
    mappingMethod: "unmapped",
    requiresReview: true,
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
