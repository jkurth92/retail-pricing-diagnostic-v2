import { Card } from "@/components/Card";
import { UPLOAD_READINESS_MODEL } from "@/data/uploadReadinessModel";
import {
  formatCoveragePct,
  formatReadinessState,
  formatScoreSummary,
} from "@/lib/readinessDisplay";

export function DataReadinessPanel() {
  const model = UPLOAD_READINESS_MODEL;

  return (
    <Card>
      <p className="micro-label mb-2">Data readiness</p>
      <h3 className="section-title">Readiness scoring model</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Descriptive scoring structure only. No files are parsed; percentages are
        not calculated in this build.
      </p>
      <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3">
        <p className="text-sm font-medium text-[var(--text-navy)]">
          Overall: {formatReadinessState(model.overallState)}
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {formatScoreSummary(model.score)}
        </p>
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
        {model.summaryNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Field coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(model.score.fieldCoveragePct)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            File coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(model.score.fileCoveragePct)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Row coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(model.score.rowCoveragePct)}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] p-3">
          <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Diagnostic coverage
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
            {formatCoveragePct(model.score.diagnosticCoveragePct)}
          </p>
        </div>
      </div>
      {model.score.dataQualityNotes.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Data quality notes
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[var(--text-muted)]">
            {model.score.dataQualityNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-8">
        <p className="mb-3 text-sm font-medium text-[var(--text-navy)]">
          Diagnostic availability by lever
        </p>
        <div className="space-y-3">
          {model.leverReadiness.map((lever) => (
            <div
              key={lever.leverKey}
              className="rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--text-navy)]">
                  {lever.label}
                </p>
                <span className="text-xs text-[var(--text-muted)]">
                  {lever.availability === "unavailable"
                    ? "Unavailable"
                    : lever.availability === "limited"
                      ? "Limited"
                      : "Available"}
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                State: {formatReadinessState(lever.readinessState)}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Missing required:{" "}
                {lever.missingRequiredFields.length > 0
                  ? lever.missingRequiredFields.join(", ")
                  : "None listed"}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{lever.note}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
