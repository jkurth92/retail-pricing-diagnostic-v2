"use client";

import { ExecutiveThemeInsightCard } from "@/components/executive/ExecutiveThemeInsightCard";
import { OpportunityRangeVisual } from "@/components/executive/OpportunityRangeVisual";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import {
  filterOpportunityDrivers,
  hasInsufficientOpportunity,
  parseMarginRangeDisplay,
} from "@/lib/executiveOutputPolish";
import { confidenceLabelFromTrace } from "@/lib/executiveUxHelpers";
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
      <div className="dx-dashboard">
        <section className="dx-tile dx-tile-hero dx-tile-muted">
          <p className="dx-tile-eyebrow">Opportunity framing</p>
          <p className="dx-hero-subline">
            Insufficient measured evidence to size a thematic opportunity range.
          </p>
        </section>
      </div>
    );
  }

  const confidenceLabel = exec.marginOpportunityTotalTrace
    ? confidenceLabelFromTrace(
        exec.marginOpportunityTotalTrace.formulaSummary,
        exec.marginOpportunityTotalTrace.finalRange.lowPct,
        exec.marginOpportunityTotalTrace.finalRange.highPct,
      )
    : undefined;

  return (
    <div className="dx-dashboard">
      <section className="dx-tile dx-tile-hero">
        <p className="dx-tile-eyebrow">Thematic margin opportunity</p>
        {margin ? (
          <>
            <p className="dx-hero-range-value">{margin.display}</p>
            <OpportunityRangeVisual
              lowPct={parseFloat(margin.low)}
              highPct={parseFloat(margin.high)}
              confidenceLabel={confidenceLabel}
            />
          </>
        ) : (
          <p className="dx-hero-range-value">{exec.marginOpportunitySummary}</p>
        )}
        {exec.marginOpportunityTotalTrace && (
          <div className="dx-trace-slot">
            <OpportunityCalculationTracePanel
              trace={exec.marginOpportunityTotalTrace}
              mode="executive"
            />
          </div>
        )}
      </section>

      {drivers.length > 0 && (
        <section className="dx-tile dx-tile-drivers">
          <h3 className="dx-section-label">Opportunity by driver</h3>
          <ul className="dx-driver-cards">
            {drivers.map((d) => {
              const span = parseMarginRangeDisplay(d.marginRange);
              const theme = readout.supportingThemes.find(
                (t) => t.themeName === d.label,
              );
              return (
                <li key={`${d.label}-${d.role}`} className="dx-driver-card">
                  <div className="dx-driver-card-head">
                    <span className="dx-driver-card-label">{d.label}</span>
                    {d.role === "secondary" && (
                      <span className="dx-driver-card-role">Secondary</span>
                    )}
                    <span className="dx-theme-band-pill">
                      {span ? span.display : d.marginRange.replace(/\s*\(thematic[^)]*\)/gi, "").trim()}
                    </span>
                  </div>
                  {span && (
                    <OpportunityRangeVisual
                      lowPct={parseFloat(span.low)}
                      highPct={parseFloat(span.high)}
                      maxScalePct={1.5}
                      className="dx-range-compact"
                    />
                  )}
                  {theme && <ExecutiveThemeInsightCard theme={theme} />}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="dx-footnote">{exec.revenueSensitivitySummary}</p>
    </div>
  );
}
