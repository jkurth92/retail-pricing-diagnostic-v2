"use client";

import { Card } from "@/components/Card";
import { CANONICAL_FIELD_CATALOG } from "@/data/uploadFieldCatalog";
import type { LeverPatternFeaturesSection, PatternFeature } from "@/types/pattern-features";

const fieldLabel = new Map(
  CANONICAL_FIELD_CATALOG.map((f) => [f.key, f.displayLabel] as const),
);

function statusLabel(status: PatternFeature["status"]): string {
  switch (status) {
    case "not_defined":
      return "Not defined — missing inputs";
    case "defined":
      return "Defined";
    case "pending_alignment":
      return "Pending alignment";
    case "ready_for_engine":
      return "Ready for engine (no calculation yet)";
    default:
      return status;
  }
}

type PatternFeatureLeverCardProps = {
  section: LeverPatternFeaturesSection;
};

export function PatternFeatureLeverCard({ section }: PatternFeatureLeverCardProps) {
  return (
    <Card>
      <p className="micro-label mb-2">Pattern feature inventory</p>
      <h3 className="section-title">{section.label}</h3>
      <p className="mt-2 text-sm font-medium text-[var(--accent)]">
        {section.notes}
      </p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        {section.readinessSummary}
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Feature count
          </dt>
          <dd className="mt-1 text-sm text-[var(--text-navy)]">
            {section.featureCount}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Section status
          </dt>
          <dd className="mt-1 text-sm text-[var(--text-navy)]">
            {statusLabel(section.sectionStatus)}
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

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          Required fields (union)
        </p>
        <p className="mt-1 text-sm text-[var(--text-navy)]">
          {section.requiredFields.length === 0
            ? "None listed"
            : section.requiredFields
                .map((f) => fieldLabel.get(f) ?? f)
                .join(", ")}
        </p>
      </div>

      {section.missingInputs.length > 0 && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Missing inputs in preview
          </p>
          <p className="mt-1 text-sm text-amber-950">
            {section.missingInputs
              .map((f) => fieldLabel.get(f) ?? f)
              .join(", ")}
          </p>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {section.features.map((feature) => (
          <li
            key={feature.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-[var(--text-navy)]">
                {feature.featureName}
              </h4>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]">
                {statusLabel(feature.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {feature.description}
            </p>
            <p className="mt-2 text-xs text-[var(--text-navy)]">
              <span className="font-medium">Calculation (future):</span>{" "}
              {feature.calculationNote}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Output: {feature.outputType} · Value: not calculated
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Fields:{" "}
              {feature.sourceFields
                .map((f) => fieldLabel.get(f) ?? f)
                .join(", ")}
            </p>
            {feature.examples.length > 0 && (
              <p className="mt-1 text-xs italic text-[var(--text-muted)]">
                Examples: {feature.examples.join("; ")}
              </p>
            )}
            {feature.evidenceLinks.length > 0 && (
              <p className="mt-2 text-xs text-[var(--accent)]">
                Evidence: {feature.evidenceLinks.length} linked field
                {feature.evidenceLinks.length === 1 ? "" : "s"} (upload mapping)
              </p>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
