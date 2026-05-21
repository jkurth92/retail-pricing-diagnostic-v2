import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import { getScenarioExpectation } from "@/tests/e2e/validationScenarios";
import type { RetailerValidationScenario } from "@/tests/e2e/retailer-scenarios";
import {
  marginRangeWithinCalibration,
  parseMarginSpanPct,
} from "@/lib/outputCalibration";
import type { ValidationFlag } from "@/lib/endToEndValidator";
import type { DiagnosticHypothesisOutput } from "@/types/diagnostic-hypotheses";
import type { DiagnosticReadout } from "@/types/diagnostic-readout";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { StorylineSectionId } from "@/types/storyline-sections";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

export function checkArchetypePostureAlignment(
  knowledge: KnowledgeRegistryContext,
  scenario?: RetailerValidationScenario,
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];
  if (!scenario) return flags;

  if (knowledge.archetypeId !== scenario.archetypeId) {
    flags.push({
      code: "archetype_mismatch",
      severity: "warning",
      message: `Archetype ${knowledge.archetypeId} differs from scenario default ${scenario.archetypeId}.`,
    });
  }
  if (knowledge.pricingPosture !== scenario.pricingPosture) {
    flags.push({
      code: "posture_mismatch",
      severity: "info",
      message: `Posture ${knowledge.pricingPosture} differs from scenario default ${scenario.pricingPosture}.`,
    });
  }
  return flags;
}

export function checkHypothesisOutput(
  output: DiagnosticHypothesisOutput,
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];
  if (output.hypotheses.length > OUTPUT_CALIBRATION_RULES.maxSurfacedHypotheses) {
    flags.push({
      code: "too_many_hypotheses",
      severity: "warning",
      message: `${output.hypotheses.length} hypotheses surfaced; max ${OUTPUT_CALIBRATION_RULES.maxSurfacedHypotheses}.`,
    });
  }
  if (output.hypotheses.length === 0) {
    flags.push({
      code: "no_hypotheses",
      severity: "warning",
      message: "No hypotheses surfaced — check evidence and confidence thresholds.",
    });
  }
  return flags;
}

export function checkStorylineCoherence(
  storylineResult: StorylineSynthesisResult,
  scenario?: RetailerValidationScenario,
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];
  const { storyline } = storylineResult;

  if (storyline.primaryThemes.length > OUTPUT_CALIBRATION_RULES.maxPrimaryThemes) {
    flags.push({
      code: "too_many_primary_themes",
      severity: "warning",
      message: `Primary theme count ${storyline.primaryThemes.length} exceeds calibration max.`,
    });
  }

  if (storyline.primaryThemes.length < OUTPUT_CALIBRATION_RULES.minPrimaryThemesPreferred) {
    flags.push({
      code: "few_primary_themes",
      severity: "info",
      message: "Fewer than two primary themes — storyline may feel thin.",
    });
  }

  const aggSpan = parseMarginSpanPct(storyline.marginOpportunityTotalRange);
  if (
    aggSpan !== null &&
    aggSpan > OUTPUT_CALIBRATION_RULES.maxAggregatedMarginSpanPct
  ) {
    flags.push({
      code: "wide_aggregate_margin",
      severity: "warning",
      message: `Aggregated margin range span (${aggSpan.toFixed(1)} pts) may feel too wide.`,
    });
  }

  for (const theme of storyline.primaryThemes) {
    if (!marginRangeWithinCalibration(theme.marginOpportunityRange)) {
      flags.push({
        code: "wide_theme_margin",
        severity: "warning",
        message: `Theme "${theme.themeName}" margin range may be too wide.`,
      });
    }
  }

  const families = storyline.primaryThemes.map((t) => t.themeFamily);
  const dup = families.filter((f, i) => families.indexOf(f) !== i);
  if (dup.length > 0) {
    flags.push({
      code: "duplicate_theme_families",
      severity: "warning",
      message: `Duplicate theme families in primary set: ${[...new Set(dup)].join(", ")}.`,
    });
  }

  if (scenario) {
    const expected = scenario.expectedStorylineEmphasis;
    const hasArch = storyline.primaryThemes.some((t) =>
      expected.includes(t.themeFamily),
    );
    if (expected.includes("Architecture") && !hasArch) {
      const arch = storyline.primaryThemes.some(
        (t) => t.themeFamily === "Architecture" || t.themeFamily === "Premiumization",
      );
      if (!arch) {
        flags.push({
          code: "missing_architecture_emphasis",
          severity: "info",
          message: "Scenario expects architecture emphasis; not in primary themes.",
        });
      }
    }
  }

  if (
    storyline.revenueSensitivitySummary &&
    !storyline.marginOpportunityTotalRange
  ) {
    flags.push({
      code: "revenue_without_margin",
      severity: "warning",
      message: "Revenue sensitivity present without margin opportunity framing.",
    });
  }

  const narrative = storyline.narrative.toLowerCase();
  if (
    narrative.split(storyline.primaryThemes[0]?.themeName.toLowerCase() ?? "___").length >
    OUTPUT_CALIBRATION_RULES.narrativeMaxParagraphs + 2
  ) {
    flags.push({
      code: "repetitive_narrative",
      severity: "info",
      message: "Storyline narrative may repeat theme names — review executive copy.",
    });
  }

  return flags;
}

export function checkExecutiveReadout(
  readout: DiagnosticReadout,
  expectationScenarioId?: string,
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];
  const exp = expectationScenarioId
    ? getScenarioExpectation(expectationScenarioId)
    : undefined;

  if (!readout.executiveSummary.retailerProfile.archetype) {
    flags.push({
      code: "missing_profile",
      severity: "error",
      message: "Executive readout missing retailer pricing profile archetype.",
    });
  }

  if (exp?.mustHavePrimaryThemes && readout.executiveSummary.topThemes.length === 0) {
    flags.push({
      code: "missing_top_themes",
      severity: "error",
      message: "Executive summary has no top themes.",
    });
  }

  if (readout.storylineSections.length < 4) {
    flags.push({
      code: "thin_storyline_sections",
      severity: "info",
      message: "Few storyline sections — may be correct if confidence suppressed sections.",
    });
  }

  const sectionIds = readout.storylineSections.map((s) => s.id);
  const expectedOrder: StorylineSectionId[] = [
    "retailer_profile",
    "architecture_coherence",
    "opportunity_framing",
    "strategic_implications",
  ];
  for (const id of expectedOrder) {
    if (!sectionIds.includes(id)) {
      flags.push({
        code: "missing_storyline_section",
        severity: "info",
        message: `Expected storyline section missing: ${id}.`,
      });
    }
  }

  return flags;
}
