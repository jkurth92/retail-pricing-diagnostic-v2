import type { DiagnosticConfidenceLevel, ConfidenceScore } from "@/types/confidence-scoring";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import { signalStrengthScore } from "@/lib/signalGrouping";
import type { RoleInferenceResult } from "@/types/role-inference";

const ARCH_FAMILIES: HypothesisFamily[] = [
  "Architecture",
  "Premiumization",
];

export type ConfidenceInput = {
  supportingSignals: SupportingSignal[];
  conflictingSignals: SupportingSignal[];
  hypothesisFamily: HypothesisFamily;
  roleInference: RoleInferenceResult;
  evidenceCoverageRatio: number;
  eprAverage: number | null;
};

function levelFromScore(score: number): DiagnosticConfidenceLevel {
  if (score >= 8) return "high";
  if (score >= 6) return "medium_high";
  if (score >= 4) return "medium";
  return "low";
}

function evidenceLabel(
  ratio: number,
): ConfidenceScore["evidenceCoverage"] {
  if (ratio >= 0.75) return "strong";
  if (ratio >= 0.5) return "adequate";
  if (ratio >= 0.3) return "partial";
  return "sparse";
}

export function scoreHypothesisConfidence(input: ConfidenceInput): ConfidenceScore {
  let score = 0;
  const reinforcement = input.supportingSignals.reduce(
    (sum, s) => sum + signalStrengthScore(s.signalStrength),
    0,
  );
  score += Math.min(reinforcement, 6);

  if (input.supportingSignals.length >= 3) score += 2;
  else if (input.supportingSignals.length >= 2) score += 1;

  if (ARCH_FAMILIES.includes(input.hypothesisFamily)) {
    if (input.evidenceCoverageRatio >= 0.5) score += 1;
  }

  const inf = input.roleInference.categorySuggestion.confidence;
  if (inf === "high") score += 2;
  else if (inf === "medium") score += 1;
  else score -= 1;

  if (input.eprAverage !== null) {
    if (input.eprAverage >= 3.5) score += 1;
    if (input.eprAverage < 2.5) score -= 1;
  }

  score -= input.conflictingSignals.length * 2;
  if (input.evidenceCoverageRatio < 0.35) score -= 2;

  const maturityAdjustment =
    input.eprAverage !== null ? (input.eprAverage - 3) * 0.5 : 0;

  const level = levelFromScore(Math.round(score + maturityAdjustment));
  const coverage = evidenceLabel(input.evidenceCoverageRatio);

  const explanations: Record<DiagnosticConfidenceLevel, string> = {
    high: "Multiple reinforcing structural signals with coherent role inference and adequate evidence coverage.",
    medium_high:
      "Several reinforcing signals and coherent archetype context; some evidence gaps remain.",
    medium:
      "Moderate signal reinforcement; interpret as directional until upload alignment completes.",
    low: "Sparse or conflicting evidence — theme suppressed or flagged tentative.",
  };

  return {
    level,
    explanation: explanations[level],
    evidenceCoverage: coverage,
    signalReinforcement: reinforcement,
    maturityAdjustment,
  };
}

export function shouldSuppressHypothesis(confidence: ConfidenceScore): boolean {
  return confidence.level === "low";
}
