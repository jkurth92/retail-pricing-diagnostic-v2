"use client";

import type { CategoryExposureRecord } from "@/types/opportunity-exposure";

type CategoryContributionChartProps = {
  categories: CategoryExposureRecord[];
  maxItems?: number;
  embedded?: boolean;
};

export function CategoryContributionChart({
  categories,
  maxItems = 6,
  embedded = false,
}: CategoryContributionChartProps) {
  const sorted = [...categories]
    .sort((a, b) => b.revenueWeightPct - a.revenueWeightPct)
    .slice(0, maxItems);
  const maxPct = Math.max(...sorted.map((c) => c.revenueWeightPct), 1);

  if (sorted.length === 0) return null;

  return (
    <div className={embedded ? "ent-exposure-inner" : "ent-exposure-card"}>
      <ul className="ent-exposure-list">
        {sorted.map((c, i) => (
          <li key={c.category} className="ent-exposure-row">
            <span className="ent-exposure-rank">{i + 1}</span>
            <span className="ent-exposure-name" title={c.category}>
              {c.category}
            </span>
            <span className="ent-exposure-track">
              <span
                className="ent-exposure-fill"
                style={{ width: `${(c.revenueWeightPct / maxPct) * 100}%` }}
              />
            </span>
            <span className="ent-exposure-val">{c.revenueWeightPct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
