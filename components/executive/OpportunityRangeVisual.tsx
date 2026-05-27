"use client";

type OpportunityRangeVisualProps = {
  lowPct: number;
  highPct: number;
  /** Scale maximum for the track (default 3% portfolio cap) */
  maxScalePct?: number;
  /** Signed band (e.g. revenue sensitivity from negative to positive) */
  signed?: boolean;
  midLabel?: string;
  confidenceLabel?: string;
  className?: string;
};

function formatAxisPct(n: number, signed: boolean): string {
  if (!signed) return `${n.toFixed(1)}%`;
  return n > 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`;
}

export function OpportunityRangeVisual({
  lowPct,
  highPct,
  maxScalePct = 3,
  signed = false,
  midLabel,
  confidenceLabel,
  className = "",
}: OpportunityRangeVisualProps) {
  let scaleMin = 0;
  let scaleMax: number;
  let leftPct: number;
  let widthPct: number;

  if (signed) {
    scaleMin = Math.min(0, lowPct) * 1.2 - 0.05;
    scaleMax = Math.max(maxScalePct, highPct * 1.25, Math.abs(lowPct) * 1.25, 0.4);
    const span = scaleMax - scaleMin;
    leftPct = ((lowPct - scaleMin) / span) * 100;
    widthPct = ((highPct - lowPct) / span) * 100;
  } else {
    scaleMax = Math.max(maxScalePct, highPct * 1.15, 0.5);
    leftPct = Math.max(0, (lowPct / scaleMax) * 100);
    widthPct = Math.min(100 - leftPct, ((highPct - lowPct) / scaleMax) * 100);
  }

  const midPct = leftPct + widthPct / 2;
  const label =
    midLabel ??
    (signed
      ? `${formatAxisPct(lowPct, true)} to ${formatAxisPct(highPct, true)}`
      : `${lowPct.toFixed(1)}–${highPct.toFixed(1)}%`);

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
          {label}
        </span>
      </div>
      <div className="dx-range-axis">
        <span>{formatAxisPct(scaleMin, signed)}</span>
        <span>{formatAxisPct(scaleMax, signed)}</span>
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
