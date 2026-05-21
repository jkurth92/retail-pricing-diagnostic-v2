export type DiagnosticConfidenceLevel =
  | "low"
  | "medium"
  | "medium_high"
  | "high";

export type ConfidenceScore = {
  level: DiagnosticConfidenceLevel;
  explanation: string;
  evidenceCoverage: "sparse" | "partial" | "adequate" | "strong";
  signalReinforcement: number;
  maturityAdjustment: number;
};
