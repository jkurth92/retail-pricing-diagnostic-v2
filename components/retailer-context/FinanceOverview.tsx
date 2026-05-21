"use client";

import {
  buildMomentumHighlights,
  buildTrajectoryRows,
  type TrajectoryMomentum,
  type TrajectoryRow,
} from "@/lib/financeBenchmark";
import { summarizeFinancePeers } from "@/lib/financePeerResolution";
import { FinancePeerEditor } from "@/components/retailer-context/FinancePeerEditor";
import type { FinancePeer } from "@/types/finance-peers";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";

type FinanceOverviewProps = {
  enrichment: RetailerEnrichmentBundle;
  companyLabel: string;
  financePeers: FinancePeer[];
  onFinancePeersChange: (peers: FinancePeer[]) => void;
  onAddFinancePeer: (name: string) => void;
};

function momentumLabel(m: TrajectoryMomentum): string {
  if (m === "ahead") return "Ahead of peers";
  if (m === "behind") return "Behind peers";
  return "In line with peers";
}

function MomentumIcon({ momentum }: { momentum: TrajectoryMomentum }) {
  const symbol = momentum === "ahead" ? "↑" : momentum === "behind" ? "↓" : "→";
  return (
    <span className={`rc-trajectory-icon rc-trajectory-icon-${momentum}`} aria-hidden>
      {symbol}
    </span>
  );
}

function MomentumTiles({
  highlights,
}: {
  highlights: ReturnType<typeof buildMomentumHighlights>;
}) {
  if (highlights.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {highlights.map((tile) => (
        <div key={tile.label} className="rc-finance-tile">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {tile.label}
          </p>
          <p className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-navy)]">
            {tile.value}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{tile.subtext}</p>
        </div>
      ))}
    </div>
  );
}

function TrajectoryPanel({
  companyLabel,
  rows,
  peerCount,
  excludedCount,
}: {
  companyLabel: string;
  rows: TrajectoryRow[];
  peerCount: number;
  excludedCount: number;
}) {
  if (peerCount === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        {excludedCount > 0
          ? "Selected peers are not contributing to comparison metrics. See peer labels above for exclusions."
          : "Add at least one peer to compare momentum and trajectory."}
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        Trajectory metrics are not available for this retailer yet.
      </p>
    );
  }

  return (
    <div className="rc-benchmark-panel">
      <div className="rc-benchmark-legend">
        <span className="rc-legend-company">
          <span className="rc-legend-swatch rc-legend-swatch-company" />
          {companyLabel}
        </span>
        <span className="rc-legend-peer">
          <span className="rc-legend-swatch rc-legend-swatch-peer" />
          Peer median ({peerCount})
        </span>
      </div>
      <ul className="mt-6 space-y-5">
        {rows.map((row) => (
          <li key={row.metricKey} className="rc-benchmark-row">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <MomentumIcon momentum={row.momentumVsPeer} />
                <span className="text-sm font-semibold text-[var(--text-navy)]">
                  {row.metricLabel}
                </span>
              </div>
              <span
                className={`rc-trajectory-tag rc-trajectory-tag-${row.momentumVsPeer}`}
              >
                {momentumLabel(row.momentumVsPeer)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold text-[var(--text-navy)]">
                {row.companyDisplay}
              </span>
              <span className="text-[var(--text-muted)]">vs</span>
              <span className="text-[var(--text-muted)]">{row.peerMedianDisplay}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="rc-benchmark-bar-track">
                <div
                  className="rc-benchmark-bar rc-benchmark-bar-company"
                  style={{ width: `${row.companyBarPct}%` }}
                />
              </div>
              <div className="rc-benchmark-bar-track">
                <div
                  className="rc-benchmark-bar rc-benchmark-bar-peer"
                  style={{ width: `${row.peerBarPct}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FinanceOverview({
  enrichment,
  companyLabel,
  financePeers,
  onFinancePeersChange,
  onAddFinancePeer,
}: FinanceOverviewProps) {
  const profile = enrichment.companyProfile;
  const trajectory = profile?.trajectory;
  const highlights = buildMomentumHighlights(trajectory ?? {
    revenueGrowthPct: null,
    ebitdaGrowthPct: null,
    grossMarginChangeBps: null,
    operatingMarginChangeBps: null,
    ebitdaMarginChangeBps: null,
  });
  const rows = buildTrajectoryRows(profile, financePeers);
  const { contributingCount, excludedCount } = summarizeFinancePeers(financePeers);

  return (
    <section className="rc-panel-card space-y-8">
      <div>
        <p className="rc-eyebrow">Performance context</p>
        <h4 className="rc-section-title">Momentum & trajectory</h4>
        <p className="rc-card-lead mt-1">
          Directional growth and margin movement for pricing narrative — not a
          forecast or scale comparison.
        </p>
        <div className="mt-5">
          <MomentumTiles highlights={highlights} />
        </div>
      </div>

      <div>
        <p className="rc-eyebrow">Relative performance</p>
        <h4 className="rc-section-title">Versus selected peer set</h4>
        <p className="rc-card-lead mt-1">
          Growth % and margin change (bps) against peer median. Peers are
          enrichment only and do not affect the diagnostic.
        </p>
        <div className="mt-4">
          <FinancePeerEditor
            peers={financePeers}
            onPeersChange={onFinancePeersChange}
            onAddPeer={onAddFinancePeer}
          />
        </div>
        <div className="mt-6">
          <TrajectoryPanel
            companyLabel={companyLabel}
            rows={rows}
            peerCount={contributingCount}
            excludedCount={excludedCount}
          />
        </div>
      </div>
    </section>
  );
}
