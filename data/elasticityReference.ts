/**
 * Curated elasticity reference from uploaded workbooks (Step 14A):
 * - Grocery_Elasticities.xlsx (L1/L2/L3 weighted elasticities by store type)
 * - Department_Store_ELasticity.xlsx (department/class/category elasticities)
 *
 * Values are directional reference medians — not SKU-level optimization inputs.
 * Source: McKinsey pricing elasticity workbooks (chat upload).
 */

import type { ElasticityReferenceChannel } from "@/types/opportunity-exposure";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";

export type ScopeCategoryElasticityProfile = {
  scopeCategory: string;
  channel: ElasticityReferenceChannel;
  /** Median |elasticity| from reference workbook */
  medianAbsElasticity: number;
  referenceLabel: string;
  l2Hint?: string;
};

/** Maps pilot scope category names → workbook channel medians */
export const SCOPE_CATEGORY_ELASTICITY: ScopeCategoryElasticityProfile[] = [
  {
    scopeCategory: "Grocery",
    channel: "grocery",
    medianAbsElasticity: 1.35,
    referenceLabel: "Grocery_Elasticities.xlsx · FOOD L1 median",
    l2Hint: "FOOD",
  },
  {
    scopeCategory: "Household essentials",
    channel: "grocery",
    medianAbsElasticity: 1.28,
    referenceLabel: "Grocery_Elasticities.xlsx · household-adjacent L2",
    l2Hint: "CORE GROCERY / HOUSEHOLD",
  },
  {
    scopeCategory: "Beauty",
    channel: "department_store",
    medianAbsElasticity: 1.18,
    referenceLabel: "Department_Store_ELasticity.xlsx · personal care adj.",
  },
  {
    scopeCategory: "Apparel",
    channel: "department_store",
    medianAbsElasticity: 0.95,
    referenceLabel: "Department_Store_ELasticity.xlsx · missy/RTW median",
  },
  {
    scopeCategory: "Home decor",
    channel: "department_store",
    medianAbsElasticity: 0.88,
    referenceLabel: "Department_Store_ELasticity.xlsx · home/gifting median",
  },
  {
    scopeCategory: "Pet",
    channel: "grocery",
    medianAbsElasticity: 1.22,
    referenceLabel: "Grocery_Elasticities.xlsx · pet-adjacent",
  },
  {
    scopeCategory: "Electronics",
    channel: "department_store",
    medianAbsElasticity: 1.05,
    referenceLabel: "Department_Store_ELasticity.xlsx · hardlines adj.",
  },
  {
    scopeCategory: "Seasonal",
    channel: "department_store",
    medianAbsElasticity: 0.82,
    referenceLabel: "Department_Store_ELasticity.xlsx · seasonal/gifting",
  },
  {
    scopeCategory: "Health & wellness",
    channel: "grocery",
    medianAbsElasticity: 1.3,
    referenceLabel: "Grocery_Elasticities.xlsx · health adj.",
  },
  {
    scopeCategory: "Produce",
    channel: "grocery",
    medianAbsElasticity: 1.4,
    referenceLabel: "Grocery_Elasticities.xlsx · fresh/food",
  },
  {
    scopeCategory: "Dairy",
    channel: "grocery",
    medianAbsElasticity: 1.52,
    referenceLabel: "Grocery_Elasticities.xlsx · DAIRY L2",
  },
  {
    scopeCategory: "Center store",
    channel: "grocery",
    medianAbsElasticity: 1.24,
    referenceLabel: "Grocery_Elasticities.xlsx · core grocery L3",
  },
];

const DEFAULT_GROCERY: ScopeCategoryElasticityProfile = {
  scopeCategory: "default_grocery",
  channel: "grocery",
  medianAbsElasticity: 1.35,
  referenceLabel: "Grocery_Elasticities.xlsx · FOOD L1 default",
};

const DEFAULT_DEPT: ScopeCategoryElasticityProfile = {
  scopeCategory: "default_department",
  channel: "department_store",
  medianAbsElasticity: 1.0,
  referenceLabel: "Department_Store_ELasticity.xlsx · portfolio median",
};

export function resolveCategoryElasticity(
  categoryName: string,
  archetypeId: string,
): ScopeCategoryElasticityProfile {
  const key = categoryName.trim().toLowerCase();
  const exact = SCOPE_CATEGORY_ELASTICITY.find(
    (p) => p.scopeCategory.toLowerCase() === key,
  );
  if (exact) return exact;

  const partial = SCOPE_CATEGORY_ELASTICITY.find((p) =>
    key.includes(p.scopeCategory.toLowerCase().split(" ")[0]),
  );
  if (partial) return partial;

  if (archetypeId === "grocery" || archetypeId === "premium_grocery") {
    return { ...DEFAULT_GROCERY, scopeCategory: categoryName };
  }
  return { ...DEFAULT_DEPT, scopeCategory: categoryName };
}

export function absElasticityToSensitivity(
  abs: number,
): ElasticitySensitivity {
  if (abs >= 1.4) return "high";
  if (abs >= 1.05) return "moderate";
  return "low";
}

/** Width modifier on thematic margin band — contextual, not optimization */
export function elasticityWidthMultiplier(
  sensitivity: ElasticitySensitivity,
): number {
  if (sensitivity === "high") return 0.9;
  if (sensitivity === "moderate") return 0.96;
  return 1.02;
}

export function pickPortfolioElasticityChannel(
  archetypeId: string,
  ticker?: string | null,
): ElasticityReferenceChannel {
  if (ticker === "TGT" || ticker === "WMT" || ticker === "KR") return "grocery";
  if (archetypeId === "grocery" || archetypeId === "premium_grocery") {
    return "grocery";
  }
  if (archetypeId === "mass" || archetypeId === "discount") {
    return "grocery";
  }
  return "department_store";
}
