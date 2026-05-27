/**
 * Executive-facing business language — presentation translation only.
 * Does not alter sizing, evidence, or diagnostic engines.
 */

import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import { buildEvidenceMetricImplication } from "@/lib/evidenceTileInterpretation";
import { translateConsultantInsight } from "@/lib/insightTranslation";
import { buildPortfolioConfidenceChipLabel } from "@/lib/narrativeRefinement";
import { softenExecutiveDriverPhrase } from "@/lib/interpretationCalibration";
import type { EvidenceMetric } from "@/types/evidence-computation";

const PHRASE_MAP: [RegExp, string][] = [
  [/\bmonetizable exposure\b/gi, "evaluated revenue"],
  [/\bmonetizable in-scope revenue\b/gi, "evaluated revenue"],
  [/\bdirectional confidence\b/gi, "evidence support"],
  [/\bhigh directional confidence\b/gi, "moderate evidence support"],
  [/\bmoderate directional confidence\b/gi, "moderate evidence support"],
  [/\bhigh confidence\b/gi, "strong evidence support"],
  [/\bmedium confidence\b/gi, "moderate evidence support"],
  [/\bmoderate confidence\b/gi, "moderate evidence support"],
  [/\bmoderate thematic width\b/gi, "opportunity concentrated in select structural themes"],
  [/\bwider thematic band\b/gi, "broader opportunity range"],
  [/\btighter confidence band\b/gi, "relatively narrow opportunity range"],
  [/\barchitecture[- ]led\b/gi, "tier and spacing structure"],
  [/\barchitecture coherence\b/gi, "pricing structure remains broadly coherent"],
  [/\boverlap factor\b/gi, "theme overlap"],
  [/\bthematic diagnostic\b/gi, "strategic pricing diagnostic"],
  [/\bthematic, bounded\b/gi, "directional and bounded"],
  [/\bthematic, non-additive\b/gi, "directional, not additive"],
  [/\bprimary issue\b/gi, "primary opportunity area"],
  [/\bweakness\b/gi, "gap"],
  [/\bfailure\b/gi, "gap"],
  [/\bmonetization weakness\b/gi, "monetization opportunity"],
  [/\bKVI-like\b/gi, "Visible value"],
  [/\bkey value items?\b/gi, "trip-driving value"],
  [/\bPL\/NB\b/g, "private brand vs. national brand"],
  [/\bdirectional signal\b/gi, "structural signal"],
  [/\bupload proxy\b/gi, "reviewed data"],
  [/\bthematic width\b/gi, "breadth of structural themes"],
  [/\bmonetizable exposure\b/gi, "in-scope commercial exposure"],
  [/\bexposure[- ]weighted\b/gi, "in-scope"],
  [/\bweighting contribution\b/gi, "contribution"],
  [/\bladder legibility\b/gi, "tier clarity on shelf"],
  [/\bdirectional\b/gi, "indicative"],
  [/\binferred category revenue weight\b/gi, "reviewed category mix"],
  [/\barchitecture compression indicator\b/gi, "compressed tier spacing"],
];

export type OpportunityFootprintMode =
  | "category_localized"
  | "thematic_localized"
  | "portfolio_thematic";

export type OpportunityFootprint = {
  mode: OpportunityFootprintMode;
  compressionCategories: string[];
  plNbCategories: string[];
  elevatedKviCategories: string[];
};

export function translateExecutivePhrase(text: string): string {
  let out = stripExecutivePseudoPrecision(text.trim());
  for (const [re, replacement] of PHRASE_MAP) {
    out = out.replace(re, replacement);
  }
  out = out.replace(/\s{2,}/g, " ").trim();
  return translateConsultantInsight(out);
}

