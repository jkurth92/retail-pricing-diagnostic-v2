/**
 * SKU-level illustrative examples for evidence tiles.
 * Observational only — does not alter metrics, benchmarks, or opportunity sizing.
 */

import {
  areLikeItems,
  findBestLikeItemPricePair,
  productFormKey,
} from "@/lib/productLikeItemMatching";
import {
  mapProductNameToScopeCategory,
  normalizeScopeCategoryLabel,
  scopeCategoriesMatch,
} from "@/lib/scopeProductCategories";
import type { EvidenceIllustrationMetricKey } from "@/types/evidence-illustrations";
import type { IllustrativeCommercialExample } from "@/types/evidence-illustrations";
import type { UploadProductRow } from "@/types/upload-products";

const MIN_EXAMPLES = 2;
const MAX_EXAMPLES = 4;

const STOP_TOKENS = new Set([
  "with",
  "and",
  "the",
  "for",
  "from",
  "size",
  "count",
  "pack",
  "ounce",
  "fluid",
  "daily",
  "extra",
  "free",
  "new",
  "plus",
]);

export type SkuProductPair = {
  nationalBrand: UploadProductRow;
  privateLabel: UploadProductRow;
  gapPct: number;
  categoryHint: string;
};

type ExampleTheme = "pl_nb" | "tier" | "promo" | "category" | "entry";

function exampleKey(ex: IllustrativeCommercialExample): string {
  return `${ex.category}|${ex.skuLines?.join("||") ?? ex.observation}`;
}

class ExampleAllocator {
  private used = new Set<string>();

  take(
    examples: IllustrativeCommercialExample[],
    limit = MAX_EXAMPLES,
    theme?: ExampleTheme,
  ): IllustrativeCommercialExample[] {
    const out: IllustrativeCommercialExample[] = [];
    for (const ex of examples) {
      if (out.length >= limit) return out;
      const key = exampleKey(ex);
      if (this.used.has(key)) continue;
      if (theme === "pl_nb" && !isPlNbExample(ex)) continue;
      if (theme === "tier" && isPlNbExample(ex)) continue;
      if (theme === "promo" && isPlNbExample(ex)) continue;
      this.used.add(key);
      out.push(ex);
    }
    return out.length >= MIN_EXAMPLES ? out : out;
  }

  takeMinimum(
    primary: IllustrativeCommercialExample[],
    fallback: IllustrativeCommercialExample[],
    limit = MAX_EXAMPLES,
    theme?: ExampleTheme,
  ): IllustrativeCommercialExample[] {
    const first = this.take(primary, limit, theme);
    if (first.length >= MIN_EXAMPLES) return first;
    return this.take([...first, ...fallback], limit, theme);
  }
}

function isPlNbExample(ex: IllustrativeCommercialExample): boolean {
  if (ex.skuLines?.length !== 2) return false;
  const text = ex.skuLines.join(" ").toLowerCase();
  const hasStoreBrand =
    /\bwalgreens\b|\bequate\b|\bcvs health\b|\bnice!\b/.test(text) ||
    /store.?brand|private.?brand/.test(ex.observation.toLowerCase());
  return hasStoreBrand;
}

