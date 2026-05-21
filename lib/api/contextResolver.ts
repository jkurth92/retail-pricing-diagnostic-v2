import { CURATED_COMPANY_PROFILES } from "@/data/curatedCompanyProfiles";
import { CURATED_NEWS_BY_TICKER } from "@/data/curatedNewsHeadlines";
import { fetchFinnhubNews } from "@/lib/api/newsApi";
import { fetchFinnhubProfile } from "@/lib/api/retailerProfileApi";
import { lookupBannerHints, resolveRetailerLookup } from "@/lib/retailerLookup";
import { buildStrategicContextSuggestions } from "@/lib/strategicContextResolver";
import type { CompanyProfile } from "@/types/company-profile";
import type {
  ContextEnrichmentSource,
  ContextEnrichmentStatus,
  EnrichmentMeta,
  NewsSummary,
} from "@/types/context-enrichment";
import type {
  RetailerContext,
  RetailerEnrichmentBundle,
  RetailerEnrichmentOverrides,
  RetailerLookupResult,
} from "@/types/retailer-context";

function applyOverrides(
  base: RetailerContext,
  overrides: RetailerEnrichmentOverrides,
): RetailerContext {
  const merged: RetailerContext = { ...base, ...overrides };
  if (overrides.notes) {
    merged.notes = [...new Set([...base.notes, ...overrides.notes])];
  }
  if (overrides.ticker !== undefined) {
    merged.ticker = overrides.ticker;
    merged.publicCompany = Boolean(overrides.ticker);
  }
  return merged;
}

function profileToContextFields(
  profile: CompanyProfile,
): Partial<RetailerContext> {
  return {
    companyOverview: profile.description,
    revenue: profile.revenueDisplay,
    marketCap: profile.marketCapDisplay,
    storeCount: profile.storeCountDisplay,
    sector: profile.sector,
    subSector: profile.industry,
    companyProfileStatus: "available",
  };
}

function buildBaseContext(
  retailerName: string,
  lookup: RetailerLookupResult,
): RetailerContext {
  const hints = lookupBannerHints(retailerName);
  return {
    retailerName: lookup.normalizedName || retailerName.trim(),
    retailerType: lookup.retailerType,
    ticker: lookup.ticker,
    publicCompany: lookup.publicCompany,
    companyProfileStatus: "unavailable",
    companyOverview: null,
    bannerPortfolio: hints.bannerPortfolio,
    geography: hints.geography,
    storeCount: null,
    revenue: null,
    marketCap: null,
    sector: null,
    subSector: null,
    notes: [...hints.notes],
  };
}

function freshnessLabel(lastFetchedAt: string | null): string {
  if (!lastFetchedAt) return "Not yet refreshed";
  const ageMs = Date.now() - new Date(lastFetchedAt).getTime();
  const hours = ageMs / (1000 * 60 * 60);
  if (hours < 1) return "Updated just now";
  if (hours < 24) return `Updated ${Math.floor(hours)}h ago`;
  return "Reference data — verify before client use";
}

export type ServerEnrichmentInput = {
  retailerName: string;
  manualTicker?: string | null;
  overrides?: RetailerEnrichmentOverrides;
};

/** Server-side resolver for API route and deterministic mapping. */
export async function resolveEnrichmentOnServer(
  input: ServerEnrichmentInput,
): Promise<{
  profile: CompanyProfile | null;
  news: NewsSummary[];
  profileSource: ContextEnrichmentSource;
  newsSource: ContextEnrichmentSource;
  profileStatus: ContextEnrichmentStatus;
  newsStatus: ContextEnrichmentStatus;
  errorMessage: string | null;
}> {
  const lookup = resolveRetailerLookup(
    input.retailerName,
    input.manualTicker,
  );
  const ticker = lookup.ticker;
  const apiKey = process.env.FINNHUB_API_KEY?.trim();

  let profile: CompanyProfile | null = null;
  let news: NewsSummary[] = [];
  let profileSource: ContextEnrichmentSource = "inferred_context";
  let newsSource: ContextEnrichmentSource = "inferred_context";
  let errorMessage: string | null = null;

  if (!ticker) {
    return {
      profile: null,
      news: [],
      profileSource: "inferred_context",
      newsSource: "inferred_context",
      profileStatus: lookup.normalizedName ? "partial" : "unavailable",
      newsStatus: "unavailable",
      errorMessage: null,
    };
  }

  if (apiKey) {
    try {
      profile = await fetchFinnhubProfile(ticker, apiKey);
      if (profile) profileSource = "api_profile";
      news = await fetchFinnhubNews(ticker, apiKey);
      if (news.length > 0) newsSource = "api_news";
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : "API enrichment failed";
    }
  }

  if (!profile && CURATED_COMPANY_PROFILES[ticker]) {
    profile = { ...CURATED_COMPANY_PROFILES[ticker], lastUpdated: new Date().toISOString() };
    profileSource = "curated_reference";
  }

  if (news.length === 0 && CURATED_NEWS_BY_TICKER[ticker]) {
    news = CURATED_NEWS_BY_TICKER[ticker];
    newsSource = "curated_reference";
  }

  const profileStatus: ContextEnrichmentStatus = profile
    ? profileSource === "api_profile"
      ? "available"
      : "partial"
    : "unavailable";

  const newsStatus: ContextEnrichmentStatus =
    news.length > 0 ? (newsSource === "api_news" ? "available" : "partial") : "unavailable";

  return {
    profile,
    news,
    profileSource,
    newsSource,
    profileStatus,
    newsStatus,
    errorMessage,
  };
}

