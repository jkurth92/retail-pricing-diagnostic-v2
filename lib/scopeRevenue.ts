import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

/** Parse numeric revenue from profile fields (USD). */
export function parseRevenueFromEnrichment(
  enrichment: RetailerEnrichmentBundle,
): number | null {
  const profile = enrichment.companyProfile;
  if (profile?.revenue != null && Number.isFinite(profile.revenue)) {
    return profile.revenue;
  }

  const display =
    profile?.revenueDisplay ?? enrichment.context.revenue ?? null;
  if (!display) return null;

  const normalized = display.replace(/,/g, "").toLowerCase();
  const match = normalized.match(/\$?\s*([\d.]+)\s*([bmk])?/i);
  if (!match) return null;

  let value = Number(match[1]);
  if (!Number.isFinite(value)) return null;

  const unit = match[2]?.toLowerCase();
  if (unit === "b") value *= 1e9;
  else if (unit === "m") value *= 1e6;
  else if (unit === "k") value *= 1e3;
  else if (value < 1_000_000 && normalized.includes("b")) value *= 1e9;

  return value;
}

export function formatRevenueInputValue(value: number): string {
  return String(Math.round(value));
}

export const DEFAULT_ADDRESSABLE_PERCENT = "65";
