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
      className={`ent-evidence-tile ${
        isPrimary
          ? "ent-evidence-primary"
          : isSecondary
            ? "ent-evidence-secondary"
            : "ent-evidence-supporting"
      } ${tile.strength === "strong" && !isPrimary ? "ent-evidence-strong" : ""}`}
    >
      <header className="ent-evidence-tile-header">
        <p className="ent-evidence-tile-title">{tile.title}</p>
      </header>

      <div className="ent-evidence-tile-body">
        <div className="ent-evidence-observation">
          <p className="ent-evidence-eyebrow">
            {tile.observationLabel ?? "What we noticed"}
          </p>
          {stat ? (
            <p className="ent-evidence-stat">{stat}</p>
          ) : tile.metric?.trim() ? (
            <p className="ent-evidence-stat ent-evidence-stat-sm">
              {observationDetail ?? tile.metric}
            </p>
          ) : null}
          {stat && observationDetail && (
            <p className="ent-evidence-metric-detail">{observationDetail}</p>
          )}
        </div>

        {implication && (
          <div className="ent-evidence-implication">
            <p className="ent-evidence-eyebrow">Why this matters</p>
            <p className="ent-evidence-implication-text">{implication}</p>
          </div>
        )}
      </div>

      {tile.benchmarkHint && (
        <span className="ent-chip ent-chip-xs ent-evidence-chip">{tile.benchmarkHint}</span>
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
