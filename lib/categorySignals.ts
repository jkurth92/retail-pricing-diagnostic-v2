import type { EvidenceMetric } from "@/types/evidence-computation";
import type { InferredCategoryRow } from "@/types/category-scope";
import type { SyntheticPricingRow } from "@/lib/pricingRowSynthesis";

export type CategorySignalResult = {
  metrics: EvidenceMetric[];
  topCategoryShares: { category: string; sharePct: number }[];
  premiumizationCategoryCount: number;
};

export function computeCategorySignals(
  rows: SyntheticPricingRow[],
  categoryRows: InferredCategoryRow[],
): CategorySignalResult {
  const metrics: EvidenceMetric[] = [];
  const revenueByCategory = new Map<string, number>();

  for (const r of rows) {
    revenueByCategory.set(
      r.category,
      (revenueByCategory.get(r.category) ?? 0) + r.revenueWeight,
    );
  }

  const total = [...revenueByCategory.values()].reduce((a, b) => a + b, 0);
  const topCategoryShares = [...revenueByCategory.entries()]
    .map(([category, w]) => ({
      category,
      sharePct: total > 0 ? Math.round((w / total) * 100) : 0,
    }))
    .sort((a, b) => b.sharePct - a.sharePct);

  const premiumizationCategoryCount = categoryRows.filter(
    (r) => r.roleId === "premiumization",
  ).length;

  if (topCategoryShares.length > 0) {
    const top = topCategoryShares[0];
    metrics.push({
      id: "category_revenue_concentration",
      label: "Largest category revenue weight",
      value: `${top.category}: ~${top.sharePct}%`,
      family: "category",
      strength: top.sharePct >= 22 ? "strong" : "moderate",
    });
  }

  if (premiumizationCategoryCount > 0) {
    const names = categoryRows
      .filter((r) => r.roleId === "premiumization")
      .map((r) => r.category)
      .slice(0, 3);
    metrics.push({
      id: "premiumization_category_mix",
      label: "Premiumization-oriented categories",
      value: names.join(", "),
      family: "category",
      strength: premiumizationCategoryCount >= 2 ? "moderate" : "weak",
    });
  }

  return { metrics, topCategoryShares, premiumizationCategoryCount };
}
