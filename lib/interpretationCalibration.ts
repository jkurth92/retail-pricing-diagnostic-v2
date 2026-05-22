/**
 * Interpretation calibration — severity, phrasing, and metric presentation.
 * Does not alter opportunity sizing formulas or trace math.
 */

import { getArchetypeBenchmarkProfile } from "@/lib/benchmarkExpectations";
import type { ArchitectureSignalResult } from "@/lib/architectureSignals";
import type {
  BenchmarkComparisonPosition,
  BenchmarkInterpretation,
} from "@/types/benchmark-calibration";
import type { EvidenceMetric, EvidenceStrength } from "@/types/evidence-computation";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

const THEME_LABEL_MAP: Record<string, string> = {
  "weak premiumization": "Limited premium separation",
  "weak trade-up structure": "Limited trade-up clarity",
  "excessive kvi breadth": "Moderate value concentration",
  "weak kvi concentration": "Modest KVI breadth",
  "architecture compression": "Compressed premium architecture",
  "weak pl/nb monetization separation": "Weak monetization separation",
  "flat monetization ladders": "Moderately flat monetization ladders",
  "architecture incoherence across categories": "Selective architecture inconsistency",
  "over-investment in visible value (kvi)": "Selective visible value investment",
};

const SEVERE_HEADLINE_RE =
  /\b(weak|failure|severe|broken|poor|excessive)\b/i;

export function calibrateThemeDisplayName(
  themeName: string,
  archetypeId?: RetailerArchetypeId,
): string {
  const key = themeName.trim().toLowerCase();
  const mapped = THEME_LABEL_MAP[key];
  if (mapped) return mapped;

  if (SEVERE_HEADLINE_RE.test(themeName) && archetypeId === "mass") {
    return themeName
      .replace(/\bweak\b/gi, "Limited")
      .replace(/\bexcessive\b/gi, "Broad");
  }
  return themeName;
}

export function calibrateEvidenceHeadline(headline: string): string {
  const lower = headline.toLowerCase();
  for (const [from, to] of Object.entries(THEME_LABEL_MAP)) {
    if (lower.includes(from)) {
      return headline.replace(new RegExp(from, "i"), to);
    }
  }
  if (lower.includes("weak premium")) return "Limited premium separation";
  if (lower.includes("narrow private-label")) return "Selective PL/NB compression";
  return headline;
}

export function formatMetricDisplayValue(
  metricId: string,
  rawValue: string,
): string | null {
  if (metricId === "pack_size_consistency") {
    const pct = parseInt(rawValue.replace(/%/g, ""), 10);
    if (!Number.isFinite(pct)) return rawValue;
    if (pct >= 88) return "Pack-size relationships broadly coherent";
    if (pct >= 75) return "High pack-size consistency";
    if (pct < 70) return "Pack-size ladder gaps in select families";
    return "Moderate pack-size consistency";
  }
  if (/^\d{2,3}%$/.test(rawValue.trim())) {
    const pct = parseInt(rawValue, 10);
    if (pct >= 95 && metricId !== "pl_nb_gap" && metricId !== "premium_mainstream_gap") {
      return null;
    }
  }
  return rawValue;
}

export function shouldSuppressMetric(metric: EvidenceMetric): boolean {
  if (metric.id === "pack_size_consistency") {
    const pct = parseInt(metric.value.replace(/%/g, ""), 10);
    if (Number.isFinite(pct) && pct >= 92) return true;
  }
  return false;
}

export function premiumGapSeverity(
  gapPct: number,
  archetypeId: RetailerArchetypeId,
): EvidenceStrength {
  const profile = getArchetypeBenchmarkProfile(archetypeId);
  const weight = profile.architectureIssueWeight;
  const severeAt = archetypeId === "mass" || archetypeId === "discount" ? 11 : 12;
  const moderateAt = archetypeId === "mass" ? 15 : archetypeId === "specialty" ? 14 : 16;
  if (gapPct < severeAt * (1 / weight)) return "strong";
  if (gapPct < moderateAt) return "moderate";
  return "weak";
}

export function plNbAttributionLine(
  arch: ArchitectureSignalResult,
  totalCategories: number,
): string | null {
  const narrow = arch.plNbNarrowCategories ?? [];
  if (narrow.length === 0) return null;

  const names = narrow.slice(0, 3).join(" and ");
  if (narrow.length === 1) {
    return `Narrow PL/NB separation observed in ${names}.`;
  }
  if (totalCategories > 0 && narrow.length < Math.max(2, Math.ceil(totalCategories * 0.45))) {
    return `Overall PL/NB structure appears broadly healthy; select categories (${names}) show narrower separation.`;
  }
  return `PL/NB separation below expected range in ${narrow.length} of ${totalCategories} categories (${names}).`;
}

