import type { UploadFileReadinessCard as UploadFileReadinessCardModel } from "@/types/data-readiness";
import { formatReadinessState } from "@/lib/readinessDisplay";
import { LEVER_LABEL_BY_KEY } from "@/types/ui";

type UploadFileReadinessCardProps = {
  upload: UploadFileReadinessCardModel;
};

function availabilityLabel(value: string): string {
  if (value === "unavailable") return "Unavailable";
  if (value === "limited") return "Limited";
  return "Available";
}

export function UploadFileReadinessCard({ upload }: UploadFileReadinessCardProps) {
  return (
    <div className="card-surface flex min-h-[220px] flex-col p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--text-navy)]">
          {upload.label}
        </p>
        <span className="rounded-full border border-[var(--border)] bg-[var(--app-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-muted)]">
          {formatReadinessState(upload.readinessState)}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
        {upload.purpose}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)]">
          {upload.normalizationLabel}
        </span>
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">
          Diagnostics: {availabilityLabel(upload.diagnosticsAvailability)}
        </span>
      </div>
      {upload.unlocksDiagnostics.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Unlocks diagnostics (when ready)
          </p>
          <p className="mt-1 text-xs text-[var(--text-navy)]">
            {upload.unlocksDiagnostics
              .map((k) => LEVER_LABEL_BY_KEY[k])
              .join(", ")}
          </p>
        </div>
      ) : null}
      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          Missing required fields
        </p>
        <p className="mt-1 text-xs text-[var(--text-navy)]">
          {upload.requiredFieldsMissing.length > 0
            ? upload.requiredFieldsMissing.join(", ")
            : "None (placeholder — no upload)"}
        </p>
      </div>
      {upload.recommendedFieldsMissing.length > 0 ? (
        <div className="mt-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Missing recommended fields
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {upload.recommendedFieldsMissing.join(", ")}
          </p>
        </div>
      ) : null}
      <p className="mt-auto pt-4 text-xs text-[var(--text-muted)]">
        {upload.readinessNote}
      </p>
    </div>
  );
}
