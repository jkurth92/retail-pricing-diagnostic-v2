import type { RetailerPricingProfile } from "@/types/executive-summary";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { StorylineSummary } from "@/types/storyline";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

export function buildOpeningExecutiveNarrative(
  profile: RetailerPricingProfile,
  primaryThemes: ExecutiveTheme[],
  storyline: StorylineSummary,
  enrichment?: RetailerEnrichmentBundle | null,
): string {
  const topNames = primaryThemes
    .slice(0, 2)
    .map((t) => t.themeName.toLowerCase())
    .join(" and ");

  const themePhrase =
    topNames.length > 0
      ? topNames
      : "structural pricing themes";

  const scaleHint =
    enrichment?.context.storeCount || enrichment?.context.revenue
      ? " Scale context informs narrative framing only."
      : "";

  const publicHint =
    enrichment?.context.publicCompany && enrichment.context.ticker
      ? ` (${enrichment.context.ticker})`
      : "";

  return (
    `The retailer${publicHint} appears to maintain a ${profile.posture.toLowerCase()} posture within a ${profile.archetype.toLowerCase()} context.${scaleHint} ` +
    `Broad visible value investment may be preserved in traffic-driving areas, though pricing architecture may be limiting effective monetization separation — especially where ${themePhrase} dominate the storyline. ` +
    `${storyline.executiveSummary.split(".")[0]}.`
  );
}

export function buildStructuralPictureSummary(
  profile: RetailerPricingProfile,
  architectureThemes: ExecutiveTheme[],
): string {
  if (architectureThemes.length === 0) {
    return `${profile.architectureProfile} No architecture theme surfaced at current confidence — interpret other levers as directional.`;
  }
  const names = architectureThemes.map((t) => t.themeName).join(", ");
  return `${profile.architectureProfile} Priority architecture themes: ${names}.`;
}
