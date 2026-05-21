"use client";

import { Disclosure } from "@/components/Disclosure";
import type {
  RetailerEnrichmentBundle,
  RetailerEnrichmentOverrides,
} from "@/types/retailer-context";

type RetailerContextEditorProps = {
  enrichment: RetailerEnrichmentBundle;
  manualTicker: string;
  onManualTickerChange: (value: string) => void;
  onOverridesChange: (overrides: RetailerEnrichmentOverrides) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

const fieldClass =
  "w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-navy)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

export function RetailerContextEditor({
  enrichment,
  manualTicker,
  onManualTickerChange,
  onOverridesChange,
  onRefresh,
  isRefreshing = false,
}: RetailerContextEditorProps) {
  const { context } = enrichment;

  const updateField = (key: keyof RetailerEnrichmentOverrides, value: string) => {
    onOverridesChange({
      ...enrichment.manualOverrides,
      [key]: value || null,
    });
  };

  return (
    <Disclosure
      title="Edit retailer context (manual override)"
      summary="Manual values take precedence over API and reference data"
      variant="subtle"
    >
      <div className="space-y-4">
        <p className="text-xs text-[var(--text-muted)]">
          Overrides apply immediately and supersede enriched fields. Diagnostic
          engines still use client uploads and knowledge inputs as the core
          source of truth.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Ticker (optional)
            </label>
            <input
              type="text"
              value={manualTicker}
              onChange={(e) => onManualTickerChange(e.target.value.toUpperCase())}
              placeholder="e.g. WMT"
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Company overview
            </label>
            <input
              type="text"
              value={context.companyOverview ?? ""}
              onChange={(e) => updateField("companyOverview", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Revenue (display)
            </label>
            <input
              type="text"
              value={context.revenue ?? ""}
              onChange={(e) => updateField("revenue", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Market cap (display)
            </label>
            <input
              type="text"
              value={context.marketCap ?? ""}
              onChange={(e) => updateField("marketCap", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Store count (display)
            </label>
            <input
              type="text"
              value={context.storeCount ?? ""}
              onChange={(e) => updateField("storeCount", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Geography
            </label>
            <input
              type="text"
              value={context.geography ?? ""}
              onChange={(e) => updateField("geography", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Banner portfolio
            </label>
            <input
              type="text"
              value={context.bannerPortfolio ?? ""}
              onChange={(e) => updateField("bannerPortfolio", e.target.value)}
              className={fieldClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-[var(--text-navy)]">
              Strategic notes
            </label>
            <textarea
              rows={3}
              value={context.notes.join("\n")}
              onChange={(e) =>
                onOverridesChange({
                  ...enrichment.manualOverrides,
                  notes: e.target.value
                    .split("\n")
                    .map((n) => n.trim())
                    .filter(Boolean),
                })
              }
              className={fieldClass}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-md border border-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing…" : "Refresh enrichment"}
        </button>
      </div>
    </Disclosure>
  );
}
