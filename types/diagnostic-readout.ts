import type { ExecutiveSummary } from "@/types/executive-summary";
import type { StorylineSection } from "@/types/storyline-sections";
import type { OpportunitySummary } from "@/types/opportunity-summary";
import type { ExecutiveTheme } from "@/types/executive-theme";

export type DiagnosticReadout = {
  engineVersion: string;
  generatedAt: string;
  guardrailMessage: string;
  executiveSummary: ExecutiveSummary;
  storylineSections: StorylineSection[];
  opportunityOverview: string;
  opportunityDetail: OpportunitySummary;
  strategicImplications: string[];
  supportingThemes: ExecutiveTheme[];
  notes: string[];
};
