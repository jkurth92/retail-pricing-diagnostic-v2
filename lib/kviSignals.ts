import type { EvidenceMetric } from "@/types/evidence-computation";
import type { SyntheticPricingRow } from "@/lib/pricingRowSynthesis";

export type KviSignalResult = {
  metrics: EvidenceMetric[];
  kviRevenueSharePct: number;
  kviSkuSharePct: number;
  kviConcentrationByCategory: { category: string; sharePct: number }[];
  broadKviBreadth: boolean;
  weakKviConcentration: boolean;
};

export function computeKviSignals(rows: SyntheticPricingRow[]): KviSignalResult {
  const metrics: EvidenceMetric[] = [];
  const kviRows = rows.filter((r) => r.isKvi);
  const totalRevenueWeight = rows.reduce((s, r) => s + r.revenueWeight, 0);
  const kviRevenueWeight = kviRows.reduce((s, r) => s + r.revenueWeight, 0);
  const kviRevenueSharePct =
    totalRevenueWeight > 0
      ? Math.round((kviRevenueWeight / totalRevenueWeight) * 100)
      : 0;
  const kviSkuSharePct = Math.round((kviRows.length / Math.max(rows.length, 1)) * 100);

  const byCategory = new Map<string, { total: number; kvi: number }>();
  for (const r of rows) {
    const cur = byCategory.get(r.category) ?? { total: 0, kvi: 0 };
    cur.total += r.revenueWeight;
    if (r.isKvi) cur.kvi += r.revenueWeight;
    byCategory.set(r.category, cur);
  }

  const kviConcentrationByCategory = [...byCategory.entries()]
    .map(([category, w]) => ({
      category,
      sharePct: w.total > 0 ? Math.round((w.kvi / w.total) * 100) : 0,
    }))
    .sort((a, b) => b.sharePct - a.sharePct);

  const categoriesWithKvi = kviConcentrationByCategory.filter((c) => c.sharePct >= 15);
  const broadKviBreadth = categoriesWithKvi.length >= 3;
  const weakKviConcentration =
    kviRevenueSharePct >= 12 && kviRevenueSharePct <= 28 && categoriesWithKvi.length >= 2;

  metrics.push({
    id: "kvi_revenue_share",
    label: "KVI-like revenue share (inferred)",
    value: `~${kviRevenueSharePct}%`,
    family: "kvi",
    strength: kviRevenueSharePct >= 20 ? "strong" : kviRevenueSharePct >= 12 ? "moderate" : "weak",
  });

  metrics.push({
    id: "kvi_sku_share",
    label: "KVI-like SKU share (inferred)",
    value: `~${kviSkuSharePct}%`,
    family: "kvi",
    strength: kviSkuSharePct >= 8 ? "moderate" : "weak",
  });

  if (categoriesWithKvi.length > 0) {
    const top = categoriesWithKvi.slice(0, 2).map((c) => c.category);
    metrics.push({
      id: "kvi_category_concentration",
      label: "KVI concentration by category",
      value: `${top.join(", ")}${categoriesWithKvi.length > 2 ? ` (+${categoriesWithKvi.length - 2} more)` : ""}`,
      family: "kvi",
      strength: broadKviBreadth ? "strong" : "moderate",
    });
  }

  return {
    metrics,
    kviRevenueSharePct,
    kviSkuSharePct,
    kviConcentrationByCategory,
    broadKviBreadth,
    weakKviConcentration,
  };
}