/** Remove model-style percentage claims from executive copy. */
export function stripExecutivePseudoPrecision(text: string): string {
  return text
    .replace(
      /opportunity concentrated in ~?\d+(?:\.\d+)?%\s+of\s+evaluated\s+revenue/gi,
      "opportunity appears concentrated in select categories",
    )
    .replace(/~?\d+(?:\.\d+)?%\s+of\s+evaluated\s+revenue/gi, "a subset of evaluated revenue")
    .replace(/\bconcentrated in ~\d+(?:\.\d+)?%/gi, "concentrated in select categories")
    .replace(/\s+\d{1,3}%\s*$/g, "")
    .trim();
}

export function assessOpportunityFootprint(
  exposure?: OpportunityExposureBundle | null,
  exec?: ExecutiveSummary,
): OpportunityFootprint {
  const compressionCategories =
    exposure?.categoryExposures.filter((c) => c.architectureCompression).map((c) => c.category) ??
    [];
  const plNbCategories =
    exposure?.categoryExposures.filter((c) => c.plNbNarrow).map((c) => c.category) ?? [];
  const elevatedKviCategories =
    exposure?.categoryExposures.filter((c) => c.kviElevated).map((c) => c.category) ?? [];

  const archAffected = exposure?.architectureAffectedRevenuePct ?? 0;
  const monetizable = exposure?.monetizableExposurePct ?? 0;
  const totalCats = exposure?.categoryExposures.length ?? 0;

  const compressionShare =
    totalCats > 0 ? compressionCategories.length / totalCats : 0;

  let mode: OpportunityFootprintMode = "thematic_localized";

  if (
    compressionCategories.length === 0 &&
    elevatedKviCategories.length === 0 &&
    archAffected < 12
  ) {
    mode = "portfolio_thematic";
  } else if (
    compressionCategories.length >= 1 &&
    compressionCategories.length <= 4 &&
    (compressionShare <= 0.55 || archAffected < 45 || monetizable < 40)
  ) {
    mode = "category_localized";
  }

  const hasBroadKvi =
    elevatedKviCategories.length >= 3 ||
    exec?.primaryDrivers.some((d) =>
      typeof d === "string" && /broad|moderate value concentration/i.test(d),
    );
  if (hasBroadKvi && compressionCategories.length <= 1) {
    mode = "portfolio_thematic";
  }

  return {
    mode,
    compressionCategories,
    plNbCategories,
    elevatedKviCategories,
  };
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
  exec?: ExecutiveSummary,
): string | null {
  if (!exposure) return null;

  const footprint = assessOpportunityFootprint(exposure, exec);
  const cats = footprint.compressionCategories;

  if (footprint.mode === "category_localized" && cats.length >= 2) {
    return `Opportunity appears concentrated in ${cats.slice(0, 3).join(", ")}`;
  }
  if (footprint.mode === "category_localized" && cats.length === 1) {
    return `Opportunity appears concentrated in ${cats[0]}`;
  }
  if (footprint.mode === "portfolio_thematic") {
    return "Opportunity appears thematic rather than category-specific";
  }
  if (footprint.elevatedKviCategories.length >= 2 && cats.length === 0) {
    return "Opportunity appears concentrated in a subset of high-volume categories";
  }
  return "Opportunity appears localized rather than portfolio-wide";
}

export function businessScopeEvaluatedLabel(
  evaluatedRevenuePercent: number | null | undefined,
): string | null {
  if (evaluatedRevenuePercent == null || !Number.isFinite(evaluatedRevenuePercent)) {
    return null;
  }
  const pct = Math.round(evaluatedRevenuePercent);
  if (pct >= 85) return "Majority of retailer revenue evaluated";
  if (pct >= 55) return `${pct}% of retailer revenue evaluated`;
  return "Select portion of retailer revenue evaluated";
}

