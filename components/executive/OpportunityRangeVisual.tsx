"use client";

type OpportunityRangeVisualProps = {
  lowPct: number;
  highPct: number;
  /** Scale maximum for the track (default 3% portfolio cap) */
  maxScalePct?: number;
  confidenceLabel?: string;
  className?: string;
};

export function OpportunityRangeVisual({
  lowPct,
  highPct,
  maxScalePct = 3,
  confidenceLabel,
  className = "",
}: OpportunityRangeVisualProps) {
  const scale = Math.max(maxScalePct, highPct * 1.15, 0.5);
  const leftPct = Math.max(0, (lowPct / scale) * 100);
  const widthPct = Math.min(100 - leftPct, ((highPct - lowPct) / scale) * 100);
  const midPct = leftPct + widthPct / 2;

  return (
    <div className={`dx-range-visual ${className}`.trim()} aria-hidden={false}>
      <div className="dx-range-track">
        <div className="dx-range-track-bg" />
        <div
          className="dx-range-band"
          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 4)}%` }}
        />
        <span
          className="dx-range-marker dx-range-marker-low"
          style={{ left: `${leftPct}%` }}
          title={`${lowPct}%`}
        />
        <span
          className="dx-range-marker dx-range-marker-high"
          style={{ left: `${leftPct + widthPct}%` }}
          title={`${highPct}%`}
        />
        <span
          className="dx-range-mid-label"
          style={{ left: `${midPct}%` }}
        >
          {lowPct.toFixed(1)}–{highPct.toFixed(1)}%
        </span>
      </div>
      <div className="dx-range-axis">
        <span>0%</span>
        <span>{scale.toFixed(1)}%</span>
      </div>
      {confidenceLabel && (
        <p className="dx-range-confidence">
          <span className="dx-range-confidence-dot" />
          {confidenceLabel}
        </p>
      )}
    </div>
  );
}
