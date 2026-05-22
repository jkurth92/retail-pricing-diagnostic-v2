/**
 * Benchmark calibration orchestrator (Step 14B).
 * Connects normative structure, contextual interpretation, and opportunity band realism.
 */

import { bandForSeverity, resolveThemeSeverity } from "@/data/benchmarkOpportunityBands";
import { getArchetypeBenchmarkProfile } from "@/lib/benchmarkExpectations";
import {
  buildContextualInterpretations,
  maturityInterpretationMultiplier,
} from "@/lib/contextualBenchmarks";
import { buildNormativeStructureSnapshot } from "@/lib/normativeStructures";
import { mapStructuralThemes } from "@/lib/structuralThemeMapping";
import { postureLabel } from "@/lib/archetypeContext";
import type { ArchitectureSignalResult } from "@/lib/architectureSignals";
import type { KviSignalResult } from "@/lib/kviSignals";
import type {
  BenchmarkCalibrationBundle,
  BenchmarkOpportunitySeverity,
} from "@/types/benchmark-calibration";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { OpportunityTraceRow } from "@/types/opportunity-trace";
import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";

const ENGINE_VERSION = "14B.1.0";

export type BenchmarkCalibrationInput = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  arch: ArchitectureSignalResult;
  kvi: KviSignalResult;
  categories?: string[];
  eprAverage?: number | null;
};

function portfolioSeverity(
  interpretations: BenchmarkCalibrationBundle["interpretations"],
  arch: ArchitectureSignalResult,
): BenchmarkOpportunitySeverity {
  const maxSeverity = Math.max(
    ...interpretations.map((i) => i.severityWeight),
    0,
  );
  if (arch.architectureCompression && maxSeverity >= 0.7) return "significant";
  if (maxSeverity >= 0.75) return "significant";
  if (maxSeverity >= 0.5) return "moderate";
  if (maxSeverity >= 0.3) return "mild";
  return "mild";
}

function benchmarkWidthMultiplier(
  interpretations: BenchmarkCalibrationBundle["interpretations"],
  maturityModifier: number,
): number {
  const below = interpretations.filter(
    (i) =>
      i.position === "below_expected" || i.position === "narrower_than_typical",
  ).length;
  const within = interpretations.filter((i) => i.position === "within_expected").length;
  if (below >= 2) return Math.min(1.1, 1.02 + below * 0.03) * maturityModifier;
  if (within >= 2) return Math.max(0.9, 0.98 - within * 0.02);
  return 1 * maturityModifier;
}

function buildExposureSummaryLines(
  arch: ArchitectureSignalResult,
  kvi: KviSignalResult,
  interpretations: BenchmarkCalibrationBundle["interpretations"],
): string[] {
  const lines: string[] = [];
  const belowPremium = interpretations.find(
    (i) =>
      i.metricKind === "premium_mainstream_gap" &&
      (i.position === "below_expected" || i.position === "narrower_than_typical"),
  );
  if (belowPremium && arch.compressionCategories.length > 0) {
    lines.push(
      `Traffic-driving categories account for most observed architecture compression (${arch.compressionCategories.slice(0, 2).join(", ")}).`,
    );
  }
  const plLine = (() => {
    const narrow = arch.plNbNarrowCategories ?? [];
    if (narrow.length === 0) return null;
    const names = narrow.slice(0, 2).join(" and ");
    if (narrow.length === 1) {
      return `Narrow PL/NB separation observed in ${names}.`;
    }
    if (narrow.length < 3) {
      return `Overall PL/NB structure appears broadly healthy; ${names} show narrower separation.`;
    }
    return `PL/NB separation below expected range in ${narrow.length} categories (${names}).`;
  })();
  if (plLine) lines.push(plLine);
  if (kvi.kviRevenueSharePct > 0) {
    const kviInterp = interpretations.find((i) => i.metricKind === "kvi_revenue_share");
    if (
      kviInterp?.position === "above_expected" ||
      kviInterp?.position === "broader_than_expected"
    ) {
      lines.push(
        `KVI-like concentration (~${kvi.kviRevenueSharePct}%) sits above the archetype reference band.`,
      );
    }
  }
  if (belowPremium) {
    lines.push(belowPremium.narrativePhrase);
  }
  return lines.slice(0, 4);
}