export function buildPrimaryOpportunityAreaLine(
  exec: ExecutiveSummary,
  exposure?: OpportunityExposureBundle | null,
): string {
  const footprint = assessOpportunityFootprint(exposure, exec);
  const cats = footprint.compressionCategories;

  if (cats.length >= 2) {
    return `Selective architecture compression in ${cats.slice(0, 3).join(", ")}`;
  }
  if (cats.length === 1) {
    return `Selective architecture compression in ${cats[0]}`;
  }

  const driver = exec.primaryDrivers.find(
    (d) => typeof d === "string" && d.trim().length > 0,
  );
  if (driver) {
    return translateExecutivePhrase(softenExecutiveDriverPhrase(driver));
  }

  if (footprint.mode === "portfolio_thematic") {
    return "Selective structural opportunity across the portfolio";
  }

  return "Selective monetization opportunity in measured categories";
}

export type ExecutiveImplicationInput = {
  primaryDrivers?: string[];
  topThemes?: ExecutiveSummary["topThemes"];
};

export function buildExecutiveImplicationLine(
  exposure?: OpportunityExposureBundle | null,
  input?: ExecutiveImplicationInput | ExecutiveSummary,
): string {
  const exec =
    input && "retailerProfile" in input
      ? (input as ExecutiveSummary)
      : ({
          primaryDrivers: input?.primaryDrivers ?? [],
          topThemes: input?.topThemes ?? [],
        } as ExecutiveSummary);

  const footprint = assessOpportunityFootprint(exposure, exec);
  const cats = footprint.compressionCategories;

  if (cats.length >= 2) {
    return `The primary opportunity appears concentrated in selective category-level architecture compression rather than broad portfolio-wide monetization pressure.`;
  }

  const hasKvi = exec.primaryDrivers.some((d) =>
    typeof d === "string" && /kvi|value concentration|visible value/i.test(d),
  );
  const hasArch = exec.primaryDrivers.some((d) =>
    typeof d === "string" && /architecture|premium|tier|spacing/i.test(d),
  );

  if (hasArch && hasKvi) {
    return "The retailer appears to be balancing trip-driving value investment with uneven ladder structure — the opportunity is driven less by broad price level and more by how tiers and value roles are sequenced.";
  }

  if (hasArch && cats.length === 1) {
    return `Signals suggest pricing ladders in ${cats[0]} are not creating clear good-better-best separation relative to the rest of the portfolio.`;
  }

  if (hasArch || footprint.compressionCategories.length > 0) {
    return "The opportunity is driven less by a portfolio-wide price reset and more by misaligned pricing architecture and tier-role clarity.";
  }

  if (hasKvi) {
    return "Value communication appears diffuse — leadership should confirm whether value funding is intentionally broad or should be re-anchored on trip-driving items.";
  }

  return "The portfolio shows evidence of selective structural pricing tension rather than a single-category issue.";
}

export type HeroBusinessInterpretation = {
  opportunitySize: string | null;
  revenueImpactRange: string | null;
  revenueImpactLabel: string | null;
  scopeEvaluated: string | null;
  concentration: string | null;
  confidence: string;
  primaryOpportunityArea: string;
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
    revenueImpactRange: exec.revenueImpactRange ?? null,
    revenueImpactLabel: exec.revenueImpactLabel ?? null,
    scopeEvaluated: businessScopeEvaluatedLabel(evaluatedRevenuePercent),
    concentration: businessConcentrationLabel(exposure, exec),
    confidence: businessConfidenceLabel(exec.evidenceStrength, exec.topThemes),
    primaryOpportunityArea: buildPrimaryOpportunityAreaLine(exec, exposure),
  };
}

