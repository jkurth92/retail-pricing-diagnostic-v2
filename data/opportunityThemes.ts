import type { OpportunityTheme } from "@/types/opportunity-themes";

/** Base theme templates — calibrated ranges applied at runtime. */
export const OPPORTUNITY_THEME_TEMPLATES: Record<
  string,
  Omit<OpportunityTheme, "estimatedMarginRange">
> = {
  "theme-arch-monetization": {
    id: "theme-arch-monetization",
    themeName: "Architecture monetization",
    opportunityType: "architecture_monetization",
    estimatedRevenueSensitivity: "Directional — secondary to margin structure",
    recoverability: "medium",
    explanation:
      "Recoverable value from clarifying tier ladders, trade-up paths, and private-label separation without prescribing price points.",
    elasticitySensitivity: "moderate",
  },
  "theme-kvi-efficiency": {
    id: "theme-kvi-efficiency",
    themeName: "KVI efficiency",
    opportunityType: "kvi_efficiency",
    estimatedRevenueSensitivity: "Trip and perception sensitivity — qualitative",
    recoverability: "medium",
    explanation:
      "Thematic pool from aligning KVI breadth and concentration with archetype role structure.",
    elasticitySensitivity: "high",
  },
  "theme-promo-efficiency": {
    id: "theme-promo-efficiency",
    themeName: "Promo efficiency",
    opportunityType: "promo_efficiency",
    estimatedRevenueSensitivity: "Volume effects not quantified in POC",
    recoverability: "medium",
    explanation:
      "Thematic pool from promo cadence and base-price integrity — not optimal depth targets.",
    elasticitySensitivity: "moderate",
  },
  "theme-markdown-lifecycle": {
    id: "theme-markdown-lifecycle",
    themeName: "Markdown lifecycle",
    opportunityType: "markdown_lifecycle",
    estimatedRevenueSensitivity: "Clearance timing — directional",
    recoverability: "low",
    explanation:
      "Thematic pool from markdown cadence and exit discipline descriptors.",
    elasticitySensitivity: "low",
  },
  "theme-governance": {
    id: "theme-governance",
    themeName: "Governance & coherence",
    opportunityType: "governance_maturity",
    estimatedRevenueSensitivity: "Secondary to structural margin themes",
    recoverability: "high",
    explanation:
      "Thematic pool from strategic consistency and pricing sophistication signals.",
    elasticitySensitivity: "low",
  },
};
