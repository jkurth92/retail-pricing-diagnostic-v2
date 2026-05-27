import type { CategoryRoleId } from "@/types/role-inference";

export type ProductCategorySignal = {
  pattern: RegExp;
  category: string;
  roleId: CategoryRoleId;
};

/** Keyword signals in product titles/descriptions → commercial category. */
export const PRODUCT_CATEGORY_SIGNALS: ProductCategorySignal[] = [
  {
    pattern:
      /\b(fragrance|parfum|cologne|eau de toilette|eau de parfum|perfume)\b/i,
    category: "Fragrance",
    roleId: "premiumization",
  },
  {
    pattern:
      /\b(cosmetic|makeup|mascara|lipstick|foundation|concealer|blush|eyeliner|lip gloss|bb cream)\b/i,
    category: "Cosmetics",
    roleId: "premiumization",
  },
  {
    pattern:
      /\b(shampoo|conditioner|body wash|deodorant|razor|shaving|lotion|moisturiz|skincare|sunscreen|spf)\b/i,
    category: "Personal care",
    roleId: "basket_builder",
  },
  {
    pattern:
      /\b(vitamin|supplement|probiotic|immune|multivitamin|mineral|herbal|wellness)\b/i,
    category: "Health & wellness",
    roleId: "destination",
  },
  {
    pattern:
      /\b(pharmacy|prescription|otc|tablet|capsule|medicine|drug|antacid|pain relief|ibuprofen|acetaminophen)\b/i,
    category: "Pharmacy / OTC",
    roleId: "traffic_driver",
  },
  {
    pattern:
      /\b(mouthwash|toothpaste|dental|fluoride|toothbrush|floss|whitening)\b/i,
    category: "Oral care",
    roleId: "basket_builder",
  },
  {
    pattern:
      /\b(diaper|baby formula|infant|pediatric|children'?s?\s+(vitamin|medicine|fever))\b/i,
    category: "Baby & family",
    roleId: "basket_builder",
  },
  {
    pattern:
      /\b(contact lens|eye drop|vision|reading glasses)\b/i,
    category: "Vision care",
    roleId: "profit_driver",
  },
  {
    pattern: /\b(snack|chips|candy|chocolate|gum|impulse)\b/i,
    category: "Snacks & impulse",
    roleId: "convenience_urgency",
  },
  {
    pattern: /\b(beverage|soda|water|juice|coffee|tea|energy drink)\b/i,
    category: "Beverages",
    roleId: "convenience_urgency",
  },
  {
    pattern: /\b(household|cleaner|detergent|paper towel|tissue)\b/i,
    category: "Household essentials",
    roleId: "basket_builder",
  },
  {
    pattern: /\b(electronic|charger|headphone|battery)\b/i,
    category: "Electronics",
    roleId: "profit_driver",
  },
];

const MIN_MATCHES = 2;
const MAX_CATEGORIES = 8;

export function inferCategoriesFromProductSample(
  productNames: string[],
): { category: string; roleId: CategoryRoleId; score: number }[] {
  if (productNames.length === 0) return [];

  const scores = new Map<
    string,
    { category: string; roleId: CategoryRoleId; score: number }
  >();

  for (const raw of productNames) {
    const text = raw.trim();
    if (!text) continue;
    for (const signal of PRODUCT_CATEGORY_SIGNALS) {
      if (!signal.pattern.test(text)) continue;
      const existing = scores.get(signal.category);
      if (existing) {
        existing.score += 1;
      } else {
        scores.set(signal.category, {
          category: signal.category,
          roleId: signal.roleId,
          score: 1,
        });
      }
    }
  }

  return [...scores.values()]
    .filter((entry) => entry.score >= MIN_MATCHES)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CATEGORIES);
}
