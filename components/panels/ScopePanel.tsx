"use client";

import { useMemo } from "react";
import { Card } from "@/components/Card";
import { DiagnosticFrameworkStrip } from "@/components/DiagnosticFrameworkStrip";
import { PocGuardrailBanner } from "@/components/PocGuardrailBanner";
import { RoleInferenceSummaryCard } from "@/components/RoleInferenceSummaryCard";
import { calculateAddressableRevenue, parseNumericInput } from "@/lib/scopeMath";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { LeverKey } from "@/types/diagnostic-output";
import type { ScopeDefinition } from "@/types/scope";
import {
  CATEGORY_CHIP_OPTIONS,
  DIAGNOSTIC_LEVERS,
  LEVER_KEY_BY_LABEL,
  LEVER_LABEL_BY_KEY,
  type DiagnosticLever,
} from "@/types/ui";

type ScopePanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  retailerName: string;
  selectedPeerCount: number;
  totalRevenueInput: string;
  addressablePercentInput: string;
  revenueInScopeInput: string;
  includedCategories: string[];
  excludedCategories: string[];
  selectedLeverKeys: Set<LeverKey>;
  onTotalRevenueChange: (value: string) => void;
  onAddressablePercentChange: (value: string) => void;
  onRevenueInScopeChange: (value: string) => void;
  onToggleIncludedCategory: (category: string) => void;
  onToggleExcludedCategory: (category: string) => void;
  onToggleLever: (leverKey: LeverKey) => void;
};

