import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

/** Narrative-only snippets for executive profile — no diagnostic math. */
export function buildEnrichmentNarrativeSnippets(
  enrichment: RetailerEnrichmentBundle | null | undefined,
): string[] {
  if (!enrichment?.context.retailerName?.trim()) return [];

  const { context, companyProfile, news, meta } = enrichment;
  const lines: string[] = [];

  if (context.publicCompany && context.ticker) {
    lines.push(
      `Public company context (${context.ticker})${context.sector ? ` · ${context.sector}` : ""}.`,
    );
  } else {
    lines.push("Private or non-mapped retailer — scale context relies on manual notes.");
  }

  if (context.storeCount) {
    lines.push(`Scale reference: ${context.storeCount}.`);
  } else if (companyProfile?.storeCountDisplay) {
    lines.push(`Scale reference: ${companyProfile.storeCountDisplay}.`);
  }

  if (context.revenue || companyProfile?.revenueDisplay) {
    lines.push(
      `Revenue context: ${context.revenue ?? companyProfile?.revenueDisplay}.`,
    );
  }

  if (context.companyOverview) {
    lines.push(context.companyOverview.slice(0, 200));
  } else if (companyProfile?.description) {
    lines.push(companyProfile.description.slice(0, 200));
  }

  if (context.bannerPortfolio) {
    lines.push(`Banner portfolio: ${context.bannerPortfolio}.`);
  }

  if (news.length > 0) {
    const top = news[0];
    lines.push(
      `Recent signal (${top.relevanceTag.replace(/_/g, " ")}): ${top.headline}.`,
    );
  }

  lines.push(`Enrichment: ${meta.freshnessLabel} (${meta.profileSource.replace(/_/g, " ")}).`);

  return lines.slice(0, 5);
}
