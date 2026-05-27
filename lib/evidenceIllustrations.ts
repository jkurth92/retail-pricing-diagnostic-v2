/**
 * Illustrative commercial examples for evidence transparency.
 * Observational only — does not alter metrics, opportunity sizing, or benchmarks.
 */

import type { ArchitectureSignalResult } from "@/lib/architectureSignals";
import type { CategorySignalResult } from "@/lib/categorySignals";
import type { KviSignalResult } from "@/lib/kviSignals";
import type { SyntheticPricingRow } from "@/lib/pricingRowSynthesis";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type {
  EvidenceIllustrationMetricKey,
  EvidenceIllustrationsBundle,
  IllustrativeCommercialExample,
} from "@/types/evidence-illustrations";
import { translateExecutiveInsight } from "@/lib/insightTranslation";
import {
  applySkuIllustrationsByMetric,
  buildSkuIllustrationsByMetric,
  ensureTierSpacingSkuExamples,
} from "@/lib/skuIllustrationBuilder";
import type { ProxySignal } from "@/types/data-interpretation";
import type { UploadProductRow } from "@/types/upload-products";

const ILLUSTRATION_DISCLAIMER =
  "Representative examples from the reviewed scope — illustrative observations, not price recommendations.";

const EXPECTED_PL_NB_GAP_PCT = 18;
const COMPRESSION_PREMIUM_GAP_PCT = 12;
const COMPRESSION_ENTRY_GAP_PCT = 10;
const HEALTHY_TIER_SPACING_PCT = 18;

export type CategoryCommercialSnapshot = {
  category: string;
  revenueWeight: number;
  entryGapPct: number | null;
  premiumGapPct: number | null;
  tierSpacingPct: number | null;
  plNbGapPct: number | null;
  compressed: boolean;
  plNarrow: boolean;
};

function gapPct(low: number, high: number): number {
  if (high <= 0) return 0;
  return ((high - low) / high) * 100;
}

function roundPct(n: number): number {
  return Math.round(n);
}

export function buildCategoryCommercialSnapshots(
  rows: SyntheticPricingRow[],
): CategoryCommercialSnapshot[] {
  const byCategory = new Map<string, SyntheticPricingRow[]>();
  for (const r of rows) {
    const list = byCategory.get(r.category) ?? [];
    list.push(r);
    byCategory.set(r.category, list);
  }

  const snapshots: CategoryCommercialSnapshot[] = [];

  for (const [category, catRows] of byCategory) {
    const nb = (tier: SyntheticPricingRow["tier"]) =>
      catRows.find((r) => r.tier === tier && r.brandType === "national_brand");
    const pl = () =>
      catRows.find((r) => r.tier === "mainstream" && r.brandType === "private_label");

    const entry = nb("entry");
    const mainstream = nb("mainstream");
    const premium = nb("premium");
    const plRow = pl();

    const entryGapPct =
      entry && mainstream ? gapPct(entry.price, mainstream.price) : null;
    const premiumGapPct =
      mainstream && premium ? gapPct(mainstream.price, premium.price) : null;
    let tierSpacingPct: number | null = null;
    if (entryGapPct !== null && premiumGapPct !== null) {
      tierSpacingPct = (entryGapPct + premiumGapPct) / 2;
    }

    const plNbGapPct =
      plRow && mainstream ? gapPct(plRow.price, mainstream.price) : null;

    const compressed =
      (entryGapPct !== null &&
        premiumGapPct !== null &&
        entryGapPct < COMPRESSION_ENTRY_GAP_PCT &&
        premiumGapPct < COMPRESSION_PREMIUM_GAP_PCT) ||
      (premiumGapPct !== null && premiumGapPct < COMPRESSION_PREMIUM_GAP_PCT);

    const plNarrow =
      plNbGapPct !== null && plNbGapPct < EXPECTED_PL_NB_GAP_PCT;

    const revenueWeight = catRows.reduce((s, r) => s + r.revenueWeight, 0);

    snapshots.push({
      category,
      revenueWeight,
      entryGapPct,
      premiumGapPct,
      tierSpacingPct,
      plNbGapPct,
      compressed,
      plNarrow,
    });
  }

  return snapshots.sort((a, b) => b.revenueWeight - a.revenueWeight);
}

type CommercialPair = { pl: string; nb: string; unit?: string };

function privateLabelDescriptor(ticker: string | null | undefined): string | null {
  if (ticker === "TGT") return "up & up";
  if (ticker === "WMT") return "Great Value";
  if (ticker === "KR") return "Simple Truth";
  return null;
}

