import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";
import type { RetailerFormat } from "@/types/ui";
import type { PricingPosture as LegacyPosture } from "@/types/ui";

export type PilotDemoPreset = {
  id: string;
  label: string;
  description: string;
  retailerName: string;
  retailerFormat: RetailerFormat;
  legacyPosture: LegacyPosture;
  archetypeId: RetailerArchetypeId;
  knowledgePosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint: string;
  strategicContext: string;
  totalRevenueInput: string;
  addressablePercentInput: string;
  revenueInScopeInput: string;
  includedCategories: string[];
  simulatedUploadCount: number;
};

export const PILOT_DEMO_PRESET: PilotDemoPreset = {
  id: "target_mass_hybrid",
  label: "Pilot walkthrough — Mass retailer",
  description:
    "Pre-loaded Target-style setup for workflow review. Run the assessment to see storyline and exports.",
  retailerName: "Target",
  retailerFormat: "Mass",
  legacyPosture: "Hybrid",
  archetypeId: "mass",
  knowledgePosture: "Hybrid",
  strategicObjectives: ["value_perception", "premiumization"],
  categoryHint: "Household essentials",
  strategicContext:
    "Balancing visible value investment with selective premiumization and promotional architecture.",
  totalRevenueInput: "105000",
  addressablePercentInput: "65",
  revenueInScopeInput: "68250",
  includedCategories: ["Household essentials", "Beauty", "Apparel"],
  simulatedUploadCount: 2,
};
