import type { EnrichmentMeta } from "@/types/context-enrichment";

const STATUS_LABELS: Record<EnrichmentMeta["profileStatus"], string> = {
  unavailable: "No enrichment",
  partial: "Partial context",
  available: "Context available",
  stale: "Stale — refresh recommended",
};

const STATUS_STYLES: Record<EnrichmentMeta["profileStatus"], string> = {
  unavailable: "bg-slate-100 text-slate-700",
  partial: "bg-amber-50 text-amber-900",
  available: "bg-emerald-50 text-emerald-900",
  stale: "bg-orange-50 text-orange-900",
};

type EnrichmentStatusBadgeProps = {
  meta: EnrichmentMeta;
};

export function EnrichmentStatusBadge({ meta }: EnrichmentStatusBadgeProps) {
  const status = meta.profileStatus;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span
        className={`rounded-full px-2.5 py-1 font-semibold ${STATUS_STYLES[status]}`}
      >
        {STATUS_LABELS[status]}
      </span>
      <span className="text-[var(--text-muted)]">{meta.freshnessLabel}</span>
      {meta.errorMessage && (
        <span className="text-[var(--text-muted)]">· {meta.errorMessage}</span>
      )}
    </div>
  );
}
