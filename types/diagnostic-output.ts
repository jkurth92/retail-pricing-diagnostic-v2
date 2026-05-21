import type { CompetitorSet } from "@/types/competitors";
import type { DataReadinessModel } from "@/types/data-readiness";
import type { ObservedPricingPatternsOutput } from "@/types/observed-patterns";
import type { RetailerOverviewOutput } from "@/types/retailer-overview";
import type { ScopeDefinition } from "@/types/scope";

export type WorkflowStep =
  | "client_context"
  | "data_scope"
  | "pricing_profile"
  | "structural_themes"
  | "opportunity_overview"
  | "strategic_implications"
  | "supporting_diagnostics"
  | "validation_review";

export type LeverKey =
  | "kvis"
  | "price_architecture"
  | "price_zoning"
  | "promotions"
  | "markdown";

export type DiagnosticRunStatus =
  | "not_started"
  | "setup_in_progress"
  | "data_loaded"
  | "analysis_pending"
  | "ready_for_review"
  | "complete";

export type CalculationStatus =
  | "not_configured"
  | "pending_alignment"
  | "insufficient_data"
  | "ready_for_engine"
  | "calculated";

export type ConfidenceLevel =
  | "not_assessed"
  | "low"
  | "medium"
  | "high";

export type SeverityLevel = "not_assessed" | "low" | "medium" | "high";

export type AssumptionStatus =
  | "not_configured"
  | "pending_alignment"
  | "user_provided"
  | "system_default"
  | "calculated_later";

export type EvidenceSourceType =
  | "client_upload"
  | "user_input"
  | "public_data"
  | "benchmark_rule"
  | "consultant_override"
  | "not_available";

export type OpportunityRange = {
  low: number | null;
  base: number | null;
  high: number | null;
  unit: "currency" | "bps" | "percent_of_revenue";
  calculationStatus: CalculationStatus;
};

export type EvidenceItem = {
  id: string;
  sourceType: EvidenceSourceType;
  label: string;
  description: string;
  status: CalculationStatus;
  linkedLeverKeys: LeverKey[];
};

export type AssumptionItem = {
  id: string;
  category: string;
  label: string;
  value: number | string | null;
  status: AssumptionStatus;
  notes: string | null;
};

export type UserOverrideItem = {
  id: string;
  field: string;
  label: string;
  enabled: boolean;
  value: number | string | null;
  status: AssumptionStatus;
};

export type FindingOutput = {
  id: string;
  leverKey: LeverKey;
  title: string;
  summary: string;
  severity: SeverityLevel;
  confidence: ConfidenceLevel;
  evidenceIds: string[];
  calculationStatus: CalculationStatus;
};

export type LeverOpportunityOutput = {
  leverKey: LeverKey;
  label: string;
  opportunityAmount: number | null;
  opportunityBps: number | null;
  opportunityPercentOfRevenue: number | null;
  calculationStatus: CalculationStatus;
  confidence: ConfidenceLevel;
  severity: SeverityLevel;
  evidenceCoverageLabel: string;
  nextStep: string;
  alignmentNote: string;
};

export type TotalOpportunitySummary = {
  revenueInScope: number | null;
  revenueInScopeLabel: string;
  opportunityRange: OpportunityRange;
  opportunityPercentOfRevenue: number | null;
  overallConfidence: ConfidenceLevel;
  calculationStatus: CalculationStatus;
};

export type ClientContextSummary = {
  retailerName: string | null;
  retailerFormat: string | null;
  pricingPosture: string | null;
  eprAverage: number | null;
  eprMaturityLabel: string | null;
  competitorCount: number;
  selectedPeerCount: number;
};

export type DataReadinessSummary = {
  clientUploadEvidence: CalculationStatus;
  userInputEvidence: CalculationStatus;
  publicDataEvidence: CalculationStatus;
  benchmarkRuleEvidence: CalculationStatus;
  consultantOverrides: CalculationStatus;
};

export type ConfidenceSummary = {
  overall: ConfidenceLevel;
  byLever: Record<LeverKey, ConfidenceLevel>;
  notes: string;
};

export type MemoReadinessSummary = {
  executiveSummary: CalculationStatus;
  findings: CalculationStatus;
  evidence: CalculationStatus;
  assumptions: CalculationStatus;
  recommendations: CalculationStatus;
};

export type DiagnosticRunOutput = {
  runId: string;
  status: DiagnosticRunStatus;
  workflowStep: WorkflowStep;
  clientContext: ClientContextSummary;
  competitorSet: CompetitorSet | null;
  uploadReadiness: DataReadinessModel | null;
  scope: ScopeDefinition;
  retailerOverview: RetailerOverviewOutput;
  observedPatterns: ObservedPricingPatternsOutput;
  totalOpportunity: TotalOpportunitySummary;
  leverOpportunities: LeverOpportunityOutput[];
  findings: FindingOutput[];
  evidence: EvidenceItem[];
  assumptions: AssumptionItem[];
  userOverrides: UserOverrideItem[];
  confidence: ConfidenceSummary;
  memoReadiness: MemoReadinessSummary;
  dataReadiness: DataReadinessSummary;
  generatedAt: string | null;
};
