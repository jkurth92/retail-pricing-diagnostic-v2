import { MAX_PORTFOLIO_HIGH_PCT } from "@/data/benchmarkOpportunityBands";
import { OPPORTUNITY_CALIBRATION_BANDS } from "@/data/opportunityCalibrationBands";
import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import { benchmarkBandForFamily } from "@/lib/benchmarkCalibration";
import type { CalibrationBand } from "@/data/opportunityCalibrationBands";
import type { BenchmarkCalibrationBundle } from "@/types/benchmark-calibration";
import type { ConfidenceScore } from "@/types/confidence-scoring";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { EvidenceMetric } from "@/types/evidence-computation";
import type { EvidenceStrength } from "@/types/evidence-computation";
import type {
  OpportunityCalculationTrace,
  OpportunityTraceRow,
} from "@/types/opportunity-trace";
import {
  calibratePortfolioRangeEndpoints,
  portfolioOverlapFactor,
  type ProportionalityContext,
} from "@/lib/calibrationProportionality";
import { computeRecoverableValuePool } from "@/lib/recoverableValue";
import { signalStrengthScore } from "@/lib/signalGrouping";
import type { ThemeExposureContext } from "@/types/opportunity-exposure";

export type OpportunityCalibrationInputs = {
  themeId: string;
  themeName: string;
  family: HypothesisFamily;
  confidenceLevel: DiagnosticConfidenceLevel;
  confidence: ConfidenceScore;
  elasticitySensitivity: ElasticitySensitivity;
  evidenceStrength?: EvidenceStrength;
  supportingSignals: SupportingSignal[];
  evidenceMetrics?: EvidenceMetric[];
  themeExposure?: ThemeExposureContext;
  benchmarkCalibration?: BenchmarkCalibrationBundle;
};

function confidenceWidthMultiplier(
  level: DiagnosticConfidenceLevel,
  evidenceStrength?: EvidenceStrength,
): { combined: number; confidenceBase: number; evidenceFactor: number } {
  let confidenceBase = 1;
  if (level === "high") confidenceBase = 0.9;
  else if (level === "medium_high") confidenceBase = 0.82;
  else if (level === "medium") confidenceBase = 0.74;
  else confidenceBase = 0.6;

  let evidenceFactor = 1;
  if (evidenceStrength === "strong") evidenceFactor = 0.95;
  else if (evidenceStrength === "moderate") evidenceFactor = 0.86;
  else if (evidenceStrength === "weak") evidenceFactor = 0.72;

  return {
    combined: confidenceBase * evidenceFactor,
    confidenceBase,
    evidenceFactor,
  };
}

function bandForFamily(
  family: HypothesisFamily,
  benchmark?: BenchmarkCalibrationBundle,
): CalibrationBand | undefined {
  const legacy = OPPORTUNITY_CALIBRATION_BANDS.find((b) =>
    b.families.includes(family),
  );
  if (!benchmark) return legacy;
  const bench = benchmarkBandForFamily(family, benchmark);
  if (!legacy) return undefined;
  return {
    ...legacy,
    marginRangeLowPct: bench.lowPct,
    marginRangeHighPct: bench.highPct,
    themeLabel: `${bench.label} (benchmark-calibrated)`,
  };
}

function elasticityTraceRow(
  sensitivity: ElasticitySensitivity,
  multiplier: number,
  source?: string,
): OpportunityTraceRow {
  return {
    label: "Elasticity modifier",
    value: `${sensitivity} sensitivity · ×${multiplier.toFixed(2)}`,
    detail:
      source ??
      "Contextual width modifier from elasticity reference workbooks — directional, not optimization.",
  };
}

function buildCategoryExposureRows(
  themeExposure?: ThemeExposureContext,
): OpportunityTraceRow[] {
  if (!themeExposure) return [];
  const cats = themeExposure.bundle.categoryExposures.filter((c) =>
    themeExposure.contributingCategories.includes(c.category),
  );
  return cats.map((c) => ({
    label: c.category,
    value: `${c.revenueWeightPct}% revenue · ${c.affectedIssueTags.join(", ") || "context"}`,
    detail: `Elasticity |${c.elasticityAbs}| (${c.elasticitySource}) · role weight ${c.roleWeight.toFixed(2)}`,
  }));
}

