import type { ExecutiveTheme } from "@/types/executive-theme";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";

/** Overlap factor — themes are not independent initiatives. */
const MARGIN_OVERLAP_FACTOR = 0.52;
const MAX_TOTAL_HIGH_PCT = 2.8;
const MIN_TOTAL_LOW_PCT = 0.4;

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

export function aggregateMarginOpportunity(
  primaryThemes: ExecutiveTheme[],
  secondaryThemes: ExecutiveTheme[],
): string {
  const all = [...primaryThemes, ...secondaryThemes];
  if (all.length === 0) {
    return "Not estimated — insufficient prioritized themes";
  }

  const lows = all.map((t) => t.marginOpportunityLowPct);
  const highs = all.map((t) => t.marginOpportunityHighPct);

  const archThemes = all.filter(
    (t) =>
      t.themeFamily === "Architecture" || t.themeFamily === "Premiumization",
  );
  const archHigh =
    archThemes.length > 0
      ? Math.max(...archThemes.map((t) => t.marginOpportunityHighPct))
      : 0;

  const rawLow = lows.reduce((a, b) => a + b, 0) * MARGIN_OVERLAP_FACTOR;
  const rawHigh = highs.reduce((a, b) => a + b, 0) * MARGIN_OVERLAP_FACTOR;

  const totalLow = Math.max(
    MIN_TOTAL_LOW_PCT,
    Math.min(rawLow, archHigh > 0 ? archHigh * 0.6 : rawLow),
  );
  const totalHigh = Math.min(
    MAX_TOTAL_HIGH_PCT,
    Math.max(rawHigh, archHigh * 0.85),
  );

  return formatMarginRange(
    Math.round(totalLow * 10) / 10,
    Math.round(Math.max(totalHigh, totalLow + 0.3) * 10) / 10,
  );
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
