/**
 * Diagnostic narrative refinement — phrasing, confidence alignment, and executive UX copy.
 * Does not alter opportunity sizing, benchmarks, signal prioritization, or interpretation math.
 */

import type { ComputedEvidenceBundle, EvidenceStrength } from "@/types/evidence-computation";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { KviSignalResult } from "@/lib/kviSignals";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import { consultantKviDiagnosis } from "@/lib/insightTranslation";
import { isGenericFallbackPhrase } from "@/lib/signalPrioritization";

const REPEAT_PHRASE_RE =
  /\b(architecture-led|bounded and explainable|validate category evidence|before tactical moves|structural pricing themes)\b/gi;

export type ValueConcentrationEvidence = {
  kviRevenueSharePct?: number;
  broadKviBreadth?: boolean;
  kviCategoryCount?: number;
  weakKviConcentration?: boolean;
};

/** Calibrated KVI / value-concentration label — avoids overstating "broad" without evidence. */
export function calibrateValueConcentrationPhrase(
  kvi: ValueConcentrationEvidence,
): string | null {
  const pct = kvi.kviRevenueSharePct ?? 0;
  const catCount = kvi.kviCategoryCount ?? 0;

  if (pct < 10 && !kvi.broadKviBreadth && catCount === 0) return null;

  const diagnosis = consultantKviDiagnosis({
    kviRevenueSharePct: pct,
    broadKviBreadth: kvi.broadKviBreadth,
    weakKviConcentration: kvi.weakKviConcentration,
    kviCategoryCount: catCount,
  });
  if (diagnosis) {
    const short =
      pct >= 24 && catCount >= 3
        ? "Discounts spread too widely"
        : kvi.weakKviConcentration || (pct >= 8 && pct < 14)
          ? "Deals not focused enough"
          : catCount <= 2 && pct < 18
            ? "Low prices focused in a few areas"
            : "Lower prices not focused enough";
    return short;
  }

  if (kvi.broadKviBreadth && pct >= 24 && catCount >= 3) {
    return "Discounts spread too widely";
  }
  if (kvi.broadKviBreadth && pct >= 18) {
    return "Lower prices spread across many items";
  }
  if (catCount <= 2 && pct > 0 && pct < 18) {
    return "Low prices focused in a few areas";
  }
  if (kvi.weakKviConcentration || (pct >= 8 && pct < 14)) {
    return "Deals not focused enough";
  }
  if (pct >= 14 && pct < 22) {
    return "Some categories anchor low prices";
  }
  if (catCount >= 1 && pct < 18) {
    return "Low prices focused in a few categories";
  }
  return "Lower prices not focused enough";
}

export function kviEvidenceFromResult(kvi: KviSignalResult): ValueConcentrationEvidence {
  return {
    kviRevenueSharePct: kvi.kviRevenueSharePct,
    broadKviBreadth: kvi.broadKviBreadth,
    kviCategoryCount: kvi.kviConcentrationByCategory.filter((c) => c.sharePct >= 15)
      .length,
    weakKviConcentration: kvi.weakKviConcentration,
  };
}

export function calibrateKviExposureDriver(
  kviAffectedRevenuePct: number,
  categoryCount?: number,
): string | null {
  if (kviAffectedRevenuePct < 12) return null;
  return (
    calibrateValueConcentrationPhrase({
      kviRevenueSharePct: kviAffectedRevenuePct,
      broadKviBreadth: kviAffectedRevenuePct >= 22 && (categoryCount ?? 0) >= 3,
      kviCategoryCount: categoryCount,
    }) ?? (kviAffectedRevenuePct >= 22
      ? "Value spread too broadly"
      : "Value communication diffuse")
  );
}

const MEDIUM_PLUS: DiagnosticConfidenceLevel[] = ["medium", "medium_high", "high"];

export function summarizeThemeConfidence(themes: ExecutiveTheme[]): {
  mediumOrHigherCount: number;
  total: number;
  maxLevel: DiagnosticConfidenceLevel;
} {
  const levels = themes.map((t) => t.confidence.level);
  const mediumOrHigherCount = levels.filter((l) => MEDIUM_PLUS.includes(l)).length;
  const order: DiagnosticConfidenceLevel[] = ["low", "medium", "medium_high", "high"];
  const maxLevel =
    levels.reduce<DiagnosticConfidenceLevel>(
      (best, l) => (order.indexOf(l) > order.indexOf(best) ? l : best),
      "low",
    ) ?? "low";
  return { mediumOrHigherCount, total: themes.length, maxLevel };
}

