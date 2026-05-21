"use client";

import { useMemo } from "react";
import {
  getArchetype,
  postureLabel,
} from "@/lib/archetypeContext";
import { inferRoles } from "@/lib/roleInference";
import { STRATEGIC_OBJECTIVES } from "@/types/knowledge-client";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type DiagnosticFrameworkStripProps = {
  context: KnowledgeRegistryContext;
  workflowLabel?: string;
};

export function DiagnosticFrameworkStrip({
  context,
  workflowLabel,
}: DiagnosticFrameworkStripProps) {
  const archetype = getArchetype(context.archetypeId);
  const inference = useMemo(
    () =>
      inferRoles({
        archetypeId: context.archetypeId,
        pricingPosture: context.pricingPosture,
        strategicObjectives: context.strategicObjectives,
        categoryHint: context.categoryHint,
      }),
    [context],
  );

  const objectiveLabels = context.strategicObjectives
    .map((id) => STRATEGIC_OBJECTIVES.find((o) => o.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="card-surface overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="micro-label">Current context</p>
          {workflowLabel && (
            <span className="text-xs font-medium text-[var(--accent)]">
              {workflowLabel}
            </span>
          )}
        </div>
      </div>
      <div className="grid gap-0 divide-y divide-[var(--border)] sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        <div className="px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Archetype
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-navy)]">
            {archetype?.archetypeName ?? context.archetypeId}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Pricing posture
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-navy)]">
            {postureLabel(context.pricingPosture)}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Strategic objectives
          </p>
          <p className="mt-1 text-sm text-[var(--text-navy)]">
            {objectiveLabels.length > 0
              ? objectiveLabels.join(" · ")
              : "None selected"}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Inferred structure
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-navy)]">
            {inference.categorySuggestion.roleName}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {context.categoryHint
              ? `Category: ${context.categoryHint}`
              : "Add category hint on Client Context"}
          </p>
        </div>
      </div>
    </div>
  );
}
