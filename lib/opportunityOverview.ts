import {
  OPPORTUNITY_OVERVIEW_LEADS,
  RECOVERABILITY_NOTES,
} from "@/data/opportunityOverviewTemplates";
import type { StorylineSynthesisResult } from "@/lib/storylineSynthesizer";
import type { ExecutiveTheme } from "@/types/executive-theme";

export function buildOpportunityOverviewNarrative(
  storylineResult: StorylineSynthesisResult,
  primaryThemes: ExecutiveTheme[],
): string {
  const { storyline, opportunity } = storylineResult;
  const lead =
    OPPORTUNITY_OVERVIEW_LEADS[
      primaryThemes.some((t) => t.themeFamily === "Architecture")
        ? 0
        : 1
    ];

  const recoverability = primaryThemes[0]?.recoverability ?? "medium";
  const recNote =
    RECOVERABILITY_NOTES[recoverability] ?? RECOVERABILITY_NOTES.medium;

  return (
    `${lead} ` +
    `Consolidated thematic margin range: ${storyline.marginOpportunityTotalRange}. ` +
    `${storyline.revenueSensitivitySummary} ` +
    `${recNote} ` +
    `Status: ${opportunity.status.replace(/_/g, " ")}.`
  );
}
