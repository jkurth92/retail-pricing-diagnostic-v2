import type { NewsSummary } from "@/types/context-enrichment";

/** Curated headline context for known tickers when news API is unavailable. */
export const CURATED_NEWS_BY_TICKER: Record<string, NewsSummary[]> = {
  WMT: [
    {
      id: "wmt-1",
      headline: "Everyday low price messaging remains central to traffic strategy",
      source: "CNBC",
      publishedAt: "2024-05-22T12:00:00.000Z",
      summary:
        "Visible value investment across consumables continues to anchor price image for mass trip missions.",
      relevanceTag: "value_perception",
      sourceType: "curated_reference",
      url: "https://www.cnbc.com/2024/05/22/target-walmart-mcdonalds-price-cuts-deals.html",
    },
    {
      id: "wmt-2",
      headline: "Mix shift toward grocery and health & wellness influences margin narrative",
      source: "CNBC",
      publishedAt: "2024-05-16T12:00:00.000Z",
      summary:
        "Category role structure may emphasize traffic drivers with thinner margin unless architecture separates tiers clearly.",
      relevanceTag: "margin",
      sourceType: "curated_reference",
      url: "https://www.cnbc.com/2024/05/16/walmart-earnings-grocery-sales-rise-as-fast-food-prices-increases.html",
    },
  ],
  TGT: [
    {
      id: "tgt-1",
      headline: "Owned-brand and style credibility support premiumization tension",
      source: "CNBC",
      publishedAt: "2025-03-04T12:00:00.000Z",
      summary:
        "Architecture and visible value balance matter for seasonal categories and discretionary baskets.",
      relevanceTag: "pricing",
      sourceType: "curated_reference",
      url: "https://www.cnbc.com/2025/03/04/target-outlines-plans-to-grow-sales-by-15-billion-by-2030.html",
    },
  ],
  COST: [
    {
      id: "cost-1",
      headline: "Membership model limits promotional dependency",
      source: "CNBC",
      publishedAt: "2024-06-24T12:00:00.000Z",
      summary:
        "Value perception is structural; architecture focuses on pack-size and treasure-hunt rotation.",
      relevanceTag: "value_perception",
      sourceType: "curated_reference",
      url: "https://www.cnbc.com/2024/06/24/costco-ceo-says-this-is-the-most-important-item-the-store-sells.html",
    },
  ],
  KR: [
    {
      id: "kr-1",
      headline: "Multi-banner grocery portfolio complicates unified price image",
      source: "CNBC",
      publishedAt: "2025-06-20T12:00:00.000Z",
      summary:
        "Banner-level posture may vary — diagnostic should clarify which banner lens applies.",
      relevanceTag: "strategic_initiative",
      sourceType: "curated_reference",
      url: "https://www.cnbc.com/2025/06/20/kroger-kr-q1-2025-earnings.html",
    },
  ],
};
