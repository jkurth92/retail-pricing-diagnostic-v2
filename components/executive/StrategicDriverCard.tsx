"use client";

import type { StrategicDriverCard as DriverModel } from "@/lib/narrativePresentation";

type StrategicDriverCardProps = {
  driver: DriverModel;
};

export function StrategicDriverCard({ driver }: StrategicDriverCardProps) {
  return (
    <article
      className={`ent-driver-card ent-driver-${driver.impact} rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 transition-shadow hover:shadow-md ${
        driver.impact === "high" ? "border-l-[3px] border-l-[var(--accent-deep)] bg-white" : ""
      }`}
    >
      <div className="ent-driver-top mb-2 flex items-start justify-between gap-3">
        <h3 className="ent-driver-title m-0 text-[0.9375rem] font-semibold leading-snug text-[var(--text-navy)]">
          {driver.title}
        </h3>
        <div
          className="ent-driver-impact h-1 w-11 shrink-0 overflow-hidden rounded-full bg-[var(--accent-light)]"
          aria-hidden
        >
          <span
            className="ent-driver-impact-fill block h-full rounded-full bg-gradient-to-r from-[var(--accent-mid)] to-[var(--accent-deep)]"
            style={{ width: driver.impact === "high" ? "100%" : "55%" }}
          />
        </div>
      </div>
      <p className="ent-driver-line m-0 line-clamp-2 text-[0.8125rem] leading-relaxed text-[var(--text-muted)]">
        {driver.interpretation}
      </p>
      {(driver.benchmarkHint || driver.confidenceLabel) && (
        <div className="ent-driver-meta mt-3 flex flex-wrap gap-2">
          {driver.benchmarkHint && (
            <span className="ent-chip ent-chip-xs rounded bg-[var(--accent-soft)]/60 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--accent-deep)]">
              {driver.benchmarkHint}
            </span>
          )}
          {driver.confidenceLabel && (
            <span className="ent-chip ent-chip-xs ent-chip-muted rounded bg-[var(--surface-muted)] px-2 py-0.5 text-[0.6875rem] capitalize text-[var(--text-muted)]">
              {driver.confidenceLabel}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
