/**
 * Presentation-only transforms for executive narrative UX.
 * Does not alter opportunity, benchmark, evidence, or trace logic.
 */

import { polishNarrativeText } from "@/lib/executiveOutputPolish";
import {
  calibrateEvidenceHeadline,
  softenExecutiveDriverPhrase,
} from "@/lib/interpretationCalibration";
import {
  buildExecutiveBusinessSummaryParagraphs,
  businessConfidenceLabel,
  businessConcentrationLabel,
  translateExecutivePhrase,
} from "@/lib/executiveBusinessLanguage";
import {
  buildCategoryConcentrationTilePresentation,
  buildEvidenceTilePresentation,
  buildExposureCategoryTilePresentation,
  exposureTileShouldShow,
} from "@/lib/evidenceTileInterpretation";
import {
  buildStrategicDiscussionPrompts,
  calibrateValueConcentrationPhrase,
  dedupeNarrativeLines,
  insightTileEmphasis,
  metricDisplayRank,
} from "@/lib/narrativeRefinement";
import {
  classifyTextFamilyRank,
  filterGenericNarrativeLines,
  orderThemesByNarrativeDominance,
} from "@/lib/signalPrioritization";
import { shortenThemeTitle } from "@/lib/executiveUxHelpers";
import { illustrationsForMetric } from "@/lib/evidenceIllustrations";
import { parseCategoriesFromMetricLabel } from "@/lib/scopeProductCategories";
import { filterIllustrationsToScopeCategories } from "@/lib/skuIllustrationBuilder";
import { consultantThemeLabel } from "@/lib/insightTranslation";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { IllustrativeCommercialExample } from "@/types/evidence-illustrations";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";

export type StrategicDriverCard = {
  id: string;
  title: string;
  interpretation: string;
  benchmarkHint?: string;
  impact: "high" | "medium";
  confidenceLabel?: string;
};

export type InsightSourceTile = {
  id: string;
  title: string;
  metric: string;
  /** @deprecated Use implication */
  subtext: string;
  observationLabel?: string;
  implication?: string;
  benchmarkHint?: string;
  strength?: "strong" | "moderate" | "weak";
  emphasis?: "primary" | "secondary" | "supporting";
  illustrativeExamples?: IllustrativeCommercialExample[];
  illustrationDisclaimer?: string;
};

/** Composed executive narrative for client-facing discussion (presentation only). */
export type ExecutiveConsultingSummary = {
  paragraphs: string[];
  nextSteps: string[];
};

