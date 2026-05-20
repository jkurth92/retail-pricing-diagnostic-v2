import { getSeedCompetitorNames } from "@/data/competitorSeeds";
import type { CompetitorCandidate } from "@/types/competitors";
import type { RetailerFormat } from "@/types/ui";

let competitorIdCounter = 0;

function nextCompetitorId(): string {
  competitorIdCounter += 1;
  return `competitor-${competitorIdCounter}`;
}

function baseCandidate(
  name: string,
  source: "suggested" | "user_added",
): CompetitorCandidate {
  return {
    id: nextCompetitorId(),
    name,
    source,
    selectedForPeerView: false,
    validationStatus: "requires_validation",
    usageNote: "overview_only",
  };
}

export function createSuggestedCompetitors(
  format: RetailerFormat,
): CompetitorCandidate[] {
  return getSeedCompetitorNames(format).map((name) =>
    baseCandidate(name, "suggested"),
  );
}

export function createUserCompetitor(name: string): CompetitorCandidate {
  return baseCandidate(name.trim(), "user_added");
}

export function getSelectedPeerNames(
  competitors: CompetitorCandidate[],
): string[] {
  return competitors
    .filter((c) => c.selectedForPeerView)
    .map((c) => c.name);
}
