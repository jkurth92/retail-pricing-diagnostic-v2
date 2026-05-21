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
    <div className="dx-contrib">
      <p className="dx-contrib-title">Category revenue weight (in-scope)</p>
      <ul className="dx-contrib-list">
        {sorted.map((c) => (
          <li key={c.category} className="dx-contrib-row">
            <span className="dx-contrib-label" title={c.category}>
              {c.category}
            </span>
            <span className="dx-contrib-bar-wrap">
              <span
                className="dx-contrib-bar"
                style={{ width: `${(c.revenueWeightPct / maxPct) * 100}%` }}
              />
            </span>
            <span className="dx-contrib-pct">{c.revenueWeightPct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
