"use client";

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
  const subMetric =
    tile.metric && stat && tile.metric !== stat ? tile.metric : null;

  return (
    <article
      className={`ent-evidence-tile flex min-h-[6.5rem] flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 ${
        tile.strength === "strong" ? "ent-evidence-strong border-[var(--accent-deep)]/25 bg-white" : ""
      }`}
    >
      <p className="ent-evidence-label m-0 text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
        {tile.title}
      </p>
      {stat ? (
        <p className="ent-evidence-stat m-0 mt-1 text-3xl font-semibold leading-none tracking-tight text-[var(--accent-deep)]">
          {stat}
        </p>
      ) : subMetric ? (
        <p className="ent-evidence-stat ent-evidence-stat-sm m-0 text-lg font-semibold text-[var(--accent-deep)]">
          {subMetric}
        </p>
      ) : null}
      <p className="ent-evidence-sub m-0 mt-1 line-clamp-2 flex-1 text-xs leading-snug text-[var(--text-muted)]">
        {tile.subtext}
      </p>
      {tile.benchmarkHint && (
        <span className="ent-chip ent-chip-xs mt-2 inline-block w-fit rounded border border-[var(--border)] px-2 py-0.5 text-[0.6875rem] text-[var(--text-muted)]">
          {tile.benchmarkHint}
        </span>
      )}
    </article>
  );
}
