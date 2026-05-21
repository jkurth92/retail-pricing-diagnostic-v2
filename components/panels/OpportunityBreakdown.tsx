"use client";

import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  filterOpportunityDrivers,
  hasInsufficientOpportunity,
  parseMarginRangeDisplay,
} from "@/lib/executiveOutputPolish";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";

type OpportunityBreakdownProps = {
  readout: DiagnosticReadout;
};

export function OpportunityBreakdown({ readout }: OpportunityBreakdownProps) {
  const { executiveSummary: exec, opportunityDetail: opp } = readout;
  const margin = parseMarginRangeDisplay(exec.marginOpportunitySummary);
  const drivers = filterOpportunityDrivers([
    ...opp.primaryOpportunityDrivers,
    ...opp.secondaryOpportunityDrivers,
  ]).slice(0, 4);

  if (hasInsufficientOpportunity(exec.marginOpportunitySummary, opp.primaryOpportunityDrivers)) {
    return (
      <div className="exec-readout">
        <div className="exec-opportunity-card exec-opportunity-card-muted">
          <p className="exec-opportunity-eyebrow">Opportunity framing</p>
          <p className="exec-opportunity-insufficient">
            Insufficient measured evidence to size a thematic opportunity range.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="exec-readout">
      <header className="exec-opportunity-card">
        <p className="exec-opportunity-eyebrow">Thematic margin opportunity</p>
        {margin ? (
          <p className="exec-opportunity-range">
            <span className="exec-opportunity-pct">{margin.display}</span>
            <span className="exec-opportunity-suffix">margin improvement (bounded)</span>
          </p>
        ) : (
          <p className="exec-opportunity-range">{exec.marginOpportunitySummary}</p>
        )}
        {exec.marginOpportunityTotalTrace && (
          <div className="mt-4">
            <OpportunityCalculationTracePanel trace={exec.marginOpportunityTotalTrace} />
          </div>
        )}
      </header>

      {drivers.length > 0 && (
        <section className="exec-block">
          <h3 className="exec-block-title">Opportunity by driver</h3>
          <ul className="exec-driver-breakdown">
            {drivers.map((d) => {
              const span = parseMarginRangeDisplay(d.marginRange);
              const theme = readout.supportingThemes.find(
                (t) => t.themeName === d.label,
              );
              return (
                <li key={`${d.label}-${d.role}`} className="exec-driver-row-stack">
                  <div className="exec-driver-row">
                    <div>
                      <p className="exec-driver-label">{d.label}</p>
                      {d.role === "secondary" && (
                        <p className="exec-driver-role">Secondary</p>
                      )}
                    </div>
                    <p className="exec-driver-range">
                      {span
                        ? `${span.display}`
                        : d.marginRange.replace(/\s*\(thematic[^)]*\)/gi, "").trim()}
                    </p>
                  </div>
                  {theme?.calculationTrace && (
                    <OpportunityCalculationTracePanel
                      trace={theme.calculationTrace}
                      title="How this theme was calculated"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="exec-revenue-note">{exec.revenueSensitivitySummary}</p>
    </div>
  );
}
