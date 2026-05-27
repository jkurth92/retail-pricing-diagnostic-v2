export type OpportunitySummaryStatus =
  | "thematic_only"
  | "pending_scope_dollars"
  | "insufficient_hypotheses";

export type OpportunityDriver = {
  label: string;
  marginRange: string;
  role: "primary" | "secondary" | "enabler";
};

export type OpportunitySummary = {
  status: OpportunitySummaryStatus;
  totalMarginOpportunityRange: string;
  totalRevenueSensitivityRange: string;
  /** Executive scan line for revenue sensitivity */
  revenueImpactLabel?: string;
  primaryOpportunityDrivers: OpportunityDriver[];
  secondaryOpportunityDrivers: OpportunityDriver[];
  caveats: string[];
  notes: string[];
};

export type OpportunityStorylineOutput = {
  storyline: import("@/types/storyline").StorylineSummary;
  opportunity: OpportunitySummary;
};
