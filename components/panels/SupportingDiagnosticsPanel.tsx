"use client";

import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { DiagnosticHypothesesPanel } from "@/components/DiagnosticHypothesesPanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import { ObservedPricingPatternsPanel } from "@/components/panels/ObservedPricingPatternsPanel";
import { ClientUploadsPanel } from "@/components/panels/ClientUploadsPanel";
import { RetailerOverviewPanel } from "@/components/panels/RetailerOverviewPanel";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type {
  RetailerEnrichmentBundle,
  RetailerEnrichmentOverrides,
} from "@/types/retailer-context";
import type { EprScores } from "@/types/ui";

type SupportingDiagnosticsPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  hypothesisOutput: DiagnosticHypothesisOutput;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  eprScores: EprScores;
  retailerEnrichment: RetailerEnrichmentBundle;
  manualTicker: string;
  enrichmentLoading: boolean;
  onManualTickerChange: (value: string) => void;
  onEnrichmentOverrides: (overrides: RetailerEnrichmentOverrides) => void;
  onRefreshEnrichment: () => void;
};

export function SupportingDiagnosticsPanel({
  knowledgeContext,
  hypothesisOutput,
  executiveDeliverable,
  eprScores,
  retailerEnrichment,
  manualTicker,
  enrichmentLoading,
  onManualTickerChange,
  onEnrichmentOverrides,
  onRefreshEnrichment,
}: SupportingDiagnosticsPanelProps) {
  const uniqueSignals = executiveDeliverable.supportingThemes
    .flatMap((t) => t.supportingSignals)
    .filter(
      (s, i, arr) => arr.findIndex((x) => x.signalId === s.signalId) === i,
    );

  return (
    <div className="max-w-4xl space-y-10">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Supporting diagnostics"
      />

      <DiagnosticSection
        eyebrow="Supporting evidence"
        title="Signals and diagnostic detail"
        lead="Secondary material for validation workshops — not required to understand the executive storyline."
      >
        <ul className="flex flex-wrap gap-2">
          {uniqueSignals.map((s) => (
            <li
              key={s.signalId}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs text-[var(--text-navy)]"
            >
              {s.signalName}
            </li>
          ))}
        </ul>
      </DiagnosticSection>

      <Disclosure
        title="View observed pricing patterns"
        summary="Pattern inventory by lever — descriptive only"
        variant="subtle"
      >
        <ObservedPricingPatternsPanel
          knowledgeContext={knowledgeContext}
          eprScores={eprScores}
          embedded
        />
      </Disclosure>

      <Disclosure
        title="View hypothesis detail"
        summary="Full hypothesis list with confidence and rationale"
        variant="subtle"
      >
        <DiagnosticHypothesesPanel
          output={hypothesisOutput}
          title="All structural hypotheses"
          showArchitectureNote
        />
      </Disclosure>

      <Disclosure
        title="View data ingestion detail"
        summary="Upload preview, mappings, and readiness"
        variant="subtle"
      >
        <ClientUploadsPanel knowledgeContext={knowledgeContext} embedded />
      </Disclosure>

      <RetailerOverviewPanel
        enrichment={retailerEnrichment}
        manualTicker={manualTicker}
        onManualTickerChange={onManualTickerChange}
        onOverridesChange={onEnrichmentOverrides}
        onRefresh={onRefreshEnrichment}
        isRefreshing={enrichmentLoading}
      />
    </div>
  );
}
