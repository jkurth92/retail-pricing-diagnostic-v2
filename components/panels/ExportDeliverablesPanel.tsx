"use client";

import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExportPreviewPanel } from "@/components/export/ExportPreviewPanel";
import { RefineDiagnosticPlaceholder } from "@/components/RefineDiagnosticPlaceholder";
import type { StorylineExportTree } from "@/lib/export/storylineExport";
import type { ExportDeliverableBundle } from "@/types/export-system";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type ExportDeliverablesPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  exportBundle: ExportDeliverableBundle;
  storylineExport: StorylineExportTree;
  diagnosticReady: boolean;
};

export function ExportDeliverablesPanel({
  exportBundle,
  storylineExport,
  diagnosticReady,
}: ExportDeliverablesPanelProps) {
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
      <ExportPreviewPanel
        bundle={exportBundle}
        storylineExport={storylineExport}
      />
      <RefineDiagnosticPlaceholder />
    </div>
  );
}
