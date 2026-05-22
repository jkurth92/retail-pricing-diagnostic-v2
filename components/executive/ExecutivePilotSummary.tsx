"use client";

import type { ReactNode } from "react";
import { Disclosure } from "@/components/Disclosure";
import { CategoryContributionChart } from "@/components/executive/CategoryContributionChart";
import { InsightSourceTile } from "@/components/executive/InsightSourceTile";
import { OverallOpportunityHero } from "@/components/executive/OverallOpportunityHero";
import { StrategicDriverCard } from "@/components/executive/StrategicDriverCard";
import { StrategicImplicationCallouts } from "@/components/executive/StrategicImplicationCallouts";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  buildInsightSourceTiles,
  buildStrategicDriverCards,
} from "@/lib/narrativePresentation";
import { parseMarginRangeDisplay } from "@/lib/executiveOutputPolish";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

type ExecutivePilotSummaryProps = {
  exec: ExecutiveSummary;
  implications: string[];
  opportunityExposure?: OpportunityExposureBundle | null;
  computedEvidence?: ComputedEvidenceBundle | null;
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
  const insights = buildInsightSourceTiles(exec, exposure, computedEvidence, 6);

  const lowPct = margin ? parseFloat(margin.low) : null;
  const highPct = margin ? parseFloat(margin.high) : null;

  return (
    <div className="ent-compose">
      <div className="ent-row ent-row-hero">
        <OverallOpportunityHero
          exec={exec}
          marginDisplay={margin?.display ?? null}
          lowPct={lowPct}
          highPct={highPct}
          exposure={exposure}
        />
      </div>

      {(drivers.length > 0 || (exposure?.categoryExposures.length ?? 0) > 0) && (
        <div
          className={`ent-row ent-row-split ${(exposure?.categoryExposures.length ?? 0) > 0 ? "ent-row-split-64" : ""}`}
        >
          {drivers.length > 0 && (
            <section className="ent-panel ent-panel-drivers">
              <h2 className="ent-section-title">Key structural drivers</h2>
              <div className="ent-driver-grid">
                {drivers.map((d) => (
                  <StrategicDriverCard key={d.id} driver={d} />
                ))}
              </div>
            </section>
          )}

          {exposure && exposure.categoryExposures.length > 0 && (
            <aside className="ent-panel ent-panel-exposure">
              <h2 className="ent-section-title">Category exposure</h2>
              <CategoryContributionChart
                categories={exposure.categoryExposures}
                embedded
              />
            </aside>
          )}
        </div>
      )}

      {(insights.length > 0 || implications.length > 0) && (
        <div className="ent-row ent-row-split ent-row-split-50">
          {insights.length > 0 && (
            <section className="ent-panel ent-panel-evidence">
              <h2 className="ent-section-title">Supporting evidence</h2>
              <div className="ent-evidence-grid">
                {insights.map((t) => (
                  <InsightSourceTile key={t.id} tile={t} />
                ))}
              </div>
            </section>
          )}

          {implications.length > 0 && (
            <section className="ent-panel ent-panel-implications">
              <h2 className="ent-section-title">Strategic implications</h2>
              <StrategicImplicationCallouts implications={implications} />
            </section>
          )}
        </div>
      )}

      <div className="ent-row ent-row-consultant">
        <Disclosure
          title="Consultant detail"
          summary="Calculation trace · hypotheses · technical diagnostics"
          variant="subtle"
          defaultOpen={false}
          className="ent-consultant-disclosure"
        >
          <div className="ent-consultant-body">
            {exec.marginOpportunityTotalTrace && (
              <OpportunityCalculationTracePanel
                trace={exec.marginOpportunityTotalTrace}
                mode="executive"
              />
            )}
            {technicalDiagnosticsSlot}
          </div>
        </Disclosure>
      </div>
    </div>
  );
}
