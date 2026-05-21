import { Card } from "@/components/Card";
import type { BenchmarkConcept } from "@/types/benchmark-concepts";
import type { BenchmarkConceptFamily } from "@/types/benchmark-concepts";

type BenchmarkConceptExplorerProps = {
  concepts: BenchmarkConcept[];
  title?: string;
  groupByFamily?: boolean;
};

export function BenchmarkConceptExplorer({
  concepts,
  title = "Benchmark concept families",
  groupByFamily = true,
}: BenchmarkConceptExplorerProps) {
  const grouped = groupByFamily
    ? concepts.reduce<Record<string, BenchmarkConcept[]>>((acc, c) => {
        const key = c.conceptFamily;
        if (!acc[key]) acc[key] = [];
        acc[key].push(c);
        return acc;
      }, {})
    : { All: concepts };

  return (
    <Card>
      <p className="micro-label mb-2">Benchmark concepts</p>
      <h3 className="section-title">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Descriptive concept families for future diagnostics — no thresholds or
        active rules.
      </p>
      <div className="mt-4 space-y-6">
        {Object.entries(grouped).map(([family, items]) => (
          <div key={family}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
              {family as BenchmarkConceptFamily}
            </p>
            <ul className="mt-2 space-y-3">
              {items.map((concept) => (
                <li
                  key={concept.id}
                  className="rounded-lg border border-[var(--border)] bg-white px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[var(--text-navy)]">
                      {concept.conceptName}
                    </h4>
                    <span className="text-xs text-[var(--text-muted)]">
                      {concept.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {concept.description}
                  </p>
                  {concept.relatedPatternFeatures.length > 0 && (
                    <p className="mt-2 text-xs text-[var(--text-navy)]">
                      Pattern features:{" "}
                      {concept.relatedPatternFeatures.join(", ")}
                    </p>
                  )}
                  {concept.futureRuleCandidates.length > 0 && (
                    <p className="mt-1 text-xs text-[var(--accent)]">
                      Future rule candidates:{" "}
                      {concept.futureRuleCandidates.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
