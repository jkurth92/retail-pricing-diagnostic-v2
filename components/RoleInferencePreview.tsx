"use client";

import { useMemo } from "react";
import { Card } from "@/components/Card";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { RationalePanel } from "@/components/RationalePanel";
import { inferRoles } from "@/lib/roleInference";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type RoleInferencePreviewProps = {
  context: KnowledgeRegistryContext;
  categoryHint: string;
  onCategoryHintChange: (value: string) => void;
};

export function RoleInferencePreview({
  context,
  categoryHint,
  onCategoryHintChange,
}: RoleInferencePreviewProps) {
  const result = useMemo(
    () =>
      inferRoles({
        archetypeId: context.archetypeId,
        pricingPosture: context.pricingPosture,
        strategicObjectives: context.strategicObjectives,
        categoryHint: categoryHint || undefined,
      }),
    [context, categoryHint],
  );

  return (
    <div className="space-y-4">
      <Card>
        <p className="micro-label mb-2">Role inference preview</p>
        <h3 className="section-title">Illustrative structure inference</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Deterministic, explainable preview — not AI and not a pricing
          recommendation. Override when client taxonomy differs.
        </p>
        <div className="mt-4">
          <label
            htmlFor="category-hint"
            className="mb-2 block text-sm font-medium text-[var(--text-navy)]"
          >
            Category hint (e.g. Laundry detergent)
          </label>
          <input
            id="category-hint"
            type="text"
            value={categoryHint}
            onChange={(e) => onCategoryHintChange(e.target.value)}
            placeholder="Laundry detergent"
            className="w-full rounded-md border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-navy)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        {result.appliedRuleId && (
          <p className="mt-2 text-xs text-[var(--accent)]">
            Applied rule: {result.appliedRuleId}
          </p>
        )}
        <p className="mt-2 text-xs italic text-[var(--text-muted)]">
          {result.overrideNote}
        </p>
      </Card>

      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Suggested category role
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--text-navy)]">
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
              <ul className="text-sm text-[var(--text-navy)]">
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
      <RationalePanel
        title="Item mix rationale"
        rationale={result.itemMixSuggestion.rationale}
      />
    </div>
  );
}
