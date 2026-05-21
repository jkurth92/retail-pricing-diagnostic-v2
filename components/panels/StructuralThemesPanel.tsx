"use client";

import { DiagnosticHypothesesPanel } from "@/components/DiagnosticHypothesesPanel";
import { Disclosure } from "@/components/Disclosure";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type StructuralThemesPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  hypothesisOutput: DiagnosticHypothesisOutput;
};

export function StructuralThemesPanel({
  knowledgeContext,
  executiveDeliverable,
  hypothesisOutput,
}: StructuralThemesPanelProps) {
  return (
    <div className="max-w-3xl">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Structural themes"
      />
      <div className="mt-10">
        <ExecutiveDeliverablePanel
          readout={executiveDeliverable}
          exportPackage={executiveDeliverable.exportPackage}
          view="themes"
        />
      </div>
      <div className="mt-8">
        <Disclosure
          title="View full theme diagnostics"
          summary="All surfaced hypotheses with architecture notes"
          variant="subtle"
        >
          <DiagnosticHypothesesPanel
            output={hypothesisOutput}
            title="Structural hypotheses"
            showArchitectureNote
          />
        </Disclosure>
      </div>
    </div>
  );
}
