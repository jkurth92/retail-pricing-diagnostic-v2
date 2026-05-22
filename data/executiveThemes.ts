import type { ExecutiveThemeFamily } from "@/types/executive-theme";

export type ExecutiveThemeDefinition = {
  id: string;
  themeName: string;
  themeFamily: ExecutiveThemeFamily;
  summary: string;
  hypothesisIds: string[];
  strategicImportanceWeight: number;
  architecturePriority: boolean;
  narrativeKey: string;
  revenueSensitivityNote: string;
};

export const EXECUTIVE_THEME_DEFINITIONS: ExecutiveThemeDefinition[] = [
  {
    id: "theme-arch-compression",
    themeName: "Compressed premium architecture",
    themeFamily: "Architecture",
    summary:
      "Monetization architecture may be moderately compressed by value signaling and tight tier spacing in select categories.",
    hypothesisIds: [
      "hyp-arch-compression",
      "hyp-weak-pl-nb",
      "hyp-incoherent-ladder",
    ],
    strategicImportanceWeight: 100,
    architecturePriority: true,
    narrativeKey: "arch-compression",
    revenueSensitivityNote: "Moderate volume sensitivity where value anchors are visible",
  },
  {
    id: "theme-weak-premiumization",
    themeName: "Limited premium separation",
    themeFamily: "Premiumization",
    summary:
      "Premium tier spacing may trail archetype-typical separation without implying structural failure.",
    hypothesisIds: ["hyp-weak-premiumization"],
    strategicImportanceWeight: 92,
    architecturePriority: true,
    narrativeKey: "weak-premiumization",
    revenueSensitivityNote: "Low–moderate — mix shift more than traffic",
  },
  {
    id: "theme-weak-trade-up",
    themeName: "Limited trade-up clarity",
    themeFamily: "Architecture",
    summary:
      "Trade-up paths from KVI anchors to higher tiers may lack clarity.",
    hypothesisIds: ["hyp-weak-trade-up"],
    strategicImportanceWeight: 90,
    architecturePriority: true,
    narrativeKey: "weak-trade-up",
    revenueSensitivityNote: "Moderate basket expansion sensitivity",
  },
  {
    id: "theme-kvi-breadth",
    themeName: "Broad value concentration",
    themeFamily: "KVI",
    summary:
      "KVI signaling may be over-distributed, diluting focus categories.",
    hypothesisIds: ["hyp-kvi-breadth", "hyp-kvi-misaligned"],
    strategicImportanceWeight: 72,
    architecturePriority: false,
    narrativeKey: "kvi-breadth",
    revenueSensitivityNote: "Higher trip and perception sensitivity",
  },
  {
    id: "theme-kvi-concentration",
    themeName: "Diffuse KVI concentration",
    themeFamily: "KVI",
    summary:
      "KVI investment may lack concentration in trip-driving categories.",
    hypothesisIds: ["hyp-kvi-concentration"],
    strategicImportanceWeight: 68,
    architecturePriority: false,
    narrativeKey: "kvi-concentration",
    revenueSensitivityNote: "Moderate traffic-driver sensitivity",
  },
  {
    id: "theme-promo-dependency",
    themeName: "Promo dependency",
    themeFamily: "Promotions",
    summary:
      "Promotional cadence may carry disproportionate volume versus everyday price integrity.",
    hypothesisIds: [
      "hyp-promo-dependency",
      "hyp-weak-base-price",
      "hyp-broad-discounting",
    ],
    strategicImportanceWeight: 65,
    architecturePriority: false,
    narrativeKey: "promo-dependency",
    revenueSensitivityNote: "Moderate promo-volume sensitivity — not optimized",
  },
  {
    id: "theme-markdown-discipline",
    themeName: "Weak lifecycle / markdown discipline",
    themeFamily: "Markdown",
    summary:
      "Markdown rhythm and exit structure may lack disciplined lifecycle management.",
    hypothesisIds: [
      "hyp-markdown-cadence",
      "hyp-weak-lifecycle",
      "hyp-weak-exit",
    ],
    strategicImportanceWeight: 58,
    architecturePriority: false,
    narrativeKey: "markdown-discipline",
    revenueSensitivityNote: "Category-dependent; elevated for apparel / seasonal",
  },
  {
    id: "theme-strategic-consistency",
    themeName: "Weak strategic consistency",
    themeFamily: "Governance",
    summary:
      "Objectives, roles, and evidence readiness may lack coherent prioritization.",
    hypothesisIds: [
      "hyp-governance-consistency",
      "hyp-sophistication-limited",
      "hyp-execution-leakage",
      "hyp-role-alignment",
      "hyp-weak-opp",
    ],
    strategicImportanceWeight: 45,
    architecturePriority: false,
    narrativeKey: "strategic-consistency",
    revenueSensitivityNote: "Enabler theme — capture modifier, not primary volume lever",
  },
];

export const EXECUTIVE_THEME_BY_ID = new Map(
  EXECUTIVE_THEME_DEFINITIONS.map((t) => [t.id, t] as const),
);
