import type { ExecutiveTheme } from "@/types/executive-theme";
import type { OpportunityCalculationTrace } from "@/types/opportunity-trace";
import type { DirectionalRevenueSensitivityEstimate } from "@/types/revenue-sensitivity";

export type StorylineSummary = {
  id: string;
  title: string;
  executiveSummary: string;
  primaryThemes: ExecutiveTheme[];
  secondaryThemes: ExecutiveTheme[];
  marginOpportunityTotalRange: string;
  marginOpportunityTotalTrace?: OpportunityCalculationTrace;
  revenueSensitivitySummary: string;
  /** Structured directional revenue sensitivity (secondary to margin) */
  revenueSensitivityEstimate?: DirectionalRevenueSensitivityEstimate;
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
