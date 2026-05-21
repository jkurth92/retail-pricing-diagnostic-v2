import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";

export type RecoverabilityLevel = "low" | "medium" | "high";

export type OpportunityType =
  | "margin_efficiency"
  | "architecture_monetization"
  | "kvi_efficiency"
  | "promo_efficiency"
  | "markdown_lifecycle"
  | "governance_maturity";

export type OpportunityTheme = {
  id: string;
  themeName: string;
  opportunityType: OpportunityType;
  estimatedMarginRange: string;
  estimatedRevenueSensitivity: string;
  recoverability: RecoverabilityLevel;
  explanation: string;
  elasticitySensitivity: ElasticitySensitivity;
  /** Deterministic sizing path for audit — same math as estimatedMarginRange */
  calculationTrace?: OpportunityCalculationTrace;
};
