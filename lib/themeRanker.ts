import type { ExecutiveTheme } from "@/types/executive-theme";
import type { DiagnosticConfidenceLevel } from "@/types/confidence-scoring";
import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import type { ExecutiveThemeDefinition } from "@/data/executiveThemes";

export const MAX_PRIMARY_THEMES = OUTPUT_CALIBRATION_RULES.maxPrimaryThemes;
export const MAX_SECONDARY_THEMES = OUTPUT_CALIBRATION_RULES.maxSecondaryThemes;

const CONFIDENCE_SCORE: Record<DiagnosticConfidenceLevel, number> = {
  low: 0,
  medium: 2,
  medium_high: 4,
  high: 6,
};

const RECOVERABILITY_SCORE: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function confidenceMeetsPrimaryBar(
  level: DiagnosticConfidenceLevel,
): boolean {
  return level === "medium" || level === "medium_high" || level === "high";
}

export function computeThemeScore(
  theme: ExecutiveTheme,
  definition: ExecutiveThemeDefinition,
): number {
  let score = definition.strategicImportanceWeight;
  if (definition.architecturePriority) {
    score += OUTPUT_CALIBRATION_RULES.architectureFamilyBoost;
  }
  score += CONFIDENCE_SCORE[theme.confidence.level];
  score += RECOVERABILITY_SCORE[theme.recoverability] ?? 0;
  score += theme.supportingHypotheses.length * 2;
  score += Math.min(theme.supportingSignals.length, 6);
  return score;
}

export function rankExecutiveThemes(
  themes: ExecutiveTheme[],
  definitions: Map<string, ExecutiveThemeDefinition>,
): {
  primary: ExecutiveTheme[];
  secondary: ExecutiveTheme[];
  suppressed: number;
} {
  const eligible = themes.filter((t) =>
    confidenceMeetsPrimaryBar(t.confidence.level),
  );
  const suppressed = themes.length - eligible.length;

  const scored = eligible.map((t) => ({
    theme: t,
    score: computeThemeScore(t, definitions.get(t.id)!),
  }));
  scored.sort((a, b) => b.score - a.score);

  const primary = scored
    .slice(0, MAX_PRIMARY_THEMES)
    .map((s, i) => ({
      ...s.theme,
      strategicImportance: "primary" as const,
      rank: i + 1,
    }));

  const secondary = scored
    .slice(MAX_PRIMARY_THEMES, MAX_PRIMARY_THEMES + MAX_SECONDARY_THEMES)
    .map((s, i) => ({
      ...s.theme,
      strategicImportance: "secondary" as const,
      rank: primary.length + i + 1,
    }));

  return { primary, secondary, suppressed };
}
