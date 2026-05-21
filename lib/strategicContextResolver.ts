import type { CompanyProfile } from "@/types/company-profile";
import type {
  RetailerContext,
  StrategicContextSuggestion,
} from "@/types/retailer-context";
import type { RetailerArchetypeId } from "@/types/retailer-archetypes";
import type { PricingPosture } from "@/types/retailer-archetypes";

function suggestArchetype(
  context: RetailerContext,
  profile: CompanyProfile | null,
): RetailerArchetypeId | null {
  const industry = (
    profile?.industry ??
    context.subSector ??
    ""
  ).toLowerCase();
  const sector = (profile?.sector ?? context.sector ?? "").toLowerCase();
  const name = context.retailerName.toLowerCase();

  if (
    industry.includes("warehouse") ||
    name.includes("costco") ||
    name.includes("sam's")
  ) {
    return "club";
  }
  if (
    industry.includes("food") ||
    industry.includes("grocery") ||
    industry.includes("hypermarket") ||
    name.includes("kroger") ||
    name.includes("publix") ||
    name.includes("aldi")
  ) {
    return "grocery";
  }
  if (
    industry.includes("drug") ||
    name.includes("cvs") ||
    name.includes("walgreens")
  ) {
    return "convenience";
  }
  if (
    industry.includes("specialty") ||
    name.includes("best buy") ||
    sector.includes("discretionary")
  ) {
    return "specialty";
  }
  if (
    industry.includes("convenience") ||
    name.includes("dollar")
  ) {
    return "convenience";
  }
  if (
    industry.includes("department") ||
    name.includes("target") ||
    name.includes("walmart")
  ) {
    return "mass";
  }
  return context.publicCompany ? "mass" : null;
}

function suggestPosture(
  context: RetailerContext,
  profile: CompanyProfile | null,
): PricingPosture | null {
  const text = `${context.companyOverview ?? ""} ${profile?.description ?? ""} ${context.retailerName}`.toLowerCase();
  if (text.includes("edlp") || text.includes("everyday low") || text.includes("warehouse")) {
    return "EDLP";
  }
  if (text.includes("promo") || text.includes("high-low") || text.includes("hi-lo")) {
    return "HiLo";
  }
  if (text.includes("premium")) {
    return "Premium";
  }
  return null;
}

export function buildStrategicContextSuggestions(
  context: RetailerContext,
  profile: CompanyProfile | null,
): StrategicContextSuggestion {
  const archetypeId = suggestArchetype(context, profile);
  const posture = suggestPosture(context, profile);
  const overviewNotes: string[] = [];
  const rationale: string[] = [];

  if (context.publicCompany && context.ticker) {
    overviewNotes.push(
      `Public company context (${context.ticker}) available for overview enrichment.`,
    );
    rationale.push("Ticker-linked profile informs scale and sector framing only.");
  } else {
    overviewNotes.push(
      "Private or unrecognized retailer — rely on manual strategic context and client uploads.",
    );
    rationale.push("No public ticker mapping; suggestions use name and alias hints only.");
  }

  if (archetypeId === "mass") {
    overviewNotes.push(
      "Mass retailer with large store base and broad consumables mix — visible value and architecture separation are typically central.",
    );
  }
  if (archetypeId === "grocery") {
    overviewNotes.push(
      "Grocery context — trip-driving categories and EDLP / high-low posture tension often shape price image.",
    );
  }
  if (archetypeId === "club") {
    overviewNotes.push(
      "Warehouse / club model — membership value narrative and limited SKU breadth reduce classical promo dependency.",
    );
  }
  if (archetypeId === "specialty") {
    overviewNotes.push(
      "Specialty retailer — category authority and seasonality may elevate markdown and architecture themes.",
    );
  }

  if (context.bannerPortfolio) {
    overviewNotes.push(`Banner portfolio: ${context.bannerPortfolio}.`);
  }
  if (context.geography) {
    overviewNotes.push(`Geography: ${context.geography}.`);
  }

  rationale.push(
    "Suggestions are optional — consultant selections on Client context always take precedence.",
  );

  return {
    suggestedArchetypeId: archetypeId,
    suggestedPosture: posture,
    overviewNotes,
    rationale,
  };
}

export function formatStrategicContextSummary(
  suggestions: StrategicContextSuggestion,
): string {
  return suggestions.overviewNotes.slice(0, 3).join(" ");
}
