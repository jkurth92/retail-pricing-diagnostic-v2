"use client";

import { Card } from "@/components/Card";
import { DiagnosticFrameworkStrip } from "@/components/DiagnosticFrameworkStrip";
import { DiagnosticHypothesesPanel } from "@/components/DiagnosticHypothesesPanel";
import { EngineScaffoldPanel } from "@/components/EngineScaffoldPanel";
import { PocGuardrailBanner } from "@/components/PocGuardrailBanner";
import { PLACEHOLDER_DIAGNOSTIC_OUTPUT } from "@/data/placeholderDiagnosticOutput";
import { getSelectedPeerNames } from "@/lib/competitors";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { CompetitorCandidate } from "@/types/competitors";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import { LEVER_LABEL_BY_KEY } from "@/types/ui";

type OpportunitySizePanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  hypothesisOutput: DiagnosticHypothesisOutput;
  retailerName: string;
  competitors: CompetitorCandidate[];
  revenueInScopeLabel: string;
  scopeStatusLabel: string;
  selectedLeverLabels: string[];
  scopeDefined: boolean;
  runId: string;
};

export function OpportunitySizePanel({
  knowledgeContext,
  hypothesisOutput,
  retailerName,
  competitors,
  revenueInScopeLabel,
  scopeStatusLabel,
  selectedLeverLabels,
  scopeDefined,
  runId,
}: OpportunitySizePanelProps) {
  const output = PLACEHOLDER_DIAGNOSTIC_OUTPUT;
  const selectedPeers = getSelectedPeerNames(competitors);

  const thematicPools = hypothesisOutput.hypotheses.map((h) => ({
    name: h.hypothesisName,
    range: h.opportunityTheme.estimatedMarginRange,
    confidence: h.confidence.level,
  }));

  return (
    <div className="space-y-8">
      <PocGuardrailBanner
        title="Opportunity preview — thematic pools from hypotheses"
        detail="Margin ranges are bounded thematic calibrations tied to surfaced hypotheses. Not dollar opportunity, optimization output, or pricing prescriptions."
      />

      <DiagnosticFrameworkStrip
        context={knowledgeContext}
        workflowLabel="Opportunity Size"
      />

      <DiagnosticHypothesesPanel
        output={hypothesisOutput}
        title="Hypothesis-linked opportunity themes"
        showArchitectureNote={false}
      />

      <Card>
        <p className="micro-label mb-2">Thematic opportunity summary</p>
        <h3 className="section-title">Bounded margin pools (illustrative)</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Revenue in scope (denominator only): {revenueInScopeLabel}. Dollar
          amounts are not computed in this build.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                <th className="pb-3 pr-4 font-semibold">Hypothesis theme</th>
                <th className="pb-3 pr-4 font-semibold">Margin pool</th>
                <th className="pb-3 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {thematicPools.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-navy)]">
                    {row.name}
                  </td>
                  <td className="py-3 pr-4 text-[var(--accent)]">
                    {row.range}
                  </td>
                  <td className="py-3 capitalize text-[var(--text-muted)]">
                    {row.confidence.replace("_", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {thematicPools.length === 0 && (
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            No thematic pools — run hypothesis engine from Client Context with
            aligned signals.
          </p>
        )}
      </Card>

      <Card>
        <p className="micro-label mb-2">Workflow context</p>
        <h3 className="section-title">Diagnostic context references</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Retailer
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {retailerName.trim() || "Not selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Scope status
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {scopeStatusLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Selected peers
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {selectedPeers.length > 0
                ? selectedPeers.join(", ")
                : "None selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Scope levers
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {selectedLeverLabels.length > 0
                ? selectedLeverLabels.join(", ")
                : "None selected"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <p className="micro-label mb-2">Total opportunity</p>
        <h3 className="section-title">Total Opportunity</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Revenue in scope
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {revenueInScopeLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Low / base / high cases
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not calculated — use thematic pools above
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Overall confidence
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Per-hypothesis (see engine)
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Calculation status
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Thematic calibration only (6A)
            </dd>
          </div>
        </dl>
      </Card>

      <div>
        <p className="micro-label mb-3">Lever breakdown (placeholder)</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {output.leverOpportunities.map((lever) => (
            <div key={lever.leverKey} className="card-surface p-5">
              <h4 className="text-sm font-semibold text-[var(--text-navy)]">
                {LEVER_LABEL_BY_KEY[lever.leverKey]}
              </h4>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Dollar opportunity not calculated. Align hypotheses to lever
                themes after rule activation.
              </p>
            </div>
          ))}
        </div>
      </div>

      <EngineScaffoldPanel runId={runId} scopeDefined={scopeDefined} />
    </div>
  );
}
