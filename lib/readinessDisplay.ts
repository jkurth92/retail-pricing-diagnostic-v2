import { readinessStateLabel } from "@/data/diagnosticAvailabilityMatrix";
import type { ReadinessScoreMetrics, UploadReadinessState } from "@/types/data-readiness";

export function formatReadinessState(state: UploadReadinessState): string {
  return readinessStateLabel(state);
}

export function formatCoveragePct(value: number | null): string {
  if (value === null) return "Pending";
  return `${value.toFixed(1)}%`;
}

export function formatScoreSummary(score: ReadinessScoreMetrics): string {
  return [
    `Field coverage: ${formatCoveragePct(score.fieldCoveragePct)}`,
    `File coverage: ${formatCoveragePct(score.fileCoveragePct)}`,
    `Row coverage: ${formatCoveragePct(score.rowCoveragePct)}`,
    `Diagnostic coverage: ${formatCoveragePct(score.diagnosticCoveragePct)}`,
  ].join(" · ");
}
