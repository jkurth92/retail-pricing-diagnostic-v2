import { Card } from "@/components/Card";
import type { LeverDiagnosticUnlock } from "@/types/ingestion";

type DiagnosticAvailabilityMatrixProps = {
  leverUnlocks: LeverDiagnosticUnlock[];
};

function statusBadge(status: string): string {
  switch (status) {
    case "ready":
      return "Ready for rule alignment";
    case "available":
      return "Available";
    case "limited":
      return "Limited";
    default:
      return "Unavailable";
  }
}

export function DiagnosticAvailabilityMatrix({
  leverUnlocks,
}: DiagnosticAvailabilityMatrixProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Diagnostic availability</p>
      <h3 className="section-title">Diagnostic availability matrix</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Unlock status reflects normalized field coverage only. Does not imply
        opportunity or benchmark conclusions.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="py-2 pr-4">Diagnostic</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {leverUnlocks.map((row) => (
              <tr
                key={row.leverKey}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="py-3 pr-4 font-medium text-[var(--text-navy)]">
                  {row.label}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      row.status === "unavailable"
                        ? "bg-[var(--app-bg)] text-[var(--text-muted)]"
                        : row.status === "limited"
                          ? "border border-[var(--border)] text-[var(--text-navy)]"
                          : "bg-[var(--accent-light)] text-[var(--accent)]"
                    }`}
                  >
                    {statusBadge(row.status)}
                  </span>
                </td>
                <td className="py-3 text-[var(--text-muted)]">{row.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
