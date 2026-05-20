import type { LeverKey } from "@/types/diagnostic-output";
import type { PatternOutputType } from "@/types/pattern-features";
import type { CanonicalFieldKey } from "@/types/upload-schema";

/** Catalog seed — runtime builder adds status, value, and evidence links. */
export type PatternFeatureSeed = {
  id: string;
  leverKey: LeverKey;
  featureName: string;
  description: string;
  sourceFields: CanonicalFieldKey[];
  calculationNote: string;
  outputType: PatternOutputType;
  requiresAlignment: boolean;
  examples: string[];
};

const ALIGNMENT = true;

export const KVI_PATTERN_FEATURES: PatternFeatureSeed[] = [
  {
    id: "kvi-revenue-share",
    leverKey: "kvis",
    featureName: "KVI revenue share",
    description:
      "Share of total revenue attributed to items flagged or inferred as KVIs.",
    sourceFields: ["price", "category", "revenue", "kviFlag"],
    calculationNote:
      "Requires price, category, and revenue or units; KVI flag or proxy improves attribution.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["KVI revenue / total revenue by category"],
  },
  {
    id: "kvi-sku-share",
    leverKey: "kvis",
    featureName: "KVI SKU share",
    description: "Proportion of distinct SKUs classified as KVIs.",
    sourceFields: ["sku", "category", "kviFlag"],
    calculationNote:
      "Requires SKU, category, and KVI flag or volume proxy for classification.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Distinct KVI SKUs / distinct SKUs"],
  },
  {
    id: "kvi-concentration-category",
    leverKey: "kvis",
    featureName: "KVI concentration by category",
    description:
      "Distribution of KVI revenue or units across categories (concentration index).",
    sourceFields: ["category", "revenue", "kviFlag"],
    calculationNote:
      "Requires category, revenue or units, and KVI identification.",
    outputType: "composite",
    requiresAlignment: ALIGNMENT,
    examples: ["Top-category KVI share", "Herfindahl-style concentration"],
  },
  {
    id: "kvi-breadth-assortment",
    leverKey: "kvis",
    featureName: "KVI breadth across the assortment",
    description:
      "Count and spread of categories with at least one KVI versus total categories.",
    sourceFields: ["category", "sku", "kviFlag"],
    calculationNote:
      "Requires category, SKU, and KVI flag or revenue-ranked proxy.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Categories with KVIs / total categories"],
  },
  {
    id: "kvi-price-visibility-proxy",
    leverKey: "kvis",
    featureName: "KVI price visibility proxy",
    description:
      "Descriptive proxy for how prominently KVI prices appear in the assortment (not competitive score).",
    sourceFields: ["price", "kviFlag", "unitPrice"],
    calculationNote:
      "Requires price and KVI flag; unit price improves comparability across pack sizes.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Median KVI shelf price index within category"],
  },
];

