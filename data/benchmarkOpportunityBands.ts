import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { BenchmarkOpportunitySeverity } from "@/types/benchmark-calibration";

/** Directional margin bands in % — max portfolio 3.0%, max single theme 1.5%. */
export const BENCHMARK_OPPORTUNITY_BANDS: Record<
  BenchmarkOpportunitySeverity,
  { lowPct: number; highPct: number; label: string }
> = {
  mild: { lowPct: 0.2, highPct: 0.5, label: "Mild structural inefficiency" },
  moderate: {
    lowPct: 0.4,
    highPct: 1.0,
    label: "Moderate architecture / monetization issues",
  },
  significant: {
    lowPct: 1.0,
    highPct: 2.0,
    label: "Significant architecture compression",
  },
  transformation: {
    lowPct: 1.5,
    highPct: 3.0,
    label: "Full structural transformation (portfolio cap)",
  },
};

export const MAX_SINGLE_THEME_HIGH_PCT = 1.5;
export const MAX_PORTFOLIO_HIGH_PCT = 3.0;

const FAMILY_BASE_SEVERITY: Partial<
  Record<HypothesisFamily, BenchmarkOpportunitySeverity>
> = {
  Architecture: "moderate",
  Premiumization: "moderate",
  KVI: "mild",
  ValueCommunication: "mild",
  Governance: "mild",
  RoleAlignment: "mild",
  Promotions: "mild",
  Markdown: "mild",
};

const SEVERITY_ORDER: BenchmarkOpportunitySeverity[] = [
  "mild",
  "moderate",
  "significant",
  "transformation",
];

export function bumpSeverity(
  current: BenchmarkOpportunitySeverity,
  steps: number,
): BenchmarkOpportunitySeverity {
  const idx = Math.min(
    SEVERITY_ORDER.length - 1,
    Math.max(0, SEVERITY_ORDER.indexOf(current) + steps),
  );
  return SEVERITY_ORDER[idx];
}

export function resolveThemeSeverity(
  family: HypothesisFamily,
  portfolioSeverity: BenchmarkOpportunitySeverity,
  metricSeverity: number,
): BenchmarkOpportunitySeverity {
  const base = FAMILY_BASE_SEVERITY[family] ?? "mild";
  let severity = base;
  if (metricSeverity >= 0.75) severity = bumpSeverity(severity, 2);
  else if (metricSeverity >= 0.5) severity = bumpSeverity(severity, 1);

  const portfolioIdx = SEVERITY_ORDER.indexOf(portfolioSeverity);
  const themeIdx = SEVERITY_ORDER.indexOf(severity);
  const blendedIdx = Math.min(
    SEVERITY_ORDER.length - 1,
    Math.round((portfolioIdx + themeIdx) / 2),
  );
  return SEVERITY_ORDER[blendedIdx];
}

export function bandForSeverity(severity: BenchmarkOpportunitySeverity): {
  lowPct: number;
  highPct: number;
  label: string;
} {
  const band = BENCHMARK_OPPORTUNITY_BANDS[severity];
  return {
    lowPct: band.lowPct,
    highPct: Math.min(band.highPct, MAX_SINGLE_THEME_HIGH_PCT),
    label: band.label,
  };
}
