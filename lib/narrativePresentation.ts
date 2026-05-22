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
  classifyTextFamilyRank,
  filterGenericNarrativeLines,
  orderThemesByNarrativeDominance,
  sortMetricsByFamilyPriority,
} from "@/lib/signalPrioritization";
import { shortenThemeTitle } from "@/lib/executiveUxHelpers";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
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
  subtext: string;
  benchmarkHint?: string;
  strength?: "strong" | "moderate" | "weak";
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
  if (/weak pl\/nb|pl\/nb separation/i.test(s)) return "Weak monetization separation";
  if (/compressed premium|premium spacing|tier spacing|architecture compression/i.test(s))
    return "Compressed premium architecture";
  if (/kvi|visible value|value concentration/i.test(s)) return "Broad value concentration";
  if (/trade-up|premium\/mainstream|tier/i.test(s)) return "Limited trade-up clarity";
  if (/pl\/nb/i.test(s)) return "Narrow PL/NB separation";
  return shortenThemeTitle(s.split(".")[0] ?? s);
}

function impactFromText(text: string): "high" | "medium" {
  if (/compressed|weak|below|broad kvi|~\d+% of in-scope/i.test(text)) return "high";
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
    const interpretation = theme
      ? softenBenchmarkPhrase(theme.summary).slice(0, 120)
      : softenBenchmarkPhrase(raw).slice(0, 120);
    let benchmarkHint: string | undefined;
    if (/below expected|compressed vs benchmark|low-end/i.test(interpretation)) {
      benchmarkHint = "Vs benchmark";
    } else if (exec.retailerProfile.archetype) {
      benchmarkHint = exec.retailerProfile.archetype.split(" ")[0];
    }
    cards.push({
      id,
      title,
      interpretation: interpretation || "Structural signal in measured upload proxy.",
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

function metricToInsight(m: ComputedEvidenceBundle["metrics"][0]): InsightSourceTile | null {
  const subtext =
    m.strength === "strong"
      ? "Strong measured signal in upload proxy."
      : m.strength === "moderate"
        ? "Moderate signal — directionally meaningful."
        : "Directional signal — validate with client data.";

  return {
    id: m.id,
    title: m.label,
    metric: m.value,
    subtext,
    strength: m.strength,
  };
}

export function buildInsightSourceTiles(
  exec: ExecutiveSummary,
  exposure: OpportunityExposureBundle | null | undefined,
  evidence: ComputedEvidenceBundle | null | undefined,
  max = 8,
): InsightSourceTile[] {
  const tiles: InsightSourceTile[] = [];
  const seen = new Set<string>();

  const push = (tile: InsightSourceTile) => {
    const key = `${tile.title}-${tile.metric}`;
    if (seen.has(key) || tiles.length >= max) return;
    seen.add(key);
    tiles.push(tile);
  };

  if (evidence?.metrics) {
    for (const m of sortMetricsByFamilyPriority(evidence.metrics)) {
      const t = metricToInsight(m);
      if (t) push(t);
    }
  }

  for (const line of filterGenericNarrativeLines(exec.supportingEvidenceMetrics)) {
    const soft = softenBenchmarkPhrase(line);
    const colon = soft.indexOf(":");
    if (colon > 0) {
      push({
        id: `sem-${tiles.length}`,
        title: soft.slice(0, colon).trim(),
        metric: soft.slice(colon + 1).trim(),
        subtext: "From measured structural evidence.",
        benchmarkHint: /benchmark|expected|typical/i.test(soft) ? "Contextual" : undefined,
      });
    } else if (soft.length > 10) {
      push({
        id: `sem-${tiles.length}`,
        title: shortenThemeTitle(soft.slice(0, 50)),
        metric: "",
        subtext: soft.length > 50 ? soft : "Commercial observation from diagnostic scope.",
      });
    }
  }

  if (exposure) {
    const topCats = [...exposure.categoryExposures]
      .sort((a, b) => b.revenueWeightPct - a.revenueWeightPct)
      .slice(0, 3);
    if (topCats.length >= 2) {
      const names = topCats.map((c) => c.category).join(" + ");
      const pct = topCats.reduce((s, c) => s + c.revenueWeightPct, 0);
      push({
        id: "cat-weight",
        title: "Category concentration",
        metric: `${names} · ~${Math.round(pct)}% in-scope revenue`,
        subtext: "Largest contributors to exposure-weighted opportunity framing.",
      });
    }

    for (const c of exposure.categoryExposures.filter(
      (x) => x.architectureCompression || x.plNbNarrow,
    ).slice(0, 2)) {
      push({
        id: `cat-${c.category}`,
        title: c.architectureCompression ? "Tier spacing" : "PL/NB gap",
        metric: `${c.category} · ${c.revenueWeightPct}% revenue weight`,
        subtext: c.architectureCompression
          ? "Compressed spacing in measured categories."
          : "Narrow private-label separation.",
        benchmarkHint: "In scope",
        strength: "moderate",
      });
    }
  }

  for (const line of exec.causalFramingLines.slice(0, 2)) {
    const soft = softenBenchmarkPhrase(line);
    push({
      id: `causal-${tiles.length}`,
      title: shortenThemeTitle(soft.split(".")[0] ?? soft),
      metric: "",
      subtext: soft,
    });
  }

  return tiles
    .slice()
    .sort((a, b) => classifyTextFamilyRank(a.title) - classifyTextFamilyRank(b.title))
    .slice(0, max);
}

export function heroContextChips(
  exec: ExecutiveSummary,
  exposure: OpportunityExposureBundle | null | undefined,
): { label: string; tone: "primary" | "neutral" }[] {
  const chips: { label: string; tone: "primary" | "neutral" }[] = [];

  const conf =
    exec.evidenceStrength === "strong"
      ? "High confidence"
      : exec.evidenceStrength === "moderate"
        ? "Medium confidence"
        : "Directional confidence";
  chips.push({ label: conf, tone: "primary" });

  if (exposure && exposure.monetizableExposurePct > 0) {
    chips.push({
      label: `~${exposure.monetizableExposurePct}% monetizable exposure`,
      tone: "primary",
    });
  }

  const archLed = exec.primaryDrivers.some((d) =>
    /architecture|premium|tier|spacing/i.test(d),
  );
  if (archLed) chips.push({ label: "Architecture-led", tone: "neutral" });

  const profile = `${exec.retailerProfile.archetype} · ${exec.retailerProfile.posture}`;
  chips.push({ label: profile, tone: "neutral" });

  return chips.slice(0, 4);
}

function discussionStepFromImplication(line: string): string {
  const clean = polishNarrativeText(line);
  if (!clean) return "";
  const lower = clean.charAt(0).toLowerCase() + clean.slice(1);
  return `Validate and scope implications of ${lower.replace(/\.$/, "")} with the client's category and role data.`;
}

/**
 * Synthesizes existing executive fields into a discussion-ready summary.
 * Does not invoke diagnostic engines or alter sizing / evidence logic.
 */
export function buildExecutiveConsultingSummary(
  exec: ExecutiveSummary,
  implications: string[] = exec.strategicImplications,
): ExecutiveConsultingSummary {
  const paragraphs: string[] = [];

  const opportunityParts = [
    exec.opportunityHeadline,
    exec.marginOpportunitySummary,
  ].filter((s) => s?.trim());
  if (opportunityParts.length > 0) {
    paragraphs.push(polishNarrativeText(opportunityParts.join(" ")));
  } else if (exec.executiveNarrative.trim()) {
    paragraphs.push(polishNarrativeText(exec.executiveNarrative.slice(0, 420)));
  }

  const implicationParts = [
    exec.strategicImplicationOneLiner,
    ...implications.slice(0, 3),
  ].filter((s) => s?.trim());
  if (implicationParts.length > 0) {
    const joined = implicationParts
      .map((s, i) => (i === 0 ? s : s.replace(/\.$/, "")))
      .join(implicationParts.length > 1 ? " " : "");
    paragraphs.push(polishNarrativeText(joined));
  }

  if (exec.primaryDrivers.length > 0) {
    const drivers = exec.primaryDrivers
      .slice(0, 3)
      .map((d) => softenBenchmarkPhrase(d))
      .join("; ");
    paragraphs.push(
      polishNarrativeText(
        `Primary structural drivers in scope include ${drivers}. ${exec.confidenceSummary}`,
      ),
    );
  } else if (exec.confidenceSummary.trim()) {
    paragraphs.push(polishNarrativeText(exec.confidenceSummary));
  }

  const nextSteps =
    exec.nextFocusAreas.length > 0
      ? exec.nextFocusAreas.slice(0, 5).map((s) => polishNarrativeText(s))
      : implications
          .slice(0, 4)
          .map(discussionStepFromImplication)
          .filter(Boolean);

  if (nextSteps.length === 0 && exec.topThemes.length > 0) {
    for (const theme of exec.topThemes.slice(0, 3)) {
      nextSteps.push(
        `Align on ${theme.themeName.toLowerCase()} — confirm evidence and commercial boundaries before sizing actions.`,
      );
    }
  }

  return {
    paragraphs: filterGenericNarrativeLines(paragraphs.filter(Boolean)).slice(0, 4),
    nextSteps: filterGenericNarrativeLines(nextSteps.filter(Boolean)).slice(0, 5),
  };
}