export function architectureAttributionLine(
  arch: ArchitectureSignalResult,
  totalCategories: number,
): string | null {
  const cats = arch.compressionCategories;
  if (cats.length === 0) return null;
  const names = cats.slice(0, 2).join(" and ");
  if (cats.length === 1) {
    return `Moderately compressed premium architecture in ${names}.`;
  }
  if (totalCategories > 0 && cats.length < Math.ceil(totalCategories * 0.5)) {
    return `Compressed tier spacing in ${names}; broader portfolio spacing appears within typical range.`;
  }
  return `Compressed tier spacing across ${cats.length} measured categories (${names}).`;
}

export function embedBenchmarkPhrase(
  position: BenchmarkComparisonPosition,
  metricLabel: string,
  archetypeName: string,
  category?: string,
): string {
  const ctx = category ? ` in ${category}` : "";
  const shortArchetype = archetypeName.replace(/ retailer$/i, "").trim();

  switch (position) {
    case "below_expected":
      return `${metricLabel}${ctx} is near the low end of expected range for ${shortArchetype} retail.`;
    case "narrower_than_typical":
      return `${metricLabel}${ctx} is moderately compressed relative to typical ${shortArchetype} spacing.`;
    case "broader_than_expected":
      return `${metricLabel}${ctx} is wider than typical ${shortArchetype} architecture — review traffic roles.`;
    case "above_expected":
      return `${metricLabel}${ctx} sits above the typical ${shortArchetype} band — interpret with category role.`;
    case "consistent_with_leading":
      return `${metricLabel}${ctx} is broadly consistent with leading ${shortArchetype} / hybrid architecture.`;
    default:
      return `${metricLabel}${ctx} sits within the expected ${shortArchetype} range.`;
  }
}

export function deriveOverallEvidenceStrength(
  metrics: EvidenceMetric[],
  arch: ArchitectureSignalResult,
  categoriesAnalyzed: string[],
  interpretations?: BenchmarkInterpretation[],
): EvidenceStrength {
  const calibrated = metrics.filter((m) => !shouldSuppressMetric(m));
  const strong = calibrated.filter((m) => m.strength === "strong").length;
  const moderate = calibrated.filter((m) => m.strength === "moderate").length;
  const categoryCount = new Set(categoriesAnalyzed.filter(Boolean)).size;

  const belowCount =
    interpretations?.filter(
      (i) =>
        i.position === "below_expected" || i.position === "narrower_than_typical",
    ).length ?? 0;
  const withinCount =
    interpretations?.filter((i) => i.position === "within_expected").length ?? 0;

  const isolatedPl =
    arch.plNbNarrowCategories.length > 0 &&
    categoryCount > 0 &&
    arch.plNbNarrowCategories.length < Math.ceil(categoryCount * 0.45);

  let score = strong * 2 + moderate;
  if (categoryCount >= 5) score += 0.5;
  if (belowCount >= 2) score += 1;
  if (withinCount >= 2) score -= 1.5;
  if (isolatedPl) score -= 1;

  if (score >= 5) return "strong";
  if (score >= 3) return "moderate";
  return "weak";
}

export function softenExecutiveDriverPhrase(text: string): string {
  return text
    .replace(/\bweak premiumization\b/gi, "limited premium separation")
    .replace(/\bweak monetization separation\b/gi, "selective monetization compression")
    .replace(/\bsignificant monetization weakness\b/gi, "selective architecture compression")
    .replace(/\bbroad structural opportunity\b/gi, "moderate structural opportunity")
    .replace(/\bweak pl\/nb\b/gi, "selective PL/NB compression")
    .replace(/\bappears below the expected range\b/gi, "below expected spacing")
    .replace(/\bfor a [A-Za-z /-]+ retailer with [A-Za-z-]+ posture\.?/gi, "")
    .trim();
}

export function calibrateMetricList(metrics: EvidenceMetric[]): EvidenceMetric[] {
  const out: EvidenceMetric[] = [];
  for (const m of metrics) {
    if (shouldSuppressMetric(m)) continue;
    const value = formatMetricDisplayValue(m.id, m.value);
    if (value === null) continue;
    out.push({ ...m, value });
  }
  return out;
}

