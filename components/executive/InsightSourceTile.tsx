"use client";

import { IllustrativeExamplesPanel } from "@/components/executive/IllustrativeExamplesPanel";
import type { InsightSourceTile as TileModel } from "@/lib/narrativePresentation";

type InsightSourceTileProps = {
  tile: TileModel;
};

function primaryStat(metric: string): string | null {
  const m = metric.match(/~?(\d+(?:\.\d+)?)\s*%/);
  if (m) return `${m[1]}%`;
  const short = metric.trim();
  if (short.length <= 12 && /\d/.test(short)) return short;
  return null;
}

export function InsightSourceTile({ tile }: InsightSourceTileProps) {
  const stat = tile.metric ? primaryStat(tile.metric) : null;
  const observationDetail =
    tile.metric && stat && tile.metric !== stat ? tile.metric : null;
  const implication = tile.implication ?? tile.subtext;

  const isPrimary = tile.emphasis === "primary";
  const isSecondary = tile.emphasis === "secondary";

  return (
    <article
      className={`ent-evidence-tile flex min-h-[6.5rem] flex-col gap-2 rounded-xl border p-4 ${
        isPrimary
          ? "ent-evidence-primary border-[var(--accent-deep)]/35 bg-white shadow-sm ring-1 ring-[var(--accent-deep)]/10"
          : isSecondary
            ? "ent-evidence-secondary border-[var(--accent-deep)]/20 bg-white"
            : "border-[var(--border)] bg-[var(--surface-muted)] opacity-95"
      } ${tile.strength === "strong" && !isPrimary ? "ent-evidence-strong" : ""}`}
    >
      <p className="ent-evidence-label m-0 text-[0.8125rem] font-semibold leading-snug text-[var(--text-navy)]">
        {tile.title}
      </p>

      <div className="ent-evidence-observation">
        <p className="m-0 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {tile.observationLabel ?? "Observation"}
        </p>
        {stat ? (
          <p className="ent-evidence-stat m-0 mt-0.5 text-3xl font-semibold leading-none tracking-tight text-[var(--accent-deep)]">
            {stat}
          </p>
        ) : tile.metric?.trim() ? (
          <p className="ent-evidence-stat ent-evidence-stat-sm m-0 mt-0.5 text-base font-semibold leading-snug text-[var(--accent-deep)]">
            {observationDetail ?? tile.metric}
          </p>
        ) : null}
        {stat && observationDetail && (
          <p className="m-0 mt-0.5 text-[0.6875rem] leading-snug text-[var(--text-muted)]">
            {observationDetail}
          </p>
        )}
      </div>

      {implication && (
        <div className="ent-evidence-implication flex-1">
          <p className="m-0 text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Why it matters
          </p>
          <p className="ent-evidence-sub m-0 mt-0.5 line-clamp-3 text-xs leading-snug text-[var(--text-navy)]">
            {implication}
          </p>
        </div>
      )}

      {tile.benchmarkHint && (
        <span className="ent-chip ent-chip-xs inline-block w-fit rounded border border-[var(--border)] px-2 py-0.5 text-[0.6875rem] text-[var(--text-muted)]">
          {tile.benchmarkHint}
        </span>
      )}
      {tile.illustrativeExamples && tile.illustrativeExamples.length > 0 && (
        <IllustrativeExamplesPanel
          examples={tile.illustrativeExamples}
          disclaimer={tile.illustrationDisclaimer}
        />
      )}
    </article>
  );
}
