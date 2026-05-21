"use client";

import { Disclosure } from "@/components/Disclosure";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  parseMarginRangeDisplay,
  polishEvidenceMetrics,
  polishEvidenceThemes,
} from "@/lib/executiveOutputPolish";
import type { ExecutiveSummary } from "@/types/executive-summary";

type ExecutivePilotSummaryProps = {
  exec: ExecutiveSummary;
  implications: string[];
};

export function ExecutivePilotSummary({
  exec,
  implications,
}: ExecutivePilotSummaryProps) {
  const margin = parseMarginRangeDisplay(exec.marginOpportunitySummary);
  const themes = polishEvidenceThemes(exec.evidenceBackedThemes, 3);
  const metrics = polishEvidenceMetrics(exec.supportingEvidenceMetrics, 4);

  return (
    <div className="exec-readout">
      <header className="exec-opportunity-card">
        <p className="exec-opportunity-eyebrow">Potential pricing opportunity</p>
        {margin ? (
          <p className="exec-opportunity-range" aria-label="Margin opportunity range">
            <span className="exec-opportunity-pct">{margin.display}</span>
            <span className="exec-opportunity-suffix">margin improvement</span>
          </p>
        ) : (
          <p className="exec-opportunity-range">{exec.marginOpportunitySummary}</p>
        )}
        <p className="exec-opportunity-sub">{exec.opportunityHeadline}</p>
        {exec.marginOpportunityTotalTrace && (
          <div className="mt-4">
            <OpportunityCalculationTracePanel trace={exec.marginOpportunityTotalTrace} />
          </div>
        )}
      </header>

      {exec.primaryDrivers.length > 0 && (
        <section className="exec-block">
          <h3 className="exec-block-title">Primary drivers</h3>
          <ul className="exec-driver-chips">
            {exec.primaryDrivers.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {themes.length > 0 && (
        <section className="exec-block">
          <h3 className="exec-block-title">Structural themes</h3>
          <ul className="exec-theme-cards">
            {themes.map((t) => (
              <li key={t.headline} className="exec-theme-card">
                <p className="exec-theme-headline">{t.headline}</p>
                <p className="exec-theme-detail">{t.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {metrics.length > 0 && (
        <section className="exec-block">
          <h3 className="exec-block-title">Supporting evidence</h3>
          <ul className="exec-evidence-grid">
            {metrics.map((m) => (
              <li key={m} className="exec-evidence-item">
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      {implications.length > 0 && (
        <section className="exec-block exec-implications-block">
          <h3 className="exec-block-title">What this means</h3>
          <ul className="exec-implications">
            {implications.map((imp) => (
              <li key={imp}>{imp}</li>
            ))}
          </ul>
        </section>
      )}

      <Disclosure
        title="Consultant detail"
        summary="Confidence, narrative context, and technical diagnostics"
        variant="subtle"
        defaultOpen={false}
      >
        <div className="exec-consultant-detail space-y-4">
          <p className="text-sm text-[var(--text-muted)]">{exec.confidenceSummary}</p>
          <p className="text-sm leading-relaxed text-[var(--text-navy)]">
            {exec.executiveNarrative}
          </p>
        </div>
      </Disclosure>
    </div>
  );
}
