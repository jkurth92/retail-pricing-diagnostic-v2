/** Auditable, deterministic trace for thematic opportunity sizing (not optimization). */

export type OpportunityTraceRow = {
  label: string;
  value: string;
  detail?: string;
};

export type OpportunityFinalRange = {
  lowPct: number;
  highPct: number;
  display: string;
};

export type OpportunityCalculationTrace = {
  traceId: string;
  themeId: string;
  themeName: string;
  scope: "hypothesis" | "executive_theme" | "portfolio_total";
  inputSignals: OpportunityTraceRow[];
  measuredValues: OpportunityTraceRow[];
  weightsApplied: OpportunityTraceRow[];
  elasticityModifier: OpportunityTraceRow;
  maturityConfidenceModifier: OpportunityTraceRow[];
  intermediateSteps: OpportunityTraceRow[];
  /** Category revenue exposure contributing to this pool */
  categoryExposure: OpportunityTraceRow[];
  finalRange: OpportunityFinalRange;
  formulaSummary: string;
  exposureSummaries?: string[];
  /** Nested hypothesis-level traces when scope is executive_theme or portfolio */
  childTraces?: OpportunityCalculationTrace[];
};
