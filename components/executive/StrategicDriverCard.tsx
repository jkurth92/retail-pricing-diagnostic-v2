"use client";

import type { StrategicDriverCard as DriverModel } from "@/lib/narrativePresentation";

type StrategicDriverCardProps = {
  driver: DriverModel;
};

export function StrategicDriverCard({ driver }: StrategicDriverCardProps) {
  return (
    <article
      className={`dx-driver-card-v2 dx-impact-${driver.impact}`}
    >
      <div className="dx-driver-card-v2-head">
        <h4 className="dx-driver-card-v2-title">{driver.title}</h4>
        <span
          className="dx-impact-bar"
          title={driver.impact === "high" ? "Higher relative impact" : "Supporting driver"}
          aria-hidden
        />
      </div>
      <p className="dx-driver-card-v2-line">{driver.interpretation}</p>
      <div className="dx-driver-card-v2-foot">
        {driver.benchmarkHint && (
          <span className="dx-hint-chip">{driver.benchmarkHint}</span>
        )}
        {driver.confidenceLabel && (
          <span className="dx-hint-chip dx-hint-chip-muted">{driver.confidenceLabel}</span>
        )}
      </div>
    </article>
  );
}
