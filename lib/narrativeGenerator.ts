import { HYPOTHESIS_NARRATIVE_FRAGMENTS } from "@/data/hypothesisRationaleFragments";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";

export function generateHypothesisRationale(
  narrativeKey: string,
  supportingSignals: SupportingSignal[],
  hypothesisName: string,
): string {
  const frag = HYPOTHESIS_NARRATIVE_FRAGMENTS[narrativeKey];
  const signalNames = supportingSignals
    .slice(0, 3)
    .map((s) => s.signalName.toLowerCase())
    .join(", ");

  if (!frag) {
    return `Structural review suggests ${hypothesisName.toLowerCase()} may warrant diagnostic attention based on ${supportingSignals.length} reinforcing signal(s): ${signalNames}. This is a thematic interpretation, not a pricing recommendation.`;
  }

  const signalClause =
    supportingSignals.length > 0
      ? ` Reinforcing signals include ${signalNames}.`
      : "";

  return `${frag.lead}, ${frag.connective}, ${frag.implication}${signalClause}`;
}
