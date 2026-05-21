"use client";

import { ExportPreviewPanel } from "@/components/export/ExportPreviewPanel";
import { JourneyContextStrip } from "@/components/JourneyContextStrip";
import type { StorylineExportTree } from "@/lib/export/storylineExport";
import type { ExportDeliverableBundle } from "@/types/export-system";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";

type ExportDeliverablesPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
  exportBundle: ExportDeliverableBundle;
  storylineExport: StorylineExportTree;
};

export function ExportDeliverablesPanel({
  knowledgeContext,
  exportBundle,
  storylineExport,
}: ExportDeliverablesPanelProps) {
  return (
    <div className="panel-stack">
      <JourneyContextStrip
        context={knowledgeContext}
        stepLabel="Executive exports"
      />
      <ExportPreviewPanel
        bundle={exportBundle}
        storylineExport={storylineExport}
      />
    </div>
  );
}
