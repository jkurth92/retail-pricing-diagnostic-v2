"use client";

import { Disclosure } from "@/components/Disclosure";
import { CategoryContributionChart } from "@/components/executive/CategoryContributionChart";
import { EvidenceMetricTiles } from "@/components/executive/EvidenceMetricTiles";
import { ExecutiveThemeInsightCard } from "@/components/executive/ExecutiveThemeInsightCard";
import { OpportunityRangeVisual } from "@/components/executive/OpportunityRangeVisual";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  confidenceLabelFromTrace,
  shortenThemeTitle,
} from "@/lib/executiveUxHelpers";
import {
  parseMarginRangeDisplay,
  polishEvidenceMetrics,
  polishEvidenceThemes,
} from "@/lib/executiveOutputPolish";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

type ExecutivePilotSummaryProps = {
  exec: ExecutiveSummary;
  implications: string[];
  opportunityExposure?: OpportunityExposureBundle | null;
};

export function ExecutivePilotSummary({
  exec,
  implications,
  opportunityExposure,
}: ExecutivePilotSummaryProps) {
  const margin = parseMarginRangeDisplay(exec.marginOpportunitySummary);
  const themes = polishEvidenceThemes(exec.evidenceBackedThemes, 4);
  const metrics = polishEvidenceMetrics(exec.supportingEvidenceMetrics, 6);
  const topThemes = exec.topThemes.slice(0, 4);
  const exposure = opportunityExposure ?? exec.opportunityExposure ?? null;

  const confidenceLabel =
    exec.marginOpportunityTotalTrace
      ? confidenceLabelFromTrace(
          exec.marginOpportunityTotalTrace.formulaSummary,
          exec.marginOpportunityTotalTrace.finalRange.lowPct,
          exec.marginOpportunityTotalTrace.finalRange.highPct,
        )
      : undefined;

  return (
    <div className="dx-dashboard">
      {/* Hero opportunity tile */}
      <section className="dx-tile dx-tile-hero" aria-labelledby="dx-opportunity-heading">
        <p id="dx-opportunity-heading" className="dx-tile-eyebrow">
          Potential pricing opportunity
        </p>
        {margin ? (
          <>
            <div className="dx-hero-range-row">
              <p className="dx-hero-range-value" aria-label="Margin opportunity range">
                {margin.display}
              </p>
              <span className="dx-hero-range-unit">margin improvement</span>
            </div>
            <OpportunityRangeVisual
              lowPct={parseFloat(margin.low)}
              highPct={parseFloat(margin.high)}
              confidenceLabel={confidenceLabel}
            />
          </>
        ) : (
          <p className="dx-hero-range-value">{exec.marginOpportunitySummary}</p>
        )}
        {exec.opportunityHeadline && (
          <p className="dx-hero-subline">{exec.opportunityHeadline}</p>
        )}
      </section>

      {/* Primary drivers */}
      {exec.primaryDrivers.length > 0 && (
        <section className="dx-tile dx-tile-drivers">
          <h3 className="dx-section-label">Primary drivers</h3>
          <ul className="dx-driver-pills">
            {exec.primaryDrivers.map((d) => (
              <li key={d} className="dx-driver-pill">
                {shortenThemeTitle(d)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="dx-grid-two">
        {/* Structural themes */}
        {(topThemes.length > 0 || themes.length > 0) && (
          <section className="dx-tile dx-tile-themes">
            <h3 className="dx-section-label">Structural themes</h3>
            <div className="dx-theme-stack">
              {topThemes.length > 0
                ? topThemes.map((t) => (
                    <ExecutiveThemeInsightCard key={t.id} theme={t} />
                  ))
                : themes.map((t) => (
                    <ExecutiveThemeInsightCard key={t.headline} evidenceLine={t} />
                  ))}
            </div>
          </section>
        )}

        {/* Evidence + category contribution */}
        <div className="dx-stack-secondary">
          {exposure && exposure.categoryExposures.length > 0 && (
            <section className="dx-tile dx-tile-contrib">
              <CategoryContributionChart categories={exposure.categoryExposures} />
            </section>
          )}

          {metrics.length > 0 && (
            <section className="dx-tile dx-tile-evidence">
              <h3 className="dx-section-label">Supporting evidence</h3>
              <EvidenceMetricTiles metrics={metrics} />
            </section>
          )}
        </div>
      </div>

      {/* Implications callouts */}
      {implications.length > 0 && (
        <section className="dx-tile dx-tile-implications">
          <h3 className="dx-section-label">What this means</h3>
          <ul className="dx-implication-callouts">
            {implications.map((imp) => (
              <li key={imp}>{imp}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Consultant detail — traces, benchmark, narrative */}
      <Disclosure
        title="Consultant detail"
        summary="Calculation trace · benchmark context · confidence · technical diagnostics"
        variant="subtle"
        defaultOpen={false}
        className="dx-consultant-drawer"
      >
        <div className="dx-consultant-inner">
          {exec.marginOpportunityTotalTrace && (
            <OpportunityCalculationTracePanel
              trace={exec.marginOpportunityTotalTrace}
              mode="consultant"
            />
          )}
          <div className="dx-consultant-meta">
            <p className="dx-consultant-line">{exec.confidenceSummary}</p>
            {exec.maturitySummary && (
              <p className="dx-consultant-line dx-consultant-muted">{exec.maturitySummary}</p>
            )}
          </div>
        </div>
      </Disclosure>
    </div>
  );
}
