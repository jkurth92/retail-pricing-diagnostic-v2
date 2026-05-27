import { SIGNAL_BY_ID } from "@/data/signalDefinitions";
import { runBenchmarkCalibrationEngine } from "@/lib/benchmarkCalibration";
import { computeArchitectureSignals } from "@/lib/architectureSignals";
import { computeCategorySignals } from "@/lib/categorySignals";
import { computeKviSignals } from "@/lib/kviSignals";
import { legacyPostureToKnowledge } from "@/lib/archetypeContext";
import { proxySignalsToSupportingSignals } from "@/lib/implicitStructureSignals";
import {
  architectureAttributionLine,
  calibrateEvidenceHeadline,
  calibrateMetricList,
  deriveOverallEvidenceStrength,
  plNbAttributionLine,
  softenExecutiveDriverPhrase,
} from "@/lib/interpretationCalibration";
import { sortLinesByFamilyPriority } from "@/lib/signalPrioritization";
import { categoryArchitectureFraming } from "@/lib/calibrationProportionality";
import {
  calibrateValueConcentrationPhrase,
  kviEvidenceFromResult,
} from "@/lib/narrativeRefinement";
import { runRobustDataInterpretation } from "@/lib/robustDataInterpretation";
import type { RobustDataInterpretationBundle } from "@/types/data-interpretation";
import { buildEvidenceIllustrations } from "@/lib/evidenceIllustrations";
import {
  synthesizePricingRows,
  type PricingRowSynthesisInput,
} from "@/lib/pricingRowSynthesis";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type {
  ComputedEvidenceBundle,
  EvidenceBackedThemeLine,
} from "@/types/evidence-computation";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import type { UploadProductRow } from "@/types/upload-products";

const ENGINE_VERSION = "15.0.0";

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
  dataInterpretation?: RobustDataInterpretationBundle;
  detectedColumns?: string[];
  uploadProducts?: UploadProductRow[];
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
  const lines: string[] = [...categoryArchitectureFraming(arch), ...benchmarkLines];

  if (arch.premiumMainstreamGapPct !== null) {
    lines.push(
      `Premium/Mainstream median gap: ${Math.round(arch.premiumMainstreamGapPct)}%`,
    );
  }

  const totalCats = new Set(categories).size;
  const plLine = plNbAttributionLine(arch, totalCats);
  if (plLine) lines.push(plLine);

  const archLine = architectureAttributionLine(arch, totalCats);
  if (archLine && !lines.some((l) => l.includes("compressed"))) {
    lines.push(archLine);
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
    const isolated = arch.compressionCategories.length === 1;
    themes.push({
      headline: isolated
        ? "Moderately compressed premium architecture"
        : "Compressed premium architecture",
      detail: `${who}: tier spacing appears compressed in ${cats}${isolated ? " — broader portfolio spacing is less pronounced." : "."}`,
    });
  } else if (
    arch.premiumMainstreamGapPct !== null &&
    arch.premiumMainstreamGapPct < 16
  ) {
    themes.push({
      headline: "Limited premium separation",
      detail: `${who}: portfolio median premium/mainstream gap is ~${Math.round(arch.premiumMainstreamGapPct)}%, suggesting moderate trade-up headroom rather than severe failure.`,
    });
  }

  if (arch.plNbNarrowCategories.length >= 1) {
    const cats = arch.plNbNarrowCategories.slice(0, 2).join(" and ");
    const isolated = arch.plNbNarrowCategories.length < 3;
    themes.push({
      headline: isolated ? "Selective PL/NB compression" : "Weak monetization separation",
      detail: isolated
        ? `PL/NB gaps are narrower than expected in ${cats}; overall measured structure appears broadly healthy.`
        : `Private-label separation is narrower than expected in ${arch.plNbNarrowCategories.length} categories (${cats}).`,
    });
  }

  const kviLabel = calibrateValueConcentrationPhrase(kviEvidenceFromResult(kvi));
  const archLead = themes.some((t) => /architecture|premium|spacing|compression/i.test(t.headline));
  if (
    kviLabel &&
    (!archLead || (kvi.broadKviBreadth && kvi.kviRevenueSharePct >= 22))
  ) {
    themes.push({
      headline: kviLabel,
      detail:
        kvi.broadKviBreadth && kvi.kviRevenueSharePct >= 22
          ? `Visible value investment spans multiple traffic categories (~${kvi.kviRevenueSharePct}% inferred revenue weight).`
          : `KVI-like signals are present at modest breadth (~${kvi.kviRevenueSharePct}% inferred revenue weight) — supporting, not lead, versus architecture.`,
    });
  }

  return themes.slice(0, 4);
}

