import type { RetailerArchetypeId, PricingPosture } from "@/types/retailer-archetypes";
import type { StrategicObjectiveId } from "@/types/knowledge-client";

export type KnowledgeRegistryContext = {
  archetypeId: RetailerArchetypeId;
  pricingPosture: PricingPosture;
  strategicObjectives: StrategicObjectiveId[];
  categoryHint?: string;
};
