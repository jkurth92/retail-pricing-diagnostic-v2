import {
  MATURITY_IMPLICATION_FRAGMENTS,
  STRATEGIC_IMPLICATION_TEMPLATES,
} from "@/data/strategicImplicationTemplates";
import type { RetailerPricingProfile } from "@/types/executive-summary";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { ExecutiveThemeFamily } from "@/types/executive-theme";

export function buildStrategicImplications(
  themes: ExecutiveTheme[],
  profile: RetailerPricingProfile,
  confidenceSummary: string,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const theme of themes) {
    for (const tmpl of STRATEGIC_IMPLICATION_TEMPLATES) {
      if (tmpl.families.includes(theme.themeFamily) && !seen.has(tmpl.implication)) {
        seen.add(tmpl.implication);
        out.push(tmpl.implication);
      }
    }
    for (const hyp of theme.supportingHypotheses) {
      for (const imp of hyp.architectureImplications) {
        const line = `Architecture: ${imp}`;
        if (!seen.has(line)) {
          seen.add(line);
          out.push(line);
        }
      }
    }
  }

  if (profile.strategicOrientation.includes("premiumization")) {
    const line =
      "Stated premiumization objective may require stronger tier clarity than current architecture themes suggest.";
    if (!seen.has(line)) out.push(line);
  }

  const coverage = confidenceSummary.includes("strong")
    ? "strong"
    : confidenceSummary.includes("partial")
      ? "partial"
      : confidenceSummary.includes("sparse")
        ? "sparse"
        : "adequate";

  out.push(MATURITY_IMPLICATION_FRAGMENTS[coverage] ?? MATURITY_IMPLICATION_FRAGMENTS.adequate);

  return out.slice(0, 8);
}

export function topImplicationsByFamily(
  themes: ExecutiveTheme[],
  family: ExecutiveThemeFamily,
): string[] {
  return STRATEGIC_IMPLICATION_TEMPLATES.filter((t) =>
    t.families.includes(family),
  )
    .map((t) => t.implication)
    .slice(0, 2);
}
