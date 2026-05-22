"use client";

import { useMemo } from "react";
import { ObservedPricingPatternsPanel } from "@/components/panels/ObservedPricingPatternsPanel";
import { DiagnosticHypothesesPanel } from "@/components/DiagnosticHypothesesPanel";
import { Disclosure } from "@/components/Disclosure";
import { DataInterpretationDetail } from "@/components/consultant/DataInterpretationDetail";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { runDiagnosticHypothesisEngine } from "@/lib/hypothesisEngine";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { EprScores } from "@/types/ui";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { InferredCategoryRow } from "@/types/category-scope";

type TechnicalDiagnosticsPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  eprScores: EprScores;
  categoryRoles: InferredCategoryRow[];
  retailerDisplayName: string;
  retailerTicker?: string | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: import("@/types/opportunity-exposure").OpportunityExposureBundle | null;
};

export function TechnicalDiagnosticsPanel({
  knowledgeContext,
  eprScores,
  categoryRoles,
  retailerDisplayName,
  retailerTicker,
  computedEvidence,
  opportunityExposure,
}: TechnicalDiagnosticsPanelProps) {
  const dataset = useMemo(
    () =>
      buildPlaceholderIngestionDataset({
        categoryNames: categoryRoles.map((r) => r.category),
        archetypeId: knowledgeContext.archetypeId,
        retailerTicker: retailerTicker ?? null,
      }),
    [categoryRoles, knowledgeContext.archetypeId, retailerTicker],
  );

  const hypothesisOutput = useMemo(
    () =>
      runDiagnosticHypothesisEngine({
        knowledge: knowledgeContext,
        normalizedFields: dataset.normalizedFields,
        leverUnlocks: dataset.leverUnlocks,
        eprScores,
        evidenceInput: {
          archetypeId: knowledgeContext.archetypeId,
          pricingPosture: knowledgeContext.pricingPosture,
          categoryRows: categoryRoles,
          retailerTicker: retailerTicker ?? null,
          normalizedFields: dataset.normalizedFields,
          detectedColumns: dataset.detectedColumns,
          dataInterpretation: dataset.dataInterpretation,
          retailerDisplayName,
        },
        opportunityExposure: opportunityExposure ?? undefined,
      }),
    [
      knowledgeContext,
      dataset,
      eprScores,
      categoryRoles,
      retailerTicker,
      retailerDisplayName,
      opportunityExposure,
    ],
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--text-muted)]">
        Internal consultant view — pattern inventories, hypotheses, and reference
        material. Not shown in the executive readout.
      </p>

      <DataInterpretationDetail interpretation={dataset.dataInterpretation} />

      <ObservedPricingPatternsPanel
        knowledgeContext={knowledgeContext}
        eprScores={eprScores}
        embedded
        consultantMode
        normalizedFields={dataset.normalizedFields}
        promoMarkdownEligible={computedEvidence?.promoMarkdownEligible ?? false}
      />

      <Disclosure
        title="Hypothesis registry detail"
        summary={`${hypothesisOutput.hypotheses.length} surfaced hypotheses`}
        variant="subtle"
        defaultOpen={false}
      >
        <DiagnosticHypothesesPanel
          output={hypothesisOutput}
          title="Structural hypotheses"
          showArchitectureNote={false}
        />
      </Disclosure>
    </div>
  );
}
