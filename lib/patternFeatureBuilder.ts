import {
  PATTERN_FEATURES_BY_LEVER,
  type PatternFeatureSeed,
} from "@/data/patternFeatureCatalog";
import {
  buildEvidenceLinksForFields,
  describeMissingFields,
} from "@/lib/patternEvidence";
import type { CalculationStatus, LeverKey } from "@/types/diagnostic-output";
import type { DiagnosticUnlockStatus, LeverDiagnosticUnlock } from "@/types/ingestion";
import type {
  LeverPatternFeaturesSection,
  PatternFeature,
  PatternFeatureStatus,
} from "@/types/pattern-features";
import type { ObservedPricingPatternsOutput } from "@/types/observed-patterns";
import type { CanonicalFieldKey } from "@/types/upload-schema";

const LEVER_SECTION_LABELS: Record<LeverKey, string> = {
  kvis: "KVI patterns",
  price_architecture: "Price architecture patterns",
  price_zoning: "Price zoning patterns",
  promotions: "Promotion patterns",
  markdown: "Markdown patterns",
};

const LEVER_PENDING_NOTES: Record<LeverKey, string> = {
  kvis: "KVI features defined, pending rule alignment",
  price_architecture:
    "Architecture features defined, pending normalized pack-size coverage",
  price_zoning: "Zoning features defined, pending store/zone data",
  promotions: "Promotion features defined, pending promo fields",
  markdown: "Markdown features defined, pending markdown fields",
};

function unionFields(seeds: PatternFeatureSeed[]): CanonicalFieldKey[] {
  const set = new Set<CanonicalFieldKey>();
  for (const s of seeds) {
    for (const f of s.sourceFields) set.add(f);
  }
  return [...set];
}

function resolveFeatureStatus(
  seed: PatternFeatureSeed,
  present: Set<CanonicalFieldKey>,
  unlockStatus: DiagnosticUnlockStatus,
): PatternFeatureStatus {
  const missing = describeMissingFields(seed.sourceFields, present);
  if (missing.length > 0) return "not_defined";
  if (unlockStatus === "ready" && !seed.requiresAlignment) {
    return "ready_for_engine";
  }
  if (seed.requiresAlignment || unlockStatus !== "ready") {
    return "pending_alignment";
  }
  return "defined";
}

function resolveSectionStatus(
  features: PatternFeature[],
): PatternFeatureStatus {
  if (features.some((f) => f.status === "not_defined")) return "not_defined";
  if (features.every((f) => f.status === "ready_for_engine")) {
    return "ready_for_engine";
  }
  if (features.every((f) => f.status === "defined")) return "defined";
  return "pending_alignment";
}

function calculationStatusFromPattern(
  status: PatternFeatureStatus,
): CalculationStatus {
  if (status === "ready_for_engine") return "ready_for_engine";
  if (status === "defined") return "pending_alignment";
  return "pending_alignment";
}

function buildFeature(
  seed: PatternFeatureSeed,
  present: Set<CanonicalFieldKey>,
  unlockStatus: DiagnosticUnlockStatus,
): PatternFeature {
  const status = resolveFeatureStatus(seed, present, unlockStatus);
  return {
    ...seed,
    status,
    value: null,
    evidenceLinks: buildEvidenceLinksForFields(seed.sourceFields, seed.id),
  };
}

function buildLeverSection(
  leverKey: LeverKey,
  presentFields: CanonicalFieldKey[],
  unlock: LeverDiagnosticUnlock | undefined,
): LeverPatternFeaturesSection {
  const present = new Set(presentFields);
  const seeds = PATTERN_FEATURES_BY_LEVER[leverKey];
  const unlockStatus = unlock?.status ?? "unavailable";
  const features = seeds.map((s) => buildFeature(s, present, unlockStatus));
  const requiredFields = unionFields(seeds);
  const missingInputs = describeMissingFields(requiredFields, present);
  const sectionStatus = resolveSectionStatus(features);

  const unlockHint =
    unlockStatus === "unavailable"
      ? "Unavailable until required normalized fields are mapped."
      : unlockStatus === "limited"
        ? "Limited coverage — some features remain not_defined."
        : "Available after alignment — feature values not calculated in this build.";

  return {
    leverKey,
    label: LEVER_SECTION_LABELS[leverKey],
    features,
    featureCount: features.length,
    requiredFields,
    sectionStatus,
    readinessSummary: `${features.filter((f) => f.status !== "not_defined").length} of ${features.length} features have required inputs in preview. ${unlockHint}`,
    missingInputs,
    notes: LEVER_PENDING_NOTES[leverKey],
    evidenceLabel:
      missingInputs.length === 0 ? "Preview mappings present" : "Pending",
    findingsLabel: "Not generated",
    opportunityImpactLabel: "Not calculated",
  };
}

