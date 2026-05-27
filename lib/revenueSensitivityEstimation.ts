/**
 * Directional revenue sensitivity estimation — elasticity-informed, not forecasting.
 * Does not run demand simulation, optimization, or econometric models.
 */

import { parseMarginBounds } from "@/lib/opportunityAggregator";
import { weightedElasticitySensitivity } from "@/lib/categoryExposure";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { EvidenceStrength } from "@/types/evidence-computation";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type {
  DirectionalRevenueSensitivityEstimate,
  RevenueSensitivityTrace,
} from "@/types/revenue-sensitivity";
import type { OpportunityTraceRow } from "@/types/opportunity-trace";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

const MAX_REV_LOW = -0.75;
const MAX_REV_HIGH = 0.85;
const MAX_REV_SPAN = 1.05;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function formatSignedRevenuePct(n: number): string {
  const v = round1(n);
  if (v > 0) return `+${v.toFixed(1)}%`;
  return `${v.toFixed(1)}%`;
}

export function formatRevenueSensitivityRangeDisplay(low: number, high: number): string {
  return `${formatSignedRevenuePct(low)} to ${formatSignedRevenuePct(high)}`;
}

export function buildRevenueExecutiveLabel(low: number, high: number): string {
  const span = high - low;
  if (low >= -0.12 && high <= 0.28 && high > 0.05) {
    return "Flat to modest upside";
  }
  if (low >= -0.28 && high <= 0.22) {
    return "Limited expected volume downside";
  }
  if (low >= -0.2 && high <= 0.15) {
    return "Limited downside sensitivity";
  }
  if (span <= 0.55 && high <= 0.35) {
    return "Modest volume sensitivity";
  }
  if (low < -0.35) {
    return "Moderate volume sensitivity — bounded downside";
  }
  return "Directional sales sensitivity";
}

export function buildRevenueSensitivityInterpretation(
  low: number,
  high: number,
  label: string,
  portfolioElasticity: ElasticitySensitivity,
  architectureLed: boolean,
  kviHeavy: boolean,
): string {
  if (architectureLed && low >= -0.3) {
    return "The opportunity appears margin-accretive with limited expected sales disruption.";
  }
  if (label === "Flat to modest upside") {
    return "Revenue sensitivity appears manageable given the category mix — most upside is structural rather than volume-led.";
  }
  if (label === "Limited expected volume downside") {
    return "Directional sales impact stays bounded; architecture-led opportunity should not imply large traffic risk.";
  }
  if (portfolioElasticity === "high" && kviHeavy) {
    return "Highly elastic, KVI-visible categories imply tighter sales sensitivity bounds — margin opportunity should be sequenced carefully.";
  }
  if (portfolioElasticity === "high") {
    return "Elasticity context suggests volume/perception sensitivity matters, but the estimate stays directional and conservative.";
  }
  if (low >= -0.15 && high <= 0.4) {
    return "Most identified opportunity sits in categories with moderate elasticity sensitivity.";
  }
  return "Potential revenue impact is framed as sensitivity, not a sales forecast.";
}

function architectureLedOpportunity(
  themes: ExecutiveTheme[],
  exposure?: OpportunityExposureBundle | null,
): boolean {
  const archTheme = themes.some((t) =>
    /architecture|premiumization/i.test(t.themeFamily),
  );
  const archPct = exposure?.architectureAffectedRevenuePct ?? 0;
  return archTheme || archPct >= 22;
}

function kviHeavyPortfolio(exposure?: OpportunityExposureBundle | null): boolean {
  const elevated =
    exposure?.categoryExposures.filter((c) => c.kviElevated).length ?? 0;
  return elevated >= 2;
}

function computeRevenueBounds(input: {
  marginRangeText: string;
  portfolioElasticity: ElasticitySensitivity;
  architectureLed: boolean;
  kviHeavy: boolean;
  evidenceStrength?: EvidenceStrength;
  archetypeId?: RetailerArchetypeId;
}): { low: number; high: number; modifiers: OpportunityTraceRow[] } {
  const margin = parseMarginBounds(input.marginRangeText);
  const marginMid = margin ? (margin.low + margin.high) / 2 : 0.7;
  const marginSpan = margin ? margin.high - margin.low : 0.8;
  const modifiers: OpportunityTraceRow[] = [];

  let low = -0.12 - marginMid * 0.1;
  let high = 0.15 + marginMid * 0.2;

  if (input.architectureLed) {
    low = Math.max(low, -0.22);
    high = Math.min(high, 0.5);
    modifiers.push({
      label: "Architecture-led framing",
      value: "Downside bounded",
      detail: "Premiumization / ladder clarity supports modest revenue resilience.",
    });
  }

  if (input.portfolioElasticity === "high") {
    low -= 0.14;
    high -= 0.12;
    modifiers.push({
      label: "Portfolio elasticity",
      value: "High",
      detail: "Tighter revenue upside; more downside sensitivity in interpretation.",
    });
  } else if (input.portfolioElasticity === "low") {
    low += 0.06;
    high += 0.08;
    modifiers.push({
      label: "Portfolio elasticity",
      value: "Low",
      detail: "More room for modest upside with limited volume downside.",
    });
  } else {
    modifiers.push({
      label: "Portfolio elasticity",
      value: "Moderate",
      detail: "Balanced directional sensitivity bounds.",
    });
  }

  if (input.kviHeavy) {
    high = Math.min(high, 0.38);
    low = Math.max(low - 0.06, -0.32);
    modifiers.push({
      label: "KVI concentration",
      value: "Elevated",
      detail: "Value-visible categories tighten sales sensitivity upside.",
    });
  }

  if (input.evidenceStrength === "weak") {
    const shrink = 0.85;
    const mid = (low + high) / 2;
    const half = ((high - low) / 2) * shrink;
    low = mid - half;
    high = mid + half;
    modifiers.push({
      label: "Evidence confidence",
      value: "Moderate / weak",
      detail: "Revenue band narrowed for conservative executive framing.",
    });
  }

  const maxSpan = Math.min(MAX_REV_SPAN, marginSpan * 0.62);
  const mid = (low + high) / 2;
  let half = (high - low) / 2;
  if (half * 2 > maxSpan) half = maxSpan / 2;

  low = clamp(round1(mid - half), MAX_REV_LOW, 0.05);
  high = clamp(round1(mid + half), low + 0.08, MAX_REV_HIGH);

  modifiers.push({
    label: "Conservative cap vs margin",
    value: `Span ≤ ${maxSpan.toFixed(2)}pp`,
    detail: "Revenue sensitivity remains narrower than margin opportunity.",
  });

  return { low, high, modifiers };
}

