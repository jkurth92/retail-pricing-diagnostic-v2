import { Card } from "@/components/Card";
import { formatReadinessState } from "@/lib/readinessDisplay";
import type { NormalizedDatasetSummary } from "@/types/normalization";

type IngestionUploadSummaryProps = {
  dataset: NormalizedDatasetSummary & { previewNote: string };
};

export function IngestionUploadSummary({ dataset }: IngestionUploadSummaryProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Ingestion summary</p>
      <h3 className="section-title">Upload summary</h3>
      <p className="mt-2 rounded-md border border-[var(--accent)] bg-[var(--accent-light)] px-4 py-3 text-sm text-[var(--text-navy)]">
        {dataset.previewNote}
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Files in preview
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {dataset.uploadedFiles.length}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Normalized fields
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {dataset.normalizedFields.length}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Readiness
          </dt>
          <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
            {formatReadinessState(dataset.readinessSummary)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Field coverage
          </dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {dataset.score.fieldCoveragePct !== null
              ? `${dataset.score.fieldCoveragePct}%`
              : "Pending"}
          </dd>
        </div>
      </dl>
      {dataset.missingFields.length > 0 ? (
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Missing required canonical fields:{" "}
          <span className="font-medium text-[var(--text-navy)]">
            {dataset.missingFields.join(", ")}
          </span>
        </p>
      ) : null}
    </Card>
  );
}
