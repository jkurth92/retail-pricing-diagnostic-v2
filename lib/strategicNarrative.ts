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
  const archTheme = primaryThemes.find((t) => t.themeFamily === "Architecture");
  const lead =
    archTheme?.themeName.toLowerCase() ??
    primaryThemes[0]?.themeName.toLowerCase() ??
    "compressed premium architecture";

  const publicHint =
    enrichment?.context.publicCompany && enrichment.context.ticker
      ? ` (${enrichment.context.ticker})`
      : "";

  return (
    `The retailer${publicHint} maintains a ${profile.posture.toLowerCase()} posture in a ${profile.archetype.toLowerCase()} context. ` +
    `Measured structure points to ${lead} as the lead pricing story, with opportunity bounded rather than portfolio-wide.`
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
