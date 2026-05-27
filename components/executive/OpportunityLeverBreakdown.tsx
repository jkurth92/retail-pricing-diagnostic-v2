"use client";

import type { OpportunityAreaRow } from "@/lib/opportunityLeverAttribution";

type OpportunityLeverBreakdownProps = {
  rows: OpportunityAreaRow[];
};

export function OpportunityLeverBreakdown({ rows }: OpportunityLeverBreakdownProps) {
  if (rows.length === 0) return null;

  const tiers = ["primary", "secondary", "supporting"] as const;

  return (
    <section
      className="ent-lever-breakdown mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-5"
      aria-labelledby="lever-breakdown-heading"
    >
      <h3
        id="lever-breakdown-heading"
        className="m-0 text-sm font-semibold text-[var(--text-navy)]"
      >
        What is driving the opportunity
      </h3>
      <p className="mt-1 mb-5 text-xs leading-relaxed text-[var(--text-muted)]">
        Directional view of where to focus the discussion — not a financial decomposition.
      </p>
      <div className="flex flex-col gap-5">
        {tiers.map((tier) => {
          const tierRows = rows.filter((r) => r.tier === tier);
          if (tierRows.length === 0) return null;
          return (
            <div key={tier}>
              <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--accent-mid)]">
                {tierRows[0].tierLabel}
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {tierRows.map((row) => (
                  <li
                    key={row.id}
                    className="rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm leading-snug text-[var(--text-navy)]"
                  >
                    {row.description}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
