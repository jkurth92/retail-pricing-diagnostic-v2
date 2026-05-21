import { CompetitorSuggestionPanel } from "@/components/CompetitorSuggestionPanel";
import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExecutiveDeliverablePanel } from "@/components/ExecutiveDeliverablePanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import { KnowledgeRegistryPanel } from "@/components/KnowledgeRegistryPanel";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import { StrategicContextCard } from "@/components/StrategicContextCard";
import type { runExecutiveDeliverableEngine } from "@/lib/executiveDeliverableEngine";
import type { CompetitorEntry } from "@/types/competitors";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type {
  PricingPosture,
  RetailerArchetypeId,
} from "@/types/retailer-archetypes";
import type {
  PricingPosture as LegacyPricingPosture,
  RetailerFormat,
} from "@/types/ui";

type ClientContextPanelProps = {
  retailerName: string;
  pricingPosture: LegacyPricingPosture;
  retailerFormat: RetailerFormat;
  strategicContext: string;
  competitors: CompetitorEntry[];
  knowledgeContext: KnowledgeRegistryContext;
  executiveDeliverable: ReturnType<typeof runExecutiveDeliverableEngine>;
  archetypeId: RetailerArchetypeId;
  knowledgePosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint: string;
  onRetailerNameChange: (value: string) => void;
  onPopulateRetailer: () => void;
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
  pricingPosture,
  retailerFormat,
  strategicContext,
  competitors,
  knowledgeContext,
  executiveDeliverable,
  archetypeId,
  knowledgePosture,
  strategicObjectives,
  categoryHint,
  onRetailerNameChange,
  onPopulateRetailer,
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
    <div className="max-w-3xl space-y-10">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Client context"
      />

      <ExecutiveDeliverablePanel
        readout={executiveDeliverable}
        exportPackage={executiveDeliverable.exportPackage}
        view="compact"
      />

      <DiagnosticSection
        eyebrow="Setup"
        title="Who we are diagnosing"
        lead="Set the retailer, commercial posture, and strategic objectives that frame the diagnostic narrative."
      >
        <div className="space-y-6">
          <RetailerInputCard
            retailerName={retailerName}
            onRetailerNameChange={onRetailerNameChange}
            onPopulate={onPopulateRetailer}
          />
          <KnowledgeRegistryPanel
            archetypeId={archetypeId}
            pricingPosture={knowledgePosture}
            strategicObjectives={strategicObjectives}
            categoryHint={categoryHint}
            onArchetypeChange={onArchetypeChange}
            onPostureChange={onKnowledgePostureChange}
            onToggleObjective={onToggleObjective}
            onCategoryHintChange={onCategoryHintChange}
            compact
          />
        </div>
      </DiagnosticSection>

      <StrategicContextCard
        pricingPosture={pricingPosture}
        retailerFormat={retailerFormat}
        strategicContext={strategicContext}
        onPricingPostureChange={onPricingPostureChange}
        onRetailerFormatChange={onRetailerFormatChange}
        onStrategicContextChange={onStrategicContextChange}
      />

      <Disclosure
        title="View peer suggestions (optional)"
        summary="Market context only — not used in opportunity sizing"
        variant="subtle"
      >
        <CompetitorSuggestionPanel
          competitors={competitors}
          onCompetitorsChange={onCompetitorsChange}
        />
      </Disclosure>
    </div>
  );
}