export function buildHypothesisOpportunityTrace(
  input: OpportunityCalibrationInputs,
): OpportunityCalculationTrace {
  const band = bandForFamily(input.family, input.benchmarkCalibration);
  const mult = confidenceWidthMultiplier(
    input.confidenceLevel,
    input.evidenceStrength,
  );

  const inputSignals: OpportunityTraceRow[] = input.supportingSignals.map((s) => ({
    label: s.signalName,
    value: `${s.signalStrength} · ${s.signalFamily}`,
    detail: s.explanation,
  }));

  if (inputSignals.length === 0) {
    inputSignals.push({
      label: "Supporting signals",
      value: "None matched at surface threshold",
    });
  }

  const measuredValues: OpportunityTraceRow[] =
    input.evidenceMetrics?.map((m) => ({
      label: m.label,
      value: `${m.value} (${m.strength})`,
    })) ?? [];

  if (measuredValues.length === 0) {
    measuredValues.push({
      label: "Computed evidence metrics",
      value: "Not linked to this hypothesis pool",
    });
  }

  const maturityConfidenceModifier: OpportunityTraceRow[] = [
    {
      label: "Confidence level",
      value: input.confidenceLevel,
      detail: input.confidence.explanation,
    },
    {
      label: "Signal reinforcement score",
      value: String(input.confidence.signalReinforcement),
      detail: "Sum of supporting signal strengths (feeds confidence score).",
    },
    {
      label: "Evidence coverage",
      value: input.confidence.evidenceCoverage,
    },
    {
      label: "Maturity adjustment (EPR)",
      value:
        input.confidence.maturityAdjustment === 0
          ? "0 (neutral)"
          : `${input.confidence.maturityAdjustment >= 0 ? "+" : ""}${input.confidence.maturityAdjustment.toFixed(1)}`,
      detail: "Applied inside confidence scoring before level → width mapping.",
    },
    {
      label: "Confidence width multiplier",
      value: mult.confidenceBase.toFixed(2),
    },
    {
      label: "Evidence strength width factor",
      value: mult.evidenceFactor.toFixed(2),
      detail: input.evidenceStrength ?? "not provided",
    },
    {
      label: "Combined width multiplier",
      value: mult.combined.toFixed(3),
      detail: "low/high band endpoints × this factor (deterministic).",
    },
  ];

  const weightsApplied: OpportunityTraceRow[] = band
    ? [
        {
          label: "Calibration band",
          value: band.themeLabel,
        },
        {
          label: "Base margin band (low)",
          value: `${band.marginRangeLowPct}%`,
          detail: "From opportunityCalibrationBands — thematic pool, not optimized.",
        },
        {
          label: "Base margin band (high)",
          value: `${band.marginRangeHighPct}%`,
          detail: "From opportunityCalibrationBands — thematic pool, not optimized.",
        },
        {
          label: "Opportunity type",
          value: band.opportunityType,
        },
      ]
    : [
        {
          label: "Calibration band",
          value: "Unmapped family — fallback pool",
        },
      ];

  const signalWeights: OpportunityTraceRow[] = input.supportingSignals.map((s) => ({
    label: `Signal weight (${s.signalId})`,
    value: String(signalStrengthScore(s.signalStrength)),
    detail: "Strong=3, moderate=2, weak=1 — used in confidence only, not band math.",
  }));

  const intermediateSteps: OpportunityTraceRow[] = [];

  if (!band) {
    return {
      traceId: `trace-${input.themeId}`,
      themeId: input.themeId,
      themeName: input.themeName,
      scope: "hypothesis",
      inputSignals,
      measuredValues,
      weightsApplied,
      elasticityModifier: elasticityTraceRow(
        input.elasticitySensitivity,
        1,
      ),
      maturityConfidenceModifier,
      categoryExposure: buildCategoryExposureRows(input.themeExposure),
      intermediateSteps: [
        {
          label: "Sizing step",
          value: "No band mapping — thematic placeholder range",
        },
      ],
      finalRange: {
        lowPct: 0,
        highPct: 0,
        display: "Thematic — pending calibration",
      },
      formulaSummary:
        "No calibration band for this family; range is a bounded placeholder.",
    };
  }

  const exposureMult = input.themeExposure
    ? input.themeExposure.bundle.exposureWidthMultiplier
    : 1;
  const elasticityMult = input.themeExposure
    ? input.themeExposure.themeElasticityMultiplier
    : 1;

  const benchmarkMult = input.benchmarkCalibration?.benchmarkWidthMultiplier ?? 1;

  if (input.benchmarkCalibration) {
    weightsApplied.push({
      label: "Benchmark calibration",
      value: `Severity: ${input.benchmarkCalibration.portfolioSeverity}`,
      detail: `Width ×${benchmarkMult.toFixed(3)} — directional McKinsey-style reference, not optimization.`,
    });
  }

  const recoverable = computeRecoverableValuePool({
    band,
    confidenceLevel: input.confidenceLevel,
    evidenceStrength: input.evidenceStrength ?? "weak",
    confidenceWidthMult: mult.combined,
    exposureWidthMult: exposureMult,
    elasticityWidthMult: elasticityMult,
    benchmarkWidthMult: benchmarkMult,
    themeAffectedRevenuePct: input.themeExposure?.themeAffectedRevenuePct ?? 0,
  });

  const categoryExposure = buildCategoryExposureRows(input.themeExposure);

  if (input.themeExposure) {
    weightsApplied.push({
      label: "Category exposure (in-scope)",
      value: `${input.themeExposure.themeAffectedRevenuePct}% revenue weight`,
      detail: input.themeExposure.contributingCategories.join(", "),
    });
    weightsApplied.push({
      label: "Exposure width multiplier",
      value: exposureMult.toFixed(3),
    });
    weightsApplied.push({
      label: "Elasticity width multiplier",
      value: elasticityMult.toFixed(3),
      detail: `Portfolio channel: ${input.themeExposure.bundle.elasticityChannel}`,
    });
  }

  intermediateSteps.push(
    {
      label: "1. Base band",
      value: `${recoverable.rawLowPct}% – ${recoverable.rawHighPct}%`,
    },
    {
      label: "2. Confidence × exposure × elasticity × benchmark",
      value: `× ${recoverable.combinedMultiplier.toFixed(3)}`,
      detail: `confidence ${mult.combined.toFixed(3)} · exposure ${exposureMult.toFixed(3)} · elasticity ${elasticityMult.toFixed(3)} · benchmark ${benchmarkMult.toFixed(3)}`,
    },
    {
      label: "3. Round endpoints",
      value: `${recoverable.roundedLowPct}% – ${recoverable.roundedHighPct}%`,
    },
    {
      label: "4. Recoverable pool",
      value: recoverable.recoverablePoolNote,
    },
    ...signalWeights,
  );

  const elasRow = elasticityTraceRow(
    input.themeExposure?.themeElasticitySensitivity ?? input.elasticitySensitivity,
    elasticityMult,
    input.themeExposure
      ? `Reference: ${input.themeExposure.bundle.elasticityChannel} workbook medians`
      : undefined,
  );

  return {
    traceId: `trace-${input.themeId}`,
    themeId: input.themeId,
    themeName: input.themeName,
    scope: "hypothesis",
    inputSignals,
    measuredValues,
    weightsApplied,
    elasticityModifier: elasRow,
    maturityConfidenceModifier,
    intermediateSteps,
    categoryExposure,
    exposureSummaries: input.themeExposure?.bundle.exposureSummaries,
    finalRange: {
      lowPct: recoverable.roundedLowPct,
      highPct: recoverable.roundedHighPct,
      display: `${recoverable.roundedLowPct}%–${recoverable.roundedHighPct}% margin opportunity (thematic, bounded)`,
    },
    formulaSummary: `band[${recoverable.rawLowPct},${recoverable.rawHighPct}] × ${recoverable.combinedMultiplier.toFixed(3)} → [${recoverable.roundedLowPct},${recoverable.roundedHighPct}]%`,
    benchmarkContext: input.benchmarkCalibration?.traceRows,
  };
}

