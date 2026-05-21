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
  sidebarGroup: "setup" | "readout" | "evidence";
}[] = [
  {
    id: "client_context",
    label: "Client context",
    description: "Retailer type, posture, and objectives",
    sidebarGroup: "setup",
  },
  {
    id: "data_scope",
    label: "Data & scope",
    description: "Upload readiness and revenue in scope",
    sidebarGroup: "setup",
  },
  {
    id: "pricing_profile",
    label: "Pricing profile",
    description: "Inferred structure and maturity",
    sidebarGroup: "readout",
  },
  {
    id: "structural_themes",
    label: "Structural themes",
    description: "Prioritized pricing narratives",
    sidebarGroup: "readout",
  },
  {
    id: "opportunity_overview",
    label: "Opportunity overview",
    description: "Margin-led thematic opportunity",
    sidebarGroup: "readout",
  },
  {
    id: "strategic_implications",
    label: "Strategic implications",
    description: "What the structure means",
    sidebarGroup: "readout",
  },
  {
    id: "supporting_diagnostics",
    label: "Supporting diagnostics",
    description: "Signals, patterns, and evidence",
    sidebarGroup: "evidence",
  },
  {
    id: "export_deliverables",
    label: "Executive exports",
    description: "Preview and download consulting drafts",
    sidebarGroup: "readout",
  },
  {
    id: "validation_review",
    label: "Validation review",
    description: "Internal E2E calibration checks",
    sidebarGroup: "evidence",
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
