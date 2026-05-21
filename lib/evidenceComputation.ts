import { SIGNAL_BY_ID } from "@/data/signalDefinitions";
import { runBenchmarkCalibrationEngine } from "@/lib/benchmarkCalibration";
import { computeArchitectureSignals } from "@/lib/architectureSignals";
import { computeCategorySignals } from "@/lib/categorySignals";
import { computeKviSignals } from "@/lib/kviSignals";
import { legacyPostureToKnowledge } from "@/lib/archetypeContext";
import {
  synthesizePricingRows,
  type PricingRowSynthesisInput,
} from "@/lib/pricingRowSynthesis";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type {
  ComputedEvidenceBundle,
  EvidenceBackedThemeLine,
  EvidenceStrength,
} from "@/types/evidence-computation";
import type { CanonicalFieldKey } from "@/types/upload-schema";

const ENGINE_VERSION = "14B.0.0";

const FRAMEWORK_ARCH_SIGNAL_IDS = new Set([
  "sig-ladder-compression",
  "sig-weak-premium-gap",
  "sig-weak-trade-up",
  "sig-weak-opp",
  "sig-weak-pl-nb",
  "sig-incoherent-ladder",
  "sig-kvi-breadth-high",
  "sig-kvi-concentration-weak",
  "sig-kvi-misaligned",
  "sig-promo-dependency",
  "sig-weak-base-price",
  "sig-broad-discounting",
  "sig-markdown-cadence",
  "sig-weak-lifecycle",
  "sig-weak-exit",
]);

export type EvidenceComputationInput = PricingRowSynthesisInput & {
  normalizedFields: CanonicalFieldKey[];
  retailerDisplayName?: string | null;
  eprAverage?: number | null;
};

function toSignal(
  signalId: string,
  strength: SupportingSignal["signalStrength"],
  explanation?: string,
): SupportingSignal | null {
  const def = SIGNAL_BY_ID.get(signalId);
  if (!def) return null;
  return {
    signalId: def.signalId,
    signalName: def.signalName,
    signalFamily: def.signalFamily,
    signalStrength: strength,
    explanation: explanation ?? def.explanation,
  };
}

function buildEvidenceSummaries(
  arch: ReturnType<typeof computeArchitectureSignals>,
  kvi: ReturnType<typeof computeKviSignals>,
  cat: ReturnType<typeof computeCategorySignals>,
  categories: string[],
  benchmarkLines: string[] = [],
): string[] {
  const lines: string[] = [...benchmarkLines];

  if (arch.premiumMainstreamGapPct !== null) {
    lines.push(
      `Premium/Mainstream median gap: ${Math.round(arch.premiumMainstreamGapPct)}%`,
    );
  }

  if (arch.plNbCategoriesNarrow > 0) {
    const total = new Set(categories).size;
    lines.push(
      `PL/NB separation below expected range in ${arch.plNbCategoriesNarrow} of ${total} categories`,
    );
  }

  if (kvi.kviRevenueSharePct > 0) {
    lines.push(
      `KVI-like items represent ~${kvi.kviRevenueSharePct}% of inferred category revenue weight`,
    );
  }

  if (arch.compressionCategories.length > 0) {
    const names = arch.compressionCategories.slice(0, 2).join(" and ");
    lines.push(`Tier spacing compressed in ${names}`);
  }

  if (cat.topCategoryShares[0]) {
    lines.push(
      `Revenue weight concentrated in ${cat.topCategoryShares[0].category} (~${cat.topCategoryShares[0].sharePct}%)`,
    );
  }

  return lines.slice(0, 6);
}

function buildEvidenceBackedThemes(
  arch: ReturnType<typeof computeArchitectureSignals>,
  kvi: ReturnType<typeof computeKviSignals>,
  retailerName: string | null,
  benchmarkNarratives: string[],
): EvidenceBackedThemeLine[] {
  const who = retailerName?.trim() || "The portfolio";
  const themes: EvidenceBackedThemeLine[] = [];

  for (const phrase of benchmarkNarratives.slice(0, 2)) {
    themes.push({
      headline: phrase.split(".")[0]?.slice(0, 72) ?? phrase,
      detail: phrase,
    });
  }

  if (arch.compressionCategories.length >= 1) {
    const cats = arch.compressionCategories.slice(0, 2).join(" and ");
    themes.push({
      headline: "Tight tier clustering in key categories",
      detail: `${who}: premium and mainstream tiers appear closely clustered in ${cats}.`,
    });
  } else if (
    arch.premiumMainstreamGapPct !== null &&
    arch.premiumMainstreamGapPct < 14
  ) {
    themes.push({
      headline: "Moderate premium tier separation",
      detail: `${who}: portfolio median premium/mainstream gap is ~${Math.round(arch.premiumMainstreamGapPct)}%, suggesting limited trade-up runway.`,
    });
  }

  if (arch.plNbCategoriesNarrow >= 2) {
    themes.push({
      headline: "Narrow private-label separation",
      detail: `Private-label price gaps versus national brands are narrower than expected in ${arch.plNbCategoriesNarrow} categories with measured mainstream tiers.`,
    });
  }

  if (kvi.broadKviBreadth || kvi.kviRevenueSharePct >= 18) {
    themes.push({
      headline: "Broad KVI-like investment",
      detail: `KVI-like investment appears distributed across traffic-driving categories (~${kvi.kviRevenueSharePct}% inferred revenue weight).`,
    });
  } else if (kvi.weakKviConcentration) {
    themes.push({
      headline: "Diffuse KVI concentration",
      detail: `KVI-like signals are present but not sharply concentrated (~${kvi.kviRevenueSharePct}% revenue weight across multiple categories).`,
    });
  }

  return themes.slice(0, 4);
}

