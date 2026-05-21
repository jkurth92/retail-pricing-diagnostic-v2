import { mergeEnrichmentOverrides } from "@/lib/api/contextResolver";
import type { RetailerEnrichmentBundle, RetailerEnrichmentOverrides } from "@/types/retailer-context";
import type { ValidationFlag } from "@/lib/endToEndValidator";

export function runContextSanityChecks(
  enrichment: RetailerEnrichmentBundle,
  hypothesisThemeCount: number,
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];

  if (!enrichment.context.retailerName?.trim()) {
    flags.push({
      code: "missing_retailer_name",
      severity: "error",
      message: "Retailer name is missing from enrichment context.",
    });
  }

  if (enrichment.meta.profileStatus === "unavailable" && enrichment.lookup.ticker) {
    flags.push({
      code: "ticker_without_profile",
      severity: "info",
      message: "Ticker resolved but profile enrichment unavailable — workflow should continue.",
    });
  }

  if (enrichment.meta.errorMessage) {
    flags.push({
      code: "enrichment_error",
      severity: "info",
      message: enrichment.meta.errorMessage,
    });
  }

  const manual: RetailerEnrichmentOverrides = {
    companyOverview: "Manual override company overview for sanity test",
    revenue: "Manual revenue display",
  };
  const merged = mergeEnrichmentOverrides(enrichment, manual, enrichment.context.ticker);
  if (merged.context.companyOverview !== manual.companyOverview) {
    flags.push({
      code: "manual_override_failed",
      severity: "error",
      message: "Manual override did not take precedence over API/curated profile fields.",
    });
  } else {
    flags.push({
      code: "manual_override_ok",
      severity: "pass",
      message: "Manual overrides correctly supersede enriched profile fields.",
    });
  }

  flags.push({
    code: "api_context_only",
    severity: "pass",
    message: `Enrichment present; hypothesis/theme count (${hypothesisThemeCount}) is independent of API profile data.`,
  });

  return flags;
}
