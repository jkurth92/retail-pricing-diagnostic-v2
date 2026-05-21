import type { SupportingSignal } from "@/types/diagnostic-hypotheses";
import type { BenchmarkCalibrationBundle } from "@/types/benchmark-calibration";
import type { CanonicalFieldKey } from "@/types/upload-schema";

export type EvidenceMetricId =
  | "premium_mainstream_gap"
  | "entry_mainstream_gap"
  | "tier_spacing"
  | "pack_size_consistency"
  | "pl_nb_gap"
  | "pl_nb_categories_narrow"
  | "architecture_compression"
  | "kvi_revenue_share"
  | "kvi_sku_share"
  | "kvi_category_concentration"
  | "category_revenue_concentration"
  | "premiumization_category_mix";

export type EvidenceMetric = {
  id: EvidenceMetricId;
  label: string;
  value: string;
  family: "architecture" | "kvi" | "category";
  strength: "strong" | "moderate" | "weak";
};

export type EvidenceStrength = "strong" | "moderate" | "weak";

export type EvidenceBackedThemeLine = {
  headline: string;
  detail: string;
};

export type ComputedEvidenceBundle = {
  generatedAt: string;
  engineVersion: string;
  evidenceStrength: EvidenceStrength;
  metrics: EvidenceMetric[];
  summaries: string[];
  computedSignals: SupportingSignal[];
  /** Hypothesis registry ids that measured evidence supports */
  eligibleHypothesisIds: string[];
  evidenceBackedThemes: EvidenceBackedThemeLine[];
  primaryDrivers: string[];
  promoMarkdownEligible: boolean;
  rowCount: number;
  categoriesAnalyzed: string[];
  normalizedFields: CanonicalFieldKey[];
  /** Step 14B — benchmark-informed contextual interpretation */
  benchmarkCalibration?: BenchmarkCalibrationBundle;
};
