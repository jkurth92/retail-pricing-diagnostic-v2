import type { CategoryRole } from "@/types/role-inference";

export const CATEGORY_ROLES: CategoryRole[] = [
  {
    id: "traffic_driver",
    roleName: "Traffic Driver",
    description:
      "Categories used to signal value and drive trips; high visibility pricing.",
    expectedBehavior:
      "Sharp foreground and KVI signaling; architecture supports trip mission.",
    commonCategories: [
      "Laundry detergent",
      "Milk",
      "Eggs",
      "Carbonated soft drinks",
      "Bread",
    ],
    retailerContexts: ["grocery", "mass", "discount", "club"],
    rationale:
      "Comparable national-brand categories where price image materially affects store choice.",
  },
  {
    id: "destination",
    roleName: "Destination",
    description:
      "Categories where the retailer seeks authority or differentiation.",
    expectedBehavior:
      "Assortment breadth and tier storytelling; less price-led than traffic drivers.",
    commonCategories: ["Produce", "Bakery", "Prepared foods", "Wine"],
    retailerContexts: ["grocery", "premium_grocery", "specialty"],
    rationale:
      "Differentiation-led categories where role is authority, not lowest price.",
  },
  {
    id: "basket_builder",
    roleName: "Basket Builder",
    description: "Complementary categories that expand basket size per trip.",
    expectedBehavior:
      "Moderate KVI presence; architecture encourages trade-up within trip.",
    commonCategories: ["Snacks", "Condiments", "Frozen meals", "Household cleaners"],
    retailerContexts: ["grocery", "mass", "convenience", "club"],
    rationale:
      "High attach rate to core trips; pricing supports incremental units.",
  },
  {
    id: "profit_driver",
    roleName: "Profit Driver",
    description: "Categories prioritized for margin contribution.",
    expectedBehavior:
      "Background and strategic roles dominate; fewer deep KVI signals.",
    commonCategories: ["Health & beauty", "Pet", "General merchandise"],
    retailerContexts: ["grocery", "mass", "specialty", "apparel_softlines"],
    rationale:
      "Margin-led categories where architecture monetization outweighs traffic signaling.",
  },
  {
    id: "premiumization",
    roleName: "Premiumization",
    description: "Categories used to elevate price image and tier mix.",
    expectedBehavior:
      "Premium and foreground roles; clear ladder between tiers.",
    commonCategories: ["Organic", "Craft", "Premium spirits", "Specialty coffee"],
    retailerContexts: ["premium_grocery", "specialty", "grocery"],
    rationale:
      "Tier expansion and trade-up clarity support premiumization objectives.",
  },
  {
    id: "convenience_urgency",
    roleName: "Convenience / Urgency",
    description: "Immediate-need categories with convenience premium.",
    expectedBehavior:
      "Simplified architecture; speed and access over depth.",
    commonCategories: ["Beverages single-serve", "Tobacco", "Impulse snacks"],
    retailerContexts: ["convenience", "mass", "grocery"],
    rationale:
      "Urgency-driven missions tolerate different price architecture than stock-up.",
  },
  {
    id: "opportunistic_seasonal",
    roleName: "Opportunistic / Seasonal",
    description: "Time-bound or event-led categories.",
    expectedBehavior:
      "Seasonal/event item roles; promo and markdown cadence descriptive only.",
    commonCategories: ["Holiday", "Back to school", "Seasonal apparel"],
    retailerContexts: ["mass", "apparel_softlines", "grocery", "specialty"],
    rationale:
      "Event windows shift role mix temporarily without implying optimal depth.",
  },
];

export const CATEGORY_ROLE_BY_ID = new Map(
  CATEGORY_ROLES.map((r) => [r.id, r] as const),
);
