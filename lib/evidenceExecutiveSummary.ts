import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import { businessConcentrationLabel } from "@/lib/executiveBusinessLanguage";
import { localizedDriverPrefix } from "@/lib/signalPrioritization";
import { calibrateKviExposureDriver } from "@/lib/narrativeRefinement";

export function buildBenchmarkPrimaryDrivers(
  benchmarkLines: string[],
): string[] {
  return benchmarkLines.slice(0, 3);
}

export function buildExposurePrimaryDrivers(
  exposure: OpportunityExposureBundle,
): string[] {
  const drivers: string[] = [];

  if (exposure.architectureAffectedRevenuePct > 0) {
    const archCats = exposure.categoryExposures
      .filter((c) => c.architectureCompression)
      .map((c) => c.category);
    const localized = localizedDriverPrefix(archCats, "architecture");
    drivers.push(
      localized ??
        `Moderately compressed premium architecture in categories representing ~${exposure.architectureAffectedRevenuePct}% of in-scope revenue${archCats.length > 0 ? ` (${archCats.slice(0, 2).join(", ")})` : ""}`,
    );
  }

  if (exposure.kviAffectedRevenuePct >= 12) {
    const kviLabel = calibrateKviExposureDriver(
      exposure.kviAffectedRevenuePct,
      exposure.categoryExposures.filter((c) => c.kviElevated).length,
    );
    if (kviLabel) drivers.push(kviLabel);
  }

  const plCats = exposure.categoryExposures
    .filter((c) => c.plNbNarrow)
    .map((c) => c.category);
  if (plCats.length > 0) {
    const isolated = plCats.length < 3;
    drivers.push(
      isolated
        ? `Selective PL/NB compression in ${plCats.slice(0, 2).join(" and ")}`
        : `PL/NB separation below expected range in ${plCats.slice(0, 2).join(" and ")}${plCats.length > 2 ? "…" : ""}`,
    );
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
  const concentration = businessConcentrationLabel(exposure);
  const exposureNote = concentration ? ` · ${concentration}` : "";
  return `Potential pricing opportunity: ${low.toFixed(1)}–${high.toFixed(1)}% margin improvement${exposureNote}`;
}

export function buildStrategicImplicationOneLiner(
  evidence: ComputedEvidenceBundle,
  primaryThemes: ExecutiveTheme[],
): string {
  if (evidence.evidenceStrength === "weak") {
    return "Architecture and tier-spacing signals remain the lead story; treat ranges as directional while upload alignment completes.";
  }
  if (evidence.primaryDrivers.includes("PL/NB separation")) {
    return "Selective PL/NB and tier-spacing gaps are the most credible discussion topics before broader promotional moves.";
  }
  if (evidence.primaryDrivers.includes("KVI concentration")) {
    return "Rebalancing KVI concentration in trip-driving categories should precede broad price-point changes.";
  }
  if (primaryThemes.some((t) => t.themeFamily === "Architecture")) {
    return "Closing measured tier-spacing gaps is the most credible path to thematic margin recovery.";
  }
  return "Architecture-led opportunity is bounded and explainable — validate category evidence before tactical moves.";
}
