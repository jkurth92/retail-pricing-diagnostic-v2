import { OPPORTUNITY_CALIBRATION_BANDS } from "@/data/opportunityCalibrationBands";
import { OPPORTUNITY_THEME_TEMPLATES } from "@/data/opportunityThemes";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { OpportunityTheme } from "@/types/opportunity-themes";

function bandForFamily(family: HypothesisFamily) {
  return OPPORTUNITY_CALIBRATION_BANDS.find((b) => b.families.includes(family));
}

function confidenceWidthMultiplier(level: DiagnosticConfidenceLevel): number {
  if (level === "high") return 1;
  if (level === "medium_high") return 0.9;
  if (level === "medium") return 0.8;
  return 0.65;
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
): OpportunityTheme {
  const template = OPPORTUNITY_THEME_TEMPLATES[themeId];
  const band = bandForFamily(family);
  const mult = confidenceWidthMultiplier(confidenceLevel);

  if (!template || !band) {
    return {
      id: themeId,
      themeName: "Structural opportunity pool",
      opportunityType: "margin_efficiency",
      estimatedMarginRange: "Thematic — pending calibration",
      estimatedRevenueSensitivity: "Directional only",
      recoverability: "medium",
      explanation: "Bounded thematic pool — not a calculated opportunity.",
      elasticitySensitivity,
    };
  }

  const low = (band.marginRangeLowPct * mult).toFixed(1);
  const high = (band.marginRangeHighPct * mult).toFixed(1);

  return {
    ...template,
    estimatedMarginRange: `${low}%–${high}% margin opportunity (thematic, bounded)`,
    estimatedRevenueSensitivity: `${band.revenueSensitivityNote}. ${elasticityNote(elasticitySensitivity)}`,
    recoverability: band.recoverabilityDefault,
    explanation: `${template.explanation} ${band.themeLabel}.`,
  };
}