function buildTraceRows(
  bundle: Omit<BenchmarkCalibrationBundle, "traceRows">,
): OpportunityTraceRow[] {
  const profile = getArchetypeBenchmarkProfile(bundle.normative.archetypeId);
  return [
    {
      label: "Normative coherence question",
      value: bundle.normative.coherenceQuestion,
    },
    {
      label: "Archetype assumption",
      value: `${profile.displayName} · ${postureLabel(bundle.normative.pricingPosture)}`,
      detail: bundle.normative.archetypeStructuralNote,
    },
    {
      label: "Posture expectation",
      value: postureLabel(bundle.normative.pricingPosture),
      detail: bundle.normative.postureStructuralNote,
    },
    {
      label: "Portfolio benchmark severity",
      value: bundle.portfolioSeverity,
    },
    {
      label: "Benchmark width multiplier",
      value: bundle.benchmarkWidthMultiplier.toFixed(3),
      detail: "Directional modifier on thematic bands — not optimization.",
    },
    {
      label: "Maturity modifier",
      value: bundle.maturityModifier.toFixed(3),
      detail: "EPR-informed interpretation of structural gaps.",
    },
    ...bundle.interpretations.slice(0, 4).map((i) => ({
      label: i.metricKind.replace(/_/g, " "),
      value: `${i.observedDisplay} · ${i.position.replace(/_/g, " ")}`,
      detail: i.narrativePhrase,
    })),
  ];
}

export function runBenchmarkCalibrationEngine(
  input: BenchmarkCalibrationInput,
): BenchmarkCalibrationBundle {
  const normative = buildNormativeStructureSnapshot(
    input.archetypeId,
    input.pricingPosture,
  );

  const interpretations = buildContextualInterpretations({
    archetypeId: input.archetypeId,
    pricingPosture: input.pricingPosture,
    postureDisplay: postureLabel(input.pricingPosture),
    arch: input.arch,
    kvi: input.kvi,
    categories: input.categories,
    eprAverage: input.eprAverage,
  });

  const avgSeverity =
    interpretations.length > 0
      ? interpretations.reduce((s, i) => s + i.severityWeight, 0) /
        interpretations.length
      : 0;

  const maturityModifier = maturityInterpretationMultiplier(
    input.eprAverage,
    avgSeverity,
  );

  const portfolioSev = portfolioSeverity(interpretations, input.arch);
  const structuralThemes = mapStructuralThemes(
    input.arch,
    input.kvi,
    interpretations,
  );

  const executiveContextLines = [
    ...interpretations
      .filter(
        (i) =>
          i.position === "below_expected" ||
          i.position === "narrower_than_typical" ||
          i.position === "above_expected",
      )
      .map((i) => i.narrativePhrase)
      .slice(0, 3),
    ...structuralThemes
      .filter((t) => t.benchmarkHook)
      .map((t) => t.benchmarkHook!)
      .slice(0, 2),
  ];

  const partial: Omit<BenchmarkCalibrationBundle, "traceRows"> = {
    engineVersion: ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    normative,
    interpretations,
    portfolioSeverity: portfolioSev,
    familySeverity: {},
    benchmarkWidthMultiplier: benchmarkWidthMultiplier(
      interpretations,
      maturityModifier,
    ),
    maturityModifier,
    exposureSummaryLines: buildExposureSummaryLines(
      input.arch,
      input.kvi,
      interpretations,
    ),
    executiveContextLines: [...new Set(executiveContextLines)].slice(0, 5),
  };

  return {
    ...partial,
    traceRows: buildTraceRows(partial),
  };
}

export function benchmarkBandForFamily(
  family: HypothesisFamily,
  calibration: BenchmarkCalibrationBundle,
): { lowPct: number; highPct: number; label: string } {
  const metricSeverity = Math.max(
    ...calibration.interpretations.map((i) => i.severityWeight),
    0.25,
  );
  const severity = resolveThemeSeverity(
    family,
    calibration.portfolioSeverity,
    metricSeverity * calibration.benchmarkWidthMultiplier,
  );
  return bandForSeverity(severity);
}
