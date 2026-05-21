import type { ExecutiveTheme } from "@/types/executive-theme";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";

export type StorylineSummary = {
  id: string;
  title: string;
  executiveSummary: string;
  primaryThemes: ExecutiveTheme[];
  secondaryThemes: ExecutiveTheme[];
  marginOpportunityTotalRange: string;
  marginOpportunityTotalTrace?: OpportunityCalculationTrace;
  revenueSensitivitySummary: string;
  confidenceSummary: string;
  narrative: string;
  notes: string[];
};

export type StorylineEngineOutput = {
  engineVersion: string;
  generatedAt: string;
  guardrailMessage: string;
  storyline: StorylineSummary;
  suppressedThemeCount: number;
};