function resolveEligibleHypotheses(
  arch: ReturnType<typeof computeArchitectureSignals>,
  kvi: ReturnType<typeof computeKviSignals>,
  promoMarkdownEligible: boolean,
  packInconsistent: boolean,
): string[] {
  const ids: string[] = [];

  if (arch.architectureCompression) ids.push("hyp-arch-compression");
  if (arch.plNbCategoriesNarrow >= 1) ids.push("hyp-weak-pl-nb");
  if (packInconsistent) ids.push("hyp-incoherent-ladder");
  if (
    arch.premiumMainstreamGapPct !== null &&
    arch.premiumMainstreamGapPct < 16
  ) {
    ids.push("hyp-weak-premiumization");
  }
  if (
    arch.entryMainstreamGapPct !== null &&
    arch.entryMainstreamGapPct < 12
  ) {
    ids.push("hyp-weak-trade-up", "hyp-weak-opp");
  }

  if (kvi.broadKviBreadth) ids.push("hyp-kvi-breadth");
  if (kvi.weakKviConcentration) ids.push("hyp-kvi-concentration");
  if (kvi.kviRevenueSharePct >= 22 && kvi.broadKviBreadth) {
    ids.push("hyp-kvi-misaligned");
  }

  if (promoMarkdownEligible) {
    ids.push("hyp-promo-dependency", "hyp-weak-base-price");
  }

  return [...new Set(ids)];
}

function buildComputedSignals(
  arch: ReturnType<typeof computeArchitectureSignals>,
  kvi: ReturnType<typeof computeKviSignals>,
  promoMarkdownEligible: boolean,
  packInconsistent: boolean,
): SupportingSignal[] {
  const fired: SupportingSignal[] = [];
  const push = (id: string, strength: SupportingSignal["signalStrength"], note?: string) => {
    const s = toSignal(id, strength, note);
    if (s) fired.push(s);
  };

  if (arch.architectureCompression) {
    push(
      "sig-ladder-compression",
      "strong",
      "Measured tier gaps indicate compressed spacing between entry, mainstream, and premium positions.",
    );
  }

  if (
    arch.premiumMainstreamGapPct !== null &&
    arch.premiumMainstreamGapPct < 16
  ) {
    push(
      "sig-weak-premium-gap",
      arch.premiumMainstreamGapPct < 12 ? "strong" : "moderate",
      `Computed premium/mainstream median gap: ${Math.round(arch.premiumMainstreamGapPct)}%.`,
    );
  }

  if (arch.plNbCategoriesNarrow >= 1) {
    push(
      "sig-weak-pl-nb",
      arch.plNbCategoriesNarrow >= 2 ? "strong" : "moderate",
      `PL/NB gap below expected range in ${arch.plNbCategoriesNarrow} categor${arch.plNbCategoriesNarrow === 1 ? "y" : "ies"}.`,
    );
  }

  if (packInconsistent) {
    push(
      "sig-incoherent-ladder",
      "moderate",
      "Pack-size ladder consistency score below threshold in synthesized rows.",
    );
  }

  if (kvi.broadKviBreadth) {
    push(
      "sig-kvi-breadth-high",
      "moderate",
      `KVI-like signals span ${kvi.kviConcentrationByCategory.filter((c) => c.sharePct >= 15).length} categories.`,
    );
  }

  if (kvi.weakKviConcentration) {
    push("sig-kvi-concentration-weak", "moderate");
  }

  if (promoMarkdownEligible) {
    push("sig-promo-dependency", "weak");
  }

  return fired;
}

function overallStrength(
  metrics: ComputedEvidenceBundle["metrics"],
): EvidenceStrength {
  const strong = metrics.filter((m) => m.strength === "strong").length;
  if (strong >= 3) return "strong";
  if (strong >= 1 || metrics.length >= 4) return "moderate";
  return "weak";
}

