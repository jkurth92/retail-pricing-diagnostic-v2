import { OUTPUT_CALIBRATION_RULES } from "@/data/outputCalibrationRules";
import { EXECUTIVE_STORYLINE_FLOW } from "@/data/executiveStorylineFlow";
import {
  orderedStorylineSections,
  shouldIncludeSection,
  themesForSection,
} from "@/lib/storylinePrioritization";
import type { RetailerPricingProfile } from "@/types/executive-summary";
import type { StorylineSection } from "@/types/storyline-sections";
import type { StorylineSectionId } from "@/types/storyline-sections";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSummary } from "@/types/storyline";
import type { OpportunitySummary } from "@/types/opportunity-summary";

function collectSectionSignals(themes: ExecutiveTheme[]) {
  const seen = new Set<string>();
  const out: ExecutiveTheme["supportingSignals"] = [];
  for (const t of themes) {
    for (const s of t.supportingSignals) {
      if (!seen.has(s.signalId)) {
        seen.add(s.signalId);
        out.push(s);
      }
    }
  }
  return out.slice(0, 6);
}

function sectionConfidence(themes: ExecutiveTheme[]): string {
  if (themes.length === 0) return "Context section — see executive summary.";
  const levels = themes.map((t) => t.confidence.level);
  if (levels.some((l) => l === "high" || l === "medium_high")) {
    return "Medium-high confidence across supporting themes in this section.";
  }
  return "Moderate confidence — directional until evidence alignment completes.";
}

function buildSectionNarrative(
  sectionId: StorylineSectionId,
  themes: ExecutiveTheme[],
  profile: RetailerPricingProfile,
  storyline: StorylineSummary,
  opportunity?: OpportunitySummary,
): string {
  const def = EXECUTIVE_STORYLINE_FLOW.find((s) => s.id === sectionId)!;

  if (sectionId === "retailer_profile") {
    return (
      `${def.narrativeLead} ${profile.archetype} archetype with ${profile.posture} posture. ` +
      `${profile.inferredCategoryRoleStructure}. Item roles: ${profile.inferredItemRoleStructure}. ` +
      `${profile.strategicOrientation}`
    );
  }

  if (sectionId === "opportunity_framing") {
    return (
      `${def.narrativeLead} ${storyline.marginOpportunityTotalRange}. ` +
      `${storyline.revenueSensitivitySummary} ` +
      (opportunity?.caveats[0] ?? "")
    );
  }

  if (sectionId === "strategic_implications") {
    return (
      `${def.narrativeLead} Implications are structural — not tactical price prescriptions. ` +
      `Top themes: ${themes.map((t) => t.themeName).join(", ") || "see executive summary"}.`
    );
  }

  if (themes.length === 0) {
    return `${def.narrativeLead} No themes in this section met confidence thresholds for the current preview.`;
  }

  const themeNarratives = themes
    .slice(0, OUTPUT_CALIBRATION_RULES.maxStorylineSectionThemesListed)
    .map((t) => t.summary)
    .join(" ");

  return `${def.narrativeLead} ${themeNarratives}`;
}

function sectionOpportunitySummary(
  sectionId: StorylineSectionId,
  themes: ExecutiveTheme[],
  storyline: StorylineSummary,
): string {
  if (sectionId === "opportunity_framing") {
    return storyline.marginOpportunityTotalRange;
  }
  if (themes.length === 0) return "—";
  const ranges = themes.map((t) => t.marginOpportunityRange).join("; ");
  return ranges;
}

export function buildStorylineSections(
  profile: RetailerPricingProfile,
  storyline: StorylineSummary,
  opportunity: OpportunitySummary,
  allThemes: ExecutiveTheme[],
): StorylineSection[] {
  const sections: StorylineSection[] = [];

  for (const def of orderedStorylineSections()) {
    const themes =
      def.id === "strategic_implications"
        ? allThemes.slice(0, 5)
        : themesForSection(def.id, allThemes);

    if (!shouldIncludeSection(def.id, themes)) continue;

    sections.push({
      id: def.id,
      sectionTitle: def.sectionTitle,
      sectionNarrative: buildSectionNarrative(
        def.id,
        themes,
        profile,
        storyline,
        opportunity,
      ),
      supportingThemes: themes,
      supportingSignals: collectSectionSignals(themes),
      opportunitySummary: sectionOpportunitySummary(def.id, themes, storyline),
      confidenceSummary: sectionConfidence(themes),
      displayOrder: def.displayOrder,
    });
  }

  return sections;
}
