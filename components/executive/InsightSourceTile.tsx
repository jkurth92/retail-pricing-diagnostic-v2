"use client";

import type { InsightSourceTile as TileModel } from "@/lib/narrativePresentation";

type InsightSourceTileProps = {
  tile: TileModel;
};

function strengthClass(s?: TileModel["strength"]): string {
  if (s === "strong") return "dx-insight-strong";
  if (s === "moderate") return "dx-insight-moderate";
  return "";
}

export function InsightSourceTile({ tile }: InsightSourceTileProps) {
  return (
    <article className={`dx-insight-tile ${strengthClass(tile.strength)}`}>
      <h4 className="dx-insight-tile-title">{tile.title}</h4>
      {tile.metric ? (
        <p className="dx-insight-tile-metric">{tile.metric}</p>
      ) : null}
      <p className="dx-insight-tile-sub">{tile.subtext}</p>
      {tile.benchmarkHint && (
        <span className="dx-hint-chip dx-hint-chip-subtle">{tile.benchmarkHint}</span>
      )}
    </article>
  );
}
