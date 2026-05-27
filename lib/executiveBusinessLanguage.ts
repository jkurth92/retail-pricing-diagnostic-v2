/**
 * Executive-facing business language — presentation translation only.
 * Does not alter sizing, evidence, or diagnostic engines.
 */

import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import { buildPortfolioConfidenceChipLabel } from "@/lib/narrativeRefinement";
import { softenExecutiveDriverPhrase } from "@/lib/interpretationCalibration";

const PHRASE_MAP: [RegExp, string][] = [
  [/\bmonetizable exposure\b/gi, "evaluated revenue implicated"],
  [/\bmonetizable in-scope revenue\b/gi, "evaluated revenue"],
  [/\bdirectional confidence\b/gi, "evidence support"],
  [/\bhigh directional confidence\b/gi, "moderate evidence support"],
  [/\bmoderate directional confidence\b/gi, "moderate evidence support"],
  [/\bdirectional confidence\b/gi, "limited evidence support"],
  [/\bhigh confidence\b/gi, "strong evidence support"],
  [/\bmedium confidence\b/gi, "moderate evidence support"],
  [/\bmoderate confidence\b/gi, "moderate evidence support"],
  [/\bthematic width\b/gi, "structural theme concentration"],
  [/\bmoderate thematic width\b/gi, "opportunity concentrated in select structural themes"],
  [/\bwider thematic band\b/gi, "broader opportunity range"],
  [/\btighter confidence band\b/gi, "narrower opportunity range"],
  [/\barchitecture[- ]led\b/gi, "tier and spacing structure"],
  [/\barchitecture coherence\b/gi, "tier spacing consistency"],
  [/\boverlap factor\b/gi, "theme overlap adjustment"],
  [/\bthematic diagnostic\b/gi, "strategic pricing diagnostic"],
  [/\bthematic, bounded\b/gi, "directional and bounded"],
  [/\bthematic, non-additive\b/gi, "directional, not additive"],
];

export function translateExecutivePhrase(text: string): string {
  let out = text.trim();
  for (const [re, replacement] of PHRASE_MAP) {
    out = out.replace(re, replacement);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

export function businessConfidenceLabel(
  evidenceStrength: ExecutiveSummary["evidenceStrength"],
  themes: ExecutiveSummary["topThemes"],
): string {
  const raw = buildPortfolioConfidenceChipLabel(evidenceStrength, themes);
  if (/high confidence/i.test(raw)) return "Strong evidence support";
  if (/moderate|medium/i.test(raw)) return "Moderate evidence support";
  return "Limited evidence support";
}

export function businessConcentrationLabel(
  exposure: OpportunityExposureBundle | null | undefined,
): string | null {
  if (!exposure || exposure.monetizableExposurePct <= 0) return null;
  return `Opportunity concentrated in ~${exposure.monetizableExposurePct}% of evaluated revenue`;
}

export function businessScopeEvaluatedLabel(
  evaluatedRevenuePercent: number | null | undefined,
): string | null {
  if (evaluatedRevenuePercent == null || !Number.isFinite(evaluatedRevenuePercent)) {
    return null;
  }
  const pct = Math.round(evaluatedRevenuePercent);
  return `${pct}% of retailer revenue evaluated`;
}

export function buildPrimaryIssueLine(
  exec: ExecutiveSummary,
  exposure?: OpportunityExposureBundle | null,
): string {
  const archCats =
    exposure?.categoryExposures
      .filter((c) => c.architectureCompression)
      .map((c) => c.category) ?? [];

  if (archCats.length >= 2) {
    return `Selective architecture compression in ${archCats.slice(0, 3).join(", ")}`;
  }
  if (archCats.length === 1) {
    return `Selective architecture compression in ${archCats[0]}`;
  }

  const driver = exec.primaryDrivers.find(
    (d) => typeof d === "string" && d.trim().length > 0,
  );
  if (driver) {
    return translateExecutivePhrase(softenExecutiveDriverPhrase(driver));
  }

  const archTheme = exec.topThemes.find((t) => t.themeFamily === "Architecture");
  if (archTheme) {
    return translateExecutivePhrase(archTheme.themeName);
  }

  return "Selective monetization compression in measured categories";
}

export type HeroBusinessInterpretation = {
  opportunitySize: string | null;
  scopeEvaluated: string | null;
  concentration: string | null;
  confidence: string;
  primaryIssue: string;
};

export function buildHeroBusinessInterpretation(
  exec: ExecutiveSummary,
  marginDisplay: string | null,
  exposure?: OpportunityExposureBundle | null,
  evaluatedRevenuePercent?: number | null,
): HeroBusinessInterpretation {
  return {
    opportunitySize: marginDisplay
      ? `${marginDisplay} margin opportunity`
      : translateExecutivePhrase(exec.marginOpportunitySummary),
    scopeEvaluated: businessScopeEvaluatedLabel(evaluatedRevenuePercent),
    concentration: businessConcentrationLabel(exposure),
    confidence: businessConfidenceLabel(exec.evidenceStrength, exec.topThemes),
    primaryIssue: buildPrimaryIssueLine(exec, exposure),
  };
}

export function buildExecutiveBusinessSummaryParagraphs(
  exec: ExecutiveSummary,
  exposure?: OpportunityExposureBundle | null,
  evaluatedRevenuePercent?: number | null,
  opportunityLine?: string,
  evidenceLine?: string,
  implicationLine?: string,
): string[] {
  const paragraphs: string[] = [];

  const opp =
    opportunityLine ??
    (exec.opportunityHeadline
      ? translateExecutivePhrase(exec.opportunityHeadline)
      : null);
  if (opp) paragraphs.push(opp);

  const scope = businessScopeEvaluatedLabel(evaluatedRevenuePercent);
  const concentration = businessConcentrationLabel(exposure);
  if (scope || concentration) {
    const parts = [scope, concentration].filter(Boolean);
    paragraphs.push(parts.join(". ") + (parts.length ? "." : ""));
  }

  const keyIssue =
    evidenceLine ??
    (exec.primaryDrivers.length > 0
      ? `The strongest signals point to ${buildPrimaryIssueLine(exec, exposure).toLowerCase()}.`
      : null);
  if (keyIssue) paragraphs.push(translateExecutivePhrase(keyIssue));

  const implication =
    implicationLine ??
    (exec.strategicImplicationOneLiner
      ? translateExecutivePhrase(exec.strategicImplicationOneLiner)
      : null);
  if (implication) {
    paragraphs.push(implication);
  }

  return paragraphs.slice(0, 5);
}

export function softenEvidenceMetricSubtext(subtext: string): string {
  return translateExecutivePhrase(subtext)
    .replace(/strong measured signal in upload proxy/i, "Strong signal in reviewed data")
    .replace(/moderate signal — directionally meaningful/i, "Moderate signal — directionally meaningful")
    .replace(/supporting directional signal/i, "Supporting signal");
}
