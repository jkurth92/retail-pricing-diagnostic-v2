"use client";

import { Card } from "@/components/Card";
import { DiagnosticFrameworkStrip } from "@/components/DiagnosticFrameworkStrip";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { EngineScaffoldPanel } from "@/components/EngineScaffoldPanel";
import { PocGuardrailBanner } from "@/components/PocGuardrailBanner";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { CompetitorCandidate } from "@/types/competitors";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type OpportunitySizePanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  hypothesisOutput: DiagnosticHypothesisOutput;
  storylineResult: StorylineSynthesisResult & {
    engineVersion: string;
    generatedAt: string;
    guardrailMessage: string;
  };
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  retailerName: string;
  competitors: CompetitorCandidate[];
  revenueInScopeLabel: string;
  scopeStatusLabel: string;
  scopeDefined: boolean;
  runId: string;
};

export function OpportunitySizePanel({
  knowledgeContext,
  storylineResult,
  executiveDeliverable,
  retailerName,
  revenueInScopeLabel,
  scopeStatusLabel,
  scopeDefined,
  runId,
}: OpportunitySizePanelProps) {
  const { opportunity } = storylineResult;

  return (
    <div className="space-y-8">
      <PocGuardrailBanner
        title="Opportunity size — executive diagnostic readout (Step 7)"
        detail={executiveDeliverable.guardrailMessage}
      />

      <DiagnosticFrameworkStrip
        context={knowledgeContext}
        workflowLabel="Opportunity Size"
      />

      <ExecutiveDeliverablePanel
        readout={executiveDeliverable}
        exportPackage={executiveDeliverable.exportPackage}
      />

      <Card>
        <p className="micro-label mb-2">Workflow context</p>
        <h3 className="section-title">Sizing context</h3>
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
              Revenue in scope (denominator)
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {revenueInScopeLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Dollar opportunity
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              Not calculated — thematic margin ranges only
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <p className="micro-label mb-2">Opportunity drivers</p>
        <h3 className="section-title">Margin-led summary</h3>
        <p className="mt-2 text-lg font-semibold text-[var(--accent)]">
          {opportunity.totalMarginOpportunityRange}
        </p>
        {opportunity.revenueImpactLabel && (
          <p className="mt-3 text-sm font-medium text-[var(--text-navy)]">
            Potential revenue impact: {opportunity.revenueImpactLabel}
          </p>
        )}
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {opportunity.totalRevenueSensitivityRange}
          <span className="block text-xs">Directional sales sensitivity — not a forecast</span>
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
              Primary drivers
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              {opportunity.primaryOpportunityDrivers.map((d) => (
                <li
                  key={d.label}
                  className="flex justify-between gap-2 border-b border-[var(--border)] pb-2"
                >
                  <span className="text-[var(--text-navy)]">{d.label}</span>
                  <span className="shrink-0 text-[var(--accent)]">
                    {d.marginRange}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {opportunity.secondaryOpportunityDrivers.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">
                Secondary / enabler
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {opportunity.secondaryOpportunityDrivers.map((d) => (
                  <li
                    key={`${d.label}-${d.role}`}
                    className="flex justify-between gap-2 border-b border-[var(--border)] pb-2"
                  >
                    <span className="text-[var(--text-navy)]">
                      {d.label}
                      <span className="ml-1 text-xs text-[var(--text-muted)]">
                        ({d.role})
                      </span>
                    </span>
                    <span className="shrink-0 text-[var(--text-muted)]">
                      {d.marginRange}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <EngineScaffoldPanel runId={runId} scopeDefined={scopeDefined} />
    </div>
  );
}
