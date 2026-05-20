export type CompetitorSource = "suggested" | "user_added";

/** A single competitor row in the local suggestion shell (overview context only). */
export type CompetitorCandidate = {
  id: string;
  name: string;
  source: CompetitorSource;
  selectedForPeerView: boolean;
  validationStatus: "suggested" | "requires_validation";
  usageNote: "overview_only";
};

/** @deprecated Alias for CompetitorCandidate — use CompetitorCandidate in new code. */
export type CompetitorEntry = CompetitorCandidate;

export type CompetitorSet = {
  retailerName: string;
  retailerFormat: string;
  competitors: CompetitorCandidate[];
  lastUpdated: string | null;
};
