import type { RetailerArchetype } from "@/types/retailer-archetypes";

export const RETAILER_ARCHETYPES: RetailerArchetype[] = [
  {
    id: "grocery",
    archetypeName: "Grocery",
    description:
      "Full-line food and consumables with trip-based missions and EDLP/HiLo blends.",
    pricingPostures: ["EDLP", "HiLo", "Hybrid", "Value"],
    expectedCategoryRoles: [
      "traffic_driver",
      "basket_builder",
      "destination",
      "profit_driver",
    ],
    expectedItemRoleMix: [
      { roleId: "kvi", typicalSharePct: "8–12%" },
      { roleId: "foreground", typicalSharePct: "20–30%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["everyday_low_price", "tier_clarity", "pack_value"],
    expectedArchitecturePatterns: [
      "National-brand ladder with private label gap",
      "Category-level KVI concentration",
      "Zone harmonization with regional exceptions",
    ],
    notes: "Illustrative structure only — not a benchmark verdict.",
  },
  {
    id: "mass",
    archetypeName: "Mass",
    description:
      "Broad assortment with strong value signaling on trip-driving categories.",
    pricingPostures: ["EDLP", "HiLo", "Hybrid", "Value"],
    expectedCategoryRoles: [
      "traffic_driver",
      "basket_builder",
      "profit_driver",
      "opportunistic_seasonal",
    ],
    expectedItemRoleMix: [
      { roleId: "kvi", typicalSharePct: "10–15%" },
      { roleId: "foreground", typicalSharePct: "25%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: [
      "everyday_low_price",
      "promotional_depth",
      "pack_value",
    ],
    expectedArchitecturePatterns: [
      "High-visibility KVI bands",
      "OPP-led entry tiers in key categories",
      "Promo-forward seasonal zones",
    ],
    notes: "Mass archetype emphasizes visible national-brand comparables.",
  },
  {
    id: "discount",
    archetypeName: "Discount",
    description:
      "Value-led missions with simplified architecture and aggressive signaling.",
    pricingPostures: ["EDLP", "Value", "HiLo"],
    expectedCategoryRoles: ["traffic_driver", "basket_builder", "profit_driver"],
    expectedItemRoleMix: [
      { roleId: "super_kvi", typicalSharePct: "5–8%" },
      { roleId: "kvi", typicalSharePct: "12–18%" },
      { roleId: "opp", typicalSharePct: "15–20%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["everyday_low_price", "pack_value"],
    expectedArchitecturePatterns: [
      "Compressed ladders",
      "Limited tier count",
      "High uniform price share",
    ],
    notes: "Descriptive expectations — no optimal price levels.",
  },
  {
    id: "premium_grocery",
    archetypeName: "Premium Grocery",
    description:
      "Quality-led assortment with premiumization and destination categories.",
    pricingPostures: ["Premium", "Hybrid", "EDLP", "Specialty"],
    expectedCategoryRoles: [
      "destination",
      "premiumization",
      "basket_builder",
      "profit_driver",
    ],
    expectedItemRoleMix: [
      { roleId: "premium", typicalSharePct: "15–25%" },
      { roleId: "foreground", typicalSharePct: "25–35%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["tier_clarity", "exclusive_assortment", "brand_preference"],
    expectedArchitecturePatterns: [
      "Wide premium vs mainstream gaps",
      "Destination-led architecture",
      "Lower promo dependency in core fresh",
    ],
    notes: "Premiumization is structural, not a performance score.",
  },
  {
    id: "club",
    archetypeName: "Club",
    description:
      "Warehouse club with pack-led value and membership-driven missions.",
    pricingPostures: ["EDLP", "Value", "Hybrid"],
    expectedCategoryRoles: ["traffic_driver", "basket_builder", "destination"],
    expectedItemRoleMix: [
      { roleId: "kvi", typicalSharePct: "5–10%" },
      { roleId: "foreground", typicalSharePct: "20%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["pack_value", "everyday_low_price"],
    expectedArchitecturePatterns: [
      "Pack-size-led unit economics",
      "Limited SKU breadth per category",
      "Low zoning complexity",
    ],
    notes: "Club models emphasize pack ladders over item proliferation.",
  },
  {
    id: "convenience",
    archetypeName: "Convenience",
    description: "Immediate-need missions with convenience premium architecture.",
    pricingPostures: ["Convenience", "EDLP", "Hybrid"],
    expectedCategoryRoles: [
      "convenience_urgency",
      "basket_builder",
      "traffic_driver",
    ],
    expectedItemRoleMix: [
      { roleId: "foreground", typicalSharePct: "30–40%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["speed_and_access", "everyday_low_price"],
    expectedArchitecturePatterns: [
      "Simplified ladders",
      "Limited promo overlap",
      "High foreground share",
    ],
    notes: "Urgency premium is contextual, not judged good or bad.",
  },
  {
    id: "specialty",
    archetypeName: "Specialty",
    description:
      "Focused assortment with authority positioning in key categories.",
    pricingPostures: ["Specialty", "Premium", "Hybrid"],
    expectedCategoryRoles: [
      "destination",
      "premiumization",
      "profit_driver",
    ],
    expectedItemRoleMix: [
      { roleId: "premium", typicalSharePct: "20–30%" },
      { roleId: "strategic", typicalSharePct: "10–15%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["exclusive_assortment", "brand_preference", "tier_clarity"],
    expectedArchitecturePatterns: [
      "Narrow but deep ladders",
      "Strategic exclusives",
      "Lower KVI share vs mass",
    ],
    notes: "Specialty archetypes de-emphasize national KVI comparables.",
  },
  {
    id: "apparel_softlines",
    archetypeName: "Apparel / Softlines",
    description:
      "Style-led categories with seasonal and event-driven role shifts.",
    pricingPostures: ["HiLo", "Hybrid", "Premium", "Value"],
    expectedCategoryRoles: [
      "opportunistic_seasonal",
      "profit_driver",
      "premiumization",
    ],
    expectedItemRoleMix: [
      { roleId: "seasonal_event", typicalSharePct: "15–25%" },
      { roleId: "foreground", typicalSharePct: "25–35%" },
      { roleId: "background", typicalSharePct: "remainder" },
    ],
    expectedValueSignals: ["promotional_depth", "tier_clarity"],
    expectedArchitecturePatterns: [
      "Markdown cadence descriptors",
      "Seasonal promo windows",
      "Style-tier ladders",
    ],
    notes: "Softlines rely on event roles — still no active markdown rules.",
  },
];

export const RETAILER_ARCHETYPE_BY_ID = new Map(
  RETAILER_ARCHETYPES.map((a) => [a.id, a] as const),
);

export const KNOWLEDGE_PRICING_POSTURES = [
  "EDLP",
  "HiLo",
  "Hybrid",
  "Premium",
  "Value",
  "Convenience",
  "Specialty",
] as const;
