import {
  ARCHETYPE_NARRATIVE_CONTEXT,
  EXECUTIVE_NARRATIVE_BY_THEME,
} from "@/data/executiveNarrativeTemplates";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { ExecutiveThemeDefinition } from "@/data/executiveThemes";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";

export function buildThemeNarrativeSnippet(
  definition: ExecutiveThemeDefinition,
): string {
  const frag = EXECUTIVE_NARRATIVE_BY_THEME[definition.narrativeKey];
  if (!frag) return definition.summary;
  return `${frag.lead}; ${frag.bridge}, ${frag.close}.`;
}

export function buildExecutiveSummary(
  primaryThemes: ExecutiveTheme[],
  archetypeId: RetailerArchetypeId,
  retailerName: string | null,
  evidence?: ComputedEvidenceBundle,
): string {
  const who = retailerName?.trim()
    ? `${retailerName.trim()}`
    : "The retailer";

  if (evidence && evidence.evidenceBackedThemes.length > 0) {
    const lead = evidence.evidenceBackedThemes[0].detail;
    const metric =
      evidence.summaries[0] != null ? ` ${evidence.summaries[0]}.` : "";
    return `${lead}${metric} Thematic diagnostic — not a recommendation to change specific prices.`;
  }

  const ctx = ARCHETYPE_NARRATIVE_CONTEXT[archetypeId];
  const top = primaryThemes.slice(0, 2).map((t) => t.themeName.toLowerCase());
  const topPhrase =
    top.length >= 2
      ? `${top[0]} and ${top[1]}`
      : top[0] ?? "structural pricing themes";

  return `${who} faces a pricing structure story centered on ${topPhrase}. ${ctx} This is a thematic diagnostic synthesis — not a recommendation to change specific prices.`;
}

export function buildStorylineNarrative(
  primaryThemes: ExecutiveTheme[],
  definitions: Map<string, ExecutiveThemeDefinition>,
  archetypeId: RetailerArchetypeId,
): string {
  const ctx = ARCHETYPE_NARRATIVE_CONTEXT[archetypeId];
  const paragraphs: string[] = [ctx];

  for (const theme of primaryThemes.slice(0, 3)) {
    const def = definitions.get(theme.id);
    if (!def) {
      paragraphs.push(theme.summary);
      continue;
    }
    paragraphs.push(buildThemeNarrativeSnippet(def));
  }

  if (primaryThemes.length > 3) {
    const others = primaryThemes
      .slice(3, 5)
      .map((t) => t.themeName)
      .join(", ");
    paragraphs.push(
      `Additional themes (${others}) remain bounded thematic pools with shared structural drivers.`,
    );
  }

  paragraphs.push(
    "Recoverable value is framed as margin-led thematic opportunity — not operational price prescriptions.",
  );

  return paragraphs.join("\n\n");
}

export function buildConfidenceSummary(
  primaryThemes: ExecutiveTheme[],
): string {
  if (primaryThemes.length === 0) {
    return "No primary themes met medium-or-higher confidence.";
  }
  const levels = primaryThemes.map((t) => t.confidence.level);
  const high = levels.filter((l) => l === "high" || l === "medium_high").length;
  const coverage = primaryThemes[0]?.confidence.evidenceCoverage ?? "partial";
  return `${high} of ${primaryThemes.length} primary themes carry medium-high or high confidence. Evidence coverage: ${coverage}. Low-confidence hypotheses excluded from storyline.`;
}
