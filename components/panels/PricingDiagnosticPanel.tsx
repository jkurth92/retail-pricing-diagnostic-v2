"use client";

import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { RunDiagnosticCta } from "@/components/RunDiagnosticCta";
import { TechnicalDiagnosticsPanel } from "@/components/panels/TechnicalDiagnosticsPanel";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { InferredCategoryRow } from "@/types/category-scope";
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
  categoryRoles: InferredCategoryRow[];
  retailerDisplayName: string;
  retailerTicker?: string | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: import("@/types/opportunity-exposure").OpportunityExposureBundle | null;
};

export function PricingDiagnosticPanel({
  knowledgeContext,
  executiveDeliverable,
  eprScores,
  diagnosticReady,
  onRunDiagnostic,
  canRunDiagnostic,
  runDisabledReason,
  categoryRoles,
  retailerDisplayName,
  retailerTicker,
  computedEvidence,
  opportunityExposure,
}: PricingDiagnosticPanelProps) {
  if (!diagnosticReady) {
    return (
      <div className="max-w-3xl pilot-panel">
        <DiagnosticSection
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
    <div className="max-w-5xl pilot-panel dx-diagnostic-page">
      <DiagnosticSection
        title="Pricing diagnostic"
        lead="Opportunity → drivers → evidence → technical detail"
      >
        <ExecutiveDeliverablePanel
          readout={executiveDeliverable}
          exportPackage={executiveDeliverable.exportPackage}
          view="full"
          pilotMode
          opportunityExposure={opportunityExposure}
          computedEvidence={computedEvidence}
          consultantSlot={
            <TechnicalDiagnosticsPanel
              knowledgeContext={knowledgeContext}
              eprScores={eprScores}
              categoryRoles={categoryRoles}
              retailerDisplayName={retailerDisplayName}
              retailerTicker={retailerTicker}
              computedEvidence={computedEvidence}
              opportunityExposure={computedEvidence ? opportunityExposure : null}
            />
          }
        />
      </DiagnosticSection>
    </div>
  );
}
