"use client";

import { Disclosure } from "@/components/Disclosure";
import type { RobustDataInterpretationBundle } from "@/types/data-interpretation";

type DataInterpretationDetailProps = {
  interpretation: RobustDataInterpretationBundle;
};

export function DataInterpretationDetail({
  interpretation,
}: DataInterpretationDetailProps) {
  const { dataQuality, evidenceCoverage } = interpretation;

  return (
    <Disclosure
      title="Data interpretation & coverage"
      summary={`${Math.round(evidenceCoverage.overallScore * 100)}% weighted sufficiency · ${dataQuality.normalizationConfidence} normalization`}
      variant="subtle"
      defaultOpen={false}
    >
      <div className="space-y-4 text-sm text-[var(--text-navy)]">
        <p className="text-[var(--text-muted)]">
          Explainable normalization and proxy inference — deterministic, not
          black-box. Opportunity ranges may widen when evidence is partial.
        </p>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Sufficiency
            </dt>
            <dd className="mt-1">
              {evidenceCoverage.sufficiencyLevel} (
              {Math.round(evidenceCoverage.overallScore * 100)}%)
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Signal completeness
            </dt>
            <dd className="mt-1">{dataQuality.signalCompleteness}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Explicit vs inferred fields
            </dt>
            <dd className="mt-1">
              {interpretation.inferredVsExplicit.explicit.length} explicit ·{" "}
              {interpretation.inferredVsExplicit.inferred.length} inferred
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Range modifier
            </dt>
            <dd className="mt-1">
              ×{evidenceCoverage.rangeWidthMultiplier.toFixed(2)} when partial
            </dd>
          </div>
        </dl>

        {interpretation.categoryMappings.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Category normalization
            </p>
            <ul className="list-none space-y-1 pl-0">
              {interpretation.categoryMappings.slice(0, 6).map((m) => (
                <li key={m.rawCategory} className="text-[var(--text-navy)]">
                  {m.rawCategory} → {m.normalizedCategory}
                  <span className="text-[var(--text-muted)]">
                    {" "}
                    ({m.method})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dataQuality.consultantNotes.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-[var(--text-muted)]">
            {dataQuality.consultantNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </Disclosure>
  );
}
