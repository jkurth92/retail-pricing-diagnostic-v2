import { CURATED_COMPANY_PROFILES } from "@/data/curatedCompanyProfiles";
import type { CompanyProfile, PerformanceTrajectory } from "@/types/company-profile";

const EMPTY_TRAJECTORY: PerformanceTrajectory = {
  revenueGrowthPct: null,
  ebitdaGrowthPct: null,
  grossMarginChangeBps: null,
  operatingMarginChangeBps: null,
  ebitdaMarginChangeBps: null,
};

/** Attach directional metrics from curated data when API profile lacks them. */
export function enrichProfileWithCuratedContext(
  profile: CompanyProfile,
): CompanyProfile {
  const curated = CURATED_COMPANY_PROFILES[profile.ticker];
  if (!curated) {
    return { ...profile, trajectory: profile.trajectory ?? EMPTY_TRAJECTORY };
  }
  return {
    ...profile,
    trajectory: curated.trajectory,
    revenueDisplay: profile.revenueDisplay ?? curated.revenueDisplay,
    ebitdaDisplay: profile.ebitdaDisplay ?? curated.ebitdaDisplay,
    grossMarginDisplay: profile.grossMarginDisplay ?? curated.grossMarginDisplay,
    operatingMarginDisplay:
      profile.operatingMarginDisplay ?? curated.operatingMarginDisplay,
    sector: profile.sector ?? curated.sector,
    description: profile.description ?? curated.description,
    storeCountDisplay: profile.storeCountDisplay ?? curated.storeCountDisplay,
  };
}