export const ARCHITECTURE_PATTERN_FEATURES: PatternFeatureSeed[] = [
  {
    id: "arch-price-ladder-spacing",
    leverKey: "price_architecture",
    featureName: "Price ladder spacing",
    description:
      "Average and distribution of price gaps between adjacent tier positions within a category.",
    sourceFields: ["price", "category", "packSize"],
    calculationNote: "Requires price, category, and pack size or tier grouping.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Mean absolute gap between sorted price points"],
  },
  {
    id: "arch-premium-mainstream-gap",
    leverKey: "price_architecture",
    featureName: "Premium vs mainstream gap",
    description:
      "Price spread between premium-tier and mainstream-tier items in the same category.",
    sourceFields: ["price", "category", "brand"],
    calculationNote:
      "Requires price, category, and brand or tier label for segmentation.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["(Premium median − mainstream median) / mainstream median"],
  },
  {
    id: "arch-entry-mainstream-gap",
    leverKey: "price_architecture",
    featureName: "Entry vs mainstream gap",
    description:
      "Price spread between entry-tier and mainstream-tier items.",
    sourceFields: ["price", "category", "packSize"],
    calculationNote: "Requires price, category, and pack size or tier label.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Entry anchor price vs category mainstream median"],
  },
  {
    id: "arch-pl-national-gap",
    leverKey: "price_architecture",
    featureName: "Private label vs national brand gap",
    description:
      "Median price difference between private label and national brand items in comparable sizes.",
    sourceFields: ["price", "privateLabelFlag", "packSize", "category"],
    calculationNote:
      "Requires price, private label flag, pack size, and category.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["PL median / national median − 1 by category"],
  },
  {
    id: "arch-pack-price-consistency",
    leverKey: "price_architecture",
    featureName: "Pack-size price consistency",
    description:
      "Variance of unit price across pack sizes for the same product line.",
    sourceFields: ["price", "packSize", "unitPrice"],
    calculationNote: "Requires price and pack size; unit price preferred.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Std dev of unit price within SKU family"],
  },
  {
    id: "arch-unit-ladder-monotonicity",
    leverKey: "price_architecture",
    featureName: "Price-per-unit ladder monotonicity",
    description:
      "Share of pack-size ladders where unit price increases with pack size (or defined rule).",
    sourceFields: ["price", "packSize", "unitPrice"],
    calculationNote: "Requires price and pack size; unit price for per-unit ladder.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Monotonic ladders / total ladders"],
  },
  {
    id: "arch-duplicate-price-clustering",
    leverKey: "price_architecture",
    featureName: "Duplicate price point clustering",
    description:
      "Frequency of multiple SKUs sharing identical shelf prices within a category.",
    sourceFields: ["price", "sku", "category"],
    calculationNote: "Requires price, SKU, and category.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["SKUs at mode price / total SKUs"],
  },
];

export const ZONING_PATTERN_FEATURES: PatternFeatureSeed[] = [
  {
    id: "zone-price-variance",
    leverKey: "price_zoning",
    featureName: "Zone price variance",
    description:
      "Variance or coefficient of variation of price for the same SKU across zones.",
    sourceFields: ["price", "zone", "sku"],
    calculationNote: "Requires store or zone and price; SKU for matching.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["CV of price by SKU across zones"],
  },
  {
    id: "zone-uniform-price-share",
    leverKey: "price_zoning",
    featureName: "Uniform price share",
    description:
      "Share of SKU-zone pairs where price equals the national or chain mode.",
    sourceFields: ["price", "zone", "sku"],
    calculationNote: "Requires store or zone and price.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Identical price across all zones / observations"],
  },
  {
    id: "zone-regional-dispersion",
    leverKey: "price_zoning",
    featureName: "Regional dispersion",
    description:
      "Spread of median prices across regions for comparable items.",
    sourceFields: ["price", "region", "category"],
    calculationNote: "Requires store or zone, price, and region when available.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Interquartile range of regional medians"],
  },
  {
    id: "zone-count-coverage",
    leverKey: "price_zoning",
    featureName: "Zone count coverage",
    description:
      "Number of distinct zones with price observations versus expected coverage.",
    sourceFields: ["zone", "price", "sku"],
    calculationNote: "Requires store or zone and price.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Zones with data / zones in store file"],
  },
  {
    id: "zone-outlier-frequency",
    leverKey: "price_zoning",
    featureName: "Outlier zone frequency",
    description:
      "Rate at which a zone price deviates beyond a defined descriptive band from the chain median (band set at rule alignment).",
    sourceFields: ["price", "zone", "sku"],
    calculationNote: "Requires store or zone and price; threshold deferred to rules.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Zone prices outside descriptive band / total"],
  },
];