export function buildExecutiveThemeOpportunityTrace(
  themeId: string,
  themeName: string,
  childTraces: OpportunityCalculationTrace[],
): OpportunityCalculationTrace {
  const lows = childTraces.map((t) => t.finalRange.lowPct);
  const highs = childTraces.map((t) => t.finalRange.highPct);
  const low = lows.length > 0 ? Math.min(...lows) : 0.3;
  const high = highs.length > 0 ? Math.max(...highs) : 0.8;
  const roundedLow = parseFloat(low.toFixed(1));
  const roundedHigh = parseFloat(high.toFixed(1));

  return {
    traceId: `trace-${themeId}`,
    themeId,
    themeName,
    scope: "executive_theme",
    inputSignals: childTraces.flatMap((t) => t.inputSignals).slice(0, 8),
    measuredValues: childTraces.flatMap((t) => t.measuredValues).slice(0, 6),
    weightsApplied: [
      {
        label: "Theme aggregation rule",
        value: "Envelope across supporting hypotheses",
        detail: "min(low), max(high) — not additive.",
      },
    ],
    elasticityModifier: {
      label: "Elasticity modifier",
      value: "Per-hypothesis (see child traces)",
      detail: "Does not scale executive theme envelope.",
    },
    maturityConfidenceModifier: [
      {
        label: "Theme confidence",
        value: "Merged from supporting hypotheses",
        detail: "See child traces for per-hypothesis confidence width.",
      },
    ],
    categoryExposure: childTraces.flatMap((t) => t.categoryExposure).slice(0, 8),
    intermediateSteps: [
      ...childTraces.map((t, i) => ({
        label: `Hypothesis pool ${i + 1}: ${t.themeName}`,
        value: t.finalRange.display,
      })),
      {
        label: "Envelope",
        value: `min(low)=${roundedLow}%, max(high)=${roundedHigh}%`,
      },
    ],
    finalRange: {
      lowPct: roundedLow,
      highPct: roundedHigh,
      display: `${roundedLow}%–${roundedHigh}% margin opportunity (thematic)`,
    },
    formulaSummary: `envelope(min low, max high) across ${childTraces.length} hypothesis pool(s)`,
    childTraces,
  };
}

