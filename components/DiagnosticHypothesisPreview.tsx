import { Card } from "@/components/Card";
import { DIAGNOSTIC_HYPOTHESIS_THEMES } from "@/data/presentationPlaceholders";

type DiagnosticHypothesisPreviewProps = {
  title?: string;
  filterFamilies?: string[];
};

export function DiagnosticHypothesisPreview({
  title = "Diagnostic hypothesis themes (future engine)",
  filterFamilies,
}: DiagnosticHypothesisPreviewProps) {
  const themes = filterFamilies
    ? DIAGNOSTIC_HYPOTHESIS_THEMES.filter((t) =>
        filterFamilies.includes(t.family),
      )
    : DIAGNOSTIC_HYPOTHESIS_THEMES;

  return (
    <Card>
      <p className="micro-label mb-2">Hypothesis scaffold</p>
      <h3 className="section-title">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Structural themes the engine would eventually test after rule alignment.
        No thresholds or findings are active.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {themes.map((hyp) => (
          <div
            key={hyp.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--text-navy)]">
                {hyp.theme}
              </p>
              <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-[var(--accent)]">
                {hyp.family}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {hyp.description}
            </p>
            <p className="mt-2 text-xs text-[var(--text-navy)]">
              Concepts: {hyp.linkedConcepts.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
