"use client";

import { Disclosure } from "@/components/Disclosure";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";
import type { OpportunityTraceRow } from "@/types/opportunity-trace";

type OpportunityCalculationTracePanelProps = {
  trace: OpportunityCalculationTrace;
  /** Defaults to "How this was calculated" */
  title?: string;
  defaultOpen?: boolean;
};

function TraceSection({
  heading,
  rows,
}: {
  heading: string;
  rows: OpportunityTraceRow[];
}) {
  if (rows.length === 0) return null;
  return (
    <div className="opp-trace-section">
      <h4 className="opp-trace-heading">{heading}</h4>
      <dl className="opp-trace-dl">
        {rows.map((row) => (
          <div key={`${heading}-${row.label}-${row.value}`} className="opp-trace-row">
            <dt>{row.label}</dt>
            <dd>
              <span className="opp-trace-value">{row.value}</span>
              {row.detail && (
                <span className="opp-trace-detail">{row.detail}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ChildTraceBlock({ trace }: { trace: OpportunityCalculationTrace }) {
  return (
    <div className="opp-trace-child">
      <p className="opp-trace-child-title">
        {trace.themeName}
        <span className="opp-trace-scope">{trace.scope.replace(/_/g, " ")}</span>
      </p>
      <OpportunityCalculationTracePanel
        trace={trace}
        title="Pool calculation"
        defaultOpen={false}
      />
    </div>
  );
}

export function OpportunityCalculationTracePanel({
  trace,
  title = "How this was calculated",
  defaultOpen = false,
}: OpportunityCalculationTracePanelProps) {
  return (
    <Disclosure
      title={title}
      summary={`${trace.finalRange.display} · ${trace.formulaSummary}`}
      variant="subtle"
      defaultOpen={defaultOpen}
    >
      <div className="opp-trace-panel">
        <p className="opp-trace-formula">{trace.formulaSummary}</p>

        <TraceSection heading="Input signals" rows={trace.inputSignals} />
        <TraceSection heading="Measured values" rows={trace.measuredValues} />
        <TraceSection heading="Category exposure" rows={trace.categoryExposure} />
        <TraceSection heading="Weights applied" rows={trace.weightsApplied} />
        <TraceSection
          heading="Elasticity modifier"
          rows={[trace.elasticityModifier]}
        />
        <TraceSection
          heading="Maturity / confidence modifier"
          rows={trace.maturityConfidenceModifier}
        />
        <TraceSection heading="Intermediate steps" rows={trace.intermediateSteps} />

        {trace.benchmarkContext && trace.benchmarkContext.length > 0 && (
          <Disclosure
            title="Compared to expected structure"
            summary="Benchmark context (directional reference)"
            variant="subtle"
            defaultOpen={false}
          >
            <TraceSection
              heading="Benchmark context"
              rows={trace.benchmarkContext}
            />
          </Disclosure>
        )}

        {trace.exposureSummaries && trace.exposureSummaries.length > 0 && (
          <ul className="opp-trace-exposure-summaries">
            {trace.exposureSummaries.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}

        <div className="opp-trace-final">
          <span className="opp-trace-heading">Final opportunity range</span>
          <span className="opp-trace-final-value">{trace.finalRange.display}</span>
          <span className="opp-trace-detail">
            {trace.finalRange.lowPct}% – {trace.finalRange.highPct}% (thematic, bounded)
          </span>
        </div>

        {trace.childTraces && trace.childTraces.length > 0 && (
          <div className="opp-trace-children">
            <h4 className="opp-trace-heading">Underlying pools</h4>
            {trace.childTraces.map((child) => (
              <ChildTraceBlock key={child.traceId} trace={child} />
            ))}
          </div>
        )}
      </div>
    </Disclosure>
  );
}