function commercialPairForCategory(
  category: string,
  retailerTicker?: string | null,
): CommercialPair {
  const plBrand = privateLabelDescriptor(retailerTicker);
  const c = category.toLowerCase();
  if (c.includes("household")) {
    return {
      pl: plBrand ? `${plBrand} detergent` : "up & up detergent",
      nb: "Tide",
      unit: "64oz",
    };
  }
  if (c.includes("beauty")) {
    return { pl: "private-label skincare", nb: "mainstream skincare tier" };
  }
  if (c.includes("pet")) {
    return { pl: "store-brand pet nutrition", nb: "national-brand leader" };
  }
  if (c.includes("grocery") || c.includes("pantry")) {
    return { pl: "opening-price pantry item", nb: "national-brand staple" };
  }
  if (c.includes("health")) {
    return { pl: "store-brand wellness item", nb: "national-brand equivalent" };
  }
  return { pl: "private-label item", nb: "national-brand equivalent" };
}

function preferSkuGranularity(
  snapshot: CategoryCommercialSnapshot,
  localizedCount: number,
): boolean {
  return localizedCount <= 2 && (snapshot.compressed || snapshot.plNarrow);
}

function categoryPremiumExample(s: CategoryCommercialSnapshot): IllustrativeCommercialExample {
  const pct = roundPct(s.premiumGapPct ?? 0);
  return {
    category: s.category,
    observation: `Premium tiers average ~${pct}% above mainstream.`,
    interpretation: s.compressed
      ? "Trade-up may be hard to read on shelf — premium tiers sit close to mainstream."
      : "Premium step-up is relatively clear versus peer categories in scope.",
    granularity: "category",
  };
}

function categoryEntryExample(s: CategoryCommercialSnapshot): IllustrativeCommercialExample {
  const pct = roundPct(s.entryGapPct ?? 0);
  return {
    category: s.category,
    observation: `Opening-price items sit ~${pct}% below mainstream.`,
    interpretation:
      pct < COMPRESSION_ENTRY_GAP_PCT
        ? "Opening-price separation is relatively shallow — entry signaling may be muted for value shoppers."
        : "Entry-to-mainstream step-up is broadly in line with peer categories.",
    granularity: "category",
  };
}

function skuTierSpacingExample(
  s: CategoryCommercialSnapshot,
  retailerTicker?: string | null,
): IllustrativeCommercialExample {
  const pct = roundPct(s.tierSpacingPct ?? 0);
  const c = s.category.toLowerCase();
  let skuLines: [string, string];
  let observation: string;

  if (c.includes("beauty") || c.includes("cosmetic")) {
    observation = "Opening vs premium foundations (national brands).";
    skuLines = [
      "Maybelline Fit Me Matte Foundation 1 fl oz = $9.99",
      "L'Oreal Infallible Fresh Wear Foundation 1 fl oz = $16.99",
    ];
  } else if (c.includes("fragrance")) {
    observation = "Opening vs premium eau de parfum (national brands).";
    skuLines = [
      "100 Bon Eau de Parfum 0.5 fl oz = $12.99",
      "Designer Eau de Parfum 1.6 fl oz = $34.99",
    ];
  } else if (c.includes("health") || c.includes("pharmacy") || c.includes("wellness")) {
    observation = "Everyday vs premium multivitamins (national brands).";
    skuLines = [
      "Nature Made Multivitamin 60 ct = $8.99",
      "Centrum Silver Multivitamin 80 ct = $16.99",
    ];
  } else if (c.includes("oral")) {
    observation = "Opening vs premium toothpaste (national brands).";
    skuLines = [
      "Arm & Hammer Complete Care Toothpaste 6 oz = $4.49",
      "Crest Pro-Health Advanced Toothpaste 4.8 oz = $7.99",
    ];
  } else {
    const pair = commercialPairForCategory(s.category, retailerTicker);
    observation = `Opening vs premium ${pair.nb} in ${s.category}.`;
    skuLines = [
      `${pair.nb} (opening tier) = $8.99`,
      `${pair.nb} (premium tier) = $24.99`,
    ];
  }

  return {
    category: s.category,
    observation,
    interpretation:
      pct < 15
        ? "Comparable items at different price tiers sit relatively close — trade-up steps may be hard to read on shelf."
        : `A ~${pct}% spread between like items suggests some tier separation, but consistency across ${s.category} still matters.`,
    granularity: "sku",
    skuLines,
  };
}

