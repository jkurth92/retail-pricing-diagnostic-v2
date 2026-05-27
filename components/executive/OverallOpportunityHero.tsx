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
    { label: "Opportunity concentration", value: interpretation.concentration },
    { label: "Evidence support", value: interpretation.confidence },
    { label: "Primary issue", value: interpretation.primaryIssue },
  ].filter((r) => r.value);

  return (
    <article className="ent-hero-card relative w-full overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-deep)_14%,var(--border))] bg-gradient-to-br from-white to-[var(--accent-light)] p-8 shadow-[0_20px_50px_rgba(26,53,104,0.08)]">
      <header>
        <h2 className="ent-hero-label m-0 text-xs font-semibold uppercase tracking-wider text-[var(--accent-mid)]">
          Pricing opportunity
        </h2>
      </header>

      <div className="ent-hero-body mt-6 grid items-end gap-8 lg:grid-cols-2">
        <div className="ent-hero-focal min-w-0">
          {marginDisplay ? (
            <p
              className="ent-hero-range m-0 text-5xl font-semibold leading-none tracking-tight text-[var(--accent-deep)] sm:text-6xl lg:text-7xl"
              aria-label="Margin opportunity range"
            >
              {marginDisplay}
            </p>
          ) : (
            <p className="ent-hero-range m-0 text-4xl font-semibold text-[var(--accent-deep)]">
              {exec.marginOpportunitySummary}
            </p>
          )}
          <p className="ent-hero-unit mt-2 text-sm font-medium text-[var(--text-muted)]">
            Indicative margin opportunity (directional)
          </p>
        </div>

        <div className="ent-hero-visual min-w-0 pb-1">
          {lowPct != null && highPct != null && (
            <OpportunityRangeVisual
              lowPct={lowPct}
              highPct={highPct}
              confidenceLabel={confidenceLabel}
              className="ent-range-hero"
            />
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
