/**
 * Directional opportunity-area framing — presentation only, not additive sizing.
 */

import {
  assessOpportunityFootprint,
  type OpportunityFootprint,
} from "@/lib/executiveBusinessLanguage";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { ExecutiveTheme } from "@/types/executive-theme";

export type OpportunityAreaTier = "primary" | "secondary" | "supporting";

export type OpportunityAreaRow = {
  id: string;
  tier: OpportunityAreaTier;
  tierLabel: string;
  description: string;
};

const LEVER_ORDER = [
  "architecture",
  "kvi",
  "pl_nb",
  "promo",
  "zoning",
] as const;

type LeverKey = (typeof LEVER_ORDER)[number];

function leverKeyFromFamily(family: string): LeverKey | null {
  if (family === "Architecture" || family === "Premiumization") return "architecture";
  if (family === "KVI" || family === "ValueCommunication") return "kvi";
  if (/promo|markdown/i.test(family)) return "promo";
  return null;
}

function leverKeyFromDriverText(text: string): LeverKey | null {
  const t = text.toLowerCase();
  if (/architecture|premium|tier|spacing|compression/i.test(t)) return "architecture";
  if (/kvi|value concentration|visible value/i.test(t)) return "kvi";
  if (/pl\/nb|private-label|monetization/i.test(t)) return "pl_nb";
  if (/promo|markdown|discount/i.test(t)) return "promo";
  if (/zon/i.test(t)) return "zoning";
  return null;
}

function rankLevers(
  themes: ExecutiveTheme[],
  primaryDrivers: string[],
  evidence?: ComputedEvidenceBundle | null,
  promoMarkdownEligible = false,
): LeverKey[] {
  const weights = new Map<LeverKey, number>();

  const add = (key: LeverKey, w: number) => {
    weights.set(key, (weights.get(key) ?? 0) + w);
  };

  for (const theme of themes) {
    const key = leverKeyFromFamily(theme.themeFamily);
    if (!key) continue;
    const span = Math.max(
      0.2,
      theme.marginOpportunityHighPct - theme.marginOpportunityLowPct,
    );
    add(key, span + (theme.strategicImportance === "primary" ? 0.35 : 0.15));
  }

  for (const d of primaryDrivers) {
    if (typeof d !== "string") continue;
    const key = leverKeyFromDriverText(d);
    if (key) add(key, 0.45);
  }

  if (evidence?.metrics.some((m) => m.family === "architecture")) add("architecture", 0.25);
  if (evidence?.metrics.some((m) => m.family === "kvi")) add("kvi", 0.15);

  if (!promoMarkdownEligible) weights.delete("promo");

  if (weights.size === 0) {
    add("architecture", 1);
    add("kvi", 0.4);
  }

  return [...weights.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
}

function describeArchitectureArea(footprint: OpportunityFootprint): string {
  const cats = footprint.compressionCategories;
  if (cats.length >= 2) {
    return `Architecture compression in ${cats.slice(0, 3).join(", ")}`;
  }
  if (cats.length === 1) {
    return `Architecture compression in ${cats[0]}`;
  }
  if (footprint.mode === "portfolio_thematic") {
    return "Architecture opportunity appears thematic rather than category-specific";
  }
  return "Moderate premium spacing compression";
}

function describeKviArea(footprint: OpportunityFootprint): string {
  if (footprint.mode === "portfolio_thematic") {
    return "Visible value investment appears broadly distributed across the portfolio";
  }
  if (footprint.elevatedKviCategories.length >= 2) {
    return `Selective visible value investment in ${footprint.elevatedKviCategories.slice(0, 2).join(" and ")}`;
  }
  return "Selective visible value concentration";
}

function describePlNbArea(footprint: OpportunityFootprint): string {
  const narrow = footprint.plNbCategories;
  if (narrow.length >= 2) {
    return `Monetization separation opportunity in ${narrow.slice(0, 2).join(" and ")}`;
  }
  if (narrow.length === 1) {
    return `Monetization separation opportunity in ${narrow[0]}`;
  }
  return "Supporting monetization separation opportunity";
}

function describeLever(
  key: LeverKey,
  footprint: OpportunityFootprint,
): string {
  switch (key) {
    case "architecture":
      return describeArchitectureArea(footprint);
    case "kvi":
      return describeKviArea(footprint);
    case "pl_nb":
      return describePlNbArea(footprint);
    case "promo":
      return "Promotional intensity as a secondary discussion area";
    case "zoning":
      return "Zone-level price consistency as a supporting factor";
    default:
      return "Supporting structural opportunity";
  }
}

const TIER_LABELS: Record<OpportunityAreaTier, string> = {
  primary: "Primary opportunity area",
  secondary: "Secondary opportunity area",
  supporting: "Supporting factors",
};

/** Ranked opportunity areas without percentage allocations. */
export function buildOpportunityAreaBreakdown(
  exec: ExecutiveSummary,
  exposure: OpportunityExposureBundle | null | undefined,
  themes: ExecutiveTheme[],
  primaryDrivers: string[],
  evidence?: ComputedEvidenceBundle | null,
  promoMarkdownEligible = false,
): OpportunityAreaRow[] {
  const footprint = assessOpportunityFootprint(exposure, exec);
  const ranked = rankLevers(themes, primaryDrivers, evidence, promoMarkdownEligible);
  if (ranked.length === 0) return [];

  const rows: OpportunityAreaRow[] = [];
  const primary = ranked[0];
  rows.push({
    id: primary,
    tier: "primary",
    tierLabel: TIER_LABELS.primary,
    description: describeLever(primary, footprint),
  });

  if (ranked[1]) {
    rows.push({
      id: ranked[1],
      tier: "secondary",
      tierLabel: TIER_LABELS.secondary,
      description: describeLever(ranked[1], footprint),
    });
  }

  for (const key of ranked.slice(2, 4)) {
    rows.push({
      id: key,
      tier: "supporting",
      tierLabel: TIER_LABELS.supporting,
      description: describeLever(key, footprint),
    });
  }

  return rows;
}

/** @deprecated Use buildOpportunityAreaBreakdown — internal ranking only. */
export type LeverContributionRow = { id: string; label: string; sharePct: number };

export function buildDirectionalLeverContributions(
  themes: ExecutiveTheme[],
  primaryDrivers: string[],
  evidence?: ComputedEvidenceBundle | null,
  promoMarkdownEligible = false,
): LeverContributionRow[] {
  const ranked = rankLevers(themes, primaryDrivers, evidence, promoMarkdownEligible);
  return ranked.map((id, i) => ({
    id,
    label: id,
    sharePct: Math.max(100 - i * 25, 10),
  }));
}
