"use client";

import type { PricingOpportunityDriver } from "@/lib/opportunityDriverSynthesis";
import type { OpportunityAreaRow } from "@/lib/opportunityLeverAttribution";

type OpportunityLeverBreakdownProps = {
  drivers?: PricingOpportunityDriver[];
  /** @deprecated Legacy tiered lever rows — used only when drivers are absent */
  rows?: OpportunityAreaRow[];
};

export function OpportunityLeverBreakdown({
  drivers,
  rows = [],
}: OpportunityLeverBreakdownProps) {
  if (drivers && drivers.length > 0) {
    const n = drivers.length;
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
        <p className="mt-1 mb-4 text-sm leading-relaxed text-[var(--text-navy)]">
          The pricing opportunity appears to be driven by {n} factor
          {n === 1 ? "" : "s"}:
        </p>
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {drivers.map((d, i) => (
            <li
              key={d.id}
              className="rounded-lg border border-[var(--border)] bg-white px-4 py-3"
            >
              <p className="m-0 text-sm font-semibold text-[var(--text-navy)]">
                {i + 1}. {d.title}
              </p>
              <p className="mt-2 mb-0 text-sm leading-relaxed text-[var(--text-muted)]">
                {d.explanation}
              </p>
              <p className="mt-2 mb-0 text-sm text-[var(--text-navy)]">
                <span className="font-medium">Examples:</span> {d.examples.join(", ")}
              </p>
              <p className="mt-2 mb-0 text-sm leading-relaxed text-[var(--text-navy)]">
                <span className="font-medium">Implication:</span> {d.implication}
              </p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

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
