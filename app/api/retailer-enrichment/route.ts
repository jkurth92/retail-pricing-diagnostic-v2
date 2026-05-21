import { NextResponse } from "next/server";
import { fetchFinnhubNews } from "@/lib/api/newsApi";
import { fetchFinnhubProfile } from "@/lib/api/retailerProfileApi";
import {
  assembleEnrichmentBundle,
  resolveEnrichmentOnServer,
} from "@/lib/api/contextResolver";
import { CURATED_COMPANY_PROFILES } from "@/data/curatedCompanyProfiles";
import { CURATED_NEWS_BY_TICKER } from "@/data/curatedNewsHeadlines";
import type { RetailerEnrichmentOverrides } from "@/types/retailer-context";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "full";
  const ticker = searchParams.get("ticker")?.trim().toUpperCase() ?? "";
  const name = searchParams.get("name")?.trim() ?? "";
  const manualTicker = searchParams.get("ticker")?.trim() ?? null;

  let overrides: RetailerEnrichmentOverrides = {};
  const overridesRaw = searchParams.get("overrides");
  if (overridesRaw) {
    try {
      overrides = JSON.parse(overridesRaw) as RetailerEnrichmentOverrides;
    } catch {
      overrides = {};
    }
  }

  if (type === "profile") {
    if (!ticker) {
      return NextResponse.json({
        profile: null,
        source: "inferred_context",
        error: "Ticker required",
      });
    }
    const apiKey = process.env.FINNHUB_API_KEY?.trim();
    let profile = apiKey ? await fetchFinnhubProfile(ticker, apiKey) : null;
    let source = profile ? "api_profile" : "inferred_context";
    if (!profile && CURATED_COMPANY_PROFILES[ticker]) {
      profile = {
        ...CURATED_COMPANY_PROFILES[ticker],
        lastUpdated: new Date().toISOString(),
      };
      source = "curated_reference";
    }
    return NextResponse.json({ profile, source, error: null });
  }

  if (type === "news") {
    if (!ticker) {
      return NextResponse.json({
        items: [],
        source: "inferred_context",
        error: "Ticker required",
      });
    }
    const apiKey = process.env.FINNHUB_API_KEY?.trim();
    let items = apiKey ? await fetchFinnhubNews(ticker, apiKey) : [];
    let source = items.length > 0 ? "api_news" : "inferred_context";
    if (items.length === 0 && CURATED_NEWS_BY_TICKER[ticker]) {
      items = CURATED_NEWS_BY_TICKER[ticker];
      source = "curated_reference";
    }
    return NextResponse.json({ items, source, error: null });
  }

  const retailerName = name || ticker;
  if (!retailerName) {
    return NextResponse.json(
      { error: "name or ticker required" },
      { status: 400 },
    );
  }

  const serverData = await resolveEnrichmentOnServer({
    retailerName,
    manualTicker: manualTicker ?? overrides.ticker ?? null,
    overrides,
  });

  const bundle = assembleEnrichmentBundle(
    retailerName,
    manualTicker ?? overrides.ticker ?? null,
    overrides,
    serverData,
  );

  return NextResponse.json(bundle);
}
