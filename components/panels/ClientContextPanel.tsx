import { CompetitorSuggestionPanel } from "@/components/CompetitorSuggestionPanel";
import { EprScoringCard } from "@/components/EprScoringCard";
import { KnowledgeRegistryPanel } from "@/components/KnowledgeRegistryPanel";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import { StrategicContextCard } from "@/components/StrategicContextCard";
import type { CompetitorEntry } from "@/types/competitors";
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
    <div className="space-y-6">
      <RetailerInputCard
        retailerName={retailerName}
        onRetailerNameChange={onRetailerNameChange}
        onPopulate={onPopulateRetailer}
      />
      <EprScoringCard scores={eprScores} onScoreChange={onEprScoreChange} />
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
