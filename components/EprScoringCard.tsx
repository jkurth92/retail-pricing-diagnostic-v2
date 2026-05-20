import { Card } from "@/components/Card";
import { calculateEprAverage, getEprMaturityLabel } from "@/lib/eprUi";
import { EPR_DIMENSIONS, type EprDimension, type EprScores } from "@/types/ui";

type EprScoringCardProps = {
  scores: EprScores;
  onScoreChange: (dimension: EprDimension, score: number) => void;
};

const SCORE_OPTIONS = [1, 2, 3, 4, 5] as const;

export function EprScoringCard({ scores, onScoreChange }: EprScoringCardProps) {
  const average = calculateEprAverage(scores);
  const maturityLabel = getEprMaturityLabel(average);

  return (
    <Card>
      <p className="micro-label mb-2">EPR assessment</p>
      <h3 className="section-title">EPR Scoring</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Score the retailer across the six EPR dimensions.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent-light)] px-4 py-1.5">
        <span className="text-sm font-medium text-[var(--text-navy)]">
          Current maturity:
        </span>
        <span className="text-sm font-semibold text-[var(--accent)]">
          {maturityLabel} ({average.toFixed(1)}/5)
        </span>
      </div>
      <div className="mt-6 space-y-5">
        {EPR_DIMENSIONS.map((dimension) => (
          <div
            key={dimension.key}
            className="flex flex-col gap-3 border-b border-[var(--border)] pb-5 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-medium text-[var(--text-navy)] sm:max-w-xs">
              {dimension.label}
            </p>
            <div className="flex gap-1.5">
              {SCORE_OPTIONS.map((score) => {
                const isSelected = scores[dimension.key] === score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => onScoreChange(dimension.key, score)}
                    className={`h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                    }`}
                    aria-label={`${dimension.label}: score ${score}`}
                    aria-pressed={isSelected}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
