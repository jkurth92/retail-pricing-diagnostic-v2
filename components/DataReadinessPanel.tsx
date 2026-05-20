import { Card } from "@/components/Card";
import { UPLOAD_READINESS_PLACEHOLDER } from "@/data/uploadReadinessPlaceholders";

function availabilityLabel(
  value: "unavailable" | "limited" | "available",
): string {
  if (value === "unavailable") return "Unavailable";
  if (value === "limited") return "Limited";
  return "Available";
}

export function DataReadinessPanel() {
  const model = UPLOAD_READINESS_PLACEHOLDER;

  return (
    <Card>
      <p className="micro-label mb-2">Data readiness</p>
      <h3 className="section-title">Upload readiness model</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Structure for future readiness scoring. Not implemented in this build.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
        {model.summaryNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <div className="mt-6 space-y-4">
        {model.uploads.map((upload) => (
          <div
            key={upload.kind}
            className="rounded-lg border border-[var(--border)] bg-[var(--app-bg)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--text-navy)]">
                {upload.label}
              </p>
              <span className="text-xs text-[var(--text-muted)]">
                Status: Not uploaded
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Diagnostics: {availabilityLabel(upload.diagnosticsAvailability)} ·
              Parsing: Pending alignment
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Required fields
                </p>
                <ul className="mt-1 text-xs text-[var(--text-navy)]">
                  {upload.requiredFields.length > 0 ? (
                    upload.requiredFields.map((f) => (
                      <li key={f.name}>{f.name}</li>
                    ))
                  ) : (
                    <li>None defined yet</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Recommended
                </p>
                <ul className="mt-1 text-xs text-[var(--text-navy)]">
                  {upload.recommendedFields.map((f) => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Optional
                </p>
                <ul className="mt-1 text-xs text-[var(--text-navy)]">
                  {upload.optionalFields.length > 0 ? (
                    upload.optionalFields.map((f) => (
                      <li key={f.name}>{f.name}</li>
                    ))
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              {upload.readinessNote}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
