import type { InferredCategoryRow } from "@/types/category-scope";
import type { PricingPosture } from "@/types/retailer-archetypes";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type PricingTier = "entry" | "mainstream" | "premium";
export type BrandType = "national_brand" | "private_label";

export type SyntheticPricingRow = {
  category: string;
  tier: PricingTier;
  brandType: BrandType;
  price: number;
  packSize: number;
  unitPrice: number;
  revenueWeight: number;
  isKvi: boolean;
};

function seedHash(parts: string[]): number {
  const s = parts.join("|");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function unit(seed: number, min: number, max: number): number {
  const u = (seed % 1000) / 1000;
  return min + u * (max - min);
}

/** Categories that tend to show tighter tier spacing for mass/value retailers */
const COMPRESSED_CATEGORY_HINTS = [
  "beauty",
  "household",
  "grocery",
  "health",
  "pantry",
];

function isCompressedCategory(category: string): boolean {
  const c = category.toLowerCase();
  return COMPRESSED_CATEGORY_HINTS.some((h) => c.includes(h));
}

export type PricingRowSynthesisInput = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  categoryRows: InferredCategoryRow[];
  retailerTicker?: string | null;
};

/**
 * Deterministic synthetic price rows from scope categories and retailer context.
 * Used until real CSV parsing is aligned — structure is explainable and repeatable.
 */
export function synthesizePricingRows(
  input: PricingRowSynthesisInput,
): SyntheticPricingRow[] {
  const rows: SyntheticPricingRow[] = [];
  const valuePosture =
    input.pricingPosture === "EDLP" ||
    input.pricingPosture === "Value" ||
    input.pricingPosture === "HiLo";

  for (const cat of input.categoryRows) {
    const compressed =
      (input.archetypeId === "mass" || input.archetypeId === "discount") &&
      valuePosture &&
      isCompressedCategory(cat.category);

    const baseSeed = seedHash([
      input.archetypeId,
      input.pricingPosture,
      cat.category,
      cat.roleId,
      input.retailerTicker ?? "",
    ]);

    const mainstreamBase = unit(baseSeed, 8, 42);
    const entryGapPct = compressed ? unit(baseSeed + 1, 4, 9) : unit(baseSeed + 1, 10, 18);
    const premiumGapPct = compressed
      ? unit(baseSeed + 2, 5, 11)
      : unit(baseSeed + 2, 14, 28);

    const entryPrice = mainstreamBase * (1 - entryGapPct / 100);
    const premiumPrice = mainstreamBase * (1 + premiumGapPct / 100);

    const plDiscountPct = compressed
      ? unit(baseSeed + 3, 8, 14)
      : unit(baseSeed + 3, 16, 28);

    const packBase = Math.round(unit(baseSeed + 4, 1, 4));
    const packInconsistent = unit(baseSeed + 5, 0, 1) > 0.72;

    const kviLikelihood =
      cat.roleId === "traffic_driver" || cat.roleId === "basket_builder"
        ? 0.55
        : cat.roleId === "premiumization"
          ? 0.2
          : 0.35;

    const tiers: PricingTier[] = ["entry", "mainstream", "premium"];
    const tierPrices = [entryPrice, mainstreamBase, premiumPrice];

    for (let t = 0; t < tiers.length; t++) {
      for (const brandType of ["national_brand", "private_label"] as const) {
        const brandSeed = seedHash([cat.category, tiers[t], brandType]);
        let price = tierPrices[t];
        if (brandType === "private_label") {
          price = price * (1 - plDiscountPct / 100);
        }
        const packSize =
          packInconsistent && tiers[t] === "premium"
            ? packBase + 1
            : packBase;
        const isKvi =
          tiers[t] === "entry" &&
          brandType === "national_brand" &&
          unit(brandSeed, 0, 1) < kviLikelihood;

        const revenueWeight =
          tiers[t] === "mainstream"
            ? unit(brandSeed + 10, 0.12, 0.22)
            : tiers[t] === "entry"
              ? unit(brandSeed + 11, 0.08, 0.18)
              : unit(brandSeed + 12, 0.05, 0.14);

        rows.push({
          category: cat.category,
          tier: tiers[t],
          brandType,
          price: Math.round(price * 100) / 100,
          packSize,
          unitPrice: Math.round((price / packSize) * 100) / 100,
          revenueWeight,
          isKvi,
        });
      }
    }
  }

  return rows;
}
