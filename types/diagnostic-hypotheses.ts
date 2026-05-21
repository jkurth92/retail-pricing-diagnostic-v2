import type { ConfidenceScore } from "@/types/confidence-scoring";
import type { OpportunityTheme } from "@/types/opportunity-themes";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type HypothesisFamily =
  | "Architecture"
  | "KVI"
  | "Promotions"
  | "Markdown"
  | "Governance"
  | "ValueCommunication"
  | "Premiumization"
  | "RoleAlignment";

export type SignalStrength = "weak" | "moderate" | "strong";

export type SupportingSignal = {
  signalId: string;
  signalName: string;
  signalFamily: HypothesisFamily | "CrossCutting";
  signalStrength: SignalStrength;
  explanation: string;
};

export type ElasticitySensitivity = "low" | "moderate" | "high";

export type HypothesisStatus =
  | "surfaced"
  | "suppressed_low_confidence"
  | "pending_evidence";

export type DiagnosticHypothesis = {
  id: string;
  hypothesisName: string;
  hypothesisFamily: HypothesisFamily;
  description: string;
  rationale: string;
  supportingSignals: SupportingSignal[];
  conflictingSignals: SupportingSignal[];
  retailerContexts: RetailerArchetypeId[];
  categoryContexts: string[];
  architectureImplications: string[];
  confidence: ConfidenceScore;
  opportunityTheme: OpportunityTheme;
  elasticitySensitivity: ElasticitySensitivity;
  status: HypothesisStatus;
  priorityRank: number;
};

export type DiagnosticHypothesisOutput = {
  generatedAt: string;
  engineVersion: string;
  guardrailMessage: string;
  hypotheses: DiagnosticHypothesis[];
  suppressedCount: number;
  architectureFirstNote: string;
};