function categoryTierSpacingExample(
  s: CategoryCommercialSnapshot,
  healthy = false,
): IllustrativeCommercialExample {
  const pct = roundPct(s.tierSpacingPct ?? 0);
  return {
    category: s.category,
    observation: healthy
      ? `Tier spacing appears healthier (~${pct}%) with clearer trade-up separation.`
      : `Average tier spacing is relatively tight (~${pct}%).`,
    interpretation: healthy
      ? "Shows clearer premium differentiation than most reviewed categories — stronger trade-up separation."
      : "Tier steps are tight versus categories with clearer premium separation.",
    granularity: "category",
  };
}

function skuPlNbExample(
  s: CategoryCommercialSnapshot,
  retailerTicker?: string | null,
): IllustrativeCommercialExample {
  const pair = commercialPairForCategory(s.category, retailerTicker);
  const pct = roundPct(s.plNbGapPct ?? 0);
  const unit = pair.unit ? ` ${pair.unit}` : "";
  const plLabel = retailerTicker === "CVS" ? "CVS Health" : "Walgreens";
  const nbPrice = 6.79;
  const plPrice = Number((nbPrice * (1 - pct / 100)).toFixed(2));
  return {
    category: s.category,
    observation: "Representative private-brand vs national-brand comparison in scope.",
    interpretation:
      pct < 12
        ? `The ${plLabel} private-brand item sits only ~${pct}% below the national brand equivalent. This may not create a strong enough value signal to encourage private-brand switching.`
        : "Limited private-brand separation reduces flexibility to monetize tier differences.",
    granularity: "sku",
    skuLines: [
      `${pair.nb}${unit} = $${nbPrice.toFixed(2)}`,
      `${pair.pl}${unit} = $${plPrice.toFixed(2)}`,
    ],
  };
}

function skuPremiumExample(
  s: CategoryCommercialSnapshot,
  retailerTicker?: string | null,
): IllustrativeCommercialExample {
  const pair = commercialPairForCategory(s.category, retailerTicker);
  const pct = roundPct(s.premiumGapPct ?? 0);
  return {
    category: s.category,
    observation: `${pair.nb} and adjacent premium items show only ~${pct}% step-up over mainstream.`,
    interpretation:
      "Premium shelf logic looks compressed — limited visible trade-up versus mainstream.",
    granularity: "sku",
  };
}

function kviCategoryExample(
  category: string,
  sharePct: number,
): IllustrativeCommercialExample {
  return {
    category,
    observation: `Trip-driving value represents ~${sharePct}% of reviewed category mix.`,
    interpretation:
      sharePct >= 20
        ? "This category anchors how shoppers read value — margin recovery is highly visible here."
        : "Value-oriented pricing is present but not the dominant story in this category.",
    granularity: "category",
  };
}

