/**
 * Directional lever contribution framing — presentation only, not additive sizing.
 */

import type { ExecutiveTheme } from "@/types/executive-theme";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";

export type LeverContributionRow = {
  id: string;
  label: string;
  sharePct: number;
};

const LEVER_ORDER = [
  "architecture",
  "kvi",
  "pl_nb",
  "promo",
  "zoning",
] as const;

const LEVER_LABELS: Record<(typeof LEVER_ORDER)[number], string> = {
  architecture: "Architecture",
  kvi: "KVI / value concentration",
  pl_nb: "PL/NB monetization",
  promo: "Promo",
  zoning: "Zoning",
};

function leverKeyFromFamily(family: string): (typeof LEVER_ORDER)[number] | null {
  if (family === "Architecture" || family === "Premiumization") return "architecture";
  if (family === "KVI" || family === "ValueCommunication") return "kvi";
  if (/promo/i.test(family)) return "promo";
  if (/markdown/i.test(family)) return "promo";
  return null;
}

function leverKeyFromDriverText(text: string): (typeof LEVER_ORDER)[number] | null {
  const t = text.toLowerCase();
  if (/architecture|premium|tier|spacing|compression/i.test(t)) return "architecture";
  if (/kvi|value concentration|visible value/i.test(t)) return "kvi";
  if (/pl\/nb|private-label|monetization separation/i.test(t)) return "pl_nb";
  if (/promo|markdown|discount/i.test(t)) return "promo";
  if (/zon/i.test(t)) return "zoning";
  return null;
}

/**
 * Weighted directional shares from theme envelopes and drivers (sums to 100).
 */
export function buildDirectionalLeverContributions(
  themes: ExecutiveTheme[],
  primaryDrivers: string[],
  evidence?: ComputedEvidenceBundle | null,
  promoMarkdownEligible = false,
): LeverContributionRow[] {
  const weights = new Map<string, number>();

  const add = (key: (typeof LEVER_ORDER)[number], w: number) => {
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

  if (evidence?.metrics.some((m) => m.family === "architecture")) {
    add("architecture", 0.25);
  }
  if (evidence?.metrics.some((m) => m.family === "kvi")) {
    add("kvi", 0.15);
  }

  if (!promoMarkdownEligible) {
    weights.delete("promo");
  }

  if (weights.size === 0) {
    add("architecture", 1);
    add("kvi", 0.4);
    add("pl_nb", 0.25);
  }

  const entries = LEVER_ORDER.filter((k) => (weights.get(k) ?? 0) > 0).map((k) => ({
    key: k,
    weight: weights.get(k) ?? 0,
  }));

  const total = entries.reduce((s, e) => s + e.weight, 0) || 1;
  let rows: LeverContributionRow[] = entries.map((e) => ({
    id: e.key,
    label: LEVER_LABELS[e.key],
    sharePct: Math.round((e.weight / total) * 100),
  }));

  const sum = rows.reduce((s, r) => s + r.sharePct, 0);
  if (rows.length > 0 && sum !== 100) {
    rows = rows.map((r, i) =>
      i === 0 ? { ...r, sharePct: r.sharePct + (100 - sum) } : r,
    );
  }

  return rows.sort((a, b) => b.sharePct - a.sharePct);
}
