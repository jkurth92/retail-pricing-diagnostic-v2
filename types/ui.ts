import type { WorkflowStep } from "@/types/diagnostic-output";

export type WorkflowTab = WorkflowStep;

export type SidebarFlowStep = WorkflowTab;

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

export const WORKFLOW_TABS: {
  id: WorkflowTab;
  label: string;
  description: string;
}[] = [
  {
    id: "retailer_context",
    label: "Retailer context",
    description: "Profile and commercial framing",
  },
  {
    id: "upload_scope",
    label: "Upload & scope",
    description: "Files, categories, and revenue in scope",
  },
  {
    id: "pricing_diagnostic",
    label: "Pricing diagnostic",
    description: "Executive summary and structural themes",
  },
  {
    id: "executive_outputs",
    label: "Executive outputs",
    description: "Memo, deck, and partner email drafts",
  },
];

export const LEVER_KEY_BY_LABEL: Record<DiagnosticLever, import("@/types/diagnostic-output").LeverKey> = {
  KVIs: "kvis",
  "Price Architecture": "price_architecture",
  "Price Zoning": "price_zoning",
  Promotions: "promotions",
  Markdown: "markdown",
};

export const LEVER_LABEL_BY_KEY: Record<import("@/types/diagnostic-output").LeverKey, DiagnosticLever> = {
  kvis: "KVIs",
  price_architecture: "Price Architecture",
  price_zoning: "Price Zoning",
  promotions: "Promotions",
  markdown: "Markdown",
};

export const DEFAULT_SELECTED_LEVER_KEYS: import("@/types/diagnostic-output").LeverKey[] = [
  "kvis",
  "price_architecture",
  "price_zoning",
];

export const CATEGORY_CHIP_OPTIONS = [
  "Grocery",
  "Household essentials",
  "Beauty",
  "Apparel",
  "Electronics",
  "Home",
  "Seasonal",
  "Other",
] as const;

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

export function workflowTabToSidebarStep(tab: WorkflowTab): SidebarFlowStep {
  return tab;
}
