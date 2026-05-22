/**
 * Weighted evidence sufficiency — replaces binary pass/fail gating.
 */

import type { CanonicalFieldKey } from "@/types/upload-schema";
import type {
  EvidenceCoverageAssessment,
  EvidenceCoverageDimension,
  FieldResolution,
  ProxySignal,
} from "@/types/data-interpretation";

const FIELD_WEIGHTS: Partial<Record<CanonicalFieldKey, number>> = {
  price: 0.18,
  category: 0.14,
  sku: 0.06,
  packSize: 0.08,
  privateLabelFlag: 0.1,
  kviFlag: 0.1,
  zone: 0.06,
  revenue: 0.08,
  units: 0.05,
  promoFlag: 0.05,
  markdownFlag: 0.04,
};

export type SufficiencyInput = {
  effectiveFields: CanonicalFieldKey[];
  explicitFields: CanonicalFieldKey[];
  inferredFields: CanonicalFieldKey[];
  fieldResolutions: FieldResolution[];
  proxySignals: ProxySignal[];
  categoryCount: number;
  mappedCategoryCount: number;
  benchmarkCoherent?: boolean;
};

function fieldCoverageScore(fields: CanonicalFieldKey[]): number {
  const weights = Object.entries(FIELD_WEIGHTS) as [CanonicalFieldKey, number][];
  let got = 0;
  let total = 0;
  const set = new Set(fields);
  for (const [key, w] of weights) {
    total += w;
    if (set.has(key)) got += w;
  }
  return total > 0 ? got / total : 0;
}

function mappingQualityScore(resolutions: FieldResolution[]): number {
  if (resolutions.length === 0) return 0.5;
  const mapped = resolutions.filter((r) => r.canonicalField != null);
  const avg =
    mapped.reduce((s, r) => s + r.confidence, 0) / Math.max(mapped.length, 1);
  return Math.min(1, avg * (mapped.length / resolutions.length));
}

function proxyQualityScore(signals: ProxySignal[]): number {
  if (signals.length === 0) return 0.55;
  const scores = signals.map((s) =>
    s.confidence === "high" ? 0.85 : s.confidence === "medium" ? 0.65 : 0.4,
  );
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function assessEvidenceCoverage(
  input: SufficiencyInput,
): EvidenceCoverageAssessment {
  const fieldScore = fieldCoverageScore(input.effectiveFields);
  const categoryScore =
    input.categoryCount > 0
      ? Math.min(1, input.mappedCategoryCount / input.categoryCount)
      : 0.4;
  const mappingScore = mappingQualityScore(input.fieldResolutions);
  const proxyScore = proxyQualityScore(input.proxySignals);
  const benchmarkScore = input.benchmarkCoherent ? 0.75 : 0.55;

  const dimensions: EvidenceCoverageDimension[] = [
    {
      id: "field_coverage",
      label: "Field coverage",
      score: fieldScore,
      weight: 0.28,
      note:
        fieldScore >= 0.65
          ? "Core architecture fields available or proxied."
          : "Partial field coverage — architecture signals rely on inference.",
    },
    {
      id: "mapping_quality",
      label: "Normalization confidence",
      score: mappingScore,
      weight: 0.18,
      note:
        mappingScore >= 0.7
          ? "Column mappings are mostly high-confidence."
          : "Some columns mapped with fuzzy or inferred purpose.",
    },
    {
      id: "category_coverage",
      label: "Category coverage",
      score: categoryScore,
      weight: 0.2,
      note:
        categoryScore >= 0.6
          ? "Commercial categories are well represented in scope."
          : "Category normalization partially inferred.",
    },
    {
      id: "proxy_inference",
      label: "Proxy inference quality",
      score: proxyScore,
      weight: 0.18,
      note:
        proxyScore >= 0.65
          ? "Proxy structures support directional architecture read."
          : "Limited proxy signals — interpret ranges cautiously.",
    },
    {
      id: "benchmark_coherence",
      label: "Benchmark coherence",
      score: benchmarkScore,
      weight: 0.16,
      note: "Contextual benchmark alignment for archetype/posture.",
    },
  ];

  const overallScore = dimensions.reduce(
    (s, d) => s + d.score * d.weight,
    0,
  );

  const sufficiencyLevel: EvidenceCoverageAssessment["sufficiencyLevel"] =
    overallScore >= 0.62
      ? "high"
      : overallScore >= 0.38
        ? "medium"
        : "low";

  const allowsDirectionalOpportunity = overallScore >= 0.28;
  const rangeWidthMultiplier =
    sufficiencyLevel === "high"
      ? 1
      : sufficiencyLevel === "medium"
        ? 1.08
        : 1.18;
  const narrativeSeverityScale =
    sufficiencyLevel === "high" ? 1 : sufficiencyLevel === "medium" ? 0.88 : 0.75;

  return {
    overallScore,
    sufficiencyLevel,
    dimensions,
    allowsDirectionalOpportunity,
    rangeWidthMultiplier,
    narrativeSeverityScale,
  };
}
