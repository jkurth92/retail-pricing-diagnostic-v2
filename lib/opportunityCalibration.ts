import { OPPORTUNITY_CALIBRATION_BANDS } from "@/data/opportunityCalibrationBands";
import { OPPORTUNITY_THEME_TEMPLATES } from "@/data/opportunityThemes";
import {
  buildHypothesisOpportunityTrace,
  type OpportunityCalibrationInputs,
} from "@/lib/opportunityCalculationTrace";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { OpportunityTheme } from "@/types/opportunity-themes";

function bandForFamily(family: HypothesisFamily) {
  return OPPORTUNITY_CALIBRATION_BANDS.find((b) => b.families.includes(family));
}

function elasticityNote(sensitivity: ElasticitySensitivity): string {
  if (sensitivity === "high") {
    return "Elasticity sensitivity: high — volume/perception framing emphasized; not optimized.";
  }
  if (sensitivity === "moderate") {
    return "Elasticity sensitivity: moderate — interpretation modifier only.";
  }
  return "Elasticity sensitivity: low — structural margin theme primary.";
}

export function calibrateOpportunityTheme(
  themeId: string,
  family: HypothesisFamily,
  confidenceLevel: DiagnosticConfidenceLevel,
  elasticitySensitivity: ElasticitySensitivity,
  calibrationContext?: Omit<
    OpportunityCalibrationInputs,
    "themeId" | "family" | "confidenceLevel" | "elasticitySensitivity"
  > & {
    themeName?: string;
    themeExposure?: OpportunityCalibrationInputs["themeExposure"];
  },
): OpportunityTheme {
  const themeName =
    calibrationContext?.themeName ??
    OPPORTUNITY_THEME_TEMPLATES[themeId]?.themeName ??
    themeId;

  const trace = buildHypothesisOpportunityTrace({
    themeId,
    themeName,
    family,
    confidenceLevel,
    elasticitySensitivity: elasticitySensitivity,
    supportingSignals: calibrationContext?.supportingSignals ?? [],
    confidence: calibrationContext?.confidence ?? {
      level: confidenceLevel,
      explanation: "",
      evidenceCoverage: "partial",
      signalReinforcement: 0,
      maturityAdjustment: 0,
    },
    evidenceStrength: calibrationContext?.evidenceStrength,
    evidenceMetrics: calibrationContext?.evidenceMetrics,
    themeExposure: calibrationContext?.themeExposure,
  });

  const template = OPPORTUNITY_THEME_TEMPLATES[themeId];
  const band = bandForFamily(family);

  if (!template || !band) {
    return {
      id: themeId,
      themeName: "Structural opportunity pool",
      opportunityType: "margin_efficiency",
      estimatedMarginRange: trace.finalRange.display,
      estimatedRevenueSensitivity: "Directional only",
      recoverability: "medium",
      explanation: "Bounded thematic pool — not a calculated opportunity.",
      elasticitySensitivity,
      calculationTrace: trace,
    };
  }

  return {
    ...template,
    estimatedMarginRange: trace.finalRange.display,
    estimatedRevenueSensitivity: `${band.revenueSensitivityNote}. ${elasticityNote(elasticitySensitivity)}`,
    recoverability: band.recoverabilityDefault,
    explanation: `${template.explanation} ${band.themeLabel}.`,
    calculationTrace: trace,
  };
}
