import type { ExecutiveTheme } from "@/types/executive-theme";

export type StorylineSummary = {
  id: string;
  title: string;
  executiveSummary: string;
  primaryThemes: ExecutiveTheme[];
  secondaryThemes: ExecutiveTheme[];
  marginOpportunityTotalRange: string;
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
