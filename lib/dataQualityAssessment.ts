/**
 * Data quality interpretation for consultant transparency.
 */

import type {
  CategoryMapping,
  DataQualityAssessment,
  FieldResolution,
  ProxySignal,
} from "@/types/data-interpretation";
import type { CanonicalFieldKey } from "@/types/upload-schema";

export type DataQualityInput = {
  effectiveFields: CanonicalFieldKey[];
  explicitFields: CanonicalFieldKey[];
  inferredFields: CanonicalFieldKey[];
  fieldResolutions: FieldResolution[];
  categoryMappings: CategoryMapping[];
  proxySignals: ProxySignal[];
  categoryCount: number;
};

export function assessDataQuality(input: DataQualityInput): DataQualityAssessment {
  const explicitFieldCount = input.explicitFields.length;
  const inferredFieldCount = input.inferredFields.length;
  const total = Math.max(input.effectiveFields.length, 1);
  const fieldCoveragePct = Math.round((explicitFieldCount / total) * 100);

  const mapped = input.categoryMappings.filter((m) => m.confidence >= 0.55);
  const categoryCoveragePct =
    input.categoryCount > 0
      ? Math.round((mapped.length / input.categoryCount) * 100)
      : 50;

  const avgMapping =
    input.fieldResolutions.length > 0
      ? input.fieldResolutions
          .filter((r) => r.canonicalField)
          .reduce((s, r) => s + r.confidence, 0) /
        Math.max(
          input.fieldResolutions.filter((r) => r.canonicalField).length,
          1,
        )
      : 0.5;

  const normalizationConfidence: DataQualityAssessment["normalizationConfidence"] =
    avgMapping >= 0.82
      ? "high"
      : avgMapping >= 0.6
        ? "medium"
        : "low";

  const signalCompleteness: DataQualityAssessment["signalCompleteness"] =
    inferredFieldCount === 0
      ? "adequate"
      : inferredFieldCount <= 3
        ? "partial"
        : "sparse";

  const consultantNotes: string[] = [];

  const fuzzyMaps = input.fieldResolutions.filter(
    (r) => r.method === "fuzzy_match" && r.canonicalField,
  );
  if (fuzzyMaps.length > 0) {
    consultantNotes.push(
      `Fuzzy column mappings applied (${fuzzyMaps.slice(0, 3).map((r) => `${r.sourceColumn}→${r.canonicalField}`).join(", ")}${fuzzyMaps.length > 3 ? "…" : ""}).`,
    );
  }

  const catInf = input.categoryMappings.filter((m) => m.method !== "exact");
  if (catInf.length > 0) {
    consultantNotes.push(
      `Category normalization partially inferred (${catInf
        .slice(0, 2)
        .map((m) => `${m.rawCategory}→${m.normalizedCategory}`)
        .join("; ")}).`,
    );
  }

  for (const proxy of input.proxySignals.slice(0, 4)) {
    consultantNotes.push(`${proxy.label}: ${proxy.detail}`);
  }

  if (input.proxySignals.some((p) => p.kind === "inferred_tier")) {
    consultantNotes.push(
      "Tier structure inferred from pricing clusters — not from explicit tier fields.",
    );
  }

  if (!input.effectiveFields.includes("zone")) {
    consultantNotes.push("Zoning evidence directional only.");
  }

  return {
    fieldCoveragePct,
    categoryCoveragePct,
    explicitFieldCount,
    inferredFieldCount,
    normalizationConfidence,
    signalCompleteness,
    consultantNotes: consultantNotes.slice(0, 8),
  };
}