export const PROMOTION_PATTERN_FEATURES: PatternFeatureSeed[] = [
  {
    id: "promo-depth",
    leverKey: "promotions",
    featureName: "Promo depth",
    description:
      "Distribution of discount depth during promotional periods (descriptive, not optimal depth).",
    sourceFields: ["price", "promoPrice", "promoFlag"],
    calculationNote: "Requires promo flag or promo price and base price.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["(Price − promo price) / price during promo"],
  },
  {
    id: "promo-frequency",
    leverKey: "promotions",
    featureName: "Promo frequency",
    description: "Share of weeks or observations with an active promotion.",
    sourceFields: ["promoFlag", "effectiveDate"],
    calculationNote:
      "Requires promo flag or promo price; dates improve frequency windows.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Promo weeks / total weeks by SKU"],
  },
  {
    id: "promo-overlap-rate",
    leverKey: "promotions",
    featureName: "Promo overlap rate",
    description:
      "Share of assortment with overlapping promotional mechanics on the same item.",
    sourceFields: ["promoFlag", "sku", "effectiveDate", "endDate"],
    calculationNote:
      "Requires promo flag, SKU, and date range for overlap detection.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Overlapping promo windows / promo observations"],
  },
  {
    id: "promo-vs-base-gap",
    leverKey: "promotions",
    featureName: "Promo price vs base price gap",
    description:
      "Gap between everyday shelf price and promotional price when both are present.",
    sourceFields: ["price", "promoPrice"],
    calculationNote: "Requires promo flag or promo price and base price.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Median (price − promo price) / price"],
  },
  {
    id: "promo-assortment-share",
    leverKey: "promotions",
    featureName: "Promotion share of assortment",
    description: "Proportion of SKUs with at least one recorded promotion.",
    sourceFields: ["promoFlag", "sku"],
    calculationNote: "Requires promo flag or promo price.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["SKUs with promo / total SKUs"],
  },
];

export const MARKDOWN_PATTERN_FEATURES: PatternFeatureSeed[] = [
  {
    id: "markdown-depth",
    leverKey: "markdown",
    featureName: "Markdown depth",
    description:
      "Distribution of markdown depth from original or base price (descriptive only).",
    sourceFields: ["price", "markdownPrice", "markdownFlag"],
    calculationNote:
      "Requires markdown flag or markdown price and reference price.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["(Price − markdown price) / price"],
  },
  {
    id: "markdown-frequency",
    leverKey: "markdown",
    featureName: "Markdown frequency",
    description: "Rate of markdown events per SKU or category over time.",
    sourceFields: ["markdownFlag", "effectiveDate"],
    calculationNote:
      "Requires markdown flag or markdown price; dates for frequency.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Markdown events / selling weeks"],
  },
  {
    id: "markdown-aging",
    leverKey: "markdown",
    featureName: "Markdown aging",
    description:
      "Days or periods between markdown start and clearance (inventory aging proxy).",
    sourceFields: ["markdownFlag", "effectiveDate", "endDate"],
    calculationNote:
      "Requires markdown flag or markdown price and dates.",
    outputType: "numeric",
    requiresAlignment: ALIGNMENT,
    examples: ["Median days from markdown start to end"],
  },
  {
    id: "markdown-recovery-rate",
    leverKey: "markdown",
    featureName: "Markdown recovery rate",
    description:
      "Descriptive ratio of revenue or units sold post-markdown versus exposure (no margin conclusion).",
    sourceFields: ["markdownPrice", "revenue", "units"],
    calculationNote:
      "Requires markdown price and revenue or units; cost optional for margin context later.",
    outputType: "percent",
    requiresAlignment: ALIGNMENT,
    examples: ["Post-markdown revenue / pre-markdown revenue proxy"],
  },
  {
    id: "markdown-category-exposure",
    leverKey: "markdown",
    featureName: "Markdown exposure by category",
    description:
      "Share of revenue or units under markdown by category.",
    sourceFields: ["category", "markdownFlag", "revenue"],
    calculationNote:
      "Requires category, markdown flag or markdown price, and revenue or units.",
    outputType: "composite",
    requiresAlignment: ALIGNMENT,
    examples: ["Markdown revenue share by category"],
  },
];

export const PATTERN_FEATURES_BY_LEVER: Record<LeverKey, PatternFeatureSeed[]> = {
  kvis: KVI_PATTERN_FEATURES,
  price_architecture: ARCHITECTURE_PATTERN_FEATURES,
  price_zoning: ZONING_PATTERN_FEATURES,
  promotions: PROMOTION_PATTERN_FEATURES,
  markdown: MARKDOWN_PATTERN_FEATURES,
};

export const ALL_PATTERN_FEATURE_SEEDS: PatternFeatureSeed[] = [
  ...KVI_PATTERN_FEATURES,
  ...ARCHITECTURE_PATTERN_FEATURES,
  ...ZONING_PATTERN_FEATURES,
  ...PROMOTION_PATTERN_FEATURES,
  ...MARKDOWN_PATTERN_FEATURES,
];

export const PATTERN_FEATURE_COUNT = ALL_PATTERN_FEATURE_SEEDS.length;
