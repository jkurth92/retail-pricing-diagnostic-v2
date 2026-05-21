import type { ExecutiveThemeFamily } from "@/types/executive-theme";

export type StrategicImplicationTemplate = {
  families: ExecutiveThemeFamily[];
  implication: string;
};

export const STRATEGIC_IMPLICATION_TEMPLATES: StrategicImplicationTemplate[] = [
  {
    families: ["Architecture", "Premiumization"],
    implication:
      "Current pricing structure may limit effective trade-up monetization and premium tier separation.",
  },
  {
    families: ["Architecture"],
    implication:
      "Compressed tier ladders may reduce recoverable margin without a clear strategic trade-off in value signaling.",
  },
  {
    families: ["KVI", "ValueCommunication"],
    implication:
      "Visible value investment appears broadly distributed rather than strategically concentrated in trip-driving categories.",
  },
  {
    families: ["KVI"],
    implication:
      "KVI role structure may not fully align with how the retailer wants to anchor price image.",
  },
  {
    families: ["Promotions"],
    implication:
      "Promotional cadence may be carrying volume narrative at the expense of everyday price integrity.",
  },
  {
    families: ["Markdown"],
    implication:
      "Markdown and lifecycle structure may reflect sustained clearance pressure rather than planned exits.",
  },
  {
    families: ["Governance", "RoleAlignment"],
    implication:
      "Architecture coherence may not fully support stated premiumization or margin objectives until roles and evidence align.",
  },
  {
    families: ["Premiumization"],
    implication:
      "Premiumization objectives may outpace the observable tier story customers encounter on shelf.",
  },
];

export const MATURITY_IMPLICATION_FRAGMENTS: Record<string, string> = {
  strong: "Pricing maturity signals are broadly coherent with stated ambition.",
  adequate: "Maturity is adequate for thematic diagnosis; execution gaps remain in specific levers.",
  partial: "Maturity and evidence coverage are partial — themes are directional until uploads align.",
  sparse: "Sparse evidence limits confidence; storyline emphasizes architecture questions first.",
};
