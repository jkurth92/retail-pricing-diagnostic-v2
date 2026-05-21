import { EXECUTIVE_STORYLINE_FLOW } from "@/data/executiveStorylineFlow";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSectionId } from "@/types/storyline-sections";

export function themesForSection(
  sectionId: StorylineSectionId,
  allThemes: ExecutiveTheme[],
): ExecutiveTheme[] {
  const def = EXECUTIVE_STORYLINE_FLOW.find((s) => s.id === sectionId);
  if (!def || def.themeFamilies.length === 0) {
    if (sectionId === "opportunity_framing" || sectionId === "strategic_implications") {
      return [];
    }
    return [];
  }
  return allThemes.filter((t) => def.themeFamilies.includes(t.themeFamily));
}

export function orderedStorylineSections(): typeof EXECUTIVE_STORYLINE_FLOW {
  return [...EXECUTIVE_STORYLINE_FLOW].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function shouldIncludeSection(
  sectionId: StorylineSectionId,
  themes: ExecutiveTheme[],
  alwaysInclude: StorylineSectionId[] = [
    "retailer_profile",
    "opportunity_framing",
    "strategic_implications",
  ],
): boolean {
  if (alwaysInclude.includes(sectionId)) return true;
  return themes.length > 0;
}
