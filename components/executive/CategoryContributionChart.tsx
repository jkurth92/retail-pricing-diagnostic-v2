"use client";

import type { CategoryExposureRecord } from "@/types/opportunity-exposure";

type CategoryContributionChartProps = {
  categories: CategoryExposureRecord[];
  maxItems?: number;
};

export function CategoryContributionChart({
  categories,
  maxItems = 6,
}: CategoryContributionChartProps) {
  const sorted = [...categories]
    .sort((a, b) => b.revenueWeightPct - a.revenueWeightPct)
    .slice(0, maxItems);
  const maxPct = Math.max(...sorted.map((c) => c.revenueWeightPct), 1);

  if (sorted.length === 0) return null;

  return (
    <div className="ent-exposure-inner mt-1">
      <ul className="ent-exposure-list m-0 list-none space-y-3 p-0">
        {sorted.map((c, i) => (
          <li
            key={c.category}
            className="flex items-center gap-3"
          >
            <span className="ent-exposure-rank w-5 shrink-0 text-xs font-bold text-[var(--accent-mid)]">
              {i + 1}
            </span>
            <span
              className="ent-exposure-name w-28 shrink-0 truncate text-sm font-semibold text-[var(--text-navy)]"
              title={c.category}
            >
              {c.category}
            </span>
            <span className="ent-exposure-track min-w-0 flex-1 h-1.5 overflow-hidden rounded-full bg-[var(--accent-light)]">
              <span
                className="ent-exposure-fill block h-full min-w-[4px] rounded-full bg-gradient-to-r from-[var(--accent-mid)] to-[var(--accent-deep)]"
                style={{ width: `${(c.revenueWeightPct / maxPct) * 100}%` }}
              />
            </span>
            <span className="ent-exposure-val w-11 shrink-0 text-right text-sm font-semibold tabular-nums text-[var(--accent-deep)]">
              {c.revenueWeightPct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
