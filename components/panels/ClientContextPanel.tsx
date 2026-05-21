import { CompetitorSuggestionPanel } from "@/components/CompetitorSuggestionPanel";
import { DiagnosticHypothesesPanel } from "@/components/DiagnosticHypothesesPanel";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import { DiagnosticFrameworkStrip } from "@/components/DiagnosticFrameworkStrip";
import { EprScoringCard } from "@/components/EprScoringCard";
import { FrameworkLayerProgress } from "@/components/FrameworkLayerProgress";
import { KnowledgeRegistryPanel } from "@/components/KnowledgeRegistryPanel";
import { PocGuardrailBanner } from "@/components/PocGuardrailBanner";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import { RoleInferenceSummaryCard } from "@/components/RoleInferenceSummaryCard";
import { StrategicContextCard } from "@/components/StrategicContextCard";
import type { CompetitorEntry } from "@/types/competitors";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type {
  PricingPosture,
  RetailerArchetypeId,
} from "@/types/retailer-archetypes";
import type {
  EprDimension,
  EprScores,
  PricingPosture as LegacyPricingPosture,
  RetailerFormat,
} from "@/types/ui";

type ClientContextPanelProps = {
  retailerName: string;
  eprScores: EprScores;
  pricingPosture: LegacyPricingPosture;
  retailerFormat: RetailerFormat;
  strategicContext: string;
  competitors: CompetitorEntry[];
  knowledgeContext: KnowledgeRegistryContext;
  hypothesisOutput: DiagnosticHypothesisOutput;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  archetypeId: RetailerArchetypeId;
  knowledgePosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint: string;
  onRetailerNameChange: (value: string) => void;
  onPopulateRetailer: () => void;
  onEprScoreChange: (dimension: EprDimension, score: number) => void;
  onPricingPostureChange: (value: LegacyPricingPosture) => void;
  onRetailerFormatChange: (value: RetailerFormat) => void;
  onStrategicContextChange: (value: string) => void;
  onCompetitorsChange: (competitors: CompetitorEntry[]) => void;
  onArchetypeChange: (id: RetailerArchetypeId) => void;
  onKnowledgePostureChange: (posture: PricingPosture) => void;
  onToggleObjective: (id: StrategicObjectiveId) => void;
  onCategoryHintChange: (value: string) => void;
};

export function ClientContextPanel({
  retailerName,
  eprScores,
  pricingPosture,
  retailerFormat,
  strategicContext,
  competitors,
  knowledgeContext,
  hypothesisOutput,
  executiveDeliverable,
  archetypeId,
  knowledgePosture,
  strategicObjectives,
  categoryHint,
  onRetailerNameChange,
  onPopulateRetailer,
  onEprScoreChange,
  onPricingPostureChange,
  onRetailerFormatChange,
  onStrategicContextChange,
  onCompetitorsChange,
  onArchetypeChange,
  onKnowledgePostureChange,
  onToggleObjective,
  onCategoryHintChange,
}: ClientContextPanelProps) {
  return (
    <div className="space-y-8">
      <PocGuardrailBanner
        title="Diagnostic cockpit — client context"
        detail="Configure retailer archetype, pricing posture, and strategic objectives. All inference is deterministic POC logic."
      />

      <DiagnosticFrameworkStrip
        context={knowledgeContext}
        workflowLabel="Client Context"
      />

      <ExecutiveDeliverablePanel
        readout={executiveDeliverable}
        exportPackage={executiveDeliverable.exportPackage}
        compact
      />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <KnowledgeRegistryPanel
            archetypeId={archetypeId}
            pricingPosture={knowledgePosture}
            strategicObjectives={strategicObjectives}
            categoryHint={categoryHint}
            onArchetypeChange={onArchetypeChange}
            onPostureChange={onKnowledgePostureChange}
            onToggleObjective={onToggleObjective}
            onCategoryHintChange={onCategoryHintChange}
          />
          <RoleInferenceSummaryCard context={knowledgeContext} />
          <DiagnosticHypothesesPanel
            output={hypothesisOutput}
            title="Live hypothesis preview"
            showArchitectureNote
          />
        </div>
        <div className="space-y-8">
          <FrameworkLayerProgress />
          <RetailerInputCard
            retailerName={retailerName}
            onRetailerNameChange={onRetailerNameChange}
            onPopulate={onPopulateRetailer}
          />
          <EprScoringCard scores={eprScores} onScoreChange={onEprScoreChange} />
        </div>
      </div>

      <StrategicContextCard
        pricingPosture={pricingPosture}
        retailerFormat={retailerFormat}
        strategicContext={strategicContext}
        onPricingPostureChange={onPricingPostureChange}
        onRetailerFormatChange={onRetailerFormatChange}
        onStrategicContextChange={onStrategicContextChange}
      />
      <CompetitorSuggestionPanel
        competitors={competitors}
        onCompetitorsChange={onCompetitorsChange}
      />
    </div>
  );
}
