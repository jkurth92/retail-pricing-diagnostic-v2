/**
 * Semantic field normalization — messy retailer headers → canonical keys.
 */

import { FIELD_ABBREVIATION_HINTS, FIELD_SYNONYMS } from "@/data/fieldSynonyms";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { FieldResolution, FieldResolutionMethod } from "@/types/data-interpretation";

export function normalizeHeaderToken(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function tokenSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) {
    const longer = Math.max(a.length, b.length);
    const shorter = Math.min(a.length, b.length);
    return shorter / longer;
  }
  const aParts = a.split("_").filter(Boolean);
  const bParts = b.split("_").filter(Boolean);
  const overlap = aParts.filter((p) => bParts.includes(p)).length;
  if (overlap > 0) {
    return overlap / Math.max(aParts.length, bParts.length);
  }
  return 0;
}

function resolveExact(
  token: string,
): { field: CanonicalFieldKey; method: FieldResolutionMethod } | null {
  if (token in FIELD_ABBREVIATION_HINTS) {
    return {
      field: FIELD_ABBREVIATION_HINTS[token],
      method: "synonym_match",
    };
  }
  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS) as [
    CanonicalFieldKey,
    string[],
  ][]) {
    if (field === token) return { field, method: "exact_match" };
    if (synonyms.includes(token)) return { field, method: "synonym_match" };
  }
  return null;
}

function resolveFuzzy(token: string): {
  field: CanonicalFieldKey;
  confidence: number;
} | null {
  let best: { field: CanonicalFieldKey; confidence: number } | null = null;
  for (const [field, synonyms] of Object.entries(FIELD_SYNONYMS) as [
    CanonicalFieldKey,
    string[],
  ][]) {
    for (const candidate of [field, ...synonyms]) {
      const sim = tokenSimilarity(token, candidate);
      if (sim >= 0.55 && (!best || sim > best.confidence)) {
        best = { field, confidence: sim };
      }
    }
  }
  return best;
}

const PURPOSE_BY_FIELD: Partial<Record<CanonicalFieldKey, string>> = {
  price: "Regular or shelf price anchor",
  sku: "Product identifier",
  category: "Merchandising category / department",
  zone: "Pricing zone or cluster",
  revenue: "Sales or revenue weight",
  kviFlag: "Known value item indicator",
  privateLabelFlag: "Private label vs national brand",
  packSize: "Pack-size ladder input",
};

export function normalizeColumnHeader(sourceColumn: string): FieldResolution {
  const token = normalizeHeaderToken(sourceColumn);
  const exact = resolveExact(token);
  if (exact) {
    const confidence = exact.method === "exact_match" ? 1 : 0.92;
    return {
      sourceColumn,
      canonicalField: exact.field,
      method: exact.method,
      confidence,
      inferredPurpose: PURPOSE_BY_FIELD[exact.field],
    };
  }

  const fuzzy = resolveFuzzy(token);
  if (fuzzy) {
    return {
      sourceColumn,
      canonicalField: fuzzy.field,
      method: "fuzzy_match",
      confidence: fuzzy.confidence,
      inferredPurpose: PURPOSE_BY_FIELD[fuzzy.field],
    };
  }

  return {
    sourceColumn,
    canonicalField: null,
    method: "semantic_inference",
    confidence: 0,
    inferredPurpose: "Unmapped — may still support proxy inference",
  };
}

export function normalizeDetectedColumns(
  detectedColumns: string[],
): FieldResolution[] {
  return detectedColumns.map(normalizeColumnHeader);
}

export function canonicalFieldsFromResolutions(
  resolutions: FieldResolution[],
  existing: CanonicalFieldKey[] = [],
): CanonicalFieldKey[] {
  const set = new Set<CanonicalFieldKey>(existing);
  for (const r of resolutions) {
    if (r.canonicalField && r.confidence >= 0.55) {
      set.add(r.canonicalField);
    }
  }
  return [...set];
}
