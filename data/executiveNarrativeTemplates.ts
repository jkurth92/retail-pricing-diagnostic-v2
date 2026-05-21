import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type ExecutiveNarrativeFragment = {
  lead: string;
  bridge: string;
  close: string;
};

export const EXECUTIVE_NARRATIVE_BY_THEME: Record<
  string,
  ExecutiveNarrativeFragment
> = {
  "arch-compression": {
    lead: "Observed pricing structure suggests broad value investment is compressing monetization architecture",
    bridge:
      "visible value in traffic-driving areas may be preserved, but tier separation and recoverable margin can erode",
    close:
      "limiting effective premium separation and trade-up clarity without implying a single corrective price action",
  },
  "weak-premiumization": {
    lead: "Premiumization intent may run ahead of observable tier storytelling",
    bridge:
      "premium and foreground roles may not be sufficiently separated from mainstream anchors",
    close:
      "which constrains mix-led margin expansion in categories targeted for upgrade",
  },
  "weak-trade-up": {
    lead: "Trade-up structure may be under-supported between KVI anchors and higher tiers",
    bridge:
      "basket economics in complementary categories depend on clear foreground and premium spacing",
    close:
      "as a structural theme rather than isolated SKU gaps",
  },
  "kvi-breadth": {
    lead: "KVI signaling may be distributed too broadly across the assortment",
    bridge:
      "diluting concentration in categories that most affect trip and price image",
    close:
      "with value-perception objectives amplifying the breadth theme",
  },
  "kvi-concentration": {
    lead: "KVI investment may lack focus in traffic-driving categories",
    bridge:
      "where comparability and trip mission matter most",
    close:
      "as an efficiency theme distinct from simply lowering prices",
  },
  "promo-dependency": {
    lead: "Promotional cadence may carry a disproportionate share of volume narrative",
    bridge:
      "everyday reference price integrity can weaken when depth is wide or frequent",
    close:
      "without prescribing optimal promotional depth",
  },
  "markdown-discipline": {
    lead: "Markdown and lifecycle structure may reflect sustained clearance rhythm",
    bridge:
      "exit timing and aging descriptors suggest discipline gaps in seasonal contexts",
    close:
      "as a structural lifecycle theme — not clearance optimization",
  },
  "strategic-consistency": {
    lead: "Strategic objectives, inferred roles, and evidence readiness may lack single-threaded prioritization",
    bridge:
      "governance themes often determine how much of architecture and KVI opportunity is capturable",
    close:
      "as an enabler rather than the primary margin pool",
  },
};

export const ARCHETYPE_NARRATIVE_CONTEXT: Record<
  RetailerArchetypeId,
  string
> = {
  mass: "In a mass retail archetype, national-brand comparables and EDLP/HiLo postures amplify architecture and KVI themes.",
  grocery: "In grocery, trip-driving categories and EDLP blends make architecture–KVI coherence especially visible.",
  discount: "Discount missions compress ladders by design — the question is whether compression is intentional or excessive.",
  premium_grocery: "Premium grocery missions elevate tier clarity and destination categories in the storyline.",
  club: "Club models emphasize pack value; architecture themes focus on unit economics more than SKU proliferation.",
  convenience: "Convenience missions de-emphasize deep ladders; themes focus on urgency and simplicity.",
  specialty: "Specialty authority reduces reliance on national KVI comparables; premiumization themes rise in weight.",
  apparel_softlines: "Apparel and softlines elevate markdown lifecycle and promotional rhythm in the storyline.",
};