/** Shorten repetitive benchmark phrasing for executive scan. */
export function softenBenchmarkPhrase(text: string): string {
  return softenExecutiveDriverPhrase(
    text
      .replace(
        /\bappears below the expected range \([^)]+\) for a [^.]+\./gi,
        "Near the low end of expected range.",
      )
      .replace(/\bbelow the expected range for a [^.]+\./gi, "Below expected spacing.")
      .replace(/\bnarrower than typical for [^.]+\./gi, "Moderately compressed versus typical spacing.")
      .replace(/\bfor a [A-Za-z /-]+ retailer with [A-Za-z-]+ posture\.?/gi, "")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function driverTitleFromText(raw: string): string {
  const s = softenBenchmarkPhrase(raw);
  if (/weak pl\/nb|pl\/nb separation/i.test(s)) return "Private-brand role unclear";
  if (/compressed premium|premium spacing|tier spacing|architecture compression/i.test(s))
    return "Misaligned pricing architecture";
  if (/kvi|visible value|value concentration/i.test(s)) {
    return consultantThemeLabel(
      calibrateValueConcentrationPhrase({}) ?? "Value communication diffuse",
    );
  }
  if (/trade-up|premium\/mainstream|tier/i.test(s)) return "Unclear good-better-best structure";
  if (/pl\/nb/i.test(s)) return "Private-brand under-differentiated";
  return consultantThemeLabel(shortenThemeTitle(s.split(".")[0] ?? s));
}

function impactFromText(text: string): "high" | "medium" {
  if (/kvi|value concentration|visible value|modest kvi/i.test(text)) return "medium";
  if (/compressed|weak|below|~\d+% of in-scope/i.test(text)) return "high";
  return "medium";
}

export function buildStrategicDriverCards(
  exec: ExecutiveSummary,
  max = 4,
): StrategicDriverCard[] {
  const seen = new Set<string>();
  const cards: StrategicDriverCard[] = [];

  const add = (id: string, raw: string, theme?: ExecutiveTheme) => {
    const title = theme?.themeName
      ? shortenThemeTitle(calibrateEvidenceHeadline(theme.themeName))
      : driverTitleFromText(raw);
    if (seen.has(title)) return;
    seen.add(title);
    const interpretation = translateExecutivePhrase(
      theme
        ? softenBenchmarkPhrase(theme.summary).slice(0, 140)
        : softenBenchmarkPhrase(raw).slice(0, 140),
    );
    let benchmarkHint: string | undefined;
    if (/below expected|compressed vs benchmark|low-end/i.test(interpretation)) {
      benchmarkHint = "Vs benchmark";
    } else if (exec.retailerProfile.archetype) {
      benchmarkHint = exec.retailerProfile.archetype.split(" ")[0];
    }
    cards.push({
      id,
      title,
      interpretation:
        interpretation ||
        "The portfolio shows evidence of structural pricing tension in reviewed data.",
      benchmarkHint,
      impact: impactFromText(raw),
      confidenceLabel: theme?.confidence.level.replace(/_/g, " "),
    });
  };

  orderThemesByNarrativeDominance(exec.topThemes)
    .slice(0, 2)
    .forEach((t) => add(t.id, t.summary, t));

  exec.primaryDrivers
    .slice()
    .sort((a, b) => classifyTextFamilyRank(a) - classifyTextFamilyRank(b))
    .forEach((d, i) => add(`driver-${i}`, d));

  exec.evidenceBackedThemes.slice(0, 3).forEach((t, i) => {
    if (cards.length >= max) return;
    if (classifyTextFamilyRank(t.headline) >= 5) return;
    add(`ebt-${i}`, `${t.headline}. ${t.detail}`);
  });

  return cards
    .slice()
    .sort((a, b) => classifyTextFamilyRank(a.title) - classifyTextFamilyRank(b.title))
    .slice(0, max);
}

function attachIllustrations(
  tile: InsightSourceTile,
  evidence: ComputedEvidenceBundle | null | undefined,
): InsightSourceTile {
  let examples = illustrationsForMetric(evidence?.illustrations, tile.id);
  if (tile.id === "kvi_category_concentration" && examples.length > 0) {
    const scopeCats = parseCategoriesFromMetricLabel(tile.metric);
    examples = filterIllustrationsToScopeCategories(examples, scopeCats);
  }
  if (examples.length === 0) return tile;
  return {
    ...tile,
    illustrativeExamples: examples,
    illustrationDisclaimer: evidence?.illustrations?.disclaimer,
  };
}

function selectExecutiveEvidenceMetrics(
  metrics: ComputedEvidenceBundle["metrics"],
): ComputedEvidenceBundle["metrics"] {
  const ids = new Set(metrics.map((m) => m.id));
  const preferred: string[] = [];

  if (ids.has("pl_nb_gap")) preferred.push("pl_nb_gap");

  if (ids.has("tier_spacing")) {
    preferred.push("tier_spacing");
  } else if (ids.has("premium_mainstream_gap")) {
    preferred.push("premium_mainstream_gap");
  } else if (ids.has("entry_mainstream_gap")) {
    preferred.push("entry_mainstream_gap");
  }

  if (ids.has("kvi_category_concentration")) {
    preferred.push("kvi_category_concentration");
  } else if (ids.has("kvi_revenue_share")) {
    preferred.push("kvi_revenue_share");
  }

  if (preferred.length === 0) return metrics;
  return metrics.filter((m) => preferred.includes(m.id));
}

function metricToInsight(
  m: ComputedEvidenceBundle["metrics"][0],
  evidence?: ComputedEvidenceBundle | null,
): InsightSourceTile | null {
  const metrics = evidence?.metrics ?? [];
  const pres = buildEvidenceTilePresentation(m, metrics);
  if (!pres || pres.suppress || !pres.observationValue) return null;

  const implication = translateExecutivePhrase(pres.implication);

  return attachIllustrations(
    {
      id: m.id,
      title: pres.title,
      observationLabel: pres.observationLabel,
      metric: pres.observationValue,
      implication,
      subtext: implication,
      strength: m.strength,
      emphasis: insightTileEmphasis(pres.title, m.strength, 0),
    },
    evidence,
  );
}

function illustrationSignature(
  examples: IllustrativeCommercialExample[] | undefined,
): string {
  if (!examples?.length) return "";
  return examples
    .map((e) => e.skuLines?.join("|") ?? `${e.category}:${e.observation}`)
    .join("::");
}

export function buildInsightSourceTiles(
  exec: ExecutiveSummary,
  exposure: OpportunityExposureBundle | null | undefined,
  evidence: ComputedEvidenceBundle | null | undefined,
  max = 4,
): InsightSourceTile[] {
  const tiles: InsightSourceTile[] = [];
  const seen = new Set<string>();
  const seenIllustrations = new Set<string>();

  const push = (tile: InsightSourceTile) => {
    let enriched = attachIllustrations(tile, evidence);
    const key = `${enriched.title}-${enriched.metric}`;
    if (seen.has(key) || tiles.length >= max) return;

    if (enriched.illustrativeExamples?.length) {
      const sig = illustrationSignature(enriched.illustrativeExamples);
      if (sig && seenIllustrations.has(sig)) {
        enriched = {
          ...enriched,
          illustrativeExamples: undefined,
          illustrationDisclaimer: undefined,
        };
      } else if (sig) {
        seenIllustrations.add(sig);
      }
    }

    seen.add(key);
    tiles.push(enriched);
  };

  if (evidence?.metrics) {
    const sorted = selectExecutiveEvidenceMetrics([...evidence.metrics]).sort((a, b) => {
      const rankDiff = metricDisplayRank(a.label, a.id) - metricDisplayRank(b.label, b.id);
      if (rankDiff !== 0) return rankDiff;
      const strengthOrder = { strong: 0, moderate: 1, weak: 2 };
      return (
        strengthOrder[a.strength ?? "moderate"] - strengthOrder[b.strength ?? "moderate"]
      );
    });
    sorted.forEach((m, idx) => {
      const t = metricToInsight(m, evidence);
      if (!t) return;
      t.emphasis = insightTileEmphasis(m.label, m.strength, idx);
      push(t);
    });
  }

  const metricIds = new Set(evidence?.metrics?.map((m) => m.id) ?? []);
  const skipExposureTiles =
    metricIds.has("pl_nb_gap") &&
    (metricIds.has("tier_spacing") || metricIds.has("premium_mainstream_gap")) &&
    (metricIds.has("kvi_category_concentration") || metricIds.has("kvi_revenue_share"));

  if (!skipExposureTiles && exposure && exposureTileShouldShow("cat-weight", evidence)) {
    const topCats = [...exposure.categoryExposures]
      .sort((a, b) => b.revenueWeightPct - a.revenueWeightPct)
      .slice(0, 2);
    const catPres = buildCategoryConcentrationTilePresentation(topCats);
    if (catPres) {
      const implication = translateExecutivePhrase(catPres.implication);
      push({
        id: "cat-weight",
        title: catPres.title,
        observationLabel: catPres.observationLabel,
        metric: catPres.observationValue,
        implication,
        subtext: implication,
        strength: "moderate",
        emphasis: "supporting",
      });
    }
  }

  if (!skipExposureTiles && exposure) {
    const archCats = exposure.categoryExposures.filter(
      (x) => x.architectureCompression,
    );
    if (exposureTileShouldShow("cat-arch", evidence) && archCats.length > 0) {
      const c = archCats[0];
      const pres = buildExposureCategoryTilePresentation(
        c.category,
        c.revenueWeightPct,
        "architecture",
      );
      const implication = translateExecutivePhrase(pres.implication);
      push({
        id: `cat-arch-${c.category}`,
        title: pres.title,
        observationLabel: pres.observationLabel,
        metric: pres.observationValue,
        implication,
        subtext: implication,
        benchmarkHint: "In scope",
        strength: "moderate",
        emphasis: "secondary",
      });
    }

    const plCats = exposure.categoryExposures.filter(
      (x) => x.plNbNarrow && !x.architectureCompression,
    );
    if (exposureTileShouldShow("cat-pl", evidence) && plCats.length > 0) {
      const c = plCats[0];
      const pres = buildExposureCategoryTilePresentation(
        c.category,
        c.revenueWeightPct,
        "pl_nb",
      );
      const implication = translateExecutivePhrase(pres.implication);
      push({
        id: `cat-pl-${c.category}`,
        title: pres.title,
        observationLabel: pres.observationLabel,
        metric: pres.observationValue,
        implication,
        subtext: implication,
        benchmarkHint: "In scope",
        strength: "moderate",
        emphasis: "supporting",
      });
    }
  }

  const ordered = tiles
    .slice()
    .sort((a, b) => {
      const rankDiff = metricDisplayRank(a.title) - metricDisplayRank(b.title);
      if (rankDiff !== 0) return rankDiff;
      const emphasisOrder = { primary: 0, secondary: 1, supporting: 2 };
      const ea = emphasisOrder[a.emphasis ?? "supporting"];
      const eb = emphasisOrder[b.emphasis ?? "supporting"];
      if (ea !== eb) return ea - eb;
      const strengthOrder = { strong: 0, moderate: 1, weak: 2 };
      return (
        strengthOrder[a.strength ?? "moderate"] - strengthOrder[b.strength ?? "moderate"]
      );
    })
    .slice(0, max);

  return ordered.map((t, i) => ({
    ...t,
    emphasis: t.emphasis ?? insightTileEmphasis(t.title, t.strength, i),
  }));
}

/** @deprecated Hero uses structured interpretation; kept for legacy compact views. */
export function heroContextChips(
  exec: ExecutiveSummary,
  exposure: OpportunityExposureBundle | null | undefined,
): { label: string; tone: "primary" | "neutral" }[] {
  const chips: { label: string; tone: "primary" | "neutral" }[] = [];
  chips.push({
    label: businessConfidenceLabel(exec.evidenceStrength, exec.topThemes),
    tone: "primary",
  });
  const concentration = businessConcentrationLabel(exposure, exec);
  if (concentration) chips.push({ label: concentration, tone: "primary" });
  return chips.slice(0, 3);
}

/**
 * Synthesizes existing executive fields into a discussion-ready summary.
 * Does not invoke diagnostic engines or alter sizing / evidence logic.
 */
export function buildExecutiveConsultingSummary(
  exec: ExecutiveSummary,
  _implications: string[] = exec.strategicImplications,
  exposure?: OpportunityExposureBundle | null,
  evaluatedRevenuePercent?: number | null,
): ExecutiveConsultingSummary {
  const paragraphs = buildExecutiveBusinessSummaryParagraphs(
    exec,
    exposure ?? exec.opportunityExposure,
    evaluatedRevenuePercent,
  ).map((p) => polishNarrativeText(translateExecutivePhrase(p)));

  if (paragraphs.length === 0 && exec.executiveNarrative.trim()) {
    paragraphs.push(
      polishNarrativeText(translateExecutivePhrase(exec.executiveNarrative.slice(0, 220))),
    );
  }

  const nextSteps =
    exec.nextFocusAreas.length > 0
      ? exec.nextFocusAreas.slice(0, 5).map((s) => polishNarrativeText(s))
      : buildStrategicDiscussionPrompts(exec, exposure ?? exec.opportunityExposure);

  return {
    paragraphs: dedupeNarrativeLines(
      filterGenericNarrativeLines(paragraphs.filter(Boolean)),
    ).slice(0, 4),
    nextSteps: filterGenericNarrativeLines(nextSteps.filter(Boolean)).slice(0, 5),
  };
}
