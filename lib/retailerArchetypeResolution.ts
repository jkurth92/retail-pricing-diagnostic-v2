import { RETAILER_ARCHETYPE_HINTS } from "@/data/retailerArchetypeHints";
import type { RetailerArchetypeHint } from "@/data/retailerArchetypeHints";
import type { PricingPosture as OntologyPosture } from "@/types/retailer-archetypes";
import type { PricingPosture as UiPosture } from "@/types/ui";

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveRetailerArchetypeHint(
  retailerName: string,
  ticker?: string | null,
): RetailerArchetypeHint | null {
  const normalized = normalizeName(retailerName);
  const tickerKey = ticker?.trim().toUpperCase() ?? null;

  for (const hint of RETAILER_ARCHETYPE_HINTS) {
    if (tickerKey && hint.tickers?.includes(tickerKey)) {
      return hint;
    }
    for (const alias of hint.aliases) {
      const a = normalizeName(alias);
      if (normalized === a || normalized.includes(a) || a.includes(normalized)) {
        return hint;
      }
    }
  }
  return null;
}

/** Map ontology posture to legacy UI dropdown values. */
export function ontologyPostureToUi(posture: OntologyPosture): UiPosture {
  switch (posture) {
    case "EDLP":
      return "EDLP";
    case "HiLo":
      return "High-low";
    case "Hybrid":
      return "Hybrid";
    case "Premium":
    case "Value":
    case "Specialty":
    case "Convenience":
      return "Hybrid";
    default:
      return "Hybrid";
  }
}