export type EstimateRevenueSensitivityInput = {
  marginRangeText: string;
  themes: ExecutiveTheme[];
  exposure?: OpportunityExposureBundle | null;
  archetypeId?: RetailerArchetypeId;
  evidenceStrength?: EvidenceStrength;
};

export function estimateDirectionalRevenueSensitivity(
  input: EstimateRevenueSensitivityInput,
): DirectionalRevenueSensitivityEstimate {
  const exposure = input.exposure;
  const portfolioElasticity =
    exposure?.portfolioElasticitySensitivity ??
    weightedElasticitySensitivity(exposure?.categoryExposures ?? []).sensitivity;

  const architectureLed = architectureLedOpportunity(input.themes, exposure);
  const kviHeavy = kviHeavyPortfolio(exposure);

  const { low, high, modifiers } = computeRevenueBounds({
    marginRangeText: input.marginRangeText,
    portfolioElasticity,
    architectureLed,
    kviHeavy,
    evidenceStrength: input.evidenceStrength,
    archetypeId: input.archetypeId,
  });

  const executiveLabel = buildRevenueExecutiveLabel(low, high);
  const display = formatRevenueSensitivityRangeDisplay(low, high);
  const interpretation = buildRevenueSensitivityInterpretation(
    low,
    high,
    executiveLabel,
    portfolioElasticity,
    architectureLed,
    kviHeavy,
  );

  const categoryElasticity: OpportunityTraceRow[] =
    exposure?.categoryExposures
      .filter((c) => c.revenueWeightPct >= 8)
      .slice(0, 6)
      .map((c) => ({
        label: c.category,
        value: `${c.elasticitySensitivity} elasticity`,
        detail: `|ε|≈${c.elasticityAbs.toFixed(2)} · ${c.revenueWeightPct}% revenue weight · ${c.elasticitySource}`,
      })) ?? [];

  if (categoryElasticity.length === 0) {
    categoryElasticity.push({
      label: "Portfolio elasticity",
      value: portfolioElasticity,
      detail: "Category mapping from reference workbook medians.",
    });
  }

  const inputSignals: OpportunityTraceRow[] = [
    {
      label: "Linked margin opportunity",
      value: input.marginRangeText.replace(/\s*indicative.*$/i, "").trim(),
      detail: "Revenue band is derived as secondary sensitivity, not additive sizing.",
    },
    {
      label: "Elasticity channel",
      value: exposure?.elasticityChannel ?? "portfolio default",
    },
    {
      label: "Elasticity width multiplier",
      value: (exposure?.elasticityWidthMultiplier ?? 1).toFixed(2),
      detail: "Contextual modifier on thematic bands — not volume optimization.",
    },
  ];

  const intermediateSteps: OpportunityTraceRow[] = [
    {
      label: "1. Anchor to margin midpoint",
      value: parseMarginBounds(input.marginRangeText)
        ? `${((parseMarginBounds(input.marginRangeText)!.low + parseMarginBounds(input.marginRangeText)!.high) / 2).toFixed(2)}%`
        : "directional default",
    },
    {
      label: "2. Apply elasticity posture",
      value: portfolioElasticity,
    },
    {
      label: "3. Apply architecture / KVI modifiers",
      value: `${architectureLed ? "architecture-led" : "mixed"} · ${kviHeavy ? "KVI-heavy" : "KVI moderate"}`,
    },
    {
      label: "4. Enforce conservative span cap",
      value: display,
    },
  ];

  const trace: RevenueSensitivityTrace = {
    traceId: "trace-revenue-sensitivity",
    inputSignals,
    categoryElasticity,
    modifiers,
    intermediateSteps,
    finalRange: {
      lowPct: low,
      highPct: high,
      display,
      executiveLabel,
    },
    interpretation,
    formulaSummary:
      "Elasticity-weighted directional sensitivity — bounded, non-additive, not a volume forecast",
  };

  const narrativeSummary = `${interpretation} Directional range: ${display} (${executiveLabel}). Not a sales forecast.`;

  return {
    finalRange: trace.finalRange,
    interpretation,
    narrativeSummary,
    trace,
  };
}

/** Legacy storyline prose — kept for consultant panels; hero uses structured estimate. */
export function buildRevenueSensitivityNarrativeSummary(
  estimate: DirectionalRevenueSensitivityEstimate,
  themes: ExecutiveTheme[],
  archetypeNote: string,
): string {
  const themeNotes = themes
    .slice(0, 2)
    .map((t) => t.revenueSensitivityRange)
    .filter(Boolean)
    .join(" ");
  return `${estimate.interpretation} ${archetypeNote} ${themeNotes}`.trim();
}
