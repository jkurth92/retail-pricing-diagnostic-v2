/**
 * Structured opportunity-driver synthesis — presentation only.
 * Does not alter opportunity sizing, benchmarks, or evidence weighting.
 */

import { assessOpportunityFootprint } from "@/lib/executiveBusinessLanguage";
import { rankOpportunityLevers } from "@/lib/opportunityLeverAttribution";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { EvidenceIllustrationMetricKey } from "@/types/evidence-illustrations";
import type { ExecutiveSummary } from "@/types/executive-summary";
import type { ExecutiveTheme } from "@/types/executive-theme";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { RefinementEmphasis } from "@/types/refinement";

export type PricingOpportunityDriver = {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  implication: string;
};

export type OpportunityDriverSynthesis = {
  driverCount: number;
  drivers: PricingOpportunityDriver[];
  introLine: string;
  conclusion: string;
  marginLine: string;
};

export type BuildOpportunityDriverSynthesisInput = {
  exec: ExecutiveSummary;
  exposure?: OpportunityExposureBundle | null;
  themes?: ExecutiveTheme[];
  evidence?: ComputedEvidenceBundle | null;
  promoMarkdownEligible?: boolean;
  opportunityRange?: string | null;
  /** Optional consultant refinement — presentation ordering only */
  refinementEmphasis?: RefinementEmphasis | null;
};

type DriverKind =
  | "value_breadth"
  | "premium_gap"
  | "entry_gap"
  | "store_brand_gap"
  | "price_level_clarity";

const DRIVER_DEFS: Record<
  DriverKind,
  { title: string; explanation: string; implication: string }
> = {
  value_breadth: {
    title: "Value is being spread across too many products",
    explanation:
      "Lower prices are applied across a wide share of the assortment instead of being focused on a short list of items that define how the store is seen on price.",
    implication:
      "The retailer may be funding low prices too broadly instead of concentrating them where they matter most for margin and competitiveness.",
  },
  premium_gap: {
    title: "Premium products may not stand far enough apart from mainstream products",
    explanation:
      "The price step from everyday items to premium items may be too small for customers to see a clear reason to pay more.",
    implication:
      "Customers may not trade up as much as the assortment allows, which limits margin capture on premium lines.",
  },
  entry_gap: {
    title: "Entry-price items may not be low enough to clearly signal affordability",
    explanation:
      "Budget items may sit too close in price to mainstream items, so the store may not send a strong low-price message.",
    implication:
      "The business may miss chances to win price-sensitive trips without giving up margin on the full assortment.",
  },
  store_brand_gap: {
    title: "Store brands may be priced too close to well-known brands",
    explanation:
      "Owned-brand products may not be far enough below national brands for customers to see a clear reason to switch.",
    implication:
      "The retailer may give up margin on both sides without gaining a clear price or quality advantage.",
  },
  price_level_clarity: {
    title: "Budget, mainstream, and premium options may blur together",
    explanation:
      "Price gaps between lower-priced, mid-priced, and premium items may be too small across several categories.",
    implication:
      "The assortment may not tell a simple good-better-best story, which makes it harder to manage margin by price level.",
  },
};

function parseCategoriesFromMetricValue(value: string): string[] {
  const cleaned = value
    .replace(/^observed in\s*/i, "")
    .replace(/\s*\(\+\d+ more\)/i, "")
    .replace(/…/g, "");
  return cleaned
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && !/^\d/.test(s));
}

function examplesFromExposure(
  exposure: OpportunityExposureBundle | null | undefined,
  predicate: (c: OpportunityExposureBundle["categoryExposures"][0]) => boolean,
  fallback: string[],
  max = 3,
): string[] {
  const cats =
    exposure?.categoryExposures.filter(predicate).map((c) => c.category) ?? [];
  if (cats.length > 0) return [...new Set(cats)].slice(0, max);
  return fallback.slice(0, max);
}

function examplesFromIllustrations(
  evidence: ComputedEvidenceBundle | null | undefined,
  metricIds: EvidenceIllustrationMetricKey[],
  fallback: string[],
  max = 3,
): string[] {
  for (const id of metricIds) {
    const rows = evidence?.illustrations?.byMetricId[id];
    if (rows?.length) {
      return [...new Set(rows.map((r) => r.category))].slice(0, max);
    }
  }
  return fallback.slice(0, max);
}

function mergeExamples(...lists: string[][]): string[] {
  return [...new Set(lists.flat())].slice(0, 3);
}

