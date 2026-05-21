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
    <div className="dx-hero-grid">
      <div className="dx-hero-left">
        <p className="dx-flow-step-label">1 · Overall opportunity</p>
        <p className="dx-hero-question">What is the opportunity?</p>
        {marginDisplay ? (
          <>
            <p className="dx-hero-range-xl" aria-label="Margin opportunity range">
              {marginDisplay}
            </p>
            <p className="dx-hero-range-caption">Indicative margin improvement</p>
          </>
        ) : (
          <p className="dx-hero-range-xl">{exec.marginOpportunitySummary}</p>
        )}
      </div>

      <div className="dx-hero-center">
        {lowPct != null && highPct != null ? (
          <OpportunityRangeVisual
            lowPct={lowPct}
            highPct={highPct}
            confidenceLabel={confidenceLabel}
          />
        ) : null}
      </div>

      <div className="dx-hero-right">
        <ul className="dx-hero-chips">
          {chips.map((c) => (
            <li
              key={c.label}
              className={
                c.tone === "primary" ? "dx-hero-chip dx-hero-chip-primary" : "dx-hero-chip"
              }
            >
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
