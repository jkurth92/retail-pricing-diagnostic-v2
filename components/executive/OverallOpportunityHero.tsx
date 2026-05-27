"use client";

import { OpportunityRangeVisual } from "@/components/executive/OpportunityRangeVisual";
import { businessRangeConfidenceLabel } from "@/lib/executiveUxHelpers";
import { buildHeroBusinessInterpretation } from "@/lib/executiveBusinessLanguage";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

type OverallOpportunityHeroProps = {
  exec: ExecutiveSummary;
  marginDisplay: string | null;
  lowPct: number | null;
  highPct: number | null;
  exposure?: OpportunityExposureBundle | null;
  evaluatedRevenuePercent?: number | null;
};

export function OverallOpportunityHero({
  exec,
  marginDisplay,
  lowPct,
  highPct,
  exposure,
  evaluatedRevenuePercent,
}: OverallOpportunityHeroProps) {
  const interpretation = buildHeroBusinessInterpretation(
    exec,
    marginDisplay,
    exposure,
    evaluatedRevenuePercent,
  );
  const confidenceLabel =
    lowPct != null && highPct != null
      ? businessRangeConfidenceLabel(lowPct, highPct)
      : undefined;

  const interpretationRows = [
    { label: "Scope analyzed", value: interpretation.scopeEvaluated },
    { label: "Where opportunity sits", value: interpretation.concentration },
    { label: "Evidence support", value: interpretation.confidence },
    {
      label: "Primary opportunity area",
      value: interpretation.primaryOpportunityArea,
    },
  ].filter((r) => r.value);

  const showRevenue =
    interpretation.revenueImpactLabel || interpretation.revenueImpactRange;

  const revenueBounds = (() => {
    const raw = exec.revenueImpactRange ?? interpretation.revenueImpactRange;
    if (!raw) return null;
    const m = raw.match(/([+-]?\d+(?:\.\d+)?)\s*%?\s+to\s+([+-]?\d+(?:\.\d+)?)\s*%?/i);
    if (!m) return null;
    const low = parseFloat(m[1]);
    const high = parseFloat(m[2]);
    if (!Number.isFinite(low) || !Number.isFinite(high)) return null;
    return { low, high };
  })();

  return (
    <article className="ent-hero-card relative w-full overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-deep)_14%,var(--border))] bg-gradient-to-br from-white to-[var(--accent-light)] p-8 shadow-[0_20px_50px_rgba(26,53,104,0.08)]">
      <header>
        <h2 className="ent-hero-label m-0 text-xs font-semibold uppercase tracking-wider text-[var(--accent-mid)]">
          Pricing opportunity
        </h2>
      </header>

      <div className="ent-hero-body mt-6 grid items-end gap-8 lg:grid-cols-2">
        <div className="ent-hero-focal min-w-0">
          <p className="ent-hero-metric-eyebrow m-0 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Margin opportunity
          </p>
          {marginDisplay ? (
            <p
              className="ent-hero-range m-0 mt-1 text-5xl font-semibold leading-none tracking-tight text-[var(--accent-deep)] sm:text-6xl lg:text-7xl"
              aria-label="Margin opportunity range"
            >
              {marginDisplay}
            </p>
          ) : (
            <p className="ent-hero-range m-0 mt-1 text-4xl font-semibold text-[var(--accent-deep)]">
              {exec.marginOpportunitySummary}
            </p>
          )}
          <p className="ent-hero-unit mt-2 text-sm font-medium text-[var(--text-muted)]">
            Indicative margin opportunity (directional)
          </p>

          {showRevenue && (
            <div className="ent-hero-revenue mt-6 border-t border-[var(--border)]/80 pt-5">
              <p className="ent-hero-metric-eyebrow m-0 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Potential revenue impact
              </p>
              {interpretation.revenueImpactLabel && (
                <p className="ent-hero-revenue-label m-0 mt-1 text-xl font-semibold leading-snug text-[var(--text-navy)] sm:text-2xl">
                  {interpretation.revenueImpactLabel}
                </p>
              )}
              {interpretation.revenueImpactRange && (
                <p className="ent-hero-revenue-range m-0 mt-1 text-sm font-medium text-[var(--accent-mid)]">
                  {interpretation.revenueImpactRange}
                </p>
              )}
              <p className="ent-hero-revenue-note m-0 mt-1.5 text-xs text-[var(--text-muted)]">
                Directional sales sensitivity — not a volume forecast
              </p>
            </div>
          )}
        </div>

        <div className="ent-hero-visual flex min-w-0 flex-col gap-6 pb-1">
          {lowPct != null && highPct != null && (
            <div>
              <p className="ent-hero-scale-eyebrow m-0 mb-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Margin range
              </p>
              <OpportunityRangeVisual
                lowPct={lowPct}
                highPct={highPct}
                confidenceLabel={confidenceLabel}
                className="ent-range-hero"
              />
            </div>
          )}
          {revenueBounds && (
            <div>
              <p className="ent-hero-scale-eyebrow m-0 mb-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Revenue sensitivity
              </p>
              <OpportunityRangeVisual
                lowPct={revenueBounds.low}
                highPct={revenueBounds.high}
                signed
                maxScalePct={1}
                midLabel={interpretation.revenueImpactRange ?? undefined}
                className="ent-range-hero ent-range-hero-revenue"
              />
            </div>
          )}
        </div>
      </div>

      {interpretationRows.length > 0 && (
        <dl className="ent-hero-interpretation m-0 mt-7 grid gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
          {interpretationRows.map((row) => (
            <div key={row.label}>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                {row.label}
              </dt>
              <dd className="mt-1 text-sm font-medium leading-snug text-[var(--text-navy)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