export function assembleEnrichmentBundle(
  retailerName: string,
  manualTicker: string | null | undefined,
  overrides: RetailerEnrichmentOverrides,
  serverData: Awaited<ReturnType<typeof resolveEnrichmentOnServer>>,
): RetailerEnrichmentBundle {
  const lookup = resolveRetailerLookup(retailerName, manualTicker ?? overrides.ticker);
  const lastFetchedAt = new Date().toISOString();

  let base = buildBaseContext(retailerName, lookup);
  if (serverData.profile) {
    base = { ...base, ...profileToContextFields(serverData.profile) };
    base.ticker = serverData.profile.ticker;
    base.publicCompany = true;
    base.retailerType = "public_retailer";
  } else if (lookup.ticker) {
    base.companyProfileStatus = serverData.profileStatus;
  }

  const context = applyOverrides(base, overrides);
  if (overrides.ticker) {
    context.ticker = overrides.ticker;
  }

  const meta: EnrichmentMeta = {
    profileStatus: serverData.profileStatus,
    newsStatus: serverData.newsStatus,
    profileSource: serverData.profileSource,
    newsSource: serverData.newsSource,
    lastFetchedAt,
    freshnessLabel: freshnessLabel(lastFetchedAt),
    errorMessage: serverData.errorMessage,
  };

  const suggestions = buildStrategicContextSuggestions(
    context,
    serverData.profile,
  );

  return {
    context,
    companyProfile: serverData.profile,
    news: serverData.news,
    meta,
    lookup,
    suggestions,
    manualOverrides: overrides,
  };
}

/** Client-side: fetch full enrichment bundle from API. */
export async function fetchEnrichmentBundle(
  retailerName: string,
  manualTicker?: string | null,
  overrides: RetailerEnrichmentOverrides = {},
): Promise<RetailerEnrichmentBundle> {
  const params = new URLSearchParams({
    type: "full",
    name: retailerName,
  });
  if (manualTicker) params.set("ticker", manualTicker);
  if (Object.keys(overrides).length > 0) {
    params.set("overrides", JSON.stringify(overrides));
  }

  try {
    const res = await fetch(`/api/retailer-enrichment?${params.toString()}`);
    if (!res.ok) {
      return buildFallbackBundle(retailerName, manualTicker, overrides);
    }
    return (await res.json()) as RetailerEnrichmentBundle;
  } catch {
    return buildFallbackBundle(retailerName, manualTicker, overrides);
  }
}

export function buildFallbackBundle(
  retailerName: string,
  manualTicker?: string | null,
  overrides: RetailerEnrichmentOverrides = {},
): RetailerEnrichmentBundle {
  const serverData = {
    profile: null as CompanyProfile | null,
    news: [] as NewsSummary[],
    profileSource: "inferred_context" as ContextEnrichmentSource,
    newsSource: "inferred_context" as ContextEnrichmentSource,
    profileStatus: "partial" as ContextEnrichmentStatus,
    newsStatus: "unavailable" as ContextEnrichmentStatus,
    errorMessage: "Enrichment unavailable — using client input only.",
  };

  const lookup = resolveRetailerLookup(retailerName, manualTicker);
  const ticker = lookup.ticker;
  if (ticker && CURATED_COMPANY_PROFILES[ticker]) {
    serverData.profile = {
      ...CURATED_COMPANY_PROFILES[ticker],
      lastUpdated: new Date().toISOString(),
    };
    serverData.profileSource = "curated_reference";
    serverData.profileStatus = "partial";
  }
  if (ticker && CURATED_NEWS_BY_TICKER[ticker]) {
    serverData.news = CURATED_NEWS_BY_TICKER[ticker];
    serverData.newsSource = "curated_reference";
    serverData.newsStatus = "partial";
  }

  return assembleEnrichmentBundle(
    retailerName,
    manualTicker,
    overrides,
    serverData,
  );
}

export function createEmptyEnrichment(retailerName = ""): RetailerEnrichmentBundle {
  return buildFallbackBundle(retailerName);
}

/** Re-apply manual overrides locally without a network round-trip. */
export function mergeEnrichmentOverrides(
  bundle: RetailerEnrichmentBundle,
  overrides: RetailerEnrichmentOverrides,
  manualTicker?: string | null,
): RetailerEnrichmentBundle {
  const serverData = {
    profile: bundle.companyProfile,
    news: bundle.news,
    profileSource: bundle.meta.profileSource,
    newsSource: bundle.meta.newsSource,
    profileStatus: bundle.meta.profileStatus,
    newsStatus: bundle.meta.newsStatus,
    errorMessage: bundle.meta.errorMessage,
  };
  return assembleEnrichmentBundle(
    bundle.context.retailerName,
    manualTicker ?? bundle.context.ticker,
    { ...bundle.manualOverrides, ...overrides },
    serverData,
  );
}
