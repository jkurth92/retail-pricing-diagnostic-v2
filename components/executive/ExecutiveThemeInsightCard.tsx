"use client";

import { useState } from "react";
import { OpportunityCalculationTracePanel } from "@/components/opportunity/OpportunityCalculationTracePanel";
import { OpportunityRangeVisual } from "@/components/executive/OpportunityRangeVisual";
import { shortenThemeTitle } from "@/lib/executiveUxHelpers";
import { parseMarginRangeDisplay } from "@/lib/executiveOutputPolish";
import type { EvidenceBackedThemeLine } from "@/types/evidence-computation";
import type { ExecutiveTheme } from "@/types/executive-theme";

type ExecutiveThemeInsightCardProps = {
  theme?: ExecutiveTheme;
  evidenceLine?: EvidenceBackedThemeLine;
  defaultExpanded?: boolean;
};

export function ExecutiveThemeInsightCard({
  theme,
  evidenceLine,
  defaultExpanded = false,
}: ExecutiveThemeInsightCardProps) {
  const [open, setOpen] = useState(defaultExpanded);
  const title = theme?.themeName ?? evidenceLine?.headline ?? "Structural theme";
  const summary = theme?.summary ?? evidenceLine?.detail ?? "";
  const shortTitle = shortenThemeTitle(title);
  const oneLiner =
    summary.length > 120 ? `${summary.slice(0, 117).trim()}…` : summary;
  const margin = theme?.marginOpportunityRange
    ? parseMarginRangeDisplay(theme.marginOpportunityRange)
    : null;

  return (
    <article className={`dx-theme-card ${open ? "dx-theme-card-active" : ""}`}>
      <button
        type="button"
        className="dx-theme-card-header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="dx-theme-card-main">
          <h4 className="dx-theme-card-title">{shortTitle}</h4>
          <p className="dx-theme-card-oneliner">{oneLiner}</p>
        </div>
        <div className="dx-theme-card-meta">
          {margin && (
            <span className="dx-theme-band-pill">{margin.display}</span>
          )}
          {theme?.confidence && (
            <span className="dx-confidence-pill dx-confidence-pill-sm">
              {theme.confidence.level.replace(/_/g, " ")}
            </span>
          )}
          <span className="dx-theme-chevron" aria-hidden>
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div className="dx-theme-card-body">
          {margin && (
            <OpportunityRangeVisual
              lowPct={parseFloat(margin.low)}
              highPct={parseFloat(margin.high)}
              maxScalePct={1.5}
              className="dx-range-compact"
            />
          )}
          {theme?.supportingSignals && theme.supportingSignals.length > 0 && (
            <ul className="dx-evidence-snippet">
              {theme.supportingSignals.slice(0, 2).map((s) => (
                <li key={s.signalId}>{s.signalName}</li>
              ))}
            </ul>
          )}
          {theme?.calculationTrace && (
            <div className="dx-consultant-nested">
              <OpportunityCalculationTracePanel
                trace={theme.calculationTrace}
                title="How this was calculated"
                mode="consultant"
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
