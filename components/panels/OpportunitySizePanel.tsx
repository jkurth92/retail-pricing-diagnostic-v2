import { Card } from "@/components/Card";
import { EngineScaffoldPanel } from "@/components/EngineScaffoldPanel";
import { PLACEHOLDER_DIAGNOSTIC_OUTPUT } from "@/data/placeholderDiagnosticOutput";
import { getSelectedPeerNames } from "@/lib/competitors";
import type { CompetitorCandidate } from "@/types/competitors";
import { LEVER_LABEL_BY_KEY } from "@/types/ui";

type OpportunitySizePanelProps = {
  retailerName: string;
  competitors: CompetitorCandidate[];
  revenueInScopeLabel: string;
  scopeStatusLabel: string;
  selectedLeverLabels: string[];
  scopeDefined: boolean;
  runId: string;
};

export function OpportunitySizePanel({
  retailerName,
  competitors,
  revenueInScopeLabel,
  scopeStatusLabel,
  selectedLeverLabels,
  scopeDefined,
  runId,
}: OpportunitySizePanelProps) {
  const output = PLACEHOLDER_DIAGNOSTIC_OUTPUT;
  const selectedPeers = getSelectedPeerNames(competitors);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-light)] px-6 py-5">
        <p className="text-sm font-semibold text-[var(--text-navy)]">
          No opportunity sizing logic has been implemented yet. Rules,
          benchmarks, thresholds, formulas, and confidence logic require explicit
          alignment before build.
        </p>
      </div>

      <Card>
        <p className="micro-label mb-2">Workflow context</p>
        <h3 className="section-title">Diagnostic context references</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Retailer
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {retailerName.trim() || "Not selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Scope status
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {scopeStatusLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Selected peers
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {selectedPeers.length > 0
                ? selectedPeers.join(", ")
                : "None selected"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Scope levers
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              {selectedLeverLabels.length > 0
                ? selectedLeverLabels.join(", ")
                : "None selected"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Observed pricing patterns
            </dt>
            <dd className="mt-1 text-sm text-[var(--text-navy)]">
              Not generated — pending upload schema and rule alignment
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <p className="micro-label mb-2">Total opportunity</p>
        <h3 className="section-title">Total Opportunity</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Revenue in scope
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              {revenueInScopeLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Low case
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not calculated
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Base case
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not calculated
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              High case
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not calculated
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Opportunity % of revenue
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not calculated
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Overall confidence
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Not assessed
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
              Calculation status
            </dt>
            <dd className="mt-1 text-sm font-medium text-[var(--text-navy)]">
              Pending alignment
            </dd>
          </div>
        </dl>
      </Card>

      <div>
        <p className="micro-label mb-3">Lever breakdown</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {output.leverOpportunities.map((lever) => (
            <div key={lever.leverKey} className="card-surface p-5">
              <h4 className="text-sm font-semibold text-[var(--text-navy)]">
                {LEVER_LABEL_BY_KEY[lever.leverKey]}
              </h4>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Status</dt>
                  <dd className="text-[var(--text-navy)]">Pending alignment</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Opportunity</dt>
                  <dd className="text-[var(--text-navy)]">Not calculated</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Confidence</dt>
                  <dd className="text-[var(--text-navy)]">Not assessed</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Severity</dt>
                  <dd className="text-[var(--text-navy)]">Not assessed</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--text-muted)]">Evidence coverage</dt>
                  <dd className="text-[var(--text-navy)]">
                    {lever.evidenceCoverageLabel}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                Next step: {lever.nextStep}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <p className="micro-label mb-2">Key findings</p>
        <h3 className="section-title">Key Findings</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Findings will appear after diagnostic rules are aligned and the engine
          is implemented.
        </p>
      </Card>

      <Card>
        <p className="micro-label mb-2">Evidence readiness</p>
        <h3 className="section-title">Evidence Readiness</h3>
        <ul className="mt-4 space-y-2 text-sm text-[var(--text-navy)]">
          <li>Client upload evidence: Pending</li>
          <li>User input evidence: Pending</li>
          <li>Public data evidence: Pending</li>
          <li>Benchmark rule evidence: Not configured</li>
          <li>Consultant overrides: Not configured</li>
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">Assumptions</p>
        <h3 className="section-title">Assumptions</h3>
        <ul className="mt-4 space-y-3">
          {output.assumptions.map((assumption) => (
            <li
              key={assumption.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--app-bg)] px-4 py-3 text-sm"
            >
              <span className="font-medium text-[var(--text-navy)]">
                {assumption.label}
              </span>
              <span className="text-[var(--text-muted)]">Requires alignment</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">User overrides</p>
        <h3 className="section-title">User Overrides</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Overrides will become active after the diagnostic engine is
          implemented.
        </p>
        <ul className="mt-4 space-y-3">
          {output.userOverrides.map((override) => (
            <li
              key={override.id}
              className="flex items-center justify-between rounded-lg border border-dashed border-[var(--border)] bg-[var(--app-bg)] px-4 py-3 opacity-70"
            >
              <span className="text-sm text-[var(--text-navy)]">
                {override.label}
              </span>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]"
              >
                Disabled
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="micro-label mb-2">Memo readiness</p>
        <h3 className="section-title">Memo Readiness</h3>
        <ul className="mt-4 space-y-2 text-sm text-[var(--text-navy)]">
          <li>Executive summary: Not ready</li>
          <li>Findings: Not ready</li>
          <li>Evidence: Not ready</li>
          <li>Assumptions: Not ready</li>
          <li>Recommendations: Not ready</li>
        </ul>
      </Card>

      <EngineScaffoldPanel runId={runId} scopeDefined={scopeDefined} />
    </div>
  );
}