function primaryDrivers(metrics: ComputedEvidenceBundle["metrics"]): string[] {
  const drivers: string[] = [];
  if (metrics.some((m) => m.family === "architecture")) drivers.push("Price architecture");
  if (metrics.some((m) => m.id === "pl_nb_gap" || m.id === "pl_nb_categories_narrow")) {
    drivers.push("PL/NB separation");
  }
  if (metrics.some((m) => m.family === "kvi")) drivers.push("KVI concentration");
  if (metrics.some((m) => m.family === "category")) drivers.push("Category mix");
  return drivers.slice(0, 4);
}

export function runEvidenceComputation(
  input: EvidenceComputationInput,
): ComputedEvidenceBundle {
  const pricingRows = synthesizePricingRows(input);
  const categories = input.categoryRows.map((r) => r.category);

  const arch = computeArchitectureSignals(pricingRows);
  const kvi = computeKviSignals(pricingRows);
  const cat = computeCategorySignals(pricingRows, input.categoryRows);

  const packInconsistent =
    arch.packSizeConsistencyPct !== null && arch.packSizeConsistencyPct < 72;

  const promoMarkdownEligible =
    input.normalizedFields.includes("promoFlag") ||
    input.normalizedFields.includes("promoPrice") ||
    input.normalizedFields.includes("markdownFlag");

  const benchmarkCalibration = runBenchmarkCalibrationEngine({
    archetypeId: input.archetypeId,
    pricingPosture: legacyPostureToKnowledge(input.pricingPosture),
    arch,
    kvi,
    categories,
    eprAverage: input.eprAverage ?? null,
  });

  const metrics = [...arch.metrics, ...kvi.metrics, ...cat.metrics];
  const summaries = buildEvidenceSummaries(
    arch,
    kvi,
    cat,
    categories,
    benchmarkCalibration.exposureSummaryLines,
  );
  const computedSignals = buildComputedSignals(
    arch,
    kvi,
    promoMarkdownEligible,
    packInconsistent,
  );
  const eligibleHypothesisIds = resolveEligibleHypotheses(
    arch,
    kvi,
    promoMarkdownEligible,
    packInconsistent,
  );
  const evidenceBackedThemes = buildEvidenceBackedThemes(
    arch,
    kvi,
    input.retailerDisplayName ?? null,
    benchmarkCalibration.executiveContextLines,
  );

  return {
    generatedAt: new Date().toISOString(),
    engineVersion: ENGINE_VERSION,
    evidenceStrength: overallStrength(metrics),
    metrics,
    summaries,
    computedSignals,
    eligibleHypothesisIds,
    evidenceBackedThemes,
    primaryDrivers: primaryDrivers(metrics),
    promoMarkdownEligible,
    rowCount: pricingRows.length,
    categoriesAnalyzed: categories,
    normalizedFields: input.normalizedFields,
    benchmarkCalibration,
  };
}

/** Merge framework signals with measured evidence; suppress unmeasured arch/KVI/promo framework signals. */
export function mergeEvidenceWithFrameworkSignals(
  frameworkSignals: SupportingSignal[],
  evidence: ComputedEvidenceBundle,
): SupportingSignal[] {
  const evidenceIds = new Set(evidence.computedSignals.map((s) => s.signalId));
  const filtered = frameworkSignals.filter((s) => {
    if (!FRAMEWORK_ARCH_SIGNAL_IDS.has(s.signalId)) return true;
    return evidenceIds.has(s.signalId);
  });
  const seen = new Set(filtered.map((s) => s.signalId));
  for (const s of evidence.computedSignals) {
    if (!seen.has(s.signalId)) {
      filtered.push(s);
      seen.add(s.signalId);
    }
  }
  return filtered;
}

export function isHypothesisEvidenceEligible(
  hypothesisId: string,
  evidence: ComputedEvidenceBundle,
): boolean {
  const promoFamilies = new Set([
    "hyp-promo-dependency",
    "hyp-weak-base-price",
    "hyp-broad-discounting",
    "hyp-markdown-cadence",
    "hyp-weak-lifecycle",
    "hyp-weak-exit",
  ]);

  if (promoFamilies.has(hypothesisId) && !evidence.promoMarkdownEligible) {
    return false;
  }

  const measuredFamilies = new Set([
    "hyp-arch-compression",
    "hyp-weak-premiumization",
    "hyp-weak-trade-up",
    "hyp-weak-opp",
    "hyp-weak-pl-nb",
    "hyp-incoherent-ladder",
    "hyp-kvi-breadth",
    "hyp-kvi-concentration",
    "hyp-kvi-misaligned",
  ]);

  if (measuredFamilies.has(hypothesisId)) {
    return evidence.eligibleHypothesisIds.includes(hypothesisId);
  }

  return true;
}
