"use client";

import type { InsightSourceTile as TileModel } from "@/lib/narrativePresentation";

type InsightSourceTileProps = {
  tile: TileModel;
};

/** Pull a prominent stat from metric string for display (presentation only). */
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
    <article className={`ent-evidence-tile ${tile.strength ? `ent-evidence-${tile.strength}` : ""}`}>
      <p className="ent-evidence-label">{tile.title}</p>
      {stat ? (
        <p className="ent-evidence-stat">{stat}</p>
      ) : subMetric ? (
        <p className="ent-evidence-stat ent-evidence-stat-sm">{subMetric}</p>
      ) : null}
      <p className="ent-evidence-sub">{tile.subtext}</p>
      {tile.benchmarkHint && (
        <span className="ent-chip ent-chip-xs">{tile.benchmarkHint}</span>
      )}
    </article>
  );
}
