/**
 * Step 15 — Robust retail data interpretation orchestrator.
 */

import { assessDataQuality } from "@/lib/dataQualityAssessment";
import { normalizeCategoryList } from "@/lib/categoryNormalization";
import { assessEvidenceCoverage } from "@/lib/evidenceCoverage";
import { inferTierStructure } from "@/lib/tierInference";
import { resolveSemanticFields } from "@/lib/semanticFieldResolver";
import type {
  RobustDataInterpretationBundle,
  RobustDataInterpretationInput,
} from "@/types/data-interpretation";

const ENGINE_VERSION = "15.0.0";

export function runRobustDataInterpretation(
  input: RobustDataInterpretationInput,
): RobustDataInterpretationBundle {
  const semantic = resolveSemanticFields(input);
  const categoryMappings = normalizeCategoryList(input.categoryNames);
  const mappedCategoryCount = categoryMappings.filter(
    (m) => m.confidence >= 0.5,
  ).length;

  const explicit = [...new Set(input.normalizedFields)];
  const inferred = semantic.inferredFields.filter((f) => !explicit.includes(f));

  const hasPrice = semantic.effectiveFields.includes("price");
  const tierInference = inferTierStructure({
    hasExplicitTier: false,
    hasPrice,
    hasPackSize: semantic.effectiveFields.includes("packSize"),
    hasPrivateLabelFlag: semantic.effectiveFields.includes("privateLabelFlag"),
    categoryCount: input.categoryNames.length,
    archetypeId: input.archetypeId,
  });

  const evidenceCoverage = assessEvidenceCoverage({
    effectiveFields: semantic.effectiveFields,
    explicitFields: explicit,
    inferredFields: inferred,
    fieldResolutions: semantic.resolutions,
    proxySignals: semantic.proxySignals,
    categoryCount: input.categoryNames.length,
    mappedCategoryCount,
    benchmarkCoherent: semantic.effectiveFields.includes("price"),
  });

  const dataQuality = assessDataQuality({
    effectiveFields: semantic.effectiveFields,
    explicitFields: explicit,
    inferredFields: inferred,
    fieldResolutions: semantic.resolutions,
    categoryMappings,
    proxySignals: semantic.proxySignals,
    categoryCount: input.categoryNames.length,
  });

  return {
    engineVersion: ENGINE_VERSION,
    effectiveNormalizedFields: semantic.effectiveFields,
    fieldResolutions: semantic.resolutions,
    categoryMappings,
    proxySignals: semantic.proxySignals,
    tierInference,
    dataQuality,
    evidenceCoverage,
    inferredVsExplicit: { explicit, inferred },
  };
}
