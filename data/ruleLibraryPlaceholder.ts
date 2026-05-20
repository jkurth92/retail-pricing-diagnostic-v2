import type { RuleLibrary } from "@/types/rules";

/**
 * Disabled rule library scaffold. No thresholds, formulas, or active logic.
 * Concepts may be linked from approved manifests after review — not from raw docs in Git.
 */
export const RULE_LIBRARY_PLACEHOLDER: RuleLibrary = {
  version: "0.0.0-scaffold",
  status: "not_configured",
  rules: [
    {
      id: "rule-kvi-gap",
      leverKey: "kvis",
      name: "KVI competitive gap detection",
      description:
        "Placeholder rule slot for KVI price positioning vs peer set. Requires alignment.",
      status: "disabled",
      conceptRefs: [],
      thresholdConfig: null,
      formulaConfig: null,
      alignmentRequired: true,
    },
    {
      id: "rule-architecture-ladder",
      leverKey: "price_architecture",
      name: "Price architecture ladder consistency",
      description:
        "Placeholder rule slot for good-better-best and pack-price relationships. Requires alignment.",
      status: "disabled",
      conceptRefs: [],
      thresholdConfig: null,
      formulaConfig: null,
      alignmentRequired: true,
    },
    {
      id: "rule-zoning-consistency",
      leverKey: "price_zoning",
      name: "Price zoning consistency",
      description:
        "Placeholder rule slot for geographic price dispersion. Requires alignment.",
      status: "disabled",
      conceptRefs: [],
      thresholdConfig: null,
      formulaConfig: null,
      alignmentRequired: true,
    },
    {
      id: "rule-promo-integration",
      leverKey: "promotions",
      name: "Promotion depth and integration",
      description:
        "Placeholder rule slot for promo effectiveness vs everyday price. Requires alignment.",
      status: "disabled",
      conceptRefs: [],
      thresholdConfig: null,
      formulaConfig: null,
      alignmentRequired: true,
    },
    {
      id: "rule-markdown-cadence",
      leverKey: "markdown",
      name: "Markdown cadence and recovery",
      description:
        "Placeholder rule slot for clearance patterns. Requires alignment.",
      status: "disabled",
      conceptRefs: [],
      thresholdConfig: null,
      formulaConfig: null,
      alignmentRequired: true,
    },
  ],
};
