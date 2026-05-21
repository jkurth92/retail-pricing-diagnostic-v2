"use client";

import { Disclosure } from "@/components/Disclosure";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { EmailPreviewPanel } from "@/components/export/EmailPreviewPanel";
import { ExecutiveMemoPreview } from "@/components/export/ExecutiveMemoPreview";
import { SlidePreviewPanel } from "@/components/export/SlidePreviewPanel";
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
      title="Executive exports"
      lead="Consulting first drafts — editable DOCX, PPTX, and partner email. Review before client circulation."
    >
      <p className="text-sm leading-relaxed text-[var(--text-muted)]">
        {bundle.guardrailNote}
      </p>

      <div className="mt-6 space-y-6">
        <EmailPreviewPanel email={bundle.email} />
        <ExecutiveMemoPreview memo={bundle.memo} />
        <SlidePreviewPanel presentation={bundle.presentation} />
      </div>

      <Disclosure
        title="Storyline structure (export hierarchy)"
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
