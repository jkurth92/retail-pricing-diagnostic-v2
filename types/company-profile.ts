import type { ContextEnrichmentSource } from "@/types/context-enrichment";

/** Directional performance context for peer comparison — not used in diagnostics. */
export type PerformanceTrajectory = {
  revenueGrowthPct: number | null;
  ebitdaGrowthPct: number | null;
  grossMarginChangeBps: number | null;
  operatingMarginChangeBps: number | null;
  ebitdaMarginChangeBps: number | null;
};

export type CompanyProfile = {
  ticker: string;
  companyName: string;
  exchange: string | null;
  marketCap: number | null;
  marketCapDisplay: string | null;
  revenue: number | null;
  revenueDisplay: string | null;
  ebitda: number | null;
  ebitdaDisplay: string | null;
  storeCount: number | null;
  storeCountDisplay: string | null;
  headquarters: string | null;
  country: string | null;
  sector: string | null;
  industry: string | null;
  description: string | null;
  operatingMarginDisplay?: string | null;
  grossMarginDisplay?: string | null;
  profileUrl?: string | null;
  trajectory: PerformanceTrajectory;
  lastUpdated: string;
  source: ContextEnrichmentSource;
};
