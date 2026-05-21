import type { HypothesisFamily } from "@/types/diagnostic-hypotheses";
import type { SupportingSignal } from "@/types/diagnostic-hypotheses";

export type SignalDefinition = {
  signalId: string;
  signalName: string;
  signalFamily: HypothesisFamily | "CrossCutting";
  defaultStrength: SupportingSignal["signalStrength"];
  explanation: string;
};

export const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  {
    signalId: "sig-ladder-compression",
    signalName: "Compressed price ladders",
    signalFamily: "Architecture",
    defaultStrength: "strong",
    explanation:
      "Tier spacing descriptors suggest narrow gaps between adjacent price positions.",
  },
  {
    signalId: "sig-weak-premium-gap",
    signalName: "Weak premium tier separation",
    signalFamily: "Architecture",
    defaultStrength: "moderate",
    explanation:
      "Premium vs mainstream spread may be insufficient for clear trade-up storytelling.",
  },
  {
    signalId: "sig-weak-trade-up",
    signalName: "Weak trade-up structure",
    signalFamily: "Architecture",
    defaultStrength: "moderate",
    explanation:
      "Foreground and premium roles lack clear separation from value anchors.",
  },
  {
    signalId: "sig-weak-opp",
    signalName: "Weak OPP signaling",
    signalFamily: "Architecture",
    defaultStrength: "moderate",
    explanation:
      "Opening price point role underrepresented for value-led archetype context.",
  },
  {
    signalId: "sig-weak-pl-nb",
    signalName: "Weak PL/NB separation",
    signalFamily: "Architecture",
    defaultStrength: "moderate",
    explanation:
      "Private label vs national brand ladder gap not clearly articulated in structure.",
  },
  {
    signalId: "sig-incoherent-ladder",
    signalName: "Incoherent ladder structure",
    signalFamily: "Architecture",
    defaultStrength: "strong",
    explanation:
      "Pack-size or unit-price ladder monotonicity descriptors incomplete or inconsistent.",
  },
  {
    signalId: "sig-kvi-breadth-high",
    signalName: "Broad KVI penetration",
    signalFamily: "KVI",
    defaultStrength: "moderate",
    explanation:
      "KVI breadth across assortment may exceed archetype-typical concentration.",
  },
  {
    signalId: "sig-kvi-concentration-weak",
    signalName: "Weak KVI concentration",
    signalFamily: "KVI",
    defaultStrength: "moderate",
    explanation:
      "KVI revenue or SKU concentration may be diffuse relative to traffic-driver role.",
  },
  {
    signalId: "sig-kvi-misaligned",
    signalName: "Misaligned KVI investment",
    signalFamily: "KVI",
    defaultStrength: "moderate",
    explanation:
      "Value perception objectives paired with profit-driver-heavy inferred roles.",
  },
  {
    signalId: "sig-weak-destination",
    signalName: "Weak destination emphasis",
    signalFamily: "KVI",
    defaultStrength: "weak",
    explanation:
      "Destination or premiumization categories underweighted for specialty/premium archetypes.",
  },
  {
    signalId: "sig-promo-dependency",
    signalName: "Promo dependency pattern",
    signalFamily: "Promotions",
    defaultStrength: "strong",
    explanation:
      "Promotional cadence descriptors suggest reliance on depth for volume.",
  },
  {
    signalId: "sig-weak-base-price",
    signalName: "Weak base-price integrity",
    signalFamily: "Promotions",
    defaultStrength: "moderate",
    explanation:
      "Gap between everyday and promotional price may erode reference price clarity.",
  },
  {
    signalId: "sig-broad-discounting",
    signalName: "Broad indiscriminate discounting",
    signalFamily: "Promotions",
    defaultStrength: "moderate",
    explanation:
      "Promo overlap or assortment share descriptors suggest wide promotional footprint.",
  },
  {
    signalId: "sig-markdown-cadence",
    signalName: "Aggressive markdown cadence",
    signalFamily: "Markdown",
    defaultStrength: "strong",
    explanation:
      "Markdown frequency and aging descriptors indicate sustained clearance pressure.",
  },
  {
    signalId: "sig-weak-lifecycle",
    signalName: "Weak lifecycle discipline",
    signalFamily: "Markdown",
    defaultStrength: "moderate",
    explanation:
      "Time-in-markdown structure may lack clear exit windows in descriptive preview.",
  },
  {
    signalId: "sig-weak-exit",
    signalName: "Weak exit timing structure",
    signalFamily: "Markdown",
    defaultStrength: "moderate",
    explanation:
      "Recovery rate descriptors incomplete for seasonal or apparel contexts.",
  },
  {
    signalId: "sig-governance-weak",
    signalName: "Weak strategic consistency",
    signalFamily: "Governance",
    defaultStrength: "moderate",
    explanation:
      "Multiple strategic objectives without coherent role-architecture alignment.",
  },
  {
    signalId: "sig-sophistication-limited",
    signalName: "Limited pricing sophistication",
    signalFamily: "Governance",
    defaultStrength: "weak",
    explanation:
      "EPR or maturity context suggests execution gaps relative to ambition.",
  },
  {
    signalId: "sig-execution-leakage",
    signalName: "Execution leakage risk",
    signalFamily: "Governance",
    defaultStrength: "weak",
    explanation:
      "Pattern readiness partial while unlock status claims availability.",
  },
  {
    signalId: "sig-role-mismatch",
    signalName: "Role structure mismatch",
    signalFamily: "RoleAlignment",
    defaultStrength: "moderate",
    explanation:
      "Inferred category role diverges from archetype-typical traffic or profit emphasis.",
  },
  {
    signalId: "sig-value-overinvest",
    signalName: "Value communication over-investment",
    signalFamily: "ValueCommunication",
    defaultStrength: "moderate",
    explanation:
      "Value perception objective with compressed architecture and high KVI visibility.",
  },
  {
    signalId: "sig-premiumization-gap",
    signalName: "Premiumization structure gap",
    signalFamily: "Premiumization",
    defaultStrength: "moderate",
    explanation:
      "Premiumization objective with weak premium tier and trade-up signals.",
  },
  {
    signalId: "sig-architecture-partial",
    signalName: "Partial architecture evidence",
    signalFamily: "CrossCutting",
    defaultStrength: "weak",
    explanation:
      "Pack-size or tier fields missing in normalization preview — architecture signals tentative.",
  },
  {
    signalId: "sig-inference-strong",
    signalName: "Strong role inference match",
    signalFamily: "CrossCutting",
    defaultStrength: "strong",
    explanation:
      "Category hint matches documented inference rule for archetype.",
  },
  {
    signalId: "sig-inference-weak",
    signalName: "Weak role inference",
    signalFamily: "CrossCutting",
    defaultStrength: "weak",
    explanation:
      "Role inference relies on archetype defaults without category signal match.",
  },
];

export const SIGNAL_BY_ID = new Map(
  SIGNAL_DEFINITIONS.map((s) => [s.signalId, s] as const),
);
