import { Card } from "@/components/Card";
import { StatusPill } from "@/components/StatusPill";
import { getArchetype, postureLabel } from "@/lib/archetypeContext";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type HeaderSummaryProps = {
  retailerDisplay: string;
  knowledgeContext?: KnowledgeRegistryContext;
  workflowStepLabel?: string;
  marginOpportunityRange?: string;
};

export function HeaderSummary({
  retailerDisplay,
  knowledgeContext,
  workflowStepLabel,
  marginOpportunityRange,
}: HeaderSummaryProps) {
  const archetype = knowledgeContext
    ? getArchetype(knowledgeContext.archetypeId)
    : undefined;

  return (
    <Card className="mb-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-navy)]">
              Retail Pricing Diagnostic
            </h1>
            <span className="rounded-full border border-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--accent)]">
              POC
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Consulting-style diagnostic cockpit: ontology, pattern features, and
            hypothesis scaffolding — not live pricing recommendations.
          </p>
        </div>
        <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          <StatusPill label="Retailer" value={retailerDisplay} />
          {archetype && knowledgeContext ? (
            <>
              <StatusPill
                label="Archetype"
                value={archetype.archetypeName}
              />
              <StatusPill
                label="Posture"
                value={postureLabel(knowledgeContext.pricingPosture)}
              />
            </>
          ) : (
            <StatusPill label="Framework" value="Not configured" />
          )}
          <StatusPill
            label="Step"
            value={workflowStepLabel ?? "Workflow"}
          />
          <StatusPill label="Engine" value="Scaffold only" />
          <StatusPill
            label="Margin theme"
            value={marginOpportunityRange ?? "Thematic"}
          />
        </div>
      </div>
    </Card>
  );
}
