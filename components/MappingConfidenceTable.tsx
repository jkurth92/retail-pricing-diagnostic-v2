import { Card } from "@/components/Card";
import type { ColumnCandidate } from "@/types/column-mapping";

type MappingConfidenceTableProps = {
  title?: string;
  mappings: ColumnCandidate[];
};

function methodLabel(method: string): string {
  return method.replace(/_/g, " ");
}

export function MappingConfidenceTable({
  title = "Mapping review queue",
  mappings,
}: MappingConfidenceTableProps) {
  const reviewQueue = mappings.filter(
    (m) => m.requiresReview || m.mappingMethod === "unmapped",
  );

  return (
    <Card>
      <p className="micro-label mb-2">Column mapping</p>
      <h3 className="section-title">{title}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
              <th className="py-2 pr-4">Source column</th>
              <th className="py-2 pr-4">Canonical field</th>
              <th className="py-2 pr-4">Method</th>
              <th className="py-2 pr-4">Confidence</th>
              <th className="py-2">Review</th>
            </tr>
          </thead>
          <tbody>
            {reviewQueue.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 text-[var(--text-muted)]"
                >
                  No columns pending review in preview.
                </td>
              </tr>
            ) : (
              reviewQueue.map((row) => (
                <tr
                  key={row.sourceColumn}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-navy)]">
                    {row.sourceColumn}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-navy)]">
                    {row.normalizedField ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">
                    {methodLabel(row.mappingMethod)}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">
                    {row.confidence !== null
                      ? `${(row.confidence * 100).toFixed(0)}%`
                      : "—"}
                  </td>
                  <td className="py-3 text-[var(--text-muted)]">
                    {row.requiresReview ? "Required" : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
