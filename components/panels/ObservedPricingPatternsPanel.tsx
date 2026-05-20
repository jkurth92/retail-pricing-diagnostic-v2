import { Card } from "@/components/Card";
import { PLACEHOLDER_DIAGNOSTIC_OUTPUT } from "@/data/placeholderDiagnosticOutput";
import type { LeverKey } from "@/types/diagnostic-output";

const SECTION_LABELS: Record<LeverKey, string> = {
  kvis: "KVI patterns",
  price_architecture: "Price architecture patterns",
  price_zoning: "Price zoning patterns",
  promotions: "Promotion patterns",
  markdown: "Markdown patterns",
};

export function ObservedPricingPatternsPanel() {
  const { observedPatterns } = PLACEHOLDER_DIAGNOSTIC_OUTPUT;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-[var(--accent)] bg-[var(--accent-light)] px-6 py-5">
        <p className="text-sm font-semibold text-[var(--text-navy)]">
          {observedPatterns.guardrailMessage}
        </p>
      </div>
      {(Object.keys(SECTION_LABELS) as LeverKey[]).map((leverKey) => {
        const section = observedPatterns.sections[leverKey];
        return (
          <Card key={leverKey}>
            <p className="micro-label mb-2">Diagnostic evidence</p>
            <h3 className="section-title">{SECTION_LABELS[leverKey]}</h3>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  Requires upload schema and diagnostic rule alignment
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Evidence
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  {section.evidenceLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Findings
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  {section.findingsLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                  Opportunity impact
                </dt>
                <dd className="mt-1 text-sm text-[var(--text-navy)]">
                  {section.opportunityImpactLabel}
                </dd>
              </div>
            </dl>
          </Card>
        );
      })}
    </div>
  );
}
