import type { ConfidenceLevel } from "@/types/benchmark-concepts";

const LEVEL_STYLES: Record<
  ConfidenceLevel,
  { label: string; className: string }
> = {
  high: {
    label: "High confidence",
    className: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  medium: {
    label: "Medium confidence",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  low: {
    label: "Low confidence",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

type ConfidenceIndicatorProps = {
  level: ConfidenceLevel;
  explanation?: string;
  compact?: boolean;
};

export function ConfidenceIndicator({
  level,
  explanation,
  compact = false,
}: ConfidenceIndicatorProps) {
  const style = LEVEL_STYLES[level];
  return (
    <div className={compact ? "inline-flex flex-col gap-1" : "space-y-2"}>
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${style.className}`}
      >
        {style.label}
      </span>
      {explanation && !compact && (
        <p className="text-sm text-[var(--text-muted)]">{explanation}</p>
      )}
    </div>
  );
}
