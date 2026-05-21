"use client";

import { useMemo, useState } from "react";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { CALIBRATION_NOTES } from "@/data/outputCalibrationRules";
import { RETAILER_VALIDATION_SCENARIOS } from "@/tests/e2e/retailer-scenarios";
import { runValidationScenario, runAllValidationScenarios } from "@/lib/validationHarness";
import type { ValidationSeverity } from "@/lib/endToEndValidator";

const SEVERITY_STYLES: Record<ValidationSeverity, string> = {
  pass: "text-emerald-800 bg-emerald-50",
  info: "text-slate-700 bg-slate-100",
  warning: "text-amber-900 bg-amber-50",
  error: "text-red-900 bg-red-50",
};

type ValidationReviewPanelProps = {
  onApplyScenarioToApp?: (scenarioId: string) => void;
};

export function ValidationReviewPanel({
  onApplyScenarioToApp,
}: ValidationReviewPanelProps) {
  const [selectedId, setSelectedId] = useState(RETAILER_VALIDATION_SCENARIOS[0].id);
  const [runAll, setRunAll] = useState(false);

  const singleResult = useMemo(
    () => runValidationScenario(selectedId),
    [selectedId],
  );

  const allResults = useMemo(() => (runAll ? runAllValidationScenarios() : []), [runAll]);

  const scenario = RETAILER_VALIDATION_SCENARIOS.find((s) => s.id === selectedId);

  return (
    <div className="max-w-4xl space-y-10">
      <DiagnosticSection
        eyebrow="Internal review"
        title="End-to-end validation"
        lead="Deterministic checks across representative retailer scenarios. Does not change production diagnostic logic."
      >
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm"
          >
            {RETAILER_VALIDATION_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setRunAll(true)}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium"
          >
            Run all scenarios
          </button>
          {onApplyScenarioToApp && scenario && (
            <button
              type="button"
              onClick={() => onApplyScenarioToApp(scenario.id)}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              Apply scenario to app
            </button>
          )}
        </div>
      </DiagnosticSection>

      {singleResult && scenario && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[var(--text-navy)]">
              {singleResult.scenarioLabel}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                singleResult.passed
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-amber-50 text-amber-900"
              }`}
            >
              {singleResult.passed ? "Within guardrails" : "Review flags"}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{scenario.notes}</p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--text-muted)]">Hypotheses</dt>
              <dd className="font-medium">{singleResult.summary.hypothesisCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Primary themes</dt>
              <dd className="font-medium">{singleResult.summary.primaryThemeCount}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Margin range</dt>
              <dd className="font-medium">{singleResult.summary.marginRange}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Enrichment</dt>
              <dd className="font-medium">{singleResult.summary.enrichmentStatus}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs font-semibold uppercase text-[var(--text-muted)]">
            Expected emphasis
          </p>
          <p className="text-sm text-[var(--text-navy)]">
            {scenario.expectedStorylineEmphasis.join(" · ")}
          </p>
          <ul className="mt-6 space-y-2">
            {singleResult.flags.map((f) => (
              <li
                key={`${f.code}-${f.message}`}
                className={`rounded-md px-3 py-2 text-sm ${SEVERITY_STYLES[f.severity]}`}
              >
                <span className="font-mono text-xs">{f.code}</span> — {f.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {runAll && allResults.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-6">
          <h3 className="text-base font-semibold text-[var(--text-navy)]">
            All scenarios ({allResults.filter((r) => r.passed).length}/{allResults.length} within guardrails)
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {allResults.map((r) => (
              <li key={r.scenarioId} className="flex justify-between gap-4">
                <span>{r.scenarioLabel}</span>
                <span className={r.passed ? "text-emerald-700" : "text-amber-800"}>
                  {r.passed ? "OK" : `${r.flags.filter((f) => f.severity === "warning").length} warnings`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-dashed border-[var(--border)] p-5">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
          Calibration notes
        </p>
        <ul className="mt-2 list-disc pl-5 text-sm text-[var(--text-muted)]">
          {CALIBRATION_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
