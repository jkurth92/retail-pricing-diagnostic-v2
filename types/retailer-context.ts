import type { CompanyProfile } from "@/types/company-profile";
import type {
  ContextEnrichmentStatus,
  EnrichmentMeta,
  NewsSummary,
} from "@/types/context-enrichment";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";

export type RetailerType =
  | "public_retailer"
  | "private_retailer"
  | "subsidiary_banner"
  | "unknown";

export type RetailerContext = {
  retailerName: string;
  retailerType: RetailerType;
  ticker: string | null;
  publicCompany: boolean;
  companyProfileStatus: ContextEnrichmentStatus;
  companyOverview: string | null;
  bannerPortfolio: string | null;
  geography: string | null;
  storeCount: string | null;
  revenue: string | null;
  marketCap: string | null;
  sector: string | null;
  subSector: string | null;
  notes: string[];
};

export type RetailerLookupResult = {
  normalizedName: string;
  ticker: string | null;
  publicCompany: boolean;
  retailerType: RetailerType;
  matchedAlias: string | null;
  confidence: "high" | "medium" | "low";
};

export type StrategicContextSuggestion = {
  suggestedArchetypeId: RetailerArchetypeId | null;
  suggestedPosture: PricingPosture | null;
  overviewNotes: string[];
  rationale: string[];
};

export type RetailerEnrichmentBundle = {
  context: RetailerContext;
  companyProfile: CompanyProfile | null;
  news: NewsSummary[];
  meta: EnrichmentMeta;
  lookup: RetailerLookupResult;
  suggestions: StrategicContextSuggestion;
  manualOverrides: Partial<RetailerContext>;
};

export type RetailerEnrichmentOverrides = Partial<RetailerContext> & {
  ticker?: string | null;
};
