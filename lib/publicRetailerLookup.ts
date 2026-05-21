import {
  PUBLIC_RETAILER_BY_TICKER,
  PUBLIC_RETAILER_REGISTRY,
  type PublicRetailerRecord,
} from "@/data/publicRetailerRegistry";
import { RETAILER_ALIAS_ENTRIES } from "@/data/retailerAliases";

export type PublicRetailerMatch = {
  ticker: string | null;
  publicCompany: boolean;
  record: PublicRetailerRecord | null;
};

const TICKER_PATTERN = /^[A-Z]{1,5}$/;

/** Normalize retailer names for alias and partial matching. */
export function normalizeRetailerQuery(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[.,]/g, " ")
    .replace(/\s+(inc|incorporated|corp|corporation|co|company|ltd|llc|plc)\.?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function recordForTicker(ticker: string): PublicRetailerRecord | null {
  return PUBLIC_RETAILER_BY_TICKER[ticker.toUpperCase()] ?? null;
}

function matchRegistryRecord(query: string): PublicRetailerRecord | null {
  const normalized = normalizeRetailerQuery(query);
  if (!normalized) return null;

  const upper = query.trim().toUpperCase();
  if (TICKER_PATTERN.test(upper) && recordForTicker(upper)) {
    return recordForTicker(upper)!;
  }

  for (const record of PUBLIC_RETAILER_REGISTRY) {
    if (record.companyName.toLowerCase() === normalized) return record;
    if (record.ticker.toLowerCase() === normalized) return record;
  }

  const aliasHits: { record: PublicRetailerRecord; alias: string }[] = [];
  for (const record of PUBLIC_RETAILER_REGISTRY) {
    for (const alias of record.aliases) {
      if (normalized === alias) return record;
      if (normalized.startsWith(`${alias} `) || normalized.endsWith(` ${alias}`)) {
        aliasHits.push({ record, alias });
      }
      if (alias.length >= 4 && normalized.includes(alias)) {
        aliasHits.push({ record, alias });
      }
    }
  }
  if (aliasHits.length > 0) {
    aliasHits.sort((a, b) => b.alias.length - a.alias.length);
    return aliasHits[0].record;
  }

  for (const record of PUBLIC_RETAILER_REGISTRY) {
    const root = normalizeRetailerQuery(record.companyName);
    const rootWord = root.split(" ")[0];
    if (
      root.includes(normalized) ||
      normalized.includes(root) ||
      (rootWord.length >= 4 && normalized.startsWith(rootWord))
    ) {
      return record;
    }
  }

  for (const entry of RETAILER_ALIAS_ENTRIES) {
    const hit = entry.aliases.find(
      (a) =>
        normalized === a ||
        normalized.startsWith(`${a} `) ||
        (a.length >= 3 && normalized.includes(a)),
    );
    if (hit) {
      if (entry.ticker) {
        const record = recordForTicker(entry.ticker);
        if (record) return record;
      }
      return null;
    }
  }

  return null;
}

export function resolvePublicRetailerMatch(query: string): PublicRetailerMatch {
  const trimmed = query.trim();
  if (!trimmed) {
    return { ticker: null, publicCompany: false, record: null };
  }

  const record = matchRegistryRecord(trimmed);
  if (record) {
    return { ticker: record.ticker, publicCompany: true, record };
  }

  const upper = trimmed.toUpperCase();
  if (TICKER_PATTERN.test(upper)) {
    for (const entry of RETAILER_ALIAS_ENTRIES) {
      if (entry.ticker === upper) {
        return {
          ticker: entry.ticker,
          publicCompany: entry.publicCompany,
          record: null,
        };
      }
    }
    return { ticker: upper, publicCompany: true, record: null };
  }

  for (const entry of RETAILER_ALIAS_ENTRIES) {
    const normalized = normalizeRetailerQuery(trimmed);
    const hit = entry.aliases.find(
      (a) =>
        normalized === a ||
        normalized.startsWith(`${a} `) ||
        (a.length >= 3 && normalized.includes(a)),
    );
    if (hit) {
      return {
        ticker: entry.ticker,
        publicCompany: entry.publicCompany,
        record: entry.ticker ? recordForTicker(entry.ticker) : null,
      };
    }
  }

  return { ticker: null, publicCompany: false, record: null };
}

export function resolvePublicRetailerTicker(query: string): string | null {
  return resolvePublicRetailerMatch(query).ticker;
}

export function getPublicRetailerRecord(
  ticker: string,
): PublicRetailerRecord | null {
  return recordForTicker(ticker);
}
