import { OPPORTUNITY_CALIBRATION_BANDS } from "@/data/opportunityCalibrationBands";
import { OPPORTUNITY_THEME_TEMPLATES } from "@/data/opportunityThemes";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { ElasticitySensitivity } from "@/types/diagnostic-hypotheses";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import type { OpportunityTheme } from "@/types/opportunity-themes";
import type { EvidenceStrength } from "@/types/evidence-computation";

function bandForFamily(family: HypothesisFamily) {
  return OPPORTUNITY_CALIBRATION_BANDS.find((b) => b.families.includes(family));
}

function confidenceWidthMultiplier(
  level: DiagnosticConfidenceLevel,
  evidenceStrength?: EvidenceStrength,
): number {
  let base = 1;
  if (level === "high") base = 1;
  else if (level === "medium_high") base = 0.9;
  else if (level === "medium") base = 0.8;
  else base = 0.65;

  if (evidenceStrength === "strong") return base;
  if (evidenceStrength === "moderate") return base * 0.92;
  if (evidenceStrength === "weak") return base * 0.78;
  return base;
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
  evidenceStrength?: EvidenceStrength,
): OpportunityTheme {
  const template = OPPORTUNITY_THEME_TEMPLATES[themeId];
  const band = bandForFamily(family);
  const mult = confidenceWidthMultiplier(confidenceLevel, evidenceStrength);

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
