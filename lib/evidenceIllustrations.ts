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
import type { ProxySignal } from "@/types/data-interpretation";

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
      ? "Trade-up separation appears compressed relative to typical mass / hybrid architecture."
      : "Premium step-up is within a typical spacing band for this category.",
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
        ? "Entry-to-mainstream step-up appears shallow in this category."
        : "Entry spacing is broadly in line with peer categories.",
    granularity: "category",
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
      ? "Provides a contrast category where ladder spacing is more legible."
      : "Overall tier steps are compressed versus categories with clearer premium separation.",
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
  return {
    category: s.category,
    observation: `${pair.pl}${unit} priced only ~${pct}% below ${pair.nb} equivalent.`,
    interpretation:
      "Private-brand separation appears narrow relative to expected mass retail spacing.",
    granularity: "sku",
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
      "Premium architecture looks compressed — limited visible trade-up in shelf logic.",
    granularity: "sku",
  };
}

function kviCategoryExample(
  category: string,
  sharePct: number,
): IllustrativeCommercialExample {
  return {
    category,
    observation: `Visible value items represent ~${sharePct}% of inferred category revenue weight.`,
    interpretation:
      sharePct >= 20
        ? "Trip-driving value concentration is meaningful in this category."
        : "Value concentration is present but not dominant in this category.",
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

function pushExamples(
  map: Partial<Record<EvidenceIllustrationMetricKey, IllustrativeCommercialExample[]>>,
  metricId: EvidenceIllustrationMetricKey,
  examples: IllustrativeCommercialExample[],
  max = 3,
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
  pushExamples(byMetricId, "architecture_compression", premiumExamples);

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
    ...tightSpacing.map((s) => categoryTierSpacingExample(s)),
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
  pushExamples(byMetricId, "pl_nb_categories_narrow", plExamples);

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
      observation: `${c.category} represents ~${c.sharePct}% of inferred in-scope revenue weight.`,
      interpretation:
        "Largest commercial weight sits in this category — patterns here influence portfolio read-through.",
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

  return { byMetricId, disclaimer: ILLUSTRATION_DISCLAIMER };
}

export function illustrationsForMetric(
  bundle: EvidenceIllustrationsBundle | undefined,
  metricId: string,
): IllustrativeCommercialExample[] {
  if (!bundle) return [];
  const direct = bundle.byMetricId[metricId as EvidenceIllustrationMetricKey];
  const zoning = bundle.byMetricId.zoning_dispersion ?? [];
  if (direct?.length) {
    const merged =
      metricId === "tier_spacing" && zoning.length > 0
        ? [...direct, ...zoning]
        : direct;
    return merged.slice(0, 3);
  }
  if (metricId === "architecture_compression") {
    return bundle.byMetricId.premium_mainstream_gap?.slice(0, 3) ?? [];
  }
  if (metricId.startsWith("cat-arch-")) {
    const category = metricId.replace("cat-arch-", "");
    const arch = bundle.byMetricId.architecture_compression ?? [];
    const premium = bundle.byMetricId.premium_mainstream_gap ?? [];
    return [...arch, ...premium]
      .filter((e) => e.category === category)
      .slice(0, 2);
  }
  if (metricId.startsWith("cat-pl-")) {
    const category = metricId.replace("cat-pl-", "");
    return (bundle.byMetricId.pl_nb_gap ?? []).filter((e) => e.category === category).slice(0, 2);
  }
  if (metricId === "cat-weight") {
    return (bundle.byMetricId.category_revenue_concentration ?? []).slice(0, 2);
  }
  if (metricId.startsWith("cat-")) {
    return [];
  }
  return [];
}
