import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { OpportunityType } from "@/types/opportunity-themes";

export type CalibrationBand = {
  opportunityType: OpportunityType;
  families: HypothesisFamily[];
  marginRangeLowPct: number;
  marginRangeHighPct: number;
  revenueSensitivityNote: string;
  recoverabilityDefault: "low" | "medium" | "high";
  themeLabel: string;
};

/** Bounded thematic pools — not optimized or SKU-level estimates. */
export const OPPORTUNITY_CALIBRATION_BANDS: CalibrationBand[] = [
  {
    opportunityType: "architecture_monetization",
    families: ["Architecture", "Premiumization"],
    marginRangeLowPct: 0.5,
    marginRangeHighPct: 1.5,
    revenueSensitivityNote: "Directional — secondary to margin structure",
    recoverabilityDefault: "medium",
    themeLabel: "Architecture monetization pool",
  },
  {
    opportunityType: "kvi_efficiency",
    families: ["KVI", "ValueCommunication"],
    marginRangeLowPct: 0.2,
    marginRangeHighPct: 0.7,
    revenueSensitivityNote: "Moderate trip and perception sensitivity",
    recoverabilityDefault: "medium",
    themeLabel: "KVI efficiency pool",
  },
  {
    opportunityType: "promo_efficiency",
    families: ["Promotions"],
    marginRangeLowPct: 0.3,
    marginRangeHighPct: 1.0,
    revenueSensitivityNote: "Promo cadence may affect volume — not modeled",
    recoverabilityDefault: "medium",
    themeLabel: "Promo efficiency pool",
  },
  {
    opportunityType: "markdown_lifecycle",
    families: ["Markdown"],
    marginRangeLowPct: 0.2,
    marginRangeHighPct: 0.8,
    revenueSensitivityNote: "Lifecycle and clearance — directional only",
    recoverabilityDefault: "low",
    themeLabel: "Markdown lifecycle pool",
  },
  {
    opportunityType: "governance_maturity",
    families: ["Governance", "RoleAlignment"],
    marginRangeLowPct: 0.3,
    marginRangeHighPct: 0.9,
    revenueSensitivityNote: "Execution and consistency — qualitative",
    recoverabilityDefault: "high",
    themeLabel: "Governance & alignment pool",
  },
];
