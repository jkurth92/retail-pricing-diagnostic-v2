"use client";

import type { StrategicDriverCard as DriverModel } from "@/lib/narrativePresentation";

type StrategicDriverCardProps = {
  driver: DriverModel;
};

export function StrategicDriverCard({ driver }: StrategicDriverCardProps) {
  return (
    <article className={`ent-driver-card ent-driver-${driver.impact}`}>
      <div className="ent-driver-top">
        <h3 className="ent-driver-title">{driver.title}</h3>
        <div className="ent-driver-impact" aria-hidden>
          <span
            className="ent-driver-impact-fill"
            style={{ width: driver.impact === "high" ? "100%" : "55%" }}
          />
        </div>
      </div>
      <p className="ent-driver-line">{driver.interpretation}</p>
      <div className="ent-driver-meta">
        {driver.benchmarkHint && (
          <span className="ent-chip ent-chip-xs">{driver.benchmarkHint}</span>
        )}
        {driver.confidenceLabel && (
          <span className="ent-chip ent-chip-xs ent-chip-muted">
            {driver.confidenceLabel}
          </span>
        )}
      </div>
    </article>
  );
}
