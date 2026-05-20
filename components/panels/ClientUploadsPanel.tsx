import { Card } from "@/components/Card";
import { DataReadinessPanel } from "@/components/DataReadinessPanel";
import { UploadFileReadinessCard } from "@/components/UploadFileReadinessCard";
import { UPLOAD_READINESS_MODEL } from "@/data/uploadReadinessModel";

export function ClientUploadsPanel() {
  const model = UPLOAD_READINESS_MODEL;
  const evidenceUploads = model.uploads.filter(
    (u) => u.kind !== "context_documents",
  );

  return (
    <div className="space-y-6">
      <Card>
        <p className="micro-label mb-2">Evidence intake</p>
        <h3 className="section-title">Client Uploads</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          Client uploads will later populate the canonical normalized schema (
          <code className="text-xs">NormalizedPricingRecord</code>). No files are
          parsed, stored, or scored in this build. Readiness cards reflect the
          aligned schema and future normalization path only.
        </p>
        <p className="mt-3 rounded-md border border-[var(--border)] bg-[var(--accent-light)] px-4 py-3 text-sm text-[var(--text-navy)]">
          Pre-implementation: all uploads show{" "}
          <span className="font-medium">not uploaded</span> and{" "}
          <span className="font-medium">pending normalization</span>. See{" "}
          <span className="font-medium">docs/UPLOAD_SCHEMA.md</span> and{" "}
          <span className="font-medium">docs/DATA_READINESS.md</span>.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {evidenceUploads.map((upload) => (
          <UploadFileReadinessCard key={upload.kind} upload={upload} />
        ))}
      </div>
      {model.uploads
        .filter((u) => u.kind === "context_documents")
        .map((upload) => (
          <UploadFileReadinessCard key={upload.kind} upload={upload} />
        ))}
      <DataReadinessPanel />
    </div>
  );
}
