import { CURATED_COMPANY_PROFILES } from "@/data/curatedCompanyProfiles";
import {
  getPublicRetailerRecord,
  resolvePublicRetailerMatch,
  resolvePublicRetailerTicker,
} from "@/lib/publicRetailerLookup";
import { refreshFinancePeerResolution } from "@/lib/financePeerResolution";
import type { FinancePeer } from "@/types/finance-peers";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

let peerIdCounter = 0;

function nextPeerId(): string {
  peerIdCounter += 1;
  return `finance-peer-${peerIdCounter}`;
}

const SUGGESTED_PEERS_BY_TICKER: Record<string, string[]> = {
  TGT: ["WMT", "KR", "COST", "BBY"],
  WMT: ["TGT", "KR", "COST"],
  KR: ["WMT", "TGT", "COST"],
  COST: ["WMT", "KR", "TGT"],
  BBY: ["TGT", "WMT", "COST"],
  AMZN: ["WMT", "TGT", "COST"],
  DG: ["WMT", "DLTR", "KR"],
  DLTR: ["DG", "WMT", "KR"],
};

const SUGGESTED_PEERS_BY_SECTOR: Record<string, string[]> = {
  "Consumer Staples": ["WMT", "KR", "COST"],
  "Consumer Discretionary": ["TGT", "WMT", "BBY"],
};

function peerFromTicker(ticker: string, source: FinancePeer["source"]): FinancePeer {
  const record =
    getPublicRetailerRecord(ticker) ??
    (CURATED_COMPANY_PROFILES[ticker]
      ? {
          ticker,
          companyName: CURATED_COMPANY_PROFILES[ticker].companyName,
        }
      : null);
  return {
    id: nextPeerId(),
    name: record?.companyName ?? ticker,
    ticker,
    source,
    included: true,
  };
}

export function suggestFinancePeers(
  enrichment: RetailerEnrichmentBundle,
): FinancePeer[] {
  const subjectTicker = enrichment.context.ticker?.toUpperCase() ?? null;
  const sector = enrichment.context.sector ?? enrichment.companyProfile?.sector;

  const tickers = new Set<string>();

  if (subjectTicker && SUGGESTED_PEERS_BY_TICKER[subjectTicker]) {
    SUGGESTED_PEERS_BY_TICKER[subjectTicker].forEach((t) => tickers.add(t));
  }
  if (sector && SUGGESTED_PEERS_BY_SECTOR[sector]) {
    SUGGESTED_PEERS_BY_SECTOR[sector].forEach((t) => tickers.add(t));
  }
  if (tickers.size === 0) {
    ["WMT", "TGT", "KR", "COST"]
      .filter((t) => t !== subjectTicker)
      .forEach((t) => tickers.add(t));
  }
  if (subjectTicker) tickers.delete(subjectTicker);

  return refreshFinancePeerResolution(
    Array.from(tickers)
      .slice(0, 5)
      .map((t) => peerFromTicker(t, "suggested")),
  );
}

export function lookupTickerByName(name: string): string | null {
  return resolvePublicRetailerTicker(name);
}

export function createUserFinancePeer(name: string): FinancePeer {
  const trimmed = name.trim();
  const match = resolvePublicRetailerMatch(trimmed);
  const record =
    match.record ??
    (match.ticker ? getPublicRetailerRecord(match.ticker) : null);
  return {
    id: nextPeerId(),
    name: record?.companyName ?? trimmed,
    ticker: match.ticker,
    source: "user_added",
    included: true,
  };
}
