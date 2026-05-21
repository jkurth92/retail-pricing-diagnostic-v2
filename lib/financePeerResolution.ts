import {
  getPublicRetailerRecord,
  resolvePublicRetailerMatch,
  resolvePublicRetailerTicker,
} from "@/lib/publicRetailerLookup";
import type { PerformanceTrajectory } from "@/types/company-profile";
import type { FinancePeer } from "@/types/finance-peers";

export const PEER_EXCLUDED_TOOLTIP =
  "This retailer could not be matched to a public company profile and is excluded from comparison metrics.";

function trajectoryHasMetrics(trajectory: PerformanceTrajectory): boolean {
  return (
    trajectory.revenueGrowthPct != null ||
    trajectory.ebitdaGrowthPct != null ||
    trajectory.grossMarginChangeBps != null ||
    trajectory.operatingMarginChangeBps != null ||
    trajectory.ebitdaMarginChangeBps != null
  );
}

export function resolvePeerMatch(peer: FinancePeer) {
  return resolvePublicRetailerMatch(peer.ticker ?? peer.name);
}

export function resolvePeerTicker(peer: FinancePeer): string | null {
  return resolvePeerMatch(peer).ticker;
}

export function peerContributesToComparison(peer: FinancePeer): boolean {
  const { record } = resolvePeerMatch(peer);
  if (!record?.trajectory) return false;
  return trajectoryHasMetrics(record.trajectory);
}

export function getPeerUnresolvedLabel(
  peer: FinancePeer,
): "Retailer not found" | "No public profile found" | null {
  if (peerContributesToComparison(peer)) return null;
  const match = resolvePeerMatch(peer);
  if (!match.ticker && !match.publicCompany) return "Retailer not found";
  return "No public profile found";
}

export function summarizeFinancePeers(peers: FinancePeer[]) {
  const included = peers.filter((p) => p.included);
  const contributing = included.filter(peerContributesToComparison);
  const excludedIncluded = included.filter((p) => !peerContributesToComparison(p));
  return {
    includedCount: included.length,
    contributingCount: contributing.length,
    excludedIncluded,
    excludedCount: excludedIncluded.length,
  };
}

export function trajectoryForComparablePeer(
  peer: FinancePeer,
): PerformanceTrajectory | null {
  if (!peerContributesToComparison(peer)) return null;
  const ticker = resolvePeerTicker(peer);
  if (!ticker) return null;
  return getPublicRetailerRecord(ticker)?.trajectory ?? null;
}

/** Re-resolve tickers and display names when lookup improves. */
export function refreshFinancePeerResolution(peers: FinancePeer[]): FinancePeer[] {
  return peers.map((peer) => {
    const match = resolvePublicRetailerMatch(peer.name);
    const ticker = match.ticker ?? (peer.ticker ? resolvePublicRetailerTicker(peer.ticker) : null);
    const record = ticker ? getPublicRetailerRecord(ticker) : match.record;
    return {
      ...peer,
      ticker,
      name: record?.companyName ?? peer.name,
    };
  });
}
