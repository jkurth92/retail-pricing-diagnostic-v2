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

/** Headers that must not map to store/zone/region (e.g. product URLs). */
const GEO_FIELD_DENY_PATTERNS = [
  /_uri$/,
  /_url$/,
  /^url_/,
  /^uri_/,
  /product_uri/,
  /product_url/,
  /web_?url/,
  /page_url/,
  /link_url/,
];

function isDeniedGeoHeader(token: string): boolean {
  return GEO_FIELD_DENY_PATTERNS.some((pattern) => pattern.test(token));
}

function tokenSimilarity(a: string, b: string): number {
  if (a === b) return 1;

  const aParts = a.split("_").filter(Boolean);
  const bParts = b.split("_").filter(Boolean);
  if (aParts.includes(b) || bParts.includes(a)) {
    return 0.95;
  }

  const shared = aParts.filter((part) => bParts.includes(part));
  if (shared.length > 0) {
    return shared.length / Math.max(aParts.length, bParts.length);
  }

  if (b.length >= 4 && a.includes(b)) {
    const longer = Math.max(a.length, b.length);
    const shorter = Math.min(a.length, b.length);
    return shorter / longer;
  }
  if (a.length >= 4 && b.includes(a)) {
    const longer = Math.max(b.length, a.length);
    const shorter = Math.min(a.length, b.length);
    return shorter / longer;
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
    const geoField =
      fuzzy.field === "store" ||
      fuzzy.field === "zone" ||
      fuzzy.field === "region";
    if (geoField && isDeniedGeoHeader(token)) {
      return {
        sourceColumn,
        canonicalField: null,
        method: "semantic_inference",
        confidence: 0,
        inferredPurpose: "Unmapped — may still support proxy inference",
      };
    }
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
  minConfidence = 0.55,
): CanonicalFieldKey[] {
  const set = new Set<CanonicalFieldKey>(existing);
  for (const r of resolutions) {
    if (r.canonicalField && r.confidence >= minConfidence) {
      set.add(r.canonicalField);
    }
  }
  return [...set];
}