export function buildPortfolioOpportunityTrace(
  themes: {
    themeName: string;
    themeFamily?: string;
    trace?: OpportunityCalculationTrace;
    low: number;
    high: number;
  }[],
  proportionality?: ProportionalityContext,
): OpportunityCalculationTrace {
  const lows = themes.map((t) => t.low);
  const highs = themes.map((t) => t.high);
  const archThemes = themes.filter(
    (t) => t.themeFamily === "Architecture" || t.themeFamily === "Premiumization",
  );

  const overlap = portfolioOverlapFactor(proportionality);
  const rawLow = lows.reduce((a, b) => a + b, 0) * overlap;
  const rawHigh = highs.reduce((a, b) => a + b, 0) * overlap;
  const archHigh =
    archThemes.length > 0 ? Math.max(...archThemes.map((t) => t.high)) : 0;

  const MIN_TOTAL_LOW_PCT = 0.4;
  const MAX_TOTAL_HIGH_PCT = MAX_PORTFOLIO_HIGH_PCT;

  const totalLow = Math.max(
    MIN_TOTAL_LOW_PCT,
    Math.min(rawLow, archHigh > 0 ? archHigh * 0.6 : rawLow),
  );
  const totalHigh = Math.min(
    MAX_TOTAL_HIGH_PCT,
    Math.max(rawHigh, archHigh > 0 ? archHigh * 0.85 : rawHigh),
  );

  const proportional = calibratePortfolioRangeEndpoints(
    totalLow,
    Math.max(totalHigh, totalLow + 0.3),
    proportionality ?? {},
  );
  const roundedLow = proportional.lowPct;
  const roundedHigh = proportional.highPct;

  const childTraces = themes
    .map((t) => t.trace)
    .filter((t): t is OpportunityCalculationTrace => t !== undefined);

  return {
    traceId: "trace-portfolio-total",
    themeId: "portfolio-total",
    themeName: "Consolidated thematic opportunity",
    scope: "portfolio_total",
    inputSignals: [],
    measuredValues: [],
    weightsApplied: [
      {
        label: "Overlap factor",
        value: overlap.toFixed(3),
        detail: "Sum of theme lows/highs × factor — themes are not independent.",
      },
      {
        label: "Floor (min total low)",
        value: `${MIN_TOTAL_LOW_PCT}%`,
      },
      {
        label: "Cap (max total high)",
        value: `${MAX_TOTAL_HIGH_PCT}%`,
      },
    ],
    elasticityModifier: {
      label: "Elasticity modifier",
      value: "Not applied to portfolio total",
      detail: "Revenue sensitivity is narrative-only at storyline level.",
    },
    maturityConfidenceModifier: [
      {
        label: "Portfolio confidence",
        value: "Derived from primary theme confidence summaries",
      },
    ],
    categoryExposure: [],
    intermediateSteps: [
      {
        label: "1. Sum theme lows",
        value: `${lows.reduce((a, b) => a + b, 0).toFixed(2)}%`,
      },
      {
        label: "2. Sum theme highs",
        value: `${highs.reduce((a, b) => a + b, 0).toFixed(2)}%`,
      },
      {
        label: "3. Apply overlap factor",
        value: `× ${OUTPUT_CALIBRATION_RULES.marginOverlapFactor}`,
        detail: `raw low ${rawLow.toFixed(2)}%, raw high ${rawHigh.toFixed(2)}%`,
      },
      ...(archHigh > 0
        ? [
            {
              label: "4. Architecture ceiling check",
              value: `arch high ${archHigh.toFixed(1)}% informs low cap`,
            },
          ]
        : []),
      {
        label: "5. Apply floor/cap",
        value: `${roundedLow}% – ${roundedHigh}%`,
      },
    ],
    finalRange: {
      lowPct: roundedLow,
      highPct: roundedHigh,
      display: `${roundedLow}%–${roundedHigh}% indicative margin opportunity (thematic, non-additive)`,
    },
    formulaSummary: `sum(theme bands) × ${OUTPUT_CALIBRATION_RULES.marginOverlapFactor} with floor/cap and architecture ceiling`,
    childTraces,
  };
}
