import type { CompanyProfile } from "@/types/company-profile";
import type { ContextEnrichmentSource } from "@/types/context-enrichment";

export type ProfileApiResult = {
  profile: CompanyProfile | null;
  source: ContextEnrichmentSource;
  error: string | null;
};

function formatUsdCompact(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString("en-US")}`;
}

/** Server-side Finnhub profile fetch (used from API route). */
export async function fetchFinnhubProfile(
  ticker: string,
  apiKey: string,
): Promise<CompanyProfile | null> {
  const symbol = ticker.toUpperCase();
  const res = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as {
    name?: string;
    ticker?: string;
    exchange?: string;
    marketCapitalization?: number;
    shareOutstanding?: number;
    finnhubIndustry?: string;
    country?: string;
    city?: string;
    weburl?: string;
    ipo?: string;
  };

  if (!data?.name && !data?.ticker) return null;

  const marketCapUsd =
    data.marketCapitalization != null
      ? data.marketCapitalization * 1e6
      : null;

  return {
    ticker: symbol,
    companyName: data.name ?? symbol,
    exchange: data.exchange ?? null,
    marketCap: marketCapUsd,
    marketCapDisplay: formatUsdCompact(marketCapUsd),
    revenue: null,
    revenueDisplay: null,
    ebitda: null,
    ebitdaDisplay: null,
    storeCount: null,
    storeCountDisplay: null,
    headquarters: data.city ?? null,
    country: data.country ?? null,
    sector: null,
    industry: data.finnhubIndustry ?? null,
    description: null,
    operatingMarginDisplay: null,
    grossMarginDisplay: null,
    profileUrl: data.weburl ?? null,
    trajectory: {
      revenueGrowthPct: null,
      ebitdaGrowthPct: null,
      grossMarginChangeBps: null,
      operatingMarginChangeBps: null,
      ebitdaMarginChangeBps: null,
    },
    lastUpdated: new Date().toISOString(),
    source: "api_profile",
  };
}

/** Client-side: call app API route for profile enrichment. */
export async function fetchProfileViaAppApi(
  ticker: string,
): Promise<ProfileApiResult> {
  try {
    const res = await fetch(
      `/api/retailer-enrichment?type=profile&ticker=${encodeURIComponent(ticker)}`,
    );
    if (!res.ok) {
      return {
        profile: null,
        source: "inferred_context",
        error: `Profile request failed (${res.status})`,
      };
    }
    const body = (await res.json()) as ProfileApiResult;
    return body;
  } catch (e) {
    return {
      profile: null,
      source: "inferred_context",
      error: e instanceof Error ? e.message : "Profile fetch failed",
    };
  }
}
