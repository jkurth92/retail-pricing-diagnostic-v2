import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";

export function buildOpportunityHeadline(
  storylineResult: StorylineSynthesisResult,
  evidence: ComputedEvidenceBundle,
): string {
  const range = storylineResult.storyline.marginOpportunityTotalRange;
  const match = range.match(/(\d+(?:\.\d+)?)\s*%?\s*[–-]\s*(\d+(?:\.\d+)?)\s*%/);
  if (!match) {
    return `Potential pricing opportunity: ${range}`;
  }
  const low = parseFloat(match[1]);
  const high = parseFloat(match[2]);
  if (evidence.evidenceStrength === "weak") {
    return `Directional pricing opportunity: ${low.toFixed(1)}–${high.toFixed(1)}% margin improvement (thematic, bounded)`;
  }
  return `Potential pricing opportunity: ${low.toFixed(1)}–${high.toFixed(1)}% margin improvement`;
}

export function buildStrategicImplicationOneLiner(
  evidence: ComputedEvidenceBundle,
  primaryThemes: ExecutiveTheme[],
): string {
  if (evidence.evidenceStrength === "weak") {
    return "Measured structural evidence is still partial — treat opportunity framing as directional until upload fields fully align.";
  }
  if (evidence.primaryDrivers.includes("PL/NB separation")) {
    return "Recovering private-label separation and tier clarity is the primary structural lever before expanding promotional depth.";
  }
  if (evidence.primaryDrivers.includes("KVI concentration")) {
    return "Rebalancing KVI concentration toward traffic-driving categories should precede broad price-point changes.";
  }
  if (primaryThemes.some((t) => t.themeFamily === "Architecture")) {
    return "Closing measured architecture gaps (tier spacing and ladder coherence) is the most credible path to thematic margin recovery.";
  }
  return "Structural pricing opportunity is bounded and explainable — validate category-level evidence before any tactical price moves.";
}
