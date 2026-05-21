import { getArchetype, postureLabel } from "@/lib/archetypeContext";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type HeaderSummaryProps = {
  retailerDisplay: string;
  knowledgeContext?: KnowledgeRegistryContext;
  workflowStepLabel?: string;
  marginOpportunityRange?: string;
  diagnosticReady?: boolean;
};

export function HeaderSummary({
  retailerDisplay,
  knowledgeContext,
  workflowStepLabel,
  marginOpportunityRange,
  diagnosticReady = false,
}: HeaderSummaryProps) {
  const archetype = knowledgeContext
    ? getArchetype(knowledgeContext.archetypeId)
    : undefined;

  return (
    <header className="mb-10 border-b border-[var(--border)] pb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Strategic pricing copilot
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-navy)]">
            {retailerDisplay === "Not selected"
              ? "Pricing diagnostic"
              : retailerDisplay}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
            {diagnosticReady
              ? "Guided diagnostic — review storyline, opportunity, and exports."
              : "Confirm retailer context and scope, then generate your assessment."}
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm lg:text-right">
          {archetype && knowledgeContext && (
            <p className="text-[var(--text-navy)]">
              <span className="text-[var(--text-muted)]">Profile · </span>
              {archetype.archetypeName}
              <span className="text-[var(--text-muted)]"> · </span>
              {postureLabel(knowledgeContext.pricingPosture)}
            </p>
          )}
          {marginOpportunityRange && (
            <p className="font-semibold text-[var(--accent)]">
              {marginOpportunityRange}
            </p>
          )}
          {workflowStepLabel && (
            <p className="text-xs text-[var(--text-muted)]">
              {workflowStepLabel}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
