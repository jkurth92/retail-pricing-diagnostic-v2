/**
 * Maps product titles to in-scope commercial category names (aligned with category roles).
 */

const SCOPE_CATEGORY_RULES: { category: string; pattern: RegExp }[] = [
  {
    category: "Fragrance",
    pattern:
      /\b(fragrance|parfum|cologne|eau de toilette|eau de parfum|perfume|body mist)\b/i,
  },
  {
    category: "Cosmetics",
    pattern:
      /\b(cosmetic|makeup|mascara|lipstick|foundation|concealer|blush|eyeliner|lip gloss|bb cream)\b/i,
  },
  {
    category: "Oral care",
    pattern:
      /\b(mouthwash|toothpaste|dental|fluoride|toothbrush|floss|whitening)\b/i,
  },
  {
    category: "Pharmacy / OTC",
    pattern:
      /\b(pharmacy|prescription|otc|tablet|capsule|medicine|drug|antacid|pain relief|ibuprofen|acetaminophen|bladder|probiotic|vitamin|supplement|immune)\b/i,
  },
  {
    category: "Personal care",
    pattern:
      /\b(shampoo|conditioner|body wash|deodorant|razor|shaving|lotion|moisturiz|skincare|sunscreen|spf|petroleum|vaseline|wristlet)\b/i,
  },
  {
    category: "Baby & family",
    pattern:
      /\b(diaper|baby formula|infant|pediatric|children'?s?\s+(vitamin|medicine|fever))\b/i,
  },
  {
    category: "Health & wellness",
    pattern: /\b(wellness|health)\b/i,
  },
];

export function mapProductNameToScopeCategory(productName: string): string {
  const n = productName;
  for (const rule of SCOPE_CATEGORY_RULES) {
    if (rule.pattern.test(n)) return rule.category;
  }
  return "Personal care";
}

export function normalizeScopeCategoryLabel(category: string): string {
  return category.trim().toLowerCase();
}

export function scopeCategoriesMatch(a: string, b: string): boolean {
  return normalizeScopeCategoryLabel(a) === normalizeScopeCategoryLabel(b);
}

/** Parse category names from a KVI concentration metric display string. */
export function parseCategoriesFromMetricLabel(metricLabel: string): string[] {
  const cleaned = metricLabel.replace(/\(\+\d+\s+more\)/gi, "").trim();
  return cleaned
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