function pickTop<T>(
  items: T[],
  score: (item: T) => number,
  limit: number,
  filter?: (item: T) => boolean,
): T[] {
  return items
    .filter((item) => (filter ? filter(item) : true))
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

const ILLUSTRATION_MAX_PER_METRIC = 5;

function pushExamples(
  map: Partial<Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>>,
  metricId: EvidenceIllustrationMetricKey,
  examples: IllustrativeCommercialExample[],
  max = ILLUSTRATION_MAX_PER_METRIC,
): void {
  if (examples.length === 0) return;
  const existing = map[metricId] ?? [];
  map[metricId] = [...existing, ...examples].slice(0, max);
}

export type BuildEvidenceIllustrationsInput = {
  rows: SyntheticPricingRow[];
  arch: ArchitectureSignalResult;
  kvi: KviSignalResult;
  cat: CategorySignalResult;
  archetypeId?: RetailerArchetypeId;
  proxySignals?: ProxySignal[];
  retailerTicker?: string | null;
  retailerDisplayName?: string | null;
  uploadProducts?: UploadProductRow[];
};

export function buildEvidenceIllustrations(
  input: BuildEvidenceIllustrationsInput,
): EvidenceIllustrationsBundle {
  const snapshots = buildCategoryCommercialSnapshots(input.rows);
  const localizedCompression = input.arch.compressionCategories.length;
  const byMetricId: Partial<
    Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>
  > = {};

  const compressedCats = pickTop(
    snapshots,
    (s) => s.revenueWeight * (COMPRESSION_PREMIUM_GAP_PCT - (s.premiumGapPct ?? 99)),
    3,
    (s) => s.compressed && s.premiumGapPct !== null,
  );

  const ticker = input.retailerTicker;
  const premiumExamples = compressedCats.map((s) =>
    preferSkuGranularity(s, localizedCompression)
      ? skuPremiumExample(s, ticker)
      : categoryPremiumExample(s),
  );
  pushExamples(byMetricId, "premium_mainstream_gap", premiumExamples);

  const archCategoryExamples = compressedCats.map((s) => ({
    category: s.category,
    observation: `Good-better-best spacing in ${s.category} appears tight in reviewed data.`,
    interpretation:
      "When tier steps compress in a category, shoppers may not see a clear reason to trade up — architecture signal is category-wide, not item-specific.",
    granularity: "category" as const,
  }));
  pushExamples(byMetricId, "architecture_compression", archCategoryExamples);

  const entryCats = pickTop(
    snapshots,
    (s) =>
      s.revenueWeight *
      (COMPRESSION_ENTRY_GAP_PCT - (s.entryGapPct ?? 99)),
    3,
    (s) => s.entryGapPct !== null && s.entryGapPct < COMPRESSION_ENTRY_GAP_PCT + 4,
  );
  pushExamples(
    byMetricId,
    "entry_mainstream_gap",
    entryCats.map((s) =>
      preferSkuGranularity(s, entryCats.length)
        ? {
            ...categoryEntryExample(s),
            observation: `Opening-price ${commercialPairForCategory(s.category, ticker).nb.toLowerCase()} sit only ~${roundPct(s.entryGapPct ?? 0)}% below mainstream.`,
            granularity: "sku" as const,
          }
        : categoryEntryExample(s),
    ),
  );

  const drugTickerEarly =
    input.retailerTicker === "WBA" ||
    input.retailerTicker === "CVS" ||
    /walgreens|cvs/i.test(input.retailerDisplayName ?? "");
  const preferSkuTierIllustrations =
    drugTickerEarly || (input.uploadProducts?.length ?? 0) > 0;

  const tightSpacing = pickTop(
    snapshots,
    (s) =>
      s.revenueWeight *
      (COMPRESSION_PREMIUM_GAP_PCT - (s.tierSpacingPct ?? 99)),
    2,
    (s) => s.tierSpacingPct !== null && s.tierSpacingPct < 12,
  );
  const healthySpacing = pickTop(
    snapshots,
    (s) => s.revenueWeight * ((s.tierSpacingPct ?? 0) - HEALTHY_TIER_SPACING_PCT),
    1,
    (s) => (s.tierSpacingPct ?? 0) >= HEALTHY_TIER_SPACING_PCT,
  );
  pushExamples(byMetricId, "tier_spacing", [
    ...tightSpacing.map((s) =>
      preferSkuTierIllustrations
        ? skuTierSpacingExample(s, ticker)
        : categoryTierSpacingExample(s),
    ),
    ...healthySpacing.map((s) => categoryTierSpacingExample(s, true)),
  ]);

  const plNarrow = pickTop(
    snapshots,
    (s) =>
      s.revenueWeight * (EXPECTED_PL_NB_GAP_PCT - (s.plNbGapPct ?? 99)),
    3,
    (s) => s.plNarrow && s.plNbGapPct !== null,
  );
  const plExamples = plNarrow.map((s) =>
    preferSkuGranularity(s, plNarrow.length) ? skuPlNbExample(s, ticker) : {
      category: s.category,
      observation: `Private-brand gap is ~${roundPct(s.plNbGapPct ?? 0)}% at mainstream.`,
      interpretation:
        "Separation versus national brand appears limited in this category.",
      granularity: "category" as const,
    },
  );
  pushExamples(byMetricId, "pl_nb_gap", plExamples);

  const kviTop = input.kvi.kviConcentrationByCategory
    .filter((c) => c.sharePct >= 12)
    .slice(0, 3);
  pushExamples(
    byMetricId,
    "kvi_revenue_share",
    kviTop.map((c) => kviCategoryExample(c.category, c.sharePct)),
  );
  pushExamples(
    byMetricId,
    "kvi_category_concentration",
    kviTop.map((c) => kviCategoryExample(c.category, c.sharePct)),
  );

  const topRev = input.cat.topCategoryShares.slice(0, 2);
  pushExamples(
    byMetricId,
    "category_revenue_concentration",
    topRev.map((c) => ({
      category: c.category,
      observation: `${c.category} represents ~${c.sharePct}% of reviewed in-scope mix.`,
      interpretation:
        "Structural patterns in this category disproportionately shape the portfolio pricing read.",
      granularity: "category" as const,
    })),
  );

  const hasZoneProxy = input.proxySignals?.some((p) => p.kind === "inferred_zone");
  if (hasZoneProxy) {
    const zoneCats = compressedCats.length > 0 ? compressedCats : snapshots.slice(0, 2);
    pushExamples(
      byMetricId,
      "zoning_dispersion",
      zoneCats.map((s) => ({
        category: s.category,
        observation: `Price levels in ${s.category} show limited separation across inferred zones in reviewed data.`,
        interpretation:
          "Zoning dispersion appears modest — geographic price differentiation may be under-leveraged.",
        granularity: "category" as const,
      })),
    );
  }

  enrichTierSpacingContrast(byMetricId, snapshots);

  const drugTicker =
    input.retailerTicker === "WBA" ||
    input.retailerTicker === "CVS" ||
    /walgreens|cvs/i.test(input.retailerDisplayName ?? "");

  if (
    (input.uploadProducts?.length ?? 0) > 0 ||
    drugTicker
  ) {
    const kviFocusCategories = input.kvi.kviConcentrationByCategory
      .filter((c) => c.sharePct >= 12)
      .slice(0, 2)
      .map((c) => c.category);

    const skuByMetric = buildSkuIllustrationsByMetric({
      uploadProducts: input.uploadProducts ?? [],
      retailerDisplayName: input.retailerDisplayName ?? "The retailer",
      retailerTicker: input.retailerTicker,
      kviFocusCategories,
    });
    applySkuIllustrationsByMetric(byMetricId, skuByMetric);
    ensureTierSpacingSkuExamples(
      byMetricId,
      skuByMetric.tier_spacing ?? [],
    );
  }

  polishIllustrationCopy(byMetricId);

  return { byMetricId, disclaimer: ILLUSTRATION_DISCLAIMER };
}

function polishIllustrationCopy(
  byMetricId: Partial<
    Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>
  >,
): void {
  for (const examples of Object.values(byMetricId)) {
    if (!examples) continue;
    for (const ex of examples) {
      ex.observation = translateExecutiveInsight(ex.observation);
      ex.interpretation = translateExecutiveInsight(ex.interpretation);
    }
  }
}

function enrichTierSpacingContrast(
  byMetricId: Partial<
    Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>
  >,
  snapshots: CategoryCommercialSnapshot[],
): void {
  const tierExamples = byMetricId.tier_spacing;
  if (!tierExamples?.length) return;

  const healthy = snapshots.find(
    (s) => (s.tierSpacingPct ?? 0) >= HEALTHY_TIER_SPACING_PCT,
  );
  const tight = snapshots.find((s) => (s.tierSpacingPct ?? 0) < 12);
  if (!healthy || !tight || healthy.category === tight.category) return;

  const tightExample = tierExamples.find((e) => e.category === tight.category);
  if (tightExample) {
    tightExample.interpretation = `${healthy.category} shows clearer premium differentiation than ${tight.category}, allowing stronger trade-up separation.`;
  }
}

function examplesForMetricId(
  bundle: EvidenceIllustrationsBundle,
  metricId: EvidenceIllustrationMetricKey,
): IllustrativeCommercialExample[] {
  return bundle.byMetricId[metricId]?.slice(0, ILLUSTRATION_MAX_PER_METRIC) ?? [];
}

export function illustrationsForMetric(
  bundle: EvidenceIllustrationsBundle | undefined,
  metricId: string,
): IllustrativeCommercialExample[] {
  if (!bundle) return [];

  if (metricId.startsWith("cat-pl-")) {
    const category = metricId.replace("cat-pl-", "");
    return examplesForMetricId(bundle, "pl_nb_gap").filter(
      (e) => e.category === category,
    );
  }

  if (metricId.startsWith("cat-arch-")) {
    const category = metricId.replace("cat-arch-", "");
    const tier = examplesForMetricId(bundle, "tier_spacing").filter(
      (e) => e.category === category,
    );
    if (tier.length > 0) return tier;
    return examplesForMetricId(bundle, "premium_mainstream_gap").filter(
      (e) => e.category === category,
    );
  }

  if (metricId === "cat-weight") {
    return examplesForMetricId(bundle, "category_revenue_concentration");
  }

  const direct = bundle.byMetricId[metricId as EvidenceIllustrationMetricKey];
  return direct?.slice(0, ILLUSTRATION_MAX_PER_METRIC) ?? [];
}
