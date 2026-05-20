import { Card } from "@/components/Card";
import { getSelectedPeerNames } from "@/lib/competitors";
import type { CompetitorEntry } from "@/types/competitors";

type RetailerOverviewPanelProps = {
  retailerName: string;
  competitors: CompetitorEntry[];
};

const FINANCIAL_METRICS = [
  "Revenue",
  "EBITDA",
  "Margin",
  "Working capital / revenue",
] as const;

const PEER_COMPARISON_ROWS = [
  "Revenue growth",
  "Margin",
  "EBITDA growth",
  "Working capital / revenue",
] as const;

const NEWS_PLACEHOLDER_COUNT = 3;

export function RetailerOverviewPanel({
  retailerName,
  competitors,
}: RetailerOverviewPanelProps) {
  const displayName = retailerName.trim() || "Not selected";
  const selectedPeers = getSelectedPeerNames(competitors);

  return (
    <div className="space-y-6">
      <Card>
        <p className="micro-label mb-2">Retailer overview</p>
        <h3 className="section-title">{displayName}</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Ticker
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Pending
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Data status
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Pending external data
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Selected peer count
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {selectedPeers.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Source status
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not connected
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <p className="micro-label mb-2">Financial performance</p>
        <h3 className="section-title">Financial performance</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Best available sourced data. Missing external or uploaded values
          remain not available.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FINANCIAL_METRICS.map((metric) => (
            <div
              key={metric}
              className="rounded-lg border border-[var(--border)] bg-[var(--app-bg)] p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                {metric}
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--text-navy)]">
                Pending external data
              </p>
              <span className="mt-3 inline-block rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                Pending
              </span>
              <div className="mt-4 h-16 rounded-md bg-[var(--border)]/40" />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="micro-label mb-2">Peer comparison</p>
        <h3 className="section-title">Company performance against selected peers</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Peer view will use the selected competitor set after external data
          integration.
        </p>
        <div className="mt-4">
          <p className="text-sm font-medium text-[var(--text-navy)]">
            Selected peers
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {selectedPeers.length > 0
              ? selectedPeers.join(", ")
              : "No peers selected for overview. Select competitors in Client Context."}
          </p>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                <th className="py-2 pr-4">Metric</th>
                <th className="py-2 pr-4">Company</th>
                <th className="py-2 pr-4">Selected peer median</th>
                <th className="py-2">Benchmark source</th>
              </tr>
            </thead>
            <tbody>
              {PEER_COMPARISON_ROWS.map((metric) => (
                <tr
                  key={metric}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-[var(--text-navy)]">
                    {metric}
                  </td>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">Pending</td>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">Pending</td>
                  <td className="py-3 text-[var(--text-muted)]">
                    Pending external data
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <p className="micro-label mb-2">Key insights</p>
        <h3 className="section-title">What the data suggests</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
          <li>
            Insights will populate after external data, uploaded context, and
            diagnostic evidence are available.
          </li>
          <li>
            No AI-generated interpretation is active in this build.
          </li>
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">News and headlines</p>
        <h3 className="section-title">Recent signals to monitor</h3>
        <ul className="mt-4 space-y-3">
          {Array.from({ length: NEWS_PLACEHOLDER_COUNT }).map((_, index) => (
            <li
              key={`news-${index}`}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3"
            >
              <span className="text-sm text-[var(--text-muted)]">
                Headline placeholder {index + 1}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Pending external data integration
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
