"use client";

import { useMemo } from "react";
import { Card } from "@/components/Card";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { RationalePanel } from "@/components/RationalePanel";
import { inferRoles } from "@/lib/roleInference";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type RoleInferencePreviewProps = {
  context: KnowledgeRegistryContext;
};

export function RoleInferencePreview({ context }: RoleInferencePreviewProps) {
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
    <div className="space-y-4">
      <Card>
        <p className="micro-label mb-2">Live inference output</p>
        <h3 className="section-title">Rationale & confidence</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Updates when archetype, posture, objectives, or category hint change.
          {result.categoryHint
            ? ` Category: ${result.categoryHint}.`
            : " Add a category hint above."}
        </p>
        {result.appliedRuleId && (
          <p className="mt-2 text-xs font-medium text-[var(--accent)]">
            Rule applied: {result.appliedRuleId}
          </p>
        )}
        <p className="mt-2 text-xs italic text-[var(--text-muted)]">
          {result.overrideNote}
        </p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Suggested category role
            </dt>
            <dd className="mt-1 text-base font-semibold text-[var(--text-navy)]">
              {result.categorySuggestion.roleName}
            </dd>
            <dd className="mt-2">
              <ConfidenceIndicator
                level={result.categorySuggestion.confidence}
                explanation={result.confidenceTemplate?.explanation}
              />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Suggested item role mix
            </dt>
            <dd className="mt-1">
              <ul className="space-y-1 text-sm text-[var(--text-navy)]">
                {result.itemMixSuggestion.mix.map((entry) => (
                  <li key={entry.roleId}>{entry.label}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </Card>

      <RationalePanel
        rationale={result.categorySuggestion.rationale}
        templateName={result.rationaleTemplate?.templateName}
      />
    </div>
  );
}
