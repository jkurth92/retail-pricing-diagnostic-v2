import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";

export function parseMarginSpanPct(range: string): number | null {
  const m = range.match(/(\d+(?:\.\d+)?)\s*%?\s*[–-]\s*(\d+(?:\.\d+)?)\s*%/);
  if (!m) return null;
  return parseFloat(m[2]) - parseFloat(m[1]);
}

export function dedupeThemeFamilies(themes: ExecutiveTheme[]): ExecutiveTheme[] {
  if (!OUTPUT_CALIBRATION_RULES.suppressDuplicateThemeFamilies) return themes;
  const seen = new Set<string>();
  return themes.filter((t) => {
    if (seen.has(t.themeFamily)) return false;
    seen.add(t.themeFamily);
    return true;
  });
}

export function applyThemeListCalibration(themes: ExecutiveTheme[]): ExecutiveTheme[] {
  const primary = themes
    .filter((t) => t.strategicImportance === "primary")
    .slice(0, OUTPUT_CALIBRATION_RULES.maxPrimaryThemes);
  const secondary = themes
    .filter((t) => t.strategicImportance === "secondary")
    .slice(0, OUTPUT_CALIBRATION_RULES.maxSecondaryThemes);
  return dedupeThemeFamilies([...primary, ...secondary]);
}

export function calibrateStorylineResult(
  result: StorylineSynthesisResult,
): StorylineSynthesisResult {
  const primary = dedupeThemeFamilies(
    result.storyline.primaryThemes.slice(0, OUTPUT_CALIBRATION_RULES.maxPrimaryThemes),
  );
  const secondary = dedupeThemeFamilies(
    result.storyline.secondaryThemes.slice(
      0,
      OUTPUT_CALIBRATION_RULES.maxSecondaryThemes,
    ),
  );

  return {
    ...result,
    storyline: {
      ...result.storyline,
      primaryThemes: primary,
      secondaryThemes: secondary,
    },
  };
}

export function calibrateReadoutImplications(readout: DiagnosticReadout): DiagnosticReadout {
  return {
    ...readout,
    strategicImplications: readout.strategicImplications.slice(
      0,
      OUTPUT_CALIBRATION_RULES.maxImplicationsSurfaced,
    ),
  };
}

export function hypothesisCountWithinCalibration(
  output: DiagnosticHypothesisOutput,
): boolean {
  return output.hypotheses.length <= OUTPUT_CALIBRATION_RULES.maxSurfacedHypotheses;
}

export function marginRangeWithinCalibration(range: string): boolean {
  const span = parseMarginSpanPct(range);
  if (span === null) return true;
  return span <= OUTPUT_CALIBRATION_RULES.maxThemeMarginSpanPct;
}
