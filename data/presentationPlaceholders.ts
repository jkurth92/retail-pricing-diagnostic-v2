import type { LeverKey } from "@/types/diagnostic-output";

/** Illustrative only — not calculated by the engine. */
export type IllustrativeOpportunityRange = {
  leverKey: LeverKey;
  label: string;
  lowBps: string;
  baseBps: string;
  highBps: string;
  theme: string;
};

export const POC_DISCLAIMER =
  "POC scaffolding — illustrative structure only. Not a pricing recommendation, benchmark verdict, or final opportunity estimate.";

export const DIAGNOSTIC_HYPOTHESIS_THEMES: {
  id: string;
  family: string;
  theme: string;
  description: string;
  linkedConcepts: string[];
}[] = [
  {
    id: "hyp-kvi-structure",
    family: "KVI",
    theme: "KVI concentration and visibility",
    description:
      "Future diagnostic would test whether KVI breadth and revenue share match archetype expectations.",
    linkedConcepts: ["kvi-breadth", "kvi-concentration", "value-visibility"],
  },
  {
    id: "hyp-ladder",
    family: "Architecture",
    theme: "Ladder integrity and trade-up clarity",
    description:
      "Future diagnostic would describe tier spacing and premium/entry gaps — no optimal gap prescribed.",
    linkedConcepts: ["ladder-integrity", "trade-up-clarity", "architecture-compression"],
  },
  {
    id: "hyp-zoning",
    family: "Zoning",
    theme: "Zone pricing sophistication",
    description:
      "Future diagnostic would characterize variance and uniform price share across zones.",
    linkedConcepts: ["zoning-sophistication"],
  },
  {
    id: "hyp-promo",
    family: "Promotions",
    theme: "Promotional cadence and dependency",
    description:
      "Future diagnostic would measure promo depth and frequency as structural descriptors.",
    linkedConcepts: ["promo-dependency"],
  },
  {
    id: "hyp-markdown",
    family: "Markdown",
    theme: "Markdown cadence and recovery",
    description:
      "Future diagnostic would profile markdown aging and category exposure — not clearance optimization.",
    linkedConcepts: ["markdown-cadence"],
  },
  {
    id: "hyp-roles",
    family: "Category & item roles",
    theme: "Role consistency vs inferred structure",
    description:
      "Future diagnostic would compare observed patterns to inferred category and item roles.",
    linkedConcepts: ["category-role-fit", "item-role-structure"],
  },
];

export const ILLUSTRATIVE_OPPORTUNITY_RANGES: IllustrativeOpportunityRange[] = [
  {
    leverKey: "kvis",
    label: "KVIs",
    lowBps: "15–25 bps",
    baseBps: "35–50 bps",
    highBps: "60–80 bps",
    theme: "KVI structure and value signaling",
  },
  {
    leverKey: "price_architecture",
    label: "Price architecture",
    lowBps: "20–40 bps",
    baseBps: "50–75 bps",
    highBps: "90–120 bps",
    theme: "Ladder integrity and trade-up",
  },
  {
    leverKey: "price_zoning",
    label: "Price zoning",
    lowBps: "10–20 bps",
    baseBps: "25–40 bps",
    highBps: "45–65 bps",
    theme: "Zone harmonization and outliers",
  },
  {
    leverKey: "promotions",
    label: "Promotions",
    lowBps: "25–45 bps",
    baseBps: "55–85 bps",
    highBps: "100–140 bps",
    theme: "Promo cadence and integration",
  },
  {
    leverKey: "markdown",
    label: "Markdown",
    lowBps: "15–30 bps",
    baseBps: "35–55 bps",
    highBps: "65–95 bps",
    theme: "Markdown exposure and aging",
  },
];

export const FRAMEWORK_LAYER_LABELS = [
  { step: 1, name: "Client context", status: "Active (POC)" },
  { step: 2, name: "Evidence & normalization", status: "Preview only" },
  { step: 3, name: "Pattern features", status: "Defined, not calculated" },
  { step: 4, name: "Knowledge & inference", status: "Active (POC)" },
  { step: 5, name: "Hypothesis engine", status: "Active (POC)" },
  { step: 6, name: "Storyline & opportunity", status: "Active (POC)" },
] as const;
