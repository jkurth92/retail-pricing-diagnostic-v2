import { hypothesisSortScore } from "@/lib/signalPrioritization";
import type { DiagnosticHypothesis } from "@/types/diagnostic-hypotheses";
import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import type { HypothesisRegistryEntry } from "@/data/diagnosticHypotheses";

const ARCHITECTURE_FAMILIES = new Set([
  "Architecture",
  "Premiumization",
]);

export const MAX_SURFACED_HYPOTHESES =
  OUTPUT_CALIBRATION_RULES.maxSurfacedHypotheses;

export function computeSortScore(
  entry: HypothesisRegistryEntry,
  hypothesis: DiagnosticHypothesis,
): number {
  let score = entry.priorityWeight;
  if (ARCHITECTURE_FAMILIES.has(entry.hypothesisFamily)) score += 15;
  if (hypothesis.confidence.level === "high") score += 10;
  if (hypothesis.confidence.level === "medium_high") score += 6;
  if (hypothesis.confidence.level === "medium") score += 2;
  score += hypothesis.supportingSignals.length * 3;
  return score;
}

export function prioritizeHypotheses(
  candidates: DiagnosticHypothesis[],
  registry: Map<string, HypothesisRegistryEntry>,
): {
  surfaced: DiagnosticHypothesis[];
  suppressed: DiagnosticHypothesis[];
} {
  const scored = candidates.map((h) => {
    const entry = registry.get(h.id)!;
    const base = computeSortScore(entry, h);
    return {
      h,
      score: hypothesisSortScore(entry, h, base),
    };
  });
  scored.sort((a, b) => b.score - a.score);

  const surfaced: DiagnosticHypothesis[] = [];
  const suppressed: DiagnosticHypothesis[] = [];

  for (const { h } of scored) {
    if (h.status === "suppressed_low_confidence") {
      suppressed.push(h);
      continue;
    }
    if (surfaced.length >= MAX_SURFACED_HYPOTHESES) {
      suppressed.push({ ...h, status: "suppressed_low_confidence" });
      continue;
    }
    surfaced.push({
      ...h,
      priorityRank: surfaced.length + 1,
      status: "surfaced",
    });
  }

  return { surfaced, suppressed };
}
