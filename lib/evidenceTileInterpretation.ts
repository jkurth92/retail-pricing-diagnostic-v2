/**
 * Business interpretation layer for executive evidence tiles.
 * Presentation only — does not alter metrics, benchmarks, or sizing engines.
 */

import type { ComputedEvidenceBundle, EvidenceMetric } from "@/types/evidence-computation";

export type EvidenceTilePresentation = {
  title: string;
  observationLabel: string;
  observationValue: string;
  implication: string;
  suppress: boolean;
};

/** Metrics that do not earn a standalone tile (merged or low executive value). */
const SUPPRESSED_METRIC_IDS = new Set<string>([
  "kvi_sku_share",
  "pl_nb_categories_narrow",
  "premiumization_category_mix",
  "pack_size_consistency",
]);

export function shouldSuppressEvidenceMetric(
  metricId: string,
  allMetrics: EvidenceMetric[],
): boolean {
  if (SUPPRESSED_METRIC_IDS.has(metricId)) return true;

  if (metricId === "architecture_compression") {
    return allMetrics.some((m) => m.id === "premium_mainstream_gap");
  }

  if (metricId === "kvi_revenue_share") {
    const hasCategory = allMetrics.some((m) => m.id === "kvi_category_concentration");
    const revWeak =
      allMetrics.find((m) => m.id === "kvi_revenue_share")?.strength === "weak";
    if (hasCategory && revWeak) return true;
  }

  return false;
}

function parseCategoryShare(
  rawValue: string,
): { category: string; sharePct: number | null } | null {
  const m = rawValue.match(/^([^:]+):\s*~?(\d+)%/);
  if (!m) return null;
  return { category: m[1].trim(), sharePct: parseInt(m[2], 10) };
}

export function buildEvidenceMetricImplication(
  metricId: EvidenceMetric["id"] | string,
  rawValue: string,
  strength: EvidenceMetric["strength"],
): string {
  const tight = strength === "strong" || strength === "moderate";
  const v = rawValue.toLowerCase();

  switch (metricId) {
    case "premium_mainstream_gap":
      return tight
        ? "Compressed premium steps can blur trade-up on shelf and weaken premiumization pull."
        : "Premium step-up is broadly legible — trade-up signaling is not a primary constraint.";
    case "entry_mainstream_gap":
      return tight
        ? "Shallow entry-to-mainstream steps can mute opening-price signaling for value-focused shoppers."
        : "Entry signaling is broadly consistent with peer mass / hybrid formats.";
    case "tier_spacing":
      return tight
        ? "Tight average tier steps reduce visible step-ups across the assortment."
        : "Tier steps are broadly balanced — ladder structure is not the lead constraint.";
    case "pl_nb_gap":
      return tight
        ? "Narrow private-brand separation limits monetization flexibility between tiers."
        : "Private-brand spacing is broadly healthy — monetization is not dominated by PL/NB tension.";
    case "kvi_revenue_share": {
      const pct = parseInt(v.replace(/%/g, ""), 10);
      if (Number.isFinite(pct) && pct < 14) {
        return "Trip-driving value is present but not dominant — margin recovery is more architecture-led.";
      }
      return "Value-oriented pricing has meaningful weight in the mix and shapes which categories anchor price perception.";
    }
    case "kvi_category_concentration": {
      const cats = rawValue.replace(/\s*\(\+\d+ more\)/i, "");
      return `Trip-driving value concentrates in ${cats} — these categories disproportionately shape how shoppers read your price architecture.`;
    }
    case "category_revenue_concentration": {
      const parsed = parseCategoryShare(rawValue);
      if (parsed) {
        return `${parsed.category} is one of the largest reviewed categories and materially influences where structural opportunities concentrate.`;
      }
      return "A few large in-scope categories disproportionately shape the pricing structure read.";
    }
    case "architecture_compression":
      return "Select categories show compressed tier spacing — trade-up and entry signaling may be harder to read on shelf.";
    default:
      if (strength === "strong") {
        return "This pattern reinforces the lead structural storyline in reviewed data.";
      }
      if (strength === "moderate") {
        return "Adds commercial context to how pricing structure is interpreted in scope.";
      }
      return "Supporting context for the overall pricing narrative.";
  }
}

