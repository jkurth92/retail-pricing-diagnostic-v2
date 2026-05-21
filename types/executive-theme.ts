import type { ConfidenceScore } from "@/types/confidence-scoring";
import type { DiagnosticHypothesis } from "@/types/diagnostic-hypotheses";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { RecoverabilityLevel } from "@/types/opportunity-themes";

export type ExecutiveThemeFamily =
  | "Architecture"
  | "KVI"
  | "Promotions"
  | "Markdown"
  | "Governance"
  | "ValueCommunication"
  | "Premiumization"
  | "RoleAlignment";

export type StrategicImportance = "primary" | "secondary" | "contextual";

export type ExecutiveTheme = {
  id: string;
  themeName: string;
  themeFamily: ExecutiveThemeFamily;
  summary: string;
  supportingHypotheses: DiagnosticHypothesis[];
  supportingSignals: SupportingSignal[];
  confidence: ConfidenceScore;
  marginOpportunityRange: string;
  marginOpportunityLowPct: number;
  marginOpportunityHighPct: number;
  revenueSensitivityRange: string;
  recoverability: RecoverabilityLevel;
  strategicImportance: StrategicImportance;
  retailerContextNotes: string;
  rank: number;
};
