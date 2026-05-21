"use client";

import { Disclosure } from "@/components/Disclosure";
import { EprScoringCard } from "@/components/EprScoringCard";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { EprDimension, EprScores } from "@/types/ui";

type PricingProfilePanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  eprScores: EprScores;
  onEprScoreChange: (dimension: EprDimension, score: number) => void;
};

export function PricingProfilePanel({
  knowledgeContext,
  executiveDeliverable,
  eprScores,
  onEprScoreChange,
}: PricingProfilePanelProps) {
  return (
    <div className="max-w-3xl">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Pricing profile"
      />
      <div className="mt-10">
        <ExecutiveDeliverablePanel
          readout={executiveDeliverable}
          exportPackage={executiveDeliverable.exportPackage}
          view="profile"
        />
      </div>
      <div className="mt-8">
        <Disclosure
          title="View maturity scoring"
          summary="Pricing excellence dimensions — contextual, not scored against benchmarks"
          variant="subtle"
        >
          <EprScoringCard scores={eprScores} onScoreChange={onEprScoreChange} />
        </Disclosure>
      </div>
    </div>
  );
}
