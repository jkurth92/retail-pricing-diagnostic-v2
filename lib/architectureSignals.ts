import type { EvidenceMetric } from "@/types/evidence-computation";
import type { SyntheticPricingRow } from "@/lib/pricingRowSynthesis";

export type ArchitectureSignalResult = {
  metrics: EvidenceMetric[];
  premiumMainstreamGapPct: number | null;
  entryMainstreamGapPct: number | null;
  avgTierSpacingPct: number | null;
  packSizeConsistencyPct: number | null;
  plNbGapPctMedian: number | null;
  plNbCategoriesNarrow: number;
  compressionCategories: string[];
  architectureCompression: boolean;
};

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function gapPct(low: number, high: number): number {
  if (high <= 0) return 0;
  return ((high - low) / high) * 100;
}

const EXPECTED_PL_NB_GAP_PCT = 18;
const COMPRESSION_PREMIUM_GAP_PCT = 12;
const COMPRESSION_ENTRY_GAP_PCT = 10;

export function computeArchitectureSignals(
  rows: SyntheticPricingRow[],
): ArchitectureSignalResult {
  const metrics: EvidenceMetric[] = [];
  const byCategory = new Map<string, SyntheticPricingRow[]>();
  for (const r of rows) {
    const list = byCategory.get(r.category) ?? [];
    list.push(r);
    byCategory.set(r.category, list);
  }

  const premiumGaps: number[] = [];
  const entryGaps: number[] = [];
  const spacingGaps: number[] = [];
  const plNbGaps: number[] = [];
  const compressionCategories: string[] = [];
  let plNbCategoriesNarrow = 0;

  for (const [category, catRows] of byCategory) {
    const nb = (tier: SyntheticPricingRow["tier"]) =>
      catRows.find(
        (r) => r.tier === tier && r.brandType === "national_brand",
      );
    const pl = (tier: SyntheticPricingRow["tier"]) =>
      catRows.find(
        (r) => r.tier === tier && r.brandType === "private_label",
      );

    const entry = nb("entry");
    const mainstream = nb("mainstream");
    const premium = nb("premium");

    if (entry && mainstream) {
      entryGaps.push(gapPct(entry.price, mainstream.price));
    }
    if (mainstream && premium) {
      premiumGaps.push(gapPct(mainstream.price, premium.price));
    }
    if (entry && mainstream && premium) {
      const eToM = gapPct(entry.price, mainstream.price);
      const mToP = gapPct(mainstream.price, premium.price);
      spacingGaps.push((eToM + mToP) / 2);
      if (
        eToM < COMPRESSION_ENTRY_GAP_PCT &&
        mToP < COMPRESSION_PREMIUM_GAP_PCT
      ) {
        compressionCategories.push(category);
      }
    }

    if (mainstream) {
      const plRow = pl("mainstream");
      if (plRow) {
        const plGap = gapPct(plRow.price, mainstream.price);
        plNbGaps.push(plGap);
        if (plGap < EXPECTED_PL_NB_GAP_PCT) plNbCategoriesNarrow += 1;
      }
    }
  }

  const premiumMainstreamGapPct = median(premiumGaps);
  const entryMainstreamGapPct = median(entryGaps);
  const avgTierSpacingPct = median(spacingGaps);
  const plNbGapPctMedian = median(plNbGaps);

  const packSizes = rows.map((r) => r.packSize);
  const uniquePack = new Set(packSizes).size;
  const packSizeConsistencyPct =
    packSizes.length > 0
      ? Math.round((1 - (uniquePack - 1) / Math.max(packSizes.length, 1)) * 100)
      : null;

  const architectureCompression =
    compressionCategories.length >= 1 ||
    (premiumMainstreamGapPct !== null &&
      premiumMainstreamGapPct < COMPRESSION_PREMIUM_GAP_PCT);

  if (premiumMainstreamGapPct !== null) {
    const strength =
      premiumMainstreamGapPct < COMPRESSION_PREMIUM_GAP_PCT
        ? "strong"
        : premiumMainstreamGapPct < 16
          ? "moderate"
          : "weak";
    metrics.push({
      id: "premium_mainstream_gap",
      label: "Premium/Mainstream median gap",
      value: `${Math.round(premiumMainstreamGapPct)}%`,
      family: "architecture",
      strength,
    });
  }

  if (entryMainstreamGapPct !== null) {
    metrics.push({
      id: "entry_mainstream_gap",
      label: "Entry/Mainstream median gap",
      value: `${Math.round(entryMainstreamGapPct)}%`,
      family: "architecture",
      strength:
        entryMainstreamGapPct < COMPRESSION_ENTRY_GAP_PCT ? "strong" : "moderate",
    });
  }

  if (avgTierSpacingPct !== null) {
    metrics.push({
      id: "tier_spacing",
      label: "Average tier spacing",
      value: `${Math.round(avgTierSpacingPct)}%`,
      family: "architecture",
      strength: avgTierSpacingPct < 11 ? "strong" : "moderate",
    });
  }

  if (packSizeConsistencyPct !== null) {
    metrics.push({
      id: "pack_size_consistency",
      label: "Pack-size ladder consistency",
      value: `${packSizeConsistencyPct}%`,
      family: "architecture",
      strength: packSizeConsistencyPct < 70 ? "moderate" : "weak",
    });
  }

  if (plNbGapPctMedian !== null) {
    metrics.push({
      id: "pl_nb_gap",
      label: "PL/NB median gap (mainstream)",
      value: `${Math.round(plNbGapPctMedian)}%`,
      family: "architecture",
      strength: plNbGapPctMedian < EXPECTED_PL_NB_GAP_PCT ? "strong" : "weak",
    });
  }

  if (plNbCategoriesNarrow > 0) {
    metrics.push({
      id: "pl_nb_categories_narrow",
      label: "Categories with narrow PL/NB separation",
      value: `${plNbCategoriesNarrow} of ${byCategory.size}`,
      family: "architecture",
      strength: plNbCategoriesNarrow >= 2 ? "strong" : "moderate",
    });
  }

  if (architectureCompression) {
    metrics.push({
      id: "architecture_compression",
      label: "Architecture compression indicator",
      value:
        compressionCategories.length > 0
          ? `Observed in ${compressionCategories.slice(0, 3).join(", ")}${compressionCategories.length > 3 ? "…" : ""}`
          : "Portfolio-level tight tier spacing",
      family: "architecture",
      strength: "strong",
    });
  }

  return {
    metrics,
    premiumMainstreamGapPct,
    entryMainstreamGapPct,
    avgTierSpacingPct,
    packSizeConsistencyPct,
    plNbGapPctMedian,
    plNbCategoriesNarrow,
    compressionCategories,
    architectureCompression,
  };
}
