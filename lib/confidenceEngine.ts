import { CONFIDENCE_TEMPLATE_BY_LEVEL } from "@/data/confidenceTemplates";
import type { ConfidenceLevel, ConfidenceTemplate } from "@/types/benchmark-concepts";
import type { PricingPosture } from "@/types/retailer-archetypes";
import type { RetailerArchetype } from "@/types/retailer-archetypes";

export function resolveConfidence(
  hasCategoryMatch: boolean,
  hasCategoryHint: boolean,
  archetype: RetailerArchetype | undefined,
  posture: PricingPosture,
  objectiveCount: number,
): ConfidenceLevel {
  if (!archetype) return "low";
  const postureAligns = archetype.pricingPostures.includes(posture);
  if (hasCategoryMatch && postureAligns) return "high";
  if (hasCategoryMatch || (hasCategoryHint && postureAligns)) return "medium";
  if (hasCategoryHint && objectiveCount > 0) return "medium";
  if (!hasCategoryHint) return "low";
  return "medium";
}

export function getConfidenceTemplate(
  level: ConfidenceLevel,
): ConfidenceTemplate {
  return CONFIDENCE_TEMPLATE_BY_LEVEL[level];
}

export function confidenceExplanation(
  level: ConfidenceLevel,
  method: string,
): string {
  const template = getConfidenceTemplate(level);
  return `${template.explanation} Method: ${method}.`;
}
