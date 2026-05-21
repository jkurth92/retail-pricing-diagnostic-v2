import { pickPortfolioElasticityChannel } from "@/data/elasticityReference";
import { computeArchitectureSignals } from "@/lib/architectureSignals";
import {
  computeCategoryExposures,
  weightedElasticitySensitivity,
} from "@/lib/categoryExposure";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import { computeKviSignals } from "@/lib/kviSignals";
import {
  synthesizePricingRows,
  type PricingRowSynthesisInput,
} from "@/lib/pricingRowSynthesis";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { InferredCategoryRow } from "@/types/category-scope";
import type { ThemeExposureContext } from "@/types/opportunity-exposure";

const ENGINE_VERSION = "14a.0.0";

function sumRevenuePct(
  exposures: OpportunityExposureBundle["categoryExposures"],
  pred: (c: (typeof exposures)[0]) => boolean,
): number {
  return exposures.filter(pred).reduce((s, c) => s + c.revenueWeightPct, 0);
}

function buildExposureSummaries(
  bundle: Omit<
    OpportunityExposureBundle,
    "exposureSummaries" | "causalFramingLines"
  >,
): { summaries: string[]; causal: string[] } {
  const summaries: string[] = [];
  const causal: string[] = [];

  const archCats = bundle.categoryExposures
    .filter((c) => c.architectureCompression)
    .map((c) => c.category);
  if (archCats.length > 0 && bundle.architectureAffectedRevenuePct > 0) {
    summaries.push(
      `Traffic-driving categories account for most observed architecture compression (${archCats.slice(0, 2).join(", ")}).`,
    );
    causal.push(
      `Premium/Mainstream gap materially below expected range in categories representing ${bundle.architectureAffectedRevenuePct}% of in-scope revenue.`,
    );
  }

  const plCats = bundle.categoryExposures
    .filter((c) => c.plNbNarrow)
    .map((c) => c.category);
  if (plCats.length > 0 && bundle.plNbAffectedRevenuePct > 0) {
    summaries.push(
      `PL/NB separation below expected range in ${plCats.length} categor${plCats.length === 1 ? "y" : "ies"} (${plCats.slice(0, 2).join(", ")}).`,
    );
    causal.push(
      `Weak PL/NB separation observed across high-volume categories with ${bundle.portfolioElasticitySensitivity} elasticity sensitivity.`,
    );
  }

  if (bundle.kviAffectedRevenuePct >= 12) {
    summaries.push(
      `KVI-like investment spans ~${bundle.kviAffectedRevenuePct}% of in-scope revenue weight.`,
    );
  }

  const premiumCats = bundle.categoryExposures.filter(
    (c) => c.roleId === "premiumization" && c.architectureCompression,
  );
  if (premiumCats.length > 0) {
    summaries.push(
      `Premiumization-sensitive categories show weak tier separation (${premiumCats.map((c) => c.category).join(", ")}).`,
    );
  }

  if (bundle.monetizableExposurePct > 0) {
    summaries.push(
      `Affected categories represent ~${bundle.monetizableExposurePct}% of monetizable in-scope revenue weight.`,
    );
  }

  return {
    summaries: summaries.slice(0, 5),
    causal: causal.slice(0, 4),
  };
}

export type OpportunityExposureInput = PricingRowSynthesisInput & {
  evidence: ComputedEvidenceBundle;
  categoryRows: InferredCategoryRow[];
  eprAverage?: number | null;
  normalizedFields?: import("@/types/upload-schema").CanonicalFieldKey[];
  retailerDisplayName?: string | null;
};

export function runOpportunityExposureEngine(
  input: OpportunityExposureInput,
): OpportunityExposureBundle {
  const rows = synthesizePricingRows(input);
  const arch = computeArchitectureSignals(rows);
  const kvi = computeKviSignals(rows);
  const categoryExposures = computeCategoryExposures({
    ...input,
    arch,
    kvi,
  });

  const { sensitivity: portfolioElasticitySensitivity, multiplier: elasticityWidthMultiplier } =
    weightedElasticitySensitivity(categoryExposures);

  const architectureAffectedRevenuePct = sumRevenuePct(
    categoryExposures,
    (c) => c.architectureCompression,
  );
  const plNbAffectedRevenuePct = sumRevenuePct(
    categoryExposures,
    (c) => c.plNbNarrow,
  );
  const kviAffectedRevenuePct = sumRevenuePct(
    categoryExposures,
    (c) => c.kviElevated,
  );
  const monetizableExposurePct = sumRevenuePct(
    categoryExposures,
    (c) => c.affectedIssueTags.length > 0,
  );

  const exposureWidthMultiplier =
    0.88 + Math.min(monetizableExposurePct / 100, 0.35) * 0.2;

  const evidenceCoverageScore =
    input.evidence.metrics.filter((m) => m.strength !== "weak").length /
    Math.max(input.evidence.metrics.length, 1);

  const maturityModifier =
    input.eprAverage != null ? (input.eprAverage - 3) * 0.5 : 0;

  const base: Omit<
    OpportunityExposureBundle,
    "exposureSummaries" | "causalFramingLines"
  > = {
    engineVersion: ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    elasticityChannel: pickPortfolioElasticityChannel(
      input.archetypeId,
      input.retailerTicker,
    ),
    categoryExposures,
    architectureAffectedRevenuePct,
    plNbAffectedRevenuePct,
    kviAffectedRevenuePct,
    monetizableExposurePct,
    portfolioElasticitySensitivity,
    elasticityWidthMultiplier,
    exposureWidthMultiplier,
    evidenceCoverageScore,
    maturityModifier,
  };

  const { summaries, causal } = buildExposureSummaries(base);

  return {
    ...base,
    exposureSummaries: summaries,
    causalFramingLines: causal,
  };
}

export function buildThemeExposureContext(
  bundle: OpportunityExposureBundle,
  family: HypothesisFamily,
): ThemeExposureContext {
  const pred = (c: (typeof bundle.categoryExposures)[0]) => {
    if (family === "Architecture" || family === "Premiumization") {
      return c.architectureCompression || c.plNbNarrow;
    }
    if (family === "KVI" || family === "ValueCommunication") {
      return c.kviElevated;
    }
    return c.affectedIssueTags.length > 0;
  };

  const contributing = bundle.categoryExposures.filter(pred);
  const themeAffectedRevenuePct = contributing.reduce(
    (s, c) => s + c.revenueWeightPct,
    0,
  );

  const { sensitivity, multiplier } = weightedElasticitySensitivity(
    contributing.length > 0 ? contributing : bundle.categoryExposures,
  );

  return {
    bundle,
    contributingCategories: contributing.map((c) => c.category),
    themeAffectedRevenuePct,
    themeElasticitySensitivity: sensitivity,
    themeElasticityMultiplier: multiplier,
  };
}
