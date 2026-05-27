"use client";

import type { ReactNode } from "react";
import { Disclosure } from "@/components/Disclosure";
import { ExecutiveConsultingSummary } from "@/components/executive/ExecutiveConsultingSummary";
import { InsightSourceTile } from "@/components/executive/InsightSourceTile";
import { OpportunityLeverBreakdown } from "@/components/executive/OpportunityLeverBreakdown";
import { OverallOpportunityHero } from "@/components/executive/OverallOpportunityHero";
import { buildOpportunityAreaBreakdown } from "@/lib/opportunityLeverAttribution";
import { StrategicDriverCard } from "@/components/executive/StrategicDriverCard";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  buildExecutiveConsultingSummary,
  buildInsightSourceTiles,
  buildStrategicDriverCards,
} from "@/lib/narrativePresentation";
import { parseMarginRangeDisplay } from "@/lib/executiveOutputPolish";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

type ExecutivePilotSummaryProps = {
  exec: ExecutiveSummary;
  opportunityExposure?: OpportunityExposureBundle | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  technicalDiagnosticsSlot?: ReactNode;
  /** Addressable % of total revenue in diagnostic scope */
  evaluatedRevenuePercent?: number | null;
};

export function ExecutivePilotSummary({
  exec,
  opportunityExposure,
  computedEvidence,
  technicalDiagnosticsSlot,
  evaluatedRevenuePercent,
}: ExecutivePilotSummaryProps) {
  const margin = parseMarginRangeDisplay(exec.marginOpportunitySummary);
  const exposure = opportunityExposure ?? exec.opportunityExposure ?? null;
  const drivers = buildStrategicDriverCards(exec, 4);
  const insights = buildInsightSourceTiles(exec, exposure, computedEvidence, 6);
  const opportunityAreas = buildOpportunityAreaBreakdown(
    exec,
    exposure,
    exec.topThemes,
    exec.primaryDrivers,
    computedEvidence,
    computedEvidence?.promoMarkdownEligible ?? false,
  );

  const consultingSummary = buildExecutiveConsultingSummary(
    exec,
    exec.strategicImplications,
    exposure,
    evaluatedRevenuePercent,
  );

  const lowPct = margin ? parseFloat(margin.low) : null;
  const highPct = margin ? parseFloat(margin.high) : null;

  const hasStructuralEvidence = drivers.length > 0 || insights.length > 0;

  return (
    <div className="ent-compose flex w-full flex-col gap-5">
      <div className="ent-row ent-row-hero w-full">
        <OverallOpportunityHero
          exec={exec}
          marginDisplay={margin?.display ?? null}
          lowPct={lowPct}
          highPct={highPct}
          exposure={exposure}
          evaluatedRevenuePercent={evaluatedRevenuePercent}
        />
        {opportunityAreas.length > 0 && (
          <OpportunityLeverBreakdown rows={opportunityAreas} />
        )}
      </div>

      {hasStructuralEvidence && (
        <section className="ent-row ent-row-evidence w-full">
          <div className="ent-panel ent-panel-evidence h-full rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="ent-section-title mb-1 text-sm font-semibold text-[var(--text-navy)]">
              Supporting evidence
            </h2>
            <p className="mb-5 text-xs leading-relaxed text-[var(--text-muted)]">
              Strongest commercial signals from the review — directional, not price
              prescriptions.
            </p>

            {drivers.length > 0 && (
              <div className="ent-driver-grid mb-6 grid gap-3 sm:grid-cols-2">
                {drivers.map((d) => (
                  <StrategicDriverCard key={d.id} driver={d} />
                ))}
              </div>
            )}

            {insights.length > 0 && (
              <div className="ent-evidence-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {insights.map((t) => (
                  <InsightSourceTile key={t.id} tile={t} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {(consultingSummary.paragraphs.length > 0 ||
        consultingSummary.nextSteps.length > 0) && (
        <section className="ent-row ent-row-summary w-full">
          <div className="ent-panel ent-panel-summary h-full rounded-2xl border bg-gradient-to-b from-[var(--accent-light)]/25 to-white p-6 shadow-sm">
            <h2 className="ent-section-title mb-1 text-sm font-semibold text-[var(--text-navy)]">
              Executive summary
            </h2>
            <p className="mb-5 text-xs leading-relaxed text-[var(--text-muted)]">
              Concise strategic synthesis for client discussion — opportunity framing,
              structural interpretation, and discussion prompts.
            </p>
            <ExecutiveConsultingSummary summary={consultingSummary} />
          </div>
        </section>
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
