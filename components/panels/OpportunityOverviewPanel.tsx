"use client";

import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { RunDiagnosticCta } from "@/components/RunDiagnosticCta";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type OpportunityOverviewPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  diagnosticReady: boolean;
  onRunDiagnostic: () => void;
  canRunDiagnostic: boolean;
};

export function OpportunityOverviewPanel({
  executiveDeliverable,
  diagnosticReady,
  onRunDiagnostic,
  canRunDiagnostic,
}: OpportunityOverviewPanelProps) {
  if (!diagnosticReady) {
    return (
      <div className="max-w-3xl pilot-panel">
        <DiagnosticSection
          eyebrow="Step 4"
          title="Opportunity overview"
          lead="Directional margin opportunity appears after you generate the diagnostic."
        >
          <RunDiagnosticCta
            onRun={onRunDiagnostic}
            disabled={!canRunDiagnostic}
          />
        </DiagnosticSection>
      </div>
    );
  }

  return (
    <div className="max-w-3xl pilot-panel">
      <ExecutiveDeliverablePanel
        readout={executiveDeliverable}
        exportPackage={executiveDeliverable.exportPackage}
        view="opportunity"
        pilotMode
      />
    </div>
  );
}
