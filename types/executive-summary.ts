import type { ExecutiveTheme } from "@/types/executive-theme";

export type RetailerPricingProfile = {
  archetype: string;
  posture: string;
  inferredCategoryRoleStructure: string;
  inferredItemRoleStructure: string;
  architectureProfile: string;
  maturityProfile: string;
  strategicOrientation: string;
  notes: string[];
};

export type ExecutiveSummary = {
  id: string;
  retailerProfile: RetailerPricingProfile;
  pricingPosture: string;
  executiveNarrative: string;
  topThemes: ExecutiveTheme[];
  marginOpportunitySummary: string;
  revenueSensitivitySummary: string;
  confidenceSummary: string;
  maturitySummary: string;
  strategicImplications: string[];
  nextFocusAreas: string[];
};
