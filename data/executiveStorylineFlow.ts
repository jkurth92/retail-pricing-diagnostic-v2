import type { StorylineSectionId } from "@/types/storyline-sections";
import type { ExecutiveThemeFamily } from "@/types/executive-theme";

export type ExecutiveStorylineSectionDef = {
  id: StorylineSectionId;
  sectionTitle: string;
  displayOrder: number;
  themeFamilies: ExecutiveThemeFamily[];
  narrativeLead: string;
};

/** Narrative flow hierarchy for Step 7 executive readout. */
export const EXECUTIVE_STORYLINE_FLOW: ExecutiveStorylineSectionDef[] = [
  {
    id: "retailer_profile",
    sectionTitle: "Retailer pricing profile",
    displayOrder: 1,
    themeFamilies: [],
    narrativeLead:
      "The retailer’s pricing posture and role structure establish the lens for all structural themes below.",
  },
  {
    id: "architecture_coherence",
    sectionTitle: "Architecture coherence",
    displayOrder: 2,
    themeFamilies: ["Architecture", "Premiumization"],
    narrativeLead:
      "Architecture coherence is the primary structural lens — tier separation, trade-up paths, and monetization spacing.",
  },
  {
    id: "kvi_role_alignment",
    sectionTitle: "KVI and role alignment",
    displayOrder: 3,
    themeFamilies: ["KVI", "ValueCommunication", "RoleAlignment"],
    narrativeLead:
      "Visible value investment and category role alignment shape how customers interpret price image.",
  },
  {
    id: "promo_markdown_structure",
    sectionTitle: "Promotion and markdown structure",
    displayOrder: 4,
    themeFamilies: ["Promotions", "Markdown"],
    narrativeLead:
      "Promotional rhythm and markdown lifecycle describe how depth and clearance interact with everyday price.",
  },
  {
    id: "governance_maturity",
    sectionTitle: "Governance and maturity",
    displayOrder: 5,
    themeFamilies: ["Governance", "RoleAlignment"],
    narrativeLead:
      "Governance and maturity context determine how much structural opportunity is capturable in practice.",
  },
  {
    id: "opportunity_framing",
    sectionTitle: "Opportunity framing",
    displayOrder: 6,
    themeFamilies: [],
    narrativeLead:
      "Recoverable value pools are thematic and margin-led — bounded ranges, not optimized price prescriptions.",
  },
  {
    id: "strategic_implications",
    sectionTitle: "Strategic implications",
    displayOrder: 7,
    themeFamilies: [],
    narrativeLead:
      "Structural implications describe what the pricing architecture means for strategic coherence.",
  },
];
