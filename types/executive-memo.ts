export type OpportunityLeverLine = {
  leverLabel: string;
  marginRange: string;
};

export type ExecutiveMemo = {
  title: string;
  executiveAnswer: string;
  opportunityBreakdown: {
    totalRange: string;
    byLever: OpportunityLeverLine[];
    synthesis: string;
  };
  structuralThemes: string[];
  leadershipFocusAreas: string[];
  supportingNarrative: string;
  notes: string[];
};