function buildTitle(metricId: string, engineLabel: string): string {
  const titles: Record<string, string> = {
    premium_mainstream_gap: "Trade-up spacing (premium vs. mainstream)",
    entry_mainstream_gap: "Entry price signaling",
    tier_spacing: "Tier step-up across the ladder",
    pl_nb_gap: "Private brand monetization gap",
    kvi_revenue_share: "Value-oriented pricing in the mix",
    kvi_category_concentration: "Where trip-driving value concentrates",
    category_revenue_concentration: "Categories shaping the opportunity",
    architecture_compression: "Compressed tier spacing (select categories)",
  };
  return (
    titles[metricId] ??
    engineLabel
      .replace(/\bKVI-like\b/gi, "Trip-driving value")
      .replace(/\bPL\/NB\b/g, "Private brand vs. national brand")
      .replace(/\bmedian gap\b/gi, "spacing")
      .replace(/\brevenue weight\b/gi, "commercial weight")
      .replace(/\s+\(inferred\)/gi, "")
  );
}

function buildObservationLabel(metricId: string): string {
  const labels: Record<string, string> = {
    premium_mainstream_gap: "Average premium spacing",
    entry_mainstream_gap: "Entry vs. mainstream spacing",
    tier_spacing: "Average tier spacing",
    pl_nb_gap: "Private brand vs. national brand gap",
    kvi_revenue_share: "Share of reviewed revenue",
    kvi_category_concentration: "Concentration by category",
    category_revenue_concentration: "Largest in-scope category",
    architecture_compression: "Compression signal",
  };
  return labels[metricId] ?? "Observed pattern";
}

export function buildEvidenceTilePresentation(
  metric: EvidenceMetric,
  allMetrics: EvidenceMetric[],
): EvidenceTilePresentation | null {
  if (shouldSuppressEvidenceMetric(metric.id, allMetrics)) {
    return { title: "", observationLabel: "", observationValue: "", implication: "", suppress: true };
  }

  const observationValue = metric.value.trim();
  if (!observationValue) return null;

  let displayValue = observationValue;
  if (metric.id === "category_revenue_concentration") {
    const parsed = parseCategoryShare(observationValue);
    if (parsed && parsed.sharePct !== null) {
      displayValue = `${parsed.category} · ~${parsed.sharePct}% of reviewed scope`;
    }
  }

  return {
    title: buildTitle(metric.id, metric.label),
    observationLabel: buildObservationLabel(metric.id),
    observationValue: displayValue,
    implication: buildEvidenceMetricImplication(
      metric.id,
      metric.value,
      metric.strength,
    ),
    suppress: false,
  };
}

export function buildExposureCategoryTilePresentation(
  category: string,
  revenueWeightPct: number,
  kind: "architecture" | "pl_nb",
): EvidenceTilePresentation {
  if (kind === "architecture") {
    return {
      title: `Trade-up spacing · ${category}`,
      observationLabel: "Category signal",
      observationValue: `${category} · ${revenueWeightPct}% of reviewed scope`,
      implication:
        "Premium and mainstream tiers appear compressed here — trade-up may be harder to read on shelf.",
      suppress: false,
    };
  }
  return {
    title: `Private brand gap · ${category}`,
    observationLabel: "Category signal",
    observationValue: `${category} · ${revenueWeightPct}% of reviewed scope`,
    implication:
      "Private-brand separation looks narrow in this category — less room to monetize tier differences.",
    suppress: false,
  };
}

export function buildCategoryConcentrationTilePresentation(
  categories: { category: string; revenueWeightPct: number }[],
): EvidenceTilePresentation | null {
  if (categories.length < 2) return null;
  const top = categories[0];
  const names = categories
    .slice(0, 2)
    .map((c) => c.category)
    .join(" and ");
  const pctSum = categories.slice(0, 2).reduce((s, c) => s + c.revenueWeightPct, 0);
  return {
    title: "Categories shaping the opportunity",
    observationLabel: "Largest in-scope categories",
    observationValue: `${names} · ~${Math.round(pctSum)}% of reviewed scope`,
    implication: `${top.category} and peer large categories anchor where structural pricing opportunities concentrate.`,
    suppress: false,
  };
}

export function exposureTileShouldShow(
  kind: "cat-weight" | "cat-arch" | "cat-pl",
  evidence: ComputedEvidenceBundle | null | undefined,
): boolean {
  if (!evidence?.metrics) return true;
  const ids = new Set(evidence.metrics.map((m) => m.id));
  if (kind === "cat-weight" && ids.has("category_revenue_concentration")) return false;
  if (kind === "cat-arch" && ids.has("premium_mainstream_gap")) return false;
  if (kind === "cat-pl" && ids.has("pl_nb_gap")) return false;
  return true;
}
