import { RETAILER_ALIAS_ENTRIES } from "@/data/retailerAliases";
import { normalizeRetailerQuery } from "@/lib/publicRetailerLookup";
import type { RetailerLookupResult } from "@/types/retailer-context";

export function resolveRetailerLookup(
  retailerName: string,
  manualTicker?: string | null,
): RetailerLookupResult {
  const normalizedName = normalizeRetailerQuery(retailerName);

  if (manualTicker?.trim()) {
    const ticker = manualTicker.trim().toUpperCase();
    return {
      normalizedName: retailerName.trim() || normalizedName,
      ticker,
      publicCompany: true,
      retailerType: "public_retailer",
      matchedAlias: "manual_ticker",
      confidence: "high",
    };
  }

  if (!normalizedName) {
    return {
      normalizedName: "",
      ticker: null,
      publicCompany: false,
      retailerType: "unknown",
      matchedAlias: null,
      confidence: "low",
    };
  }

  for (const entry of RETAILER_ALIAS_ENTRIES) {
    const hit = entry.aliases.find((a) => {
      const aliasNorm = normalizeRetailerQuery(a);
      return (
        normalizedName === aliasNorm ||
        normalizedName.startsWith(`${aliasNorm} `) ||
        (aliasNorm.length >= 3 && normalizedName.includes(aliasNorm))
      );
    });
    if (hit) {
      return {
        normalizedName: retailerName.trim(),
        ticker: entry.ticker,
        publicCompany: entry.publicCompany,
        retailerType: entry.retailerType,
        matchedAlias: hit,
        confidence: normalizedName === hit ? "high" : "medium",
      };
    }
  }

  return {
    normalizedName: retailerName.trim(),
    ticker: null,
    publicCompany: false,
    retailerType: "private_retailer",
    matchedAlias: null,
    confidence: "low",
  };
}

export function lookupBannerHints(retailerName: string): {
  bannerPortfolio: string | null;
  geography: string | null;
  notes: string[];
} {
  const normalizedName = normalizeRetailerQuery(retailerName);
  for (const entry of RETAILER_ALIAS_ENTRIES) {
    if (entry.aliases.some((a) => normalizedName.includes(a))) {
      return {
        bannerPortfolio: entry.bannerPortfolio ?? null,
        geography: entry.geography ?? null,
        notes: entry.notes ? [entry.notes] : [],
      };
    }
  }
  return { bannerPortfolio: null, geography: null, notes: [] };
}
