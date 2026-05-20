import type { RetailerFormat } from "@/types/ui";

export const COMPETITOR_SEEDS: Record<RetailerFormat, string[]> = {
  Grocery: ["Walmart", "Kroger", "Albertsons", "Aldi", "Costco"],
  Mass: ["Walmart", "Target", "Amazon", "Costco", "Meijer"],
  Drug: ["CVS", "Walgreens", "Rite Aid", "Walmart"],
  Convenience: ["7-Eleven", "Circle K", "Casey's", "Wawa"],
  Club: ["Costco", "Sam's Club", "BJ's"],
  Specialty: ["Amazon", "Walmart", "Target"],
  Other: ["Walmart", "Amazon", "Costco"],
};

export function getSeedCompetitorNames(format: RetailerFormat): string[] {
  return [...COMPETITOR_SEEDS[format]];
}
