/**
 * Retailer-aware category alias → commercial scope category.
 */

export type CategoryAliasEntry = {
  aliases: string[];
  normalized: string;
  notes?: string;
};

export const RETAILER_CATEGORY_ALIASES: CategoryAliasEntry[] = [
  { aliases: ["hba", "health beauty", "health & beauty"], normalized: "Beauty" },
  { aliases: ["consumables", "cpg", "center store"], normalized: "Grocery" },
  {
    aliases: ["hardlines", "hard lines", "home improvement"],
    normalized: "Home",
  },
  {
    aliases: ["gm", "general merchandise", "gen merch"],
    normalized: "Home",
  },
  { aliases: ["otc", "pharmacy", "health care"], normalized: "Household essentials" },
  {
    aliases: ["seasonal events", "seasonal event", "holiday"],
    normalized: "Seasonal",
  },
  { aliases: ["apparel", "softlines", "clothing"], normalized: "Apparel" },
  { aliases: ["electronics", "entertainment", "tech"], normalized: "Electronics" },
  { aliases: ["pets", "pet"], normalized: "Pet" },
  { aliases: ["grocery", "food", "fresh", "produce"], normalized: "Grocery" },
  { aliases: ["household", "hh", "cleaning"], normalized: "Household essentials" },
  { aliases: ["home decor", "home décor", "decor"], normalized: "Home decor" },
];

export const SCOPE_CATEGORY_VOCAB = [
  "Grocery",
  "Household essentials",
  "Beauty",
  "Apparel",
  "Electronics",
  "Home",
  "Home decor",
  "Pet",
  "Seasonal",
  "Other",
] as const;