/** Portfolio-level confidence copy aligned with theme-level confidence. */
export function buildAlignedConfidenceSummary(
  primaryThemes: ExecutiveTheme[],
  evidenceStrength?: EvidenceStrength,
): string {
  const { mediumOrHigherCount, total, maxLevel } = summarizeThemeConfidence(primaryThemes);

  if (total === 0) {
    if (evidenceStrength === "strong" || evidenceStrength === "moderate") {
      return "High directional confidence from structural upload signals, though no storyline theme reached medium-or-higher confidence.";
    }
    return "Directional confidence only — no primary themes met medium-or-higher confidence.";
  }

  if (mediumOrHigherCount === 0) {
    if (evidenceStrength === "strong") {
      return "Moderate directional confidence on measured structure; individual themes remain category-specific.";
    }
    if (evidenceStrength === "moderate") {
      return "Moderate portfolio confidence with selective structural signals; most themes remain category-specific.";
    }
    return "Directional confidence — primary themes did not reach medium-or-higher confidence.";
  }

  const coverage = primaryThemes[0]?.confidence.evidenceCoverage ?? "partial";
  if (mediumOrHigherCount === total) {
    return `${mediumOrHigherCount} of ${total} primary themes carry medium-or-higher confidence (max ${maxLevel.replace(/_/g, "-")}). Evidence coverage: ${coverage}.`;
  }
  if (evidenceStrength === "strong" && mediumOrHigherCount < total) {
    return `Moderate directional confidence overall; ${mediumOrHigherCount} of ${total} primary themes are medium-or-higher, with others category-specific.`;
  }
  return `${mediumOrHigherCount} of ${total} primary themes carry medium-or-higher confidence. Evidence coverage: ${coverage}.`;
}

export function buildPortfolioConfidenceChipLabel(
  evidenceStrength: EvidenceStrength,
  themes: ExecutiveTheme[],
): string {
  const { mediumOrHigherCount, total, maxLevel } = summarizeThemeConfidence(themes);
  const sparseCoverage = themes.some(
    (t) => t.confidence.evidenceCoverage === "sparse" || t.confidence.evidenceCoverage === "partial",
  );

  if (total > 0 && mediumOrHigherCount === 0) {
    if (evidenceStrength === "strong") return "Moderate directional confidence";
    return "Directional confidence";
  }

  if (evidenceStrength === "strong" && maxLevel === "high" && !sparseCoverage && mediumOrHigherCount >= total) {
    return "High confidence";
  }
  if (evidenceStrength === "strong" || mediumOrHigherCount >= Math.ceil(total / 2)) {
    return "Moderate directional confidence";
  }
  if (evidenceStrength === "moderate") {
    return "Moderate confidence";
  }
  return "Directional confidence";
}

