import type { ItemRole } from "@/types/role-inference";

export const ITEM_ROLES: ItemRole[] = [
  {
    id: "super_kvi",
    roleName: "Super KVI",
    description: "Highest-visibility value items; anchor price image.",
    expectedPricingBehavior: "Maximum visibility; tight competitive reference.",
    visibilityLevel: "high",
    architectureImportance: "primary",
  },
  {
    id: "kvi",
    roleName: "KVI",
    description: "Known value items that shape perception in a category.",
    expectedPricingBehavior: "Visible shelf price; frequent comparison.",
    visibilityLevel: "high",
    architectureImportance: "primary",
  },
  {
    id: "foreground",
    roleName: "Foreground",
    description: "Items that support tier story and trade-up from KVI.",
    expectedPricingBehavior: "Clear gap vs KVI; supports ladder integrity.",
    visibilityLevel: "medium",
    architectureImportance: "primary",
  },
  {
    id: "background",
    roleName: "Background",
    description: "Fill-in items with lower visibility requirements.",
    expectedPricingBehavior: "Follows category architecture; less signaling.",
    visibilityLevel: "low",
    architectureImportance: "supporting",
  },
  {
    id: "opp",
    roleName: "OPP",
    description: "Opening price point items anchoring entry tier.",
    expectedPricingBehavior: "Entry tier anchor; supports value signaling.",
    visibilityLevel: "medium",
    architectureImportance: "secondary",
  },
  {
    id: "strategic",
    roleName: "Strategic",
    description: "Items supporting strategic partnerships or exclusives.",
    expectedPricingBehavior: "May diverge from national ladder by design.",
    visibilityLevel: "medium",
    architectureImportance: "secondary",
  },
  {
    id: "premium",
    roleName: "Premium",
    description: "Top-tier items supporting premiumization.",
    expectedPricingBehavior: "Widest gap vs mainstream; tier clarity required.",
    visibilityLevel: "medium",
    architectureImportance: "primary",
  },
  {
    id: "seasonal_event",
    roleName: "Seasonal / Event",
    description: "Time-bound items with event-led pricing behavior.",
    expectedPricingBehavior: "Descriptive promo/markdown cadence only.",
    visibilityLevel: "high",
    architectureImportance: "supporting",
  },
];

export const ITEM_ROLE_BY_ID = new Map(ITEM_ROLES.map((r) => [r.id, r] as const));
