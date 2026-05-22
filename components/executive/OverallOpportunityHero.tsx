"use client";

import { OpportunityRangeVisual } from "@/components/executive/OpportunityRangeVisual";
import { confidenceLabelFromTrace } from "@/lib/executiveUxHelpers";
import { heroContextChips } from "@/lib/narrativePresentation";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

type OverallOpportunityHeroProps = {
  exec: ExecutiveSummary;
  marginDisplay: string | null;
  lowPct: number | null;
  highPct: number | null;
  exposure?: OpportunityExposureBundle | null;
};

export function OverallOpportunityHero({
  exec,
  marginDisplay,
  lowPct,
  highPct,
  exposure,
}: OverallOpportunityHeroProps) {
  const chips = heroContextChips(exec, exposure);
  const confidenceLabel =
    lowPct != null && highPct != null
      ? confidenceLabelFromTrace(
          exec.marginOpportunityTotalTrace?.formulaSummary,
          lowPct,
          highPct,
        )
      : undefined;

  return (
    <article className="ent-hero-card relative w-full overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--accent-deep)_14%,var(--border))] bg-gradient-to-br from-white to-[var(--accent-light)] p-8 shadow-[0_20px_50px_rgba(26,53,104,0.08)]">
      <header>
        <h2 className="ent-hero-label m-0 text-xs font-semibold uppercase tracking-wider text-[var(--accent-mid)]">
          Potential pricing opportunity
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
            Indicative margin uplift
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

      <footer className="ent-hero-meta mt-7 border-t border-[var(--border)] pt-5">
        <ul className="ent-hero-chips m-0 flex list-none flex-wrap gap-2 p-0">
          {chips.map((c) => (
            <li
              key={c.label}
              className={
                c.tone === "primary"
                  ? "ent-chip ent-chip-primary rounded-full border px-3 py-1.5 text-xs font-semibold"
                  : "ent-chip rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-navy)]"
              }
            >
              {c.label}
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
