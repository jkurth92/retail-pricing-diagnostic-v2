"use client";

import type { LeverContributionRow } from "@/lib/opportunityLeverAttribution";

type OpportunityLeverBreakdownProps = {
  rows: LeverContributionRow[];
};

export function OpportunityLeverBreakdown({ rows }: OpportunityLeverBreakdownProps) {
  if (rows.length === 0) return null;

  return (
    <section
      className="ent-lever-breakdown mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-5"
      aria-labelledby="lever-breakdown-heading"
    >
      <h3
        id="lever-breakdown-heading"
        className="m-0 text-sm font-semibold text-[var(--text-navy)]"
      >
        Where the opportunity appears concentrated
      </h3>
      <p className="mt-1 mb-4 text-xs leading-relaxed text-[var(--text-muted)]">
        Directional contribution by pricing lever — illustrative split, not additive
        financial math.
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map((row) => (
          <li key={row.id} className="ent-lever-row">
            <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
              <span className="font-medium text-[var(--text-navy)]">{row.label}</span>
              <span className="tabular-nums font-semibold text-[var(--accent-deep)]">
                {row.sharePct}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-mid)] to-[var(--accent-deep)]"
                style={{ width: `${Math.max(row.sharePct, 4)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
