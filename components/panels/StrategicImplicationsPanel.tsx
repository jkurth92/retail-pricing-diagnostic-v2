"use client";

import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type StrategicImplicationsPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
};

export function StrategicImplicationsPanel({
  knowledgeContext,
  executiveDeliverable,
}: StrategicImplicationsPanelProps) {
  return (
    <div className="max-w-3xl">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Strategic implications"
      />
      <div className="mt-10">
        <ExecutiveDeliverablePanel
          readout={executiveDeliverable}
          exportPackage={executiveDeliverable.exportPackage}
          view="implications"
        />
      </div>
    </div>
  );
}
