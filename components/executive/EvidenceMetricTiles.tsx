"use client";

import {
  parseEvidenceMetricLine,
  type ParsedEvidenceMetric,
} from "@/lib/executiveUxHelpers";

type EvidenceMetricTilesProps = {
  metrics: string[];
  max?: number;
};

function strengthClass(strength?: ParsedEvidenceMetric["strength"]): string {
  if (strength === "strong") return "dx-strength-strong";
  if (strength === "moderate") return "dx-strength-moderate";
  if (strength === "weak") return "dx-strength-weak";
  return "";
}

export function EvidenceMetricTiles({ metrics, max = 6 }: EvidenceMetricTilesProps) {
  const parsed = metrics.slice(0, max).map(parseEvidenceMetricLine);

  return (
    <ul className="dx-evidence-tiles">
      {parsed.map((m) => (
        <li key={`${m.label}-${m.value}`} className="dx-evidence-tile">
          <span className="dx-evidence-tile-label">{m.label}</span>
          {m.value ? (
            <span className={`dx-evidence-tile-value ${strengthClass(m.strength)}`}>
              {m.value}
              {m.strength && (
                <span className="dx-strength-dot" title={m.strength} />
              )}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