function normalizeForDedupe(text: string): string {
  return text
    .toLowerCase()
    .replace(REPEAT_PHRASE_RE, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupeNarrativeLines(lines: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || isGenericFallbackPhrase(t)) continue;
    const key = normalizeForDedupe(t);
    if (key.length < 12 || seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export function refineStrategicImplicationOneLiner(
  evidence: ComputedEvidenceBundle,
  primaryThemes: ExecutiveTheme[],
): string {
  const archTheme = primaryThemes.find((t) => t.themeFamily === "Architecture");
  const kviTheme = primaryThemes.find((t) => t.themeFamily === "KVI");
  const hasArchDriver = evidence.primaryDrivers.some((d) =>
    /architecture|premium|tier|spacing|compression/i.test(d),
  );
  const hasKviDriver = evidence.primaryDrivers.some((d) =>
    /kvi|value concentration|visible value/i.test(d),
  );

  if (evidence.evidenceStrength === "weak") {
    return "Selective architecture compression remains the lead interpretation; ranges stay directional until upload alignment completes.";
  }

  if (hasArchDriver && hasKviDriver) {
    return "Selective architecture compression and visible value concentration remain the primary opportunities.";
  }

  if (hasArchDriver || archTheme) {
    const localized = evidence.summaries.find((s) =>
      /compressed.*in [A-Z]/i.test(s),
    );
    if (localized) {
      return "The evidence supports a bounded, architecture-led opportunity rather than severe portfolio-wide monetization weakness.";
    }
    return "Category-level tier-spacing gaps are present, but the retailer remains directionally coherent overall.";
  }

  if (evidence.primaryDrivers.some((d) => /pl\/nb|monetization/i.test(d))) {
    return "Monetization separation gaps are selective; architecture and trip-role structure should frame the discussion.";
  }

  if (kviTheme || hasKviDriver) {
    return "Value investment appears selective; confirm whether concentration is intentional before broad price-point moves.";
  }

  return "Structural pricing opportunity is bounded and architecture-led rather than a portfolio-wide monetization reset.";
}

/** Consultant-style executive summary sentence with correct grammar. */
export function buildConsultingEvidenceSentence(drivers: string[]): string {
  const safe = drivers.filter(
    (d): d is string => typeof d === "string" && d.trim().length > 0,
  );
  const arch = safe.filter((d) =>
    /architecture|premium|tier|spacing|compression|pl\/nb|monetization/i.test(d),
  );
  const kvi = safe.filter((d) =>
    /kvi|value concentration|visible value/i.test(d),
  );
  const other = safe.filter((d) => !arch.includes(d) && !kvi.includes(d));
  const lead = [...arch, ...other].slice(0, 2);
  const support = kvi.slice(0, 1);

  if (lead.length === 0 && support.length === 0) {
    return "The primary opportunity appears concentrated in measured structural pricing gaps.";
  }
  if (lead.length === 0 && support.length >= 1) {
    return `The primary opportunity appears concentrated in ${support[0].toLowerCase()}.`;
  }
  if (lead.length >= 1 && support.length >= 1) {
    const leadPhrase =
      lead.length === 1 ? lead[0] : `${lead[0]} and ${lead[1]}`;
    return `The primary opportunity appears concentrated in ${leadPhrase.toLowerCase()}, with ${support[0].toLowerCase()} as a supporting factor.`;
  }
  if (lead.length === 1) {
    return `The primary opportunity appears concentrated in ${lead[0].toLowerCase()}.`;
  }
  if (lead.length >= 2) {
    return `The primary opportunity appears concentrated in ${lead[0].toLowerCase()} and ${lead[1].toLowerCase()}.`;
  }
  return "The primary opportunity appears concentrated in measured structural pricing gaps.";
}

export function buildStrategicDiscussionPrompts(
  exec: ExecutiveSummary,
  exposure?: OpportunityExposureBundle | null,
): string[] {
  const steps: string[] = [];
  const seen = new Set<string>();

  const push = (s: string) => {
    const t = s.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    steps.push(t);
  };

  const archCats =
    exposure?.categoryExposures.filter((c) => c.architectureCompression) ?? [];
  if (archCats.length > 0) {
    const names = archCats
      .slice(0, 2)
      .map((c) => c.category)
      .join(" and ");
    push(`Assess whether premium architecture should widen in ${names}.`);
    if (archCats.length === 1) {
      push(
        `Determine whether ${archCats[0].category} tier spacing should stay tight for traffic roles or allow broader trade-up.`,
      );
    }
  } else if (
    exec.primaryDrivers.some((d) => /architecture|premium|tier/i.test(d))
  ) {
    push(
      "Determine which categories should retain tighter trade-up spacing versus broader monetization.",
    );
  }

  const kviDriver = exec.primaryDrivers.find((d) =>
    /kvi|value concentration|visible value/i.test(d),
  );
  if (kviDriver && !/modest|selective|localized|traffic-category/i.test(kviDriver)) {
    push(
      "Determine whether current value investment reflects intentional strategy or legacy positioning.",
    );
  } else if (kviDriver) {
    push(
      "Review whether modest visible value investment is aligned to the right traffic-driving categories.",
    );
  }

  const plCats =
    exposure?.categoryExposures.filter((c) => c.plNbNarrow) ?? [];
  if (plCats.length > 0) {
    const names = plCats
      .slice(0, 2)
      .map((c) => c.category)
      .join(" and ");
    push(`Clarify PL/NB separation expectations in ${names} versus the rest of the portfolio.`);
  }

  const posture = exec.retailerProfile.posture;
  const archetype = exec.retailerProfile.archetype;
  if (posture && archetype && archCats.length > 0) {
    push(
      `Pressure-test whether the ${archetype} / ${posture} posture should preserve or widen selective tier gaps in ${archCats[0].category}.`,
    );
  }

  for (const theme of exec.topThemes.slice(0, 2)) {
    if (theme.themeFamily === "Governance" || theme.themeFamily === "RoleAlignment") {
      continue;
    }
    const name = theme.themeName.toLowerCase();
    if (/architecture|premium|compression/i.test(name)) {
      push(
        `Pressure-test tier-spacing economics in categories tied to ${theme.themeName.toLowerCase()}.`,
      );
    }
  }

  return steps.slice(0, 5);
}

export type InsightEmphasis = "primary" | "secondary" | "supporting";

export function metricDisplayRank(title: string, metricId?: string): number {
  const t = `${title} ${metricId ?? ""}`.toLowerCase();
  if (/tier spacing|avg tier|architecture/i.test(t)) return 1;
  if (/premium.*mainstream|premium\/mainstream/i.test(t)) return 2;
  if (/entry.*mainstream|entry\/mainstream/i.test(t)) return 3;
  if (/pl\/nb|private-label|monetization/i.test(t)) return 4;
  if (/categories shaping|category concentration|in-scope/i.test(t)) return 5;
  if (/kvi|visible value/i.test(t)) return 6;
  return 7;
}

export function insightTileEmphasis(
  title: string,
  strength: "strong" | "moderate" | "weak" | undefined,
  index: number,
): InsightEmphasis {
  const rank = title.toLowerCase();
  const displayRank = metricDisplayRank(title);
  const isKvi = /kvi|value concentration|visible value/i.test(rank);
  if (isKvi) return "supporting";
  if (displayRank <= 2 && strength === "strong" && index < 2) return "primary";
  if (displayRank <= 4 && strength !== "weak") {
    return index === 0 && displayRank <= 3 ? "primary" : "secondary";
  }
  if (/categories shaping|category concentration/i.test(rank)) return "supporting";
  if (strength === "strong" && index < 1) return "secondary";
  return "supporting";
}
