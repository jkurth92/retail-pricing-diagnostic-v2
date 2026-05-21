import type { NewsSummary, RelevanceTag } from "@/types/context-enrichment";

export type NewsApiResult = {
  items: NewsSummary[];
  source: NewsSummary["sourceType"];
  error: string | null;
};

function inferRelevanceTag(headline: string, summary: string): RelevanceTag {
  const text = `${headline} ${summary}`.toLowerCase();
  if (text.includes("earnings") || text.includes("quarter")) return "earnings";
  if (text.includes("margin") || text.includes("profit")) return "margin";
  if (text.includes("traffic") || text.includes("footfall")) return "traffic";
  if (text.includes("price") || text.includes("pricing")) return "pricing";
  if (text.includes("inflation") || text.includes("cost")) return "inflation";
  if (text.includes("store") || text.includes("expansion")) return "expansion";
  if (text.includes("turnaround") || text.includes("restructur"))
    return "turnaround";
  if (text.includes("value") || text.includes("promo")) return "value_perception";
  return "strategic_initiative";
}

/** Server-side Finnhub company news (used from API route). */
export async function fetchFinnhubNews(
  ticker: string,
  apiKey: string,
  limit = 5,
): Promise<NewsSummary[]> {
  const symbol = ticker.toUpperCase();
  const to = new Date().toISOString().slice(0, 10);
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 90);
  const from = fromDate.toISOString().slice(0, 10);

  const res = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${apiKey}`,
    { next: { revalidate: 1800 } },
  );
  if (!res.ok) return [];

  const rows = (await res.json()) as Array<{
    headline?: string;
    source?: string;
    datetime?: number;
    summary?: string;
  }>;

  return rows.slice(0, limit).map((row, i) => {
    const headline = row.headline ?? "Company news item";
    const summary = row.summary ?? "";
    return {
      id: `${symbol}-news-${i}`,
      headline,
      source: row.source ?? "Finnhub",
      publishedAt: row.datetime
        ? new Date(row.datetime * 1000).toISOString()
        : new Date().toISOString(),
      summary: summary.slice(0, 280) || "Recent company news item.",
      relevanceTag: inferRelevanceTag(headline, summary),
      sourceType: "api_news",
    };
  });
}

/** Client-side: call app API route for news enrichment. */
export async function fetchNewsViaAppApi(ticker: string): Promise<NewsApiResult> {
  try {
    const res = await fetch(
      `/api/retailer-enrichment?type=news&ticker=${encodeURIComponent(ticker)}`,
    );
    if (!res.ok) {
      return {
        items: [],
        source: "inferred_context",
        error: `News request failed (${res.status})`,
      };
    }
    return (await res.json()) as NewsApiResult;
  } catch (e) {
    return {
      items: [],
      source: "inferred_context",
      error: e instanceof Error ? e.message : "News fetch failed",
    };
  }
}