function resolveEligibleHypotheses(
  arch: ReturnType<typeof computeArchitectureSignals>,
  kvi: ReturnType<typeof computeKviSignals>,
  promoMarkdownEligible: boolean,
  packInconsistent: boolean,
  archetypeId: import("@/types/retailer-archetypes").RetailerArchetypeId,
): string[] {
  const ids: string[] = [];

  if (arch.architectureCompression) ids.push("hyp-arch-compression");
  if (arch.plNbCategoriesNarrow >= 1) ids.push("hyp-weak-pl-nb");
  if (packInconsistent) ids.push("hyp-incoherent-ladder");
  if (arch.premiumMainstreamGapPct !== null) {
    const premiumThreshold =
      archetypeId === "mass" || archetypeId === "discount" ? 14 : 16;
    if (arch.premiumMainstreamGapPct < premiumThreshold) {
      ids.push("hyp-weak-premiumization");
    }
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
      arch.premiumMainstreamGapPct < 12 ? "moderate" : "moderate",
      `Premium/mainstream median gap ~${Math.round(arch.premiumMainstreamGapPct)}% — moderately compressed versus typical spacing.`,
    );
  }

  if (arch.plNbCategoriesNarrow >= 1) {
    const cats = arch.plNbNarrowCategories.slice(0, 2).join(", ");
    const isolated = arch.plNbNarrowCategories.length < 3;
    push(
      "sig-weak-pl-nb",
      isolated ? "moderate" : arch.plNbCategoriesNarrow >= 2 ? "strong" : "moderate",
      cats
        ? `Narrow PL/NB separation in ${cats}.`
        : `PL/NB gap below expected range in ${arch.plNbCategoriesNarrow} categor${arch.plNbCategoriesNarrow === 1 ? "y" : "ies"}.`,
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

function primaryDrivers(
  metrics: ComputedEvidenceBundle["metrics"],
  kvi?: ReturnType<typeof computeKviSignals>,
): string[] {
  const drivers: string[] = [];
  if (metrics.some((m) => m.family === "architecture" && !m.id.includes("pl_nb"))) {
    drivers.push("Compressed premium architecture");
  }
  if (metrics.some((m) => m.family === "kvi") && kvi) {
    const label = calibrateValueConcentrationPhrase(kviEvidenceFromResult(kvi));
    if (label) drivers.push(label);
  }
  if (metrics.some((m) => m.id === "pl_nb_gap" || m.id === "pl_nb_categories_narrow")) {
    drivers.push("Selective PL/NB compression");
  }
  if (metrics.some((m) => m.family === "category")) drivers.push("Category mix");
  return sortLinesByFamilyPriority(drivers).slice(0, 4);
}

export function runEvidenceComputation(
  input: EvidenceComputationInput,
): ComputedEvidenceBundle {
  const dataInterpretation =
    input.dataInterpretation ??
    runRobustDataInterpretation({
      detectedColumns: input.detectedColumns ?? [],
      normalizedFields: input.normalizedFields,
      categoryNames: input.categoryRows.map((r) => r.category),
      archetypeId: input.archetypeId,
      retailerTicker: input.retailerTicker,
    });

  const effectiveFields = dataInterpretation.effectiveNormalizedFields;

  const pricingRows = synthesizePricingRows(input);
  const categories = input.categoryRows.map((r) => r.category);

  const arch = computeArchitectureSignals(pricingRows, input.archetypeId);
  const kvi = computeKviSignals(pricingRows);
  const cat = computeCategorySignals(pricingRows, input.categoryRows);

  const packInconsistent =
    arch.packSizeConsistencyPct !== null && arch.packSizeConsistencyPct < 72;

  const promoMarkdownEligible =
    effectiveFields.includes("promoFlag") ||
    effectiveFields.includes("promoPrice") ||
    effectiveFields.includes("markdownFlag");

  const benchmarkCalibration = runBenchmarkCalibrationEngine({
    archetypeId: input.archetypeId,
    pricingPosture: legacyPostureToKnowledge(input.pricingPosture),
    arch,
    kvi,
    categories,
    eprAverage: input.eprAverage ?? null,
  });

  const metrics = calibrateMetricList([
    ...arch.metrics,
    ...kvi.metrics,
    ...cat.metrics,
  ]);
  const summaries = buildEvidenceSummaries(
    arch,
    kvi,
    cat,
    categories,
    benchmarkCalibration.exposureSummaryLines,
  );
  const computedSignals = [
    ...buildComputedSignals(arch, kvi, promoMarkdownEligible, packInconsistent),
    ...proxySignalsToSupportingSignals(dataInterpretation.proxySignals),
  ];
  const eligibleHypothesisIds = resolveEligibleHypotheses(
    arch,
    kvi,
    promoMarkdownEligible,
    packInconsistent,
    input.archetypeId,
  );
  const evidenceBackedThemes = buildEvidenceBackedThemes(
    arch,
    kvi,
    input.retailerDisplayName ?? null,
    benchmarkCalibration.executiveContextLines,
  ).map((t) => ({
    headline: calibrateEvidenceHeadline(t.headline),
    detail: softenExecutiveDriverPhrase(t.detail),
  }));

  const illustrations = buildEvidenceIllustrations({
    rows: pricingRows,
    arch,
    kvi,
    cat,
    archetypeId: input.archetypeId,
    proxySignals: dataInterpretation.proxySignals,
    retailerTicker: input.retailerTicker,
    retailerDisplayName: input.retailerDisplayName,
    uploadProducts: input.uploadProducts,
  });

  return {
    generatedAt: new Date().toISOString(),
    engineVersion: ENGINE_VERSION,
    evidenceStrength: deriveOverallEvidenceStrength(
      metrics,
      arch,
      categories,
      benchmarkCalibration.interpretations,
    ),
    metrics,
    summaries: summaries.map((s) => softenExecutiveDriverPhrase(s)),
    computedSignals,
    eligibleHypothesisIds,
    evidenceBackedThemes,
    primaryDrivers: primaryDrivers(metrics, kvi),
    promoMarkdownEligible,
    rowCount: pricingRows.length,
    categoriesAnalyzed: categories,
    normalizedFields: effectiveFields,
    benchmarkCalibration,
    dataInterpretation,
    illustrations,
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
