import type { ContextEnrichmentSource } from "@/types/context-enrichment";

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
  lastUpdated: string;
  source: ContextEnrichmentSource;
};