export function buildExecutiveBusinessSummaryParagraphs(
  exec: ExecutiveSummary,
  exposure?: OpportunityExposureBundle | null,
  evaluatedRevenuePercent?: number | null,
): string[] {
  const paragraphs: string[] = [];
  const footprint = assessOpportunityFootprint(exposure, exec);

  if (exec.opportunityHeadline?.trim()) {
    paragraphs.push(translateExecutivePhrase(exec.opportunityHeadline));
  }

  if (exec.revenueImpactLabel?.trim()) {
    const revLine =
      exec.revenueSensitivitySummary?.split(".")[0]?.trim() ??
      `Potential revenue impact appears ${exec.revenueImpactLabel.toLowerCase()}`;
    if (revLine.length > 24) {
      paragraphs.push(
        translateExecutivePhrase(
          revLine.endsWith(".") ? revLine : `${revLine}.`,
        ),
      );
    }
  }

  const scope = businessScopeEvaluatedLabel(evaluatedRevenuePercent);
  const concentration = businessConcentrationLabel(exposure, exec);
  if (scope) {
    paragraphs.push(
      concentration
        ? `${scope}. ${concentration}.`
        : `${scope}.`,
    );
  } else if (concentration) {
    paragraphs.push(concentration + ".");
  }

  if (footprint.compressionCategories.length >= 2) {
    paragraphs.push(
      `Price ladders appear most strained in ${footprint.compressionCategories.slice(0, 3).join(", ")} — the pattern reads as category-visible but thematically linked to tier-role design.`,
    );
  } else if (exec.primaryDrivers.length > 0) {
    paragraphs.push(
      `The retailer appears to face its clearest pricing tension in ${buildPrimaryOpportunityAreaLine(exec, exposure).toLowerCase()}.`,
    );
  }

  paragraphs.push(buildExecutiveImplicationLine(exposure, exec));

  return paragraphs
    .map((p) => translateExecutivePhrase(p))
    .filter((p) => p.length > 20)
    .slice(0, 4);
}

export function softenEvidenceMetricSubtext(subtext: string): string {
  return translateExecutivePhrase(subtext)
    .replace(/strong measured signal in upload proxy/i, "Notable signal in reviewed data")
    .replace(/moderate signal — directionally meaningful/i, "Meaningful directional signal")
    .replace(/supporting directional signal/i, "Supporting signal");
}

/** @deprecated Prefer buildEvidenceTilePresentation in evidenceTileInterpretation.ts */
const METRIC_TITLE: Record<string, string> = {
  premium_mainstream_gap: "Premiumization & trade-up",
  entry_mainstream_gap: "Opening-price value signal",
  tier_spacing: "Good-better-best ladder structure",
  pl_nb_gap: "Private-brand role clarity",
  pl_nb_categories_narrow: "Private-brand role clarity",
  kvi_revenue_share: "Value communication breadth",
  kvi_sku_share: "Value communication breadth",
  kvi_category_concentration: "Trip-driving value concentration",
  category_revenue_concentration: "Categories shaping the story",
  pack_size_consistency: "Pack-size ladder consistency",
  architecture_compression: "Pricing architecture alignment",
};

/** Preserve numeric values; only normalize whitespace. */
export function formatEvidenceMetricDisplay(_metricId: string, rawValue: string): string {
  return rawValue.trim();
}

export function formatEvidenceMetricTitle(metricId: string, engineLabel: string): string {
  return METRIC_TITLE[metricId] ?? engineLabel
    .replace(/\bKVI-like\b/gi, "Visible value")
    .replace(/\bPL\/NB\b/g, "Private brand vs. national brand")
    .replace(/\bmedian gap\b/gi, "spacing")
    .replace(/\s+\(inferred\)/gi, "")
    .replace(/\s+\(mainstream\)/gi, "");
}

/** @deprecated Prefer buildEvidenceTilePresentation */
export function formatEvidenceMetricSubtext(
  metricId: string,
  rawValue: string,
  strength: "strong" | "moderate" | "weak" = "moderate",
): string {
  return translateExecutivePhrase(
    buildEvidenceMetricImplication(
      metricId as EvidenceMetric["id"],
      rawValue,
      strength,
    ),
  );
}

/** @deprecated Use buildPrimaryOpportunityAreaLine */
export const buildPrimaryIssueLine = buildPrimaryOpportunityAreaLine;
