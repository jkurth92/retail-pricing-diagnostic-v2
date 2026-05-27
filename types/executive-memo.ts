export type OpportunityLeverLine = {
  leverLabel: string;
  marginRange: string;
};

export type ExecutiveMemo = {
  title: string;
  /** Company & market context — scale, margins, peers */
  retailerContext: string;
  /** What the pricing review surfaced */
  pricingObservations: string;
  /** Strategic implications for leadership */
  implications: string;
  /** Discussion questions for the working session */
  discussionQuestions: string[];
  notes: string[];
  /** @deprecated Legacy flat answer — derived for older consumers */
  executiveAnswer?: string;
  opportunityBreakdown?: {
    totalRange: string;
    byLever: OpportunityLeverLine[];
    synthesis: string;
  };
  structuralThemes?: string[];
  leadershipFocusAreas?: string[];
  supportingNarrative?: string;
};
