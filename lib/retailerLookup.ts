import { RETAILER_ALIAS_ENTRIES } from "@/data/retailerAliases";
import {
  normalizeRetailerQuery,
  resolvePublicRetailerMatch,
} from "@/lib/publicRetailerLookup";
import type { RetailerLookupResult } from "@/types/retailer-context";

function aliasMatchesQuery(normalizedName: string, alias: string): boolean {
  const aliasNorm = normalizeRetailerQuery(alias);
  if (!aliasNorm) return false;
  if (normalizedName === aliasNorm) return true;
  if (normalizedName.startsWith(`${aliasNorm} `)) return true;
  if (aliasNorm.length >= 4 && normalizedName.includes(aliasNorm)) return true;
  return false;
}

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

  const publicMatch = resolvePublicRetailerMatch(retailerName);
  if (publicMatch.ticker) {
    const record = publicMatch.record;
    const matchedAlias =
      record?.aliases.find((a) => aliasMatchesQuery(normalizedName, a)) ??
      (record ? record.companyName : null);
    return {
      normalizedName: retailerName.trim(),
      ticker: publicMatch.ticker,
      publicCompany: publicMatch.publicCompany,
      retailerType: publicMatch.publicCompany ? "public_retailer" : "private_retailer",
      matchedAlias: matchedAlias ?? "registry",
      confidence: matchedAlias && aliasMatchesQuery(normalizedName, matchedAlias)
        ? "high"
        : "medium",
    };
  }

  for (const entry of RETAILER_ALIAS_ENTRIES) {
    const hit = entry.aliases.find((a) => aliasMatchesQuery(normalizedName, a));
    if (hit) {
      const aliasNorm = normalizeRetailerQuery(hit);
      return {
        normalizedName: retailerName.trim(),
        ticker: entry.ticker,
        publicCompany: entry.publicCompany,
        retailerType: entry.retailerType,
        matchedAlias: hit,
        confidence: normalizedName === aliasNorm ? "high" : "medium",
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
    if (entry.aliases.some((a) => aliasMatchesQuery(normalizedName, a))) {
      return {
        bannerPortfolio: entry.bannerPortfolio ?? null,
        geography: entry.geography ?? null,
        notes: entry.notes ? [entry.notes] : [],
      };
    }
  }
  return { bannerPortfolio: null, geography: null, notes: [] };
}
