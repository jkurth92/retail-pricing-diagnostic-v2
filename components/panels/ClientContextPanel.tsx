import { CompetitorSuggestionPanel } from "@/components/CompetitorSuggestionPanel";
import { EprScoringCard } from "@/components/EprScoringCard";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import { StrategicContextCard } from "@/components/StrategicContextCard";
import type { CompetitorEntry } from "@/types/competitors";
import type {
  EprDimension,
  EprScores,
  PricingPosture,
  RetailerFormat,
} from "@/types/ui";

type ClientContextPanelProps = {
  retailerName: string;
  eprScores: EprScores;
  pricingPosture: PricingPosture;
  retailerFormat: RetailerFormat;
  strategicContext: string;
  competitors: CompetitorEntry[];
  onRetailerNameChange: (value: string) => void;
  onPopulateRetailer: () => void;
  onEprScoreChange: (dimension: EprDimension, score: number) => void;
  onPricingPostureChange: (value: PricingPosture) => void;
  onRetailerFormatChange: (value: RetailerFormat) => void;
  onStrategicContextChange: (value: string) => void;
  onCompetitorsChange: (competitors: CompetitorEntry[]) => void;
};

export function ClientContextPanel({
  retailerName,
  eprScores,
  pricingPosture,
  retailerFormat,
  strategicContext,
  competitors,
  onRetailerNameChange,
  onPopulateRetailer,
  onEprScoreChange,
  onPricingPostureChange,
  onRetailerFormatChange,
  onStrategicContextChange,
  onCompetitorsChange,
}: ClientContextPanelProps) {
  return (
    <div className="space-y-6">
      <RetailerInputCard
        retailerName={retailerName}
        onRetailerNameChange={onRetailerNameChange}
        onPopulate={onPopulateRetailer}
      />
      <EprScoringCard scores={eprScores} onScoreChange={onEprScoreChange} />
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
