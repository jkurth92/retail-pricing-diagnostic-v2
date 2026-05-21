export type ContextEnrichmentStatus =
  | "unavailable"
  | "partial"
  | "available"
  | "stale";

export type ContextEnrichmentSource =
  | "manual_input"
  | "api_profile"
  | "api_news"
  | "uploaded_document"
  | "inferred_context"
  | "curated_reference";

export type RelevanceTag =
  | "pricing"
  | "margin"
  | "traffic"
  | "value_perception"
  | "strategic_initiative"
  | "earnings"
  | "inflation"
  | "expansion"
  | "turnaround";

export type NewsSummary = {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  summary: string;
  relevanceTag: RelevanceTag;
  sourceType: ContextEnrichmentSource;
};

export type EnrichmentMeta = {
  profileStatus: ContextEnrichmentStatus;
  newsStatus: ContextEnrichmentStatus;
  profileSource: ContextEnrichmentSource;
  newsSource: ContextEnrichmentSource;
  lastFetchedAt: string | null;
  freshnessLabel: string;
  errorMessage: string | null;
};
