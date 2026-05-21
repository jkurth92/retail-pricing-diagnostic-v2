import { formatExecutiveCurrency } from "@/lib/formatExecutiveCurrency";
import type { CompanyProfile } from "@/types/company-profile";
import type { NewsSummary } from "@/types/context-enrichment";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

export type ContextKpi = {
  label: string;
  value: string;
  hint?: string;
};

export type FinancialBar = {
  label: string;
  value: number;
  display: string;
};

export function buildContextKpis(
  enrichment: RetailerEnrichmentBundle,
): ContextKpi[] {
  const { context, companyProfile: p } = enrichment;
  const kpis: ContextKpi[] = [];

  const revenue = context.revenue ?? p?.revenueDisplay;
  if (revenue) kpis.push({ label: "Revenue", value: revenue });

  const ebitda = p?.ebitdaDisplay;
  if (ebitda) kpis.push({ label: "EBITDA", value: ebitda });

  const opMargin = p?.operatingMarginDisplay;
  if (opMargin) kpis.push({ label: "Operating margin", value: opMargin });

  const grossMargin = p?.grossMarginDisplay;
  if (grossMargin) kpis.push({ label: "Gross margin", value: grossMargin });

  const marketCap = context.marketCap ?? p?.marketCapDisplay;
  if (marketCap) kpis.push({ label: "Market cap", value: marketCap });

  const stores = context.storeCount ?? p?.storeCountDisplay;
  if (stores) kpis.push({ label: "Store count", value: stores });

  return kpis;
}

export function buildFinancialBars(
  profile: CompanyProfile | null,
): FinancialBar[] {
  if (!profile) return [];
  const bars: FinancialBar[] = [];
  if (profile.revenue != null && profile.revenue > 0) {
    bars.push({
      label: "Revenue",
      value: profile.revenue,
      display: formatExecutiveCurrency(profile.revenue),
    });
  }
  if (profile.ebitda != null && profile.ebitda > 0) {
    bars.push({
      label: "EBITDA",
      value: profile.ebitda,
      display: formatExecutiveCurrency(profile.ebitda),
    });
  }
  if (profile.marketCap != null && profile.marketCap > 0) {
    bars.push({
      label: "Market cap",
      value: profile.marketCap,
      display: formatExecutiveCurrency(profile.marketCap),
    });
  }
  return bars;
}

export function formatNewsDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function relevanceLabel(tag: NewsSummary["relevanceTag"]): string {
  return tag.replace(/_/g, " ");
}

export function isRichPublicContext(enrichment: RetailerEnrichmentBundle): boolean {
  const { context, companyProfile } = enrichment;
  if (!context.retailerName.trim()) return false;
  if (!context.publicCompany && context.retailerType !== "public_retailer") {
    return Boolean(context.companyOverview || companyProfile);
  }
  return Boolean(
    companyProfile ||
      context.companyOverview ||
      context.revenue ||
      enrichment.news.length > 0,
  );
}

export function profileSourceLabel(
  enrichment: RetailerEnrichmentBundle,
): string {
  if (enrichment.companyProfile?.profileUrl) {
    return "Company website";
  }
  if (enrichment.meta.profileSource === "api_profile") {
    return "Public company profile";
  }
  if (enrichment.meta.profileSource === "curated_reference") {
    return "Public company context";
  }
  return "Company context";
}
