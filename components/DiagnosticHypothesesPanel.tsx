"use client";

import { Card } from "@/components/Card";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";

const CONFIDENCE_STYLES: Record<
  DiagnosticConfidenceLevel,
  string
> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-50 text-amber-900 border-amber-200",
  medium_high: "bg-sky-50 text-sky-900 border-sky-200",
  high: "bg-emerald-50 text-emerald-900 border-emerald-200",
};

function confidenceLabel(level: DiagnosticConfidenceLevel): string {
  return level.replace("_", " ");
}

type DiagnosticHypothesesPanelProps = {
  output: DiagnosticHypothesisOutput;
  title?: string;
  showArchitectureNote?: boolean;
};

export function DiagnosticHypothesesPanel({
  output,
  title = "Prioritized structural hypotheses",
  showArchitectureNote = true,
}: DiagnosticHypothesesPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <p className="micro-label mb-2">Diagnostic hypothesis engine</p>
        <h3 className="section-title">{title}</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {output.guardrailMessage}
        </p>
        {showArchitectureNote && (
          <p className="mt-2 text-xs font-medium text-[var(--accent)]">
            {output.architectureFirstNote}
          </p>
        )}
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Engine v{output.engineVersion} · {output.hypotheses.length} surfaced
          {output.suppressedCount > 0 &&
            ` · ${output.suppressedCount} suppressed`}
        </p>
      </Card>

      {output.hypotheses.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--text-muted)]">
            No hypotheses met confidence and signal thresholds for the current
            context. Adjust archetype, objectives, or complete evidence preview.
          </p>
        </Card>
      ) : (
        <ol className="space-y-5">
          {output.hypotheses.map((hyp) => (
            <li key={hyp.id}>
              <Card className="border-l-4 border-l-[var(--accent)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      #{hyp.priorityRank}
                    </span>
                    <h4 className="mt-1 text-lg font-semibold text-[var(--text-navy)]">
                      {hyp.hypothesisName}
                    </h4>
                    <span className="mt-1 inline-block rounded bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                      {hyp.hypothesisFamily}
                    </span>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${CONFIDENCE_STYLES[hyp.confidence.level]}`}
                  >
                    {confidenceLabel(hyp.confidence.level)} confidence
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[var(--text-navy)]">
                  {hyp.rationale}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {hyp.description}
                </p>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg bg-[var(--surface-muted)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Supporting signals
                    </p>
                    <ul className="mt-2 space-y-2">
                      {hyp.supportingSignals.map((s) => (
                        <li key={s.signalId} className="text-sm">
                          <span className="font-medium text-[var(--text-navy)]">
                            {s.signalName}
                          </span>
                          <span className="ml-2 text-xs text-[var(--accent)]">
                            ({s.signalStrength})
                          </span>
                          <p className="text-xs text-[var(--text-muted)]">
                            {s.explanation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-muted)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Opportunity theme (bounded)
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-navy)]">
                      {hyp.opportunityTheme.themeName}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--accent)]">
                      {hyp.opportunityTheme.estimatedMarginRange}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {hyp.opportunityTheme.explanation}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-navy)]">
                      {hyp.opportunityTheme.estimatedRevenueSensitivity}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Recoverability: {hyp.opportunityTheme.recoverability} ·
                      Elasticity modifier: {hyp.elasticitySensitivity}
                    </p>
                  </div>
                </div>

                {hyp.architectureImplications.length > 0 && (
                  <p className="mt-4 text-xs text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--text-navy)]">
                      Architecture implications:
                    </span>{" "}
                    {hyp.architectureImplications.join(" · ")}
                  </p>
                )}

                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  {hyp.confidence.explanation} Evidence:{" "}
                  {hyp.confidence.evidenceCoverage}.
                </p>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
