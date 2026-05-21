import {
  OPPORTUNITY_CAVEATS,
  OPPORTUNITY_STATUS_NOTES,
} from "@/data/opportunitySummaryTemplates";
import { aggregateMarginOpportunity } from "@/lib/opportunityAggregator";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type {
  OpportunityDriver,
  OpportunitySummary,
  OpportunitySummaryStatus,
} from "@/types/opportunity-summary";

export function buildOpportunitySummary(
  primaryThemes: ExecutiveTheme[],
  secondaryThemes: ExecutiveTheme[],
  revenueSensitivitySummary: string,
  hasRevenueInScope: boolean,
): OpportunitySummary {
  const status: OpportunitySummaryStatus =
    primaryThemes.length === 0
      ? "insufficient_hypotheses"
      : hasRevenueInScope
        ? "pending_scope_dollars"
        : "thematic_only";

  const totalMargin = aggregateMarginOpportunity(primaryThemes, secondaryThemes);

  const primaryDrivers = primaryThemes.map((t) => ({
    label: t.themeName,
    marginRange: t.marginOpportunityRange,
    role: "primary" as const,
  }));

  const secondaryDrivers = secondaryThemes.map((t) => ({
    label: t.themeName,
    marginRange: t.marginOpportunityRange,
    role: "secondary" as const,
  }));

  const governance = primaryThemes.find((t) => t.themeFamily === "Governance");
  const enablers: OpportunityDriver[] = [];
  if (
    governance &&
    !primaryDrivers.some((d) => d.label === governance.themeName)
  ) {
    enablers.push({
      label: governance.themeName,
      marginRange: governance.marginOpportunityRange,
      role: "enabler",
    });
  }

  return {
    status,
    totalMarginOpportunityRange: totalMargin,
    totalRevenueSensitivityRange: revenueSensitivitySummary,
    primaryOpportunityDrivers: primaryDrivers,
    secondaryOpportunityDrivers: [...secondaryDrivers, ...enablers],
    caveats: [...OPPORTUNITY_CAVEATS],
    notes: [
      OPPORTUNITY_STATUS_NOTES[status],
      "Architecture themes treated as primary margin drivers where surfaced.",
      "KVI, promo, and markdown pools are secondary unless they dominate the hypothesis set.",
    ],
  };
}
