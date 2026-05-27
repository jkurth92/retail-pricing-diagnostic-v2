/**
 * Apply bounded refinement emphasis to executive presentation.
 * Does not alter evidence metrics, benchmarks, traces, or opportunity engines.
 */

import {
  extractMarginRangeBounds,
  formatMarginRangeCore,
} from "@/lib/executiveOutputPolish";
import {
  buildOpportunityDriverSynthesis,
  type BuildOpportunityDriverSynthesisInput,
  type OpportunityDriverSynthesis,
  type PricingOpportunityDriver,
} from "@/lib/opportunityDriverSynthesis";
import type { RefinementEmphasis, RefinementPresentationMeta } from "@/types/refinement";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

export type RefinementApplyContext = {
  readout: DiagnosticReadout;
  emphasis: RefinementEmphasis;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: OpportunityExposureBundle | null;
  evaluatedRevenuePercent?: number | null;
};

export type RefinedDiagnosticPresentation = {
  readout: DiagnosticReadout;
  driverSynthesis: OpportunityDriverSynthesis;
  meta: RefinementPresentationMeta;
};

/** Modestly tighten/widen displayed opportunity range; preserves trailing narrative text. */
export function adjustMarginRangeString(range: string, widthFactor: number): string {
  const bounds = extractMarginRangeBounds(range);
  if (!bounds || Math.abs(widthFactor - 1) < 0.008) return range;

  const { low, high, matched } = bounds;
  const mid = (low + high) / 2;
  const halfSpan = ((high - low) / 2) * widthFactor;
  const newLow = Math.max(0, mid - halfSpan);
  const newHigh = mid + halfSpan;
  const replacement = formatMarginRangeCore(newLow, newHigh, matched);
  return range.replace(matched, replacement);
}

function adjustConfidenceToneText(
  text: string,
  tone: RefinementEmphasis["confidenceTone"],
): string {
  if (!text?.trim() || tone === "neutral") return text;
  if (tone === "cautious") {
    return text
      .replace(/\bstrong\b/gi, "moderate")
      .replace(/\blikely\b/gi, "may")
      .replace(/\bmaterial\b/gi, "notable")
      .replace(/\bsuggests\b/gi, "may suggest")
      .replace(/\bhigh confidence\b/gi, "directional confidence");
  }
  return text
    .replace(/\bmay suggest\b/gi, "suggests")
    .replace(/\bdirectional\b/gi, "clear")
    .replace(/\bmoderate\b/gi, "meaningful");
}

function themeFamilyWeight(
  theme: ExecutiveTheme,
  emphasis: RefinementEmphasis,
): number {
  const family = theme.themeFamily;
  let w = theme.strategicImportance === "primary" ? 2 : 1;
  if (family === "Architecture" || family === "Premiumization") {
    w += emphasis.architectureWeight + emphasis.premiumizationWeight;
  }
  if (family === "KVI" || family === "ValueCommunication") {
    w += emphasis.kviWeight;
  }
  if (family === "Promotions" || family === "Markdown") {
    w += emphasis.promoWeight;
  }
  if (/private|pl/i.test(theme.themeName)) {
    w += emphasis.plNbWeight;
  }
  for (const cat of emphasis.categoryBoosts) {
    if (theme.themeName.toLowerCase().includes(cat.toLowerCase())) w += 0.5;
    if (theme.summary.toLowerCase().includes(cat.toLowerCase())) w += 0.35;
  }
  return w;
}

function driverKindScore(
  driver: PricingOpportunityDriver,
  emphasis: RefinementEmphasis,
): number {
  const weights: Record<string, number> = {
    premium_gap: emphasis.premiumizationWeight + emphasis.architectureWeight,
    entry_gap: emphasis.architectureWeight,
    price_level_clarity: emphasis.architectureWeight,
    value_breadth: emphasis.kviWeight - emphasis.promoWeight * 0.3,
    store_brand_gap: emphasis.plNbWeight,
  };
  let score = weights[driver.id] ?? 0;
  for (const cat of emphasis.categoryBoosts) {
    if (driver.examples.some((e) => e.toLowerCase().includes(cat.toLowerCase()))) {
      score += 0.6;
    }
  }
  for (const cat of emphasis.categoryDeprioritize) {
    if (driver.examples.some((e) => e.toLowerCase().includes(cat.toLowerCase()))) {
      score -= 0.4;
    }
  }
  return score;
}

function reorderDrivers(
  synthesis: OpportunityDriverSynthesis,
  emphasis: RefinementEmphasis,
): OpportunityDriverSynthesis {
  const drivers = [...synthesis.drivers].sort(
    (a, b) => driverKindScore(b, emphasis) - driverKindScore(a, emphasis),
  );
  const n = drivers.length;
  const introLine = synthesis.introLine.replace(
    /driven by \d+ factor/,
    `driven by ${n} factor${n === 1 ? "" : "s"}`,
  );
  return { ...synthesis, drivers, introLine, driverCount: n };
}

function reorderThemes(themes: ExecutiveTheme[], emphasis: RefinementEmphasis): ExecutiveTheme[] {
  return [...themes]
    .sort((a, b) => themeFamilyWeight(b, emphasis) - themeFamilyWeight(a, emphasis))
    .map((t, i) => ({ ...t, rank: i + 1 }));
}

