"use client";

import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type OpportunityOverviewPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
};

export function OpportunityOverviewPanel({
  knowledgeContext,
  executiveDeliverable,
}: OpportunityOverviewPanelProps) {
  return (
    <div className="max-w-3xl">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Opportunity overview"
      />
      <div className="mt-10">
        <ExecutiveDeliverablePanel
          readout={executiveDeliverable}
          exportPackage={executiveDeliverable.exportPackage}
          view="opportunity"
        />
      </div>
    </div>
  );
}
