import { trajectoryForComparablePeer } from "@/lib/financePeerResolution";
import type { CompanyProfile, PerformanceTrajectory } from "@/types/company-profile";
import type { FinancePeer } from "@/types/finance-peers";

export type TrajectoryMetricKey =
  | "revenueGrowth"
  | "ebitdaGrowth"
  | "grossMarginBps"
  | "operatingMarginBps"
  | "ebitdaMarginBps";

export type TrajectoryMomentum = "ahead" | "behind" | "inline";

export type TrajectoryRow = {
  metricKey: TrajectoryMetricKey;
  metricLabel: string;
  unit: "pct" | "bps";
  companyValue: number;
  peerMedianValue: number | null;
  companyDisplay: string;
  peerMedianDisplay: string;
  momentumVsPeer: TrajectoryMomentum;
  companyBarPct: number;
  peerBarPct: number;
};

export type MomentumHighlight = {
  label: string;
  value: string;
  subtext: string;
};

const EMPTY_TRAJECTORY: PerformanceTrajectory = {
  revenueGrowthPct: null,
  ebitdaGrowthPct: null,
  grossMarginChangeBps: null,
  operatingMarginChangeBps: null,
  ebitdaMarginChangeBps: null,
};

export function cleanFinanceLabel(text: string | null | undefined): string | null {
  if (!text) return null;
  return text
    .replace(/\s*\(reference\)/gi, "")
    .replace(/~\s*/g, "≈ ")
    .replace(/\s+/g, " ")
    .trim();
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function formatGrowthPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatBps(value: number): string {
  if (Math.abs(value) < 5) return "flat";
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value)} bps`;
}

function formatPeerGrowthPct(value: number | null): string {
  if (value == null) return "—";
  if (Math.abs(value) < 0.05) return "peer median flat";
  return `peer median ${formatGrowthPct(value)}`;
}

function formatPeerBps(value: number | null): string {
  if (value == null) return "—";
  if (Math.abs(value) < 5) return "peer median flat";
  return `peer median ${formatBps(value)}`;
}

function momentumVsPeer(
  company: number,
  peer: number | null,
): TrajectoryMomentum {
  if (peer == null) return "inline";
  const delta = company - peer;
  if (Math.abs(delta) < (Math.abs(company) > 10 ? 0.3 : 5)) return "inline";
  return delta > 0 ? "ahead" : "behind";
}

function barPctFromDelta(value: number, maxAbs: number): number {
  if (maxAbs <= 0) return 8;
  return Math.min(100, Math.max(8, (Math.abs(value) / maxAbs) * 100));
}

function trajectoryFromProfile(profile: CompanyProfile | null): PerformanceTrajectory {
  return profile?.trajectory ?? EMPTY_TRAJECTORY;
}

export function buildMomentumHighlights(
  trajectory: PerformanceTrajectory,
): MomentumHighlight[] {
  const items: MomentumHighlight[] = [];

  if (trajectory.revenueGrowthPct != null) {
    items.push({
      label: "Revenue growth",
      value: formatGrowthPct(trajectory.revenueGrowthPct),
      subtext: "YoY directional",
    });
  }
  if (trajectory.grossMarginChangeBps != null) {
    items.push({
      label: "Gross margin",
      value: formatBps(trajectory.grossMarginChangeBps),
      subtext: "vs prior year",
    });
  }
  if (trajectory.ebitdaMarginChangeBps != null) {
    items.push({
      label: "EBITDA margin",
      value: formatBps(trajectory.ebitdaMarginChangeBps),
      subtext: "vs prior year",
    });
  } else if (trajectory.ebitdaGrowthPct != null) {
    items.push({
      label: "EBITDA growth",
      value: formatGrowthPct(trajectory.ebitdaGrowthPct),
      subtext: "YoY directional",
    });
  }

  return items.slice(0, 3);
}

export function buildTrajectoryRows(
  companyProfile: CompanyProfile | null,
  peers: FinancePeer[],
): TrajectoryRow[] {
  const company = trajectoryFromProfile(companyProfile);
  const included = peers.filter((p) => p.included);
  const peerTrajectories = included
    .map((p) => trajectoryForComparablePeer(p))
    .filter((t): t is PerformanceTrajectory => t !== null);

  const rowDefs: {
    key: TrajectoryMetricKey;
    label: string;
    unit: "pct" | "bps";
    pick: (t: PerformanceTrajectory) => number | null;
    format: (v: number) => string;
    formatPeer: (v: number | null) => string;
  }[] = [
    {
      key: "revenueGrowth",
      label: "Revenue growth",
      unit: "pct",
      pick: (t) => t.revenueGrowthPct,
      format: formatGrowthPct,
      formatPeer: formatPeerGrowthPct,
    },
    {
      key: "ebitdaGrowth",
      label: "EBITDA growth",
      unit: "pct",
      pick: (t) => t.ebitdaGrowthPct,
      format: formatGrowthPct,
      formatPeer: formatPeerGrowthPct,
    },
    {
      key: "grossMarginBps",
      label: "Gross margin change",
      unit: "bps",
      pick: (t) => t.grossMarginChangeBps,
      format: formatBps,
      formatPeer: formatPeerBps,
    },
    {
      key: "operatingMarginBps",
      label: "Operating margin change",
      unit: "bps",
      pick: (t) => t.operatingMarginChangeBps,
      format: formatBps,
      formatPeer: formatPeerBps,
    },
    {
      key: "ebitdaMarginBps",
      label: "EBITDA margin change",
      unit: "bps",
      pick: (t) => t.ebitdaMarginChangeBps,
      format: formatBps,
      formatPeer: formatPeerBps,
    },
  ];

  const draftRows = rowDefs
    .map((def) => {
      const companyVal = def.pick(company);
      if (companyVal == null) return null;
      const peerVals = peerTrajectories
        .map((t) => def.pick(t))
        .filter((v): v is number => v != null);
      const peerMed = median(peerVals);
      return {
        def,
        companyVal,
        peerMed,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const maxAbs = Math.max(
    1,
    ...draftRows.flatMap((r) => [
      Math.abs(r.companyVal),
      Math.abs(r.peerMed ?? 0),
    ]),
  );

  return draftRows.map(({ def, companyVal, peerMed }) => ({
    metricKey: def.key,
    metricLabel: def.label,
    unit: def.unit,
    companyValue: companyVal,
    peerMedianValue: peerMed,
    companyDisplay: def.format(companyVal),
    peerMedianDisplay: def.formatPeer(peerMed),
    momentumVsPeer: momentumVsPeer(companyVal, peerMed),
    companyBarPct: barPctFromDelta(companyVal, maxAbs),
    peerBarPct: barPctFromDelta(peerMed ?? 0, maxAbs),
  }));
}
