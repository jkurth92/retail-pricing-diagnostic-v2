import type { CategoryRoleId, ItemRoleId } from "@/types/role-inference";

export type RetailerArchetypeId =
  | "grocery"
  | "mass"
  | "discount"
  | "premium_grocery"
  | "club"
  | "convenience"
  | "specialty"
  | "apparel_softlines";

export type PricingPosture =
  | "EDLP"
  | "HiLo"
  | "Hybrid"
  | "Premium"
  | "Value"
  | "Convenience"
  | "Specialty";

export type ValueSignal =
  | "everyday_low_price"
  | "promotional_depth"
  | "tier_clarity"
  | "pack_value"
  | "exclusive_assortment"
  | "speed_and_access"
  | "brand_preference";

export type RetailerArchetype = {
  id: RetailerArchetypeId;
  archetypeName: string;
  description: string;
  pricingPostures: PricingPosture[];
  expectedCategoryRoles: CategoryRoleId[];
  expectedItemRoleMix: { roleId: ItemRoleId; typicalSharePct: string }[];
  expectedValueSignals: ValueSignal[];
  expectedArchitecturePatterns: string[];
  notes: string;
};
