/**
 * Infers tier structure when explicit tier fields are absent.
 */

import type { TierInferenceBand } from "@/types/data-interpretation";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";

export type TierInferenceInput = {
  hasExplicitTier: boolean;
  hasPrice: boolean;
  hasPackSize: boolean;
  hasPrivateLabelFlag: boolean;
  categoryCount: number;
  archetypeId: RetailerArchetypeId;
};

export function inferTierStructure(input: TierInferenceInput): TierInferenceBand[] {
  if (input.hasExplicitTier) {
    return [
      {
        tier: "entry",
        inferredFrom: "Explicit tier field in normalized schema",
        confidence: 0.95,
      },
      {
        tier: "mainstream",
        inferredFrom: "Explicit tier field in normalized schema",
        confidence: 0.95,
      },
      {
        tier: "premium",
        inferredFrom: "Explicit tier field in normalized schema",
        confidence: 0.95,
      },
    ];
  }

  if (!input.hasPrice) {
    return [
      {
        tier: "mainstream",
        inferredFrom: "Price field absent — tier bands deferred to scope synthesis",
        confidence: 0.35,
      },
    ];
  }

  const bands: TierInferenceBand[] = [
    {
      tier: "entry",
      inferredFrom: input.hasPackSize
        ? "Inferred from price clustering and pack-size relationships"
        : "Inferred from category-relative price clustering",
      confidence: input.hasPackSize ? 0.72 : 0.62,
    },
    {
      tier: "mainstream",
      inferredFrom: "Category median price anchor (synthetic ladder)",
      confidence: 0.78,
    },
    {
      tier: "premium",
      inferredFrom:
        input.archetypeId === "premium_grocery" || input.archetypeId === "specialty"
          ? "Premium band inferred from archetype-typical spacing"
          : "Upper-band prices inferred vs mainstream cluster",
      confidence: 0.68,
    },
  ];

  if (input.hasPrivateLabelFlag) {
    bands.push({
      tier: "mainstream",
      inferredFrom: "PL/NB flags support mainstream tier separation",
      confidence: 0.75,
    });
  }

  return bands.slice(0, 4);
}
