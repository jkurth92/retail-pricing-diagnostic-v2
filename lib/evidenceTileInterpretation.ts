/**
 * Business interpretation layer for executive evidence tiles.
 * Presentation only — does not alter metrics, benchmarks, or sizing engines.
 */

import {
  consultantArchitectureDiagnosis,
  consultantEntryPriceDiagnosis,
  consultantKviDiagnosis,
  consultantPlNbDiagnosis,
  consultantPremiumDiagnosis,
} from "@/lib/insightTranslation";
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
    return allMetrics.some(
      (m) => m.id === "premium_mainstream_gap" || m.id === "tier_spacing",
    );
  }

  if (metricId === "premium_mainstream_gap") {
    return allMetrics.some((m) => m.id === "tier_spacing");
  }

  if (metricId === "entry_mainstream_gap") {
    return allMetrics.some(
      (m) => m.id === "tier_spacing" || m.id === "premium_mainstream_gap",
    );
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
      return consultantPremiumDiagnosis(tight);
    case "entry_mainstream_gap":
      return consultantEntryPriceDiagnosis(tight);
    case "tier_spacing":
      return consultantArchitectureDiagnosis({ compressed: tight, systemic: !tight });
    case "pl_nb_gap":
      return consultantPlNbDiagnosis(tight);
    case "kvi_revenue_share": {
      const pct = parseInt(v.replace(/%/g, ""), 10);
      return (
        consultantKviDiagnosis({
          kviRevenueSharePct: Number.isFinite(pct) ? pct : undefined,
          broadKviBreadth: pct >= 20,
          weakKviConcentration: pct >= 8 && pct < 14,
        }) ??
        "Lower prices may not be focused enough on the items shoppers use to judge whether the store is affordable."
      );
    }
    case "kvi_category_concentration": {
      const cats = rawValue.replace(/\s*\(\+\d+ more\)/i, "");
      return `Shoppers most notice low prices in ${cats}. Those categories may shape how customers judge prices everywhere else in the store.`;
    }
    case "category_revenue_concentration": {
      const parsed = parseCategoryShare(rawValue);
      if (parsed) {
        return `A large share of sales sits in ${parsed.category}. Pricing choices there may matter more than changes in smaller categories.`;
      }
      return "A few large categories drive most of what customers experience — and where margin may be won or lost.";
    }
    case "architecture_compression": {
      const cats = rawValue
        .replace(/^observed in\s*/i, "")
        .split(/[,…]/)
        .map((c) => c.trim())
        .filter(Boolean);
      return consultantArchitectureDiagnosis({
        compressed: true,
        systemic: cats.length >= 3,
        categoryNames: cats,
      });
    }
    default:
      if (strength === "strong") {
        return "This pattern shows up in multiple places — it is unlikely to be fixed by changing one product alone.";
      }
      if (strength === "moderate") {
        return "Worth discussing with leadership because it can affect how shoppers see prices and where margin may leak.";
      }
      return "Adds context for the overall story.";
  }
}

function buildTitle(metricId: string, engineLabel: string): string {
  const titles: Record<string, string> = {
    premium_mainstream_gap: "Premium vs. everyday prices",
    entry_mainstream_gap: "Budget vs. everyday prices",
    tier_spacing: "Budget, mainstream & premium clarity",
    pl_nb_gap: "Store brand vs. national brands",
    kvi_revenue_share: "Where lower prices show up",
    kvi_category_concentration: "Value spread across categories",
    category_revenue_concentration: "Biggest categories in the review",
    architecture_compression: "Clear good-better-best story",
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
    premium_mainstream_gap: "Premium vs. everyday gap",
    entry_mainstream_gap: "Budget vs. everyday gap",
    tier_spacing: "Average gap across price levels",
    pl_nb_gap: "Store brand vs. brand-name gap",
    kvi_revenue_share: "Share of sales on deal items",
    kvi_category_concentration: "Categories with the most low-price focus",
    category_revenue_concentration: "Largest category in the review",
    architecture_compression: "Where steps look tight",
  };
  return labels[metricId] ?? "What we noticed";
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
        "In this category, premium options may not feel clearly better than everyday products — shoppers may not pay more.",
      suppress: false,
    };
  }
  return {
    title: `Private brand gap · ${category}`,
    observationLabel: "Category signal",
    observationValue: `${category} · ${revenueWeightPct}% of reviewed scope`,
      implication:
        "Store brands and well-known brands may be priced too similarly here — the business may lose margin without shoppers noticing a difference.",
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
  if (
    kind === "cat-arch" &&
    (ids.has("premium_mainstream_gap") ||
      ids.has("tier_spacing") ||
      ids.has("architecture_compression"))
  ) {
    return false;
  }
  if (kind === "cat-pl" && ids.has("pl_nb_gap")) return false;
  return true;
}
