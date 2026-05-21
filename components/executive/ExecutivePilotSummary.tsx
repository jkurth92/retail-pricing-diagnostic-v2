"use client";

import type { ReactNode } from "react";
import { Disclosure } from "@/components/Disclosure";
import { CategoryContributionChart } from "@/components/executive/CategoryContributionChart";
import { InsightSourceTile } from "@/components/executive/InsightSourceTile";
import { OverallOpportunityHero } from "@/components/executive/OverallOpportunityHero";
import { StrategicDriverCard } from "@/components/executive/StrategicDriverCard";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  buildInsightSourceTiles,
  buildStrategicDriverCards,
} from "@/lib/narrativePresentation";
import { parseMarginRangeDisplay, polishEvidenceMetrics } from "@/lib/executiveOutputPolish";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

type ExecutivePilotSummaryProps = {
  exec: ExecutiveSummary;
  implications: string[];
  opportunityExposure?: OpportunityExposureBundle | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  /** Section 4 — hypotheses, patterns, technical panels */
  technicalDiagnosticsSlot?: ReactNode;
};

export function ExecutivePilotSummary({
  exec,
  implications,
  opportunityExposure,
  computedEvidence,
  technicalDiagnosticsSlot,
}: ExecutivePilotSummaryProps) {
  const margin = parseMarginRangeDisplay(exec.marginOpportunitySummary);
  const exposure = opportunityExposure ?? exec.opportunityExposure ?? null;
  const drivers = buildStrategicDriverCards(exec, 4);
  const insights = buildInsightSourceTiles(exec, exposure, computedEvidence, 8);
  const metrics = polishEvidenceMetrics(exec.supportingEvidenceMetrics, 6);

  const lowPct = margin ? parseFloat(margin.low) : null;
  const highPct = margin ? parseFloat(margin.high) : null;

  return (
    <div className="dx-flow">
      {/* §1 Overall opportunity */}
      <section className="dx-flow-section dx-flow-section-hero" aria-labelledby="dx-s1">
        <OverallOpportunityHero
          exec={exec}
          marginDisplay={margin?.display ?? null}
          lowPct={lowPct}
          highPct={highPct}
          exposure={exposure}
        />
      </section>

      {/* §2 Drivers */}
      {drivers.length > 0 && (
        <section className="dx-flow-section" aria-labelledby="dx-s2">
          <header className="dx-flow-header">
            <p className="dx-flow-step-label" id="dx-s2">
              2 · Drivers of opportunity
            </p>
            <h3 className="dx-flow-question">Why does the engine believe it exists?</h3>
          </header>
          <div className="dx-driver-grid">
            {drivers.map((d) => (
              <StrategicDriverCard key={d.id} driver={d} />
            ))}
          </div>
        </section>
      )}

      {/* §3 Sources of insight */}
      {(insights.length > 0 || exposure?.categoryExposures.length) && (
        <section className="dx-flow-section dx-flow-section-insight" aria-labelledby="dx-s3">
          <header className="dx-flow-header">
            <p className="dx-flow-step-label" id="dx-s3">
              3 · Sources of insight
            </p>
            <h3 className="dx-flow-question">What evidence supports it?</h3>
          </header>

          {exposure && exposure.categoryExposures.length > 0 && (
            <div className="dx-insight-contrib">
              <CategoryContributionChart categories={exposure.categoryExposures} />
            </div>
          )}

          {insights.length > 0 && (
            <div className="dx-insight-grid">
              {insights.map((t) => (
                <InsightSourceTile key={t.id} tile={t} />
              ))}
            </div>
          )}

          {implications.length > 0 && (
            <ul className="dx-insight-takeaways">
              {implications.slice(0, 2).map((imp) => (
                <li key={imp}>{imp}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* §4 Technical diagnostics */}
      <section className="dx-flow-section dx-flow-section-technical" aria-labelledby="dx-s4">
        <header className="dx-flow-header">
          <p className="dx-flow-step-label" id="dx-s4">
            4 · Technical diagnostics
          </p>
          <h3 className="dx-flow-question">How grounded is the conclusion?</h3>
        </header>

        <Disclosure
          title="Calculation & confidence"
          summary="Trace, weighting, benchmark context"
          variant="subtle"
          defaultOpen={false}
          className="dx-tech-panel"
        >
          {exec.marginOpportunityTotalTrace ? (
            <OpportunityCalculationTracePanel
              trace={exec.marginOpportunityTotalTrace}
              mode="executive"
            />
          ) : (
            <p className="dx-tech-muted">{exec.confidenceSummary}</p>
          )}
        </Disclosure>

        {(technicalDiagnosticsSlot || metrics.length > 0) && (
          <Disclosure
            title="Hypotheses, patterns & mechanics"
            summary="Consultant-facing diagnostic detail"
            variant="subtle"
            defaultOpen={false}
            className="dx-tech-panel"
          >
            <div className="dx-tech-inner">{technicalDiagnosticsSlot}</div>
          </Disclosure>
        )}
      </section>
    </div>
  );
}
