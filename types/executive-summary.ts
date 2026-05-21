import type { ExecutiveTheme } from "@/types/executive-theme";
import type {
  EvidenceBackedThemeLine,
  EvidenceStrength,
} from "@/types/evidence-computation";

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
  /** Answer-first opportunity framing */
  opportunityHeadline: string;
  primaryDrivers: string[];
  evidenceBackedThemes: EvidenceBackedThemeLine[];
  supportingEvidenceMetrics: string[];
  strategicImplicationOneLiner: string;
  evidenceStrength: EvidenceStrength;
};
