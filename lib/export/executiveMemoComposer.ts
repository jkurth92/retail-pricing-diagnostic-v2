/**
 * McKinsey-style executive memo composition — presentation only.
 */

import { buildTrajectoryRows } from "@/lib/financeBenchmark";
import { buildContextKpis } from "@/lib/retailerContextDisplay";
import { translateExecutivePhrase } from "@/lib/executiveBusinessLanguage";
import { translateConsultantInsight } from "@/lib/insightTranslation";
import {
  buildOpportunityDriverSynthesis,
  formatOpportunityDriversMemo,
} from "@/lib/opportunityDriverSynthesis";
import { buildExecutiveConsultingSummary } from "@/lib/narrativePresentation";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { FinancePeer } from "@/types/finance-peers";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

export type ExecutiveMemoComposeInput = {
  readout: DiagnosticReadout;
  retailerName: string;
  enrichment?: RetailerEnrichmentBundle | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: OpportunityExposureBundle | null;
  financePeers?: FinancePeer[];
  evaluatedRevenuePercent?: number | null;
};

function momentumPhrase(
  momentum: "ahead" | "behind" | "inline",
): string {
  if (momentum === "ahead") return "ahead of the selected peer set";
  if (momentum === "behind") return "behind the selected peer set";
  return "in line with the selected peer set";
}

export function composeRetailerContextSection(
  input: ExecutiveMemoComposeInput,
): string {
  const lines: string[] = [];
  const { enrichment, retailerName, financePeers = [] } = input;
  const profile = enrichment?.companyProfile;
  const ctx = enrichment?.context;

  lines.push(
    translateConsultantInsight(
      `${retailerName} operates as a ${input.readout.executiveSummary.retailerProfile.archetype.toLowerCase()} retailer with a ${input.readout.executiveSummary.retailerProfile.posture.toLowerCase()} pricing posture — the commercial question is how coherently price tiers, value roles, and private-brand positioning work together.`,
    ),
  );

  const kpis = enrichment ? buildContextKpis(enrichment) : [];
  if (kpis.length > 0) {
    const kpiLine = kpis
      .slice(0, 5)
      .map((k) => `${k.label}: ${k.value}`)
      .join("; ");
    lines.push(
      `The retailer’s reported scale and profitability profile: ${kpiLine}.`,
    );
  } else if (ctx?.revenue) {
    lines.push(`Revenue context: ${ctx.revenue}.`);
  }

  if (ctx?.companyOverview?.trim()) {
    lines.push(translateExecutivePhrase(ctx.companyOverview.trim().slice(0, 280)));
  }

  const trajectoryRows = buildTrajectoryRows(profile ?? null, financePeers);
  const contributing = financePeers.filter((p) => p.included).length;
  if (trajectoryRows.length > 0 && contributing > 0) {
    lines.push(
      `Relative to ${contributing} selected peer${contributing === 1 ? "" : "s"}:`,
    );
    for (const row of trajectoryRows.slice(0, 4)) {
      lines.push(
        `• ${row.metricLabel}: ${row.companyDisplay} (${momentumPhrase(row.momentumVsPeer)}; peer median ${row.peerMedianDisplay.replace(/^peer median /i, "")}).`,
      );
    }
  } else if (profile) {
    lines.push(
      "Peer comparison is available once finance peers are selected in retailer context.",
    );
  }

  const news = enrichment?.news?.slice(0, 2) ?? [];
  if (news.length > 0) {
    lines.push(
      `Recent context: ${news.map((n) => n.headline).join("; ")}.`,
    );
  }

  return lines.join("\n\n");
}

function buildMemoDriverSynthesis(input: ExecutiveMemoComposeInput) {
  const { readout, computedEvidence, opportunityExposure } = input;
  return buildOpportunityDriverSynthesis({
    exec: readout.executiveSummary,
    exposure: opportunityExposure ?? readout.executiveSummary.opportunityExposure,
    themes: readout.executiveSummary.topThemes,
    evidence: computedEvidence,
    promoMarkdownEligible: computedEvidence?.promoMarkdownEligible ?? false,
    opportunityRange: readout.opportunityDetail.totalMarginOpportunityRange || null,
  });
}

export function composePricingObservationsSection(
  input: ExecutiveMemoComposeInput,
): string {
  const synthesis = buildMemoDriverSynthesis(input);
  const range = input.readout.opportunityDetail.totalMarginOpportunityRange?.trim();
  const sizingNote = range
    ? `Indicative margin opportunity in reviewed scope: ${range} — for discussion, not a forecast.\n\n`
    : "";

  return sizingNote + formatOpportunityDriversMemo(synthesis);
}

export function composeImplicationsSection(
  input: ExecutiveMemoComposeInput,
): string {
  const synthesis = buildMemoDriverSynthesis(input);
  return [synthesis.conclusion, synthesis.marginLine].join("\n\n");
}

export function composeDiscussionQuestions(
  input: ExecutiveMemoComposeInput,
): string[] {
  const { readout } = input;
  const consulting = buildExecutiveConsultingSummary(
    readout.executiveSummary,
    readout.strategicImplications,
    input.opportunityExposure ?? readout.executiveSummary.opportunityExposure,
    input.evaluatedRevenuePercent,
  );

  const fromConsulting = consulting.nextSteps.map((s) =>
    s.endsWith("?") ? s : `${s.replace(/\.$/, "")}?`,
  );

  const fromExec = readout.executiveSummary.nextFocusAreas
    .slice(0, 2)
    .map((s) => (s.endsWith("?") ? s : `${s.replace(/\.$/, "")}?`));

  const defaults = [
    "Where should we sharpen trip-driving value anchors versus investing in ladder spacing?",
    "Which categories should lead a good-better-best reset versus a targeted entry-price test?",
    "Is private brand meant to monetize tiers or compete on opening price — and is the current structure consistent with that choice?",
    "What vendor, promo, and competitive constraints would cap any architecture-led move?",
  ];

  const merged = [...fromExec, ...fromConsulting, ...defaults];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of merged) {
    const norm = q.trim().toLowerCase();
    if (norm.length < 12 || seen.has(norm)) continue;
    seen.add(norm);
    out.push(translateExecutivePhrase(q));
    if (out.length >= 5) break;
  }
  return out;
}
