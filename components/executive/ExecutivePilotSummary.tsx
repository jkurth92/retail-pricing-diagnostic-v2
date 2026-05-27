"use client";

import type { ReactNode } from "react";
import { Disclosure } from "@/components/Disclosure";
import { ExecutiveConsultingSummary } from "@/components/executive/ExecutiveConsultingSummary";
import { InsightSourceTile } from "@/components/executive/InsightSourceTile";
import { OpportunityLeverBreakdown } from "@/components/executive/OpportunityLeverBreakdown";
import { OverallOpportunityHero } from "@/components/executive/OverallOpportunityHero";
import { RefinementStatusBanner } from "@/components/refinement/RefinementStatusBanner";
import { buildOpportunityDriverSynthesis } from "@/lib/opportunityDriverSynthesis";
import type { RefinedDiagnosticPresentation } from "@/lib/refinementAdjustments";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  buildExecutiveConsultingSummary,
  buildInsightSourceTiles,
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
  /** User refinement preview / applied presentation */
  refinementPresentation?: RefinedDiagnosticPresentation | null;
};

export function ExecutivePilotSummary({
  exec,
  opportunityExposure,
  computedEvidence,
  technicalDiagnosticsSlot,
  evaluatedRevenuePercent,
  refinementPresentation,
}: ExecutivePilotSummaryProps) {
  const margin = parseMarginRangeDisplay(exec.marginOpportunitySummary);
  const exposure = opportunityExposure ?? exec.opportunityExposure ?? null;
  const insights = buildInsightSourceTiles(exec, exposure, computedEvidence, 6);
  const opportunityDrivers =
    refinementPresentation?.driverSynthesis.drivers ??
    buildOpportunityDriverSynthesis({
      exec,
      exposure,
      themes: exec.topThemes,
      evidence: computedEvidence,
      promoMarkdownEligible: computedEvidence?.promoMarkdownEligible ?? false,
      opportunityRange: margin?.display ?? exec.marginOpportunitySummary ?? null,
    }).drivers;

  const consultingSummary = buildExecutiveConsultingSummary(
    exec,
    exec.strategicImplications,
    exposure,
    evaluatedRevenuePercent,
  );

  const lowPct = margin ? parseFloat(margin.low) : null;
  const highPct = margin ? parseFloat(margin.high) : null;

  const hasStructuralEvidence = insights.length > 0;

  return (
    <div className="ent-compose flex w-full flex-col gap-5">
      {refinementPresentation?.meta.isUserRefined && (
        <RefinementStatusBanner meta={refinementPresentation.meta} />
      )}
      <div className="ent-row ent-row-hero w-full">
        <OverallOpportunityHero
          exec={exec}
          marginDisplay={margin?.display ?? null}
          lowPct={lowPct}
          highPct={highPct}
          exposure={exposure}
          evaluatedRevenuePercent={evaluatedRevenuePercent}
        />
        {opportunityDrivers.length > 0 && (
          <OpportunityLeverBreakdown drivers={opportunityDrivers} />
        )}
      </div>

      {hasStructuralEvidence && (
        <section className="ent-row ent-row-evidence w-full">
          <div className="ent-panel ent-panel-evidence h-full rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="ent-section-title mb-1 text-sm font-semibold text-[var(--text-navy)]">
              Supporting evidence
            </h2>
            <p className="mb-5 text-xs leading-relaxed text-[var(--text-muted)]">
              Strongest structural signals from the review — indicative context, not
              list-price recommendations.
            </p>

            {insights.length > 0 && (
              <div className="ent-evidence-grid">
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
