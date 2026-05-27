import { MEMO_FOOTER_NOTE, MEMO_TITLE_PREFIX } from "@/data/export/memoTemplates";
import {
  composeDiscussionQuestions,
  composeImplicationsSection,
  composePricingObservationsSection,
  composeRetailerContextSection,
  type ExecutiveMemoComposeInput,
} from "@/lib/export/executiveMemoComposer";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { FinancePeer } from "@/types/finance-peers";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { ExecutiveMemo } from "@/types/executive-memo";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

export type BuildExecutiveMemoOptions = {
  enrichment?: RetailerEnrichmentBundle | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: OpportunityExposureBundle | null;
  financePeers?: FinancePeer[];
  evaluatedRevenuePercent?: number | null;
};

export function buildExecutiveMemo(
  readout: DiagnosticReadout,
  retailerName: string,
  options: BuildExecutiveMemoOptions = {},
): ExecutiveMemo {
  const composeInput: ExecutiveMemoComposeInput = {
    readout,
    retailerName,
    enrichment: options.enrichment,
    computedEvidence: options.computedEvidence,
    opportunityExposure:
      options.opportunityExposure ?? readout.executiveSummary.opportunityExposure,
    financePeers: options.financePeers,
    evaluatedRevenuePercent: options.evaluatedRevenuePercent,
  };

  const retailerContext = composeRetailerContextSection(composeInput);
  const pricingObservations = composePricingObservationsSection(composeInput);
  const implications = composeImplicationsSection(composeInput);
  const discussionQuestions = composeDiscussionQuestions(composeInput);

  const executiveAnswer = [
    retailerContext,
    "",
    pricingObservations,
    "",
    implications,
  ].join("\n");

  return {
    title: `${MEMO_TITLE_PREFIX} — ${retailerName || "Client"}`,
    retailerContext,
    pricingObservations,
    implications,
    discussionQuestions,
    notes: [MEMO_FOOTER_NOTE, readout.guardrailMessage],
    executiveAnswer,
    opportunityBreakdown: {
      totalRange: readout.opportunityDetail.totalMarginOpportunityRange,
      byLever: [],
      synthesis: implications.split("\n\n")[0] ?? "",
    },
    structuralThemes: pricingObservations
      .split("\n")
      .filter((l) => l.startsWith("•"))
      .map((l) => l.replace(/^•\s*/, "")),
    leadershipFocusAreas: discussionQuestions,
    supportingNarrative: retailerContext.split("\n\n")[0] ?? "",
  };
}
