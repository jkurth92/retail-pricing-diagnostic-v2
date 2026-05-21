/** Client workflow selections that feed knowledge inference (no rules). */

export type StrategicObjectiveId =
  | "traffic_growth"
  | "margin_expansion"
  | "premiumization"
  | "basket_expansion"
  | "loyalty"
  | "value_perception";

export type StrategicObjective = {
  id: StrategicObjectiveId;
  label: string;
  description: string;
};

export const STRATEGIC_OBJECTIVES: StrategicObjective[] = [
  {
    id: "traffic_growth",
    label: "Traffic growth",
    description: "Prioritize visible value and trip-driving categories.",
  },
  {
    id: "margin_expansion",
    label: "Margin expansion",
    description: "Emphasize architecture and mix management over depth.",
  },
  {
    id: "premiumization",
    label: "Premiumization",
    description: "Support tier clarity and premium tier expansion.",
  },
  {
    id: "basket_expansion",
    label: "Basket expansion",
    description: "Favor basket builders and complementary architecture.",
  },
  {
    id: "loyalty",
    label: "Loyalty",
    description: "Stabilize EDLP signals and repeat-purchase categories.",
  },
  {
    id: "value_perception",
    label: "Value perception",
    description: "Strengthen KVI and foreground signaling without verdicts.",
  },
];