function metricStrength(
  evidence: ComputedEvidenceBundle | null | undefined,
  id: string,
): number {
  const m = evidence?.metrics.find((x) => x.id === id);
  if (!m) return 0;
  if (m.strength === "strong") return 3;
  if (m.strength === "moderate") return 2;
  return 1;
}

function buildCandidateDrivers(
  input: BuildOpportunityDriverSynthesisInput,
): { kind: DriverKind; score: number; examples: string[] }[] {
  const { exec, exposure, evidence } = input;
  const footprint = assessOpportunityFootprint(exposure, exec);
  const candidates: { kind: DriverKind; score: number; examples: string[] }[] = [];

  const kviMetric = evidence?.metrics.find((m) => m.id === "kvi_category_concentration");
  const kviShare = evidence?.metrics.find((m) => m.id === "kvi_revenue_share");
  if (kviMetric || kviShare || footprint.elevatedKviCategories.length > 0) {
    const fromMetric = kviMetric ? parseCategoriesFromMetricValue(kviMetric.value) : [];
    const examples = mergeExamples(
      fromMetric.length > 0 ? fromMetric : footprint.elevatedKviCategories,
      examplesFromIllustrations(evidence, ["kvi_category_concentration", "kvi_revenue_share"], []),
    );
    candidates.push({
      kind: "value_breadth",
      score:
        metricStrength(evidence, "kvi_category_concentration") +
        metricStrength(evidence, "kvi_revenue_share") +
        (footprint.elevatedKviCategories.length >= 3 ? 2 : 1),
      examples:
        examples.length > 0
          ? examples
          : examplesFromExposure(exposure, (c) => c.kviElevated, ["Household essentials", "Pet"]),
    });
  }

  const archCompression = evidence?.metrics.find((m) => m.id === "architecture_compression");
  const premiumGap = metricStrength(evidence, "premium_mainstream_gap");
  if (premiumGap > 0 || archCompression || footprint.compressionCategories.length > 0) {
    const fromMetric = archCompression
      ? parseCategoriesFromMetricValue(archCompression.value)
      : [];
    const examples = mergeExamples(
      fromMetric.length > 0 ? fromMetric : footprint.compressionCategories,
      examplesFromIllustrations(evidence, ["architecture_compression", "premium_mainstream_gap"], []),
      examplesFromExposure(exposure, (c) => c.architectureCompression, ["Beauty", "Household essentials"]),
    );
    candidates.push({
      kind: "premium_gap",
      score: premiumGap + (archCompression ? 2 : 0) + footprint.compressionCategories.length,
      examples,
    });
  }

  const entryScore = metricStrength(evidence, "entry_mainstream_gap");
  if (entryScore > 0) {
    const entryCats = mergeExamples(
      examplesFromIllustrations(evidence, ["entry_mainstream_gap"], []),
      examplesFromExposure(
        exposure,
        (c) => c.architectureCompression,
        footprint.compressionCategories.length
          ? footprint.compressionCategories
          : ["Home decor", "Household essentials"],
      ),
    );
    candidates.push({
      kind: "entry_gap",
      score: entryScore + 1,
      examples: entryCats,
    });
  }

  const plScore = metricStrength(evidence, "pl_nb_gap");
  if (plScore > 0 || footprint.plNbCategories.length > 0) {
    candidates.push({
      kind: "store_brand_gap",
      score: plScore + footprint.plNbCategories.length,
      examples: mergeExamples(
        footprint.plNbCategories,
        examplesFromIllustrations(evidence, ["pl_nb_gap"], []),
        examplesFromExposure(exposure, (c) => c.plNbNarrow, ["Household essentials", "Grocery"]),
      ),
    });
  }

  const tierScore = metricStrength(evidence, "tier_spacing");
  if (tierScore > 0 && premiumGap === 0 && entryScore === 0) {
    candidates.push({
      kind: "price_level_clarity",
      score: tierScore,
      examples: mergeExamples(
        footprint.compressionCategories,
        examplesFromExposure(exposure, (c) => c.architectureCompression, [
          "Grocery",
          "Household essentials",
        ]),
      ),
    });
  }

  if (candidates.length === 0) {
    const ranked = rankOpportunityLevers(
      input.themes ?? exec.topThemes,
      exec.primaryDrivers,
      evidence,
      input.promoMarkdownEligible ?? false,
    );
    const primary = ranked[0] ?? "architecture";
    const map: Record<string, DriverKind> = {
      architecture: "price_level_clarity",
      kvi: "value_breadth",
      pl_nb: "store_brand_gap",
      promo: "value_breadth",
      zoning: "price_level_clarity",
    };
    const kind = map[primary] ?? "price_level_clarity";
    candidates.push({
      kind,
      score: 2,
      examples: footprint.compressionCategories.length
        ? footprint.compressionCategories.slice(0, 3)
        : ["Key in-scope categories"],
    });
  }

  const byKind = new Map<DriverKind, { kind: DriverKind; score: number; examples: string[] }>();
  for (const c of candidates) {
    const prev = byKind.get(c.kind);
    if (!prev || c.score > prev.score) byKind.set(c.kind, c);
  }

  const ranked = [...byKind.values()].sort((a, b) => b.score - a.score);
  const emphasis = input.refinementEmphasis;
  if (!emphasis) return ranked;

  const kindBoost: Record<DriverKind, number> = {
    value_breadth: emphasis.kviWeight - emphasis.promoWeight * 0.25,
    premium_gap: emphasis.premiumizationWeight + emphasis.architectureWeight,
    entry_gap: emphasis.architectureWeight,
    store_brand_gap: emphasis.plNbWeight,
    price_level_clarity: emphasis.architectureWeight,
  };

  return ranked
    .map((c) => ({
      ...c,
      score: c.score + (kindBoost[c.kind] ?? 0) * 2,
    }))
    .sort((a, b) => b.score - a.score);
}