function shortProductLabel(name: string, max = 72): string {
  const trimmed = name.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 3)}...`;
}

function formatPriceLine(name: string, price: number): string {
  return `${shortProductLabel(name)} = $${price.toFixed(2)}`;
}

function gapPct(high: number, low: number): number {
  if (high <= 0) return 0;
  return ((high - low) / high) * 100;
}

function isPrivateLabelName(name: string, retailerName: string): boolean {
  const n = name.toLowerCase();
  if (/\bwalgreens\b/.test(n)) return true;
  if (/\bequate\b/.test(n)) return true;
  if (/\bnice!\b/.test(n)) return true;
  if (/\bcvs health\b/.test(n)) return true;
  if (retailerName.toLowerCase().includes("cvs") && /\bcvs\b/.test(n)) return true;
  return false;
}

function productTokens(name: string): Set<string> {
  const tokens = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !STOP_TOKENS.has(t));
  return new Set(tokens);
}

function tokenOverlapScore(a: string, b: string): number {
  const ta = productTokens(a);
  const tb = productTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) {
    if (tb.has(t)) overlap += 1;
  }
  return overlap / Math.max(ta.size, tb.size);
}

function categoryHintFromName(name: string): string {
  return mapProductNameToScopeCategory(name);
}

export function buildSkuPairsFromUpload(
  products: UploadProductRow[],
  retailerDisplayName: string,
): SkuProductPair[] {
  const withPrice = products.filter((p) => p.regularPrice != null && p.regularPrice > 0);
  const plRows = withPrice.filter((p) => isPrivateLabelName(p.productName, retailerDisplayName));
  const nbRows = withPrice.filter((p) => !isPrivateLabelName(p.productName, retailerDisplayName));

  const pairs: SkuProductPair[] = [];
  const usedNb = new Set<string>();

  for (const pl of plRows) {
    let best: UploadProductRow | null = null;
    let bestScore = 0.28;
    for (const nb of nbRows) {
      if (usedNb.has(nb.productName)) continue;
      const score = tokenOverlapScore(pl.productName, nb.productName);
      if (score > bestScore) {
        bestScore = score;
        best = nb;
      }
    }
    if (!best || pl.regularPrice == null || best.regularPrice == null) continue;
    const g = gapPct(best.regularPrice, pl.regularPrice);
    if (g < 0 || g > 45) continue;
    usedNb.add(best.productName);
    pairs.push({
      nationalBrand: best,
      privateLabel: pl,
      gapPct: g,
      categoryHint: categoryHintFromName(`${pl.productName} ${best.productName}`),
    });
  }

  return pairs.sort((a, b) => a.gapPct - b.gapPct);
}

function interpretPlNbPair(pair: SkuProductPair): string {
  const g = Math.round(pair.gapPct);
  if (g < 12) {
    return `The store-brand item sits only ~${g}% below the national-brand equivalent. This may not create a strong enough value signal to encourage private-brand switching.`;
  }
  if (g < 18) {
    return `The price gap appears relatively narrow given the positioning difference — shoppers may not perceive enough separation to trade down.`;
  }
  return `Store-brand separation is more visible (~${g}%), but still worth validating against category role in ${pair.categoryHint}.`;
}

function interpretPromoSku(row: UploadProductRow): string {
  if (row.regularPrice == null || row.promoPrice == null) {
    return "Promotional depth is visible on this item — worth checking whether the discount is concentrated on trip drivers or margin categories.";
  }
  const depth = gapPct(row.regularPrice, row.promoPrice);
  if (depth >= 25) {
    return `A ~${Math.round(depth)}% visible discount on this item suggests promotional depth may be shaping how shoppers read value in the category.`;
  }
  return `Moderate promotional depth (~${Math.round(depth)}%) — the item may support traffic signaling without extreme margin erosion.`;
}

function skuExampleFromPair(pair: SkuProductPair): IllustrativeCommercialExample {
  return {
    category: pair.categoryHint,
    observation: "National brand vs store-brand shelf prices in uploaded data.",
    interpretation: interpretPlNbPair(pair),
    granularity: "sku",
    skuLines: [
      formatPriceLine(pair.nationalBrand.productName, pair.nationalBrand.regularPrice!),
      formatPriceLine(pair.privateLabel.productName, pair.privateLabel.regularPrice!),
    ],
  };
}

function promoExampleFromRow(row: UploadProductRow): IllustrativeCommercialExample {
  return {
    category: categoryHintFromName(row.productName),
    observation: "Regular vs promotional price on the same item.",
    interpretation: interpretPromoSku(row),
    granularity: "sku",
    skuLines: [
      formatPriceLine(row.productName, row.regularPrice!),
      `${shortProductLabel(row.productName)} (promo) = $${row.promoPrice!.toFixed(2)}`,
    ],
  };
}

function interpretTierSpread(spread: number, category: string): string {
  if (spread < 15) {
    return "Comparable items at different price tiers sit relatively close — trade-up steps may be hard to read on shelf.";
  }
  return `A ~${Math.round(spread)}% spread between like items in ${category} suggests some tier separation, but consistency across the category still matters.`;
}

function tierExampleFromPair(
  opening: UploadProductRow,
  premium: UploadProductRow,
  category: string,
): IllustrativeCommercialExample {
  const spread = gapPct(opening.regularPrice!, premium.regularPrice!);
  return {
    category,
    observation: "Opening vs premium shelf prices on comparable national-brand items (uploaded data).",
    interpretation: interpretTierSpread(spread, category),
    granularity: "sku",
    skuLines: [
      formatPriceLine(opening.productName, opening.regularPrice!),
      formatPriceLine(premium.productName, premium.regularPrice!),
    ],
  };
}

function storeBrandLabel(ticker?: string | null): string {
  return ticker === "CVS" ? "CVS Health" : "Walgreens";
}

function curatedPlNbOnly(ticker?: string | null): IllustrativeCommercialExample[] {
  const pl = storeBrandLabel(ticker);
  return [
    {
      category: "Personal care",
      observation: "Store brand vs national brand — personal care.",
      granularity: "sku",
      skuLines: [
        "Vaseline Petroleum Jelly 13oz = $4.99",
        `${pl} Petroleum Jelly 13oz = $4.49`,
      ],
      interpretation:
        `The ${pl} store-brand item sits only ~10% below the national brand equivalent. This may not create a strong enough value signal to encourage store-brand switching.`,
    },
    {
      category: "Oral care",
      observation: "Store brand vs national brand — oral care.",
      granularity: "sku",
      skuLines: [
        "Crest Pro-Health Toothpaste = $6.79",
        `${pl} Whitening Toothpaste = $5.99`,
      ],
      interpretation:
        "The opening-price gap appears relatively narrow given the positioning difference.",
    },
    {
      category: "Cosmetics",
      observation: "Store brand vs national brand — cosmetics.",
      granularity: "sku",
      skuLines: [
        "National-brand foundation 1 fl oz = $16.99",
        `${pl} complexion foundation 1 fl oz = $14.99`,
      ],
      interpretation:
        "Cosmetics gaps are often intentionally narrow to protect margin — limited trade-down incentive versus national brands.",
    },
  ];
}

function curatedTierOnly(): IllustrativeCommercialExample[] {
  return [
    {
      category: "Beauty",
      observation: "Opening vs premium foundations (national brands).",
      granularity: "sku",
      skuLines: [
        "Maybelline Fit Me Matte Foundation 1 fl oz = $9.99",
        "L'Oreal Infallible Fresh Wear Foundation 1 fl oz = $16.99",
      ],
      interpretation:
        "Comparable foundation items sit relatively close on shelf — premium trade-up may be hard to read without clearer tier signaling.",
    },
    {
      category: "Fragrance",
      observation: "Opening vs premium eau de parfum (national brands).",
      granularity: "sku",
      skuLines: [
        "100 Bon Eau de Parfum 0.5 fl oz = $12.99",
        "Designer Eau de Parfum 1.6 fl oz = $34.99",
      ],
      interpretation:
        "Like-for-like fragrance tiers show a visible step-up, but mid-tier separation may still be compressed in reviewed data.",
    },
    {
      category: "Health & wellness",
      observation: "Everyday vs premium multivitamins (national brands).",
      granularity: "sku",
      skuLines: [
        "Nature Made Multivitamin 60 ct = $8.99",
        "Centrum Silver Multivitamin 80 ct = $16.99",
      ],
      interpretation:
        "Comparable vitamin items span opening and premium price points — mid-tier steps may still be tight in reviewed data.",
    },
  ];
}

function curatedPromoForScopeCategories(
  scopeCategories: string[],
): IllustrativeCommercialExample[] {
  const want = new Set(scopeCategories.map(normalizeScopeCategoryLabel));
  const all: IllustrativeCommercialExample[] = [
    {
      category: "Pharmacy / OTC",
      observation: "Promotional depth on a pharmacy trip item.",
      granularity: "sku",
      skuLines: [
        "AZO Yeast Multi-Benefit Formula 60 ct = $17.99",
        "AZO Yeast Multi-Benefit Formula 60 ct (promo) = $12.99",
      ],
      interpretation:
        "A ~28% visible discount on this item suggests promotional depth may be shaping how shoppers read value in Pharmacy / OTC.",
    },
    {
      category: "Oral care",
      observation: "Promotional depth on a trip-adjacent oral care item.",
      granularity: "sku",
      skuLines: [
        "Crest Pro-Health Toothpaste = $6.79",
        "Crest Pro-Health Toothpaste (promo) = $5.49",
      ],
      interpretation:
        "Visible discounting in oral care can shape trip value perception for the category named in the concentration signal.",
    },
    {
      category: "Personal care",
      observation: "Moderate promotional depth on a personal care item.",
      granularity: "sku",
      skuLines: [
        "Adidas Get Comfy Fragrance Eau De Parfum 1.6 fl oz = $34.99",
        "Adidas Get Comfy Fragrance Eau De Parfum 1.6 fl oz (promo) = $27.99",
      ],
      interpretation:
        "Moderate promotional depth — supports seasonal traffic without extreme margin erosion in Personal care.",
    },
  ];
  return all.filter((ex) => want.has(normalizeScopeCategoryLabel(ex.category)));
}

function curatedPromoOnly(): IllustrativeCommercialExample[] {
  return curatedPromoForScopeCategories(["Oral care", "Personal care"]);
}

function curatedCategoryAnchors(ticker?: string | null): IllustrativeCommercialExample[] {
  const pl = storeBrandLabel(ticker);
  return [
    {
      category: "Health & wellness",
      observation: "Representative items shaping in-scope commercial weight.",
      granularity: "sku",
      skuLines: [
        "Nature Made Multivitamin 60 ct = $8.99",
        `${pl} daily multivitamin 60 ct = $7.49`,
      ],
      interpretation:
        "Health & wellness carries both traffic-sensitive and margin-sensitive items — pricing architecture here disproportionately shapes the portfolio read.",
    },
    {
      category: "Fragrance",
      observation: "Discretionary assortment with wide price dispersion.",
      granularity: "sku",
      skuLines: [
        "100 Bon Eau de Parfum 0.5 fl oz = $12.99",
        "Adidas Get Comfy Eau de Parfum 1.6 fl oz = $34.99",
      ],
      interpretation:
        "Fragrance spans opening and premium price points — concentration in this category affects how shoppers read overall price image.",
    },
  ];
}

function buildPlNbExamplesFromUpload(
  products: UploadProductRow[],
  retailerDisplayName: string,
): IllustrativeCommercialExample[] {
  const pairs = buildSkuPairsFromUpload(products, retailerDisplayName);
  const narrow = pairs.filter((p) => p.gapPct < 20);
  const source = narrow.length >= MIN_EXAMPLES ? narrow : pairs;
  return source.map((p) => skuExampleFromPair(p));
}

function buildTierExamplesFromUpload(
  products: UploadProductRow[],
  retailerDisplayName: string,
): IllustrativeCommercialExample[] {
  const nbOnly = products.filter(
    (p) =>
      p.regularPrice != null &&
      p.regularPrice > 0 &&
      !isPrivateLabelName(p.productName, retailerDisplayName),
  );

  const byBucket = new Map<string, UploadProductRow[]>();
  for (const row of nbOnly) {
    const cat = categoryHintFromName(row.productName);
    const form = productFormKey(row.productName) ?? "_general";
    const key = `${cat}|${form}`;
    const list = byBucket.get(key) ?? [];
    list.push(row);
    byBucket.set(key, list);
  }

  const examples: IllustrativeCommercialExample[] = [];
  const usedKeys = new Set<string>();

  for (const [bucketKey, rows] of byBucket) {
    const category = bucketKey.split("|")[0] ?? "Personal care";
    const pair = findBestLikeItemPricePair(
      rows.map((r) => ({ name: r.productName, price: r.regularPrice! })),
      5,
    );
    if (!pair) continue;

    const openingRow =
      rows.find((r) => r.productName === pair.lower.name) ?? rows[0];
    const premiumRow =
      rows.find((r) => r.productName === pair.higher.name) ?? rows[1];
    if (!areLikeItems(openingRow.productName, premiumRow.productName)) continue;

    const exKey = `${openingRow.productName}|${premiumRow.productName}`;
    if (usedKeys.has(exKey)) continue;
    usedKeys.add(exKey);

    examples.push(tierExampleFromPair(openingRow, premiumRow, category));
  }

  if (examples.length < MIN_EXAMPLES) {
    const byCategory = new Map<string, UploadProductRow[]>();
    for (const row of nbOnly) {
      const cat = categoryHintFromName(row.productName);
      const list = byCategory.get(cat) ?? [];
      list.push(row);
      byCategory.set(cat, list);
    }
    for (const [category, rows] of byCategory) {
      if (examples.some((e) => e.category === category)) continue;
      const pair = findBestLikeItemPricePair(
        rows.map((r) => ({ name: r.productName, price: r.regularPrice! })),
        5,
      );
      if (!pair) continue;
      const openingRow = rows.find((r) => r.productName === pair.lower.name)!;
      const premiumRow = rows.find((r) => r.productName === pair.higher.name)!;
      const exKey = `${openingRow.productName}|${premiumRow.productName}`;
      if (usedKeys.has(exKey)) continue;
      usedKeys.add(exKey);
      examples.push(tierExampleFromPair(openingRow, premiumRow, category));
    }
  }

  return examples;
}

function buildPromoExamplesFromUpload(
  products: UploadProductRow[],
  scopeCategories?: string[],
): IllustrativeCommercialExample[] {
  const allowed =
    scopeCategories && scopeCategories.length > 0
      ? new Set(scopeCategories.map(normalizeScopeCategoryLabel))
      : null;

  return products
    .filter(
      (p) =>
        p.promoPrice != null &&
        p.regularPrice != null &&
        p.promoPrice < p.regularPrice,
    )
    .filter((p) => {
      if (!allowed) return true;
      return allowed.has(
        normalizeScopeCategoryLabel(mapProductNameToScopeCategory(p.productName)),
      );
    })
    .sort(
      (a, b) =>
        gapPct(a.regularPrice!, a.promoPrice!) - gapPct(b.regularPrice!, b.promoPrice!),
    )
    .reverse()
    .slice(0, MAX_EXAMPLES + 2)
    .map((r) => promoExampleFromRow(r));
}

export function filterIllustrationsToScopeCategories(
  examples: IllustrativeCommercialExample[],
  scopeCategories: string[],
): IllustrativeCommercialExample[] {
  if (scopeCategories.length === 0) return examples;
  const filtered = examples.filter((ex) =>
    scopeCategories.some((c) => scopeCategoriesMatch(ex.category, c)),
  );
  return filtered.length >= MIN_EXAMPLES ? filtered : examples;
}

export type SkuIllustrationInput = {
  uploadProducts: UploadProductRow[];
  retailerDisplayName: string;
  retailerTicker?: string | null;
  /** Top categories where KVI / promo concentration shows up (from scope + signals). */
  kviFocusCategories?: string[];
};

export function buildSkuIllustrationsByMetric(
  input: SkuIllustrationInput,
): Partial<Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>> {
  const allocator = new ExampleAllocator();
  const ticker = input.retailerTicker;
  const products = input.uploadProducts;

  const plFromUpload = buildPlNbExamplesFromUpload(products, input.retailerDisplayName);
  const tierFromUpload = buildTierExamplesFromUpload(products, input.retailerDisplayName);
  const kviCats = input.kviFocusCategories?.slice(0, 2) ?? [];
  const promoFromUpload = buildPromoExamplesFromUpload(products, kviCats);
  const promoFromUploadBroad = buildPromoExamplesFromUpload(products);

  const plCurated = curatedPlNbOnly(ticker);
  const tierCurated = curatedTierOnly();
  const promoCurated = curatedPromoOnly();
  const categoryCurated = curatedCategoryAnchors(ticker);

  const byMetric: Partial<
    Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>
  > = {};

  byMetric.pl_nb_gap = allocator.takeMinimum(plFromUpload, plCurated, MAX_EXAMPLES, "pl_nb");
  byMetric.pl_nb_categories_narrow = allocator.takeMinimum(
    plFromUpload.slice(1),
    plCurated.slice(1),
    MAX_EXAMPLES,
    "pl_nb",
  );

  // tier_spacing is shown on the executive summary — allocate tier SKU examples here first
  byMetric.tier_spacing = allocator.takeMinimum(
    tierFromUpload.length > 0 ? tierFromUpload.slice().reverse() : tierCurated,
    tierCurated,
    MAX_EXAMPLES,
    "tier",
  );

  byMetric.premium_mainstream_gap = allocator.takeMinimum(
    tierFromUpload,
    tierCurated,
    MAX_EXAMPLES,
    "tier",
  );

  byMetric.entry_mainstream_gap = allocator.takeMinimum(
    tierFromUpload.filter((e) => /opening|budget|everyday/i.test(e.interpretation)),
    tierCurated.slice(0, 1),
    MAX_EXAMPLES,
    "tier",
  );

  byMetric.architecture_compression = allocator.takeMinimum(
    tierFromUpload.slice(0, 2),
    [tierCurated[0]],
    2,
    "tier",
  );

  byMetric.kvi_revenue_share = allocator.takeMinimum(
    promoFromUploadBroad,
    curatedPromoOnly(),
    MAX_EXAMPLES,
    "promo",
  );

  byMetric.kvi_category_concentration = allocator.takeMinimum(
    promoFromUpload,
    curatedPromoForScopeCategories(kviCats),
    MAX_EXAMPLES,
    "promo",
  );

  byMetric.category_revenue_concentration = allocator.takeMinimum(
    categoryCurated,
    tierFromUpload.slice(0, 2),
    MAX_EXAMPLES,
    "category",
  );

  return byMetric;
}

function examplesHaveSkuLines(
  examples: IllustrativeCommercialExample[],
): boolean {
  return examples.some((e) => (e.skuLines?.length ?? 0) >= 2);
}

/** Replace metric illustrations with SKU-specific sets (no cross-metric merging). */
export function applySkuIllustrationsByMetric(
  base: Partial<Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>>,
  skuByMetric: Partial<Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>>,
): void {
  for (const [key, skuExamples] of Object.entries(skuByMetric) as [
    EvidenceIllustrationMetricKey,
    IllustrativeCommercialExample[],
  ][]) {
    if (!skuExamples?.length) continue;
    if (key === "tier_spacing" && !examplesHaveSkuLines(skuExamples)) continue;
    base[key] = skuExamples;
  }
}

/** Guarantee tier_spacing detail cards include product-level example lines. */
export function ensureTierSpacingSkuExamples(
  byMetricId: Partial<Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>>,
  skuFallback: IllustrativeCommercialExample[],
): void {
  const current = byMetricId.tier_spacing ?? [];
  if (examplesHaveSkuLines(current)) return;

  const fromSku = skuFallback.filter((e) => (e.skuLines?.length ?? 0) >= 2);
  if (fromSku.length === 0) return;

  const focusCategory = current[0]?.category;
  byMetricId.tier_spacing = fromSku.slice(0, MAX_EXAMPLES).map((ex) =>
    focusCategory ? { ...ex, category: focusCategory } : ex,
  );
}
