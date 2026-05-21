import { BENCHMARK_CONCEPTS } from "@/data/benchmarkConcepts";
import { CATEGORY_ROLE_BY_ID } from "@/data/categoryRoles";
import {
  RETAILER_ARCHETYPE_BY_ID,
  RETAILER_ARCHETYPES,
} from "@/data/retailerArchetypes";
import type { BenchmarkConcept } from "@/types/benchmark-concepts";
import type { RetailerArchetypeId, PricingPosture } from "@/types/retailer-archetypes";
import type { CategoryRoleId } from "@/types/role-inference";
import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type { RetailerFormat } from "@/types/ui";

export function getArchetype(id: RetailerArchetypeId) {
  return RETAILER_ARCHETYPE_BY_ID.get(id);
}

export function listArchetypes() {
  return RETAILER_ARCHETYPES;
}

/** Map legacy retailer format dropdown to ontology archetype. */
export function formatToArchetypeId(format: RetailerFormat): RetailerArchetypeId {
  const map: Record<RetailerFormat, RetailerArchetypeId> = {
    Grocery: "grocery",
    Mass: "mass",
    Specialty: "specialty",
    Convenience: "convenience",
    Drug: "discount",
    Club: "club",
    Other: "grocery",
  };
  return map[format];
}

/** Map legacy UI pricing posture to ontology posture. */
export function legacyPostureToKnowledge(
  posture: string,
): PricingPosture {
  if (posture === "EDLP") return "EDLP";
  if (posture === "High-low") return "HiLo";
  if (posture === "Hybrid") return "Hybrid";
  return "Hybrid";
}

export function postureLabel(posture: PricingPosture): string {
  if (posture === "HiLo") return "Hi-Lo";
  return posture;
}

export function expectedStructureHeadline(
  archetypeId: RetailerArchetypeId,
  posture: PricingPosture,
): string {
  const archetype = getArchetype(archetypeId);
  const name = archetype?.archetypeName ?? archetypeId;
  return `Expected pricing structure for ${name} / ${postureLabel(posture)} retailers`;
}

export function likelyTrafficCategories(archetypeId: RetailerArchetypeId): string[] {
  const archetype = getArchetype(archetypeId);
  if (!archetype) return [];
  return archetype.expectedCategoryRoles
    .filter((id) => id === "traffic_driver" || id === "convenience_urgency")
    .flatMap((id) => CATEGORY_ROLE_BY_ID.get(id)?.commonCategories ?? [])
    .slice(0, 5);
}

export function architectureMonetizationCategories(
  archetypeId: RetailerArchetypeId,
): string[] {
  const archetype = getArchetype(archetypeId);
  if (!archetype) return [];
  const roles: CategoryRoleId[] = ["profit_driver", "premiumization", "basket_builder"];
  return roles
    .filter((r) => archetype.expectedCategoryRoles.includes(r))
    .flatMap((id) => CATEGORY_ROLE_BY_ID.get(id)?.commonCategories ?? [])
    .slice(0, 5);
}

export function suggestedKviConcentrationNote(archetypeId: RetailerArchetypeId): string {
  const archetype = getArchetype(archetypeId);
  if (!archetype) return "Suggested KVI concentration structure pending archetype.";
  const mix = archetype.expectedItemRoleMix
    .filter((m) => m.roleId === "kvi" || m.roleId === "super_kvi")
    .map((m) => `${m.typicalSharePct} ${m.roleId.replace("_", " ")}`)
    .join("; ");
  return mix
    ? `Suggested KVI concentration structure: ${mix} (illustrative, not calculated).`
    : "Suggested KVI concentration structure varies by category role.";
}

export function benchmarkConceptsForArchetype(
  archetypeId: RetailerArchetypeId,
): BenchmarkConcept[] {
  return BENCHMARK_CONCEPTS.filter((c) =>
    c.applicableArchetypes.includes(archetypeId),
  );
}

export function objectivesAdjustEmphasis(
  objectives: StrategicObjectiveId[],
): string[] {
  const notes: string[] = [];
  if (objectives.includes("value_perception")) {
    notes.push("Emphasis: KVI and value visibility concepts (descriptive only).");
  }
  if (objectives.includes("premiumization")) {
    notes.push("Emphasis: trade-up clarity and premium tier concepts.");
  }
  if (objectives.includes("margin_expansion")) {
    notes.push("Emphasis: profit-driver roles and architecture monetization.");
  }
  if (objectives.includes("traffic_growth")) {
    notes.push("Likely traffic-driving categories weighted in inference preview.");
  }
  if (objectives.includes("basket_expansion")) {
    notes.push("Basket builder roles highlighted in expected structure.");
  }
  if (objectives.includes("loyalty")) {
    notes.push("EDLP stability and repeat-purchase categories in rationale context.");
  }
  return notes;
}
