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
    <article className="ent-hero-card">
      <header className="ent-hero-card-head">
        <h2 className="ent-hero-label">Potential pricing opportunity</h2>
      </header>

      <div className="ent-hero-body">
        <div className="ent-hero-focal">
          {marginDisplay ? (
            <p className="ent-hero-range" aria-label="Margin opportunity range">
              {marginDisplay}
            </p>
          ) : (
            <p className="ent-hero-range">{exec.marginOpportunitySummary}</p>
          )}
          <p className="ent-hero-unit">Indicative margin uplift</p>
        </div>

        <div className="ent-hero-visual">
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

      <footer className="ent-hero-meta">
        <ul className="ent-hero-chips">
          {chips.map((c) => (
            <li
              key={c.label}
              className={c.tone === "primary" ? "ent-chip ent-chip-primary" : "ent-chip"}
            >
              {c.label}
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
