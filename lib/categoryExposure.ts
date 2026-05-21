import {
  absElasticityToSensitivity,
  elasticityWidthMultiplier,
  resolveCategoryElasticity,
} from "@/data/elasticityReference";
import { CATEGORY_ROLE_BY_ID } from "@/data/categoryRoles";
import type { ArchitectureSignalResult } from "@/lib/architectureSignals";
import type { KviSignalResult } from "@/lib/kviSignals";
import {
  synthesizePricingRows,
  type PricingRowSynthesisInput,
  type SyntheticPricingRow,
} from "@/lib/pricingRowSynthesis";
import type { CategoryExposureRecord } from "@/types/opportunity-exposure";
import type { InferredCategoryRow } from "@/types/category-scope";
import type { CategoryRoleId } from "@/types/role-inference";

const EXPECTED_PL_NB_GAP_PCT = 18;
const COMPRESSION_PREMIUM_GAP_PCT = 12;
const COMPRESSION_ENTRY_GAP_PCT = 10;

function roleWeight(roleId: CategoryRoleId): number {
  const meta = CATEGORY_ROLE_BY_ID.get(roleId);
  if (!meta) return 1;
  if (roleId === "traffic_driver" || roleId === "destination") return 1.15;
  if (roleId === "premiumization") return 1.1;
  if (roleId === "profit_driver") return 1.05;
  return 1;
}

function gapPct(low: number, high: number): number {
  if (high <= 0) return 0;
  return ((high - low) / high) * 100;
}

function categoryArchitectureFlags(
  catRows: SyntheticPricingRow[],
): {
  compression: boolean;
  plNbNarrow: boolean;
  premiumGapPct: number | null;
} {
  const nb = (tier: SyntheticPricingRow["tier"]) =>
    catRows.find((r) => r.tier === tier && r.brandType === "national_brand");
  const pl = (tier: SyntheticPricingRow["tier"]) =>
    catRows.find((r) => r.tier === tier && r.brandType === "private_label");

  const entry = nb("entry");
  const mainstream = nb("mainstream");
  const premium = nb("premium");

  let compression = false;
  let premiumGapPct: number | null = null;
  if (mainstream && premium) {
    premiumGapPct = gapPct(mainstream.price, premium.price);
    const entryGap =
      entry && mainstream ? gapPct(entry.price, mainstream.price) : null;
    compression =
      premiumGapPct < COMPRESSION_PREMIUM_GAP_PCT ||
      (entryGap !== null && entryGap < COMPRESSION_ENTRY_GAP_PCT);
  }

  let plNbNarrow = false;
  if (mainstream) {
    const plRow = pl("mainstream");
    if (plRow) {
      const plGap = gapPct(plRow.price, mainstream.price);
      plNbNarrow = plGap < EXPECTED_PL_NB_GAP_PCT;
    }
  }

  return { compression, plNbNarrow, premiumGapPct };
}

export type CategoryExposureInput = PricingRowSynthesisInput & {
  categoryRows: InferredCategoryRow[];
  arch: ArchitectureSignalResult;
  kvi: KviSignalResult;
};

export function computeCategoryExposures(
  input: CategoryExposureInput,
): CategoryExposureRecord[] {
  const rows = synthesizePricingRows(input);
  const revenueByCategory = new Map<string, number>();

  for (const r of rows) {
    revenueByCategory.set(
      r.category,
      (revenueByCategory.get(r.category) ?? 0) + r.revenueWeight,
    );
  }

  const totalRevenue = [...revenueByCategory.values()].reduce((a, b) => a + b, 0);

  const kviShareByCategory = new Map(
    input.kvi.kviConcentrationByCategory.map((c) => [c.category, c.sharePct] as const),
  );

  return input.categoryRows.map((cat) => {
    const catRows = rows.filter((r) => r.category === cat.category);
    const revWeight = revenueByCategory.get(cat.category) ?? 0;
    const revenueWeightPct =
      totalRevenue > 0 ? Math.round((revWeight / totalRevenue) * 100) : 0;

    const flags = categoryArchitectureFlags(catRows);
    const kviShare = kviShareByCategory.get(cat.category) ?? 0;
    const kviElevated = kviShare >= 15;

    const el = resolveCategoryElasticity(
      cat.category,
      input.archetypeId,
    );

    const affectedIssueTags: string[] = [];
    if (flags.compression) affectedIssueTags.push("tier_compression");
    if (flags.plNbNarrow) affectedIssueTags.push("narrow_pl_nb");
    if (kviElevated) affectedIssueTags.push("kvi_concentration");

    const issueCount = affectedIssueTags.length;
    const monetizableExposurePct = Math.round(
      revenueWeightPct *
        roleWeight(cat.roleId) *
        (issueCount > 0 ? 0.85 + issueCount * 0.08 : 0.25),
    );

    return {
      category: cat.category,
      roleId: cat.roleId,
      revenueWeightPct,
      roleWeight: roleWeight(cat.roleId),
      elasticityAbs: el.medianAbsElasticity,
      elasticitySensitivity: absElasticityToSensitivity(el.medianAbsElasticity),
      elasticitySource: el.referenceLabel,
      architectureCompression: flags.compression,
      plNbNarrow: flags.plNbNarrow,
      kviElevated,
      affectedIssueTags,
      monetizableExposurePct: Math.min(monetizableExposurePct, revenueWeightPct * 1.2),
    };
  });
}

export function weightedElasticitySensitivity(
  exposures: CategoryExposureRecord[],
): { sensitivity: import("@/types/diagnostic-hypotheses").ElasticitySensitivity; multiplier: number } {
  if (exposures.length === 0) {
    return { sensitivity: "moderate", multiplier: elasticityWidthMultiplier("moderate") };
  }
  const total = exposures.reduce((s, c) => s + c.revenueWeightPct, 0) || 1;
  let weightedAbs = 0;
  for (const c of exposures) {
    weightedAbs += c.elasticityAbs * (c.revenueWeightPct / total);
  }
  const sensitivity = absElasticityToSensitivity(weightedAbs);
  return { sensitivity, multiplier: elasticityWidthMultiplier(sensitivity) };
}
