import type { OpportunityTraceRow } from "@/types/opportunity-trace";

/** Directional revenue sensitivity — not a sales forecast. */
export type RevenueSensitivityFinalRange = {
  lowPct: number;
  highPct: number;
  /** Signed display e.g. "-0.2% to +0.6%" */
  display: string;
  /** Executive scan line e.g. "Flat to modest upside" */
  executiveLabel: string;
};

export type RevenueSensitivityTrace = {
  traceId: string;
  inputSignals: OpportunityTraceRow[];
  categoryElasticity: OpportunityTraceRow[];
  modifiers: OpportunityTraceRow[];
  intermediateSteps: OpportunityTraceRow[];
  finalRange: RevenueSensitivityFinalRange;
  interpretation: string;
  formulaSummary: string;
};

export type DirectionalRevenueSensitivityEstimate = {
  finalRange: RevenueSensitivityFinalRange;
  interpretation: string;
  narrativeSummary: string;
  trace: RevenueSensitivityTrace;
};
