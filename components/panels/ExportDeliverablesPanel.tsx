"use client";

import { useMemo } from "react";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExportPreviewPanel } from "@/components/export/ExportPreviewPanel";
import { RefineDiagnosticPanel } from "@/components/refinement/RefineDiagnosticPanel";
import { buildExportDeliverableBundle } from "@/lib/export/buildExportDeliverables";
import { DEFAULT_EXPORT_MODULARITY } from "@/types/export-system";
import type { RefinedDiagnosticPresentation } from "@/lib/refinementAdjustments";
import type { StorylineExportTree } from "@/lib/export/storylineExport";
import type { ExportDeliverableBundle } from "@/types/export-system";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import type { ComputedEvidenceBundle } from "@/types/evidence-computation";
import type { OpportunityExposureBundle } from "@/types/opportunity-exposure";
import type { FinancePeer } from "@/types/finance-peers";
import type { RetailerEnrichmentBundle } from "@/types/retailer-context";
import type { RefinementState } from "@/types/refinement";
import type { RefinementSliderState } from "@/types/refinement";

type ExportDeliverablesPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  exportBundle: ExportDeliverableBundle;
  storylineExport: StorylineExportTree;
  diagnosticReady: boolean;
  retailerName: string;
  refinementPresentation?: RefinedDiagnosticPresentation | null;
  refinementState: RefinementState;
  onSlidersChange: (sliders: RefinementSliderState) => void;
  onFeedbackChange: (text: string) => void;
  onPreviewRefinement: () => void;
  onApplyRefinement: () => void;
  onResetRefinement: () => void;
  hasPendingRefinementControls: boolean;
  isRefinementPreview: boolean;
  isRefinementApplied: boolean;
  enrichment?: RetailerEnrichmentBundle | null;
  computedEvidence?: ComputedEvidenceBundle | null;
  opportunityExposure?: OpportunityExposureBundle | null;
  financePeers?: FinancePeer[];
  evaluatedRevenuePercent?: number | null;
};

export function ExportDeliverablesPanel({
  exportBundle,
  storylineExport,
  diagnosticReady,
  retailerName,
  refinementPresentation,
  refinementState,
  onSlidersChange,
  onFeedbackChange,
  onPreviewRefinement,
  onApplyRefinement,
  onResetRefinement,
  hasPendingRefinementControls,
  isRefinementPreview,
  isRefinementApplied,
  enrichment,
  computedEvidence,
  opportunityExposure,
  financePeers,
  evaluatedRevenuePercent,
}: ExportDeliverablesPanelProps) {
  const displayBundle = useMemo(() => {
    if (!refinementPresentation?.meta.isUserRefined) {
      return exportBundle;
    }
    const readout = refinementPresentation.readout;
    return buildExportDeliverableBundle(
      readout,
      retailerName,
      DEFAULT_EXPORT_MODULARITY,
      {
        enrichment,
        computedEvidence,
        opportunityExposure,
        financePeers,
        evaluatedRevenuePercent,
      },
    );
  }, [
    exportBundle,
    refinementPresentation,
    retailerName,
    enrichment,
    computedEvidence,
    opportunityExposure,
    financePeers,
    evaluatedRevenuePercent,
  ]);

  if (!diagnosticReady) {
    return (
      <div className="max-w-3xl pilot-panel">
        <DiagnosticSection
          title="Executive outputs"
          lead="Executive discussion memo unlocks after the diagnostic is generated."
        >
          <p className="text-sm text-[var(--text-muted)]">
            Confirm retailer context and scope, generate the diagnostic, then
            return here to preview and download consulting first drafts.
          </p>
        </DiagnosticSection>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12 pilot-panel">
      <RefineDiagnosticPanel
        state={refinementState}
        onSlidersChange={onSlidersChange}
        onFeedbackChange={onFeedbackChange}
        onPreview={onPreviewRefinement}
        onApply={onApplyRefinement}
        onReset={onResetRefinement}
        hasPendingControls={hasPendingRefinementControls}
        isPreview={isRefinementPreview}
        isApplied={isRefinementApplied}
        diagnosticReady={diagnosticReady}
      />
      <ExportPreviewPanel
        bundle={displayBundle}
        storylineExport={storylineExport}
        refinementActive={Boolean(refinementPresentation?.meta.isUserRefined)}
        refinementMode={refinementPresentation?.meta.mode ?? "base"}
      />
    </div>
  );
}
