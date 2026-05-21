import { getArchetype, postureLabel } from "@/lib/archetypeContext";
import { inferRoles } from "@/lib/roleInference";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { RetailerPricingProfile } from "@/types/executive-summary";
import type { EprScores } from "@/types/ui";
import { STRATEGIC_OBJECTIVES } from "@/types/knowledge-client";

function eprAverage(scores: EprScores): number {
  const vals = Object.values(scores);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function maturityLabel(avg: number): string {
  if (avg >= 3.8) return "Advancing maturity with room to sharpen execution in promotions and architecture.";
  if (avg >= 3) return "Mid maturity — structural themes are interpretable; tooling and discipline vary by lever.";
  if (avg >= 2) return "Developing maturity — governance and evidence alignment will shape capture.";
  return "Early maturity — storyline emphasizes structural questions before execution depth.";
}

export function buildRetailerPricingProfile(
  knowledge: KnowledgeRegistryContext,
  eprScores: EprScores,
  strategicContext?: string,
): RetailerPricingProfile {
  const archetype = getArchetype(knowledge.archetypeId);
  const inference = inferRoles({
    archetypeId: knowledge.archetypeId,
    pricingPosture: knowledge.pricingPosture,
    strategicObjectives: knowledge.strategicObjectives,
    categoryHint: knowledge.categoryHint,
  });

  const objectives = knowledge.strategicObjectives
    .map((id) => STRATEGIC_OBJECTIVES.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const mix = inference.itemMixSuggestion.mix
    .map((m) => m.label)
    .join("; ");

  const archFamilies =
    archetype?.expectedArchitecturePatterns.slice(0, 2).join(". ") ??
    "Standard ladder and pack-value patterns expected.";

  return {
    archetype: archetype?.archetypeName ?? knowledge.archetypeId,
    posture: postureLabel(knowledge.pricingPosture),
    inferredCategoryRoleStructure: `${inference.categorySuggestion.roleName}${knowledge.categoryHint ? ` (e.g. ${knowledge.categoryHint})` : ""}`,
    inferredItemRoleStructure: mix || "Role mix pending category context",
    architectureProfile: archFamilies,
    maturityProfile: maturityLabel(eprAverage(eprScores)),
    strategicOrientation:
      objectives.length > 0
        ? `Stated objectives: ${objectives}.`
        : "Strategic objectives not yet selected — storyline uses archetype defaults.",
    notes: [
      strategicContext?.trim()
        ? `Consultant context: ${strategicContext.trim()}`
        : "No additional strategic context note provided.",
      inference.overrideNote,
    ],
  };
}
