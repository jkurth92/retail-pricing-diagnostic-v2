/**
 * Dynamic category normalization — fuzzy retailer taxonomy → scope categories.
 */

import {
  RETAILER_CATEGORY_ALIASES,
  SCOPE_CATEGORY_VOCAB,
} from "@/lib/retailerCategoryMappings";
import type { CategoryMapping } from "@/types/data-interpretation";

function normalizeToken(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function fuzzyToScope(token: string): { normalized: string; confidence: number } | null {
  let best: { normalized: string; confidence: number } | null = null;
  for (const scope of SCOPE_CATEGORY_VOCAB) {
    const s = scope.toLowerCase();
    if (token === s) return { normalized: scope, confidence: 1 };
    if (token.includes(s) || s.includes(token)) {
      const sim =
        Math.min(token.length, s.length) / Math.max(token.length, s.length);
      if (sim >= 0.5 && (!best || sim > best.confidence)) {
        best = { normalized: scope, confidence: sim };
      }
    }
  }
  return best;
}

export function normalizeCategoryName(rawCategory: string): CategoryMapping {
  const token = normalizeToken(rawCategory);
  if (!token) {
    return {
      rawCategory,
      normalizedCategory: "Other",
      method: "hierarchy_inference",
      confidence: 0.3,
    };
  }

  for (const entry of RETAILER_CATEGORY_ALIASES) {
    for (const alias of entry.aliases) {
      if (token === alias || token.includes(alias) || alias.includes(token)) {
        return {
          rawCategory,
          normalizedCategory: entry.normalized,
          method: "alias",
          confidence: 0.9,
        };
      }
    }
  }

  const fuzzy = fuzzyToScope(token);
  if (fuzzy) {
    return {
      rawCategory,
      normalizedCategory: fuzzy.normalized,
      method: fuzzy.confidence >= 0.85 ? "exact" : "fuzzy",
      confidence: fuzzy.confidence,
    };
  }

  const title = rawCategory.trim();
  return {
    rawCategory,
    normalizedCategory: title.length > 2 ? title : "Other",
    method: "hierarchy_inference",
    confidence: 0.45,
  };
}

export function normalizeCategoryList(rawNames: string[]): CategoryMapping[] {
  const seen = new Set<string>();
  const out: CategoryMapping[] = [];
  for (const raw of rawNames) {
    const key = normalizeToken(raw);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(normalizeCategoryName(raw));
  }
  return out;
}
