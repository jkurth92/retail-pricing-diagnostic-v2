import type { RationaleTemplate } from "@/types/benchmark-concepts";

export const RATIONALE_TEMPLATES: RationaleTemplate[] = [
  {
    id: "traffic-driver-mass",
    templateName: "Mass traffic driver",
    applicableContexts: ["mass", "traffic_driver"],
    rationaleText:
      "Highly comparable national-brand category commonly used for visible value signaling in mass retail.",
  },
  {
    id: "traffic-driver-grocery",
    templateName: "Grocery traffic driver",
    applicableContexts: ["grocery", "traffic_driver"],
    rationaleText:
      "Trip-driving consumables category where EDLP or sharp HiLo signals anchor store price image.",
  },
  {
    id: "basket-builder-default",
    templateName: "Basket builder complement",
    applicableContexts: ["basket_builder"],
    rationaleText:
      "Complementary category expected to expand basket size with moderate KVI visibility and architecture-led trade-up.",
  },
  {
    id: "premiumization-tier",
    templateName: "Premiumization tier clarity",
    applicableContexts: ["premiumization", "premium_grocery"],
    rationaleText:
      "Category supports tier storytelling and premium share expansion; architecture clarity is the primary signal.",
  },
  {
    id: "profit-driver-margin",
    templateName: "Profit driver architecture",
    applicableContexts: ["profit_driver"],
    rationaleText:
      "Margin-led category where background and strategic roles dominate; fewer deep KVI comparables required.",
  },
  {
    id: "convenience-urgency",
    templateName: "Convenience urgency",
    applicableContexts: ["convenience", "convenience_urgency"],
    rationaleText:
      "Immediate-need mission prioritizes access and simplicity over deep promotional architecture.",
  },
  {
    id: "seasonal-event",
    templateName: "Seasonal / event window",
    applicableContexts: ["opportunistic_seasonal", "apparel_softlines"],
    rationaleText:
      "Time-bound assortment window shifts item role mix toward seasonal/event roles without prescribing optimal depth.",
  },
  {
    id: "club-pack-value",
    templateName: "Club pack value",
    applicableContexts: ["club", "traffic_driver"],
    rationaleText:
      "Pack-led value signaling in warehouse club context; unit economics descriptors apply after normalization.",
  },
  {
    id: "discount-value-signal",
    templateName: "Discount value signaling",
    applicableContexts: ["discount", "traffic_driver"],
    rationaleText:
      "Value-led archetype expects elevated KVI and OPP share for national-brand comparables.",
  },
  {
    id: "objective-value-perception",
    templateName: "Value perception objective",
    applicableContexts: ["value_perception"],
    rationaleText:
      "Strategic objective emphasizes KVI and foreground signaling — descriptive structure only, not a performance verdict.",
  },
];

export const RATIONALE_TEMPLATE_BY_ID = new Map(
  RATIONALE_TEMPLATES.map((t) => [t.id, t] as const),
);
