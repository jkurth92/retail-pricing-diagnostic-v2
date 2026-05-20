import { Card } from "@/components/Card";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import {
  formatCoveragePct,
  formatReadinessState,
  formatScoreSummary,
} from "@/lib/readinessDisplay";
import type { NormalizedDatasetSummary } from "@/types/normalization";

type DataReadinessPanelProps = {
  ingestionDataset?: NormalizedDatasetSummary & {
    previewNote?: string;
    score: NormalizedDatasetSummary["score"];
    leverUnlocks: NormalizedDatasetSummary["leverUnlocks"];
  };
};

export function DataReadinessPanel({
  ingestionDataset,
}: DataReadinessPanelProps) {
  const dataset = ingestionDataset ?? buildPlaceholderIngestionDataset();
  const score = dataset.score;

  return (
    <Card>
      <p className="micro-label mb-2">Data readiness</p>
      <h3 className="section-title">Readiness status</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Descriptive readiness from normalization preview. Does not calculate
        opportunity or apply pricing rules.
      </p>
      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3">
        <p className="text-sm font-medium text-[var(--text-navy)]">
          Overall: {formatReadinessState(dataset.readinessSummary)}
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {formatScoreSummary({
            fieldCoveragePct: score.fieldCoveragePct,
            fileCoveragePct: score.fileCoveragePct,
            rowCoveragePct: score.rowCoveragePct,
            diagnosticCoveragePct: score.diagnosticCoveragePct,
            dataQualityNotes: [],
          })}
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Field coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(score.fieldCoveragePct)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            File coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(score.fileCoveragePct)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Row coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(score.rowCoveragePct)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Diagnostic coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(score.diagnosticCoveragePct)}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-[var(--text-navy)]">
          Diagnostic unlock by lever
        </p>
        <div className="space-y-3">
          {dataset.leverUnlocks.map((lever) => (
            <div
              key={lever.leverKey}
              className="rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3"
            >
              <p className="text-sm font-medium text-[var(--text-navy)]">
                {lever.label}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {lever.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
