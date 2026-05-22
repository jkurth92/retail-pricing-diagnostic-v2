/**
 * Resolves effective canonical field coverage from messy uploads + proxy inference.
 */

import {
  canonicalFieldsFromResolutions,
  normalizeDetectedColumns,
} from "@/lib/fieldNormalization";
import { inferProxyFields } from "@/lib/proxyInference";
import type { CanonicalFieldKey } from "@/types/upload-schema";
import type {
  FieldResolution,
  ProxySignal,
  RobustDataInterpretationInput,
} from "@/types/data-interpretation";

export type SemanticFieldResolutionResult = {
  resolutions: FieldResolution[];
  effectiveFields: CanonicalFieldKey[];
  proxySignals: ProxySignal[];
  inferredFields: CanonicalFieldKey[];
};

export function resolveSemanticFields(
  input: RobustDataInterpretationInput,
): SemanticFieldResolutionResult {
  const resolutions = normalizeDetectedColumns(input.detectedColumns);
  const fromColumns = canonicalFieldsFromResolutions(
    resolutions,
    input.normalizedFields,
  );

  const proxy = inferProxyFields({
    presentFields: fromColumns,
    categoryNames: input.categoryNames,
    archetypeId: input.archetypeId,
    retailerTicker: input.retailerTicker,
  });

  const effectiveSet = new Set<CanonicalFieldKey>([
    ...fromColumns,
    ...proxy.inferredFields,
  ]);

  return {
    resolutions,
    effectiveFields: [...effectiveSet],
    proxySignals: proxy.signals,
    inferredFields: proxy.inferredFields,
  };
}
