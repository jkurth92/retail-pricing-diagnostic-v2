import type { ExecutiveTheme } from "@/types/executive-theme";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";

export type StorylineSectionId =
  | "retailer_profile"
  | "architecture_coherence"
  | "kvi_role_alignment"
  | "promo_markdown_structure"
  | "governance_maturity"
  | "opportunity_framing"
  | "strategic_implications";

export type StorylineSection = {
  id: StorylineSectionId;
  sectionTitle: string;
  sectionNarrative: string;
  supportingThemes: ExecutiveTheme[];
  supportingSignals: SupportingSignal[];
  opportunitySummary: string;
  confidenceSummary: string;
  displayOrder: number;
};
