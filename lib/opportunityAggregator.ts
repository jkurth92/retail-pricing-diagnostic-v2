import { buildPortfolioOpportunityTrace } from "@/lib/opportunityCalculationTrace";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";

export function parseMarginBounds(rangeText: string): {
  low: number;
  high: number;
} | null {
  const match = rangeText.match(/([\d.]+)\s*%?\s*[–-]\s*([\d.]+)\s*%?/);
  if (!match) return null;
  return { low: parseFloat(match[1]), high: parseFloat(match[2]) };
}

export function formatMarginRange(low: number, high: number): string {
  return `${low.toFixed(1)}%–${high.toFixed(1)}% indicative margin opportunity (thematic, non-additive)`;
}

export function computeAggregatedMarginOpportunity(
  primaryThemes: ExecutiveTheme[],
  secondaryThemes: ExecutiveTheme[],
): { rangeText: string; trace: OpportunityCalculationTrace | null } {
  const all = [...primaryThemes, ...secondaryThemes];
  if (all.length === 0) {
    return {
      rangeText: "Not estimated — insufficient prioritized themes",
      trace: null,
    };
  }

  const trace = buildPortfolioOpportunityTrace(
    all.map((t) => ({
      themeName: t.themeName,
      themeFamily: t.themeFamily,
      trace: t.calculationTrace,
      low: t.marginOpportunityLowPct,
      high: t.marginOpportunityHighPct,
    })),
  );

  return { rangeText: trace.finalRange.display, trace };
}

export function aggregateMarginOpportunity(
  primaryThemes: ExecutiveTheme[],
  secondaryThemes: ExecutiveTheme[],
): string {
  return computeAggregatedMarginOpportunity(primaryThemes, secondaryThemes).rangeText;
}

export function buildRevenueSensitivitySummary(
  themes: ExecutiveTheme[],
  archetypeNote: string,
): string {
  if (themes.length === 0) {
    return "Revenue sensitivity not assessed — no prioritized themes.";
  }

  const elasticityRank: Record<ElasticitySensitivity, number> = {
    low: 1,
    moderate: 2,
    high: 3,
  };

  let maxElasticity: ElasticitySensitivity = "low";
  for (const t of themes) {
    for (const h of t.supportingHypotheses) {
      if (elasticityRank[h.elasticitySensitivity] > elasticityRank[maxElasticity]) {
        maxElasticity = h.elasticitySensitivity;
      }
    }
  }

  const notes = themes
    .slice(0, 3)
    .map((t) => t.revenueSensitivityRange)
    .filter(Boolean);

  const modifier =
    maxElasticity === "high"
      ? "Category elasticity context suggests higher volume/perception sensitivity for value-led themes — directional only."
      : maxElasticity === "moderate"
        ? "Moderate revenue sensitivity framing applies to promo and basket themes."
        : "Revenue sensitivity is secondary; margin structure dominates the storyline.";

  return `${modifier} ${archetypeNote} Theme notes: ${notes.join(" ")}`;
}
