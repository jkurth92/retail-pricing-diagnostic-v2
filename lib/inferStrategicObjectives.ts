import type { StrategicObjectiveId } from "@/types/knowledge-client";
import type { PricingPosture, RetailerArchetypeId } from "@/types/retailer-archetypes";

const BY_ARCHETYPE: Record<RetailerArchetypeId, StrategicObjectiveId[]> = {
  grocery: ["value_perception", "traffic_growth"],
  mass: ["value_perception", "traffic_growth"],
  discount: ["value_perception", "margin_expansion"],
  premium_grocery: ["premiumization", "margin_expansion"],
  specialty: ["premiumization", "basket_expansion"],
  apparel_softlines: ["premiumization", "traffic_growth"],
  convenience: ["traffic_growth", "basket_expansion"],
  club: ["value_perception", "basket_expansion"],
};

/** Inferred from retailer type and pricing posture — not shown in Step 2 UI. */
export function inferStrategicObjectives(
  archetypeId: RetailerArchetypeId,
  pricingPosture: PricingPosture,
): StrategicObjectiveId[] {
  const base = [...(BY_ARCHETYPE[archetypeId] ?? ["value_perception"])];
  const postureAdds: StrategicObjectiveId[] = [];

  if (pricingPosture === "EDLP" || pricingPosture === "Value") {
    postureAdds.push("value_perception", "loyalty");
  } else if (pricingPosture === "HiLo" || pricingPosture === "Hybrid") {
    postureAdds.push("traffic_growth", "basket_expansion");
  } else if (pricingPosture === "Premium") {
    return ["premiumization", "margin_expansion"];
  }

  return [...new Set([...base, ...postureAdds])].slice(0, 3);
}
