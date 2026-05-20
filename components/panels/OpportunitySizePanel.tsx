import { Card } from "@/components/Card";
import { DIAGNOSTIC_LEVERS } from "@/types/ui";

const PLACEHOLDER_SECTIONS = [
  "Confidence",
  "Rationale",
  "Recommended actions",
];

export function OpportunitySizePanel() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-light)] px-6 py-5">
        <p className="text-sm font-semibold text-[var(--text-navy)]">
          No opportunity sizing logic has been implemented yet.
        </p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Rules and benchmark assumptions require explicit alignment before
          build.
        </p>
      </div>
      <Card>
        <p className="micro-label mb-2">Opportunity sizing</p>
        <h3 className="section-title">Opportunity Size</h3>
        <div className="mt-6">
          <p className="text-sm font-medium text-[var(--text-navy)]">
            Total opportunity
          </p>
          <div className="mt-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--app-bg)] px-5 py-8 text-sm text-[var(--text-muted)]">
            Total opportunity placeholder — requires alignment before
            implementation.
          </div>
        </div>
        <div className="mt-8">
          <p className="mb-4 text-sm font-medium text-[var(--text-navy)]">
            Lever breakdown
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DIAGNOSTIC_LEVERS.map((lever) => (
              <div
                key={lever}
                className="rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-4"
              >
                <p className="text-sm font-medium text-[var(--text-navy)]">
                  {lever}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  Placeholder — requires alignment before implementation.
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 space-y-4">
          {PLACEHOLDER_SECTIONS.map((section) => (
            <div key={section}>
              <p className="text-sm font-medium text-[var(--text-navy)]">
                {section}
              </p>
              <div className="mt-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--app-bg)] px-5 py-6 text-sm text-[var(--text-muted)]">
                {section} placeholder — requires alignment before
                implementation.
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