function legacySectionFromLever(section: LeverPatternFeaturesSection) {
  return {
    status: calculationStatusFromPattern(section.sectionStatus),
    evidenceLabel: section.evidenceLabel,
    findingsLabel: section.findingsLabel,
    opportunityImpactLabel: section.opportunityImpactLabel,
  };
}

export function buildObservedPatternsOutput(
  normalizedFields: CanonicalFieldKey[],
  leverUnlocks: LeverDiagnosticUnlock[],
): ObservedPricingPatternsOutput {
  const unlockByLever = new Map(leverUnlocks.map((u) => [u.leverKey, u]));

  const kviPatterns = buildLeverSection(
    "kvis",
    normalizedFields,
    unlockByLever.get("kvis"),
  );
  const architecturePatterns = buildLeverSection(
    "price_architecture",
    normalizedFields,
    unlockByLever.get("price_architecture"),
  );
  const zoningPatterns = buildLeverSection(
    "price_zoning",
    normalizedFields,
    unlockByLever.get("price_zoning"),
  );
  const promotionPatterns = buildLeverSection(
    "promotions",
    normalizedFields,
    unlockByLever.get("promotions"),
  );
  const markdownPatterns = buildLeverSection(
    "markdown",
    normalizedFields,
    unlockByLever.get("markdown"),
  );

  const sections = {
    kvis: legacySectionFromLever(kviPatterns),
    price_architecture: legacySectionFromLever(architecturePatterns),
    price_zoning: legacySectionFromLever(zoningPatterns),
    promotions: legacySectionFromLever(promotionPatterns),
    markdown: legacySectionFromLever(markdownPatterns),
  };

  const allMissing = [
    ...new Set([
      ...kviPatterns.missingInputs,
      ...architecturePatterns.missingInputs,
      ...zoningPatterns.missingInputs,
      ...promotionPatterns.missingInputs,
      ...markdownPatterns.missingInputs,
    ]),
  ];

  const definedCount =
    kviPatterns.features.filter((f) => f.status !== "not_defined").length +
    architecturePatterns.features.filter((f) => f.status !== "not_defined")
      .length +
    zoningPatterns.features.filter((f) => f.status !== "not_defined").length +
    promotionPatterns.features.filter((f) => f.status !== "not_defined")
      .length +
    markdownPatterns.features.filter((f) => f.status !== "not_defined").length;

  const totalFeatures =
    kviPatterns.featureCount +
    architecturePatterns.featureCount +
    zoningPatterns.featureCount +
    promotionPatterns.featureCount +
    markdownPatterns.featureCount;

  const overallStatus: CalculationStatus = "pending_alignment";

  return {
    guardrailMessage:
      "Pattern features describe measurable pricing structure only. No benchmark thresholds, rule verdicts, opportunity math, or recommendations are active.",
    status: "pending_alignment",
    overallStatus,
    kviPatterns,
    architecturePatterns,
    zoningPatterns,
    promotionPatterns,
    markdownPatterns,
    readinessSummary: `${definedCount} of ${totalFeatures} features have required inputs in the normalization preview. Values remain null until the diagnostic engine is aligned.`,
    missingInputs: allMissing,
    notes: [
      "Feature catalog is deterministic; calculation notes describe future formulas.",
      "Findings and opportunity impact are intentionally disabled.",
      ...Object.values(LEVER_PENDING_NOTES),
    ],
    sections,
  };
}
