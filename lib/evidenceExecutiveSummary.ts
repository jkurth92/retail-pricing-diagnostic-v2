import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";

export function buildExposurePrimaryDrivers(
  exposure: OpportunityExposureBundle,
): string[] {
  const drivers: string[] = [];

  const plCats = exposure.categoryExposures
    .filter((c) => c.plNbNarrow)
    .map((c) => c.category);
  if (plCats.length > 0) {
    drivers.push(
      `Weak PL/NB separation in ${plCats.slice(0, 2).join(" and ")}${plCats.length > 2 ? "…" : ""}`,
    );
  }

  if (exposure.architectureAffectedRevenuePct > 0) {
    const archCats = exposure.categoryExposures
      .filter((c) => c.architectureCompression)
      .map((c) => c.category);
    drivers.push(
      `Compressed premium spacing across categories representing ~${exposure.architectureAffectedRevenuePct}% of in-scope revenue${archCats.length > 0 ? ` (${archCats.slice(0, 2).join(", ")})` : ""}`,
    );
  }

  if (exposure.kviAffectedRevenuePct >= 15) {
    drivers.push(`Broad KVI concentration (~${exposure.kviAffectedRevenuePct}% revenue weight)`);
  }

  return drivers.slice(0, 4);
}

export function buildOpportunityHeadline(
  storylineResult: StorylineSynthesisResult,
  evidence: ComputedEvidenceBundle,
  exposure?: OpportunityExposureBundle | null,
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
  const exposureNote =
    exposure && exposure.monetizableExposurePct > 0
      ? ` · ~${exposure.monetizableExposurePct}% monetizable in-scope revenue`
      : "";
  return `Potential pricing opportunity: ${low.toFixed(1)}–${high.toFixed(1)}% margin improvement${exposureNote}`;
}

export function buildStrategicImplicationOneLiner(
  evidence: ComputedEvidenceBundle,
  primaryThemes: ExecutiveTheme[],
): string {
  if (evidence.evidenceStrength === "weak") {
    return "Measured structural evidence is still partial — treat opportunity framing as directional until upload fields fully align.";
  }
  if (evidence.primaryDrivers.includes("PL/NB separation")) {
    return "Recovering PL/NB separation and tier clarity should precede deeper promotional investment.";
  }
  if (evidence.primaryDrivers.includes("KVI concentration")) {
    return "Rebalancing KVI concentration in trip-driving categories should precede broad price-point changes.";
  }
  if (primaryThemes.some((t) => t.themeFamily === "Architecture")) {
    return "Closing measured tier-spacing gaps is the most credible path to thematic margin recovery.";
  }
  return "Opportunity is bounded and explainable — validate category evidence before tactical moves.";
}
