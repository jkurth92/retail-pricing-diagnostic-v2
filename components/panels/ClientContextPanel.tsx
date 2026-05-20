import { EprScoringCard } from "@/components/EprScoringCard";
import { RetailerInputCard } from "@/components/RetailerInputCard";
import { StrategicContextCard } from "@/components/StrategicContextCard";
import { UploadPlaceholderCard } from "@/components/UploadPlaceholderCard";
import type {
  EprDimension,
  EprScores,
  PricingPosture,
  RetailerFormat,
} from "@/types/ui";

type ClientContextPanelProps = {
  retailerName: string;
  confirmedRetailer: string;
  eprScores: EprScores;
  pricingPosture: PricingPosture;
  retailerFormat: RetailerFormat;
  competitorSet: string;
  strategicContext: string;
  onRetailerNameChange: (value: string) => void;
  onPopulateRetailer: () => void;
  onEprScoreChange: (dimension: EprDimension, score: number) => void;
  onPricingPostureChange: (value: PricingPosture) => void;
  onRetailerFormatChange: (value: RetailerFormat) => void;
  onCompetitorSetChange: (value: string) => void;
  onStrategicContextChange: (value: string) => void;
};

export function ClientContextPanel({
  retailerName,
  confirmedRetailer,
  eprScores,
  pricingPosture,
  retailerFormat,
  competitorSet,
  strategicContext,
  onRetailerNameChange,
  onPopulateRetailer,
  onEprScoreChange,
  onPricingPostureChange,
  onRetailerFormatChange,
  onCompetitorSetChange,
  onStrategicContextChange,
}: ClientContextPanelProps) {
  return (
    <div className="space-y-6">
      {confirmedRetailer ? (
        <p className="text-sm text-[var(--text-muted)]">
          Retailer confirmed for UI:{" "}
          <span className="font-medium text-[var(--text-navy)]">
            {confirmedRetailer}
          </span>
        </p>
      ) : null}
      <RetailerInputCard
        retailerName={retailerName}
        onRetailerNameChange={onRetailerNameChange}
        onPopulate={onPopulateRetailer}
      />
      <EprScoringCard scores={eprScores} onScoreChange={onEprScoreChange} />
      <StrategicContextCard
        pricingPosture={pricingPosture}
        retailerFormat={retailerFormat}
        competitorSet={competitorSet}
        strategicContext={strategicContext}
        onPricingPostureChange={onPricingPostureChange}
        onRetailerFormatChange={onRetailerFormatChange}
        onCompetitorSetChange={onCompetitorSetChange}
        onStrategicContextChange={onStrategicContextChange}
      />
      <UploadPlaceholderCard />
    </div>
  );
}
