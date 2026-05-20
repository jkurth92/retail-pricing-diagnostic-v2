import type { EprScores } from "@/types/ui";

export function calculateEprAverage(scores: EprScores): number {
  const values = Object.values(scores);
  const sum = values.reduce((acc, score) => acc + score, 0);
  return sum / values.length;
}

export function getEprMaturityLabel(average: number): string {
  if (average < 2) return "Emerging";
  if (average < 3.5) return "Developing";
  if (average < 4.5) return "Established";
  return "Advanced";
}
