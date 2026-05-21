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
          eyebrow="Step 5"
          title="Executive outputs"
          lead="Partner email, one-page memo, and LOP-ready deck drafts unlock after the diagnostic is generated."
        >
          <p className="text-sm text-[var(--text-muted)]">
            Complete steps 1–3 first, then return here to preview and download
            consulting first drafts.
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
