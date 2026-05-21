import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { OpportunityTraceRow } from "@/types/opportunity-trace";

/** Soft directional position — never pass/fail. */
export type BenchmarkComparisonPosition =
  | "below_expected"
  | "narrower_than_typical"
  | "within_expected"
  | "broader_than_expected"
  | "above_expected"
  | "consistent_with_leading";

export type StructuralMetricKind =
  | "premium_mainstream_gap"
  | "entry_mainstream_gap"
  | "pl_nb_gap"
  | "kvi_revenue_share";

export type BenchmarkRangePct = {
  lowPct: number;
  highPct: number;
  label: string;
};

export type CategorySensitivityProfile = {
  scopeCategory: string;
  sensitivityNote: string;
  premiumizationOpportunity: "low" | "moderate" | "high";
  kviWeight: "low" | "moderate" | "high";
  elasticityFraming: "low" | "moderate" | "high";
};

export type BenchmarkInterpretation = {
  metricKind: StructuralMetricKind;
  observedPct: number | null;
  observedDisplay: string;
  expectedRange: BenchmarkRangePct;
  position: BenchmarkComparisonPosition;
  /** Consulting-style phrase — no pass/fail language */
  narrativePhrase: string;
  /** 0–1 contextual severity for opportunity weighting */
  severityWeight: number;
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  category?: string;
};

export type BenchmarkOpportunitySeverity =
  | "mild"
  | "moderate"
  | "significant"
  | "transformation";

export type NormativeStructureSnapshot = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  coherenceQuestion: string;
  archetypeStructuralNote: string;
  postureStructuralNote: string;
  kviExpectedRange: BenchmarkRangePct;
  premiumMainstreamGapRange: BenchmarkRangePct;
  plNbGapRange: BenchmarkRangePct;
  entryMainstreamGapRange: BenchmarkRangePct;
};

export type BenchmarkCalibrationBundle = {
  engineVersion: string;
  generatedAt: string;
  normative: NormativeStructureSnapshot;
  interpretations: BenchmarkInterpretation[];
  /** Portfolio-level severity for opportunity band selection */
  portfolioSeverity: BenchmarkOpportunitySeverity;
  /** Per-family severity hints */
  familySeverity: Partial<Record<HypothesisFamily, BenchmarkOpportunitySeverity>>;
  benchmarkWidthMultiplier: number;
  maturityModifier: number;
  exposureSummaryLines: string[];
  executiveContextLines: string[];
  traceRows: OpportunityTraceRow[];
};
