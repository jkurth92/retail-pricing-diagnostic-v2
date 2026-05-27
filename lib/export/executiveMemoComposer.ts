/**
 * McKinsey-style executive memo composition — presentation only.
 */

import { buildTrajectoryRows } from "@/lib/financeBenchmark";
import { buildContextKpis } from "@/lib/retailerContextDisplay";
import { translateExecutivePhrase } from "@/lib/executiveBusinessLanguage";
import {
  buildExecutiveConsultingSummary,
  buildStrategicDriverCards,
  softenBenchmarkPhrase,
} from "@/lib/narrativePresentation";
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
    `${retailerName} is positioned as a ${input.readout.executiveSummary.retailerProfile.archetype.toLowerCase()} retailer with a ${input.readout.executiveSummary.retailerProfile.posture.toLowerCase()} pricing posture.`,
  );

  const kpis = enrichment ? buildContextKpis(enrichment) : [];
  if (kpis.length > 0) {
    const kpiLine = kpis
      .slice(0, 5)
      .map((k) => `${k.label}: ${k.value}`)
      .join("; ");
    lines.push(`Reported scale and profitability context: ${kpiLine}.`);
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

export function composePricingObservationsSection(
  input: ExecutiveMemoComposeInput,
): string {
  const { readout, computedEvidence } = input;
  const bullets: string[] = [];

  const opp = readout.opportunityDetail;
  if (opp.totalMarginOpportunityRange) {
    bullets.push(
      `Indicative margin opportunity in reviewed scope: ${opp.totalMarginOpportunityRange} (directional, not a forecast).`,
    );
  }

  if (computedEvidence?.summaries?.length) {
    for (const s of computedEvidence.summaries.slice(0, 4)) {
      bullets.push(translateExecutivePhrase(softenBenchmarkPhrase(s)));
    }
  }

  for (const theme of readout.executiveSummary.evidenceBackedThemes.slice(0, 3)) {
    bullets.push(
      translateExecutivePhrase(
        `${theme.headline.replace(/\.$/, "")}: ${softenBenchmarkPhrase(theme.detail)}`,
      ),
    );
  }

  if (bullets.length < 3) {
    for (const d of readout.executiveSummary.primaryDrivers.slice(0, 3)) {
      bullets.push(translateExecutivePhrase(softenBenchmarkPhrase(d)));
    }
  }

  const drivers = buildStrategicDriverCards(readout.executiveSummary, 3);
  for (const card of drivers) {
    if (bullets.length >= 5) break;
    const line = `${card.title}: ${card.interpretation}`;
    if (!bullets.some((b) => b.toLowerCase().includes(card.title.toLowerCase()))) {
      bullets.push(translateExecutivePhrase(line));
    }
  }

  if (bullets.length === 0) {
    bullets.push(
      translateExecutivePhrase(
        readout.opportunityOverview.split(".").slice(0, 2).join(".") + ".",
      ),
    );
  }

  return bullets.map((b) => `• ${b}`).join("\n");
}

export function composeImplicationsSection(
  input: ExecutiveMemoComposeInput,
): string {
  const { readout } = input;
  const paragraphs: string[] = [];

  const consulting = buildExecutiveConsultingSummary(
    readout.executiveSummary,
    readout.strategicImplications,
    input.opportunityExposure ?? readout.executiveSummary.opportunityExposure,
    input.evaluatedRevenuePercent,
  );

  if (consulting.paragraphs.length > 0) {
    paragraphs.push(...consulting.paragraphs.slice(0, 3));
  } else if (readout.executiveSummary.executiveNarrative.trim()) {
    paragraphs.push(
      translateExecutivePhrase(
        readout.executiveSummary.executiveNarrative.split(".").slice(0, 3).join(".") + ".",
      ),
    );
  }

  for (const imp of readout.strategicImplications.slice(0, 2)) {
    const t = translateExecutivePhrase(softenBenchmarkPhrase(imp));
    if (!paragraphs.some((p) => p.includes(t.slice(0, 40)))) {
      paragraphs.push(t);
    }
  }

  if (readout.executiveSummary.opportunityHeadline) {
    paragraphs.push(
      translateExecutivePhrase(readout.executiveSummary.opportunityHeadline),
    );
  }

  const exposure = input.opportunityExposure ?? readout.executiveSummary.opportunityExposure;
  if (exposure?.exposureSummaries?.length) {
    paragraphs.push(
      translateExecutivePhrase(exposure.exposureSummaries[0] ?? ""),
    );
  }

  return paragraphs.filter((p) => p.length > 20).slice(0, 4).join("\n\n");
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
    "Where should we prioritize tier spacing versus visible value investment in the next planning cycle?",
    "Which categories should anchor a trade-up test versus a base-price architecture reset?",
    "What margin guardrails should govern changes in trip-driving categories?",
    "How do commercial constraints (vendor, promo calendar, competitive price gaps) limit structural moves?",
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
