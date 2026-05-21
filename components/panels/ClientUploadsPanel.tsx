"use client";

import { useMemo } from "react";
import { Card } from "@/components/Card";
import { DataReadinessPanel } from "@/components/DataReadinessPanel";
import { DiagnosticFrameworkStrip } from "@/components/DiagnosticFrameworkStrip";
import { PocGuardrailBanner } from "@/components/PocGuardrailBanner";
import { RoleInferenceSummaryCard } from "@/components/RoleInferenceSummaryCard";
import type { KnowledgeRegistryContext } from "@/types/knowledge-context";
import { DiagnosticAvailabilityMatrix } from "@/components/DiagnosticAvailabilityMatrix";
import { IngestionUploadSummary } from "@/components/IngestionUploadSummary";
import { MappingConfidenceTable } from "@/components/MappingConfidenceTable";
import { buildPlaceholderIngestionDataset } from "@/lib/buildIngestionPreview";
import { formatReadinessState } from "@/lib/readinessDisplay";

function normalizationLabel(
  status: string,
): "Pending normalization" | "Ready for diagnostic use" {
  if (status === "normalized" || status === "normalization_complete") {
    return "Ready for diagnostic use";
  }
  return "Pending normalization";
}

type ClientUploadsPanelProps = {
  knowledgeContext: KnowledgeRegistryContext;
};

export function ClientUploadsPanel({
  knowledgeContext,
}: ClientUploadsPanelProps) {
  const dataset = useMemo(() => buildPlaceholderIngestionDataset(), []);
  const allMappings = dataset.uploadedFiles.flatMap((f) => f.mappedColumns);
  const evidenceFiles = dataset.uploadedFiles.filter(
    (f) => f.fileType !== "optional_context_document",
  );

  return (
    <div className="space-y-8">
      <PocGuardrailBanner
        title="Evidence & readiness — preview only"
        detail="Upload preview shows how normalized fields unlock pattern features and future diagnostics. Files are not parsed or stored."
        variant="neutral"
      />

      <DiagnosticFrameworkStrip
        context={knowledgeContext}
        workflowLabel="Client Uploads"
      />

      <RoleInferenceSummaryCard
        context={knowledgeContext}
        title="Expected roles while evidence is in preview"
      />

      <Card>
        <p className="micro-label mb-2">Evidence intake</p>
        <h3 className="section-title">Client Uploads</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          Ingestion and normalization scaffolding is active as a deterministic
          preview. Files are not parsed, stored, or persisted. Column matching
          uses exact, synonym, and fuzzy rules only — no AI inference.
        </p>
      </Card>

      <IngestionUploadSummary dataset={dataset} />

      <Card>
        <p className="micro-label mb-2">File status</p>
        <h3 className="section-title">Upload files</h3>
        <div className="mt-4 space-y-4">
          {evidenceFiles.map((file) => (
            <div
              key={file.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--app-bg)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-navy)]">
                    {file.originalFileName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {file.fileType.replace(/_/g, " ")} · Placeholder preview
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">
                  {formatReadinessState(file.readinessState)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--accent-light)] px-2.5 py-0.5 text-xs text-[var(--accent)]">
                  {normalizationLabel(file.normalizationStatus)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Normalization: {file.normalizationStatus.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Detected columns
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--text-navy)]">
                    {file.detectedColumns.length > 0
                      ? file.detectedColumns.join(", ")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Normalized mappings
                  </p>
                  <ul className="mt-1 space-y-1 text-xs text-[var(--text-navy)]">
                    {file.mappedColumns
                      .filter((m) => m.normalizedField)
                      .map((m) => (
                        <li key={m.sourceColumn}>
                          {m.sourceColumn} → {m.normalizedField}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)]">{file.notes}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="micro-label mb-2">Normalized fields</p>
        <h3 className="section-title">Normalized fields (canonical)</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Union of mapped fields across preview files.
        </p>
        <p className="mt-3 font-mono text-sm text-[var(--text-navy)]">
          {dataset.normalizedFields.join(", ") || "None"}
        </p>
      </Card>

      {dataset.normalizationIssues.length > 0 ? (
        <Card>
          <p className="micro-label mb-2">Issues</p>
          <h3 className="section-title">Normalization issues</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--text-muted)]">
            {dataset.normalizationIssues.map((issue, i) => (
              <li key={`${issue.type}-${i}`}>{issue.message}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      <MappingConfidenceTable mappings={allMappings} />

      <DiagnosticAvailabilityMatrix leverUnlocks={dataset.leverUnlocks} />

      <DataReadinessPanel ingestionDataset={dataset} />
    </div>
  );
}
