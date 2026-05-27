"use client";

import { useMemo, useState } from "react";
import { formatExecutiveCurrency } from "@/lib/formatExecutiveCurrency";
import {
  calculateAddressableRevenue,
  parseNumericInput,
} from "@/lib/scopeMath";

type ScopeRevenueSectionProps = {
  retailerName: string;
  totalRevenueInput: string;
  addressablePercentInput: string;
  revenueFromProfile: boolean;
  onTotalRevenueChange: (value: string) => void;
  onAddressablePercentChange: (value: string) => void;
};

export function ScopeRevenueSection({
  retailerName,
  totalRevenueInput,
  addressablePercentInput,
  revenueFromProfile,
  onTotalRevenueChange,
  onAddressablePercentChange,
}: ScopeRevenueSectionProps) {
  const [editingTotal, setEditingTotal] = useState(false);
  const showTotalAsDisplay = revenueFromProfile && !editingTotal;
  const totalRevenue = parseNumericInput(totalRevenueInput);
  const addressablePercent = parseNumericInput(addressablePercentInput);
  const addressableValue = calculateAddressableRevenue(
    totalRevenue,
    addressablePercent,
  );

  const totalDisplay = useMemo(
    () => formatExecutiveCurrency(totalRevenue),
    [totalRevenue],
  );
  const addressableDisplay = useMemo(
    () => formatExecutiveCurrency(addressableValue),
    [addressableValue],
  );
  const inScopeDisplay = addressableDisplay;

  return (
    <section className="scope-revenue">
      <h3 className="text-base font-semibold text-[var(--text-navy)]">
        Revenue in scope
      </h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        {revenueFromProfile
          ? `From ${retailerName || "retailer"} public profile. Adjust addressable % only if needed.`
          : "Enter total revenue when no public profile is available."}
      </p>

      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Total revenue
          </p>
          {showTotalAsDisplay ? (
            <>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-navy)]">
                {totalDisplay}
              </p>
              <button
                type="button"
                onClick={() => setEditingTotal(true)}
                className="mt-2 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                Edit value
              </button>
            </>
          ) : (
            <input
              type="text"
              inputMode="decimal"
              value={totalRevenueInput}
              onChange={(e) => onTotalRevenueChange(e.target.value)}
              placeholder="e.g. 69600000000"
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm"
            />
          )}
        </div>
        <div>
          <label
            htmlFor="scope-addressable-percent"
            className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
          >
            Addressable %
          </label>
          <div className="mt-2 flex items-baseline gap-1.5">
            <input
              id="scope-addressable-percent"
              type="text"
              inputMode="decimal"
              value={addressablePercentInput}
              onChange={(e) => onAddressablePercentChange(e.target.value)}
              placeholder="65"
              aria-label="Addressable percent of revenue"
              className="scope-addressable-input w-[5.5rem] min-w-[5.5rem] rounded-lg border-2 border-[color-mix(in_srgb,var(--accent-deep)_28%,var(--border))] bg-white px-3 py-2.5 text-center text-2xl font-semibold tabular-nums leading-none tracking-tight text-[var(--accent-deep)] shadow-[0_2px_8px_rgba(26,53,104,0.08)] transition-[border-color,box-shadow] focus:border-[var(--accent-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            />
            <span className="text-lg font-semibold text-[var(--text-muted)]">%</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Revenue evaluated
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-navy)]">
            {addressableDisplay}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Used in this assessment
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--accent)]">
            {inScopeDisplay}
          </p>
        </div>
      </div>
    </section>
  );
}
