import type { ConfidenceTemplate } from "@/types/benchmark-concepts";

export const CONFIDENCE_TEMPLATES: ConfidenceTemplate[] = [
  {
    id: "confidence-high-archetype-match",
    confidenceLevel: "high",
    explanation:
      "Category signal matches a documented inference rule for the selected retailer archetype.",
    evidenceRequirements: [
      "Retailer archetype selected",
      "Category hint matches rule category signals",
      "Pricing posture compatible with archetype",
    ],
  },
  {
    id: "confidence-medium-partial",
    confidenceLevel: "medium",
    explanation:
      "Archetype expectations apply but category hint is partial or objectives shift emphasis.",
    evidenceRequirements: [
      "Retailer archetype selected",
      "General category role from archetype defaults",
    ],
  },
  {
    id: "confidence-low-hint-missing",
    confidenceLevel: "low",
    explanation:
      "Inference uses archetype defaults only; provide a category hint for higher confidence.",
    evidenceRequirements: ["Retailer archetype selected"],
  },
  {
    id: "confidence-high-posture-align",
    confidenceLevel: "high",
    explanation:
      "Pricing posture aligns with archetype’s common postures and reinforces role inference.",
    evidenceRequirements: [
      "Posture listed in archetype pricingPostures",
      "Strategic objectives consistent with suggested role",
    ],
  },
  {
    id: "confidence-medium-objective-mix",
    confidenceLevel: "medium",
    explanation:
      "Multiple strategic objectives apply; role mix is illustrative until client data aligns.",
    evidenceRequirements: [
      "One or more strategic objectives selected",
      "Normalized upload fields pending",
    ],
  },
];

export const CONFIDENCE_TEMPLATE_BY_LEVEL: Record<
  import("@/types/benchmark-concepts").ConfidenceLevel,
  ConfidenceTemplate
> = {
  high: CONFIDENCE_TEMPLATES[0],
  medium: CONFIDENCE_TEMPLATES[1],
  low: CONFIDENCE_TEMPLATES[2],
};
