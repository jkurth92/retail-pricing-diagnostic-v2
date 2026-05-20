import type {
  AssumptionStatus,
  CalculationStatus,
  ConfidenceLevel,
  EvidenceSourceType,
  LeverKey,
  SeverityLevel,
} from "@/types/diagnostic-output";

/** Rule lifecycle — active rules require explicit alignment before enablement. */
export type RuleStatus =
  | "disabled"
  | "pending_review"
  | "pending_alignment"
  | "approved_not_implemented";

export type RuleConceptReference = {
  id: string;
  label: string;
  sourceManifestId: string | null;
  reviewStatus: RuleStatus;
  notes: string;
};

export type DiagnosticRuleDefinition = {
  id: string;
  leverKey: LeverKey;
  name: string;
  description: string;
  status: RuleStatus;
  conceptRefs: RuleConceptReference[];
  thresholdConfig: null;
  formulaConfig: null;
  alignmentRequired: true;
};

export type RuleLibrary = {
  version: string;
  status: CalculationStatus;
  rules: DiagnosticRuleDefinition[];
};

export type RuleAssumptionLink = {
  ruleId: string;
  assumptionId: string;
  status: AssumptionStatus;
};

export type RuleEvidenceLink = {
  ruleId: string;
  evidenceId: string;
  sourceType: EvidenceSourceType;
  status: CalculationStatus;
};

export type RuleConfidenceBinding = {
  ruleId: string;
  leverKey: LeverKey;
  confidence: ConfidenceLevel;
  severity: SeverityLevel;
  status: CalculationStatus;
};

export type EngineRunInput = {
  runId: string;
  scopeDefined: boolean;
  uploadsPresent: boolean;
  rulesApproved: boolean;
};

export type EngineRunResult = {
  runId: string;
  status: CalculationStatus;
  message: string;
  opportunityAmount: number | null;
  findingsCount: number;
  rulesEvaluated: number;
};
