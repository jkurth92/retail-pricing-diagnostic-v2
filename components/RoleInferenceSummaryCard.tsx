"use client";

import { useMemo } from "react";
import { Card } from "@/components/Card";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { inferRoles } from "@/lib/roleInference";
import { ITEM_ROLE_BY_ID } from "@/data/itemRoles";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type RoleInferenceSummaryCardProps = {
  context: KnowledgeRegistryContext;
  title?: string;
};

export function RoleInferenceSummaryCard({
  context,
  title = "Inferred role structure",
}: RoleInferenceSummaryCardProps) {
  const result = useMemo(
    () =>
      inferRoles({
        archetypeId: context.archetypeId,
        pricingPosture: context.pricingPosture,
        strategicObjectives: context.strategicObjectives,
        categoryHint: context.categoryHint,
      }),
    [context],
  );

  return (
    <Card>
      <p className="micro-label mb-2">Category roles</p>
      <h3 className="section-title">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Likely role structure for this retailer — overrideable, not SKU-level
        assignment.
      </p>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Category role
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--text-navy)]">
            {result.categorySuggestion.roleName}
          </p>
          <div className="mt-3">
            <ConfidenceIndicator
              level={result.categorySuggestion.confidence}
              compact
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-navy)]">
            {result.categorySuggestion.rationale}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Item role mix (illustrative %)
          </p>
          <ul className="mt-3 space-y-2">
            {result.itemMixSuggestion.mix.map((entry) => (
              <li
                key={entry.roleId}
                className="flex justify-between gap-2 text-sm text-[var(--text-navy)]"
              >
                <span>
                  {ITEM_ROLE_BY_ID.get(entry.roleId)?.roleName ?? entry.roleId}
                </span>
                <span className="font-medium text-[var(--accent)]">
                  {entry.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            {result.itemMixSuggestion.rationale}
          </p>
        </div>
      </div>
    </Card>
  );
}
