"use client";

import { Disclosure } from "@/components/Disclosure";
import { OpportunityRangeVisual } from "@/components/executive/OpportunityRangeVisual";
import { confidenceLabelFromTrace } from "@/lib/executiveUxHelpers";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";
import type { OpportunityTraceRow } from "@/types/opportunity-trace";

type TraceMode = "executive" | "consultant";

type OpportunityCalculationTracePanelProps = {
  trace: OpportunityCalculationTrace;
  title?: string;
  defaultOpen?: boolean;
  /** Executive: compact summary; consultant: full trace */
  mode?: TraceMode;
};

function TraceChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="dx-trace-chip">
      <span className="dx-trace-chip-label">{label}</span>
      <span className="dx-trace-chip-value">{value}</span>
    </span>
  );
}

function TraceSection({
  heading,
  rows,
  variant = "default",
}: {
  heading: string;
  rows: OpportunityTraceRow[];
  variant?: "default" | "compact";
}) {
  if (rows.length === 0) return null;
  if (variant === "compact") {
    return (
      <div className="opp-trace-section opp-trace-section-compact">
        <h4 className="opp-trace-heading">{heading}</h4>
        <div className="dx-trace-chip-row">
          {rows.slice(0, 8).map((row) => (
            <TraceChip key={`${heading}-${row.label}`} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="opp-trace-section">
      <h4 className="opp-trace-heading">{heading}</h4>
      <dl className="opp-trace-dl">
        {rows.map((row) => (
          <div key={`${heading}-${row.label}-${row.value}`} className="opp-trace-row">
            <dt>{row.label}</dt>
            <dd>
              <span className="opp-trace-value">{row.value}</span>
              {row.detail && <span className="opp-trace-detail">{row.detail}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ExecutiveTraceSummary({ trace }: { trace: OpportunityCalculationTrace }) {
  const keyWeights = [
    ...trace.weightsApplied.slice(0, 3),
    trace.elasticityModifier,
    ...trace.maturityConfidenceModifier.slice(0, 2),
  ];

  return (
    <div className="dx-trace-executive-summary">
      <OpportunityRangeVisual
        lowPct={trace.finalRange.lowPct}
        highPct={trace.finalRange.highPct}
        confidenceLabel={confidenceLabelFromTrace(
          trace.formulaSummary,
          trace.finalRange.lowPct,
          trace.finalRange.highPct,
        )}
        className="dx-range-compact"
      />
      <p className="dx-trace-summary-line">{trace.finalRange.display}</p>
      <div className="dx-trace-chip-row">
        {keyWeights.map((row) => (
          <TraceChip key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
      {trace.intermediateSteps.length > 0 && (
        <ol className="dx-trace-steps-mini">
          {trace.intermediateSteps.slice(0, 3).map((step) => (
            <li key={step.label}>
              <span className="dx-trace-step-label">{step.label}</span>
              <span className="dx-trace-step-value">{step.value}</span>
            </li>
          ))}
        </ol>
      )}
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
        mode="consultant"
      />
    </div>
  );
}

export function OpportunityCalculationTracePanel({
  trace,
  title = "How this was calculated",
  defaultOpen = false,
  mode = "executive",
}: OpportunityCalculationTracePanelProps) {
  const executiveSummary = (
    <ExecutiveTraceSummary trace={trace} />
  );

  if (mode === "executive") {
    return (
      <Disclosure
        title={title}
        summary={`${trace.finalRange.lowPct}–${trace.finalRange.highPct}% · thematic range`}
        variant="subtle"
        defaultOpen={defaultOpen}
        className="dx-trace-disclosure"
      >
        {executiveSummary}
        <p className="dx-trace-expand-hint">
          Open consultant detail below for full calculation path.
        </p>
        <OpportunityCalculationTracePanel
          trace={trace}
          title="Consultant calculation detail"
          mode="consultant"
          defaultOpen={false}
        />
      </Disclosure>
    );
  }

  return (
    <Disclosure
      title={title}
      summary={`${trace.finalRange.lowPct}–${trace.finalRange.highPct}% · full trace`}
      variant="subtle"
      defaultOpen={defaultOpen}
      className="dx-trace-disclosure dx-trace-disclosure-consultant"
    >
      <div className="opp-trace-panel">
        <p className="opp-trace-formula">{trace.formulaSummary}</p>

        <TraceSection heading="Key weights" rows={trace.weightsApplied} variant="compact" />
        <TraceSection
          heading="Modifiers"
          rows={[trace.elasticityModifier, ...trace.maturityConfidenceModifier]}
          variant="compact"
        />
        <TraceSection heading="Measured values" rows={trace.measuredValues} variant="compact" />
        <TraceSection heading="Category exposure" rows={trace.categoryExposure} variant="compact" />

        <div className="dx-trace-modifier-grid">
          <TraceSection heading="Input signals" rows={trace.inputSignals} />
          <TraceSection heading="Intermediate steps" rows={trace.intermediateSteps} />
        </div>

        {trace.benchmarkContext && trace.benchmarkContext.length > 0 && (
          <Disclosure
            title="Compared to expected structure"
            summary="Benchmark context"
            variant="subtle"
            defaultOpen={false}
          >
            <TraceSection heading="Benchmark context" rows={trace.benchmarkContext} variant="compact" />
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
          <OpportunityRangeVisual
            lowPct={trace.finalRange.lowPct}
            highPct={trace.finalRange.highPct}
          />
          <span className="opp-trace-final-value">{trace.finalRange.display}</span>
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
