"use client";

import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { RefineDiagnosticPlaceholder } from "@/components/RefineDiagnosticPlaceholder";
import { RunDiagnosticCta } from "@/components/RunDiagnosticCta";
import { ObservedPricingPatternsPanel } from "@/components/panels/ObservedPricingPatternsPanel";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { EprScores } from "@/types/ui";

type PricingDiagnosticPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  eprScores: EprScores;
  diagnosticReady: boolean;
  onRunDiagnostic: () => void;
  canRunDiagnostic: boolean;
  runDisabledReason?: string;
};

export function PricingDiagnosticPanel({
  knowledgeContext,
  executiveDeliverable,
  eprScores,
  diagnosticReady,
  onRunDiagnostic,
  canRunDiagnostic,
  runDisabledReason,
}: PricingDiagnosticPanelProps) {
  if (!diagnosticReady) {
    return (
      <div className="max-w-3xl pilot-panel">
        <DiagnosticSection
          eyebrow="Step 3"
          title="Pricing diagnostic"
          lead="Generate the assessment when retailer context and scope are confirmed."
        >
          <RunDiagnosticCta
            onRun={onRunDiagnostic}
            disabled={!canRunDiagnostic}
            disabledReason={runDisabledReason}
          />
        </DiagnosticSection>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 pilot-panel">
      <DiagnosticSection
        eyebrow="Step 3"
        title="Pricing diagnostic"
        lead="Executive summary and structural themes — supporting evidence available on expand."
      >
        <ExecutiveDeliverablePanel
          readout={executiveDeliverable}
          exportPackage={executiveDeliverable.exportPackage}
          view="full"
          pilotMode
        />
      </DiagnosticSection>

      <Disclosure
        title="Supporting evidence"
        variant="subtle"
        defaultOpen={false}
      >
        <ObservedPricingPatternsPanel
          knowledgeContext={knowledgeContext}
          eprScores={eprScores}
          embedded
        />
      </Disclosure>

      <RefineDiagnosticPlaceholder />
    </div>
  );
}
