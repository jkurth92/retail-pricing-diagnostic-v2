export type WorkflowStep = "setup" | "context" | "analysis" | "opportunity";

export type WorkflowTab =
  | "clientContext"
  | "scope"
  | "retailerOverview"
  | "opportunitySize";

export type PrimaryModule = "overview" | "pricing" | "promotions" | "markdown";

export type EprDimension =
  | "strategicPricePositioning"
  | "priceArchitectureKvis"
  | "promotionsStrategyEffectiveness"
  | "promoPriceIntegration"
  | "markdownInventoryManagement"
  | "executionTools";

export type EprScores = Record<EprDimension, number>;

export type PricingPosture = "EDLP" | "High-low" | "Hybrid" | "Not sure";

export type RetailerFormat =
  | "Grocery"
  | "Mass"
  | "Specialty"
  | "Convenience"
  | "Drug"
  | "Club"
  | "Other";

export type DiagnosticLever =
  | "KVIs"
  | "Price Architecture"
  | "Price Zoning"
  | "Promotions"
  | "Markdown";

export const EPR_DIMENSIONS: {
  key: EprDimension;
  label: string;
}[] = [
  { key: "strategicPricePositioning", label: "Strategic Price Positioning" },
  { key: "priceArchitectureKvis", label: "Price Architecture & KVIs" },
  {
    key: "promotionsStrategyEffectiveness",
    label: "Promotions Strategy & Effectiveness",
  },
  { key: "promoPriceIntegration", label: "Promo & Price Integration" },
  {
    key: "markdownInventoryManagement",
    label: "Markdown & Inventory Management",
  },
  { key: "executionTools", label: "Execution & Tools" },
];

export const DEFAULT_EPR_SCORES: EprScores = {
  strategicPricePositioning: 3,
  priceArchitectureKvis: 3,
  promotionsStrategyEffectiveness: 3,
  promoPriceIntegration: 3,
  markdownInventoryManagement: 3,
  executionTools: 3,
};

export const PRICING_POSTURES: PricingPosture[] = [
  "EDLP",
  "High-low",
  "Hybrid",
  "Not sure",
];

export const RETAILER_FORMATS: RetailerFormat[] = [
  "Grocery",
  "Mass",
  "Specialty",
  "Convenience",
  "Drug",
  "Club",
  "Other",
];

export const DIAGNOSTIC_LEVERS: DiagnosticLever[] = [
  "KVIs",
  "Price Architecture",
  "Price Zoning",
  "Promotions",
  "Markdown",
];