function reorderDriverPhrases(phrases: string[], emphasis: RefinementEmphasis): string[] {
  const score = (p: string) => {
    const lower = p.toLowerCase();
    let s = 0;
    if (/architecture|premium|tier|ladder/i.test(lower)) s += emphasis.architectureWeight;
    if (/kvi|value concentration|visible value/i.test(lower)) s += emphasis.kviWeight;
    if (/promo|markdown/i.test(lower)) s += emphasis.promoWeight;
    if (/pl\/nb|private/i.test(lower)) s += emphasis.plNbWeight;
    return s;
  };
  return [...phrases].sort((a, b) => score(b) - score(a));
}

function refineExecutiveSummary(
  exec: ExecutiveSummary,
  emphasis: RefinementEmphasis,
  widthFactor: number,
): ExecutiveSummary {
  const marginOpportunitySummary = adjustMarginRangeString(
    exec.marginOpportunitySummary,
    widthFactor,
  );

  let maturitySummary = exec.maturitySummary;
  if (emphasis.maturityHint === "lower") {
    maturitySummary =
      "Interpretation assumes lower pricing maturity — emphasis stays directional and validation-heavy.";
  } else if (emphasis.maturityHint === "higher") {
    maturitySummary =
      "Interpretation assumes higher pricing maturity — emphasis stays on structural coherence rather than basics.";
  }

  return {
    ...exec,
    topThemes: reorderThemes(exec.topThemes, emphasis),
    primaryDrivers: reorderDriverPhrases(exec.primaryDrivers, emphasis),
    executiveNarrative: adjustConfidenceToneText(exec.executiveNarrative, emphasis.confidenceTone),
    confidenceSummary: adjustConfidenceToneText(exec.confidenceSummary, emphasis.confidenceTone),
    opportunityHeadline: adjustConfidenceToneText(exec.opportunityHeadline, emphasis.confidenceTone),
    strategicImplicationOneLiner: adjustConfidenceToneText(
      exec.strategicImplicationOneLiner,
      emphasis.confidenceTone,
    ),
    marginOpportunitySummary,
    maturitySummary,
    nextFocusAreas: reorderNextFocusAreas(exec.nextFocusAreas, emphasis),
  };
}

function reorderNextFocusAreas(areas: string[], emphasis: RefinementEmphasis): string[] {
  const score = (line: string) => {
    const lower = line.toLowerCase();
    let s = 0;
    if (/architecture|premium|tier|ladder|good-better-best/i.test(lower)) {
      s += 1 + emphasis.architectureWeight;
    }
    if (/kvi|value|anchor/i.test(lower)) s += emphasis.kviWeight;
    if (/promo|markdown/i.test(lower)) s += emphasis.promoWeight;
    for (const cat of emphasis.categoryBoosts) {
      if (lower.includes(cat.toLowerCase())) s += 0.8;
    }
    return s;
  };
  return [...areas].sort((a, b) => score(b) - score(a));
}

export function applyRefinementPresentation(
  ctx: RefinementApplyContext,
  meta: Omit<RefinementPresentationMeta, "isUserRefined"> & { mode: RefinementPresentationMeta["mode"] },
): RefinedDiagnosticPresentation {
  const { readout, emphasis, computedEvidence, opportunityExposure } = ctx;
  const widthFactor = emphasis.opportunityWidthFactor;

  const refinedExec = refineExecutiveSummary(readout.executiveSummary, emphasis, widthFactor);

  const refinedReadout: DiagnosticReadout = {
    ...readout,
    executiveSummary: refinedExec,
    opportunityOverview: adjustConfidenceToneText(
      readout.opportunityOverview,
      emphasis.confidenceTone,
    ),
    opportunityDetail: {
      ...readout.opportunityDetail,
      totalMarginOpportunityRange: adjustMarginRangeString(
        readout.opportunityDetail.totalMarginOpportunityRange,
        widthFactor,
      ),
    },
    strategicImplications: readout.strategicImplications.map((imp) =>
      adjustConfidenceToneText(imp, emphasis.confidenceTone),
    ),
    supportingThemes: reorderThemes(readout.supportingThemes, emphasis),
  };

  const driverInput: BuildOpportunityDriverSynthesisInput = {
    exec: refinedExec,
    exposure: opportunityExposure ?? refinedExec.opportunityExposure,
    themes: refinedExec.topThemes,
    evidence: computedEvidence,
    promoMarkdownEligible: computedEvidence?.promoMarkdownEligible ?? false,
    opportunityRange: refinedReadout.opportunityDetail.totalMarginOpportunityRange || null,
    refinementEmphasis: emphasis,
  };

  let driverSynthesis = buildOpportunityDriverSynthesis(driverInput);
  driverSynthesis = reorderDrivers(driverSynthesis, emphasis);

  if (emphasis.confidenceTone === "cautious") {
    driverSynthesis = {
      ...driverSynthesis,
      conclusion:
        "These patterns are directionally meaningful but should be validated with category teams before major pricing moves.",
      marginLine: adjustConfidenceToneText(driverSynthesis.marginLine, emphasis.confidenceTone),
    };
  }

  return {
    readout: refinedReadout,
    driverSynthesis,
    meta: {
      ...meta,
      isUserRefined: true,
    },
  };
}
