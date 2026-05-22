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
    <div className="ent-compose flex w-full flex-col gap-5">
      <div className="ent-row ent-row-hero w-full">
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
          className={`ent-row ent-row-split grid w-full gap-5 ${
            (exposure?.categoryExposures.length ?? 0) > 0
              ? "lg:grid-cols-[1.55fr_1fr]"
              : ""
          }`}
        >
          {drivers.length > 0 && (
            <section className="ent-panel ent-panel-drivers h-full rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="ent-section-title mb-4 text-sm font-semibold text-[var(--text-navy)]">
                Key structural drivers
              </h2>
              <div className="ent-driver-grid grid gap-3 sm:grid-cols-2">
                {drivers.map((d) => (
                  <StrategicDriverCard key={d.id} driver={d} />
                ))}
              </div>
            </section>
          )}

          {exposure && exposure.categoryExposures.length > 0 && (
            <aside className="ent-panel ent-panel-exposure h-full rounded-2xl border bg-[color-mix(in_srgb,var(--accent-light)_35%,white)] p-6 shadow-sm">
              <h2 className="ent-section-title mb-4 text-sm font-semibold text-[var(--text-navy)]">
                Category exposure
              </h2>
              <CategoryContributionChart categories={exposure.categoryExposures} />
            </aside>
          )}
        </div>
      )}

      {(insights.length > 0 || implications.length > 0) && (
        <div className="ent-row ent-row-split grid w-full gap-5 lg:grid-cols-2">
          {insights.length > 0 && (
            <section className="ent-panel ent-panel-evidence h-full rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="ent-section-title mb-4 text-sm font-semibold text-[var(--text-navy)]">
                Supporting evidence
              </h2>
              <div className="ent-evidence-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {insights.map((t) => (
                  <InsightSourceTile key={t.id} tile={t} />
                ))}
              </div>
            </section>
          )}

          {implications.length > 0 && (
            <section className="ent-panel ent-panel-implications h-full rounded-2xl border bg-gradient-to-b from-[var(--accent-light)]/30 to-white p-6 shadow-sm">
              <h2 className="ent-section-title mb-4 text-sm font-semibold text-[var(--text-navy)]">
                Strategic implications
              </h2>
              <StrategicImplicationCallouts implications={implications} />
            </section>
          )}
        </div>
      )}

      <div className="ent-row ent-row-consultant mt-2 w-full">
        <Disclosure
          title="Consultant detail"
          summary="Calculation trace · hypotheses · technical diagnostics"
          variant="subtle"
          defaultOpen={false}
          className="ent-consultant-disclosure rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]"
        >
          <div className="ent-consultant-body flex flex-col gap-4">
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