function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ScopePanel({
  knowledgeContext,
  retailerName,
  selectedPeerCount,
  totalRevenueInput,
  addressablePercentInput,
  revenueInScopeInput,
  includedCategories,
  excludedCategories,
  selectedLeverKeys,
  onTotalRevenueChange,
  onAddressablePercentChange,
  onRevenueInScopeChange,
  onToggleIncludedCategory,
  onToggleExcludedCategory,
  onToggleLever,
}: ScopePanelProps) {
  const totalRevenue = parseNumericInput(totalRevenueInput);
  const addressablePercent = parseNumericInput(addressablePercentInput);
  const addressableValue = calculateAddressableRevenue(
    totalRevenue,
    addressablePercent,
  );

  const scopeSummary: ScopeDefinition = useMemo(() => {
    const hasRevenueInputs =
      totalRevenue !== null &&
      addressablePercent !== null &&
      revenueInScopeInput.trim() !== "";
    const hasCategoryInputs =
      includedCategories.length > 0 || excludedCategories.length > 0;
    const status =
      hasRevenueInputs && selectedLeverKeys.size > 0
        ? hasCategoryInputs
          ? "scope_defined"
          : "scope_defined"
        : "needs_inputs";

    return {
      retailerName: retailerName || null,
      totalRetailerRevenue: totalRevenue,
      addressableRevenuePercentage: addressablePercent,
      addressableRevenueValue: addressableValue,
      revenueInDiagnosticScope: parseNumericInput(revenueInScopeInput),
      categoriesIncluded: includedCategories,
      categoriesExcluded: excludedCategories,
      categoryItems: [],
      selectedLeverKeys: Array.from(selectedLeverKeys),
      selectedCompetitorCount: selectedPeerCount,
      status,
      scopeMathNote:
        "Scope values define the sizing denominator. They do not calculate opportunity.",
    };
  }, [
    addressablePercent,
    addressableValue,
    excludedCategories,
    includedCategories,
    retailerName,
    revenueInScopeInput,
    selectedLeverKeys,
    selectedPeerCount,
    totalRevenue,
  ]);

  const inputClassName =
    "w-full max-w-md rounded-md border border-[var(--border)] px-4 py-2.5 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

  return (
    <div className="space-y-8">
      <PocGuardrailBanner
        title="Scope of diagnostic — denominator only"
        detail="Revenue and lever scope define the sizing denominator. Opportunity ranges elsewhere are illustrative placeholders, not calculated."
        variant="neutral"
      />

      <DiagnosticFrameworkStrip
        context={knowledgeContext}
        workflowLabel="Scope"
      />

      <RoleInferenceSummaryCard
        context={knowledgeContext}
        title="Role structure informing scope categories"
      />

      <Card>
        <p className="micro-label mb-2">Revenue scope</p>
        <h3 className="section-title">Revenue scope</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {scopeSummary.scopeMathNote}
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-navy)]">
              Total retailer revenue
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={totalRevenueInput}
              onChange={(e) => onTotalRevenueChange(e.target.value)}
              placeholder="e.g. 24000000000"
              className={inputClassName}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-navy)]">
              Addressable revenue percentage
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={addressablePercentInput}
              onChange={(e) => onAddressablePercentChange(e.target.value)}
              placeholder="e.g. 65"
              className={inputClassName}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-navy)]">
              Addressable revenue value
            </label>
            <p className="rounded-md border border-[var(--border)] bg-[var(--app-bg)] px-4 py-2.5 text-sm text-[var(--text-navy)]">
              {formatCurrency(addressableValue)}
              <span className="ml-2 text-xs text-[var(--text-muted)]">
                (total × addressable %)
              </span>
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-navy)]">
              Revenue in diagnostic scope
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={revenueInScopeInput}
              onChange={(e) => onRevenueInScopeChange(e.target.value)}
              placeholder="e.g. 12000000000"
              className={inputClassName}
            />
          </div>
        </div>
      </Card>

      <Card>
        <p className="micro-label mb-2">Category scope</p>
        <h3 className="section-title">Category scope</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Select categories to include or exclude. Category revenue is not
          inferred automatically.
        </p>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-[var(--text-navy)]">
            Categories included
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_CHIP_OPTIONS.map((category) => {
              const active = includedCategories.includes(category);
              return (
                <button
                  key={`include-${category}`}
                  type="button"
                  onClick={() => onToggleIncludedCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-[var(--text-navy)]">
            Categories excluded
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_CHIP_OPTIONS.map((category) => {
              const active = excludedCategories.includes(category);
              return (
                <button
                  key={`exclude-${category}`}
                  type="button"
                  onClick={() => onToggleExcludedCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    active
                      ? "border-[var(--text-navy)] bg-[var(--text-navy)] text-white"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-dashed border-[var(--border)] bg-[var(--app-bg)] px-5 py-4 text-sm text-[var(--text-muted)]">
          Category revenue if known and category notes — requires alignment
          before implementation.
        </div>
      </Card>

      <Card>
        <p className="micro-label mb-2">Lever scope</p>
        <h3 className="section-title">Lever scope</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          {DIAGNOSTIC_LEVERS.map((lever: DiagnosticLever) => {
            const leverKey = LEVER_KEY_BY_LABEL[lever];
            return (
              <label
                key={lever}
                className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-navy)]"
              >
                <input
                  type="checkbox"
                  checked={selectedLeverKeys.has(leverKey)}
                  onChange={() => onToggleLever(leverKey)}
                  className="h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                {lever}
              </label>
            );
          })}
        </div>
        <p className="mt-6 rounded-md border border-[var(--border)] bg-[var(--accent-light)] px-4 py-3 text-sm text-[var(--text-navy)]">
          Diagnostic rules and benchmark assumptions will be configured after
          alignment.
        </p>
      </Card>

      <Card>
        <p className="micro-label mb-2">Scope summary</p>
        <h3 className="section-title">Scope summary</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Retailer
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {scopeSummary.retailerName ?? "Not selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Selected competitors
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {scopeSummary.selectedCompetitorCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Addressable revenue %
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {scopeSummary.addressableRevenuePercentage ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Revenue in scope
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {formatCurrency(scopeSummary.revenueInDiagnosticScope)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Included categories
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {includedCategories.length > 0
                ? includedCategories.join(", ")
                : "None selected"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Excluded categories
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {excludedCategories.length > 0
                ? excludedCategories.join(", ")
                : "None selected"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Selected levers
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {scopeSummary.selectedLeverKeys
                .map((key) => LEVER_LABEL_BY_KEY[key])
                .join(", ") || "None selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Status
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {scopeSummary.status === "scope_defined"
                ? "Scope defined"
                : "Needs inputs"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
