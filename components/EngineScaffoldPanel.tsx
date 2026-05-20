import { Card } from "@/components/Card";
import { RULE_LIBRARY_PLACEHOLDER } from "@/data/ruleLibraryPlaceholder";
import { runDiagnosticEngine } from "@/lib/diagnostic-engine";

type EngineScaffoldPanelProps = {
  runId: string;
  scopeDefined: boolean;
};

export function EngineScaffoldPanel({
  runId,
  scopeDefined,
}: EngineScaffoldPanelProps) {
  const result = runDiagnosticEngine({
    runId,
    scopeDefined,
    uploadsPresent: false,
    rulesApproved: false,
  });
  const library = RULE_LIBRARY_PLACEHOLDER;

  return (
    <Card>
      <p className="micro-label mb-2">Diagnostic engine</p>
      <h3 className="section-title">Engine scaffold</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        {result.message}
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Engine status
          </dt>
          <dd className="mt-1 font-medium text-[var(--text-navy)]">
            Pending alignment
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Opportunity output
          </dt>
          <dd className="mt-1 font-medium text-[var(--text-navy)]">
            Not calculated
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Rule library version
          </dt>
          <dd className="mt-1 text-[var(--text-navy)]">{library.version}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
            Active rules
          </dt>
          <dd className="mt-1 text-[var(--text-navy)]">0 (all disabled)</dd>
        </div>
      </dl>
      <ul className="mt-4 space-y-2">
        {library.rules.map((rule) => (
          <li
            key={rule.id}
            className="rounded-md border border-[var(--border)] bg-[var(--app-bg)] px-3 py-2 text-xs text-[var(--text-muted)]"
          >
            <span className="font-medium text-[var(--text-navy)]">
              {rule.name}
            </span>
            {" — "}
            {rule.status.replace(/_/g, " ")} · Not implemented
          </li>
        ))}
      </ul>
    </Card>
  );
}