export function buildOpportunityDriverSynthesis(
  input: BuildOpportunityDriverSynthesisInput,
): OpportunityDriverSynthesis {
  const top = buildCandidateDrivers(input).slice(0, 3);
  const drivers: PricingOpportunityDriver[] = top.map((c) => {
    const def = DRIVER_DEFS[c.kind];
    return {
      id: c.kind,
      title: def.title,
      explanation: def.explanation,
      examples: c.examples.length > 0 ? c.examples : ["In-scope categories"],
      implication: def.implication,
    };
  });

  const n = drivers.length;
  const range = input.opportunityRange?.trim();
  const introLine = range
    ? `The pricing opportunity (${range}) appears to be driven by ${n} factor${n === 1 ? "" : "s"}:`
    : `The pricing opportunity appears to be driven by ${n} factor${n === 1 ? "" : "s"}:`;

  const conclusion =
    n >= 2
      ? "Taken together, these patterns point to a mix of where prices are set and how clearly the assortment separates budget, mainstream, and premium options — not a single-item fix."
      : "This pattern is material enough to discuss with leadership even if it shows up in only one part of the assortment.";

  const marginLine =
    "For margin and pricing execution, the near-term focus is to concentrate low-price investment, widen the right price gaps between levels, and avoid funding deals where they do not change how customers judge the store.";

  return {
    driverCount: n,
    drivers,
    introLine,
    conclusion,
    marginLine,
  };
}

export function formatOpportunityDriversBlock(
  synthesis: OpportunityDriverSynthesis,
): string {
  const lines: string[] = [synthesis.introLine, ""];

  synthesis.drivers.forEach((d, i) => {
    lines.push(`${i + 1}. ${d.title}`);
    lines.push(`   ${d.explanation}`);
    lines.push(`   Examples: ${d.examples.join(", ")}`);
    lines.push(`   Implication: ${d.implication}`);
    lines.push("");
  });

  lines.push(synthesis.conclusion);
  lines.push("");
  lines.push(synthesis.marginLine);

  return lines.join("\n").trim();
}

const MEMO_ORDINALS = ["The first", "The second", "The third", "The fourth"] as const;

/** Narrative memo body: “The opportunity appears to be driven by three factors… The first is…” */
export function formatOpportunityDriversMemo(
  synthesis: OpportunityDriverSynthesis,
): string {
  const paragraphs: string[] = [];

  const opener = synthesis.introLine.replace(
    /^The pricing opportunity/i,
    "The opportunity",
  );
  paragraphs.push(opener);

  synthesis.drivers.forEach((d, i) => {
    const lead = MEMO_ORDINALS[i] ?? `Factor ${i + 1}`;
    const title =
      d.title.charAt(0).toLowerCase() + d.title.slice(1);
    const implication = d.implication.endsWith(".")
      ? d.implication.slice(0, -1)
      : d.implication;
    paragraphs.push(
      `${lead} is that ${title}. ${d.explanation} Examples include ${d.examples.join(", ")}. This implies ${implication.charAt(0).toLowerCase()}${implication.slice(1)}.`,
    );
  });

  return paragraphs.join("\n\n");
}
