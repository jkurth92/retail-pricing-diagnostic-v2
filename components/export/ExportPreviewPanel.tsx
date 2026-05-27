"use client";

import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ExecutiveMemoPreview } from "@/components/export/ExecutiveMemoPreview";
import type { ExportDeliverableBundle } from "@/types/export-system";
import type { StorylineExportTree } from "@/lib/export/storylineExport";

type ExportPreviewPanelProps = {
  bundle: ExportDeliverableBundle;
  storylineExport: StorylineExportTree;
};

export function ExportPreviewPanel({
  bundle,
  storylineExport,
}: ExportPreviewPanelProps) {
  return (
    <DiagnosticSection
      eyebrow="Deliverables"
      title="Executive memo"
      lead="Discussion-ready memo for leadership — retailer context, pricing observations, implications, and questions. Download as DOCX to refine."
    >
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        {bundle.guardrailNote}
      </p>

      <div className="mt-6">
        <ExecutiveMemoPreview memo={bundle.memo} />
      </div>

      <Disclosure
        title="Storyline structure (reference)"
        defaultOpen={false}
      >
        <ol className="space-y-4">
          {storylineExport.nodes.map((node) => (
            <li
              key={node.sectionId}
              className="rounded-lg border border-[var(--border)] p-4 text-sm"
            >
              <p className="font-semibold text-[var(--text-navy)]">{node.headline}</p>
              <p className="mt-2 text-[var(--text-muted)]">
                <span className="font-medium text-[var(--text-navy)]">
                  Implication:
                </span>{" "}
                {node.implication}
              </p>
              {node.evidence.length > 0 && (
                <p className="mt-2 text-[var(--text-muted)]">
                  <span className="font-medium text-[var(--text-navy)]">
                    Evidence:
                  </span>{" "}
                  {node.evidence.join(" · ")}
                </p>
              )}
              <p className="mt-2 text-[var(--accent)]">{node.opportunity}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Confidence: {node.confidence}
              </p>
            </li>
          ))}
        </ol>
      </Disclosure>

      <Disclosure title="Modular export sections" defaultOpen={false}>
        <ul className="space-y-3 text-sm text-[var(--text-navy)]">
          {bundle.sections.map((section) => (
            <li key={section.sectionTitle} className="border-b border-[var(--border)] pb-3">
              <p className="font-semibold">{section.sectionTitle}</p>
              <p className="mt-1 text-[var(--text-muted)]">{section.summary}</p>
            </li>
          ))}
        </ul>
      </Disclosure>
    </DiagnosticSection>
  );
}
