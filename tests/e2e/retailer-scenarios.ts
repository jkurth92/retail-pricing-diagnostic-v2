import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";
import type { ExecutiveThemeFamily } from "@/types/executive-theme";

export type RetailerValidationScenario = {
  id: string;
  label: string;
  retailerName: string;
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint: string;
  expectedStorylineEmphasis: ExecutiveThemeFamily[];
  expectedOpportunityEmphasis: "margin_primary" | "margin_with_promo_secondary";
  expectedConfidenceBehavior: "suppress_low" | "partial_ok";
  notes: string;
};

/** Representative retailer setups for internal validation — not production logic. */
export const RETAILER_VALIDATION_SCENARIOS: RetailerValidationScenario[] = [
  {
    id: "grocery_edlp",
    label: "Grocery / EDLP",
    retailerName: "Kroger",
    archetypeId: "grocery",
    pricingPosture: "EDLP",
    strategicObjectives: ["value_perception", "traffic_growth"],
    categoryHint: "Laundry detergent",
    expectedStorylineEmphasis: ["Architecture", "KVI", "Governance"],
    expectedOpportunityEmphasis: "margin_primary",
    expectedConfidenceBehavior: "suppress_low",
    notes: "Trip-driven categories; visible value and architecture separation expected.",
  },
  {
    id: "mass_hybrid",
    label: "Mass / Hybrid",
    retailerName: "Target",
    archetypeId: "mass",
    pricingPosture: "Hybrid",
    strategicObjectives: ["premiumization", "margin_expansion"],
    categoryHint: "Household essentials",
    expectedStorylineEmphasis: ["Architecture", "Premiumization", "Promotions"],
    expectedOpportunityEmphasis: "margin_primary",
    expectedConfidenceBehavior: "suppress_low",
    notes: "Style + value tension; promo cadence may appear as secondary theme.",
  },
  {
    id: "premium_grocery",
    label: "Premium grocery",
    retailerName: "Whole Foods Market",
    archetypeId: "premium_grocery",
    pricingPosture: "Premium",
    strategicObjectives: ["premiumization", "value_perception"],
    categoryHint: "Organic produce",
    expectedStorylineEmphasis: ["Premiumization", "Architecture", "KVI"],
    expectedOpportunityEmphasis: "margin_primary",
    expectedConfidenceBehavior: "partial_ok",
    notes: "Subsidiary banner — enrichment may be partial; manual context expected.",
  },
  {
    id: "club_edlp",
    label: "Club / EDLP",
    retailerName: "Costco",
    archetypeId: "club",
    pricingPosture: "EDLP",
    strategicObjectives: ["value_perception", "traffic_growth"],
    categoryHint: "Packaged beverages",
    expectedStorylineEmphasis: ["Architecture", "KVI"],
    expectedOpportunityEmphasis: "margin_primary",
    expectedConfidenceBehavior: "suppress_low",
    notes: "Warehouse model — limited promo themes; architecture and KVI lead.",
  },
  {
    id: "convenience_value",
    label: "Convenience",
    retailerName: "Dollar General",
    archetypeId: "convenience",
    pricingPosture: "Value",
    strategicObjectives: ["traffic_growth", "value_perception"],
    categoryHint: "Snacks",
    expectedStorylineEmphasis: ["KVI", "Architecture"],
    expectedOpportunityEmphasis: "margin_primary",
    expectedConfidenceBehavior: "suppress_low",
    notes: "Small-box value posture; concentrated visible price investment.",
  },
  {
    id: "apparel_softlines",
    label: "Apparel / Softlines",
    retailerName: "Gap",
    archetypeId: "apparel_softlines",
    pricingPosture: "HiLo",
    strategicObjectives: ["margin_expansion", "basket_expansion"],
    categoryHint: "Denim",
    expectedStorylineEmphasis: ["Markdown", "Promotions", "Architecture"],
    expectedOpportunityEmphasis: "margin_with_promo_secondary",
    expectedConfidenceBehavior: "suppress_low",
    notes: "Seasonality and markdown structure should surface in storyline.",
  },
  {
    id: "specialty_authority",
    label: "Specialty retailer",
    retailerName: "Best Buy",
    archetypeId: "specialty",
    pricingPosture: "HiLo",
    strategicObjectives: ["margin_expansion", "premiumization"],
    categoryHint: "Consumer electronics",
    expectedStorylineEmphasis: ["Architecture", "Promotions", "Premiumization"],
    expectedOpportunityEmphasis: "margin_primary",
    expectedConfidenceBehavior: "suppress_low",
    notes: "Category authority; architecture and promo integration themes expected.",
  },
];
