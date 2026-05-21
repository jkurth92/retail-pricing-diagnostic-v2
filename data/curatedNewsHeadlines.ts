import type { NewsSummary } from "@/types/context-enrichment";

/** Curated headline context for known tickers when news API is unavailable. */
export const CURATED_NEWS_BY_TICKER: Record<string, NewsSummary[]> = {
  WMT: [
    {
      id: "wmt-1",
      headline: "Everyday low price messaging remains central to traffic strategy",
      source: "Curated reference",
      publishedAt: new Date().toISOString(),
      summary:
        "Visible value investment across consumables continues to anchor price image for mass trip missions.",
      relevanceTag: "value_perception",
      sourceType: "curated_reference",
    },
    {
      id: "wmt-2",
      headline: "Mix shift toward grocery and health & wellness influences margin narrative",
      source: "Curated reference",
      publishedAt: new Date().toISOString(),
      summary:
        "Category role structure may emphasize traffic drivers with thinner margin unless architecture separates tiers clearly.",
      relevanceTag: "margin",
      sourceType: "curated_reference",
    },
  ],
  TGT: [
    {
      id: "tgt-1",
      headline: "Owned-brand and style credibility support premiumization tension",
      source: "Curated reference",
      publishedAt: new Date().toISOString(),
      summary:
        "Architecture and visible value balance matter for seasonal categories and discretionary baskets.",
      relevanceTag: "pricing",
      sourceType: "curated_reference",
    },
  ],
  COST: [
    {
      id: "cost-1",
      headline: "Membership model limits promotional dependency",
      source: "Curated reference",
      publishedAt: new Date().toISOString(),
      summary:
        "Value perception is structural; architecture focuses on pack-size and treasure-hunt rotation.",
      relevanceTag: "value_perception",
      sourceType: "curated_reference",
    },
  ],
  KR: [
    {
      id: "kr-1",
      headline: "Multi-banner grocery portfolio complicates unified price image",
      source: "Curated reference",
      publishedAt: new Date().toISOString(),
      summary:
        "Banner-level posture may vary — diagnostic should clarify which banner lens applies.",
      relevanceTag: "strategic_initiative",
      sourceType: "curated_reference",
    },
  ],
};
