import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type {
  ConfidenceLevel,
  ConfidenceTemplate,
  RationaleTemplate,
} from "@/types/benchmark-concepts";

export type CategoryRoleId =
  | "traffic_driver"
  | "destination"
  | "basket_builder"
  | "profit_driver"
  | "premiumization"
  | "convenience_urgency"
  | "opportunistic_seasonal";

export type ItemRoleId =
  | "super_kvi"
  | "kvi"
  | "foreground"
  | "background"
  | "opp"
  | "strategic"
  | "premium"
  | "seasonal_event";

export type CategoryRole = {
  id: CategoryRoleId;
  roleName: string;
  description: string;
  expectedBehavior: string;
  commonCategories: string[];
  retailerContexts: RetailerArchetypeId[];
  rationale: string;
};

export type ItemRole = {
  id: ItemRoleId;
  roleName: string;
  description: string;
  expectedPricingBehavior: string;
  visibilityLevel: "high" | "medium" | "low";
  architectureImportance: "primary" | "secondary" | "supporting";
};

export type ItemRoleMixEntry = {
  roleId: ItemRoleId;
  sharePctMin: number;
  sharePctMax: number;
  label: string;
};

export type RoleInferenceRule = {
  id: string;
  retailerArchetype: RetailerArchetypeId;
  categorySignals: string[];
  itemSignals: string[];
  suggestedCategoryRole: CategoryRoleId;
  suggestedItemRoleMix: ItemRoleMixEntry[];
  rationaleTemplate: string;
  confidenceMethod: string;
};

export type RoleInferenceInput = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint?: string;
};

export type CategoryRoleSuggestion = {
  roleId: CategoryRoleId;
  roleName: string;
  confidence: ConfidenceLevel;
  rationale: string;
  templateId?: string;
};

export type ItemRoleMixSuggestion = {
  mix: ItemRoleMixEntry[];
  confidence: ConfidenceLevel;
  rationale: string;
};

export type RoleInferenceResult = {
  archetypeId: RetailerArchetypeId;
  archetypeName: string;
  pricingPosture: PricingPosture;
  categoryHint: string | null;
  categorySuggestion: CategoryRoleSuggestion;
  itemMixSuggestion: ItemRoleMixSuggestion;
  appliedRuleId: string | null;
  overrideNote: string;
  confidenceTemplate: ConfidenceTemplate | null;
  rationaleTemplate: RationaleTemplate | null;
};
